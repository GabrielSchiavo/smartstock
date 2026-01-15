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
import "flag-icons/css/flag-icons.min.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const LANGUAGES = [
  {
    name: "PT-BR",
    value: "pt-BR",
    image: "fib fi-br fis",
  },
  {
    name: "EN",
    value: "en",
    image: "fib fi-gb fis",
  },
];

export function SidebarLanguageSelector() {
  const [locale, setLocale] = useState(LANGUAGES[0]);
  const router = useRouter();

  useEffect(() => {
    const cookieLocale = document.cookie
      .split("; ")
      .find((row) => row.startsWith("SMARTSTOCK_LOCALE="))
      ?.split("=")[1];

    if (cookieLocale) {
      const lang = LANGUAGES.find((l) => l.value === cookieLocale)!;
      setLocale(lang);
    } else {
      setLocale(LANGUAGES[0]);
      document.cookie = `SMARTSTOCK_LOCALE=${LANGUAGES[0].value}`;
      router.refresh();
    }
  }, [router]);

  const changeLocale = (value: string) => {
    setLocale(LANGUAGES.find((l) => l.value === value)!);
    document.cookie = `SMARTSTOCK_LOCALE=${value}`;
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2 group-data-[collapsible=icon]:opacity-0 p-2">
      <Label htmlFor="lang-selector" className="sr-only">
        Idioma
      </Label>
      <Select
        onValueChange={() => changeLocale(locale.value)}
        defaultValue={locale.value}
      >
        <SelectTrigger
          id="lang-selector"
          size="sm"
          className="justify-between *:data-[slot=select-value]:w-12 w-full"
        >
          <span className="flex items-center gap-3">
            <span
              className={`${locale.image} size-4 shrink-0 rounded-sm`}
            ></span>
            <SelectValue placeholder="Selecione um idioma" />
          </span>
        </SelectTrigger>
        <SelectContent align="end">
          <SelectGroup>
            <SelectLabel>Idiomas</SelectLabel>
            {LANGUAGES.map((item) => (
              <SelectItem
                key={item.name}
                value={item.value}
                className="flex items-center gap-3"
              >
                <span
                  className={`${item.image} size-4 shrink-0 rounded-sm`}
                ></span>
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
