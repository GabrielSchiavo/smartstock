"use client";

import { useDynamicCombobox } from "@/hooks/use-dynamic-combobox";
import { BaseCombobox } from "@/components/product/base-combobox";
import {
  searchSubgroups,
  createSubgroup,
  getAllSubgroups,
  deleteSubgroup,
  checkSubgroupUsage,
} from "@/actions";
import { DynamicComboboxProps } from "@/types";

export function DynamicComboboxSubgroup({
  value,
  onChange,
  placeholder = "Pesquisar...",
  allowCreate = true,
  allowDelete = true,
  disabled,
  className,
}: DynamicComboboxProps) {
  const api = {
    search: searchSubgroups,
    create: createSubgroup,
    getAll: getAllSubgroups,
    delete: deleteSubgroup,
    checkUsage: checkSubgroupUsage,
  };

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
  } = useDynamicCombobox(api, "Subgrupo", value, onChange);

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
      resourceName="Subgrupo"
    />
  );
}