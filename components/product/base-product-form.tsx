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
  BaseProductFormProps,
  LocaleType,
  ProductType,
  ResourceType,
  UnitType,
} from "@/types";
import { MoonLoader } from "react-spinners";
import { ptBR } from "date-fns/locale";
import { DynamicCombobox } from "@/components/shared/dynamic-combobox";

export const BaseProductForm = forwardRef<
  UseFormReturn<z.infer<typeof CreateEditProductSchema>>,
  BaseProductFormProps
>(
  (
    {
      defaultValues,
      onSubmit,
      onCancel,
      isPending,
      submitButtonText,
      loadingText,
    },
    ref
  ) => {
    const form = useForm<z.infer<typeof CreateEditProductSchema>>({
      resolver: zodResolver(CreateEditProductSchema),
      defaultValues: defaultValues || {
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
        group: "",
        subgroup: undefined,
        productType: undefined,
      },
    });

    useImperativeHandle(ref, () => form, [form]);

    const selectedType = form.watch("productType");
    const unitSelected = form.watch("unit");

    // Determina se o input deve estar desabilitado
    const isSupplierDisabled =
      !selectedType || selectedType !== ProductType.DONATED;
    const isUnitWeightDisabled = !unitSelected || unitSelected !== UnitType.UN;

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

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-8">
          <div className="grid grid-cols-1 gap-4 items-start">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      className="default-height"
                      placeholder="Digite um nome"
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
            <div className="grid grid-cols-1 gap-4 items-start">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <div className="select-container relative w-full min-w-0">
                      <DynamicCombobox
                        resourceType={ResourceType.CATEGORY}
                        value={field.value ? field.value : ""}
                        onChange={field.onChange}
                        disabled={isPending}
                        placeholder="Selecione uma categoria..."
                      />
                    </div>
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
                    <div className="select-container relative w-full min-w-0">
                      <DynamicCombobox
                        resourceType={ResourceType.GROUP}
                        value={field.value ? field.value : ""}
                        onChange={field.onChange}
                        disabled={isPending}
                        placeholder="Selecione um grupo..."
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subgroup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subgrupo (Opcional)</FormLabel>
                    <div className="select-container relative w-full min-w-0">
                      <DynamicCombobox
                        resourceType={ResourceType.SUBGROUP}
                        value={field.value ? field.value : ""}
                        onChange={field.onChange}
                        disabled={isPending}
                        placeholder="Selecione um subgrupo..."
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
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

BaseProductForm.displayName = "BaseProductForm";
