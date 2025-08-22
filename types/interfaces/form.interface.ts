import { CreateEditMasterProductSchema, CreateEditProductSchema } from "@/schemas";
import { ControllerRenderProps, FieldValues, Path } from "react-hook-form";
import { ModeType, ResourceType } from "@/types";
import { DeleteActionResponse } from "@/types";
import { z } from "zod";
import { ReactNode } from "react";

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
  resourceType: ResourceType;
}

export interface OptionProps {
  id: string;
  name: string;
}

export interface FormAddEditProps {
  rowItemId?: string | number;
  onOpenChange?: (open: boolean) => void;
  onShouldInvalidate?: (shouldInvalidate: boolean) => void;
  onCancel?: () => void;
}

export interface AddEditDialogProps extends FormAddEditProps {
  mode: ModeType;
  entity: string;
  formComponent: React.ComponentType<FormAddEditProps>;
  triggerClassName?: string;
  children?: ReactNode;
}

export interface DeleteRegisterProps<T extends string | number> {
  rowItemId?: T;
  deleteAction: (id: T) => Promise<DeleteActionResponse>;
  onOpenChange?: (open: boolean) => void;
}

export interface DataTableDropdownProps<T extends string | number> extends DeleteRegisterProps<T> {
  formComponent: React.ComponentType<FormAddEditProps>;
  entity: string;
}

export interface FormBaseMasterProductProps {
  defaultValues?: z.infer<typeof CreateEditMasterProductSchema>;
  onSubmit: (values: z.infer<typeof CreateEditMasterProductSchema>) => Promise<void>;
  onCancel?: () => void;
  isPending: boolean;
  submitButtonText: string;
  loadingText: string;
}

export interface FormBaseInputProductProps {
  defaultValues?: z.infer<typeof CreateEditProductSchema>;
  onSubmit: (values: z.infer<typeof CreateEditProductSchema>) => Promise<void>;
  onCancel?: () => void;
  isPending: boolean;
  submitButtonText: string;
  loadingText: string;
  mode?: ModeType;
}

export interface FormBaseUserProps<T extends z.ZodTypeAny> {
  schema: T;
  defaultValues?: Partial<z.infer<T>>;
  onSubmit: (values: z.infer<T>) => Promise<{
    success: boolean;
    title: string;
    description?: string;
  }>;
  onCancel?: () => void;
  onSuccess?: () => void;
  submitButtonText: string;
  loadingText: string;
  hidePasswordInputs: boolean;
  isEditForm: boolean;
}
