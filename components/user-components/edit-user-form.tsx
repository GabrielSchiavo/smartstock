"use client";

import { useForm } from "react-hook-form";
import { CreateUserSchema } from "@/schemas";
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
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { editUser, getUserById } from "@/actions/user";
import { useEffect, useState, useTransition } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PasswordInput } from "@/components/auth/input-password";
import { DialogFooter } from "@/components/ui/dialog";
import { UserRole } from "@prisma/client";

interface EditFormProps {
  user: {
    id: string;
  };
}

export const EditUserForm = ({ user }: EditFormProps) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

    const [isLoading, setIsLoading] = useState(true);
    const [initialValues, setInitialValues] = useState<z.infer<typeof CreateUserSchema> | null>(null);



    useEffect(() => {
        const loadProduct = async () => {
          try {
            const productData = await getUserById(user.id);
            if (productData) {
              setInitialValues({
                name: productData.name || "",
                email: productData.email ||  "",
                password: "",
                confirmPassword: "",
                userType: productData.role || undefined,

              });
            }
          } catch (error) {
            console.error("Error loading product:", error);
            setError("Failed to load product data");
          } finally {
            setIsLoading(false);
          }
        };
    
        loadProduct();
      }, [user.id]);





  const form = useForm<z.infer<typeof CreateUserSchema>>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      userType: undefined,
    },
  });




    useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    }
  }, [initialValues, form]);



  const onSubmit = (values: z.infer<typeof CreateUserSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      editUser(user.id, values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      });
    });
  };

      if (isLoading) {
    return <div>Loading user data...</div>;
  }

  if (!initialValues) {
    return <div>User not found or failed to load</div>;
  }

  return (
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
                    {...field}
                    disabled={isPending}
                    placeholder="Your name"
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
                    disabled={isPending}
                    placeholder="example@example.com"
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
                <FormLabel>Password</FormLabel>
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
                <FormLabel>Confirm Password</FormLabel>
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
                        <RadioGroupItem value={UserRole.ADMIN} />
                      </FormControl>
                      <FormLabel className="font-normal">Admin <span className="text-muted-foreground">- acesso total ao sistema</span></FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center">
                      <FormControl>
                        <RadioGroupItem value={UserRole.DEFAULT} />
                      </FormControl>
                      <FormLabel className="font-normal">Default <span className="text-muted-foreground">- acesso somente a produtos e relatórios</span></FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center">
                      <FormControl>
                        <RadioGroupItem value={UserRole.CADASTRE} />
                      </FormControl>
                      <FormLabel className="font-normal">Cadastre <span className="text-muted-foreground">- acesso somente aos produtos</span></FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center">
                      <FormControl>
                        <RadioGroupItem value={UserRole.REPORTS} />
                      </FormControl>
                      <FormLabel className="font-normal">Reports <span className="text-muted-foreground">- acesso somente aos relatórios</span></FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormError message={error} />
        <FormSuccess message={success} />
        <DialogFooter>
          <Button disabled={isPending} type="submit"  size="sm">
            Update User
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
