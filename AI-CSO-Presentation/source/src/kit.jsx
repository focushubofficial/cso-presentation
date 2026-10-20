import React, { useId, useMemo } from 'react'
import { motion } from 'framer-motion'

export const EASE = [0.2, 0.8, 0.2, 1]
export const PAL = {
  warm: { g: ['#FFE75E', '#FF7A3D'], x: '#7d2308', c: '#FFD84A' },
  cool: { g: ['#A4FFEF', '#4FA3FF'], x: '#08397a', c: '#6FF3DD' },
  pink: { g: ['#FFC9F3', '#B58CFF'], x: '#40208f', c: '#FFA6EC' },
  lime: { g: ['#F4FF80', '#35E08F'], x: '#0b5e3f', c: '#D7FF55' },
}

/* ---------- geometry helpers for wrapping text around a subject ---------- */
export function edgeX(edge, y) {
  if (!edge || y < edge[0][1] || y > edge[edge.length - 1][1]) return null
  for (let i = 1; i < edge.length; i++) {
    const [x0, y0] = edge[i - 1], [x1, y1] = edge[i]
    if (y >= y0 && y <= y1) return y1 === y0 ? x0 : x0 + ((y - y0) / (y1 - y0)) * (x1 - x0)
  }
  return null
}
export const mirror = (edge, cx) => edge.map(([x, y]) => [2 * cx - x, y])
export function ellipseEdge(cx, cy, rx, ry, side) {
  const pts = []
  for (let t = -90; t <= 90; t += 10) {
    const r = (t * Math.PI) / 180
    pts.push([side === 'L' ? cx - rx * Math.cos(r) : cx + rx * Math.cos(r), cy + ry * Math.sin(r)])
  }
  return pts
}
function shapePts(edge, side, x, y, w, h) {
  const pts = []
  for (let yy = 0; yy <= h; yy += 16) {
    const ex = edgeX(edge, y + yy)
    let lx
    if (side === 'L') lx = ex == null ? w : Math.min(w, Math.max(0, ex - x))
    else lx = ex == null ? 0 : Math.min(w, Math.max(0, ex - x))
    pts.push(`${lx.toFixed(0)}px ${yy}px`)
  }
  if (side === 'L') pts.push(`${w}px ${h}px`, `${w}px 0px`)
  else pts.push(`0px ${h}px`, `0px 0px`)
  return pts.join(',')
}

/* ---------- entrance / exit variants (sides, ups, downs) ---------- */
const offs = {
  left: { x: -280 }, right: { x: 280 }, up: { y: -220 }, down: { y: 220 },
  zoom: { scale: 0.55 }, spin: { rotate: -14, scale: 0.6 }, none: {},
}
export const elV = {
  hidden: c => ({ opacity: 0, filter: 'blur(14px)', ...offs[c.dir || 'up'] }),
  show: c => ({ opacity: 1, filter: 'blur(0px)', x: 0, y: 0, scale: 1, rotate: 0, transition: { delay: 0.1 + (c.i || 0) * 0.14, duration: 0.8, ease: EASE } }),
  exit: c => ({ opacity: 0, filter: 'blur(10px)', ...offs[c.dir || 'up'], transition: { duration: 0.4 } }),
}
export const Box = ({ x, y, w, i, dir, children, z = 1, origin }) => (
  <motion.div custom={{ i, dir }} variants={elV}
    style={{ position: 'absolute', left: x, top: y, width: w, zIndex: z, transformOrigin: origin || '50% 50%', pointerEvents: 'none' }}>
    {children}
  </motion.div>
)

/* ---------- thick script headline with 3D extrusion ---------- */
export function Script({ lines, size = 100, pal = 'warm', anchor = 'start', w = 900, depth = 10, stroke = 12, tilt, font = 'Pacifico', lh = 1.28, spacing = 0 }) {
  const id = useId().replace(/:/g, '')
  const P = PAL[pal]
  const L = size * lh, pad = depth + stroke
  const H = lines.length * L + pad * 2
  const tx = anchor === 'middle' ? w / 2 : anchor === 'end' ? w - pad : pad
  const ex = []
  for (let i = depth; i >= 1; i--) ex.push(<use key={i} href={'#t' + id} x={i * 0.5} y={i * 0.85} fill={P.x} stroke={P.x} strokeWidth={stroke} />)
  const tr = tilt ? `perspective(${tilt.p || 1500}px) rotateX(${tilt.rx || 0}deg) rotateY(${tilt.ry || 0}deg) rotateZ(${tilt.rz || 0}deg)` : undefined
  return (
    <div style={{ transform: tr, transformOrigin: anchor === 'middle' ? '50% 50%' : anchor === 'end' ? '100% 50%' : '0% 50%' }}>
      <svg width={w} height={H} viewBox={`0 0 ${w} ${H}`} style={{ overflow: 'visible', display: 'block' }}>
        <defs>
          <linearGradient id={'g' + id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={P.g[0]} /><stop offset="1" stopColor={P.g[1]} /></linearGradient>
          <g id={'t' + id} fontFamily={font + ', cursive'} fontSize={size} textAnchor={anchor} letterSpacing={spacing}>
            {lines.map((l, i) => <text key={i} x={tx} y={pad + size * 0.92 + i * L}>{l}</text>)}
          </g>
        </defs>
        {ex}
        <use href={'#t' + id} fill="#fff" stroke="#fff" strokeWidth={stroke} />
        <use href={'#t' + id} fill={`url(#g${id})`} />
      </svg>
    </div>
  )
}

/* ---------- text on a curved path (full-stage overlay) ---------- */
export function Curve({ d, text, size = 70, pal = 'warm', font = 'Pacifico', off = '50%', anchor = 'middle', depth = 9, stroke = 11, spacing = 0, tilt, wipe = 'l' }) {
  const id = useId().replace(/:/g, '')
  const P = PAL[pal]
  const ex = []
  for (let i = depth; i >= 1; i--) ex.push(<use key={i} href={'#t' + id} x={i * 0.5} y={i * 0.85} fill={P.x} stroke={P.x} strokeWidth={stroke} />)
  const from = wipe === 'l' ? 'inset(0 100% 0 0)' : wipe === 'r' ? 'inset(0 0 0 100%)' : wipe === 'd' ? 'inset(0 0 100% 0)' : 'inset(100% 0 0 0)'
  const tr = tilt ? `perspective(${tilt.p || 1400}px) rotateX(${tilt.rx || 0}deg) rotateY(${tilt.ry || 0}deg)` : undefined
  return (
    <motion.div custom={{}} initial={{ clipPath: from }} animate={{ clipPath: 'inset(-40% -10% -40% -10%)', transition: { duration: 1.3, delay: 0.25, ease: EASE } }}
      exit={{ opacity: 0, transition: { duration: 0.35 } }}
      style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, pointerEvents: 'none', transform: tr, transformOrigin: '50% 60%' }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <defs>
          <linearGradient id={'g' + id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={P.g[0]} /><stop offset="1" stopColor={P.g[1]} /></linearGradient>
          <path id={'p' + id} d={d} />
          <text id={'t' + id} fontFamily={font + ', cursive'} fontSize={size} textAnchor={anchor} letterSpacing={spacing}>
            <textPath href={'#p' + id} startOffset={off}>{text}</textPath>
          </text>
        </defs>
        {ex}
        <use href={'#t' + id} fill="#fff" stroke="#fff" strokeWidth={stroke} />
        <use href={'#t' + id} fill={`url(#g${id})`} />
      </svg>
    </motion.div>
  )
}

/* ---------- body text that wraps along a subject outline ---------- */
export function Wrap({ side = 'L', x, y, w, h, edge, paras, size = 30, align, margin = 28 }) {
  const pts = useMemo(() => (edge ? shapePts(edge, side, x, y, w, h) : null), [edge, side, x, y, w, h])
  return (
    <div style={{ position: 'relative', width: w, height: h }}>
      {pts && <div style={{ float: side === 'L' ? 'right' : 'left', width: w, height: h, shapeOutside: `polygon(${pts})`, shapeMargin: margin + 'px' }} />}
      <div className="wtext" style={{ fontSize: size, textAlign: align || (side === 'L' ? 'right' : 'left') }}>
        {paras.map((p, i) => <p key={i} dangerouslySetInnerHTML={{ __html: p }} />)}
      </div>
    </div>
  )
}

/* ---------- hand-written note with an animated arrow ---------- */
export function Note({ text, size = 46, color = '#FFE75E', rot = -4, w = 380, align = 'left' }) {
  return <div className="hand" style={{ fontSize: size, color, transform: `rotate(${rot}deg)`, width: w, textAlign: align }}>{text}</div>
}
export function Arrow({ d, color = '#FFE75E', delay = 0.9 }) {
  return (
    <motion.div custom={{}} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay } }} exit={{ opacity: 0, transition: { duration: 0.25 } }}
      style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, pointerEvents: 'none' }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ overflow: 'visible' }}>
        <defs><marker id="arw" viewBox="0 0 12 12" refX="9" refY="6" markerWidth="8" markerHeight="8" orient="auto"><path d="M1,1 L11,6 L1,11" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" /></marker></defs>
        <motion.path d={d} fill="none" stroke="#000" strokeOpacity=".55" strokeWidth="9" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1, transition: { delay, duration: 0.9 } }} />
        <motion.path d={d} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" markerEnd="url(#arw)" initial={{ pathLength: 0 }} animate={{ pathLength: 1, transition: { delay, duration: 0.9 } }} />
      </svg>
    </motion.div>
  )
}
