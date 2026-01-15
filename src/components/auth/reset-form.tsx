"use client";

import { useForm } from "react-hook-form";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { ResetSchema } from "@/schemas";
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
import { MessageError } from "@/components/utils/message-error";
import { MessageSuccess } from "@/components/utils/message-success";
import { resetPassword } from "@/actions";
import { useState, useTransition } from "react";
import { ROUTES } from "@/config/routes";
import { Spinner } from "@/components/ui/spinner";
import { FieldGroup } from "@/components/ui/field";

export const ResetForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      resetPassword(values).then((data) => {
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
      headerTitle="Redefinir senha"
      headerLabel="Informe seu email cadastrado para redefinir sua senha"
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
              name="email"
              render={({ field }) => (
                <FormItem className="gap-3">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      className="default-btn-field-height"
                      placeholder="exemplo@exemplo.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isPending}
              type="submit"
              size={"sm"}
              className="w-full"
            >
              {isPending ? (
                <span className="flex items-center gap-3">
                  <Spinner className="size-4 shrink-0" />
                  {"Enviando email..."}
                </span>
              ) : (
                "Continuar"
              )}
            </Button>
          </FieldGroup>
        </form>
      </Form>
    </CardWrapper>
  );
};
