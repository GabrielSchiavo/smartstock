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
import { DatePickerMonthYear } from "./date-picker-month-year-selectors";

const formSchema = z.object({
  initialDate: z.coerce
  .date({
    required_error: "Please select a date",
    invalid_type_error: "This is not a date!",
  }),

  finalDate: z.coerce
  .date({
    required_error: "Please select a date",
    invalid_type_error: "This is not a date!",
  }),

  name: z.string().min(2).max(150),

  userType: z.enum(
    [
      "quantityReport",
      "expirationDateReport",
      "defeatedReport",
      "QuantityDonorReport",
      "totalReceivedReport",
    ],
    {
      required_error: "You need to select a report input type.",
    }
  ),
}).refine((data) => data.finalDate > data.initialDate, {
  message: "The end date cannot be less than the start date",
  path: ["finalDate"], // path of error
});

export function ButtonDialogAddReport({}) {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
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
          <span className="hidden lg:inline">Add Report</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] sm:max-h-[90vh] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Add Report</DialogTitle>
          <DialogDescription>
            Add new reports here. Click Save when done.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 items-start">
                <FormField
                  control={form.control}
                  name="initialDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initial date</FormLabel>
                      <FormControl>
                        <DatePickerMonthYear field={field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="finalDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Final date</FormLabel>
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
                  name="userType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Report input type:</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col"
                        >
                          <FormItem className="flex items-center">
                            <FormControl>
                              <RadioGroupItem value="quantityReport" />
                            </FormControl>
                            <FormLabel className="font-normal">Por Qantidade</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center">
                            <FormControl>
                              <RadioGroupItem value="expirationDateReport" />
                            </FormControl>
                            <FormLabel className="font-normal">Por Data de Validade</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center">
                            <FormControl>
                              <RadioGroupItem value="defeatedReport" />
                            </FormControl>
                            <FormLabel className="font-normal">Produtos Vencidos</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center">
                            <FormControl>
                              <RadioGroupItem value="QuantityDonorReport" />
                            </FormControl>
                            <FormLabel className="font-normal">Quantidade por Doador</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center">
                            <FormControl>
                              <RadioGroupItem value="totalReceivedReport" />
                            </FormControl>
                            <FormLabel className="font-normal">Total Recebido</FormLabel>
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
