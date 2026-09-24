'use client'

import type { CSSProperties } from 'react'
import { useEffect, useRef, useState } from 'react'

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

const money = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 })
const dayMonth = new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'short' })

/** Parte del año transcurrida, de 0 a 1, en la hora local de quien mira. */
const yearProgress = (now: Date) => {
  const start = new Date(now.getFullYear(), 0, 1).getTime()
  const end = new Date(now.getFullYear() + 1, 0, 1).getTime()
  return (now.getTime() - start) / (end - start)
}

/**
 * Client Component: lo que va del año de un costo anual, contando en vivo.
 *
 * La fecha es la de quien mira, así que todo se calcula en el navegador: la
 * página es estática y en el servidor la cifra quedaría congelada en el día del
 * build. Hasta montar, la línea del monto queda reservada y vacía.
 *
 * La barra se fija una sola vez al montar; si se actualizara con cada tic, su
 * transición de entrada volvería a empezar sin llegar nunca a destino.
 */
export function YearCost({ annualAmount }: { annualAmount: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [today, setToday] = useState<{ progress: number; label: string; year: number } | null>(null)
  const [amount, setAmount] = useState<number | null>(null)

  useEffect(() => {
    const now = new Date()
    setToday({
      progress: yearProgress(now),
      label: dayMonth.format(now).replace('.', ''),
      year: now.getFullYear(),
    })

    const tick = () => setAmount(annualAmount * yearProgress(new Date()))
    tick()

    // Solo cuenta mientras está en pantalla.
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let timer: number | undefined
    const observer = new IntersectionObserver(([entry]) => {
      window.clearInterval(timer)
      if (entry?.isIntersecting) timer = window.setInterval(tick, reduce ? 1000 : 100)
    })
    if (ref.current) observer.observe(ref.current)

    return () => {
      observer.disconnect()
      window.clearInterval(timer)
    }
  }, [annualAmount])

  return (
    <div ref={ref} className="year-cost" style={{ '--p': today?.progress ?? 0 } as CSSProperties}>
      <p className="year-cost__value" aria-hidden="true">
        {amount === null ? <>&nbsp;</> : `US$ ${money.format(amount)}`}
      </p>
      {today && amount !== null ? (
        <p className="sr-only">
          En lo que va de {today.year} suman cerca de US$ {money.format(Math.round(amount / 1e9))}{' '}
          mil millones.
        </p>
      ) : null}

      <div className="year-cost__track" aria-hidden="true">
        <span className="year-cost__fill" />
        {today ? <span className="year-cost__today">Hoy, {today.label}</span> : null}
      </div>
      <div className="year-cost__months" aria-hidden="true">
        {MONTHS.map((month) => (
          <span key={month}>{month}</span>
        ))}
      </div>
    </div>
  )
}
