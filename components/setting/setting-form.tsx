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
import { SettingsSchema } from "@/schemas";
import { updateUserSettings } from "@/actions";
import { useSession } from "next-auth/react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/auth/input-password";
import { MoonLoader } from "react-spinners";
import { showToast } from "@/components/utils/show-toast";
import { ToastType } from "@/types";
import { CopyToClipboard } from "@/components/utils/copy-to-clipboard";

export const SettingForm = () => {
  const user = useCurrentUser();

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
    startTransition(async () => {
      try {
        const response = await updateUserSettings(cleanedValues);

        if (response.success === true) {
          update();
          form.reset({
            ...form.getValues(),
            password: undefined,
            newPassword: undefined,
          });
        }

        if (response.success === false) {
          form.reset();
        }

        showToast({
          title: response.title,
          description: response.description,
          type: response.success ? ToastType.SUCCESS : ToastType.ERROR,
        });
      } catch (error) {
        console.error("Algo deu errado:", error);
        showToast({
          title: "Algo deu errado.",
          type: ToastType.ERROR,
        });
      }
    });
  };

  // Copiar ID para área de tranferência
  const userId = user?.id as string;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-6">
          <div className="grid gap-6 grid-cols-1">
            <div className="flex flex-row items-center justify-between gap-4 rounded-md border p-2">
              <p className="text-sm font-medium">ID</p>
              <CopyToClipboard
                textToCopy={userId}
                tooltipContent="Copiar ID"
                className="truncate bg-muted px-3 py-1 rounded-sm text-sm cursor-pointer hover:dark:bg-zinc-500 hover:bg-zinc-300 transition-all duration-400"
              >
                {userId}
              </CopyToClipboard>
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
                  <FormLabel>Senha atual</FormLabel>
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
          </div>
          <div className="flex justify-end">
            <Button disabled={isPending} type="submit" size="sm">
              {isPending ? (
                <span className="flex items-center gap-3">
                  <MoonLoader size={16} color="#ffffff" />
                  {"Salvando..."}
                </span>
              ) : (
                "Salvar Alterações"
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
