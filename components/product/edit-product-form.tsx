"use client";

import { useState, useEffect, useTransition } from "react";
import { BaseProductForm } from "@/components/product/base-product-form";
import { editProduct, getProductById } from "@/actions";
import { toast } from "sonner";
import { AddEditFormProps, ProductType, UnitType } from "@/types";
import { MessageError } from "@/components/utils/message-error";
import { MoonLoader } from "react-spinners";
import { CreateEditProductSchema } from "@/schemas";
import { z } from "zod";
import { MessageSuccess } from "@/components/utils/message-success";

export const EditProductForm = ({
  rowItemId,
  onShouldInvalidate,
}: AddEditFormProps) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<z.infer<
    typeof CreateEditProductSchema
  > | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const productData = await getProductById(rowItemId as number);
        if (productData) {
          if (productData) {
            setInitialValues({
              name: productData.name || "",
              quantity: productData.quantity?.toString() || "",
              unit: productData.unit as UnitType,
              unitWeight: productData.unitWeight?.toString() || "",
              unitOfUnitWeight: productData.unitOfUnitWeight as
                | UnitType.KG
                | UnitType.G
                | UnitType.L,
              lot: productData.lot || "",
              validityDate: productData.validityDate || undefined,
              donor: productData.donor || undefined,
              receiptDate: productData.receiptDate || undefined,
              receiver: productData.receiver || "",
              group: productData.group || "",
              subgroup: productData.subgroup || undefined,
              productType:
                (productData.productType as ProductType) || undefined,
            });
          }
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

  const onSubmit = async (values: z.infer<typeof CreateEditProductSchema>) => {
    setError("");
    setSuccess("");

    await startTransition(async () => {
      try {
        const data = await editProduct(rowItemId as number, values);
        setError(data.error);
        setSuccess(data.success);

        if (data.success) {
          toast.success(data.success);
          onShouldInvalidate?.(true);
        } else if (data.error) {
          toast.error(data.error);
        }
      } catch {
        setError("Algo deu errado!");
        toast.error("Algo deu errado!");
      }
    });
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center">
        <span className="flex items-center text-muted-foreground gap-3">
          <MoonLoader size={20} color="#71717b" />
          {"Carregando dados..."}
        </span>
      </div>
    );
  }

  if (!initialValues) {
    return (
      <MessageError message="Registro não encontrado ou falha ao carregar dados" />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <BaseProductForm
        defaultValues={initialValues}
        onSubmit={onSubmit}
        isPending={isPending}
        submitButtonLabel="Atualizar Produto"
        loadingButtonLabel="Atualizando..."
      />
      <MessageError message={error} />
      <MessageSuccess message={success} />
    </div>
  );
};
