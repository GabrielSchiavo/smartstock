"use client";

import { MoonLoader } from "react-spinners";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { newVerification } from "@/actions";
import { MessageSuccess } from "@/components/utils/message-success";
import { MessageError } from "@/components/utils/message-error";
import { ROUTES } from "@/routes";

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

  return (
    <CardWrapper
      headerLabel="Confirmando sua verificação"
      backButtonLabel="Voltar ao login"
      backButtonHref={ROUTES.AUTH_LOGIN}
    >
      <div className="flex items-center w-full justify-center">
        {!success && !error && (
          <div className="flex items-center gap-3">
            <MoonLoader size={22} color="#ffffff" />
            <span className="text-foreground">Verificando...</span>
          </div>
        )}
        <MessageSuccess message={success} />
        {!success && <MessageError message={error} />}
      </div>
    </CardWrapper>
  );
};
