"use client";

import { useRef, useTransition } from "react";
import { BaseMasterItemForm } from "@/components/stock/master-item/base-master-item-form";
import { registerMasterItem } from "@/actions";
import { AddEditFormProps, ToastType } from "@/types";
import { z } from "zod";
import { CreateEditMasterItemSchema } from "@/schemas";
import { UseFormReturn } from "react-hook-form";
import { showToast } from "@/components/utils/show-toast";

export const AddMasterItemForm = ({
  onShouldInvalidate,
  onCancel,
}: AddEditFormProps) => {
  const [isPending, startTransition] = useTransition();
  const formRef =
    useRef<UseFormReturn<z.infer<typeof CreateEditMasterItemSchema>>>(null);

  const onSubmit = async (values: z.infer<typeof CreateEditMasterItemSchema>) => {
    await startTransition(async () => {
      try {
        const response = await registerMasterItem(values);

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
      <BaseMasterItemForm
        onSubmit={onSubmit}
        onCancel={onCancel}
        isPending={isPending}
        submitButtonText="Salvar"
        loadingText="Criando..."
      />
    </div>
  );
};
