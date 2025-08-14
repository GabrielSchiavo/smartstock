import { CardWrapper } from "@/components/auth/card-wrapper"
import { ROUTES } from "@/config/routes"
import { TriangleAlertIcon } from "lucide-react"

export const ErrorCard = () => {
    return (
        <CardWrapper
            headerLabel="Oops! Something went wrong!"
            backButtonHref={ROUTES.AUTH_LOGIN}
            backButtonLabel="Back to login"
        >
            <div className="w-full flex justify-center items-center">
                <TriangleAlertIcon className="text-destructive" />
            </div>
        </CardWrapper>
    )
}