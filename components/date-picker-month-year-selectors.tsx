// date-picker-form.tsx
import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ControllerRenderProps, FieldValues, Path } from "react-hook-form";
import { cn } from "@/lib/utils";

interface DatePickerFormProps<T extends FieldValues> {
  field: ControllerRenderProps<T, Path<T>>;
  disabled?: boolean;
}

export function DatePickerMonthYear<T extends FieldValues>({
  field,
  disabled = false,
}: DatePickerFormProps<T>) {
  const [open, setOpen] = React.useState(false);
  const initialDate = field.value as Date | undefined;
  const [currentMonth, setCurrentMonth] = React.useState<number>(
    initialDate?.getMonth() ?? new Date().getMonth()
  );
  const [currentYear, setCurrentYear] = React.useState<number>(
    initialDate?.getFullYear() ?? new Date().getFullYear()
  );

  // Gerar anos para o seletor
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  // Mapear nomes dos meses
  const monthNames = Array.from({ length: 12 }, (_, i) =>
    format(new Date(currentYear, i, 1), "MMMM", { locale: ptBR })
  );

  // Atualizar mês/ano quando a data muda
  React.useEffect(() => {
    if (field.value) {
      const date = field.value as Date;
      setCurrentMonth(date.getMonth());
      setCurrentYear(date.getFullYear());
    }
  }, [field.value]);

  const handleDateSelect = (date: Date | undefined) => {
    field.onChange(date);
    if (date) {
      setOpen(false); // Fecha o popover após selecionar uma data
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          size="sm"
          disabled={disabled}
          className={cn(
            "pl-3 text-left font-normal",
            !field.value && "text-muted-foreground"
          )}
        >
          {field.value ? (
            format(field.value as Date, "dd/MM/yyyy", { locale: ptBR })
          ) : (
            <span>Selecione uma data</span>
          )}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3 flex gap-4 flex-col">
        <div className="flex justify-between gap-4">
          <Select
            value={currentMonth.toString()}
            onValueChange={(value) => {
              const month = parseInt(value);
              setCurrentMonth(month);
              if (field.value) {
                const newDate = new Date(field.value as Date);
                newDate.setMonth(month);
                field.onChange(newDate);
              }
            }}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Mês" />
            </SelectTrigger>
            <SelectContent>
              {monthNames.map((month, index) => (
                <SelectItem key={month} value={index.toString()}>
                  {month.charAt(0).toUpperCase() + month.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={currentYear.toString()}
            onValueChange={(value) => {
              const year = parseInt(value);
              setCurrentYear(year);
              if (field.value) {
                const newDate = new Date(field.value as Date);
                newDate.setFullYear(year);
                field.onChange(newDate);
              }
            }}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Calendar
          className="flex justify-center p-0"
          mode="single"
          selected={field.value as Date | undefined}
          onSelect={handleDateSelect}
          month={new Date(currentYear, currentMonth)}
          onMonthChange={(date) => {
            setCurrentMonth(date.getMonth());
            setCurrentYear(date.getFullYear());
          }}
          disabled={disabled}
          locale={ptBR}
        />
      </PopoverContent>
    </Popover>
  );
}
