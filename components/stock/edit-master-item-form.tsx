"use client";

import { useState, useEffect, useTransition, useRef } from "react";
import { BaseMasterItemForm } from "@/components/stock/base-master-item-form";
import { editMasterItem, getMasterItemById } from "@/actions";
import { AddEditFormProps, ToastType, UnitType } from "@/types";
import { MessageError } from "@/components/utils/message-error";
import { MoonLoader } from "react-spinners";
import { CreateEditMasterItemSchema } from "@/schemas";
import { z } from "zod";
import { showToast } from "@/components/utils/show-toast";
import { UseFormReturn } from "react-hook-form";

export const EditMasterItemForm = ({
  rowItemId,
  onShouldInvalidate,
  onCancel,
}: AddEditFormProps) => {
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<z.infer<
    typeof CreateEditMasterItemSchema
  > | null>(null);
  const formRef =
    useRef<UseFormReturn<z.infer<typeof CreateEditMasterItemSchema>>>(null);

  useEffect(() => {
    const loadMasterItem = async () => {
      try {
        const masterItemData = await getMasterItemById(rowItemId as number);
        if (masterItemData) {
          if (masterItemData) {
            setInitialValues({
              name: masterItemData.name,
              baseUnit: masterItemData.baseUnit as UnitType,
              category: masterItemData.category,
              group: masterItemData.group,
              subgroup: masterItemData.subgroup || undefined,
            });
          }
        }
      } catch (error) {
        console.error("Erro ao carregar o item mestre:", error);
        showToast({
          title: "Erro!",
          description: "Não foi possível carregar os dados do item mestre.",
          type: ToastType.ERROR,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadMasterItem();
  }, [rowItemId]);

  const onSubmit = async (values: z.infer<typeof CreateEditMasterItemSchema>) => {
    await startTransition(async () => {
      try {
        const response = await editMasterItem(rowItemId as number, values);

        if (response.success === true) {
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

  if (isLoading) {
    return (
      <div className="w-full flex justify-center">
        <span className="flex items-center text-muted-foreground gap-3">
          <MoonLoader size={22} color="#71717b" />
          {"Carregando dados..."}
        </span>
      </div>
    );
  }

  if (!initialValues) {
    return (
      <MessageError message="Registro não encontrado ou erro ao carregar dados." />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <BaseMasterItemForm
        ref={formRef}
        defaultValues={initialValues}
        onSubmit={onSubmit}
        onCancel={onCancel}
        isPending={isPending}
        submitButtonText="Salvar"
        loadingText="Atualizando..."
      />
    </div>
  );
};
