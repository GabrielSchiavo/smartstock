"use client";

import { useForm } from "react-hook-form";
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
import { useTransition } from "react";
import { toast } from "sonner";
import { SettingsSchema } from "@/schemas";
import { settings } from "@/actions/settings";
import { useSession } from "next-auth/react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/auth/input-password";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
// import { MessageError } from "@/components/form-error";
// import { MessageSuccess } from "@/components/form-success";

export const SettingForm = () => {
  const user = useCurrentUser();

  // const [error, setError] = useState<string | undefined>();
  // const [success, setSuccess] = useState<string | undefined>();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      newPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    const cleanedValues = {
      name: values.name || undefined,
      email: values.email || undefined,
      password: values.password || undefined,
      newPassword: values.newPassword || undefined,
    };
    startTransition(() => {
      settings(cleanedValues)
        .then((data) => {
          if (data.error) {
            // setError(data.error);
            // setSuccess(undefined);
            toast.error(data.error);
            return;
          }

          if (data.success) {
            update();
            // setSuccess(data.success);
            // setError(undefined);
            toast.success(data.success);
            form.reset({
              ...form.getValues(),
              password: undefined,
              newPassword: undefined,
            });
          }
        })
        .catch(() => {
          // setError("Algo deu errado!");
          toast.error("Algo deu errado!");
        });
    });
  };

  // Copiar ID para área de tranferência
  const userId = user?.id as string;
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(userId)
      .then(() => {
        toast.success("ID copiado para a área de transferência!");
      })
      .catch(() => {
        toast.error("Falha ao copiar o ID");
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-6">
          <div className="grid gap-6 grid-cols-1">
            <div className="flex flex-row items-center justify-between gap-4 rounded-md border p-2">
              <p className="text-sm font-medium">ID</p>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p
                    onClick={copyToClipboard}
                    className="truncate bg-muted px-3 py-1 rounded-sm text-sm cursor-pointer hover:dark:bg-zinc-500 hover:bg-zinc-300 transition-all duration-400"
                  >
                    {userId}
                  </p>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="center">
                  Copiar ID
                </TooltipContent>
              </Tooltip>
            </div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Nome de usuário"
                      disabled={isPending}
                      className="default-height"
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
                      placeholder="exemplo@exemplo.com"
                      type="email"
                      disabled={isPending}
                      className="default-height"
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
                  <FormLabel>Senha Atual</FormLabel>
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
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova Senha</FormLabel>
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
          {/* <MessageError message={error} />
          <MessageSuccess message={success} /> */}
          <div className="flex justify-end">
            <Button disabled={isPending} type="submit" size="sm">
              Salvar Alterações
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
