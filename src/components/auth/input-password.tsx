'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { ComponentProps } from 'react'

// Use ComponentProps para extrair as props do componente Input
export type PasswordInputProps = ComponentProps<typeof Input>

export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative">
      <Input
        type={showPassword ? 'text' : 'password'}
        className={className}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 items-center justify-center size-8 shrink-0 hover:bg-accent-foreground/5!"
        onClick={() => setShowPassword(!showPassword)}
        aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
      >
        {showPassword ? (
          <EyeOffIcon className="size-4 shrink-0 opacity-50" />
        ) : (
          <EyeIcon className="size-4 shrink-0 opacity-50" />
        )}
      </Button>
    </div>
  )
}