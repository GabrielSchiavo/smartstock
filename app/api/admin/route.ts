import { currentRole } from "@/lib/auth";
import { UserType } from "@/types/index.enums";
import { NextResponse } from "next/server";

export async function GET() {
    const role = await currentRole();

    if (role === UserType.ADMIN) {
        return new NextResponse(null, {status: 200});
    }

    return new NextResponse(null, {
        status: 403
    });
}