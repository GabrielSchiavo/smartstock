import { Badge } from "@/components/ui/badge";

export const VersionBadge = () => (
  <Badge variant="secondary" className="truncate text-sm">
    {process.env.APP_VERSION}
  </Badge>
);