import React from "react";
import LogoSmartstock from "@/public/assets/images/logos/smartstock-logo.png";
import Image from "next/image";

interface LogoWithTextProps {
  imageSize?: string;
  textSize?: string;
  containerClasses?: string;
}

export const LogoWithText = ({
  imageSize = "size-12",
  textSize = "text-4xl",
  containerClasses = "",
}: LogoWithTextProps) => {
  return (
    <div
      className={`flex flex-row justify-center items-center gap-4 flex-wrap ${containerClasses}`}
    >
      <Image className={imageSize} src={LogoSmartstock} alt="Logo SmartStock" />
      <span className={`${textSize} fontAlbertSans font-extralight`}>
        <span className="font-semibold">Smart</span>stock
      </span>
    </div>
  );
};
