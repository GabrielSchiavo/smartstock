"use client";

import { useForm } from "react-hook-form";
import { CreateUserSchema } from "@/schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { registerUser } from "@/actions/user";
import { useState, useTransition } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PasswordInput } from "@/components/auth/input-password";
import { DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { ToolTipHelpUser } from "@/components/user/tool-tip-help-user";
import { UserType } from "@/types/index.enums";

interface AddFormProps {
  onSuccess?: (shouldInvalidate: boolean) => void;
}

export const AddUserForm = ({ onSuccess }: AddFormProps) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof CreateUserSchema>>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      userType: undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof CreateUserSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      registerUser(values)
        .then((data) => {
          setError(data.error);
          setSuccess(data.success);
          if (data.success) {
            toast.success(data.success);
          } else {
            toast.error(data.error);
          }

          // Fechar o diálogo se não houver erro e onSuccess foi fornecido
          if (data.success && !data.error && onSuccess) {
            form.reset(); // Limpa o formulário
            onSuccess(true); // Fecha o diálogo
            // window.location.reload(); // Recarrega a página
          }
        })
        .catch(() => {
          setError("Algo deu errado!");
          toast.error("Algo deu errado!");
        });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <div className="grid grid-cols-1 gap-4 items-start">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="Nome do usuário"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="exemplo@exemplo.com"
                    type="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <PasswordInput
                    disabled={isPending}
                    className="default-height"
                    placeholder="********"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar Senha</FormLabel>
                <FormControl>
                  <PasswordInput
                    disabled={isPending}
                    className="default-height"
                    placeholder="********"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="userType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  Tipo de usuário:
                  <ToolTipHelpUser />
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col"
                  >
                    <FormItem className="flex items-center">
                      <FormControl>
                        <RadioGroupItem value={UserType.ADMIN} />
                      </FormControl>
                      <FormLabel className="font-normal">Admin</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center">
                      <FormControl>
                        <RadioGroupItem value={UserType.DEFAULT} />
                      </FormControl>
                      <FormLabel className="font-normal">Padrão</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center">
                      <FormControl>
                        <RadioGroupItem value={UserType.CADASTRE} />
                      </FormControl>
                      <FormLabel className="font-normal">Cadastro</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center">
                      <FormControl>
                        <RadioGroupItem value={UserType.REPORT} />
                      </FormControl>
                      <FormLabel className="font-normal">Relatório</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormError message={error} />
        <FormSuccess message={success} />
        <DialogFooter>
          <Button disabled={isPending} type="submit" size="sm">
            Criar Usuário
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
