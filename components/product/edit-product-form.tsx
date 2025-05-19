"use client";

import { useForm } from "react-hook-form";
import { CreateProductSchema } from "@/schemas";
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
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { editProduct, getProductById } from "@/actions/product";
import { useEffect, useState, useTransition } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerMonthYear } from "@/components/date-picker-month-year-selectors";
import { ProductType, UnitMeasurement } from "@prisma/client";
import { DynamicComboboxGroup } from "@/components/dynamic-combobox-group";
import { DynamicComboboxSubgroup } from "@/components/dynamic-combobox-subgroup";
import { DynamicComboboxDonor } from "@/components/dynamic-combobox-donor";
import { DynamicComboboxReceiver } from "@/components/dynamic-combobox-receiver";
import { toast } from "sonner";

interface EditFormProps {
  productId: {
    id: number;
  };
  onSuccess?: (shouldInvalidate: boolean) => void;
}

export const EditProductForm = ({ productId, onSuccess }: EditFormProps) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<z.infer<typeof CreateProductSchema> | null>(null);

    // Carrega os dados do produto de forma assíncrona
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const productData = await getProductById(productId.id);
        if (productData) {
          setInitialValues({
            name: productData.name || "",
            quantity: productData.quantity?.toString() || "",
            unit: productData.unit,
            lot: productData.lot || "",
            validityDate: productData.validityDate || undefined,
            donor: productData.donor || undefined,
            receiptDate: productData.receiptDate || undefined,
            receiver: productData.receiver || "",
            group: productData.group || "",
            subgroup: productData.subgroup || undefined,
            productType: productData.productType || undefined,
          });
        }
      } catch (error) {
        console.error("Error loading product:", error);
        setError("Failed to load product data");
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [productId.id]);








  const form = useForm<z.infer<typeof CreateProductSchema>>({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {
      name: "",
      quantity: "",
      unit: undefined,
      lot: "",
      validityDate: undefined,
      donor: undefined,
      receiptDate: undefined,
      receiver: "",
      group: "",
      subgroup: undefined,
      productType: undefined,
    },
  });

  // Preenche o formulário quando os dados iniciais são carregados
  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    }
  }, [initialValues, form]);

  const selectedType = form.watch("productType");
  const detailsValue = form.watch("donor");

  // Determina se o input deve estar desabilitado
  const isDetailsDisabled =
    !selectedType || selectedType === ProductType.PURCHASED;

  // Efeito para limpar o valor quando o campo é desabilitado
  useEffect(() => {
    if (isDetailsDisabled && detailsValue) {
      form.setValue("donor", undefined, { shouldValidate: true });
    }
  }, [isDetailsDisabled, detailsValue, form]);

  const onSubmit = (values: z.infer<typeof CreateProductSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      editProduct(productId.id, values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
        if (data.success) {
          toast.success(data.success);
        } else {
          toast.error(data.error);
        }

        if (data.success && !data.error && onSuccess) {
          form.reset(); // Limpa o formulário
          onSuccess(true); // Fecha o diálogo
        }
      });
    });
  };

    if (isLoading) {
    return <div>Loading product data...</div>;
  }

  if (!initialValues) {
    return <div>Product not found or failed to load</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <div className="grid grid-cols-1 gap-4 items-start">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    className="default-height"
                    placeholder="Digit a name"
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
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      type="number"
                      className="default-height"
                      placeholder="Digit a quantity"
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
                  <FormLabel>Unit</FormLabel>
                  <div className="select-container">
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      defaultValue={field.value || ""}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={UnitMeasurement.KG}>KG</SelectItem>
                        <SelectItem value={UnitMeasurement.G}>G</SelectItem>
                        <SelectItem value={UnitMeasurement.L}>L</SelectItem>
                        <SelectItem value={UnitMeasurement.UN}>UN.</SelectItem>
                        <SelectItem value={UnitMeasurement.CX}>CX.</SelectItem>
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
                  <FormLabel>Lot</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      className="default-height"
                      placeholder="Digit a lot"
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
                  <FormLabel>Date of validity</FormLabel>
                  <FormControl>
                    <DatePickerMonthYear field={field} />
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
                  <FormLabel>Receiver</FormLabel>
                  <div className="select-container">
                     <DynamicComboboxReceiver
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isPending}
                      allowCreate={true}
                      allowDelete={true}
                      placeholder="Select a receiver..."
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
                  <FormLabel>Date of Receipt</FormLabel>
                  <FormControl>
                    <DatePickerMonthYear field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 items-start">
            <FormField
              control={form.control}
              name="group"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group</FormLabel>
                  <div className="select-container">
                    <DynamicComboboxGroup
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isPending}
                      allowCreate={true}
                      allowDelete={true}
                      placeholder="Select a group..."
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
                  <FormLabel>Subgroup (Optional)</FormLabel>
                  <div className="select-container">
                    <DynamicComboboxSubgroup
                      value={field.value!}
                      onChange={field.onChange}
                      disabled={isPending}
                      allowCreate={true}
                      allowDelete={true}
                      placeholder="Select a subgroup..."
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
                  <FormLabel>Product input type:</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col"
                    >
                      <FormItem className="flex items-center">
                        <FormControl>
                          <RadioGroupItem value={ProductType.DONATED} checked={field.value === ProductType.DONATED} />
                        </FormControl>
                        <FormLabel className="font-normal">Donated</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center">
                        <FormControl>
                          <RadioGroupItem value={ProductType.PURCHASED} checked={field.value === ProductType.PURCHASED} />
                        </FormControl>
                        <FormLabel className="font-normal">Purchased</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="donor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Donor</FormLabel>
                  <div className="select-container">
                    <DynamicComboboxDonor
                      value={field.value!}
                      onChange={field.onChange}
                      disabled={isDetailsDisabled}
                      allowCreate={true}
                      allowDelete={true}
                      placeholder={
                              isDetailsDisabled
                                ? "Select 'Donated' to enable"
                                : "Enter the donor"
                            }
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <FormError message={error} />
        <FormSuccess message={success} />
        <DialogFooter>
          <Button disabled={isPending} type="submit" size="sm">
            Update Product
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
