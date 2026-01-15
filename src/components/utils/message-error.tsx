import { MessageProps } from "@/types";
import { TriangleAlertIcon } from "lucide-react";

export const MessageError = ({
    message,
}: MessageProps) => {
    if (!message) return null;

    return (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
            <TriangleAlertIcon className="h-4 w-4" />
            <p>{message}</p>
        </div>
    )
}