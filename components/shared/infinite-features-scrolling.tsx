import { Marquee } from "../ui/marquee";
import {
  ArrowRightLeftIcon,
  BarChart3Icon,
  BellRingIcon,
  CalendarClockIcon,
  HistoryIcon,
  KeyRoundIcon,
  LayoutDashboardIcon,
  LucideIcon,
  PrinterIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  SmartphoneIcon,
  UsersIcon,
} from "lucide-react";

const features = [
  { id: 1, icon: CalendarClockIcon, title: "Controle de Validade" },
  { id: 2, icon: BarChart3Icon, title: "Relatórios Completos" },
  { id: 3, icon: SmartphoneIcon, title: "Acesso Onde Estiver" },
  { id: 4, icon: BellRingIcon, title: "Alertas Inteligentes" },
  { id: 5, icon: LayoutDashboardIcon, title: "Dashboard Centralizado" },
  { id: 6, icon: SearchIcon, title: "Busca e Filtros Avançados" },
  { id: 7, icon: UsersIcon, title: "Controle de Usuários" },
  { id: 8, icon: HistoryIcon, title: "Logs de Atividades" },
  { id: 9, icon: PrinterIcon, title: "PDF para Impressão" },
  { id: 10, icon: KeyRoundIcon, title: "Níveis de Acesso" },
  { id: 11, icon: ArrowRightLeftIcon, title: "Entradas e Saídas" },
  { id: 12, icon: SlidersHorizontalIcon, title: "Ajustes de Estoque" },
];

const firstRow = features.slice(0, features.length / 2);
const secondRow = features.slice(features.length / 2);

const FeatureBadge = ({ icon, title }: { icon: LucideIcon; title: string }) => {
  const IconComponent = icon;
  return (
    <div className="bg-accent/70 flex items-center gap-3 rounded-full text-base px-4 py-2 shadow-2xs">
      <IconComponent className="size-4 shrink-0" />
      {title}
    </div>
  );
};

export function InfiniteFeaturesScrolling() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <Marquee
        repeat={4}
        pauseOnHover
        className="[--duration:30s] gap-5 *:gap-5"
      >
        {firstRow.map((feature) => (
          <FeatureBadge key={feature.id} {...feature} />
        ))}
      </Marquee>
      <Marquee
        repeat={4}
        reverse
        pauseOnHover
        className="[--duration:30s] gap-5 *:gap-5"
      >
        {secondRow.map((feature) => (
          <FeatureBadge key={feature.id} {...feature} />
        ))}
      </Marquee>
      <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r"></div>
      <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l"></div>
    </div>
  );
}
