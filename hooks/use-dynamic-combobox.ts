import { useState, useEffect, useTransition, useRef } from "react";
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
  const [inputValue, setInputValue] = useState(value);
  const debouncedInputValue = useDebounce(inputValue, debounceDelay); // Usando o hook de debounce
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

  // Sincroniza inputValue com value externo
  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

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
        onChange(response.data.name);
        setInputValue(response.data.name);
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
    onChange(option.name);
    setInputValue(option.name);
    setOpen(false);
  };

  const handleDelete = async (optionId: string, optionName: string) => {
    setIsLoading(true);
    try {
      const { isUsed } = await api.checkUsage(optionName);

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

        if (value === optionName) {
          onChange("");
          setInputValue("");
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
    setOpen,
    inputValue,
    setInputValue,
    options,
    isLoading,
    handleCreateNew,
    handleSelect,
    handleDelete,
  };
}
