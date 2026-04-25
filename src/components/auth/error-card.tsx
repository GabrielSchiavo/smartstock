import { CardWrapper } from '@/components/auth/card-wrapper';
import { ROUTES } from '@/config/routes';
import { TriangleAlertIcon } from 'lucide-react';

export const ErrorCard = () => {
  return (
    <CardWrapper
      headerTitle="Erro!"
      headerLabel="Ops! Algo deu errado!"
      backButtonHref={ROUTES.AUTH_LOGIN}
      backButtonLabel="Login"
    >
      <div className="flex w-full items-center justify-center">
        <TriangleAlertIcon className="text-destructive" />
      </div>
    </CardWrapper>
  );
};
