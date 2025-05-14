'use client'

import { useState, useEffect, useRef, useTransition } from 'react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Check, ChevronsUpDown, Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { searchSubgroups, createSubgroup, getAllSubgroups, deleteSubgroup, checkSubgroupInProducts } from '@/actions/subgroups-list'
import { toast } from "sonner";
import { BeatLoader } from 'react-spinners'

interface Option {
  id: string
  name: string
}

interface DynamicComboboxProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  allowCreate?: boolean
  allowDelete?: boolean
  disabled: boolean
}

export function DynamicComboboxSubgroups({
  value,
  onChange,
  placeholder = 'Search...',
  allowCreate = true,
  allowDelete = true,
  disabled
}: DynamicComboboxProps) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [options, setOptions] = useState<Option[]>([])
  const [isPending, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)

  // Load all options when popover opens
useEffect(() => {
  if (open) {
    startTransition(async () => {
      try {
        const results = inputValue.trim() === ''
          ? await getAllSubgroups()
          : await searchSubgroups(inputValue);

        if (results.success) {
          setOptions(results.data || []); // Fallback to empty array if undefined
        } else {
          toast.error(results.message || 'Operation failed', {
            description: results.error || 'An unknown error occurred'
          });
          setOptions([]); // Reset to empty array on error
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        toast.error('Failed to load subgroups', {
          description: errorMessage
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
        toast.success('Subgroup created successfully');
        onChange(result.data.name);
        setInputValue(result.data.name);
        setOpen(false);
        
        const updatedResults = await getAllSubgroups();
        if (updatedResults.success) {
          setOptions(updatedResults.data || []);
        } else {
          toast.error(updatedResults.message || 'Failed to refresh subgroups', {
            description: updatedResults.error || 'Could not load updated subgroup list'
          });
        }
      } else {
        toast.error(result.message || 'Failed to create subgroup', {
          description: result.error || 'Please try again'
        });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while creating the subgroup';
      toast.error('Unexpected error', {
        description: errorMessage
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
        toast.warning('Cannot delete', {
          description: message || 'This subgroup is associated with products'
        });
        return;
      }
      
      const result = await deleteSubgroup(optionId);
      
      if (result.success) {
        toast.success(result.message || 'Subgroup deleted successfully');
        if (value === optionName) {
          onChange('');
          setInputValue('');
        }
        const updatedResults = await getAllSubgroups();
        if (updatedResults.success) {
          setOptions(updatedResults.data || []);
        }
      } else {
        toast.error(result.message || 'Deletion failed', {
          description: result.error || 'Could not delete the subgroup'
        });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while processing your request';
      toast.error('Unexpected error', {
        description: errorMessage
      });
    }
  });
};

const displayValue = value 
  ? options.find((option) => option.name === value)?.name || value 
  : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {displayValue}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command shouldFilter={false}>
          <CommandInput
            ref={inputRef}
            placeholder={placeholder}
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList className='p-1'>
            {isPending ? (
              <CommandEmpty className='flex justify-center p-0'>
                <BeatLoader className='p-2' color='#71717b' />
              </CommandEmpty>
            ) : (
              <>
                {options.length === 0 && (
                  <CommandEmpty className='p-0'>
                    {allowCreate && inputValue.trim() ? (
                      <Button
                        variant={"ghost"}
                        size={'sm'}
                        onClick={handleCreateNew}
                        className="flex items-center w-full p-2 gap-2 text-sm text-muted-foreground hover:bg-accent justify-start"
                        disabled={isPending}
                      >
                        <Plus className="h-4 w-4" />
                        Create <span className='text-foreground'>{inputValue}</span>
                      </Button>
                    ) : (
                      <div className='text-center p-1.5'>
                        <span className='text-sm text-muted-foreground'>
                          No results found...
                        </span>
                      </div>
                    )}
                  </CommandEmpty>
                )}
                <CommandGroup className='p-0'>
                  {options.map((option) => (
                    <CommandItem
                      key={option.id}
                      value={option.name}
                      onSelect={() => handleSelect(option)}
                      className="group flex justify-between items-center"
                    >
                      <div className="flex items-center">
                        <Check
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
                          size={'sm'}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(option.id, option.name)
                          }}
                          className="p-1! h-fit  opacity-0 group-hover:opacity-100 hover:bg-accent"
                          disabled={isPending}
                          title="Delete this option"
                        >
                          <Trash2 className="text-destructive h-4 w-4" />
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
  )
}