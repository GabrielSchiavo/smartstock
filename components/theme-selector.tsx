"use client";

import { useThemeConfig } from "@/components/active-theme";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DEFAULT_THEMES = [
  {
    name: "Padrão",
    value: "default",
  },
  {
    name: "Neutro",
    value: "blue",
  },
  {
    name: "Verde",
    value: "green",
  },
  {
    name: "Ambar",
    value: "amber",
  },
];

const SCALED_THEMES = [
  {
    name: "Padrão",
    value: "default-scaled",
  },
  {
    name: "Neutro",
    value: "blue-scaled",
  },
  {
    name: "Verde",
    value: "green-scaled",
  },
  {
    name: "Ambar",
    value: "amber-scaled",
  },
];

const MONO_THEMES = [
  {
    name: "Mono",
    value: "mono-scaled",
  },
];

export function ThemeSelector() {
  const { activeTheme, setActiveTheme } = useThemeConfig();

  return (
    <div className="flex items-center gap-2 group-data-[collapsible=icon]:opacity-0 mb-4">
      <Label htmlFor="theme-selector" className="sr-only">
        Tema
      </Label>
      <Select value={activeTheme} onValueChange={setActiveTheme}>
        <SelectTrigger
          id="theme-selector"
          size="sm"
          className="justify-between *:data-[slot=select-value]:w-12 w-full"
        >
          <span className="flex gap-2">
            <span className="text-muted-foreground hidden sm:block">Tema:</span>
            <span className="text-muted-foreground block sm:hidden">Tema</span>
            <SelectValue placeholder="Selecione um tema" />
          </span>
        </SelectTrigger>
        <SelectContent align="end">
          <SelectGroup>
            <SelectLabel>Cor</SelectLabel>
            {DEFAULT_THEMES.map((theme) => (
              <SelectItem key={theme.name} value={theme.value}>
                {theme.name}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Cor + Escala</SelectLabel>
            {SCALED_THEMES.map((theme) => (
              <SelectItem key={theme.name} value={theme.value}>
                {theme.name}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Escala + Monoespaçado</SelectLabel>
            {MONO_THEMES.map((theme) => (
              <SelectItem key={theme.name} value={theme.value}>
                {theme.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
