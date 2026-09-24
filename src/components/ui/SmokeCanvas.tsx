import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
  maxOpacity: number
  life: number
  maxLife: number
  r: number
  g: number
  b: number
  angle: number
  angleSpeed: number
}

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

// Simple smooth noise for organic turbulence
function snoise(x: number, y: number) {
  return Math.sin(x * 1.3 + y * 0.7) * Math.cos(x * 0.5 - y * 1.1) * 0.5
       + Math.sin(x * 0.4 + y * 1.6) * 0.3
       + Math.cos(x * 2.1 - y * 0.3) * 0.2
}

export function SmokeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    if (!ctx) return

    let W = window.innerWidth
    let H = window.innerHeight
    canvas.width = W
    canvas.height = H

    window.addEventListener('resize', () => {
      W = window.innerWidth
      H = window.innerHeight
      canvas.width = W
      canvas.height = H
    })

    const particles: Particle[] = []
    let time = 0

    // Colour palette: dense white/grey fog with very subtle purple tinting
    const palette = [
      { r: 255, g: 255, b: 255 }, // pure white
      { r: 240, g: 238, b: 245 }, // white with purple hint
      { r: 210, g: 205, b: 225 }, // light grey-purple
      { r: 190, g: 185, b: 210 }, // medium grey-purple
      { r: 170, g: 165, b: 200 }, // darker grey-purple
      { r: 155, g: 140, b: 195 }, // purple-grey
      { r: 200, g: 195, b: 220 }, // soft silver
    ]

    function spawn(prelife = 0) {
      const c = palette[Math.floor(Math.random() * palette.length)]
      const maxLife = 18000 + Math.random() * 14000
      const radius = 220 + Math.random() * 380

      particles.push({
        x: W * (Math.random()),
        y: H * (0.5 + Math.random() * 0.7),   // start in lower half
        vx: (Math.random() - 0.5) * 0.18,
        vy: -(0.04 + Math.random() * 0.1),      // slow upward drift
        radius,
        opacity: 0,
        maxOpacity: 0.045 + Math.random() * 0.055,  // low per-particle, stacks densely
        life: prelife,
        maxLife,
        r: c.r, g: c.g, b: c.b,
        angle: Math.random() * Math.PI * 2,
        angleSpeed: (Math.random() - 0.5) * 0.0004,
      })
    }

    // Pre-fill screen so smoke is visible immediately
    for (let i = 0; i < 90; i++) {
      spawn(Math.random() * 18000)
      // Spread particles across the whole screen initially
      particles[particles.length - 1].y = Math.random() * H
    }

    let lastSpawnTime = 0
    let animId: number

    function draw(ts: number) {
      time += 0.0008
      ctx.clearRect(0, 0, W, H)

      // Spawn a new particle every ~300ms to maintain density
      if (ts - lastSpawnTime > 300) {
        spawn()
        lastSpawnTime = ts
      }

      // Draw back-to-front for natural layering
      ctx.globalCompositeOperation = 'source-over'

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life += 16

        if (p.life >= p.maxLife) {
          particles.splice(i, 1)
          continue
        }

        const prog = p.life / p.maxLife

        // Smooth fade in → sustain → fade out
        if (prog < 0.1) {
          p.opacity = lerp(0, p.maxOpacity, prog / 0.1)
        } else if (prog > 0.75) {
          p.opacity = lerp(p.maxOpacity, 0, (prog - 0.75) / 0.25)
        } else {
          p.opacity = p.maxOpacity
        }

        // Turbulent organic movement
        const nx = snoise(p.x * 0.0018 + time, p.y * 0.0018)
        const ny = snoise(p.x * 0.0018 + 50, p.y * 0.0018 + time * 0.7)
        p.vx = lerp(p.vx, nx * 0.25, 0.008)
        p.vy = lerp(p.vy, -0.07 + ny * 0.1, 0.006)
        p.x += p.vx
        p.y += p.vy
        p.angle += p.angleSpeed
        // Slowly grow for billowing effect
        p.radius += 0.06

        // Draw large soft ellipse — wide and not very tall
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.angle)

        const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, p.radius)
        grd.addColorStop(0,    `rgba(${p.r},${p.g},${p.b},${(p.opacity).toFixed(4)})`)
        grd.addColorStop(0.35, `rgba(${p.r},${p.g},${p.b},${(p.opacity * 0.75).toFixed(4)})`)
        grd.addColorStop(0.65, `rgba(${p.r},${p.g},${p.b},${(p.opacity * 0.4).toFixed(4)})`)
        grd.addColorStop(1,    `rgba(${p.r},${p.g},${p.b},0)`)

        ctx.fillStyle = grd
        ctx.beginPath()
        // Wide horizontal ellipse for the rolling fog look
        ctx.ellipse(0, 0, p.radius, p.radius * 0.55, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      animId = requestAnimationFrame(draw)
    }

    animId = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.88,
      }}
    />
  )
}
