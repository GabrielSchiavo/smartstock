'use client';

import Link from 'next/link';
import { BackButtonProps } from '@/types';

export const BackButton = ({ href, label }: BackButtonProps) => {
  return (
    <p className="text-muted-foreground text-center text-sm font-normal">
      Voltar para{' '}
      <Link
        href={href}
        className="hover:text-foreground h-fit! w-fit! underline underline-offset-4"
      >
        {label}
      </Link>
    </p>
  );
};
