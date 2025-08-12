"use client";

import { BaseUserForm } from "@/components/user/base-user-form";
import { registerUser } from "@/actions";
import { AddEditFormProps } from "@/types";
import { CreateUserSchema } from "@/schemas";

export const AddUserForm = ({ onShouldInvalidate, onCancel }: AddEditFormProps) => {
  return (
    <BaseUserForm
      schema={CreateUserSchema}
      onSubmit={registerUser}
      onCancel={onCancel}
      onSuccess={() => onShouldInvalidate?.(true)}
      submitButtonText="Salvar"
      loadingText="Criando..."
      hidePasswordInputs={false}
      isEditForm={false}
    />
  );
};
