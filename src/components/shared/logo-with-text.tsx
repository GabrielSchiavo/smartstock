import LogoSmartstock from "@/assets/images/brand/brandmark.png";
import Image from "next/image";
import { LogoWithTextProps } from "@/types";

export const LogoWithText = ({
  imageSize = "size-12",
  textSize = "text-4xl",
  containerClasses = "",
  containerImageClasses = "",
  containerTextClasses = "",
}: LogoWithTextProps) => {
  return (
    <div
      className={`flex flex-row justify-center items-center gap-4 flex-wrap ${containerClasses}`}
    >
      <div className={`${containerImageClasses}`}>
        <Image
          className={imageSize}
          src={LogoSmartstock}
          alt="Logo SmartStock"
        />
      </div>
      <div className={`${containerTextClasses}`}>
        <span className={`font-albert-sans ${textSize} font-extralight`}>
          <span className="font-semibold">Smart</span>stock
        </span>
      </div>
    </div>
  );
};
