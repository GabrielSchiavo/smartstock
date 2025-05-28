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
import { MessageSuccess } from "@/components/utils/message-success";
import { login } from "@/actions";
import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PasswordInput } from "@/components/auth/input-password";
import { MoonLoader } from "react-spinners";

export const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider!"
      : "";

  const [error, setError] = useState<string | undefined>("");
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
      headerLabel="Bem-vindo de volta"
      backButtonLabel=""
      backButtonHref=""
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
                  <Button
                    size="sm"
                    variant="link"
                    asChild
                    className="px-0 font-normal justify-start"
                  >
                    <Link href="/auth/reset">Esqueceu sua senha?</Link>
                  </Button>
                </FormItem>
              )}
            />
          </div>
          <MessageError message={error || urlError} />
          <MessageSuccess message={success} />
          <Button
            disabled={isPending}
            type="submit"
            size={"sm"}
            className="w-full"
          >
            {isPending || isRedirecting ? (
              <span className="flex items-center gap-3">
                <MoonLoader size={16} color="#ffffff" />
                {isRedirecting ? "Redirecionando..." : "Autenticando..."}
              </span>
            ) : (
              "Entrar"
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
