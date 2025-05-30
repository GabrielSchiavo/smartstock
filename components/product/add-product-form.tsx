"use client";

import { useRef, useState, useTransition } from "react";
import { BaseProductForm } from "@/components/product/base-product-form";
import { registerProduct } from "@/actions";
import { toast } from "sonner";
import { AddEditFormProps } from "@/types";
import { z } from "zod";
import { CreateEditProductSchema } from "@/schemas";
import { MessageError } from "@/components/utils/message-error";
import { MessageSuccess } from "@/components/utils/message-success";
import { UseFormReturn } from "react-hook-form";

export const AddProductForm = ({ onShouldInvalidate }: AddEditFormProps) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<UseFormReturn<z.infer<typeof CreateEditProductSchema>>>(null);

  const onSubmit = async (values: z.infer<typeof CreateEditProductSchema>) => {
    setError("");
    setSuccess("");

    await startTransition(async () => {
      try {
        const data = await registerProduct(values);
        setError(data.error);
        setSuccess(data.success);

        if (data.success) {
          toast.success(data.success);
          formRef.current?.reset();
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

  return (
    <div className="flex flex-col gap-4">
      <BaseProductForm
        onSubmit={onSubmit}
        isPending={isPending}
        submitButtonLabel="Criar Produto"
        loadingButtonLabel="Criando..."
      />
      <MessageError message={error} />
      <MessageSuccess message={success} />
    </div>
  );
};
