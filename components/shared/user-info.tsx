import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserInfoProps } from "@/types";

export const UserInfo = ({
    user,
    label,
}: UserInfoProps) => {
    return (
        <Card className="max-w-[600px] w-full shadow-md mx-4">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">
                    {label}
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
                    <p className="text-sm font-medium">
                        ID
                    </p>
                    <p className="truncate text-sm max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
                        { user?.id }
                    </p>
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
                    <p className="text-sm font-medium">
                        Nome
                    </p>
                    <p className="truncate text-sm max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
                        { user?.name }
                    </p>
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
                    <p className="text-sm font-medium">
                        Email
                    </p>
                    <p className="truncate text-sm max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
                        { user?.email }
                    </p>
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
                    <p className="text-sm font-medium">
                        Nível de acesso
                    </p>
                    <p className="truncate text-sm max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
                        { user?.role }
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}