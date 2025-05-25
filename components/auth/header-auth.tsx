import Image from "next/image";
import LogoSmartstock from "@/public/assets/images/logos/smartstock-logo.png";
import { HeaderProps } from "@/types";

export const HeaderAuth = ({ label }: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <div className="flex flex-row items-center gap-4">
        <Image className="size-12" src={LogoSmartstock} alt="Logo SmartStock" />
        <span className="text-4xl fontAlbertSans font-extralight">
          <span className="font-semibold">Smart</span>stock
        </span>
      </div>
      <p className="text-muted-foreground text-md">{label}</p>
    </div>
  );
};
