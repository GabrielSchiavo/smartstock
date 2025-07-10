"use client";

import { useRef, useTransition } from "react";
import { BaseProductForm } from "@/components/product/base-product-form";
import { registerProduct } from "@/actions";
import { AddEditFormProps, ProductType, ToastType, UnitType } from "@/types";
import { z } from "zod";
import { CreateEditProductSchema } from "@/schemas";
import { UseFormReturn } from "react-hook-form";
import { showToast } from "@/components/utils/show-toast";

export const AddProductForm = ({ onShouldInvalidate }: AddEditFormProps) => {
  const [isPending, startTransition] = useTransition();
  const formRef =
    useRef<UseFormReturn<z.infer<typeof CreateEditProductSchema>>>(null);

  const onSubmit = async (values: z.infer<typeof CreateEditProductSchema>) => {
    await startTransition(async () => {
      try {
        const response = await registerProduct(values);

        if (response.success === true) {
          formRef.current?.reset();

          // Reseta especificamente campos desabilitados
          if (values.productType !== ProductType.DONATED) {
            formRef.current?.setValue("donor", undefined);
          }

          if (values.unit !== UnitType.UN) {
            formRef.current?.setValue("unitWeight", undefined);
            formRef.current?.setValue("unitOfUnitWeight", undefined);
          }

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

  return (
    <div className="flex flex-col gap-4">
      <BaseProductForm
        onSubmit={onSubmit}
        isPending={isPending}
        submitButtonLabel="Criar Produto"
        loadingButtonLabel="Criando..."
      />
    </div>
  );
};
