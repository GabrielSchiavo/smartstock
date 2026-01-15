"use client";

import {
  searchSupplier,
  createSupplier,
  getAllSupplier,
  deleteSupplier,
  checkSupplierUsage,
  searchGroup,
  createGroup,
  getAllGroup,
  deleteGroup,
  checkGroupUsage,
  searchReceiver,
  createReceiver,
  getAllReceiver,
  deleteReceiver,
  checkReceiverUsage,
  searchSubgroup,
  createSubgroup,
  getAllSubgroup,
  deleteSubgroup,
  checkSubgroupUsage,
} from "@/actions";
import { DynamicComboboxProps, ResourceType } from "@/types";
import { BaseDynamicCombobox } from "@/components/shared/base-dynamic-combobox";
import { useDynamicCombobox } from "@/hooks/use-dynamic-combobox";
import { useMemo } from "react";
import { checkCategoryUsage, createCategory, deleteCategory, getAllCategory, searchCategory } from "@/actions/category.action";

export function DynamicCombobox({
  resourceType,
  value,
  onChange,
  placeholder = "Pesquisar...",
  allowCreate = true,
  allowDelete = true,
  disabled,
  className,
}: DynamicComboboxProps) {
  // Configurações específicas por tipo de recurso
  const resourceConfig = useMemo(() => {
    const config = {
      [ResourceType.SUPPLIER]: {
        search: searchSupplier,
        create: createSupplier,
        getAll: getAllSupplier,
        delete: deleteSupplier,
        checkUsage: checkSupplierUsage,
        resourceName: "Fornecedor",
      },
      [ResourceType.CATEGORY]: {
        search: searchCategory,
        create: createCategory,
        getAll: getAllCategory,
        delete: deleteCategory,
        checkUsage: checkCategoryUsage,
        resourceName: "Categoria",
      },
      [ResourceType.GROUP]: {
        search: searchGroup,
        create: createGroup,
        getAll: getAllGroup,
        delete: deleteGroup,
        checkUsage: checkGroupUsage,
        resourceName: "Grupo",
      },
      [ResourceType.RECEIVER]: {
        search: searchReceiver,
        create: createReceiver,
        getAll: getAllReceiver,
        delete: deleteReceiver,
        checkUsage: checkReceiverUsage,
        resourceName: "Recebedor",
      },
      [ResourceType.SUBGROUP]: {
        search: searchSubgroup,
        create: createSubgroup,
        getAll: getAllSubgroup,
        delete: deleteSubgroup,
        checkUsage: checkSubgroupUsage,
        resourceName: "Subgrupo",
      },
    };
    return config[resourceType];
  }, [resourceType]);

  const api = useMemo(
    () => ({
      search: resourceConfig.search,
      create: resourceConfig.create,
      getAll: resourceConfig.getAll,
      delete: resourceConfig.delete,
      checkUsage: resourceConfig.checkUsage,
    }),
    [resourceConfig]
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
  } = useDynamicCombobox(api, resourceConfig.resourceName, value, onChange);

  const displayValue = value
    ? options.find((option) => option.id === value)?.name || placeholder
    : placeholder;

  return (
    <BaseDynamicCombobox
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
      resourceName={resourceConfig.resourceName}
    />
  );
}
