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
import { DynamicComboboxGroup } from "@/components/dynamic-combobox-group";
import { DynamicComboboxSubgroup } from "@/components/dynamic-combobox-subgroup";
import { DynamicComboboxDonor } from "@/components/dynamic-combobox-donor";
import { DynamicComboboxReceiver } from "@/components/dynamic-combobox-receiver";
import { toast } from "sonner";
import { ProductType, UnitType } from "@/types/index.enums";

interface EditFormProps {
  rowItemId: number;
  onSuccess?: (shouldInvalidate: boolean) => void;
}

export const EditProductForm = ({ rowItemId, onSuccess }: EditFormProps) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<z.infer<
    typeof CreateProductSchema
  > | null>(null);

  // Carrega os dados do produto de forma assíncrona
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const productData = await getProductById(rowItemId);
        if (productData) {
          setInitialValues({
            name: productData.name || "",
            quantity: productData.quantity?.toString() || "",
            unit: productData.unit as UnitType,
            lot: productData.lot || "",
            validityDate: productData.validityDate || undefined,
            donor: productData.donor || undefined,
            receiptDate: productData.receiptDate || undefined,
            receiver: productData.receiver || "",
            group: productData.group || "",
            subgroup: productData.subgroup || undefined,
            productType: productData.productType as ProductType || undefined,
          });
        }
      } catch (error) {
        console.error("Erro ao carregar o produto:", error);
        setError("Falha ao carregar dados do produto");
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [rowItemId]);

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
      editProduct(rowItemId, values)
        .then((data) => {
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
        })
        .catch(() => {
          setError("Algo deu errado!");
          toast.error("Algo deu errado!");
        });
    });
  };

  if (isLoading) {
    return <div>Carregando dados do produto...</div>;
  }

  if (!initialValues) {
    return <div>Produto não encontrado ou não foi carregado</div>;
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
                      defaultValue={field.value || ""}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a unidade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={UnitType.KG}>KG</SelectItem>
                        <SelectItem value={UnitType.G}>G</SelectItem>
                        <SelectItem value={UnitType.L}>L</SelectItem>
                        <SelectItem value={UnitType.UN}>UN.</SelectItem>
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
                  <FormLabel>Data de Validade</FormLabel>
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
                  <FormLabel>Recebedor</FormLabel>
                  <div className="select-container relative w-full min-w-0">
                    <DynamicComboboxReceiver
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isPending}
                      allowCreate={true}
                      allowDelete={true}
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
                  <FormLabel>Grupo</FormLabel>
                  <div className="select-container relative w-full min-w-0">
                    <DynamicComboboxGroup
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isPending}
                      allowCreate={true}
                      allowDelete={true}
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
                    <DynamicComboboxSubgroup
                      value={field.value!}
                      onChange={field.onChange}
                      disabled={isPending}
                      allowCreate={true}
                      allowDelete={true}
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
                      defaultValue={field.value}
                      className="flex flex-col"
                    >
                      <FormItem className="flex items-center">
                        <FormControl>
                          <RadioGroupItem
                            value={ProductType.DONATED}
                            checked={field.value === ProductType.DONATED}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">Doado</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center">
                        <FormControl>
                          <RadioGroupItem
                            value={ProductType.PURCHASED}
                            checked={field.value === ProductType.PURCHASED}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">Comprado</FormLabel>
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
                  <FormLabel>Doador</FormLabel>
                  <div className="select-container relative w-full min-w-0">
                    <DynamicComboboxDonor
                      value={field.value!}
                      onChange={field.onChange}
                      disabled={isDetailsDisabled}
                      allowCreate={true}
                      allowDelete={true}
                      placeholder={
                        isDetailsDisabled
                          ? "Selecione 'Doado' para habilitar"
                          : "Digite o Doador"
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
