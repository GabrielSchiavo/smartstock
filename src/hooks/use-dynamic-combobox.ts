import { useState, useEffect, useTransition, useRef, useCallback } from "react";
import { ComboboxApiParams, OptionProps, ToastType } from "@/types";
import { showToast } from "@/components/utils/show-toast";
import { useDebounce } from "@/hooks/use-debounce";

export function useDynamicCombobox(
  api: ComboboxApiParams,
  resourceName: string,
  value: string = "",
  onChange: (value: string) => void,
  debounceDelay: number = 300
) {
  const apiRef = useRef(api);
  const nameRef = useRef(resourceName);

  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isUserTyping, setIsUserTyping] = useState(false);
  const debouncedInputValue = useDebounce(inputValue, debounceDelay);
  const [options, setOptions] = useState<OptionProps[]>([]);
  const [, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // sempre que o pai passar um novo api ou resourceName,
  // atualiza o ref, mas não dispara o useEffect abaixo
  useEffect(() => {
    apiRef.current = api;
    nameRef.current = resourceName;
  }, [api, resourceName]);

  // Função para carregar opções iniciais
  const loadInitialOptions = useCallback(async () => {
    if (!value || options.length > 0) return;
    
    setIsLoading(true);
    try {
      const response = await apiRef.current.getAll({});
      if (response?.success) {
        setOptions(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error("Erro ao carregar opções iniciais:", error);
    } finally {
      setIsLoading(false);
    }
  }, [value, options.length]);

  // Carrega opções iniciais se necessário
  useEffect(() => {
    if (value && options.length === 0 && !open) {
      loadInitialOptions();
    }
  }, [value, options.length, loadInitialOptions, open]);

  // Sincroniza inputValue com o name da opção selecionada (apenas quando não está digitando)
  useEffect(() => {
    if (isUserTyping || open) return; // Não interfere quando usuário está digitando ou popover está aberto
    
    if (value && options.length > 0) {
      const selectedOption = options.find(option => option.id === value);
      if (selectedOption) {
        setInputValue(selectedOption.name as string);
      }
    } else if (!value) {
      setInputValue("");
    }
  }, [value, options, isUserTyping, open]);

  // Carrega opções quando o popover abre ou quando inputValue muda
  useEffect(() => {
    if (!open) return;
    // aborta requisição anterior
    abortControllerRef.current?.abort();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    let isMounted = true;

    const fetchOptions = async () => {
      setIsLoading(true);
      try {
        const response = !debouncedInputValue
          ? await apiRef.current.getAll({ signal: controller.signal })
          : await apiRef.current.search(debouncedInputValue, {
              signal: controller.signal,
            });

        if (!isMounted || controller.signal.aborted) return;

        if (response?.success) {
          startTransition(() => {
            setOptions(Array.isArray(response.data) ? response.data : []);
          });
        } else {
          setOptions([]);
          showToast({
            title: "Erro!",
            description: response.description || "A operação falhou.",
            type: ToastType.ERROR,
          });
        }
      } catch (error) {
        if (!isMounted) return;
        setOptions([]);
        console.error("Erro ao carregar opções:", error);
        showToast({
          title: "Erro!",
          description: `Erro ao carregar ${nameRef.current}s.`,
          type: ToastType.ERROR,
        });
      } finally {
        if (isMounted && !controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    startTransition(fetchOptions);

    return () => {
      isMounted = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [open, debouncedInputValue]);

  // Handler personalizado para mudanças no input
  const handleInputValueChange = (newValue: string | null) => {
    setInputValue(newValue as string);
    setIsUserTyping(true);
  };

  // Handler para quando o popover abre
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    
    if (newOpen) {
      // Quando abre, prepara o input com o valor atual se houver seleção
      if (value && options.length > 0) {
        const selectedOption = options.find(option => option.id === value);
        if (selectedOption) {
          setInputValue(selectedOption.name as string);
        }
      }
      setIsUserTyping(false);
    } else {
      // Quando fecha, para de considerar que está digitando
      setIsUserTyping(false);
      // Se não há seleção, limpa o input
      if (!value) {
        setInputValue("");
      }
    }
  };

  const handleCreateNew = async () => {
    if (!inputValue) return;

    setIsLoading(true);
    try {
      const response = await api.create(inputValue);

      if (response.success && response.data) {
        showToast({
          title: "Sucesso!",
          description: `${resourceName} criado com sucesso.`,
          type: ToastType.SUCCESS,
        });
        onChange(response.data.id as string);
        setInputValue(response.data.name as string);
        setIsUserTyping(false);
        setOpen(false);

        const updatedResponse = await api.getAll({
          signal: abortControllerRef.current?.signal,
        });
        if (updatedResponse.success) {
          setOptions(updatedResponse.data || []);
        }
      } else {
        showToast({
          title: "Erro!",
          description: response.description || `Erro ao criar ${resourceName}.`,
          type: ToastType.ERROR,
        });
      }
    } catch (error) {
      console.error("Algo deu errado:", error);
      showToast({
        title: "Erro!",
        description: "Algo deu errado:",
        type: ToastType.ERROR,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (option: OptionProps) => {
    onChange(option.id as string);
    setInputValue(option.name as string);
    setIsUserTyping(false);
    setOpen(false);
  };

  const handleDelete = async (optionId: string) => {
    setIsLoading(true);
    try {
      const { isUsed } = await api.checkUsage(optionId);

      if (isUsed) {
        showToast({
          title: "Aviso!",
          description: `Este ${resourceName} está em uso e não pode ser excluído.`,
          type: ToastType.WARNING,
        });
        return;
      }

      const response = await api.delete(optionId);

      if (response.success) {
        showToast({
          title: "Sucesso!",
          description:
            response.description || `${resourceName} excluído com sucesso.`,
          type: ToastType.SUCCESS,
        });

        if (value === optionId) {
          onChange("");
          setInputValue("");
          setIsUserTyping(false);
        }
        const updatedResponse = await api.getAll({
          signal: abortControllerRef.current?.signal,
        });
        if (updatedResponse.success) {
          setOptions(updatedResponse.data || []);
        }
      } else {
        showToast({
          title: "Erro!",
          description: response.description || "Erro ao excluir registro.",
          type: ToastType.ERROR,
        });
      }
    } catch (error) {
      console.error("Algo deu errado:", error);
      showToast({
        title: "Erro!",
        description: "Algo deu errado.",
        type: ToastType.ERROR,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    open,
    setOpen: handleOpenChange,
    inputValue,
    setInputValue: handleInputValueChange,
    options,
    isLoading,
    handleCreateNew,
    handleSelect,
    handleDelete,
  };
}