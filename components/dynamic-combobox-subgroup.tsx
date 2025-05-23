"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CheckIcon, ChevronsUpDownIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  searchSubgroups,
  createSubgroup,
  getAllSubgroups,
  deleteSubgroup,
  checkSubgroupInProducts,
} from "@/actions/subgroup";
import { toast } from "sonner";
import { BeatLoader } from "react-spinners";

interface Option {
  id: string;
  name: string;
}

interface DynamicComboboxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  allowCreate?: boolean;
  allowDelete?: boolean;
  disabled: boolean;
  className?: string;
}

export function DynamicComboboxSubgroup({
  value,
  onChange,
  placeholder = "Pesquisar...",
  allowCreate = true,
  allowDelete = true,
  disabled,
  className,
}: DynamicComboboxProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<Option[]>([]);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  // Load all options when popover opens
  useEffect(() => {
    if (open) {
      startTransition(async () => {
        try {
          const results =
            inputValue.trim() === ""
              ? await getAllSubgroups()
              : await searchSubgroups(inputValue);

          if (results.success) {
            setOptions(results.data || []); // Fallback to empty array if undefined
          } else {
            toast.error(results.message || "A operação falhou", {
              description: results.error || "Ocorreu um erro desconhecido",
            });
            setOptions([]); // Reset to empty array on error
          }
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Ocorreu um erro desconhecido";
          toast.error("Falha ao carregar subgrupos", {
            description: errorMessage,
          });
          setOptions([]);
        }
      });
    }
  }, [open, inputValue]);

  const handleCreateNew = async () => {
    if (!inputValue.trim() || !allowCreate) return;

    startTransition(async () => {
      try {
        const result = await createSubgroup(inputValue);

        if (result.success && result.data) {
          toast.success("Subgrupo criado com sucesso");
          onChange(result.data.name);
          setInputValue(result.data.name);
          setOpen(false);

          const updatedResults = await getAllSubgroups();
          if (updatedResults.success) {
            setOptions(updatedResults.data || []);
          } else {
            toast.error(
              updatedResults.message || "Falha ao atualizar subgrupos",
              {
                description:
                  updatedResults.error ||
                  "Não foi possível carregar a lista de subgrupos atualizada",
              }
            );
          }
        } else {
          toast.error(result.message || "Falha ao criar subgrupo", {
            description: result.error || "Por favor, tente novamente",
          });
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Ocorreu um erro ao criar o subgrupo";
        toast.error("Erro inesperado", {
          description: errorMessage,
        });
      }
    });
  };

  const handleSelect = (option: Option) => {
    onChange(option.name);
    setInputValue(option.name);
    setOpen(false);
  };

  const handleDelete = async (optionId: string, optionName: string) => {
    startTransition(async () => {
      try {
        const { isUsed, message } = await checkSubgroupInProducts(optionName);

        if (isUsed) {
          toast.warning("Não é possível excluir", {
            description: message || "Este subgrupo está associado a produtos",
          });
          return;
        }

        const result = await deleteSubgroup(optionId);

        if (result.success) {
          toast.success(result.message || "Subgrupo excluído com sucesso");
          if (value === optionName) {
            onChange("");
            setInputValue("");
          }
          const updatedResults = await getAllSubgroups();
          if (updatedResults.success) {
            setOptions(updatedResults.data || []);
          }
        } else {
          toast.error(result.message || "Falha na exclusão", {
            description: result.error || "Não foi possível excluir o subgrupo",
          });
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Ocorreu um erro ao processar sua solicitação";
        toast.error("Erro inesperado", {
          description: errorMessage,
        });
      }
    });
  };

  const displayValue = value
    ? options.find((option) => option.name === value)?.name || value
    : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="truncate">
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {displayValue}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50   absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0  max-w-[90vw]">
        <Command shouldFilter={false}>
          <CommandInput
            ref={inputRef}
            placeholder={placeholder}
            value={inputValue}
            onValueChange={setInputValue}
            className={className}
          />
          <CommandList className="p-1">
            {isPending ? (
              <CommandEmpty className="flex justify-center p-0">
                <BeatLoader className="p-2" color="#71717b" />
              </CommandEmpty>
            ) : (
              <>
                {options.length === 0 && (
                  <CommandEmpty className="p-0">
                    {allowCreate && inputValue.trim() ? (
                      <Button
                        variant={"ghost"}
                        size={"sm"}
                        onClick={handleCreateNew}
                        className="flex items-center w-full p-2 gap-2 text-sm text-muted-foreground hover:bg-accent justify-start"
                        disabled={isPending}
                      >
                        <PlusIcon className="h-4 w-4" />
                        Criar{" "}
                        <span className="text-foreground">{inputValue}</span>
                      </Button>
                    ) : (
                      <div className="text-center p-1.5">
                        <span className="text-sm text-muted-foreground">
                          Nenhum resultado encontrado...
                        </span>
                      </div>
                    )}
                  </CommandEmpty>
                )}
                <CommandGroup className="p-0 overflow-auto">
                  {options.map((option) => (
                    <CommandItem
                      key={option.id}
                      value={option.name}
                      onSelect={() => handleSelect(option)}
                      className="group flex justify-between items-center py-1"
                    >
                      <div className="flex items-center">
                        <CheckIcon
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === option.name ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {option.name}
                      </div>
                      {allowDelete && (
                        <Button
                          variant={"ghost"}
                          size={"sm"}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(option.id, option.name);
                          }}
                          className="p-1.5! h-fit  opacity-0 group-hover:opacity-100 hover:bg-destructive/10!"
                          disabled={isPending}
                          title="Delete this option"
                        >
                          <Trash2Icon className="text-destructive h-4 w-4" />
                        </Button>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
