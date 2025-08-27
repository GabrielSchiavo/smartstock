// lib/date-utils.ts
import { formatInTimeZone, toDate } from "date-fns-tz";
import { format, Locale } from "date-fns";
import { LocaleType } from "@/types";

/**
 * Converte uma data local para UTC mantendo os componentes de data
 */
export const convertLocalToUTC = (date: Date): Date => {
  return toDate(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      0,
      0,
      0
    )
  );
};

/**
 * Converte uma data UTC para uma representação local (sem alterar valores)
 */
export const convertUTCToDisplay = (date: Date | string): Date => {
  return toDate(date, { timeZone: LocaleType.UTC });
};

/**
 * Converte uma data UTC para uma data local com os mesmos componentes de data
 */
export const convertUTCToLocalDate = (date: Date | string): Date => {
  const d = new Date(date);
  return new Date(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate()
  );
};

/**
 * Formata uma data UTC para exibição
 */
export const formatUTCDate = (
  date: Date | string | undefined, 
  locale: Locale,
  formatStr = LocaleType.DD_MM_YYYY
): string => {
  if (!date) return "";
  return formatInTimeZone(date, LocaleType.UTC, formatStr, { locale });
};

/**
 * Obtém nomes dos meses localizados
 */
export const getLocalizedMonthNames = (
  year: number, 
  locale: Locale
): string[] => {
  return Array.from({ length: 12 }, (_, i) => {
    const monthDate = new Date(year, i, 1);
    return format(monthDate, "MMMM", { locale });
  });
};

/**
 * Formata uma data para exibição no formato DD/MM/YYYY no fuso horário UTC
 * @param date Data a ser formatada
 * @returns String formatada no padrão DD/MM/YYYY
 */
export function formatDateToLocale(date: Date): string {
  return date.toLocaleDateString(LocaleType.PT_BR, { timeZone: LocaleType.UTC, day: "2-digit", month: "2-digit", year: "numeric" });
}

export function formatDateTimeToLocale(date: Date): string {
  return date.toLocaleDateString(LocaleType.PT_BR, { timeZone: LocaleType.SAO_PAULO, day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" });
}