"use client";

import { Path, useForm } from "react-hook-form";
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
import { useTransition } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PasswordInput } from "@/components/auth/input-password";
import { DialogFooter } from "@/components/ui/dialog";
import { ToolTipHelpUser } from "@/components/user/tool-tip-help-user";
import { BaseUserFormProps, ToastType, UserType } from "@/types";
import { MoonLoader } from "react-spinners";
import { showToast } from "@/components/utils/show-toast";
import { useSession } from "next-auth/react";

export const BaseUserForm = <T extends z.ZodTypeAny>({
  schema,
  defaultValues,
  onSubmit,
  onCancel,
  onSuccess,
  submitButtonText,
  loadingText,
  hidePasswordInputs = false,
  isEditForm = false,
}: BaseUserFormProps<T>) => {
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      name: "",
      userType: undefined,
      ...(hidePasswordInputs ? {} : { password: "", confirmPassword: "" }),
      ...defaultValues,
    } as z.infer<T>,
  });

  const handleSubmit = (values: z.infer<T>) => {
    startTransition(async () => {
      try {
        const response = await onSubmit(values);

        if (isEditForm === true) {
          update();
        }

        if (response.success === true) {
          onSuccess?.();
        }

        if (response.success === false) {
          form.reset();
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

  type FieldName = Path<z.infer<T>>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-8">
        <div className="grid grid-cols-1 gap-4 items-start">
          <FormField
            control={form.control}
            name={"name" as FieldName}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    className="default-height"
                    placeholder="Nome do usuário"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={"email" as FieldName}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    className="default-height"
                    placeholder="exemplo@exemplo.com"
                    type="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!hidePasswordInputs && (
            <>
              <FormField
                control={form.control}
                name={"password" as FieldName}
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
                name={"confirmPassword" as FieldName}
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
            </>
          )}

          <FormField
            control={form.control}
            name={"userType" as FieldName}
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
        <DialogFooter>
          <div className="flex gap-3">
            <Button
              disabled={isPending}
              size="sm"
              type="reset"
              variant={"ghost"}
              onClick={() => {
                form.reset();
                onCancel?.();
              }}
            >
              Cancelar
            </Button>
            <Button disabled={isPending} type="submit" size="sm">
              {isPending ? (
                <span className="flex items-center gap-3">
                  <MoonLoader size={16} color="#ffffff" />
                  {loadingText}
                </span>
              ) : (
                submitButtonText
              )}
            </Button>
          </div>
        </DialogFooter>
      </form>
    </Form>
  );
};
