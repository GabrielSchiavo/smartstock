"use client";

import { useRef, useTransition } from "react";
import { BaseProductForm } from "@/components/product/base-product-form";
import { registerProduct } from "@/actions";
import { AddEditFormProps, ToastType } from "@/types";
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
