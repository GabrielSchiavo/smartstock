import { ToastProps } from "@/types";
import { toast } from "sonner";

export const showToast = ({ title, description, type }: ToastProps) => {
  toast[type](title, { description });
};
