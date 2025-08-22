"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { getMasterProducts, registerProduct } from "@/actions";
import { FormAddEditProps, ToastType } from "@/types";
import { z } from "zod";
import { CreateEditProductSchema } from "@/schemas";
import { UseFormReturn } from "react-hook-form";
import { showToast } from "@/components/utils/show-toast";
import { MasterProduct } from "@prisma/client";
import { FormBaseInputProduct } from "../product/form-base-input-product";

export const FormAddInput = ({
  onShouldInvalidate,
  onCancel,
}: FormAddEditProps) => {
  const [isPending, startTransition] = useTransition();
  const formRef =
    useRef<UseFormReturn<z.infer<typeof CreateEditProductSchema>>>(null);

  const [masterProducts, setMasterProducts] = useState<MasterProduct[]>([]);

  // Carregue os master items no useEffect ou via server component
  useEffect(() => {
    async function loadMasterProducts() {
      try {
        const items = await getMasterProducts();
        setMasterProducts(items);
      } catch (error) {
        console.error("Erro ao carregar produtos mestres:", error);
      }
    }
    loadMasterProducts();
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
      <FormBaseInputProduct
        masterProducts={masterProducts}
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
