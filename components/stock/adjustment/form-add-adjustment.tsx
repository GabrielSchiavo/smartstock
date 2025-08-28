"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { getProducts, registerAdjustment } from "@/actions";
import {
  FormAddEditProps,
  ProductWithMasterProductResponse,
  ToastType,
} from "@/types";
import { z } from "zod";
import { CreateAdjustmentSchema } from "@/schemas";
import { UseFormReturn } from "react-hook-form";
import { showToast } from "@/components/utils/show-toast";
import { BaseFormAdjustment } from "@/components/stock/adjustment/base-form-adjustment";

export const FormAddAdjustment = ({
  onShouldInvalidate,
  onCancel,
}: FormAddEditProps) => {
  const [isPending, startTransition] = useTransition();
  const formRef =
    useRef<UseFormReturn<z.infer<typeof CreateAdjustmentSchema>>>(null);

  const [products, setMasterProducts] = useState<
    ProductWithMasterProductResponse[]
  >([]);
  // Carregue os master items no useEffect ou via server component
  useEffect(() => {
    async function loadMasterProducts() {
      try {
        const items = await getProducts();
        setMasterProducts(items);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      }
    }
    loadMasterProducts();
  }, []);

  const onSubmit = async (
    values: z.infer<typeof CreateAdjustmentSchema>
  ) => {
    await startTransition(async () => {
      try {
        const response = await registerAdjustment(values);

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
      <BaseFormAdjustment
        ref={formRef}
        products={products}
        onSubmit={onSubmit}
        onCancel={onCancel}
        isPending={isPending}
        submitButtonText="Salvar"
        loadingText="Criando..."
      />
    </div>
  );
};
