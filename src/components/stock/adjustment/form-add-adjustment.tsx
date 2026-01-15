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

export const FormAddAdjustment = ({ onShouldInvalidate, onCancel }: FormAddEditProps) => {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<UseFormReturn<z.infer<typeof CreateAdjustmentSchema>> | null>(null);

  const [products, setMasterProducts] = useState<ProductWithMasterProductResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // função reutilizável de carregar produtos
  const loadProductsSelector = async () => {
    try {
      const items = await getProducts();
      startTransition(() => {
        setMasterProducts(items);
        setIsLoading(false);
      });
    } catch (error) {
      setIsLoading(false);
      console.error("Erro ao carregar produtos:", error);
    }
  };

  useEffect(() => {
    loadProductsSelector();
  }, []);

  const onSubmit = async (values: z.infer<typeof CreateAdjustmentSchema>) => {
    try {
      const response = await registerAdjustment(values);

      if (response.success === true) {
        formRef.current?.reset();

        onShouldInvalidate?.(true);

        // refetch imediato dos produtos para atualizar a UI do cliente
        await loadProductsSelector();
      }

      showToast({
        title: response.title,
        description: response.description,
        type: response.success ? ToastType.SUCCESS : ToastType.ERROR,
      });
    } catch (err) {
      console.error("Erro ao submeter ajuste:", err);
      showToast({
        title: "Algo deu errado!",
        type: ToastType.ERROR,
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <BaseFormAdjustment
        ref={formRef}
        products={products}
        isLoading={isLoading}
        onSubmit={onSubmit}
        onCancel={onCancel}
        isPending={isPending}
        submitButtonText="Salvar"
        loadingText="Criando..."
      />
    </div>
  );
};
