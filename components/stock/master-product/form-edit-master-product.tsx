"use client";

import { useState, useEffect, useTransition, useRef } from "react";
import { BaseFormMasterProduct } from "@/components/stock/master-product/base-form-master-product";
import { editMasterProduct, getMasterProductById } from "@/actions";
import { FormAddEditProps, ToastType, BaseUnitType } from "@/types";
import { MessageError } from "@/components/utils/message-error";
import { MoonLoader } from "react-spinners";
import { CreateEditMasterProductSchema } from "@/schemas";
import { z } from "zod";
import { showToast } from "@/components/utils/show-toast";
import { UseFormReturn } from "react-hook-form";

export const FormEditMasterProduct = ({
  rowItemId,
  onShouldInvalidate,
  onCancel,
}: FormAddEditProps) => {
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<z.infer<
    typeof CreateEditMasterProductSchema
  > | null>(null);
  const formRef =
    useRef<UseFormReturn<z.infer<typeof CreateEditMasterProductSchema>>>(null);

  useEffect(() => {
    const loadMasterProduct = async () => {
      try {
        const masterProductData = await getMasterProductById(rowItemId as number);
        if (masterProductData) {
          if (masterProductData) {
            setInitialValues({
              name: masterProductData.name,
              baseUnit: masterProductData.baseUnit as BaseUnitType,
              categoryId: masterProductData.categoryId,
              groupId: masterProductData.groupId,
              subgroupId: masterProductData.subgroupId || null,
            });
          }
        }
      } catch (error) {
        console.error("Erro ao carregar o produto mestre:", error);
        showToast({
          title: "Erro!",
          description: "Não foi possível carregar os dados do produto mestre.",
          type: ToastType.ERROR,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadMasterProduct();
  }, [rowItemId]);

  const onSubmit = async (values: z.infer<typeof CreateEditMasterProductSchema>) => {
    await startTransition(async () => {
      try {
        const response = await editMasterProduct(rowItemId as number, values);

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
      <BaseFormMasterProduct
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
