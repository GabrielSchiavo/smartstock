import { useState, useEffect, useTransition } from "react";
import { ComboboxApiParams, OptionProps, ToastType } from "@/types";
import { showToast } from "@/components/utils/show-toast";

export function useDynamicCombobox(
  api: ComboboxApiParams,
  resourceName: string,
  value: string = "",
  onChange: (value: string) => void
) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [options, setOptions] = useState<OptionProps[]>([]);
  const [, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  // Sincroniza inputValue com value externo
  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  // Carrega opções quando o popover abre ou quando inputValue muda
  useEffect(() => {
    let isMounted = true;

    const fetchOptions = async () => {
      if (!open) return;

      setIsLoading(true);
      try {
        const response = !inputValue
          ? await api.getAll()
          : await api.search(inputValue);

        if (!isMounted) return;

        if (response?.success) {
          setOptions(Array.isArray(response.data) ? response.data : []);
        } else {
          showToast({
            title: "Erro!",
            description: response.description || "A operação falhou.",
            type: ToastType.ERROR,
          });
          setOptions([]);
        }
      } catch (error) {
        if (!isMounted) return;
        console.error("Erro ao carregar opções:", error);
        showToast({
          title: "Erro!",
          description: `Erro ao carregar ${resourceName}s.`,
          type: ToastType.ERROR,
        });
        setOptions([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    startTransition(fetchOptions);

    return () => {
      isMounted = false;
    };
  }, [open, inputValue, api, resourceName]);

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

        const updatedResponse = await api.getAll();
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
          description: response.description || `${resourceName} excluído com sucesso.`,
          type: ToastType.SUCCESS,
        });

        if (value === optionName) {
          onChange("");
          setInputValue("");
        }
        const updatedResponse = await api.getAll();
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
