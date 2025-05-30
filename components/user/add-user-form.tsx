"use client";

import { UserFormBase } from "./base-user-form";
import { registerUser } from "@/actions";
import { AddEditFormProps } from "@/types";
import { CreateUserSchema } from "@/schemas";

export const AddUserForm = ({ onShouldInvalidate }: AddEditFormProps) => {
  return (
    <UserFormBase
      schema={CreateUserSchema}
      onSubmit={registerUser}
      onSuccess={() => onShouldInvalidate?.(true)}
      submitButtonText="Criar Usuário"
      loadingText="Criando..."
    />
  );
};
