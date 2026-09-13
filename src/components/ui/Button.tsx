import Link from 'next/link'

import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'emphasis'

const BASE =
  'font-ui inline-flex items-center justify-center gap-2 rounded-button px-5 py-3 text-[0.9375rem] leading-none font-medium whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-[0.38]'

/**
 * Variantes del CTA tal como las define el design system: austero, nunca
 * urgente. El tamaño de 15px es propio del botón y no sale de la escala
 * editorial, igual que en la especificación original.
 */
const VARIANTS: Record<Variant, string> = {
  primary: 'bg-anchor text-on-anchor border-[1.5px] border-transparent hover:bg-anchor/88',
  // Sobre la superficie de anclaje se invierte, igual que en el design system:
  // sin esto el botón queda verde noche sobre verde noche, o sea invisible.
  secondary:
    'border-ink text-ink border-[1.5px] hover:bg-ink/6 [.on-anchor_&]:border-on-anchor [.on-anchor_&]:text-on-anchor [.on-anchor_&]:hover:bg-on-anchor/10',
  ghost:
    'text-ink border-[1.5px] border-transparent px-0 hover:underline [.on-anchor_&]:text-on-anchor',
  emphasis: 'bg-tension text-on-anchor hover:opacity-88',
}

type ButtonProps = {
  children: React.ReactNode
  className?: string
  variant?: Variant
} & ({ href: string; type?: never } | { href?: never; type: 'submit' | 'button' })

export function Button({ children, className, variant = 'primary', ...props }: ButtonProps) {
  const classes = cn(BASE, VARIANTS[variant], className)

  if (props.href) {
    // Los enlaces internos y las anclas se resuelven con <a> nativo; Link solo
    // aporta prefetch en rutas, y esta landing tiene una sola.
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button type={props.type} className={classes} {...props}>
      {children}
    </button>
  )
}
