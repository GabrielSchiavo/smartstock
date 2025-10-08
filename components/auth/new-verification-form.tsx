"use client";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { newVerification } from "@/actions";
import { MessageSuccess } from "@/components/utils/message-success";
import { MessageError } from "@/components/utils/message-error";
import { ROUTES } from "@/config/routes";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { Button } from "../ui/button";

export const NewVerificationForm = () => {
  // * Best example for use error and success message
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (success || error) return;

    if (!token) {
      setError("Token ausente!");
      return;
    }

    newVerification(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        setError("Algo deu errado!");
      });
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  const isSuccess = success ? true : false;

  return (
    <CardWrapper
      headerTitle="Verificando email"
      headerLabel="Estamos verificando seu email"
      backButtonLabel="Login"
      backButtonHref={ROUTES.AUTH_LOGIN}
    >
      <div className="flex flex-col items-center w-full justify-center gap-7">
        <MessageSuccess message={success} />
        {!success && <MessageError message={error} />}
        {!success && !error && (
          <div className="flex items-center gap-3">
            <Spinner className="size-5 shrink-0" />
            <span className="text-foreground">Verificando...</span>
          </div>
        )}
        {isSuccess && (
          <Link href={ROUTES.AUTH_LOGIN} className="w-full">
            <Button
              type="button"
              size={"sm"}
              variant={"outline"}
              className="w-full"
            >
              Acessar Conta
            </Button>
          </Link>
        )}
      </div>
    </CardWrapper>
  );
};
