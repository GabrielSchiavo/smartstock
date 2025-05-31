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
import { MoonLoader } from "react-spinners";
import { BaseComboboxProps } from "@/types";

export function BaseCombobox({
  value,
  placeholder = "Pesquisar...",
  displayValue,
  disabled,
  open,
  setOpen,
  inputValue,
  setInputValue,
  options,
  isPending,
  allowCreate,
  allowDelete,
  handleCreateNew,
  handleSelect,
  handleDelete,
  className,
  resourceName,
}: BaseComboboxProps) {
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="truncate">
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
          size={"sm"}
        >
          {displayValue}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 max-w-[90vw]">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={placeholder}
            value={inputValue}
            onValueChange={setInputValue}
            className={className}
          />
          <CommandList className="p-1">
            {isPending ? (
              <CommandEmpty className="h-[50px] flex items-center justify-center p-0">
                <MoonLoader size={24} color="#71717b" />
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
                          className="p-1.5! h-fit opacity-0 group-hover:opacity-100 hover:bg-destructive/10!"
                          disabled={isPending}
                          title={`Excluir ${resourceName}`}
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