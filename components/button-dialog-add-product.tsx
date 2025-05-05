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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DatePickerMonthYear } from "@/components/date-picker-month-year-selectors";

const selectUnit = [
  {
    label: "Kg",
    value: "kg",
  },
  {
    label: "g",
    value: "g",
  },
  {
    label: "L",
    value: "l",
  },
  {
    label: "Un.",
    value: "un",
  },
  {
    label: "Cx.",
    value: "cx",
  },
];
const selectDonor = [
  {
    label: "Anonymous",
    value: "Anonymous",
  },
  {
    label: "Empresa X",
    value: "Empresa X",
  },
];
const selectTaker = [
  {
    label: "Usuário X",
    value: "Usuário X",
  },
];
const selectGroup = [
  {
    label: "Grupo 1",
    value: "Grupo 1",
  },
];
const selectSubgroup = [
  {
    label: "Subgrupo 1",
    value: "Subgrupo 1",
  },
];

const formSchema = z
  .object({
    name: z.string().min(2).max(150),
    quantity: z.string().min(1).max(10),
    unit: z.enum(["kg", "g", "l", "un", "cx"], {
      required_error: "You need to select a unit of measurement.",
    }),
    lot: z.string().min(2).max(50),

    validityDate: z.coerce
      .date({
        required_error: "Please select a date",
        invalid_type_error: "This is not a date!",
      })
      .refine((date) => date > new Date(), {
        message: "The date entered must be greater than today's date",
      }),

    receiptDate: z.coerce.date({
      required_error: "Please select a date",
      invalid_type_error: "This is not a date!",
    }),

    taker: z.string().min(2).max(150),
    group: z.string().min(2).max(50),
    subgroup: z.string().min(2).max(50).optional(),

    productType: z.enum(["donated", "purchased"], {
      required_error: "You need to select a product input type.",
    }),

    donor: z.string().optional(),
  })
  .refine(
    (data) => {
      // Validação condicional sem usar parent
      if (data.productType === "donated" && !data.donor) {
        return false;
      }
      return true;
    },
    {
      message: "Detalhes são obrigatórios para itens doados",
      path: ["donor"], // Especifica que o erro deve ser associado ao campo donor
    }
  );

export function ButtonDialogAddProduct({}) {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      quantity: "",
      unit: undefined,
      lot: "",
      validityDate: undefined,
      donor: undefined,
      receiptDate: undefined,
      taker: "",
      group: "",
      subgroup: undefined,
      productType: undefined,
    },
  });

  const selectedType = form.watch("productType");
  const detailsValue = form.watch("donor");

  // Determina se o input deve estar desabilitado
  const isDetailsDisabled = !selectedType || selectedType === "purchased";

  // Efeito para limpar o valor quando o campo é desabilitado
  useEffect(() => {
    if (isDetailsDisabled && detailsValue) {
      form.setValue("donor", undefined, { shouldValidate: true });
    }
  }, [isDetailsDisabled, detailsValue, form]);

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
          <span className="hidden lg:inline">Add Product</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] sm:max-h-[90vh] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
          <DialogDescription>
            Add new products here. Click Save when done.
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
                <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 items-start">
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            className="default-height"
                            placeholder="Digit a quantity"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit</FormLabel>
                        <div className="select-container">
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a unit" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {selectUnit.map((item) => (
                                <SelectItem key={item.value} value={item.value}>
                                  {item.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 items-start">
                  <FormField
                    control={form.control}
                    name="lot"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lot</FormLabel>
                        <FormControl>
                          <Input
                            className="default-height"
                            placeholder="Digit a lot"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="validityDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of validity</FormLabel>
                        <FormControl>
                          <DatePickerMonthYear field={field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 items-start">
                  <FormField
                    control={form.control}
                    name="taker"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Taker</FormLabel>
                        <div className="select-container">
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a taker" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {selectTaker.map((item) => (
                                <SelectItem key={item.value} value={item.value}>
                                  {item.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="receiptDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Receipt</FormLabel>
                        <FormControl>
                          <DatePickerMonthYear field={field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 items-start">
                  <FormField
                    control={form.control}
                    name="group"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Group</FormLabel>
                        <div className="select-container">
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a group" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {selectGroup.map((item) => (
                                <SelectItem key={item.value} value={item.value}>
                                  {item.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
                        <FormLabel>Subgroup (Optional)</FormLabel>
                        <div className="select-container">
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a subgroup" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {selectSubgroup.map((item) => (
                                <SelectItem key={item.value} value={item.value}>
                                  {item.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 items-start">
                  <FormField
                    control={form.control}
                    name="productType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product input type:</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col"
                          >
                            <FormItem className="flex items-center">
                              <FormControl>
                                <RadioGroupItem value="donated" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Donated
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center">
                              <FormControl>
                                <RadioGroupItem value="purchased" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Purchased
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="donor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Donor</FormLabel>
                        <div className="select-container">
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={isDetailsDisabled}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={
                                    isDetailsDisabled
                                      ? "Select 'Donated' to enable"
                                      : "Enter the donor"
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {selectDonor.map((item) => (
                                <SelectItem key={item.value} value={item.value}>
                                  {item.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
