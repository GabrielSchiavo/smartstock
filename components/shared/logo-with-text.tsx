import React from "react";
import LogoSmartstock from "@/public/assets/images/logos/smartstock-logo.png";
import Image from "next/image";

interface LogoWithTextProps {
  imageSize?: string;
  textSize?: string;
  containerClasses?: string;
  containerImageClasses?: string;
  containerTextClasses?: string;
}

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
        <span className={`${textSize} fontAlbertSans font-extralight`}>
          <span className="font-semibold">Smart</span>stock
        </span>
      </div>
    </div>
  );
};
