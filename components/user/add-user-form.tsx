"use client";

import { BaseUserForm } from "@/components/user/base-user-form";
import { registerUser } from "@/actions";
import { AddEditFormProps } from "@/types";
import { CreateUserSchema } from "@/schemas";

export const AddUserForm = ({ onShouldInvalidate }: AddEditFormProps) => {
  return (
    <BaseUserForm
      schema={CreateUserSchema}
      onSubmit={registerUser}
      onSuccess={() => onShouldInvalidate?.(true)}
      submitButtonText="Criar Usuário"
      loadingText="Criando..."
      hidePasswordInputs={false}
      isEditForm={false}
    />
  );
};
