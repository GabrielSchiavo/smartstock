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
import { ptBR } from "date-fns/locale";
import type { Locale } from "date-fns";
import { FieldValues } from "react-hook-form";
import { cn } from "@/lib/utils";
import { DatePickerFormProps, LocaleType } from "@/types";
import {
  convertLocalToUTC,
  convertUTCToDisplay,
  convertUTCToLocalDate,
  formatUTCDate,
  getLocalizedMonthNames,
} from "@/lib/date-utils";

export function DatePickerMonthYear<T extends FieldValues>({
  field,
  disabled = false,
  locale = ptBR, // Localização padrão: português brasileiro
  dateFormat = LocaleType.DD_MM_YYYY, // Formato padrão de exibição
}: DatePickerFormProps<T> & {
  locale?: Locale;
  dateFormat?: string;
}) {
  const [open, setOpen] = React.useState(false);

  // Converter valor do campo para exibição (UTC preservado)
  const displayDate = field.value
    ? convertUTCToLocalDate(field.value as Date | string)
    : undefined;

  const [currentMonth, setCurrentMonth] = React.useState<number>(
    displayDate?.getMonth() ?? new Date().getMonth()
  );
  const [currentYear, setCurrentYear] = React.useState<number>(
    displayDate?.getFullYear() ?? new Date().getFullYear()
  );

  // Gerar anos para o seletor
  const years = React.useMemo(
    () => Array.from({ length: 21 }, (_, i) => currentYear - 10 + i),
    [currentYear]
  );

  // Gerar nomes dos meses localizados
  const monthNames = React.useMemo(
    () => getLocalizedMonthNames(currentYear, locale),
    [currentYear, locale]
  );

  // Sincronizar mês/ano quando o valor muda
  React.useEffect(() => {
    if (!field.value) return;

    const date = convertUTCToDisplay(field.value as Date | string);
    setCurrentMonth(date.getMonth());
    setCurrentYear(date.getFullYear());
  }, [field.value]);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    const utcDate = convertLocalToUTC(date);
    field.onChange(utcDate);
    setOpen(false);
  };

  // Atualizar data quando mês/ano é alterado
  const updateDateFromSelects = (month?: number, year?: number) => {
    if (!field.value) return;

    const currentDate = convertUTCToDisplay(field.value as Date | string);
    const newDate = new Date(currentDate);

    if (month !== undefined) newDate.setMonth(month);
    if (year !== undefined) newDate.setFullYear(year);

    field.onChange(convertLocalToUTC(newDate));
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
            formatUTCDate(field.value as Date | string , locale, dateFormat as LocaleType)
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
              updateDateFromSelects(month);
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
              updateDateFromSelects(undefined, year);
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
          selected={displayDate}
          onSelect={handleDateSelect}
          month={new Date(currentYear, currentMonth)}
          onMonthChange={(date) => {
            setCurrentMonth(date.getMonth());
            setCurrentYear(date.getFullYear());
          }}
          disabled={disabled}
          locale={locale}
        />
      </PopoverContent>
    </Popover>
  );
}
