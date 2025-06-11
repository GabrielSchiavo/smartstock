import * as React from "react";
import { FieldValues } from "react-hook-form";
import { DatePickerFormProps } from "@/types";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { FormControl } from "../ui/form";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { ptBR } from "date-fns/locale";
import { formatDateToLocale } from "@/lib/date-utils";

function formatDate(date: Date | undefined) {
  if (!date) return "";
  return formatDateToLocale(date);
}

function isValidDate(date: Date | undefined) {
  return date instanceof Date && !isNaN(date.getTime());
}

export function DatePickerShadcnTest<T extends FieldValues>({
  field,
  disabled = false,
}: DatePickerFormProps<T>) {
  const [open, setOpen] = React.useState(false);

  // Inicializa `date` com `field.value`, garantindo que seja uma data válida
  const [date, setDate] = React.useState<Date | undefined>(
    isValidDate(field.value) ? field.value : undefined
  );

  const [month, setMonth] = React.useState<Date | undefined>(date);

  const [, setValue] = React.useState(formatDate(date));

  // Atualiza `date` e `value` quando `field.value` mudar
  React.useEffect(() => {
    if (isValidDate(field.value)) {
      setDate(field.value);
      setValue(formatDate(field.value));
    }
  }, [field.value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant={"outline"}
            size={"sm"}
            disabled={disabled}
            className={cn(
              "w-[240px] pl-3 text-left font-normal",
              !field.value && "text-muted-foreground"
            )}
          >
            {field.value && isValidDate(field.value) ? (
              formatDate(field.value) // Exibe com UTC
            ) : (
              <span>Selecione uma data</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          className="bg-popover"
          mode="single"
          selected={
            date
              ? new Date(
                  date.getTime() +
                    date.getTimezoneOffset() * 60000
                )
              : undefined
          }
          captionLayout="dropdown"
          month={month}
          onMonthChange={setMonth}
          onSelect={(selectedDate) => {
            if (isValidDate(selectedDate)) {
              setDate(selectedDate);
              setValue(selectedDate!.toISOString());
              field.onChange(selectedDate);
              setOpen(false);
            }
          }}
          disabled={disabled}
          locale={ptBR}
          fromYear={2000}
          toYear={new Date().getFullYear() + 10}
        />
      </PopoverContent>
    </Popover>
  );
}
