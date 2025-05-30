"use client";

import { useDynamicCombobox } from "@/hooks/use-dynamic-combobox";
import { BaseCombobox } from "@/components/shared/base-combobox";
import {
  searchReceivers,
  createReceiver,
  getAllReceivers,
  deleteReceiver,
  checkReceiverUsage,
} from "@/actions";
import { DynamicComboboxProps } from "@/types";

export function DynamicComboboxReceiver({
  value,
  onChange,
  placeholder = "Pesquisar...",
  allowCreate = true,
  allowDelete = true,
  disabled,
  className,
}: DynamicComboboxProps) {
  const api = {
    search: searchReceivers,
    create: createReceiver,
    getAll: getAllReceivers,
    delete: deleteReceiver,
    checkUsage: checkReceiverUsage,
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
  } = useDynamicCombobox(api, "Recebedor", value, onChange);

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
      resourceName="recebedor"
    />
  );
}