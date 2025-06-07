import { HeaderProps } from "@/types";
import { LogoWithText } from "../shared/logo-with-text";

export const HeaderAuth = ({ label }: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <LogoWithText imageSize="size-12" textSize="text-4xl" />
      <p className="text-muted-foreground text-md">{label}</p>
    </div>
  );
};
