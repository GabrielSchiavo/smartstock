import Image from "next/image";
import LogoSmartstock from "@/public/assets/images/logos/smartstock-logo.png";

interface HeaderProps {
  label: string;
}

export const HeaderAuth = ({ label }: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <div className="flex flex-row items-center gap-6">
        <Image className="size-12" src={LogoSmartstock} alt="Logo SmartStock" />
        <h1 className={"text-3xl font-semibold"}>
          SmartStock
        </h1>
      </div>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
};
