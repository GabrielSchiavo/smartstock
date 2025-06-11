"use client";

import { useDynamicCombobox } from "@/hooks/use-dynamic-combobox";
import { BaseCombobox } from "@/components/product/base-combobox";
import {
  searchGroups,
  createGroup,
  getAllGroups,
  deleteGroup,
  checkGroupInProducts,
} from "@/actions";
import { DynamicComboboxProps } from "@/types";
import { useMemo } from "react";

export function DynamicComboboxGroup({
  value,
  onChange,
  placeholder = "Pesquisar...",
  allowCreate = true,
  allowDelete = true,
  disabled,
  className,
}: DynamicComboboxProps) {
  const api = useMemo(
    () => ({
      search: searchGroups,
      create: createGroup,
      getAll: getAllGroups,
      delete: deleteGroup,
      checkUsage: checkGroupInProducts,
    }),
    []
  );

  const {
    open,
    setOpen,
    inputValue,
    setInputValue,
    options,
    isLoading,
    handleCreateNew,
    handleSelect,
    handleDelete,
  } = useDynamicCombobox(api, "Grupo", value, onChange);

  const displayValue = value
    ? options.find((option) => option.name === value)?.name || value
    : placeholder;

  return (
    <BaseCombobox
      value={value}
      placeholder={placeholder}
      displayValue={displayValue}
      disabled={disabled}
      open={open}
      setOpen={setOpen}
      inputValue={inputValue}
      setInputValue={setInputValue}
      options={options}
      isPending={isLoading}
      allowCreate={allowCreate}
      allowDelete={allowDelete}
      handleCreateNew={handleCreateNew}
      handleSelect={handleSelect}
      handleDelete={handleDelete}
      className={className}
      resourceName="Grupo"
    />
  );
}
