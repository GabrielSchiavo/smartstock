"use client";

import { useEffect, useState } from "react";
import { BaseFormUser } from "@/components/user/base-form-user";
import { editUser, getUserById } from "@/actions";
import { FormAddEditProps, ToastType } from "@/types";
import { UserType } from "@/types";
import { MessageError } from "@/components/utils/message-error";
import { EditUserSchema } from "@/schemas";
import { z } from "zod";
import { showToast } from "@/components/utils/show-toast";
import { Spinner } from "@/components/ui/spinner";

export const FormEditUser = ({
  rowItemId,
  onShouldInvalidate,
  onCancel,
}: FormAddEditProps) => {
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
          <Spinner className="size-5 shrink-0" />
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
    <BaseFormUser
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
