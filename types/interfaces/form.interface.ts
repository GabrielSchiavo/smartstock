import { ControllerRenderProps, FieldValues, Path } from "react-hook-form";

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

export interface Option {
  id: string;
  name: string;
}

export interface AddEditFormProps {
  rowItemId: string | number;
  onOpenChange?: (open: boolean) => void;
  onShouldInvalidate?: (shouldInvalidate: boolean) => void;
}
