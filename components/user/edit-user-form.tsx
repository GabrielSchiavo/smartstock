"use client";

import { useForm } from "react-hook-form";
import { EditUserSchema } from "@/schemas";
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
import { MessageError } from "@/components/message-error";
import { MessageSuccess } from "@/components/message-success";
import { editUser, getUserById } from "@/actions/user";
import { useEffect, useState, useTransition } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PasswordInput } from "@/components/auth/input-password";
import { DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { ToolTipHelpUser } from "@/components/user/tool-tip-help-user";
import { UserType } from "@/types";
import { AddEditFormProps } from "@/types";

export const EditUserForm = ({ rowItemId, onShouldInvalidate }: AddEditFormProps) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const [isLoading, setIsLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<z.infer<
    typeof EditUserSchema
  > | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const productData = await getUserById(rowItemId as string);
        if (productData) {
          setInitialValues({
            name: productData.name || "",
            email: productData.email || "",
            password: undefined,
            confirmPassword: undefined,
            userType: productData.role as UserType || undefined,
          });
        }
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
        setError("Falha ao carregar dados de usuários");
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [rowItemId]);

  const form = useForm<z.infer<typeof EditUserSchema>>({
    resolver: zodResolver(EditUserSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      userType: undefined,
    },
  });

  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    }
  }, [initialValues, form]);

  const onSubmit = (values: z.infer<typeof EditUserSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      editUser(rowItemId as string, values)
        .then((data) => {
          setError(data.error);
          setSuccess(data.success);

          if (data.success) {
            toast.success(data.success);
          } else {
            toast.error(data.error);
          }

          // Fechar o diálogo se não houver erro e onShouldInvalidate foi fornecido
          if (data.success && !data.error && onShouldInvalidate) {
            form.reset(); // Limpa o formulário
            onShouldInvalidate(true); // Fecha o diálogo
          }
        })
        .catch(() => {
          setError("Algo deu errado!");
          toast.error("Algo deu errado!");
        });
    });
  };

  if (isLoading) {
    return <div>Carregando dados do usuário...</div>;
  }

  if (!initialValues) {
    return <div>Usuário não encontrado ou falha ao carregar</div>;
  }

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
                <FormLabel>Confirme a senha</FormLabel>
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
                        <RadioGroupItem
                          value={UserType.ADMIN}
                          checked={field.value === UserType.ADMIN}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Admin</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center">
                      <FormControl>
                        <RadioGroupItem
                          value={UserType.DEFAULT}
                          checked={field.value === UserType.DEFAULT}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Padrão</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center">
                      <FormControl>
                        <RadioGroupItem
                          value={UserType.CADASTRE}
                          checked={field.value === UserType.CADASTRE}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Cadastro</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center">
                      <FormControl>
                        <RadioGroupItem
                          value={UserType.REPORT}
                          checked={field.value === UserType.REPORT}
                        />
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
        <MessageError message={error} />
        <MessageSuccess message={success} />
        <DialogFooter>
          <Button disabled={isPending} type="submit" size="sm">
            Atualizar Usuário
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
