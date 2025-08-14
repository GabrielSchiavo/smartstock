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
import { MoonLoader } from "react-spinners";
import { ROUTES } from "@/config/routes";

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
      headerLabel="Redefina sua senha"
      backButtonLabel="Voltar para o login"
      backButtonHref={ROUTES.AUTH_LOGIN}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
          <div className="grid gap-6">
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
                      className="default-height"
                      placeholder="exemplo@exemplo.com"
                      type="email"
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
                {"Enviando email..."}
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
