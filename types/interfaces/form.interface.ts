import {
  CreateAdjustmentSchema,
  CreateEditMasterProductSchema,
  CreateInputEditProductSchema,
  CreateOutputSchema,
} from "@/schemas";
import { ControllerRenderProps, FieldValues, Path } from "react-hook-form";
import { ModeType, ReportDataResponse, ReportType, ResourceType } from "@/types";
import { DeleteActionResponse } from "@/types";
import { z } from "zod";
import { ReactNode } from "react";
import { MasterProduct } from "@prisma/client";

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

export interface FormReportsProps {
  onReportGenerated: (data: {
    reportType: ReportType;
    reportData: ReportDataResponse;
    dates?: { initialDate?: Date; finalDate?: Date };
  }) => void;
}

export interface FormBaseMasterProductProps {
  defaultValues?: z.infer<typeof CreateEditMasterProductSchema>;
  onSubmit: (
    values: z.infer<typeof CreateEditMasterProductSchema>
  ) => Promise<void>;
  onCancel?: () => void;
  isPending: boolean;
  submitButtonText: string;
  loadingText: string;
}

export interface FormOutputProps {
  defaultValues?: z.infer<typeof CreateOutputSchema>;
  onSubmit: (
    values: z.infer<typeof CreateOutputSchema>
  ) => Promise<void>;
  onCancel?: () => void;
  isPending: boolean;
  submitButtonText: string;
  loadingText: string;
  isLoading: boolean;
}

export interface FormAdjustmentProps {
  defaultValues?: z.infer<typeof CreateAdjustmentSchema>;
  onSubmit: (
    values: z.infer<typeof CreateAdjustmentSchema>
  ) => Promise<void>;
  onCancel?: () => void;
  isPending: boolean;
  submitButtonText: string;
  loadingText: string;
  isLoading: boolean;
}

// Interface de resposta
export interface FormResponse {
  success: boolean;
  title: string;
  description?: string;
}

// Interface do componente com tipagem mais específica
export interface FormBaseUserProps {
  schema: z.ZodSchema<unknown>;
  defaultValues?: Record<string, unknown>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (values: any) => Promise<FormResponse>;
  onCancel?: () => void;
  onSuccess?: () => void;
  submitButtonText: string;
  loadingText: string;
  hidePasswordInputs?: boolean;
  isEditForm?: boolean;
}

export interface FormBaseInputProductProps {
  defaultValues?: z.infer<typeof CreateInputEditProductSchema>;
  onSubmit: (values: z.infer<typeof CreateInputEditProductSchema>) => Promise<void>;
  onCancel?: () => void;
  isPending: boolean;
  submitButtonText: string;
  loadingText: string;
  mode?: ModeType;
  isLoading?: boolean;
}

export interface ExtendedFormBaseInputProductProps
  extends FormBaseInputProductProps {
  masterProducts: MasterProduct[];
}
