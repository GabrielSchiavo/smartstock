// date-picker-form.tsx
import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
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
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FieldValues } from "react-hook-form";
import { cn } from "@/lib/utils";
import { DatePickerFormProps, LocaleType } from "@/types";
import { formatInTimeZone, toDate } from "date-fns-tz";

// Função alternativa para converter data local para UTC
const localToUTC = (date: Date): Date => {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    )
  );
};

export function DatePickerMonthYear<T extends FieldValues>({
  field,
  disabled = false,
}: DatePickerFormProps<T>) {
  const [open, setOpen] = React.useState(false);

  // Converter a data UTC para o fuso horário local para exibição
  const initialDate = field.value
    ? toDate(field.value as Date | string, { timeZone: LocaleType.UTC })
    : undefined;

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
      const date = toDate(field.value as Date | string, {
        timeZone: LocaleType.UTC,
      });
      setCurrentMonth(date.getMonth());
      setCurrentYear(date.getFullYear());
    }
  }, [field.value]);

  const handleDateSelect = (date: Date | undefined) => {
    // Converter a data selecionada para UTC antes de salvar
    const utcDate = date ? localToUTC(date) : undefined;
    field.onChange(utcDate);
    if (date) {
      setOpen(false);
    }
  };

  // Função para formatar a data em UTC
  const formatUTCDate = (date: Date | string | undefined) => {
    if (!date) return <span>Selecione uma data</span>;

    return formatInTimeZone(
      typeof date === "string" ? parseISO(date) : date,
      LocaleType.UTC,
      "dd/MM/yyyy",
      { locale: ptBR }
    );
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
            formatUTCDate(field.value as Date | string)
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
                const newDate = toDate(field.value as Date | string, {
                  timeZone: LocaleType.UTC,
                });
                newDate.setMonth(month);
                field.onChange(localToUTC(newDate));
              }
            }}
            disabled={disabled}
          >
            <SelectTrigger size="sm">
              <SelectValue placeholder="Mês" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Meses</SelectLabel>
                {monthNames.map((month, index) => (
                  <SelectItem key={month} value={index.toString()}>
                    {month.charAt(0).toUpperCase() + month.slice(1)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            value={currentYear.toString()}
            onValueChange={(value) => {
              const year = parseInt(value);
              setCurrentYear(year);
              if (field.value) {
                const newDate = toDate(field.value as Date | string, {
                  timeZone: LocaleType.UTC,
                });
                newDate.setFullYear(year);
                field.onChange(localToUTC(newDate));
              }
            }}
            disabled={disabled}
          >
            <SelectTrigger size="sm">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Anos</SelectLabel>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Calendar
          className="flex justify-center p-0"
          mode="single"
          selected={
            initialDate
              ? new Date(
                  initialDate.getTime() +
                    initialDate.getTimezoneOffset() * 60000
                )
              : undefined
          }
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
