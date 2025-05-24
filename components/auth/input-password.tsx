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
        size="sm"
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        onClick={() => setShowPassword(!showPassword)}
        aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
      >
        {showPassword ? (
          <EyeOffIcon className="ml-auto h-4 w-4 opacity-50" />
        ) : (
          <EyeIcon className="ml-auto h-4 w-4 opacity-50" />
        )}
      </Button>
    </div>
  )
}