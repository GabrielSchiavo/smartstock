import { CreateEditProductSchema } from "@/schemas";
import { ControllerRenderProps, FieldValues, Path } from "react-hook-form";
import { z } from "zod";

export interface DatePickerFormProps<T extends FieldValues> {
  field: ControllerRenderProps<T, Path<T>>;
  disabled?: boolean;
}

export interface DynamicComboboxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  allowCreate?: boolean;
  allowDelete?: boolean;
  disabled: boolean;
  className?: string;
}

export interface OptionProps {
  id: string;
  name: string;
}

export interface AddEditFormProps {
  rowItemId?: string | number;
  onOpenChange?: (open: boolean) => void;
  onShouldInvalidate?: (shouldInvalidate: boolean) => void;
}

export interface BaseProductFormProps {
  defaultValues?: z.infer<typeof CreateEditProductSchema>;
  onSubmit: (values: z.infer<typeof CreateEditProductSchema>) => Promise<void>;
  isPending: boolean;
  submitButtonLabel: string;
  loadingButtonLabel: string;
}

export interface BaseUserFormProps<T extends z.ZodType> {
  schema: T;
  defaultValues?: Partial<z.infer<T>>;
  onSubmit: (values: z.infer<T>) => Promise<{
    error?: string;
    success?: string;
  }>;
  onSuccess?: () => void;
  submitButtonText: string;
  loadingText: string;
  isEdit?: boolean;
}