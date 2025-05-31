"use client";

import { useEffect, useState } from "react";
import { BaseUserForm } from "@/components/user/base-user-form";
import { editUser, getUserById } from "@/actions";
import { AddEditFormProps } from "@/types";
import { UserType } from "@/types";
import { MoonLoader } from "react-spinners";
import { MessageError } from "@/components/utils/message-error";
import { EditUserSchema } from "@/schemas";
import { z } from "zod";

export const EditUserForm = ({
  rowItemId,
  onShouldInvalidate,
}: AddEditFormProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<z.infer<
    typeof EditUserSchema
  > | null>(null);
  const [error, setError] = useState<string | undefined>("");

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
        console.error("Erro ao carregar usuário:", error);
        setError("Falha ao carregar dados do usuário");
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
          <MoonLoader size={20} color="#71717b" />
          {"Carregando dados..."}
        </span>
      </div>
    );
  }

  if (!initialValues) {
    return <MessageError message={error || "Registro não encontrado"} />;
  }

  return (
    <BaseUserForm
      schema={EditUserSchema}
      defaultValues={initialValues}
      onSubmit={(values) => editUser(rowItemId as string, values)}
      onSuccess={() => onShouldInvalidate?.(true)}
      submitButtonText="Salvar Alterações"
      loadingText="Salvando..."
      isEdit={false}
    />
  );
};