import { MessageProps } from "@/types";
import { CircleCheckIcon } from "lucide-react";

export const MessageSuccess = ({
    message,
}: MessageProps) => {
    if (!message) return null;

    return (
        <div className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500">
            <CircleCheckIcon className="h-4 w-4" />
            <p>{message}</p>
        </div>
    )
}