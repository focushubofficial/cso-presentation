import React, { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Maximize, Minimize, MoveRight } from 'lucide-react'
import { GROUPS, FLAT } from './slides.jsx'
import { Box, Script, Curve, Wrap, Note } from './kit.jsx'

const sceneV = { hidden: {}, show: {}, exit: { transition: { duration: 0.45 } } }
const STILL = typeof location !== 'undefined' && new URLSearchParams(location.search).has('still')
const WEBM = typeof location !== 'undefined' && new URLSearchParams(location.search).has('webm')
const START = typeof location !== 'undefined' ? Math.max(0, Math.min(FLAT.length - 1, (parseInt(location.hash.slice(1)) || 1) - 1)) : 0

export function SceneView({ elements }) {
  return (
    <motion.div className="scene" variants={sceneV} initial="hidden" animate="show" exit="exit">
      {elements.map((e, n) => {
        const i = e.i ?? 0
        if (e.k === 'V') return <Curve key={n} {...e} />
        if (e.k === 'S') return <Box key={n} x={e.x} y={e.y} w={e.w} i={i} dir={e.dir}><Script lines={e.lines} size={e.size} pal={e.pal} anchor={e.anchor} w={e.w} tilt={e.tilt} depth={e.depth} /></Box>
        if (e.k === 'T') return <Box key={n} x={e.x} y={e.y} w={e.w} i={i} dir={e.dir}><Wrap {...e} /></Box>
        if (e.k === 'N') return <Box key={n} x={e.x} y={e.y} w={e.w} i={i} dir={e.dir}><Note text={e.text} size={e.size} color={e.color} rot={e.rot} w={e.w} align={e.align} /></Box>
        if (e.k === 'X') return (
          <Box key={n} x={e.x} y={e.y} w={e.w} i={i} dir={e.dir} z={5}>
            <div className="sticker" style={{ width: e.w / e.s, transform: `scale(${e.s})`, '--bc': e.bc }}>{e.el}</div>
          </Box>
        )
        return null
      })}
    </motion.div>
  )
}

const sleep = ms => new Promise(r => setTimeout(r, ms))
async function whenReady(v) {
  if (!v || v.readyState >= 2) return
  await new Promise(res => { v.addEventListener('loadeddata', res, { once: true }); setTimeout(res, 8000) })
}
async function prime(v, mode) {
  if (!v) return
  await whenReady(v)
  v.pause()
  const target = mode === 'end' ? Math.max(0, (v.duration || 0) - 0.04) : 0
  if (Math.abs(v.currentTime - target) > 0.02) {
    await new Promise(res => {
      const h = () => { v.removeEventListener('seeked', h); res() }
      v.addEventListener('seeked', h); v.currentTime = target; setTimeout(res, 900)
    })
  }
}
const DIRS = { left: [1, 0], right: [-1, 0], up: [0, 1], down: [0, -1] }
const EASE_PUSH = [0.76, 0, 0.2, 1]

export default function App() {
  const wraps = useRef([])
  const vids = useRef([])
  const busy = useRef(false)
  const idxRef = useRef(STILL ? START : 0)
  const [idx, setIdx] = useState(STILL ? START : 0)
  const [show, setShow] = useState(STILL)
  const [loading, setLoading] = useState(!STILL)
  const [scale, setScale] = useState(1)
  const [hint, setHint] = useState(true)
  const [full, setFull] = useState(false)

  useEffect(() => {
    const f = () => setScale(Math.min(window.innerWidth / 1920, window.innerHeight / 1080))
    f(); window.addEventListener('resize', f); return () => window.removeEventListener('resize', f)
  }, [])
  useEffect(() => {
    const f = () => setFull(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', f); return () => document.removeEventListener('fullscreenchange', f)
  }, [])

  // opening: first video eases in and starts playing
  useEffect(() => {
    if (STILL) { wraps.current[FLAT[START].gi].classList.add('vis'); return }
    let dead = false
    ;(async () => {
      const w = wraps.current[0], v = vids.current[0]
      await prime(v, 'play')
      if (dead) return
      w.classList.add('vis'); setLoading(false)
      animate(w, { opacity: [0, 1], scale: [1.12, 1] }, { duration: 1.6, ease: [0.2, 0.8, 0.2, 1] })
      v.play().catch(() => {})
      await sleep(900)
      setShow(true)
    })()
    return () => { dead = true }
  }, [])

  const slide = useCallback(async (from, to, kind, forward, mode, target) => {
    const A = wraps.current[from], B = wraps.current[to]
    let [dx, dy] = DIRS[kind]; if (!forward) { dx = -dx; dy = -dy }
    await prime(vids.current[to], mode)
    B.classList.add('vis'); B.style.zIndex = 3; A.style.zIndex = 2
    const dur = 1.05
    animate(B, { x: [dx * 1920, 0], y: [dy * 1080, 0] }, { duration: dur, ease: EASE_PUSH })
    animate(A, { x: [0, -dx * 520], y: [0, -dy * 290], scale: [1, 0.93], filter: ['brightness(1)', 'brightness(.45)'] }, { duration: dur, ease: EASE_PUSH })
    if (mode === 'play') vids.current[to].play().catch(() => {})
    await sleep(dur * 520)
    idxRef.current = target; setIdx(target); setShow(true)
    await sleep(dur * 480)
    A.classList.remove('vis'); vids.current[from].pause()
    animate(A, { x: 0, y: 0, scale: 1, filter: 'brightness(1)' }, { duration: 0 })
  }, [])

  const go = useCallback(async d => {
    if (busy.current) return
    const cur = FLAT[idxRef.current]
    const t = Math.max(0, Math.min(FLAT.length - 1, idxRef.current + d))
    if (t === idxRef.current) return
    setHint(false)
    const nxt = FLAT[t]
    if (cur.gi === nxt.gi) { idxRef.current = t; setIdx(t); return }
    if (STILL) {
      wraps.current[cur.gi].classList.remove('vis'); wraps.current[nxt.gi].classList.add('vis')
      idxRef.current = t; setIdx(t); return
    }
    busy.current = true
    setShow(false)
    await sleep(480)
    const forward = nxt.gi > cur.gi
    const kind = GROUPS[forward ? nxt.gi : cur.gi].trans
    await slide(cur.gi, nxt.gi, kind, forward, nxt.si === 0 ? 'play' : 'end', t)
    busy.current = false
  }, [slide])
  const jump = useCallback(t => go(t - idxRef.current), [go])

  const toggleFull = () => { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen?.() }
  useEffect(() => {
    const k = e => {
      if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(e.key)) { e.preventDefault(); go(1) }
      else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(e.key)) { e.preventDefault(); go(-1) }
      else if (e.key === 'Home') jump(0)
      else if (e.key === 'End') jump(FLAT.length - 1)
      else if (e.key === 'f' || e.key === 'F') toggleFull()
    }
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k)
  }, [go, jump])

  const cur = FLAT[idx]
  const N = FLAT.length
  return (
    <div className="viewport">
      <div className="deck" style={{ transform: `translate(-50%,-50%) scale(${scale})` }}
        onClick={e => { if (e.target.closest('.sticker,.ui-btn,.prog')) return; go(1) }}>
        {GROUPS.map((g, i) => (
          <div key={g.video} className="vwrap" ref={el => (wraps.current[i] = el)} style={{ "--crop": g.crop || 1 }}>
            {STILL ? <img src={`stills/v${i + 1}.png`} alt="" />
              : <video ref={el => (vids.current[i] = el)} src={WEBM ? g.video.replace('.mp4', '.webm') : g.video} muted playsInline preload="auto" disablePictureInPicture />}
            <div className="vdim" style={{ background: `rgba(2,6,16,${g.dim})` }} />
          </div>
        ))}
        <div className="grade" /><div className="vignette" />
        <AnimatePresence mode="wait">{show && <SceneView key={idx} elements={cur.s} />}</AnimatePresence>
        <div className="hud">
          <div className="prog">
            {GROUPS.map((g, gi) => {
              const w = gi < cur.gi ? 100 : gi === cur.gi ? ((cur.si + 1) / g.slides.length) * 100 : 0
              return <div className="seg" key={gi}><i style={{ width: w + '%' }} /></div>
            })}
          </div>
          <div className="hudr">
            <span className="count">{String(idx + 1).padStart(2, '0')} / {N}</span>
            <button className="ui-btn" onClick={() => go(-1)} disabled={idx === 0} aria-label="Previous"><ChevronLeft size={24} /></button>
            <button className="ui-btn" onClick={() => go(1)} disabled={idx === N - 1} aria-label="Next"><ChevronRight size={24} /></button>
            <button className="ui-btn" onClick={toggleFull} aria-label="Fullscreen">{full ? <Minimize size={20} /> : <Maximize size={20} />}</button>
          </div>
        </div>
        <AnimatePresence>
          {hint && !loading && !STILL && (
            <motion.div className="hint" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 2.4 }}>
              click anywhere or press <MoveRight size={34} strokeWidth={3} />
            </motion.div>
          )}
        </AnimatePresence>
        {loading && <div className="loader">loading…</div>}
      </div>
    </div>
  )
}
