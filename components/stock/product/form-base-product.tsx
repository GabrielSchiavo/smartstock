"use client";

import { useForm, UseFormReturn } from "react-hook-form";
import { CreateEditProductSchema } from "@/schemas";
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
import { DialogFooter } from "@/components/ui/dialog";
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
  FormBaseProductProps,
  LocaleType,
  ProductType,
  ResourceType,
  UnitType,
} from "@/types";
import { MoonLoader } from "react-spinners";
import { ptBR } from "date-fns/locale";
import { DynamicCombobox } from "@/components/shared/dynamic-combobox";
import { MasterProduct } from "@prisma/client";
import { SelectorMasterProduct } from "@/components/stock/master-product/selector-master-product";

interface ExtendedFormBaseProductProps extends FormBaseProductProps {
  masterProducts: MasterProduct[];
}

export const FormBaseProduct = forwardRef<
  UseFormReturn<z.infer<typeof CreateEditProductSchema>>,
  ExtendedFormBaseProductProps
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
    },
    ref
  ) => {
    const form = useForm<z.infer<typeof CreateEditProductSchema>>({
      resolver: zodResolver(CreateEditProductSchema),
      defaultValues: defaultValues || {
        masterProductId: "",
        name: "",
        quantity: "",
        unit: undefined,
        unitWeight: "",
        unitOfUnitWeight: undefined,
        lot: "",
        validityDate: undefined,
        supplier: undefined,
        receiptDate: undefined,
        receiver: "",
        productType: undefined,
        category: "",
        group: "",
        subgroup: "",
      },
    });

    useImperativeHandle(ref, () => form, [form]);

    const selectedType = form.watch("productType");
    const unitSelected = form.watch("unit");
    // const masterProductId = form.watch("masterProductId");

    // Determina se o input deve estar desabilitado
    const isSupplierDisabled =
      !selectedType || selectedType !== ProductType.DONATED;
    const isUnitWeightDisabled = !unitSelected || unitSelected !== UnitType.UN;

    // Encontra o produto mestre selecionado
    // const selectedMasterProduct = masterProducts.find(
    //   item => item.id.toString() === masterProductId
    // );

    // Efeitos para limpar valores quando campos são desabilitados
    const prevRef = useRef(isSupplierDisabled);
    useEffect(() => {
      if (!prevRef.current && isSupplierDisabled) {
        form.setValue("supplier", undefined, {
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
    const handleMasterProductSelect = (masterProduct: MasterProduct) => {
      form.setValue("masterProductId", masterProduct.id.toString(), {
        shouldValidate: true,
        shouldDirty: true,
      });
      // form.setValue("name", masterProduct.name, {
      //   shouldValidate: true,
      //   shouldDirty: true,
      // });
      form.setValue("category", masterProduct.category, {
        shouldValidate: true,
        shouldDirty: true,
      });
      form.setValue("group", masterProduct.group, {
        shouldValidate: true,
        shouldDirty: true,
      });
      if (masterProduct.subgroup) {
        form.setValue("subgroup", masterProduct.subgroup, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    };

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-8">
          <div className="grid grid-cols-1 gap-4 items-start">
            {/* Seletor de Produto Mestre */}
            <FormField
              control={form.control}
              name="masterProductId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Produto Mestre <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <SelectorMasterProduct
                      masterProducts={masterProducts}
                      onSelect={handleMasterProductSelect}
                      selectedId={field.value}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 items-start">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
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
                        disabled={isPending}
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
            </div>

            <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 items-start">
              <FormField
                control={form.control}
                name="unitWeight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peso Unitário</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isUnitWeightDisabled || isPending}
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
                        disabled={isUnitWeightDisabled || isPending}
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
                            <SelectLabel>Unidades Peso Unitário</SelectLabel>
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
            </div>

            <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 items-start">
              <FormField
                control={form.control}
                name="lot"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lote</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 items-start">
              <FormField
                control={form.control}
                name="receiver"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recebedor</FormLabel>
                    <div className="select-container relative w-full min-w-0">
                      <DynamicCombobox
                        resourceType={ResourceType.RECEIVER}
                        value={field.value ? field.value : ""}
                        onChange={field.onChange}
                        disabled={isPending}
                        placeholder="Selecione um recebedor..."
                      />
                    </div>
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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Campos de categoria, grupo e subgrupo - apenas leitura */}
            <div className="grid grid-cols-1 gap-4 items-start">
              <div className="grid sm:grid-cols-3 grid-cols-1 gap-4">
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
            </div>

            <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 items-start">
              <FormField
                control={form.control}
                name="productType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Produto:</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col"
                      >
                        <FormItem className="flex items-center">
                          <FormControl>
                            <RadioGroupItem value={ProductType.DONATED} />
                          </FormControl>
                          <FormLabel className="font-normal">Doado</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center">
                          <FormControl>
                            <RadioGroupItem value={ProductType.PURCHASED} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Comprado
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supplier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fornecedor</FormLabel>
                    <div className="select-container relative w-full min-w-0">
                      <DynamicCombobox
                        resourceType={ResourceType.SUPPLIER}
                        value={field.value ? field.value : ""}
                        onChange={field.onChange}
                        disabled={isSupplierDisabled || isPending}
                        placeholder={
                          isSupplierDisabled
                            ? "Selecione 'Doado' para habilitar"
                            : "Selecione um fornecedor"
                        }
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Exibição das informações do produto mestre selecionado
            {selectedMasterProduct && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">
                  Produto Mestre Selecionado:
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-blue-800">
                  <div><strong>Nome:</strong> {selectedMasterProduct.name}</div>
                  <div><strong>Categoria:</strong> {selectedMasterProduct.category}</div>
                  <div><strong>Grupo:</strong> {selectedMasterProduct.group}</div>
                  <div><strong>Subgrupo:</strong> {selectedMasterProduct.subgroup || "N/A"}</div>
                </div>
              </div>
            )} */}
          </div>
          
          <DialogFooter>
            <div className="flex gap-3">
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
          </DialogFooter>
        </form>
      </Form>
    );
  }
);

FormBaseProduct.displayName = "FormBaseProduct";