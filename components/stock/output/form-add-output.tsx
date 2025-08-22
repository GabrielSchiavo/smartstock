"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { getProducts, registerOutput } from "@/actions";
import {
  FormAddEditProps,
  ProductWithMasterProductResponse,
  ToastType,
} from "@/types";
import { z } from "zod";
import { CreateProductOutputSchema } from "@/schemas";
import { UseFormReturn } from "react-hook-form";
import { showToast } from "@/components/utils/show-toast";
import { FormBaseOutput } from "@/components/stock/output/form-base-output";

export const FormAddOutput = ({
  onShouldInvalidate,
  onCancel,
}: FormAddEditProps) => {
  const [isPending, startTransition] = useTransition();
  const formRef =
    useRef<UseFormReturn<z.infer<typeof CreateProductOutputSchema>>>(null);

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
    values: z.infer<typeof CreateProductOutputSchema>
  ) => {
    await startTransition(async () => {
      try {
        const response = await registerOutput(values);

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
      <FormBaseOutput
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
