'use client'

import { useEffect, useRef } from 'react'

import { AURORA_FRAGMENT, AURORA_VERTEX } from './auroraShader'

/** Segundos de "adelanto": en t = 0 el ruido arranca demasiado uniforme. */
const TIME_OFFSET = 12

const compile = (gl: WebGLRenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null
}

/**
 * Client Component: la aurora es WebGL y solo existe en el navegador.
 *
 * Se dibuja mientras el hero está en pantalla. Con `prefers-reduced-motion`
 * queda un único cuadro quieto. Sin WebGL el canvas queda vacío y el hero se
 * ve con la foto sola: nada se rompe.
 */
export function AuroraCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas?.getContext('webgl', {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
      powerPreference: 'low-power',
    })
    if (!canvas || !gl) return

    const vertex = compile(gl, gl.VERTEX_SHADER, AURORA_VERTEX)
    const fragment = compile(gl, gl.FRAGMENT_SHADER, AURORA_FRAGMENT)
    const program = gl.createProgram()
    if (!vertex || !fragment || !program) return
    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return
    gl.useProgram(program)

    // Un triángulo que cubre toda la pantalla: el shader hace el resto.
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, 'p')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(program, 'uRes')
    const uTime = gl.getUniformLocation(program, 'uTime')
    const uPointer = gl.getUniformLocation(program, 'uPointer')

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const start = performance.now()
    // El puntero se sigue con retardo, para que la aurora derive y no salte.
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 }
    let frame = 0
    let visible = true

    const draw = (now: number) => {
      pointer.x += (pointer.targetX - pointer.x) * 0.04
      pointer.y += (pointer.targetY - pointer.y) * 0.04
      gl.uniform1f(uTime, (now - start) / 1000 + TIME_OFFSET)
      gl.uniform2f(uPointer, pointer.x, pointer.y)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
      const width = Math.max(1, Math.round(canvas.clientWidth * ratio))
      const height = Math.max(1, Math.round(canvas.clientHeight * ratio))
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
      }
      gl.viewport(0, 0, width, height)
      gl.uniform2f(uRes, width, height)
      // Redimensionar borra el canvas; quieto, hay que volver a pintarlo.
      if (reduceMotion) draw(start)
    }

    const loop = (now: number) => {
      if (visible) draw(now)
      frame = requestAnimationFrame(loop)
    }

    const onPointerMove = (event: PointerEvent) => {
      pointer.targetX = event.clientX / window.innerWidth - 0.5
      pointer.targetY = 0.5 - event.clientY / window.innerHeight
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true
    })
    visibilityObserver.observe(canvas)

    resize()
    if (!reduceMotion) {
      if (window.matchMedia('(pointer: fine)').matches) {
        window.addEventListener('pointermove', onPointerMove, { passive: true })
      }
      frame = requestAnimationFrame(loop)
    }

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}
