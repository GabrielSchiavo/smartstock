"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { getProducts, registerOutput } from "@/actions";
import {
  FormAddEditProps,
  ProductWithMasterProductResponse,
  ToastType,
} from "@/types";
import { z } from "zod";
import { CreateOutputSchema } from "@/schemas";
import { UseFormReturn } from "react-hook-form";
import { showToast } from "@/components/utils/show-toast";
import { BaseFormOutput } from "@/components/stock/output/base-form-output";

export const FormAddOutput = ({ onShouldInvalidate, onCancel }: FormAddEditProps) => {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<UseFormReturn<z.infer<typeof CreateOutputSchema>> | null>(null);

  const [products, setMasterProducts] = useState<ProductWithMasterProductResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // função reutilizável de carregar produtos
  const loadProductsSelector = async () => {
    try {
      const items = await getProducts();
      // marca como transição para não bloquear a UI
      startTransition(() => {
        setMasterProducts(items);
        setIsLoading(false);
      });
    } catch (error) {
      setIsLoading(false);
      showToast({
        title: "Erro!",
        description: "Não foi possível carregar os produtos",
        type: ToastType.ERROR,
      });
      console.error("Erro! Não foi possível carregar os produtos:", error);
    }
  };

  useEffect(() => {
    loadProductsSelector();
  }, []);

  const onSubmit = async (values: z.infer<typeof CreateOutputSchema>) => {
    try {
      // chame a action do servidor e aguarde o resultado
      const response = await registerOutput(values);

      if (response.success === true) {
        formRef.current?.reset();

        // sinaliza para o pai se aplicado
        onShouldInvalidate?.(true);

        // garante que o cliente recarregue a lista de produtos imediatamente
        await loadProductsSelector();
      }

      showToast({
        title: response.title,
        description: response.description,
        type: response.success ? ToastType.SUCCESS : ToastType.ERROR,
      });
    } catch (error) {
      console.error("Erro ao submeter saída:", error);
      showToast({
        title: "Algo deu errado!",
        type: ToastType.ERROR,
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <BaseFormOutput
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
