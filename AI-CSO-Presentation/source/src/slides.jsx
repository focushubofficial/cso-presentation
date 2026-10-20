import React from 'react'
import { CycleStepper, TokenBits, FloatViz, Quant, CoreViz, Flynn, MatMul, MemHier, FitCheck, Bandwidth, Amdahl } from './widgets.jsx'
import { mirror, ellipseEdge } from './kit.jsx'

/* element constructors */
const S = o => ({ k: 'S', ...o })   // script headline
const V = o => ({ k: 'V', ...o })   // curved text
const T = o => ({ k: 'T', ...o })   // wrapped body text
const N = o => ({ k: 'N', ...o })   // hand-written note
const X = o => ({ k: 'X', ...o })   // interactive widget (sticker card)
const A = o => ({ k: 'A', ...o })   // arrow

/* subject outlines (stage coordinates, taken from each video's last frame) */
const ROBOT_L = [[960,93],[880,105],[820,140],[765,195],[735,260],[726,330],[725,420],[705,432],[684,452],[683,585],[708,610],[738,630],[768,705],[788,742],[762,780],[757,885],[735,915],[650,950],[570,975],[450,1020],[300,1080]]
const ROBOT_R = mirror(ROBOT_L, 960)
const CHIP_L = ellipseEdge(960, 625, 470, 265, 'L')
const CHIP_R = ellipseEdge(960, 625, 470, 265, 'R')
const MAN_L = [[937,258],[870,278],[842,330],[840,390],[858,430],[872,470],[780,520],[705,592],[660,650],[645,705],[620,760],[607,810],[600,900],[600,1080]]
const MAN_R = [[937,258],[1005,278],[1033,330],[1035,390],[1020,430],[1003,470],[1100,520],[1185,592],[1230,650],[1237,705],[1255,760],[1267,810],[1270,900],[1270,1080]]
const CROP4 = 1.075
const sc = (e, k) => e.map(([x, y]) => [960 + (x - 960) * k, 540 + (y - 540) * k])
const FANS_L = sc([[1000,170],[880,230],[862,330],[890,430],[780,490],[650,520],[620,560],[607,620],[640,700],[640,735],[520,760],[430,800],[412,850],[450,900],[520,940],[400,965],[330,1000],[320,1040]], CROP4)
const GRAPH_B = [[1540,100],[1330,230],[1215,262],[1000,345],[870,385],[650,445],[540,525],[420,580],[300,610],[230,680]]

const ARCH_ROBOT = 'M 622,600 L 622,430 A 338,378 0 0 1 1298,430 L 1298,600'
const ARCH_MAN = 'M 767,430 A 170,200 0 0 1 1107,430'

export const GROUPS = [
  /* ================= 1 · ROBOT ================= */
  { video: 'videos/v1.mp4', dim: 0.1, trans: 'left', slides: [
    [ V({ d: ARCH_ROBOT, text: 'How AI Models Really Run', size: 68, pal: 'warm' }),
      T({ side: 'L', x: 50, y: 300, w: 650, h: 700, edge: ROBOT_L, dir: 'left', i: 1, size: 32, paras: [
        'You type a question and a chatbot answers in seconds.',
        'Underneath, it is the <b>same machine</b> you study in <span class="sc">Computer Organisation</span>: bits, a CPU, memory and buses, used on a giant scale.'] }),
      T({ side: 'R', x: 1180, y: 300, w: 690, h: 700, edge: ROBOT_R, dir: 'right', i: 2, size: 32, paras: [
        '<span class="sc w">What you will see</span>',
        '<b>Numbers inside the machine:</b> how a model’s knowledge is stored in binary.',
        '<b>The hardware:</b> CPU, GPU, memory and the wires between them.',
        '<b>Speed and limits:</b> why AI is fast, slow, hot and hungry for power.'] }),
    ],
    [ V({ d: ARCH_ROBOT, text: 'A model is just numbers', size: 70, pal: 'cool' }),
      N({ x: 1300, y: 150, w: 260, text: '0.0372', size: 54, rot: 7, color: '#FFD84A', dir: 'zoom', i: 3 }),
      N({ x: 380, y: 160, w: 260, text: '−1.58', size: 54, rot: -8, color: '#FFA6EC', dir: 'zoom', i: 4 }),
      N({ x: 120, y: 190, w: 200, text: '3.14', size: 48, rot: -5, color: '#D7FF55', dir: 'zoom', i: 5 }),
      T({ side: 'L', x: 50, y: 300, w: 650, h: 700, edge: ROBOT_L, dir: 'left', i: 1, size: 32, paras: [
        'An AI model is not magic. It is a giant table of numbers called <span class="sc w">weights</span>, plus a simple recipe that multiplies and adds them.',
        'A <b>7-billion-parameter</b> model has 7 billion dials, each set to a number like 0.0372.'] }),
      T({ side: 'R', x: 1180, y: 300, w: 690, h: 700, edge: ROBOT_R, dir: 'right', i: 2, size: 32, paras: [
        '<span class="sc">Training</span> sets the dials once, and costs a fortune.',
        '<span class="sc k">Inference</span> means using the dials to answer you, every time you chat.',
        'This is the <b>stored-program idea</b>: the weights (data) and the code that uses them both sit in memory.'] }),
    ],
    [ V({ d: ARCH_ROBOT, text: 'Follow one prompt', size: 74, pal: 'lime' }),
      T({ side: 'L', x: 50, y: 300, w: 650, h: 700, edge: ROBOT_L, dir: 'left', i: 1, size: 32, paras: [
        'We will follow your question through the machine, layer by layer.',
        'Each stop is a chapter of <b>Computer Organisation</b>. By the end you will see that AI is just those ideas at huge scale.'] }),
      T({ side: 'R', x: 1180, y: 300, w: 690, h: 700, edge: ROBOT_R, dir: 'right', i: 2, size: 32, paras: [
        '<span class="sc w">1</span> The CPU and the instruction cycle',
        '<span class="sc">2</span> Bits and floating point',
        '<span class="sc k">3</span> Parallelism and GPUs',
        '<span class="sc l">4</span> The memory hierarchy',
        '<span class="sc w">5</span> Buses and data centres',
        '<span class="sc">6</span> Performance and Amdahl’s law'] }),
    ],
  ] },

  /* ================= 2 · CHIP ================= */
  { video: 'videos/v2.mp4', dim: 0.1, trans: 'up', slides: [
    [ S({ x: 460, y: 20, w: 1000, lines: ['The CPU'], size: 130, pal: 'warm', anchor: 'middle', tilt: { rx: 14, p: 1300 }, dir: 'down' }),
      S({ x: 460, y: 215, w: 1000, lines: ['a fast, obedient worker'], size: 58, pal: 'cool', anchor: 'middle', dir: 'up', i: 1 }),
      T({ side: 'L', x: 50, y: 340, w: 470, h: 670, edge: CHIP_L, dir: 'left', i: 2, size: 29, paras: [
        '<span class="sc w">ALU</span> The Arithmetic Logic Unit does the maths: add, multiply, AND, OR.',
        '<span class="sc">Control unit</span> Reads each instruction and tells every other part what to do.'] }),
      T({ side: 'R', x: 1400, y: 340, w: 470, h: 670, edge: CHIP_R, dir: 'right', i: 3, size: 29, paras: [
        '<span class="sc k">Registers</span> Tiny, super-fast storage inside the CPU for the numbers in use right now.',
        '<span class="sc l">Clock</span> A steady tick. At 3 GHz the CPU ticks 3 billion times a second.'] }),
      V({ d: 'M 520,830 Q 960,1040 1400,830', text: 'billions of tiny steps every second', size: 62, pal: 'cool' }),
    ],
    [ V({ d: 'M 430,330 Q 960,-30 1490,330', text: 'Fetch · Decode · Execute · Store', size: 70, pal: 'warm' }),
      X({ x: 40, y: 350, w: 520, s: 0.92, dir: 'left', i: 1, bc: '#FFD84A', el: <CycleStepper /> }),
      T({ side: 'R', x: 1400, y: 350, w: 470, h: 650, edge: CHIP_R, dir: 'right', i: 2, size: 29, paras: [
        '<span class="sc w">Program counter</span> The PC always points to the next instruction to fetch.',
        '<span class="sc">Pipelining</span> While one instruction executes, the next is already being decoded, like an assembly line. More work per second.'] }),
    ],
    [ S({ x: 460, y: 20, w: 1000, lines: ['Multiply, add, repeat'], size: 112, pal: 'warm', anchor: 'middle', tilt: { rx: 12, p: 1300 }, dir: 'down' }),
      T({ side: 'L', x: 50, y: 330, w: 470, h: 680, edge: CHIP_L, dir: 'left', i: 1, size: 28, paras: [
        'Inside a model almost every step is one tiny job: <b>multiply two numbers and add the result to a running total</b>. That is a multiply-accumulate, or <span class="sc w">MAC</span>.',
        'One word of reply needs about 2 operations per weight: roughly <b>14 billion</b> for a 7B model.'] }),
      T({ side: 'R', x: 1400, y: 330, w: 470, h: 680, edge: CHIP_R, dir: 'right', i: 2, size: 28, paras: [
        'A single CPU core mostly runs <b>one instruction on one piece of data</b> at a time (SISD).',
        'For 14 billion operations that is slow. We need many workers at once.',
        '<span class="sc k">Enter the GPU…</span>'] }),
      V({ d: 'M 380,880 Q 960,1030 1540,880', text: 'output = (w1 × x1) + (w2 × x2) + … + b', size: 66, pal: 'lime', font: 'Caveat Brush' }),
    ],
  ] },

  /* ================= 3 · BINARY ================= */
  { video: 'videos/v3.mp4', dim: 0.5, trans: 'left', slides: [
    [ S({ x: 460, y: 8, w: 1000, lines: ['Everything is bits'], size: 104, pal: 'warm', anchor: 'middle', tilt: { rx: 10, p: 1400 }, dir: 'down' }),
      V({ d: ARCH_MAN, text: '0 1 1 0 1 0 0 1 1 0 1', size: 42, pal: 'lime', font: 'Caveat Brush', spacing: 6, depth: 6, stroke: 8 }),
      T({ side: 'L', x: 50, y: 250, w: 545, h: 770, edge: MAN_L, dir: 'left', i: 1, size: 29, paras: [
        'A computer only knows <span class="sc w">0</span> and <span class="sc">1</span>. Your words, pictures and the model’s weights must all be turned into binary first.',
        '<b>1 byte = 8 bits</b>, which can hold 256 different values.',
        '<b>Hex is shorthand:</b> 4 bits make 1 hex digit, so long bit strings become short and readable.'] }),
      X({ x: 1300, y: 270, w: 580, s: 1, dir: 'right', i: 2, bc: '#6FF3DD', el: <TokenBits /> }),
    ],
    [ S({ x: 460, y: 8, w: 1000, lines: ['Floating point'], size: 104, pal: 'cool', anchor: 'middle', tilt: { rx: 10, p: 1400 }, dir: 'down' }),
      V({ d: ARCH_MAN, text: '0.15625 = 1.25 × 2⁻³', size: 40, pal: 'warm', font: 'Caveat Brush', spacing: 2, depth: 6, stroke: 8 }),
      T({ side: 'L', x: 50, y: 250, w: 545, h: 770, edge: MAN_L, dir: 'left', i: 1, size: 28, paras: [
        'Weights are decimals like <b>0.15625</b>. Computers store them like scientific notation: a <span class="sc w">sign</span>, a <span class="sc">power of two</span> and the <span class="sc l">digits</span>.',
        'That layout is the <b>IEEE 754</b> standard. FP32 uses 1 + 8 + 23 bits: precise, but 4 bytes each.',
        'FP16 and BF16 use only 16 bits. BF16 keeps FP32’s range with fewer digits.'] }),
      X({ x: 1300, y: 270, w: 590, s: 1, dir: 'right', i: 2, bc: '#FFD84A', el: <FloatViz /> }),
    ],
    [ S({ x: 460, y: 8, w: 1000, lines: ['Quantisation'], size: 104, pal: 'pink', anchor: 'middle', tilt: { rx: 10, p: 1400 }, dir: 'down' }),
      V({ d: ARCH_MAN, text: 'fewer bits, smaller model', size: 40, pal: 'lime', font: 'Caveat Brush', spacing: 2, depth: 6, stroke: 8 }),
      T({ side: 'L', x: 50, y: 250, w: 545, h: 770, edge: MAN_L, dir: 'left', i: 1, size: 28, paras: [
        'Use <b>fewer bits per weight</b> and the model gets smaller and faster. The price is a little less precision.',
        'It is like rounding 19.99 to 20: you lose a little detail, but it is easier to handle.',
        'This is the classic trade-off of <span class="sc">data representation</span>: range and precision against storage. 4-bit models can run on an ordinary laptop.'] }),
      X({ x: 1300, y: 300, w: 580, s: 1, dir: 'right', i: 2, bc: '#FFA6EC', el: <Quant /> }),
    ],
  ] },

  /* ================= 4 · GPU FANS ================= */
  { video: 'videos/v4.mp4', crop: 1.075, dim: 0.22, trans: 'left', slides: [
    [ S({ x: 60, y: 24, w: 820, lines: ['Why GPUs?'], size: 112, pal: 'warm', dir: 'left', tilt: { ry: -8, p: 1400 } }),
      S({ x: 60, y: 170, w: 820, lines: ['many hands make light work'], size: 54, pal: 'cool', dir: 'left', i: 1 }),
      V({ d: 'M 870,300 Q 1185,-60 1500,300', text: '1,000 students, 1 professor', size: 50, pal: 'lime' }),
      T({ side: 'L', x: 60, y: 300, w: 800, h: 720, edge: FANS_L, dir: 'left', i: 2, size: 29, align: 'left', paras: [
        'A CPU has a few powerful cores. A GPU has <span class="sc">thousands of small, simple cores</span> that all work at the same time.',
        '<b>CPU = 1 professor:</b> very clever, but solves one hard problem at a time.',
        '<b>GPU = 1,000 students:</b> each does a simple sum, and all finish together.',
        'It is <b>pipelining and parallelism</b> taken to the extreme. Matrix maths is exactly that kind of job.'] }),
      X({ x: 1240, y: 560, w: 640, s: 1, dir: 'right', i: 3, bc: '#6FF3DD', el: <CoreViz /> }),
    ],
    [ S({ x: 60, y: 24, w: 820, lines: ['Flynn’s four boxes'], size: 100, pal: 'pink', dir: 'left', tilt: { ry: -8, p: 1400 } }),
      V({ d: 'M 870,300 Q 1185,-60 1500,300', text: 'SISD · SIMD · MISD · MIMD', size: 48, pal: 'warm' }),
      T({ side: 'L', x: 60, y: 200, w: 800, h: 820, edge: FANS_L, dir: 'left', i: 1, size: 29, align: 'left', paras: [
        'Flynn sorted computers by how many <b>instruction streams</b> and <b>data streams</b> they handle.',
        'AI hardware lives in the highlighted boxes: a GPU is <span class="sc">SIMD</span> and a GPU cluster is <span class="sc k">MIMD</span>.',
        '<b>SISD</b> is one ordinary core. <b>MISD</b> is rare.'] }),
      X({ x: 1270, y: 500, w: 610, s: 0.92, dir: 'right', i: 2, bc: '#FFA6EC', el: <Flynn /> }),
    ],
    [ S({ x: 60, y: 24, w: 820, lines: ['Matrix maths'], size: 104, pal: 'cool', dir: 'left', tilt: { ry: -8, p: 1400 } }),
      S({ x: 60, y: 170, w: 820, lines: ['a perfectly parallel job'], size: 54, pal: 'warm', dir: 'left', i: 1 }),
      V({ d: 'M 870,300 Q 1185,-60 1500,300', text: 'same step, different data', size: 50, pal: 'lime' }),
      T({ side: 'L', x: 60, y: 300, w: 800, h: 720, edge: FANS_L, dir: 'left', i: 2, size: 29, align: 'left', paras: [
        'A model’s layers are big tables multiplied together. <b>Every answer cell is independent</b>, so thousands of cores can work at once.',
        '<span class="sc w">Tensor cores</span> and TPUs are chips built to multiply small matrices in a single step.',
        'Same step, different data: that is <span class="sc">SIMD</span> in action.'] }),
      X({ x: 1230, y: 540, w: 650, s: 1, dir: 'right', i: 3, bc: '#D7FF55', el: <MatMul /> }),
    ],
  ] },

  /* ================= 5 · CIRCUIT BOARD ================= */
  { video: 'videos/v5.mp4', crop: 1.075, dim: 0.52, trans: 'down', slides: [
    [ S({ x: 70, y: 24, w: 1100, lines: ['Memory hierarchy'], size: 108, pal: 'warm', dir: 'left', tilt: { ry: -7, p: 1400 } }),
      S({ x: 70, y: 175, w: 1100, lines: ['fast and small vs slow and big'], size: 52, pal: 'cool', dir: 'left', i: 1 }),
      X({ x: 70, y: 330, w: 800, s: 1, dir: 'left', i: 2, bc: '#FFD84A', el: <MemHier /> }),
      T({ side: 'R', x: 1060, y: 330, w: 800, h: 680, dir: 'right', i: 3, size: 32, align: 'left', paras: [
        'Fast memory is expensive, so computers use <span class="sc">layers</span>: small and quick near the CPU, big and slow far away.',
        '<b>Speed, size and cost</b> cannot all be best at once.',
        '<b>Registers, cache, main memory and disk</b> make up the memory hierarchy you study in class.'] }),
      V({ d: 'M 160,930 Q 960,690 1760,930', text: 'registers · cache · VRAM · SSD', size: 84, pal: 'lime' }),
    ],
    [ S({ x: 70, y: 24, w: 1100, lines: ['Will it fit?'], size: 108, pal: 'cool', dir: 'left', tilt: { ry: -7, p: 1400 } }),
      S({ x: 70, y: 175, w: 1100, lines: ['VRAM decides'], size: 56, pal: 'warm', dir: 'left', i: 1 }),
      T({ side: 'R', x: 70, y: 330, w: 820, h: 680, dir: 'left', i: 2, size: 32, align: 'left', paras: [
        'To run, the weights must sit in the GPU’s own fast memory: <span class="sc w">VRAM</span> (or HBM).',
        '<b>Size = parameters × bytes per weight.</b> For example 7B × 2 bytes = 14 GB.',
        'The KV-cache and working data need extra room too. If it does not fit, the model must be split across several GPUs.'] }),
      V({ d: 'M 140,740 Q 960,1010 1780,740', text: '7B × 2 bytes = 14 GB', size: 92, pal: 'warm' }),
      X({ x: 990, y: 300, w: 880, s: 1, dir: 'right', i: 3, bc: '#6FF3DD', el: <FitCheck /> }),
    ],
    [ S({ x: 70, y: 24, w: 1100, lines: ['The memory wall'], size: 108, pal: 'pink', dir: 'left', tilt: { ry: -7, p: 1400 } }),
      T({ side: 'R', x: 70, y: 200, w: 820, h: 430, dir: 'left', i: 1, size: 31, align: 'left', paras: [
        'Moving data from memory often takes <b>longer than the maths itself</b>. A chatbot writes one word at a time, and each word needs the whole model read from memory.'] }),
      T({ side: 'R', x: 1030, y: 200, w: 830, h: 430, dir: 'right', i: 2, size: 31, align: 'left', paras: [
        '<span class="sc">Locality:</span> programs reuse nearby data, so <b>caches</b> work. GPUs cut matrices into small tiles that fit on-chip.',
        '<span class="sc w">KV-cache:</span> the model saves the notes of earlier words instead of recomputing them. A real cache!'] }),
      S({ x: 160, y: 690, w: 1600, lines: ['tokens per second = bandwidth ÷ model size'], size: 76, pal: 'warm', anchor: 'middle', tilt: { rx: 36, p: 1100 }, dir: 'up', i: 3 }),
      N({ x: 360, y: 940, w: 1200, text: 'e.g. 14 GB model on 1,000 GB/s memory: about 70 tokens/s at best', size: 46, rot: 0, color: '#6FF3DD', dir: 'down', i: 4, align: 'center' }),
    ],
  ] },

  /* ================= 6 · DATA CENTRE ================= */
  { video: 'videos/v6.mp4', dim: 0.5, trans: 'left', slides: [
    [ S({ x: 460, y: 14, w: 1000, lines: ['Data highways'], size: 112, pal: 'warm', anchor: 'middle', tilt: { rx: 10, p: 1400 }, dir: 'down' }),
      X({ x: 30, y: 290, w: 600, s: 0.95, dir: 'left', i: 1, bc: '#6FF3DD', el: <Bandwidth /> }),
      T({ side: 'R', x: 1340, y: 290, w: 545, h: 640, dir: 'right', i: 2, size: 28, align: 'left', paras: [
        'Data does not teleport. It travels on <span class="sc">buses and links</span>, and each has a speed limit called <b>bandwidth</b>.',
        '<b>Bandwidth</b> is how wide the road is. <b>Latency</b> is how long the trip takes.',
        '<span class="sc w">DMA</span> lets a device copy data to or from memory without the CPU moving every byte. That is how your prompt reaches the GPU.'] }),
      S({ x: 510, y: 790, w: 900, lines: ['highways of data'], size: 118, pal: 'cool', anchor: 'middle', tilt: { rx: 60, p: 800 }, dir: 'up', i: 3 }),
    ],
    [ S({ x: 460, y: 14, w: 1000, lines: ['Scaling out'], size: 112, pal: 'cool', anchor: 'middle', tilt: { rx: 10, p: 1400 }, dir: 'down' }),
      T({ side: 'L', x: 45, y: 290, w: 520, h: 650, dir: 'left', i: 1, size: 28, align: 'left', paras: [
        'One GPU is not enough for the biggest models. <span class="sc w">Thousands of GPUs</span> are linked so each works on its own piece.',
        'That is Flynn’s <b>MIMD</b>: many instruction streams, many data streams.'] }),
      T({ side: 'R', x: 1340, y: 290, w: 545, h: 650, dir: 'right', i: 2, size: 28, align: 'left', paras: [
        '<span class="sc">Data parallelism:</span> every GPU holds a copy of the model and handles different data.',
        '<span class="sc k">Model parallelism:</span> the model is cut into pieces, one per GPU.',
        '<b>Communication cost:</b> GPUs keep swapping results, so link speed matters.'] }),
      N({ x: 600, y: 520, w: 720, text: 'each GPU holds one piece of the puzzle', size: 54, rot: -3, color: '#FFD84A', dir: 'zoom', i: 4, align: 'center' }),
      S({ x: 510, y: 790, w: 900, lines: ['MIMD at scale'], size: 118, pal: 'warm', anchor: 'middle', tilt: { rx: 60, p: 800 }, dir: 'up', i: 3 }),
    ],
    [ S({ x: 460, y: 14, w: 1000, lines: ['Power & heat'], size: 112, pal: 'pink', anchor: 'middle', tilt: { rx: 10, p: 1400 }, dir: 'down' }),
      T({ side: 'L', x: 45, y: 290, w: 520, h: 650, dir: 'left', i: 1, size: 28, align: 'left', paras: [
        'Every operation turns electricity into heat. A hall of GPUs needs <b>huge power and cooling</b>.',
        'That is why <span class="sc l">green computing</span> matters.'] }),
      T({ side: 'R', x: 1340, y: 290, w: 545, h: 650, dir: 'right', i: 2, size: 28, align: 'left', paras: [
        '<span class="sc w">Performance per watt</span> is the key measure: work done for each unit of energy.',
        '<span class="sc">Better cooling:</span> air, liquid cooling and reusing the heat.',
        '<span class="sc k">Fewer bits</span> (quantisation) also saves energy.'] }),
      N({ x: 600, y: 520, w: 720, text: 'more work per watt = less heat', size: 54, rot: 3, color: '#6FF3DD', dir: 'zoom', i: 4, align: 'center' }),
      S({ x: 510, y: 790, w: 900, lines: ['keep it cool'], size: 118, pal: 'lime', anchor: 'middle', tilt: { rx: 60, p: 800 }, dir: 'up', i: 3 }),
    ],
  ] },

  /* ================= 7 · GRAPH ================= */
  { video: 'videos/v7.mp4', dim: 0.3, trans: 'up', slides: [
    [ S({ x: 60, y: 22, w: 1000, lines: ['How fast is it?'], size: 100, pal: 'warm', dir: 'left', tilt: { ry: -6, p: 1400 } }),
      T({ side: 'L', x: 60, y: 190, w: 1020, h: 520, edge: GRAPH_B, dir: 'left', i: 1, size: 28, align: 'left', paras: [
        'A simple formula tells us how long a program takes.',
        '<span class="sc w">Instruction count</span> for AI is billions per word.',
        '<span class="sc">CPI</span> is clock cycles per instruction. Parallel hardware lowers it.',
        '<span class="sc k">FLOPS</span> are operations per second. 1 TFLOPS is a trillion.'] }),
      N({ x: 60, y: 900, w: 1800, text: 'CPU time = Instruction count × CPI × Clock cycle time', size: 66, rot: 0, color: '#FFD84A', dir: 'up', i: 2, align: 'center' }),
      N({ x: 60, y: 985, w: 1800, text: 'CPI = clock cycles per instruction   ·   clock cycle time = 1 ÷ frequency', size: 36, rot: 0, color: '#6FF3DD', dir: 'down', i: 3, align: 'center' }),
    ],
    [ S({ x: 60, y: 22, w: 1100, lines: ['Amdahl’s law'], size: 100, pal: 'cool', dir: 'left', tilt: { ry: -6, p: 1400 } }),
      T({ side: 'L', x: 60, y: 190, w: 1020, h: 520, edge: GRAPH_B, dir: 'left', i: 1, size: 28, align: 'left', paras: [
        'Only the <span class="sc w">parallel part</span> of a job speeds up. The serial part (loading, tokenising, waiting) stays the same and becomes the limit.',
        '<b>Example:</b> 95% parallel with 100 GPUs gives only about <b>16.8×</b>, never more than 20×.',
        '<b>Fix:</b> shrink the serial part by overlapping loading with computing.'] }),
      X({ x: 60, y: 725, w: 800, s: 1, dir: 'up', i: 2, bc: '#FFD84A', el: <Amdahl compact /> }),
    ],
  ] },

  /* ================= 8 · LIGHT STREAKS ================= */
  { video: 'videos/v8.mp4', dim: 0.12, trans: 'right', slides: [
    [ S({ x: 60, y: 18, w: 1400, lines: ['The journey of one prompt'], size: 100, pal: 'warm', dir: 'left', tilt: { ry: -6, p: 1500 } }),
      V({ d: 'M 140,1015 Q 960,935 1780,1015', text: 'from keyboard to screen in a blink', size: 70, pal: 'lime' }),
      ...[
        ['w', '1 Keyboard', 'An I/O interrupt tells the CPU a key was pressed.'],
        ['', '2 Tokenise', 'The CPU turns your text into token numbers (bits).'],
        ['k', '3 Copy over PCIe', 'DMA moves the tokens to the GPU.'],
        ['l', '4 Read the weights', 'The GPU streams the weights from its HBM memory.'],
        ['', '5 Matrix maths', 'Thousands of cores multiply and add in parallel (SIMD).'],
        ['w', '6 Pick a token', 'The most likely next word is chosen.'],
        ['l', '7 Repeat', 'The loop runs for every word, using the KV-cache.'],
        ['k', '8 Send it back', 'The text travels over the network to your screen.'],
      ].map(([c, h, p], n) => T({ side: 'R', x: [50, 500, 960, 1420][n % 4], y: n < 4 ? 320 : 625, w: 430, h: 290, dir: n < 4 ? 'up' : 'down', i: n + 1, size: 34, align: 'left', paras: [`<span class="sc ${c}">${h}</span>`, p] })),
    ],
    [ S({ x: 60, y: 18, w: 1500, lines: ['Everything is connected'], size: 100, pal: 'cool', dir: 'left', tilt: { ry: -6, p: 1500 } }),
      T({ side: 'R', x: 60, y: 330, w: 880, h: 660, dir: 'left', i: 1, size: 34, align: 'left', paras: [
        '<span class="sc w">Data representation</span> Weights stored as FP16, INT8 or INT4.',
        '<span class="sc">CPU and instruction cycle</span> Prepares the text and controls the whole job.',
        '<span class="sc k">Parallelism and Flynn</span> A GPU is SIMD, a GPU cluster is MIMD.',
        '<span class="sc l">Memory hierarchy</span> HBM holds the weights, cache holds tiles, KV-cache holds notes.'] }),
      T({ side: 'R', x: 1010, y: 330, w: 850, h: 660, dir: 'right', i: 2, size: 34, align: 'left', paras: [
        '<span class="sc w">Buses, I/O and DMA</span> PCIe, NVLink and the network move the data.',
        '<span class="sc">Performance laws</span> FLOPS, the CPU-time formula and Amdahl’s law.',
        '<span class="sc k">Power and cooling</span> Data-centre energy and heat.',
        'Every one of these is a chapter of <b>Computer Organisation</b>.'] }),
      V({ d: 'M 140,900 Q 960,1050 1780,900', text: 'one machine, many layers', size: 92, pal: 'warm' }),
    ],
    [ V({ d: 'M 160,430 Q 960,-120 1760,430', text: 'Thank you! Questions?', size: 126, pal: 'warm' }),
      T({ side: 'R', x: 90, y: 520, w: 540, h: 400, dir: 'up', i: 1, size: 32, align: 'center', paras: ['<span class="sc w">Numbers + maths</span>', 'A model is stored weights plus matrix multiplication.'] }),
      T({ side: 'R', x: 690, y: 520, w: 540, h: 400, dir: 'down', i: 2, size: 32, align: 'center', paras: ['<span class="sc">Memory is the limit</span>', 'Moving data is often slower than computing.'] }),
      T({ side: 'R', x: 1290, y: 520, w: 540, h: 400, dir: 'up', i: 3, size: 32, align: 'center', paras: ['<span class="sc k">Organisation at scale</span>', 'Bits, CPU, GPU, memory, buses and performance: all of it applies.'] }),
      V({ d: 'M 200,930 Q 960,1060 1720,930', text: 'keep asking how it works', size: 84, pal: 'cool' }),
    ],
  ] },
]
export const FLAT = GROUPS.flatMap((g, gi) => g.slides.map((s, si) => ({ gi, si, s })))
