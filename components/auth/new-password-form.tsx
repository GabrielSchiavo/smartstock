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
import { ROUTES } from "@/routes";
import { MoonLoader } from "react-spinners";

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

  return (
    <CardWrapper
      headerLabel="Redefina sua senha"
      backButtonLabel="Voltar para o login"
      backButtonHref={ROUTES.AUTH_LOGIN}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
          <div className="grid gap-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova senha</FormLabel>
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
          </div>
          <MessageError message={error} />
          <MessageSuccess message={success} />
          <Button
            disabled={isPending}
            type="submit"
            size={"sm"}
            className="w-full"
          >
            {isPending ? (
              <span className="flex items-center gap-3">
                <MoonLoader size={16} color="#ffffff" />
                {"Alterando senha..."}
              </span>
            ) : (
              "Continuar"
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
