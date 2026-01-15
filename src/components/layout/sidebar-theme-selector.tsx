"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useThemeConfig } from "@/components/providers/active-theme-provider";

const COLOR_THEMES = [
  {
    name: "Amarelo",
    value: "yellow",
    color: "bg-yellow-600",
  },
  {
    name: "Azul",
    value: "blue",
    color: "bg-blue-700",
  },
  {
    name: "Cinza",
    value: "gray",
    color: "bg-gray-600",
  },
  {
    name: "Laranja",
    value: "orange",
    color: "bg-orange-600",
  },
  {
    name: "Rosa",
    value: "rose",
    color: "bg-rose-600",
  },
  {
    name: "Verde",
    value: "green",
    color: "bg-green-600",
  },
  {
    name: "Verde-azulado",
    value: "teal",
    color: "bg-teal-600",
  },
  {
    name: "Violeta",
    value: "violet",
    color: "bg-violet-600",
  },
];

export function SidebarThemeSelector() {
  const { activeTheme, setActiveTheme } = useThemeConfig();

  const activeThemeColor =
    COLOR_THEMES.find((theme) => theme.value === activeTheme)?.color ?? "";

  return (
    <div className="flex items-center gap-2 group-data-[collapsible=icon]:opacity-0 p-2">
      <Label htmlFor="theme-selector" className="sr-only">
        Tema
      </Label>
      <Select value={activeTheme} onValueChange={setActiveTheme}>
        <SelectTrigger
          id="theme-selector"
          size="sm"
          className="justify-between w-full"
        >
          <span className="flex items-center gap-3">
            <span
              className={`${activeThemeColor} size-4 shrink-0 rounded-sm`}
            />
            <SelectValue placeholder="Selecione um tema" />
          </span>
        </SelectTrigger>
        <SelectContent align="end">
          <SelectGroup>
            <SelectLabel>Cores</SelectLabel>
            {COLOR_THEMES.map((theme) => (
              <SelectItem
                key={theme.value}
                value={theme.value}
                className="flex items-center gap-3"
              >
                <span className={`${theme.color} size-4 shrink-0 rounded-sm`} />
                {theme.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
