"use client";

import { useForm, UseFormReturn } from "react-hook-form";
import { CreateInputEditProductSchema } from "@/schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerMonthYear } from "@/components/shared/date-picker-month-year-selectors";
import {
  LocaleType,
  ModeType,
  InputMovementCategoryType,
  ProductType,
  ResourceType,
  UnitType,
  ExtendedFormBaseInputProductProps,
  BaseUnitType,
  MasterProductWithCategoryGroupSubgroupResponse,
} from "@/types";
import { MoonLoader } from "react-spinners";
import { ptBR } from "date-fns/locale";
import { DynamicCombobox } from "@/components/shared/dynamic-combobox";
import { SelectorMasterProduct } from "@/components/stock/master-product/selector-master-product";
import { formatEnumValueDisplay } from "@/utils/format-enum-value-display";

export const BaseFormInput = forwardRef<
  UseFormReturn<z.infer<typeof CreateInputEditProductSchema>>,
  ExtendedFormBaseInputProductProps
>(
  (
    {
      defaultValues,
      onSubmit,
      onCancel,
      isPending,
      submitButtonText,
      loadingText,
      masterProducts,
      isLoading = false,
      mode = ModeType.ADD,
    },
    ref
  ) => {
    const form = useForm<z.infer<typeof CreateInputEditProductSchema>>({
      resolver: zodResolver(CreateInputEditProductSchema),
      defaultValues: defaultValues || {
        masterProductId: "",
        name: "",
        quantity: "",
        unit: "" as UnitType,
        unitWeight: "",
        unitOfUnitWeight: "" as UnitType.KG | UnitType.G | UnitType.L,
        lot: "",
        validityDate: undefined,
        supplierId: "",
        receiptDate: undefined,
        receiverId: "",
        productType: "" as ProductType,
        category: "",
        group: "",
        subgroup: "",
        baseUnit: "" as BaseUnitType,
        movementCategory: "" as InputMovementCategoryType,
      },
    });

    useImperativeHandle(ref, () => form, [form]);

    const isEditMode = mode === ModeType.EDIT;

    const selectedType = form.watch("productType");
    const unitSelected = form.watch("unit");
    // const masterProductId = form.watch("masterProductId");

    // Determina se o input deve estar desabilitado
    const isSupplierDisabled = !selectedType;
    const isUnitWeightDisabled = !unitSelected || unitSelected !== UnitType.UN;

    // Encontra o produto mestre selecionado
    // const selectedMasterProduct = masterProducts.find(
    //   item => item.id.toString() === masterProductId
    // );

    // Efeitos para limpar valores quando campos são desabilitados
    const prevRef = useRef(isSupplierDisabled);
    useEffect(() => {
      if (!prevRef.current && isSupplierDisabled) {
        form.setValue("supplierId", undefined, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
      }
      prevRef.current = isSupplierDisabled;
    }, [isSupplierDisabled, form]);

    const prevRefUnit = useRef(isUnitWeightDisabled);
    useEffect(() => {
      if (!prevRefUnit.current && isUnitWeightDisabled) {
        form.setValue("unitWeight", undefined, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
        form.setValue("unitOfUnitWeight", undefined, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
      }
      prevRefUnit.current = isUnitWeightDisabled;
    }, [isUnitWeightDisabled, form]);

    // Função para lidar com a seleção do produto mestre
    const handleMasterProductSelect = (
      masterProduct: MasterProductWithCategoryGroupSubgroupResponse
    ) => {
      form.setValue("masterProductId", masterProduct.id.toString(), {
        shouldValidate: true,
        shouldDirty: true,
      });
      form.setValue("category", masterProduct.category.name, {
        shouldValidate: true,
        shouldDirty: true,
      });
      form.setValue("group", masterProduct.group.name, {
        shouldValidate: true,
        shouldDirty: true,
      });
      if (masterProduct.subgroup) {
        form.setValue("subgroup", masterProduct.subgroup.name, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
      if (masterProduct.baseUnit) {
        form.setValue("baseUnit", masterProduct.baseUnit as BaseUnitType, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    };

    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col justify-center items-center"
        >
          <div className="flex flex-col gap-12 w-full md:max-w-4xl">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <h1 className="text-md font-medium">
                  Detalhes do Produto Mestre
                </h1>
              </div>
              <div className="flex flex-col gap-6 border rounded-xl p-10 shadow">
                <FormField
                  control={form.control}
                  name="masterProductId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Produto Mestre
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <SelectorMasterProduct
                          masterProducts={masterProducts}
                          onSelect={handleMasterProductSelect}
                          selectedId={field.value}
                          disabled={isPending}
                          isLoading={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid sm:grid-cols-3 grid-cols-1 gap-6 items-start">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria</FormLabel>
                        <FormControl>
                          <Input
                            disabled={true}
                            className="default-height bg-muted"
                            placeholder="Será preenchida automaticamente"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="group"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grupo</FormLabel>
                        <FormControl>
                          <Input
                            disabled={true}
                            className="default-height bg-muted"
                            placeholder="Será preenchido automaticamente"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subgroup"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subgrupo</FormLabel>
                        <FormControl>
                          <Input
                            disabled={true}
                            className="default-height bg-muted"
                            placeholder="Será preenchido automaticamente"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid sm:grid-cols-3 grid-cols-1 gap-6 items-start">
                  <FormField
                    control={form.control}
                    name="baseUnit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unidade Base</FormLabel>
                        <FormControl>
                          <Input
                            disabled={true}
                            type="text"
                            className="default-height"
                            placeholder="Será preenchido automaticamente"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <h1 className="text-md font-medium">Detalhes do Produto</h1>
              </div>
              <div className="flex flex-col gap-6 border rounded-xl p-10 shadow">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          className="default-height bg-muted"
                          placeholder="Informe o nome do produto"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid sm:grid-cols-2 grid-cols-1 gap-6 items-start">
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantidade</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isPending || isEditMode}
                            type="number"
                            className="default-height"
                            placeholder="Digite a quantidade"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unidade</FormLabel>
                        <div className="select-container">
                          <Select
                            disabled={isPending || isEditMode}
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger size="sm">
                                <SelectValue placeholder="Selecione a unidade" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Unidades</SelectLabel>
                                <SelectItem value={UnitType.KG}>KG</SelectItem>
                                <SelectItem value={UnitType.G}>G</SelectItem>
                                <SelectItem value={UnitType.L}>L</SelectItem>
                                <SelectItem value={UnitType.UN}>UN.</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="unitWeight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Peso Unitário</FormLabel>
                        <FormControl>
                          <Input
                            disabled={
                              isUnitWeightDisabled || isPending || isEditMode
                            }
                            type="number"
                            className="default-height"
                            placeholder={
                              isUnitWeightDisabled
                                ? "Selecione 'UN.' para habilitar"
                                : "Digite o peso unitário"
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="unitOfUnitWeight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unidade Peso Unitário</FormLabel>
                        <div className="select-container">
                          <Select
                            disabled={
                              isUnitWeightDisabled || isPending || isEditMode
                            }
                            value={field.value ?? ""}
                            onValueChange={(val) =>
                              field.onChange(val ?? undefined)
                            }
                          >
                            <FormControl>
                              <SelectTrigger size="sm">
                                <SelectValue
                                  placeholder={
                                    isUnitWeightDisabled
                                      ? "Selecione 'UN.' para habilitar"
                                      : "Selecione a unidade do peso unitário"
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>
                                  Unidades Peso Unitário
                                </SelectLabel>
                                <SelectItem value={UnitType.KG}>KG</SelectItem>
                                <SelectItem value={UnitType.G}>G</SelectItem>
                                <SelectItem value={UnitType.L}>L</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lot"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lote</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isPending || isEditMode}
                            className="default-height"
                            placeholder="Digite o lote"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="validityDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Validade</FormLabel>
                        <FormControl>
                          <DatePickerMonthYear
                            field={field}
                            locale={ptBR}
                            dateFormat={LocaleType.DD_MM_YYYY}
                            disabled={isPending || isEditMode}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <h1 className="text-md font-medium">Detalhes da Entrada</h1>
              </div>
              <div className="flex flex-col gap-6 border rounded-xl p-10 shadow">
                <div className="grid sm:grid-cols-2 grid-cols-1 gap-6 items-start">
                  <FormField
                    control={form.control}
                    name="receiverId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recebedor</FormLabel>
                        <DynamicCombobox
                          resourceType={ResourceType.RECEIVER}
                          value={field.value ? field.value : ""}
                          onChange={field.onChange}
                          disabled={isPending || isEditMode}
                          placeholder="Selecione um recebedor..."
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="receiptDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Recebimento</FormLabel>
                        <FormControl>
                          <DatePickerMonthYear
                            field={field}
                            locale={ptBR}
                            dateFormat={LocaleType.DD_MM_YYYY}
                            disabled={isPending || isEditMode}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="productType"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-col gap-3">
                          <FormLabel>Tipo de Produto:</FormLabel>
                          <FormControl className="flex flex-col gap-3">
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex flex-col"
                              disabled={isPending || isEditMode}
                            >
                              <FormItem className="flex items-center">
                                <FormControl>
                                  <RadioGroupItem value={ProductType.DONATED} />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {formatEnumValueDisplay(
                                    ProductType.DONATED,
                                    "capitalize"
                                  )}
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center">
                                <FormControl>
                                  <RadioGroupItem
                                    value={ProductType.PURCHASED}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {formatEnumValueDisplay(
                                    ProductType.PURCHASED,
                                    "capitalize"
                                  )}
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="supplierId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fornecedor (Opcional)</FormLabel>
                        <DynamicCombobox
                          resourceType={ResourceType.SUPPLIER}
                          value={field.value ? field.value : ""}
                          onChange={field.onChange}
                          disabled={
                            isSupplierDisabled || isPending || isEditMode
                          }
                          placeholder={
                            isSupplierDisabled
                              ? "Selecione o 'Tipo de Produto' para habilitar"
                              : "Selecione um fornecedor"
                          }
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {!isEditMode && (
                  <FormField
                    control={form.control}
                    name="movementCategory"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-col gap-3">
                          <FormLabel>
                            Categoria de Entrada:{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl className="flex flex-col gap-3">
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex flex-col"
                            >
                              <FormItem className="flex items-center">
                                <FormControl>
                                  <RadioGroupItem
                                    value={InputMovementCategoryType.DONATION}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {formatEnumValueDisplay(
                                    InputMovementCategoryType.DONATION,
                                    "capitalize"
                                  )}
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center">
                                <FormControl>
                                  <RadioGroupItem
                                    value={InputMovementCategoryType.PURCHASE}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {formatEnumValueDisplay(
                                    InputMovementCategoryType.PURCHASE,
                                    "capitalize"
                                  )}
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center">
                                <FormControl>
                                  <RadioGroupItem
                                    value={InputMovementCategoryType.RETURN}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {formatEnumValueDisplay(
                                    InputMovementCategoryType.RETURN,
                                    "capitalize"
                                  )}
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center">
                                <FormControl>
                                  <RadioGroupItem
                                    value={InputMovementCategoryType.TRANSFER}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {formatEnumValueDisplay(
                                    InputMovementCategoryType.TRANSFER,
                                    "capitalize"
                                  )}
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              {isEditMode && (
                <Button
                  disabled={isPending}
                  size="sm"
                  type="reset"
                  variant={"ghost"}
                  onClick={() => {
                    form.reset();
                    onCancel?.();
                  }}
                >
                  Cancelar
                </Button>
              )}
              <Button disabled={isPending} type="submit" size="sm">
                {isPending ? (
                  <span className="flex items-center gap-3">
                    <MoonLoader size={16} color="#ffffff" />
                    {loadingText}
                  </span>
                ) : (
                  submitButtonText
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    );
  }
);

BaseFormInput.displayName = "BaseFormInput";
