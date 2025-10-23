"use client";

import { useForm } from "react-hook-form";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { LoginSchema } from "@/schemas";
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
import { login } from "@/actions";
import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PasswordInput } from "@/components/auth/input-password";
import { ROUTES } from "@/config/routes";
import { Spinner } from "@/components/ui/spinner";
import { FieldGroup } from "@/components/ui/field";

export const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider!"
      : "";

  const [error, setError] = useState<string | undefined>("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");
    setIsRedirecting(false);

    startTransition(() => {
      login(values).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);

        // Redireciona e recarrega se necessário
        if (data?.redirectUrl) {
          setIsRedirecting(true);
          router.push(data.redirectUrl);
          if (data.shouldReload) {
            window.location.reload(); // Recarrega apenas para /dashboard
          }
        }
      });
    });
  };

  return (
    <CardWrapper
      headerTitle="Acesse sua conta"
      headerLabel="Bem-vindo de volta"
      backButtonLabel=""
      backButtonHref=""
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <MessageError message={error || urlError} />
            {/* <MessageSuccess message={success} /> */}
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
                      className="default-height"
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
                <FormItem className="gap-3">
                  <FormLabel>
                    <div className="flex w-full items-center justify-between gap-3">
                      Senha
                      <Button
                        size="sm"
                        variant="link"
                        asChild
                        className="h-fit! w-fit! font-medium p-0"
                      >
                        <Link
                          href={ROUTES.AUTH_RESET_PASSWORD}
                          className="h-fit! w-fit!"
                        >
                          Esqueceu sua senha?
                        </Link>
                      </Button>
                    </div>
                  </FormLabel>
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
            <Button
              disabled={isPending}
              type="submit"
              size={"sm"}
              className="w-full"
            >
              {isPending || isRedirecting ? (
                <span className="flex items-center gap-3">
                  <Spinner className="size-4 shrink-0" />
                  {isRedirecting ? "Redirecionando..." : "Autenticando..."}
                </span>
              ) : (
                "Entrar"
              )}
            </Button>
            {/* <FieldSeparator>OU</FieldSeparator>
          <Button
            disabled={isPending}
            type="button"
            size={"sm"}
            className="w-full"
            variant={"outline"}
          >
            <Link href={"#"}>Crie uma Conta</Link>
          </Button> */}
          </FieldGroup>
        </form>
      </Form>
    </CardWrapper>
  );
};
