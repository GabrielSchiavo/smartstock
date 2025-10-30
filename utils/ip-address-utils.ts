import { headers } from "next/headers";

export const getIpAddress = async () => {
  const headersList = await headers();

  const xForwardedFor = headersList.get("x-forwarded-for");

  let ip: string | null = null;

  if (xForwardedFor) {
    ip = xForwardedFor.split(",")[0].trim();
  } else {
    ip = headersList.get("x-real-ip");
  }

  return ip || "UNKNOWN_IP";
};
