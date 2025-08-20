"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { BaseProductForm } from "@/components/product/base-product-form";
import { getMasterItems, registerProduct } from "@/actions";
import { AddEditFormProps, ToastType } from "@/types";
import { z } from "zod";
import { CreateEditProductSchema } from "@/schemas";
import { UseFormReturn } from "react-hook-form";
import { showToast } from "@/components/utils/show-toast";
import { MasterItem } from "@prisma/client";

export const AddProductForm = ({
  onShouldInvalidate,
  onCancel,
}: AddEditFormProps) => {
  const [isPending, startTransition] = useTransition();
  const formRef =
    useRef<UseFormReturn<z.infer<typeof CreateEditProductSchema>>>(null);

  const [masterItems, setMasterItems] = useState<MasterItem[]>([]);

    // Carregue os master items no useEffect ou via server component
   useEffect(() => {
     async function loadMasterItems() {
       try {
         const items = await getMasterItems();
         setMasterItems(items);
       } catch (error) {
         console.error("Erro ao carregar produtos mestres:", error);
       }
     }
     loadMasterItems();
   }, []);

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
        masterItems={masterItems}
        onSubmit={onSubmit}
        onCancel={onCancel}
        isPending={isPending}
        submitButtonText="Salvar"
        loadingText="Criando..."
      />
    </div>
  );
};
