"use client";

import { FormBaseUser } from "@/components/user/form-base-user";
import { registerUser } from "@/actions";
import { FormAddEditProps } from "@/types";
import { CreateUserSchema } from "@/schemas";

export const FormAddUser = ({ onShouldInvalidate, onCancel }: FormAddEditProps) => {
  return (
    <FormBaseUser
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
