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
  BaseUnitType,
  FormBaseMasterProductProps,
  ResourceType,
  UnitType,
} from "@/types";
import { DynamicCombobox } from "@/components/shared/dynamic-combobox";
import { Spinner } from "@/components/ui/spinner";
import { SaveIcon } from "lucide-react";

export const BaseFormMasterProduct = forwardRef<
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
        baseUnit: "" as BaseUnitType,
        categoryId: "",
        groupId: "",
        subgroupId: null,
      },
    });

    useImperativeHandle(ref, () => form, [form]);

    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col justify-center items-center"
        >
          <div className="flex flex-col gap-12 w-full md:max-w-4xl">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <h1 className="text-md font-medium">
                  Detalhes do Produto Mestre
                </h1>
              </div>
              <div className="flex flex-col gap-6 border rounded-xl p-10 shadow">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          className="default-btn-field-height"
                          placeholder="Digite um nome"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid sm:grid-cols-1 grid-cols-1 gap-6 items-start">
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
                                <SelectLabel>Unidades Base</SelectLabel>
                                <SelectItem value={UnitType.KG}>KG</SelectItem>
                                <SelectItem value={UnitType.UN}>UN.</SelectItem>
                                <SelectItem value={UnitType.L}>L</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <DynamicCombobox
                        resourceType={ResourceType.CATEGORY}
                        value={field.value ? field.value : ""}
                        onChange={field.onChange}
                        disabled={isPending}
                        placeholder="Selecione uma Categoria..."
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="groupId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grupo</FormLabel>
                      <DynamicCombobox
                        resourceType={ResourceType.GROUP}
                        value={field.value ? field.value : ""}
                        onChange={field.onChange}
                        disabled={isPending}
                        placeholder="Selecione um Grupo..."
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subgroupId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subgrupo (Opcional)</FormLabel>
                      <DynamicCombobox
                        resourceType={ResourceType.SUBGROUP}
                        value={field.value ? field.value : ""}
                        onChange={field.onChange}
                        disabled={isPending}
                        placeholder="Selecione um Subgrupo..."
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
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
                    <Spinner className="size-4 shrink-0" />
                    {loadingText}
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <SaveIcon className="size-4 shrink-0" />
                    {submitButtonText}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    );
  }
);

BaseFormMasterProduct.displayName = "BaseFormMasterProduct";
