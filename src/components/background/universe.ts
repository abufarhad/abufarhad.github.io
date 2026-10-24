import * as THREE from 'three'

/**
 * "Living digital universe": a flowing wireframe terrain, an interactive
 * particle network that reaches for the cursor, slow wireframe solids and
 * deep star dust. Written against raw Three.js (no React reconciler) so the
 * render loop stays allocation-free.
 */

export type Quality = 'high' | 'low'

export type Universe = {
  setPointer: (nx: number, ny: number) => void
  setScroll: (progress: number) => void
  dispose: () => void
}

const SIMPLEX = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
float snoise(vec2 v){
  const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i=floor(v+dot(v,C.yy));
  vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
  vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1;
  i=mod289(i);
  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
  m=m*m; m=m*m;
  vec3 x=2.0*fract(p*C.www)-1.0;
  vec3 h=abs(x)-0.5;
  vec3 ox=floor(x+0.5);
  vec3 a0=x-ox;
  m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
  vec3 g; g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.0*dot(m,g);
}
float terrain(vec2 p, float t){
  vec2 q = vec2(p.x, p.y - t);
  float h = snoise(q*0.075)*1.0 + snoise(q*0.17)*0.42 + snoise(q*0.4)*0.12;
  // Carve a calm valley down the middle so the hero text sits on open space.
  float valley = smoothstep(2.5, 14.0, abs(p.x));
  return h * (0.25 + valley * 1.55) + valley * 1.1;
}
`

const TERRAIN_VERT = /* glsl */ `
uniform float uTime;
uniform float uScroll;
varying float vH;
varying float vDepth;
varying float vX;
${SIMPLEX}
void main(){
  vec3 p = position;
  float h = terrain(p.xz, uTime*0.55);
  p.y += h;
  vH = h;
  vX = p.x;
  vec4 mv = modelViewMatrix * vec4(p,1.0);
  vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
  gl_PointSize = (1.4 + max(h,0.0)*1.1) * (34.0 / vDepth);
}
`

const TERRAIN_FRAG = /* glsl */ `
uniform float uScroll;
uniform float uAlpha;
uniform float uIsPoint;
varying float vH;
varying float vDepth;
varying float vX;
void main(){
  if(uIsPoint > 0.5){
    vec2 c = gl_PointCoord - 0.5;
    if(dot(c,c) > 0.25) discard;
  }
  vec3 deep = vec3(0.15,0.25,0.75);
  vec3 blue = vec3(0.36,0.55,1.0);
  vec3 cyan = vec3(0.37,0.91,0.96);
  vec3 violet = vec3(0.61,0.55,1.0);
  float k = clamp(vH*0.45 + 0.35, 0.0, 1.0);
  vec3 col = mix(deep, blue, k);
  col = mix(col, cyan, smoothstep(0.65, 1.0, k));
  col = mix(col, violet, clamp(uScroll*1.2,0.0,1.0)*0.55);
  float far = smoothstep(50.0, 10.0, vDepth);
  float near = smoothstep(1.5, 6.0, vDepth);
  float a = far * near * (0.20 + k*0.85) * uAlpha;
  if(uIsPoint > 0.5) a *= 1.6 * smoothstep(0.45, 1.0, k);
  gl_FragColor = vec4(col * a, a);
}
`

const NODE_VERT = /* glsl */ `
attribute float aSize;
attribute float aSeed;
uniform float uTime;
uniform float uPixel;
varying float vTw;
void main(){
  vec4 mv = modelViewMatrix * vec4(position,1.0);
  vTw = 0.55 + 0.45*sin(uTime*1.6 + aSeed*6.2831);
  gl_PointSize = aSize * uPixel * (10.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}
`

const NODE_FRAG = /* glsl */ `
uniform vec3 uColor;
uniform float uAlpha;
varying float vTw;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  float core = smoothstep(0.5, 0.0, d);
  float glow = pow(core, 2.6);
  float a = (glow*0.9 + smoothstep(0.12,0.0,d)) * vTw * uAlpha;
  gl_FragColor = vec4(uColor * a, a);
}
`

function makeGrid(width: number, depth: number, cols: number, rows: number) {
  // Grid as line segments (rows + columns), cleaner than triangle wireframes.
  const pts: number[] = []
  const dx = width / cols
  const dz = depth / rows
  const x0 = -width / 2
  const z0 = -depth + 6
  for (let r = 0; r <= rows; r++) {
    const z = z0 + r * dz
    for (let c = 0; c < cols; c++) pts.push(x0 + c * dx, 0, z, x0 + (c + 1) * dx, 0, z)
  }
  for (let c = 0; c <= cols; c++) {
    const x = x0 + c * dx
    for (let r = 0; r < rows; r++) pts.push(x, 0, z0 + r * dz, x, 0, z0 + (r + 1) * dz)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
  return g
}

function makeGridPoints(width: number, depth: number, cols: number, rows: number) {
  const pts: number[] = []
  const x0 = -width / 2
  const z0 = -depth + 6
  for (let r = 0; r <= rows; r++)
    for (let c = 0; c <= cols; c++) pts.push(x0 + (c * width) / cols, 0, z0 + (r * depth) / rows)
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
  return g
}

export function createUniverse(canvas: HTMLCanvasElement, quality: Quality): Universe {
  const high = quality === 'high'
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: high,
    alpha: true,
    powerPreference: 'high-performance',
  })
  const dpr = Math.min(window.devicePixelRatio || 1, high ? 1.75 : 1.25)
  renderer.setPixelRatio(dpr)
  renderer.setClearColor(0x000000, 0)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 120)
  camera.position.set(0, 2.1, 8)

  const disposables: { dispose: () => void }[] = []
  const track = <T extends { dispose: () => void }>(o: T) => (disposables.push(o), o)

  // ── Terrain ──────────────────────────────────────────────
  const terrainUniforms = {
    uTime: { value: 0 },
    uScroll: { value: 0 },
    uAlpha: { value: 1 },
    uIsPoint: { value: 0 },
  }
  const [W, D, C, R] = high ? [64, 52, 110, 84] : [56, 44, 60, 46]
  const terrainMat = track(
    new THREE.ShaderMaterial({
      uniforms: terrainUniforms,
      vertexShader: TERRAIN_VERT,
      fragmentShader: TERRAIN_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  )
  const terrain = new THREE.LineSegments(track(makeGrid(W, D, C, R)), terrainMat)
  terrain.position.y = -1.7
  scene.add(terrain)

  const peakMat = track(
    new THREE.ShaderMaterial({
      uniforms: { ...terrainUniforms, uIsPoint: { value: 1 } },
      vertexShader: TERRAIN_VERT,
      fragmentShader: TERRAIN_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  )
  // share time/scroll uniform objects
  peakMat.uniforms.uTime = terrainUniforms.uTime
  peakMat.uniforms.uScroll = terrainUniforms.uScroll
  peakMat.uniforms.uAlpha = terrainUniforms.uAlpha
  const peaks = new THREE.Points(track(makeGridPoints(W, D, C, R)), peakMat)
  peaks.position.y = -1.7
  scene.add(peaks)

  // ── Particle network ─────────────────────────────────────
  const N = high ? 120 : 56
  const LINK = high ? 1.75 : 2.0
  const BOUNDS = { x: 10, yMin: -0.6, yMax: 5.2, zMin: -7, zMax: 1.5 }
  const pos = new Float32Array(N * 3)
  const vel = new Float32Array(N * 3)
  const sizes = new Float32Array(N)
  const seeds = new Float32Array(N)
  for (let i = 0; i < N; i++) {
    pos[i * 3] = (Math.random() * 2 - 1) * BOUNDS.x
    pos[i * 3 + 1] = BOUNDS.yMin + Math.random() * (BOUNDS.yMax - BOUNDS.yMin)
    pos[i * 3 + 2] = BOUNDS.zMin + Math.random() * (BOUNDS.zMax - BOUNDS.zMin)
    vel[i * 3] = (Math.random() - 0.5) * 0.12
    vel[i * 3 + 1] = (Math.random() - 0.5) * 0.08
    vel[i * 3 + 2] = (Math.random() - 0.5) * 0.08
    sizes[i] = 2 + Math.random() * (Math.random() > 0.9 ? 7 : 3)
    seeds[i] = Math.random()
  }
  const nodeGeo = track(new THREE.BufferGeometry())
  nodeGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage))
  nodeGeo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
  nodeGeo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
  const nodeUniforms = {
    uTime: terrainUniforms.uTime,
    uPixel: { value: dpr },
    uColor: { value: new THREE.Color(0.62, 0.86, 1.0) },
    uAlpha: { value: 1 },
  }
  const nodeMat = track(
    new THREE.ShaderMaterial({
      uniforms: nodeUniforms,
      vertexShader: NODE_VERT,
      fragmentShader: NODE_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  )
  const nodes = new THREE.Points(nodeGeo, nodeMat)
  scene.add(nodes)

  // Links (pre-allocated for worst case incl. cursor links)
  const MAX_LINKS = N * 8
  const linkPos = new Float32Array(MAX_LINKS * 6)
  const linkCol = new Float32Array(MAX_LINKS * 6)
  const linkGeo = track(new THREE.BufferGeometry())
  linkGeo.setAttribute('position', new THREE.BufferAttribute(linkPos, 3).setUsage(THREE.DynamicDrawUsage))
  linkGeo.setAttribute('color', new THREE.BufferAttribute(linkCol, 3).setUsage(THREE.DynamicDrawUsage))
  const linkMat = track(
    new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  )
  const links = new THREE.LineSegments(linkGeo, linkMat)
  scene.add(links)

  // ── Floating solids ──────────────────────────────────────
  const solidMat = (color: number, opacity: number) =>
    track(new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending }))
  const icoGeo = track(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.25, 1)))
  const ico = new THREE.LineSegments(icoGeo, solidMat(0x5ee7f5, 0.28))
  ico.position.set(6.2, 2.6, -3.5)
  scene.add(ico)
  const octGeo = track(new THREE.EdgesGeometry(new THREE.OctahedronGeometry(0.7, 0)))
  const oct = new THREE.LineSegments(octGeo, solidMat(0x9b8cff, 0.35))
  oct.position.set(-6.4, 3.4, -4.5)
  scene.add(oct)
  const torGeo = track(new THREE.EdgesGeometry(new THREE.TorusGeometry(0.9, 0.012, 3, 64)))
  const ring = new THREE.LineSegments(torGeo, solidMat(0x5b8cff, 0.4))
  ring.position.copy(ico.position)
  scene.add(ring)

  // ── Star dust ────────────────────────────────────────────
  const S = high ? 900 : 350
  const starPos = new Float32Array(S * 3)
  const starSize = new Float32Array(S)
  const starSeed = new Float32Array(S)
  for (let i = 0; i < S; i++) {
    starPos[i * 3] = (Math.random() * 2 - 1) * 40
    starPos[i * 3 + 1] = Math.random() * 22 - 2
    starPos[i * 3 + 2] = -12 - Math.random() * 40
    starSize[i] = 1.4 + Math.random() * 2.4
    starSeed[i] = Math.random()
  }
  const starGeo = track(new THREE.BufferGeometry())
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
  starGeo.setAttribute('aSize', new THREE.BufferAttribute(starSize, 1))
  starGeo.setAttribute('aSeed', new THREE.BufferAttribute(starSeed, 1))
  const starMat = track(
    new THREE.ShaderMaterial({
      uniforms: { uTime: terrainUniforms.uTime, uPixel: { value: dpr * 2.2 }, uColor: { value: new THREE.Color(0.7, 0.78, 1) }, uAlpha: { value: 0.55 } },
      vertexShader: NODE_VERT,
      fragmentShader: NODE_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  )
  const stars = new THREE.Points(starGeo, starMat)
  scene.add(stars)

  // ── Interaction state ────────────────────────────────────
  const pointer = { x: 0, y: 0, tx: 0, ty: 0, active: false }
  const cursorWorld = new THREE.Vector3(999, 999, 999)
  const ray = new THREE.Raycaster()
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 1.5)
  const ndc = new THREE.Vector2()
  let scroll = 0
  let scrollSmooth = 0

  const resize = () => {
    const w = window.innerWidth
    const h = window.innerHeight
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.fov = w < 768 ? 68 : 55
    camera.updateProjectionMatrix()
  }
  resize()
  window.addEventListener('resize', resize)

  const clock = new THREE.Clock()
  let raf = 0
  let running = true

  const tick = () => {
    raf = requestAnimationFrame(tick)
    const dt = Math.min(clock.getDelta(), 0.05)
    const t = clock.elapsedTime
    terrainUniforms.uTime.value = t

    // ease pointer + scroll
    pointer.x += (pointer.tx - pointer.x) * 0.05
    pointer.y += (pointer.ty - pointer.y) * 0.05
    scrollSmooth += (scroll - scrollSmooth) * 0.06
    terrainUniforms.uScroll.value = scrollSmooth

    // camera parallax + scroll dolly
    camera.position.x = pointer.x * 0.9
    camera.position.y = 2.1 + pointer.y * 0.45 - scrollSmooth * 1.4
    camera.position.z = 8 - scrollSmooth * 1.5
    camera.lookAt(pointer.x * 0.25, 0.35 - scrollSmooth * 1.6, -2)

    // project cursor into the network plane
    if (pointer.active) {
      ndc.set(pointer.tx, pointer.ty)
      ray.setFromCamera(ndc, camera)
      ray.ray.intersectPlane(plane, cursorWorld)
    }

    // move nodes
    for (let i = 0; i < N; i++) {
      const ix = i * 3
      pos[ix] += vel[ix] * dt * 2
      pos[ix + 1] += vel[ix + 1] * dt * 2
      pos[ix + 2] += vel[ix + 2] * dt * 2
      if (pos[ix] > BOUNDS.x || pos[ix] < -BOUNDS.x) vel[ix] *= -1
      if (pos[ix + 1] > BOUNDS.yMax || pos[ix + 1] < BOUNDS.yMin) vel[ix + 1] *= -1
      if (pos[ix + 2] > BOUNDS.zMax || pos[ix + 2] < BOUNDS.zMin) vel[ix + 2] *= -1
      if (pointer.active) {
        // gentle attraction toward the cursor
        const dx = cursorWorld.x - pos[ix]
        const dy = cursorWorld.y - pos[ix + 1]
        const dz = cursorWorld.z - pos[ix + 2]
        const d2 = dx * dx + dy * dy + dz * dz
        if (d2 < 9 && d2 > 0.3) {
          const f = (1 - d2 / 9) * 0.35 * dt
          pos[ix] += dx * f
          pos[ix + 1] += dy * f
        }
      }
    }
    nodeGeo.attributes.position.needsUpdate = true

    // links
    let l = 0
    const L2 = LINK * LINK
    for (let i = 0; i < N && l < MAX_LINKS; i++) {
      const ax = pos[i * 3], ay = pos[i * 3 + 1], az = pos[i * 3 + 2]
      for (let j = i + 1; j < N && l < MAX_LINKS; j++) {
        const dx = ax - pos[j * 3], dy = ay - pos[j * 3 + 1], dz = az - pos[j * 3 + 2]
        const d2 = dx * dx + dy * dy + dz * dz
        if (d2 < L2) {
          const a = (1 - d2 / L2) * 0.7
          const o = l * 6
          linkPos[o] = ax; linkPos[o + 1] = ay; linkPos[o + 2] = az
          linkPos[o + 3] = pos[j * 3]; linkPos[o + 4] = pos[j * 3 + 1]; linkPos[o + 5] = pos[j * 3 + 2]
          linkCol[o] = 0.36 * a; linkCol[o + 1] = 0.55 * a; linkCol[o + 2] = 1.0 * a
          linkCol[o + 3] = 0.36 * a; linkCol[o + 4] = 0.85 * a; linkCol[o + 5] = 0.96 * a
          l++
        }
      }
      if (pointer.active) {
        const dx = ax - cursorWorld.x, dy = ay - cursorWorld.y, dz = az - cursorWorld.z
        const d2 = dx * dx + dy * dy + dz * dz
        const R2 = 7.5
        if (d2 < R2 && l < MAX_LINKS) {
          const a = (1 - d2 / R2) * 0.9
          const o = l * 6
          linkPos[o] = ax; linkPos[o + 1] = ay; linkPos[o + 2] = az
          linkPos[o + 3] = cursorWorld.x; linkPos[o + 4] = cursorWorld.y; linkPos[o + 5] = cursorWorld.z
          linkCol[o] = 0.37 * a; linkCol[o + 1] = 0.91 * a; linkCol[o + 2] = 0.96 * a
          linkCol[o + 3] = 0.61 * a * 0.4; linkCol[o + 4] = 0.55 * a * 0.4; linkCol[o + 5] = 1.0 * a * 0.4
          l++
        }
      }
    }
    linkGeo.setDrawRange(0, l * 2)
    linkGeo.attributes.position.needsUpdate = true
    linkGeo.attributes.color.needsUpdate = true

    // solids
    ico.rotation.x = t * 0.08
    ico.rotation.y = t * 0.12
    ico.position.y = 2.6 + Math.sin(t * 0.5) * 0.18
    ring.position.y = ico.position.y
    ring.rotation.x = Math.PI / 2.4 + Math.sin(t * 0.3) * 0.1
    ring.rotation.z = t * 0.2
    oct.rotation.x = -t * 0.15
    oct.rotation.z = t * 0.1
    oct.position.y = 3.4 + Math.cos(t * 0.6) * 0.22
    stars.rotation.y = t * 0.004 + pointer.x * 0.02

    renderer.render(scene, camera)
  }

  const onVisibility = () => {
    if (document.hidden && running) {
      running = false
      cancelAnimationFrame(raf)
    } else if (!document.hidden && !running) {
      running = true
      clock.getDelta()
      tick()
    }
  }
  document.addEventListener('visibilitychange', onVisibility)
  tick()

  return {
    setPointer(nx, ny) {
      if (Number.isNaN(nx)) {
        pointer.active = false
        return
      }
      pointer.tx = nx
      pointer.ty = ny
      pointer.active = true
    },
    setScroll(p) {
      scroll = p
    },
    dispose() {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
      disposables.forEach((d) => d.dispose())
      renderer.dispose()
    },
  }
}
