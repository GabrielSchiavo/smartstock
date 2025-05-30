import { useState, useEffect, useTransition } from "react";
import { toast } from "sonner";
import { ComboboxApiParams, OptionProps } from "@/types";

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
        // Removido .trim() e adicionado verificação de string vazia
        const results = !inputValue
          ? await api.getAll()
          : await api.search(inputValue);

        if (!isMounted) return;

        if (results?.success) {
          setOptions(Array.isArray(results.data) ? results.data : []);
        } else {
          toast.error(results?.message || "A operação falhou", {
            description: results?.error || "Ocorreu um erro desconhecido",
          });
          setOptions([]);
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('Error loading options:', error);
        const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
        toast.error(`Falha ao carregar ${resourceName}s`, { description: errorMessage });
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
    // Removido .trim() - agora verifica apenas se há valor
    if (!inputValue) return;

    setIsLoading(true);
    try {
      const result = await api.create(inputValue);

      if (result.success && result.data) {
        toast.success(`${resourceName} criado com sucesso`);
        onChange(result.data.name);
        setInputValue(result.data.name);
        setOpen(false);

        const updatedResults = await api.getAll();
        if (updatedResults.success) {
          setOptions(updatedResults.data || []);
        }
      } else {
        toast.error(result.message || `Falha ao criar ${resourceName}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao criar";
      toast.error("Erro inesperado", { description: errorMessage });
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
      const { isUsed, message } = await api.checkUsage(optionName);

      if (isUsed) {
        toast.warning("Não é possível excluir", {
          description: message || `Este ${resourceName} está em uso`,
        });
        return;
      }

      const result = await api.delete(optionId);

      if (result.success) {
        toast.success(result.message || `${resourceName} excluído com sucesso`);
        if (value === optionName) {
          onChange("");
          setInputValue("");
        }
        const updatedResults = await api.getAll();
        if (updatedResults.success) {
          setOptions(updatedResults.data || []);
        }
      } else {
        toast.error(result.message || "Falha na exclusão");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao excluir";
      toast.error("Erro inesperado", { description: errorMessage });
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