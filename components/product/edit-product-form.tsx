"use client";

import { useState, useEffect, useTransition, useRef } from "react";
import { BaseProductForm } from "@/components/product/base-product-form";
import { editProduct, getProductById } from "@/actions";
import { AddEditFormProps, ProductType, ToastType, UnitType } from "@/types";
import { MessageError } from "@/components/utils/message-error";
import { MoonLoader } from "react-spinners";
import { CreateEditProductSchema } from "@/schemas";
import { z } from "zod";
import { showToast } from "@/components/utils/show-toast";
import { UseFormReturn } from "react-hook-form";

export const EditProductForm = ({
  rowItemId,
  onShouldInvalidate,
  onCancel,
}: AddEditFormProps) => {
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<z.infer<
    typeof CreateEditProductSchema
  > | null>(null);
  const formRef =
    useRef<UseFormReturn<z.infer<typeof CreateEditProductSchema>>>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const productData = await getProductById(rowItemId as number);
        if (productData) {
          if (productData) {
            setInitialValues({
              masterProductId: "",
              name: productData.name,
              quantity: productData.quantity?.toString(),
              unit: productData.unit as UnitType,
              unitWeight: productData.unitWeight?.toString() || "",
              unitOfUnitWeight: productData.unitOfUnitWeight as
                | UnitType.KG
                | UnitType.G
                | UnitType.L
                | undefined,
              lot: productData.lot,
              validityDate: productData.validityDate,
              supplier: productData.supplier || undefined,
              receiptDate: productData.receiptDate,
              receiver: productData.receiver,
              category: "",
              group: productData.group,
              subgroup: productData.subgroup || undefined,
              productType: productData.productType as ProductType,
            });
          }
        }
      } catch (error) {
        console.error("Erro ao carregar o produto:", error);
        showToast({
          title: "Erro!",
          description: "Não foi possível carregar os dados do produto.",
          type: ToastType.ERROR,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [rowItemId]);

  const onSubmit = async (values: z.infer<typeof CreateEditProductSchema>) => {
    await startTransition(async () => {
      try {
        const response = await editProduct(rowItemId as number, values);

        if (response.success === true) {
          onShouldInvalidate?.(true);
        }

        showToast({
          title: response.title,
          description: response.description,
          type: response.success ? ToastType.SUCCESS : ToastType.ERROR,
        });
      } catch {
        showToast({
          title: "Algo deu errado!",
          type: ToastType.ERROR,
        });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center">
        <span className="flex items-center text-muted-foreground gap-3">
          <MoonLoader size={22} color="#71717b" />
          {"Carregando dados..."}
        </span>
      </div>
    );
  }

  if (!initialValues) {
    return (
      <MessageError message="Registro não encontrado ou erro ao carregar dados." />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <BaseProductForm
        ref={formRef}
        defaultValues={initialValues}
        onSubmit={onSubmit}
        onCancel={onCancel}
        isPending={isPending}
        submitButtonText="Salvar"
        loadingText="Atualizando..."
      />
    </div>
  );
};
