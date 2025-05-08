import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { PasswordInput } from "./input-password"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your email and password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    className="default-height"
                    required
                  />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <PasswordInput className="default-height" placeholder="Digit a password" required/>
                </div>
                <Button type="submit" size="sm" className="w-full cursor-pointer">
                  Login
                </Button>
              </div>
              <div className="text-center text-sm">
                Forgot your password?{" "}
                <Link href="/recover-password" className="underline underline-offset-4">
                  Recover it
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
