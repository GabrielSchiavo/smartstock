import { HeaderProps } from "@/types";
import { LogoWithText } from "@/components/shared/logo-with-text";

export const HeaderAuth = ({ label }: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-3 items-center justify-center">
      <LogoWithText imageSize="size-10 sm:size-12" textSize="text-3xl sm:text-4xl" />
      <p className="text-muted-foreground text-md">{label}</p>
    </div>
  );
};
