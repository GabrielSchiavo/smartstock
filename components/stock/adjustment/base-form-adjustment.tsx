"use client";

import { useForm, UseFormReturn } from "react-hook-form";
import { CreateAdjustmentSchema } from "@/schemas";
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
import { forwardRef, useEffect, useImperativeHandle, useMemo } from "react";
import { DialogFooter } from "@/components/ui/dialog";
import {
  FormAdjustmentProps,
  AdjustmentMovementCategoryType,
  ProductWithMasterProductResponse,
  UnitType,
  AdjustmentType,
} from "@/types";
import { MoonLoader } from "react-spinners";
import { SelectorProduct } from "@/components/stock/product/selector-product";
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
import { formatDateToLocale } from "@/utils/date-utils";

interface ExtendedFormBaseInputProductProps extends FormAdjustmentProps {
  products: ProductWithMasterProductResponse[];
}

export const BaseFormAdjustment = forwardRef<
  UseFormReturn<z.infer<typeof CreateAdjustmentSchema>>,
  ExtendedFormBaseInputProductProps
>(
  (
    {
      defaultValues,
      onSubmit,
      isPending,
      submitButtonText,
      loadingText,
      products,
    },
    ref
  ) => {
    const form = useForm<z.infer<typeof CreateAdjustmentSchema>>({
      resolver: zodResolver(CreateAdjustmentSchema),
      defaultValues: defaultValues || {
        productId: "",
        productQuantity: "",
        productUnit: "" as UnitType,
        lot: "",
        validityDate: "",
        quantity: "",
        unit: undefined,
        movementCategory: undefined,
        adjustmentType: undefined,
      },
    });

    useImperativeHandle(ref, () => form, [form]);

    // Função para lidar com a seleção do produto mestre
    const handleProductSelect = (product: ProductWithMasterProductResponse) => {
      const formattedValidityDate = formatDateToLocale(product.validityDate);

      form.setValue("productId", product.id.toString(), {
        shouldValidate: true,
        shouldDirty: true,
      });
      form.setValue("productQuantity", product.quantity.toString(), {
        shouldValidate: true,
        shouldDirty: true,
      });
      form.setValue("productUnit", product.unit.toString() as UnitType, {
        shouldValidate: true,
        shouldDirty: true,
      });
      form.setValue("lot", product.lot, {
        shouldValidate: true,
        shouldDirty: true,
      });
      form.setValue("validityDate", formattedValidityDate, {
        shouldValidate: true,
        shouldDirty: true,
      });
    };

    // Validação da seleção de categoria e tipo de ajuste
    const movementCategory = form.watch("movementCategory");

    const negativesCategories = useMemo(
      () => [
        AdjustmentMovementCategoryType.DUE_DATE,
        AdjustmentMovementCategoryType.LOSS_DAMAGE,
        AdjustmentMovementCategoryType.THEFT_MISPLACEMENT,
      ],
      []
    );

    const isDisabled =
      !movementCategory || negativesCategories.includes(movementCategory);

    useEffect(() => {
      if (negativesCategories.includes(movementCategory)) {
        form.setValue("adjustmentType", AdjustmentType.NEGATIVE, {
          shouldValidate: true,
        });
      }

      if (
        movementCategory === AdjustmentMovementCategoryType.GENERAL ||
        movementCategory === AdjustmentMovementCategoryType.CORRECTION
      ) {
        form.resetField("adjustmentType");
      }
    }, [movementCategory, form, negativesCategories]);

    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col justify-center items-center"
        >
          <div className="flex flex-col gap-12 w-full md:max-w-4xl">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <h1 className="text-md font-medium">Detalhes do Produto</h1>
              </div>
              <div className="flex flex-col gap-6 border rounded-xl p-10 shadow">
                <FormField
                  control={form.control}
                  name="productId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Produto
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <SelectorProduct
                          disabled={isPending}
                          products={products}
                          onSelect={handleProductSelect}
                          selectedId={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid sm:grid-cols-2 grid-cols-1 gap-6 items-start">
                  <FormField
                    control={form.control}
                    name="lot"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lote</FormLabel>
                        <FormControl>
                          <Input
                            disabled={true}
                            className="default-height"
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
                    name="validityDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Validade</FormLabel>
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
                <div className="grid sm:grid-cols-2 grid-cols-1 gap-6 items-start">
                  <FormField
                    control={form.control}
                    name="productQuantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantidade Disponível</FormLabel>
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
                  <FormField
                    control={form.control}
                    name="productUnit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unidade</FormLabel>
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
                <h1 className="text-md font-medium">Detalhes do Ajuste</h1>
              </div>
              <div className="flex flex-col gap-6 border rounded-xl p-10 shadow">
                <div className="grid sm:grid-cols-2 grid-cols-1 gap-6 items-start">
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
                            placeholder="Digite a quantidade de ajuste"
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
                                <SelectValue placeholder="Selecione a unidade da quantidade" />
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
                <div className="grid sm:grid-cols-2 grid-cols-1 gap-6 items-start">
                  <div className="grid sm:grid-cols-2 grid-cols-1 gap-6 items-start">
                    <FormField
                      control={form.control}
                      name="movementCategory"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex flex-col gap-3">
                            <FormLabel>
                              Categoria de Ajuste:{" "}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl className="flex flex-col gap-3">
                              <RadioGroup
                                disabled={isPending}
                                onValueChange={field.onChange}
                                value={field.value}
                                className="flex flex-col"
                              >
                                <FormItem className="flex items-center">
                                  <FormControl>
                                    <RadioGroupItem
                                      value={
                                        AdjustmentMovementCategoryType.GENERAL
                                      }
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Geral
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center">
                                  <FormControl>
                                    <RadioGroupItem
                                      value={
                                        AdjustmentMovementCategoryType.CORRECTION
                                      }
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Correção
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center">
                                  <FormControl>
                                    <RadioGroupItem
                                      value={
                                        AdjustmentMovementCategoryType.LOSS_DAMAGE
                                      }
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Perda/Avaria
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center">
                                  <FormControl>
                                    <RadioGroupItem
                                      value={
                                        AdjustmentMovementCategoryType.THEFT_MISPLACEMENT
                                      }
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Furto/Extravio
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center">
                                  <FormControl>
                                    <RadioGroupItem
                                      value={
                                        AdjustmentMovementCategoryType.DUE_DATE
                                      }
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Vencimento
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
                      name="adjustmentType"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex flex-col gap-3">
                            <FormLabel>Tipo de Ajuste:</FormLabel>
                            <FormControl className="flex flex-col gap-3">
                              <RadioGroup
                                disabled={isPending || isDisabled}
                                onValueChange={field.onChange}
                                value={field.value}
                                className="flex flex-col"
                              >
                                <FormItem className="flex items-center">
                                  <FormControl>
                                    <RadioGroupItem
                                      value={AdjustmentType.POSITIVE}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Positivo
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center">
                                  <FormControl>
                                    <RadioGroupItem
                                      value={AdjustmentType.NEGATIVE}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Negativo
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <div className="flex gap-3 justify-end">
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
          </div>
        </form>
      </Form>
    );
  }
);

BaseFormAdjustment.displayName = "BaseFormAdjustment";
