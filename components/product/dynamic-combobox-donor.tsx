"use client";

import {
  searchDonors,
  createDonor,
  getAllDonors,
  deleteDonor,
  checkDonorInProducts,
} from "@/actions";
import { DynamicComboboxProps } from "@/types";
import { BaseCombobox } from "@/components/product/base-combobox";
import { useDynamicCombobox } from "@/hooks/use-dynamic-combobox";
import { useMemo } from "react";

export function DynamicComboboxDonor({
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
      search: searchDonors,
      create: createDonor,
      getAll: getAllDonors,
      delete: deleteDonor,
      checkUsage: checkDonorInProducts,
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
  } = useDynamicCombobox(api, "Doador", value, onChange);

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
      resourceName="Doador"
    />
  );
}
