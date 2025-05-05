"use client";

import { Button } from "@/components/ui/button";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PasswordInput } from "./input-password";

const formSchema = z.object({
  name: z.string().min(2).max(150),

  email: z.string()
  .min(1, { message: 'O email é obrigatório' })
  .email({ message: 'Por favor, insira um email válido' })
  .transform((email) => email.toLowerCase().trim()),
  
  password: z.string()
  .min(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  .max(32, { message: 'A senha deve ter no máximo 32 caracteres' })
  .regex(/[A-Z]/, { message: 'A senha deve conter pelo menos uma letra maiúscula' })
  .regex(/[a-z]/, { message: 'A senha deve conter pelo menos uma letra minúscula' })
  .regex(/[0-9]/, { message: 'A senha deve conter pelo menos um número' })
  .regex(/[^A-Za-z0-9]/, { message: 'A senha deve conter pelo menos um caractere especial' })
  .refine((val) => !/\s/.test(val), {
    message: 'A senha não pode conter espaços em branco',
  }),

  confirmPassword: z.string().min(8).max(32),


  userType: z.enum(["admin", "default", "cadastre", "reports"], {
    required_error: "You need to select a user input type.",
  }),

}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"], // path of error
});

export function ButtonDialogAddUser({}) {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      userType: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {

    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // const dateFormated = (date: Date, locale = "pt-BR") => {
    //   return new intl
    // }

    // const formatDate = intlFormat(values.validityDate, {
    //   locale: 'pt-BR',
    // })
    // values.validityDate = formatDate;

    console.log(values);
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="cursor-pointer">
          <Plus />
          <span className="hidden lg:inline">Add User</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] sm:max-h-[90vh] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <DialogDescription>
            Add new users here. Click Save when done.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <div className="grid grid-cols-1 gap-4 items-start">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          className="default-height"
                          placeholder="Digit a name"
                          {...field}
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
                          type="email"
                          className="default-height"
                          placeholder="example@example.com"
                          {...field}
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <PasswordInput className="default-height" placeholder="Digit a password" {...field} />
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
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <PasswordInput className="default-height" placeholder="Enter a password again" {...field} />
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
                      <FormLabel>User input type:</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col"
                        >
                          <FormItem className="flex items-center">
                            <FormControl>
                              <RadioGroupItem value="admin" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Admin
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center">
                            <FormControl>
                              <RadioGroupItem value="default" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Default
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center">
                            <FormControl>
                              <RadioGroupItem value="cadastre" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Cadastre
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center">
                            <FormControl>
                              <RadioGroupItem value="reports" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Reports
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="submit" size="sm">
                  Save
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
