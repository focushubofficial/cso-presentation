import React, { useEffect, useMemo, useState } from 'react'
import { Download, Eye, Zap, Database, Play, Pause, Check, X, Cpu, MemoryStick, HardDrive, Layers } from 'lucide-react'

const Label = ({ icon: I, children }) => (<div className="wlabel">{I && <I size={18} />}{children}</div>)

/* ---------- CPU instruction cycle ---------- */
export function CycleStepper() {
  const steps = [
    { k: 'Fetch', I: Download, d: <>The control unit reads the next instruction from memory, using the address held in the <b>Program Counter (PC)</b>. PC then moves on by one.</>, pc: 101, ir: 'MAC R1,R2,R3', r1: 10, hot: ['pc', 'ir'] },
    { k: 'Decode', I: Eye, d: <>The control unit works out what the instruction means: <b>“multiply R2 by R3, then add to R1”</b>, and switches on the ALU.</>, pc: 101, ir: 'MAC R1,R2,R3', r1: 10, hot: ['ir'] },
    { k: 'Execute', I: Zap, d: <>The <b>ALU</b> does the maths: 3 × 4 = 12, then 10 + 12 = 22. The answer is held for a moment.</>, pc: 101, ir: 'MAC R1,R2,R3', r1: 10, hot: ['r2', 'r3'] },
    { k: 'Store', I: Database, d: <>The result <b>22</b> is written back into register R1. Now the CPU is ready for the next instruction.</>, pc: 101, ir: 'MAC R1,R2,R3', r1: 22, hot: ['r1'] },
  ]
  const [i, setI] = useState(0)
  const [auto, setAuto] = useState(true)
  useEffect(() => { if (!auto) return; const t = setInterval(() => setI(x => (x + 1) % 4), 2200); return () => clearInterval(t) }, [auto])
  const s = steps[i]
  const R = (id, name, val) => (<div className={'reg' + (s.hot.includes(id) ? ' hot' : '')}><b>{name}</b><span className="mono">{val}</span></div>)
  return (
    <div className="wid">
      <Label icon={Cpu}>Try it · one MAC instruction</Label>
      <div className="chips">
        {steps.map((x, k) => (<button key={x.k} className={'chip' + (k === i ? ' on' : '')} onClick={() => { setI(k); setAuto(false) }}>{k + 1}. {x.k}</button>))}
        <button className="chip sm" onClick={() => setAuto(a => !a)} aria-label="play pause">{auto ? <Pause size={16} /> : <Play size={16} />}</button>
      </div>
      <div className="note" style={{ minHeight: 86 }}>{s.d}</div>
      <div className="regs">
        {R('pc', 'PC', i === 0 ? '101' : '101')}
        {R('ir', 'IR', 'MAC')}
        {R('r1', 'R1', s.r1)}
        {R('r2', 'R2', 3)}
        {R('r3', 'R3', 4)}
      </div>
    </div>
  )
}

/* ---------- tokens -> numbers -> bits ---------- */
export function TokenBits() {
  const [mode, setMode] = useState('bin')
  const toks = [{ t: 'Hello', id: 15496 }, { t: ' world', id: 995 }]
  const fmt = n => mode === 'bin' ? n.toString(2).padStart(16, '0').replace(/(.{4})/g, '$1 ').trim() : mode === 'hex' ? '0x' + n.toString(16).toUpperCase().padStart(4, '0') : String(n)
  return (
    <div className="wid">
      <Label icon={Layers}>Text → tokens → numbers → bits</Label>
      <div className="chips" style={{ marginBottom: 16 }}>
        {[['bin', 'Binary'], ['hex', 'Hex'], ['dec', 'Decimal']].map(([k, n]) => (<button key={k} className={'chip sm' + (mode === k ? ' on' : '')} onClick={() => setMode(k)}>{n}</button>))}
      </div>
      <div className="mono" style={{ fontSize: 22, color: '#fff', marginBottom: 10 }}>“Hello world”</div>
      {toks.map(x => (
        <div key={x.id} style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: 14, alignItems: 'center', marginBottom: 10 }}>
          <span className="chip on" style={{ textAlign: 'center', whiteSpace: 'pre' }}>[{x.t}]</span>
          <span className="mono" style={{ fontSize: 24, fontWeight: 700, color: 'var(--acc2)' }}>{x.id} → {fmt(x.id)}</span>
        </div>
      ))}
      <div className="note">Token IDs here are illustrative. Real models split text into thousands of such pieces.</div>
    </div>
  )
}

/* ---------- floating point ---------- */
export function FloatViz() {
  const F = {
    FP32: { s: '0', e: '01111100', m: '01000000000000000000000', bias: 127, eInt: 124, range: '≈ ±3 × 10³⁸', dig: '≈ 7 digits', size: '4 bytes' },
    FP16: { s: '0', e: '01100', m: '0100000000', bias: 15, eInt: 12, range: 'up to ≈ 65,504', dig: '≈ 3 digits', size: '2 bytes' },
    BF16: { s: '0', e: '01111100', m: '0100000', bias: 127, eInt: 124, range: '≈ ±3 × 10³⁸ (same as FP32)', dig: '≈ 2 digits', size: '2 bytes' },
  }
  const [k, setK] = useState('FP32')
  const f = F[k]
  const box = (str, cls) => str.split('').map((c, j) => <span key={cls + j} className={'bit mono ' + cls}>{c}</span>)
  return (
    <div className="wid">
      <Label icon={Layers}>Store 0.15625 in three formats</Label>
      <div className="chips" style={{ marginBottom: 16 }}>
        {Object.keys(F).map(n => (<button key={n} className={'chip sm' + (k === n ? ' on' : '')} onClick={() => setK(n)}>{n}</button>))}
      </div>
      <div className="bits" style={{ gap: 3, flexWrap: 'wrap' }}>
        {box(f.s, 's')}<span style={{ width: 8 }} />{box(f.e, 'e')}<span style={{ width: 8 }} />{box(f.m, 'm')}
      </div>
      <div className="legend">
        <span><i style={{ background: '#f43f5e' }} />sign (1)</span>
        <span><i style={{ background: '#f59e0b' }} />exponent ({f.e.length})</span>
        <span><i style={{ background: '#38bdf8' }} />mantissa ({f.m.length})</span>
      </div>
      <div className="note">
        value = (−1)<sup>0</sup> × 1.25 × 2<sup>({f.eInt} − {f.bias})</sup> = 1.25 × 2<sup>−3</sup> = <b>0.15625</b><br />
        {f.size} · range {f.range} · precision {f.dig}
      </div>
    </div>
  )
}

/* ---------- quantisation ---------- */
export function Quant() {
  const O = [
    { n: 'FP32', bits: 32, gb: 28, lv: '4 billion+ values' },
    { n: 'FP16', bits: 16, gb: 14, lv: '65,536 values' },
    { n: 'INT8', bits: 8, gb: 7, lv: '256 values' },
    { n: 'INT4', bits: 4, gb: 3.5, lv: 'only 16 values' },
  ]
  const [i, setI] = useState(1)
  const o = O[i]
  return (
    <div className="wid">
      <Label icon={MemoryStick}>A 7-billion-weight model, weights only</Label>
      <div className="chips" style={{ marginBottom: 18 }}>
        {O.map((x, k) => (<button key={x.n} className={'chip' + (k === i ? ' on' : '')} onClick={() => setI(k)}>{x.n}</button>))}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}>
        <span className="big-num">{o.gb} GB</span><span style={{ fontSize: 22, color: 'var(--ink2)' }}>{o.bits} bits per weight · {o.lv}</span>
      </div>
      <div className="bar" style={{ marginTop: 16 }}><i style={{ width: (o.gb / 28 * 100) + '%' }} /></div>
      <div className="verdict" style={{ fontSize: 21, marginTop: 14 }}>
        {o.gb <= 16 ? <><Check size={26} color="#86efac" /><span style={{ color: '#86efac' }}>Fits on a 16 GB laptop GPU</span></> : <><X size={26} color="#fda4af" /><span style={{ color: '#fda4af' }}>Too big for a 16 GB GPU</span></>}
      </div>
    </div>
  )
}

/* ---------- core visual ---------- */
export function CoreViz() {
  const gpu = useMemo(() => Array.from({ length: 12 * 22 }, (_, j) => (j * 37 % 17) / 17 * 1.1), [])
  return (
    <div className="wid">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 28 }}>
        <div>
          <Label>CPU · a few big cores</Label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
            {Array.from({ length: 8 }, (_, j) => <div key={j} className="cpu-core" style={{ height: 52, animationDelay: j * 0.17 + 's' }} />)}
          </div>
        </div>
        <div>
          <Label>GPU · thousands of tiny cores</Label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(22,1fr)', gap: 4 }}>
            {gpu.map((d, j) => <div key={j} className="gpu-core" style={{ height: 15, animationDelay: d + 's' }} />)}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------- Flynn ---------- */
export function Flynn() {
  const B = [
    ['SISD', 'Single instruction · single data', 'One ordinary CPU core: one step on one number at a time.', false],
    ['SIMD', 'Single instruction · multiple data', 'Same step on many numbers at once. GPUs and vector units.', true],
    ['MISD', 'Multiple instruction · single data', 'Rare. Used in some fault-tolerant systems.', false],
    ['MIMD', 'Multiple instruction · multiple data', 'Many cores doing different jobs. Multi-core CPUs and GPU clusters.', true],
  ]
  return (
    <div className="wid">
      <div className="flynn">
        {B.map(([a, b, c, ai]) => (
          <div key={a} className={'fbox' + (ai ? ' ai' : '')}>
            <h4>{a}{ai && <span>USED BY AI</span>}</h4>
            <div style={{ fontSize: 17, color: 'var(--acc3)', marginTop: 2 }}>{b}</div>
            <p>{c}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------- matrix multiply ---------- */
const MA = [[1, 0, 2], [0, 1, 3], [2, 1, 0]]
const MB = [[2, 1, 0], [1, 3, 1], [3, 0, 2]]
const MC = MA.map((r, i) => MB[0].map((_, j) => r.reduce((s, v, k) => s + v * MB[k][j], 0)))
export function MatMul() {
  const [done, setDone] = useState([])
  const [sel, setSel] = useState(null)
  const [timer, setTimer] = useState(null)
  useEffect(() => () => timer && clearInterval(timer), [timer])
  const cpu = () => {
    timer && clearInterval(timer); setDone([]); let n = 0
    const t = setInterval(() => { n++; setDone(Array.from({ length: n }, (_, j) => j)); if (n >= 9) clearInterval(t) }, 450)
    setTimer(t)
  }
  const gpu = () => { timer && clearInterval(timer); setDone([0, 1, 2, 3, 4, 5, 6, 7, 8]) }
  const [si, sj] = sel ?? [-1, -1]
  return (
    <div className="wid">
      <Label icon={Layers}>Click a result cell · or race CPU vs GPU</Label>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <div className="mat">{MA.map((r, i) => r.map((v, j) => <div key={i + '' + j} className={'cell' + (i === si ? ' hl' : '')}>{v}</div>))}</div>
        <span className="opr">×</span>
        <div className="mat">{MB.map((r, i) => r.map((v, j) => <div key={i + '' + j} className={'cell' + (j === sj ? ' hl' : '')}>{v}</div>))}</div>
        <span className="opr">=</span>
        <div className="mat">{MC.map((r, i) => r.map((v, j) => {
          const idx = i * 3 + j
          return <button key={idx} className={'cell res' + (done.includes(idx) || (si === i && sj === j) ? '' : ' blank')} onClick={() => setSel([i, j])} style={{ cursor: 'pointer' }}>{v}</button>
        }))}</div>
      </div>
      <div className="chips" style={{ marginTop: 14 }}>
        <button className="chip sm" onClick={cpu}>CPU style: one cell at a time</button>
        <button className="chip sm on" onClick={gpu}>GPU style: all 9 at once</button>
      </div>
      <div className="note">{sel ? <>Cell ({si + 1},{sj + 1}) = {MA[si].map((v, k) => `${v}×${MB[k][sj]}`).join(' + ')} = <b>{MC[si][sj]}</b>. It needs no other cell, so all cells can be computed together.</> : <>Every answer cell uses one row and one column only. No cell waits for another.</>}</div>
    </div>
  )
}

/* ---------- memory hierarchy ---------- */
export function MemHier() {
  const L = [
    { n: 'Registers', t: '< 1 ns', s: 'bytes–KB', ai: 'Hold the few numbers being multiplied right now.' },
    { n: 'Cache (L1–L3)', t: '1–20 ns', s: 'KB–MB', ai: 'Hold small tiles of the matrices so they can be reused quickly.' },
    { n: 'RAM / GPU VRAM (HBM)', t: '≈ 60–100 ns', s: 'GB', ai: 'Holds all the model weights while the model is running.' },
    { n: 'SSD / disk', t: '≈ 100 µs', s: 'TB', ai: 'Stores the model file. It is loaded into VRAM once at start-up.' },
  ]
  const [i, setI] = useState(2)
  return (
    <div className="wid">
      <Label icon={HardDrive}>Faster ↑ smaller · bigger ↓ slower</Label>
      {L.map((x, k) => (
        <button key={x.n} className={'lvl' + (k === i ? ' on' : '')} onClick={() => setI(k)} style={{ width: (66 + k * 11) + '%', marginLeft: ((3 - k) * 5.5) + '%' }}>
          <span>{x.n}</span><small>{x.t} · {x.s}</small>
        </button>
      ))}
      <div className="note"><b>In AI:</b> {L[i].ai}</div>
    </div>
  )
}

/* ---------- VRAM fit ---------- */
export function FitCheck() {
  const [m, setM] = useState(7), [p, setP] = useState(2), [g, setG] = useState(1)
  const models = [7, 13, 70]
  const precs = [['FP16', 2], ['INT8', 1], ['INT4', 0.5]]
  const gpus = [['Laptop 8 GB', 8], ['Gaming 24 GB', 24], ['Data-centre 80 GB', 80]]
  const need = Math.round(m * p * 1.2 * 10) / 10
  const cap = gpus[g][1]
  const fits = need <= cap
  const n = Math.ceil(need / cap)
  return (
    <div className="wid">
      <Label icon={MemoryStick}>VRAM checker (weights + about 20% extra)</Label>
      <div className="chips" style={{ marginBottom: 10 }}>{models.map(x => <button key={x} className={'chip sm' + (m === x ? ' on' : '')} onClick={() => setM(x)}>{x}B model</button>)}</div>
      <div className="chips" style={{ marginBottom: 10 }}>{precs.map(([a, b]) => <button key={a} className={'chip sm' + (p === b ? ' on' : '')} onClick={() => setP(b)}>{a}</button>)}</div>
      <div className="chips" style={{ marginBottom: 16 }}>{gpus.map(([a], k) => <button key={a} className={'chip sm' + (g === k ? ' on' : '')} onClick={() => setG(k)}>{a}</button>)}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 20, marginBottom: 8 }}><span>Needs <b style={{ color: 'var(--acc2)' }}>{need} GB</b></span><span>GPU has <b>{cap} GB</b></span></div>
      <div className={'bar' + (fits ? '' : ' warn')}><i style={{ width: Math.min(100, need / cap * 100) + '%' }} /></div>
      <div className={'verdict ' + (fits ? 'ok' : 'no')} style={{ fontSize: 21 }}>
        {fits ? <><Check size={26} />Fits on one GPU</> : <><X size={26} />Does not fit. Split across at least {n} GPUs</>}
      </div>
    </div>
  )
}

/* ---------- bandwidth ---------- */
export function Bandwidth() {
  const D = [['400 Gb/s network', 50], ['DDR5 system RAM', 60], ['PCIe 5.0 ×16', 64], ['NVLink (GPU↔GPU)', 900], ['GPU memory (HBM)', 3000]]
  const [go, setGo] = useState(false)
  useEffect(() => { const t = setTimeout(() => setGo(true), 250); return () => clearTimeout(t) }, [])
  const w = v => (Math.log10(v) - 1) / (Math.log10(4000) - 1) * 100
  return (
    <div className="wid">
      <Label icon={Layers}>Approximate bandwidth (GB/s, log scale)</Label>
      {D.map(([n, v]) => (
        <div key={n} className="bw"><span>{n}</span>
          <div className="bar"><i style={{ width: go ? w(v) + '%' : '0%' }} /></div><span>{v >= 1000 ? (v / 1000) + ' TB/s' : '~' + v}</span></div>
      ))}
      <div className="note" style={{ marginTop: 6 }}>Rough numbers for modern data-centre hardware. Exact values vary by product.</div>
    </div>
  )
}

/* ---------- Amdahl ---------- */
export function Amdahl({ compact }) {
  const [p, setP] = useState(0.95), [ni, setNi] = useState(6)
  const N = 2 ** ni
  const sp = n => 1 / ((1 - p) + p / n)
  const S = sp(N), lim = 1 / (1 - p)
  const W = 520, H = 170, pad = 8
  const ymax = Math.max(lim, 2) * 1.08
  const X = i => pad + i / 10 * (W - 2 * pad)
  const Y = v => H - pad - (v / ymax) * (H - 2 * pad)
  const pts = Array.from({ length: 11 }, (_, i) => `${X(i)},${Y(sp(2 ** i))}`).join(' ')
  return (
    <div className="wid">
      <Label icon={Cpu}>Move the sliders</Label>
      <div className="slrow"><span>Parallel part of the job</span><input type="range" min="0.5" max="0.999" step="0.001" value={p} onChange={e => setP(+e.target.value)} /><b>{(p * 100).toFixed(1)}%</b></div>
      <div className="slrow"><span>Number of GPUs (N)</span><input type="range" min="0" max="10" step="1" value={ni} onChange={e => setNi(+e.target.value)} /><b>{N}</b></div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, margin: '6px 0 8px' }}>
        <span className="big-num">{S.toFixed(1)}×</span><span style={{ fontSize: 21, color: 'var(--ink2)' }}>faster. The hard limit is <b style={{ color: '#fff' }}>{lim.toFixed(1)}×</b></span>
      </div>
      {!compact && <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
        <line x1={pad} y1={Y(lim)} x2={W - pad} y2={Y(lim)} stroke="#fbbf24" strokeDasharray="6 6" strokeWidth="2" />
        <polyline points={pts} fill="none" stroke="#5eead4" strokeWidth="4" strokeLinejoin="round" />
        <circle cx={X(ni)} cy={Y(S)} r="9" fill="#fff" stroke="#5eead4" strokeWidth="4" />
        <text x={W - pad} y={Y(lim) - 8} textAnchor="end" fill="#fbbf24" fontSize="16">limit 1 / (1 − p)</text>
      </svg>}
    </div>
  )
}
