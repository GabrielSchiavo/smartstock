"use client";

import { useForm, UseFormReturn } from "react-hook-form";
import { CreateEditMasterProductSchema } from "@/schemas";
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
import { forwardRef, useImperativeHandle } from "react";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormBaseMasterProductProps,
  ResourceType,
  UnitType,
} from "@/types";
import { MoonLoader } from "react-spinners";
import { DynamicCombobox } from "@/components/shared/dynamic-combobox";

export const FormBaseMasterProduct = forwardRef<
  UseFormReturn<z.infer<typeof CreateEditMasterProductSchema>>,
  FormBaseMasterProductProps
>(
  (
    {
      defaultValues,
      onSubmit,
      onCancel,
      isPending,
      submitButtonText,
      loadingText,
    },
    ref
  ) => {
    const form = useForm<z.infer<typeof CreateEditMasterProductSchema>>({
      resolver: zodResolver(CreateEditMasterProductSchema),
      defaultValues: defaultValues || {
        name: "",
        baseUnit: undefined,
        category: "",
        group: "",
        subgroup: undefined,
      },
    });

    useImperativeHandle(ref, () => form, [form]);

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-8">
          <div className="grid grid-cols-1 gap-4 items-start">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      className="default-height"
                      placeholder="Digite um nome"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid sm:grid-cols-1 grid-cols-1 gap-4 items-start">
              <FormField
                control={form.control}
                name="baseUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unidade Base</FormLabel>
                    <div className="select-container">
                      <Select
                        disabled={isPending}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger size="sm">
                            <SelectValue placeholder="Selecione a unidade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Unidades</SelectLabel>
                            <SelectItem value={UnitType.KG}>KG</SelectItem>
                            <SelectItem value={UnitType.G}>G</SelectItem>
                            <SelectItem value={UnitType.L}>L</SelectItem>
                            <SelectItem value={UnitType.UN}>UN.</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 items-start">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <div className="select-container relative w-full min-w-0">
                      <DynamicCombobox
                        resourceType={ResourceType.CATEGORY}
                        value={field.value ? field.value : ""}
                        onChange={field.onChange}
                        disabled={isPending}
                        placeholder="Selecione uma Categoria..."
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="group"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grupo</FormLabel>
                    <div className="select-container relative w-full min-w-0">
                      <DynamicCombobox
                        resourceType={ResourceType.GROUP}
                        value={field.value ? field.value : ""}
                        onChange={field.onChange}
                        disabled={isPending}
                        placeholder="Selecione um Grupo..."
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subgroup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subgrupo (Opcional)</FormLabel>
                    <div className="select-container relative w-full min-w-0">
                      <DynamicCombobox
                        resourceType={ResourceType.SUBGROUP}
                        value={field.value ? field.value : ""}
                        onChange={field.onChange}
                        disabled={isPending}
                        placeholder="Selecione um Subgrupo..."
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <DialogFooter>
            <div className="flex gap-3">
              <Button
                disabled={isPending}
                size="sm"
                type="reset"
                variant={"ghost"}
                onClick={() => {
                  form.reset();
                  onCancel?.();
                }}
              >
                Cancelar
              </Button>
              <Button disabled={isPending} type="submit" size="sm">
                {isPending ? (
                  <span className="flex items-center gap-3">
                    <MoonLoader size={16} color="#ffffff" />
                    {loadingText}
                  </span>
                ) : (
                  submitButtonText
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </Form>
    );
  }
);

FormBaseMasterProduct.displayName = "FormBaseMasterProduct";
