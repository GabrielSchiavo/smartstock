"use client";

import { useForm, UseFormReturn } from "react-hook-form";
import { CreateOutputSchema } from "@/schemas";
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
import { forwardRef, useImperativeHandle } from "react";
import {
  FormOutputProps,
  OutputMovementCategoryType,
  ProductWithMasterProductResponse,
  UnitType,
} from "@/types";
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
import { formatDateOnlyToLocale } from "@/utils/date-utils";
import { formatEnumValueDisplay } from "@/utils/format-enum-value-display";
import { Spinner } from "@/components/ui/spinner";
import { SaveIcon } from "lucide-react";

interface ExtendedFormBaseInputProductProps extends FormOutputProps {
  products: ProductWithMasterProductResponse[];
}

export const BaseFormOutput = forwardRef<
  UseFormReturn<z.infer<typeof CreateOutputSchema>>,
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
      isLoading,
    },
    ref
  ) => {
    const form = useForm<z.infer<typeof CreateOutputSchema>>({
      resolver: zodResolver(CreateOutputSchema),
      defaultValues: defaultValues || {
        productId: "",
        productQuantity: "",
        productUnit: "" as UnitType,
        lot: "",
        validityDate: "",
        quantity: "",
        unit: "" as UnitType,
        movementCategory: "" as OutputMovementCategoryType,
      },
    });

    useImperativeHandle(ref, () => form, [form]);

    // Função para lidar com a seleção do produto mestre
    const handleProductSelect = (product: ProductWithMasterProductResponse) => {
      const formattedValidityDate = formatDateOnlyToLocale(
        product.validityDate
      );

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
                          products={products}
                          onSelect={handleProductSelect}
                          selectedId={field.value}
                          disabled={isPending}
                          isLoading={isLoading}
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
                <h1 className="text-md font-medium">Detalhes da Saída</h1>
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
                            placeholder="Digite a quantidade de saída"
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
                                <SelectValue placeholder="Selecione a unidade de saída" />
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
                <FormField
                  control={form.control}
                  name="movementCategory"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-col gap-3">
                        <FormLabel>
                          Categoria de Saída:{" "}
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
                                  value={OutputMovementCategoryType.CONSUMPTION}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {formatEnumValueDisplay(
                                  OutputMovementCategoryType.CONSUMPTION,
                                  "capitalize"
                                )}
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center">
                              <FormControl>
                                <RadioGroupItem
                                  value={OutputMovementCategoryType.DONATION}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {formatEnumValueDisplay(
                                  OutputMovementCategoryType.DONATION,
                                  "capitalize"
                                )}
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center">
                              <FormControl>
                                <RadioGroupItem
                                  value={OutputMovementCategoryType.RETURN}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {formatEnumValueDisplay(
                                  OutputMovementCategoryType.RETURN,
                                  "capitalize"
                                )}
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center">
                              <FormControl>
                                <RadioGroupItem
                                  value={OutputMovementCategoryType.SALE}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {formatEnumValueDisplay(
                                  OutputMovementCategoryType.SALE,
                                  "capitalize"
                                )}
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center">
                              <FormControl>
                                <RadioGroupItem
                                  value={OutputMovementCategoryType.TRANSFER}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {formatEnumValueDisplay(
                                  OutputMovementCategoryType.TRANSFER,
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
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                disabled={isPending}
                size="sm"
                type="reset"
                variant={"ghost"}
                onClick={() => {
                  form.reset();
                }}
              >
                Cancelar
              </Button>
              <Button disabled={isPending} type="submit" size="sm">
                {isPending ? (
                  <span className="flex items-center gap-3">
                    <Spinner className="size-4 shrink-0" />
                    {loadingText}
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <SaveIcon className="size-4 shrink-0" />
                    {submitButtonText}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    );
  }
);

BaseFormOutput.displayName = "BaseFormOutput";
