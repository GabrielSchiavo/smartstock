export const VersionBadge = () => (
  <span className="truncate bg-muted px-3 py-1 rounded-sm text-sm">
    {process.env.APP_VERSION}
  </span>
);