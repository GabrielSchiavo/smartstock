"use client";

import { useEffect, useState } from "react";
import { BaseUserForm } from "@/components/user/base-user-form";
import { editUser, getUserById } from "@/actions";
import { AddEditFormProps, ToastType } from "@/types";
import { UserType } from "@/types";
import { MoonLoader } from "react-spinners";
import { MessageError } from "@/components/utils/message-error";
import { EditUserSchema } from "@/schemas";
import { z } from "zod";
import { showToast } from "@/components/utils/show-toast";

export const EditUserForm = ({
  rowItemId,
  onShouldInvalidate,
  onCancel,
}: AddEditFormProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<z.infer<
    typeof EditUserSchema
  > | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await getUserById(rowItemId as string);
        if (userData) {
          setInitialValues({
            name: userData.name || "",
            email: userData.email || "",
            password: undefined,
            confirmPassword: undefined,
            userType: (userData.role as UserType) || undefined,
          });
        }
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
        showToast({
          title: "Erro!",
          description: "Não foi possível carregar os dados do usuário.",
          type: ToastType.ERROR,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [rowItemId]);

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
    <BaseUserForm
      schema={EditUserSchema}
      defaultValues={initialValues}
      onSubmit={(values) => editUser(rowItemId as string, values)}
      onCancel={onCancel}
      onSuccess={() => onShouldInvalidate?.(true)}
      submitButtonText="Salvar"
      loadingText="Salvando..."
      hidePasswordInputs={false}
      isEditForm={true}
    />
  );
};
