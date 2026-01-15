"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { getMasterProducts, registerInput } from "@/actions";
import { FormAddEditProps, MasterProductWithCategoryGroupSubgroupResponse, ToastType } from "@/types";
import { z } from "zod";
import { CreateInputEditProductSchema } from "@/schemas";
import { UseFormReturn } from "react-hook-form";
import { showToast } from "@/components/utils/show-toast";
import { BaseFormInput } from "@/components/stock/input/base-form-input";

export const FormAddInput = ({ onShouldInvalidate, onCancel }: FormAddEditProps) => {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<UseFormReturn<z.infer<typeof CreateInputEditProductSchema>> | null>(null);

  const [masterProducts, setMasterProducts] = useState<MasterProductWithCategoryGroupSubgroupResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // função carregar produtos mestres
  const loadMasterProductsSelector = async () => {
    try {
      const items = await getMasterProducts();
      // colocar a atualização de estado dentro de startTransition para não bloquear a UI
      startTransition(() => {
        setMasterProducts(items);
        setIsLoading(false);
      });
    } catch (error) {
      setIsLoading(false);
      showToast({
        title: "Erro!",
        description: "Não foi possível carregar os produtos mestre",
        type: ToastType.ERROR,
      });
      console.error("Erro! Não foi possível carregar os produtos mestre:", error);
    }
  };

  useEffect(() => {
    loadMasterProductsSelector();
  }, []);

  const onSubmit = async (values: z.infer<typeof CreateInputEditProductSchema>) => {
    try {
      const response = await registerInput(values);

      if (response.success === true) {
        formRef.current?.reset();

        onShouldInvalidate?.(true);

        // refetch imediato dos produtos mestre para atualizar a UI do cliente
        await loadMasterProductsSelector();
      }

      showToast({
        title: response.title,
        description: response.description,
        type: response.success ? ToastType.SUCCESS : ToastType.ERROR,
      });
    } catch (err) {
      console.error("Erro ao submeter entrada:", err);
      showToast({
        title: "Algo deu errado!",
        type: ToastType.ERROR,
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <BaseFormInput
        masterProducts={masterProducts}
        isLoading={isLoading}
        ref={formRef}
        onSubmit={onSubmit}
        onCancel={onCancel}
        isPending={isPending}
        submitButtonText="Salvar"
        loadingText="Criando..."
      />
    </div>
  );
};
