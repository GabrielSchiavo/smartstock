import { MessageProps } from '@/types';
import { TriangleAlertIcon } from 'lucide-react';

export const MessageError = ({ message }: MessageProps) => {
  if (!message) return null;

  return (
    <div className="bg-destructive/15 text-destructive flex items-center gap-x-2 rounded-md p-3 text-sm">
      <TriangleAlertIcon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};
