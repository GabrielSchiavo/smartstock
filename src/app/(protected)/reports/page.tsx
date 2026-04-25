import { RoleGate } from '@/components/auth/role-gate';
import { Metadata } from 'next';
import { UserType } from '@/types';
import { ROUTES } from '@/config/routes';
import { SectionFormTableReport } from '@/components/report/section-table-report';

export const metadata: Metadata = {
  title: 'Relatórios - SmartStock',
  description: 'Gere relatórios de estoque.',
  alternates: {
    canonical: `${ROUTES.PAGE_REPORTS}`,
  },
};

export default function ReportsPage() {
  return (
    <RoleGate isPage={true} allowedRoles={[UserType.ADMIN, UserType.DEFAULT, UserType.REPORT]}>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-2">
              <h1 className="text-lg leading-none font-semibold">
                <span className="flex items-center gap-3">Gerar Relatório</span>
              </h1>
              <p className="text-muted-foreground w-full text-sm md:max-w-md">
                {"Clique em 'Gerar Relatório' quando terminar."}
              </p>
            </div>
            <SectionFormTableReport />
          </div>
        </div>
      </div>
    </RoleGate>
  );
}
