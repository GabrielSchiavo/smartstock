"use client";

import { useForm } from "react-hook-form";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { NewPasswordSchema } from "@/schemas";
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
import { Button } from "@/components/ui/button";
import { MessageError } from "@/components/utils/message-error";
import { MessageSuccess } from "@/components/utils/message-success";
import { newPassword } from "@/actions";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { PasswordInput } from "@/components/auth/input-password";
import { ROUTES } from "@/config/routes";
import { Spinner } from "@/components/ui/spinner";
import { FieldGroup, FieldSeparator } from "@/components/ui/field";
import Link from "next/link";

export const NewPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      newPassword(values, token).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
        if (data?.success) {
          form.reset();
        }
      });
    });
  };

  const isSuccess = success ? true : false;

  return (
    <CardWrapper
      headerTitle="Redefinir senha"
      headerLabel="Crie sua nova senha"
      backButtonLabel="Login"
      backButtonHref={ROUTES.AUTH_LOGIN}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <MessageError message={error} />
            <MessageSuccess message={success} />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="gap-3">
                  <FormLabel>Nova senha</FormLabel>
                  <FormControl>
                    <PasswordInput
                      disabled={isPending || isSuccess}
                      className="default-btn-field-height"
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
                <FormItem className="gap-3">
                  <FormLabel>Confirme a senha</FormLabel>
                  <FormControl>
                    <PasswordInput
                      disabled={isPending || isSuccess}
                      className="default-btn-field-height"
                      placeholder="********"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isPending || isSuccess}
              type="submit"
              size={"sm"}
              className="w-full"
            >
              {isPending ? (
                <span className="flex items-center gap-3">
                  <Spinner className="size-4 shrink-0" />
                  {"Alterando senha..."}
                </span>
              ) : (
                "Continuar"
              )}
            </Button>
            {isSuccess && (
              <span className="grid items-center gap-7">
                <FieldSeparator></FieldSeparator>
                <Link href={ROUTES.AUTH_LOGIN} className="w-full">
                  <Button
                    disabled={isPending}
                    type="button"
                    size={"sm"}
                    variant={"outline"}
                    className="w-full"
                  >
                    Acessar Conta
                  </Button>
                </Link>
              </span>
            )}
          </FieldGroup>
        </form>
      </Form>
    </CardWrapper>
  );
};
