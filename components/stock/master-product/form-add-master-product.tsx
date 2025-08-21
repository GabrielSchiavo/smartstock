"use client";

import { useRef, useTransition } from "react";
import { FormBaseMasterProduct } from "@/components/stock/master-product/form-base-master-product";
import { registerMasterProduct } from "@/actions";
import { FormAddEditProps, ToastType } from "@/types";
import { z } from "zod";
import { CreateEditMasterProductSchema } from "@/schemas";
import { UseFormReturn } from "react-hook-form";
import { showToast } from "@/components/utils/show-toast";

export const FormAddMasterProduct = ({
  onShouldInvalidate,
  onCancel,
}: FormAddEditProps) => {
  const [isPending, startTransition] = useTransition();
  const formRef =
    useRef<UseFormReturn<z.infer<typeof CreateEditMasterProductSchema>>>(null);

  const onSubmit = async (values: z.infer<typeof CreateEditMasterProductSchema>) => {
    await startTransition(async () => {
      try {
        const response = await registerMasterProduct(values);

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
      <FormBaseMasterProduct
        onSubmit={onSubmit}
        onCancel={onCancel}
        isPending={isPending}
        submitButtonText="Salvar"
        loadingText="Criando..."
      />
    </div>
  );
};
