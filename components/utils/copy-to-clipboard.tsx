import { CopyToClipboardProps, ToastType } from "@/types";
import { showToast } from "@/components/utils/show-toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export const CopyToClipboard = ({
  textToCopy,
  children,
  className,
  tooltipContent,
}: CopyToClipboardProps) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      showToast({
        title: "Sucesso!",
        description:"Texto copiado para a área de transferência.",
        type: ToastType.SUCCESS,
      });
    } catch (error) {
      console.error("Erro ao copiar o texto:", error);
      showToast({
        title:"Erro!",
        description: "Erro ao copiar o texto.",
        type: ToastType.ERROR,
      });
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button onClick={handleCopy} className={className} type="button">
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" align="center">
        {tooltipContent}
      </TooltipContent>
    </Tooltip>
  );
};
