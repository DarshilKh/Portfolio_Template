import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from 'ogl'
import { useEffect, useRef } from 'react'
import './CircularGallery.css'

function lerp(p1, p2, t) { return p1 + (p2 - p1) * t }

function debounce(fn, wait) {
  let t
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait) }
}

function autoBind(inst) {
  const proto = Object.getPrototypeOf(inst)
  Object.getOwnPropertyNames(proto).forEach((k) => {
    if (k !== 'constructor' && typeof inst[k] === 'function') inst[k] = inst[k].bind(inst)
  })
}

function createTextTexture(gl, text, font = 'bold 30px monospace', color = 'white') {
  const canvas = document.createElement('canvas')
  const ctx    = canvas.getContext('2d')
  ctx.font     = font
  const m      = ctx.measureText(text)
  canvas.width  = Math.ceil(m.width) + 20
  canvas.height = Math.ceil(parseInt(font, 10) * 1.2) + 20
  ctx.font     = font
  ctx.fillStyle = color
  ctx.textBaseline = 'middle'
  ctx.textAlign    = 'center'
  ctx.fillText(text, canvas.width / 2, canvas.height / 2)
  const tex = new Texture(gl, { generateMipmaps: false })
  tex.image = canvas
  return { texture: tex, width: canvas.width, height: canvas.height }
}

class Title {
  constructor({ gl, plane, renderer, text, textColor = '#9d6fff', font = 'bold 24px Syne, sans-serif' }) {
    autoBind(this)
    this.gl = gl; this.plane = plane; this.renderer = renderer
    this.text = text; this.textColor = textColor; this.font = font
    this.createMesh()
  }
  createMesh() {
    const { texture, width, height } = createTextTexture(this.gl, this.text, this.font, this.textColor)
    const geo = new Plane(this.gl)
    const prog = new Program(this.gl, {
      vertex: `attribute vec3 position;attribute vec2 uv;uniform mat4 modelViewMatrix;uniform mat4 projectionMatrix;varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
      fragment: `precision highp float;uniform sampler2D tMap;varying vec2 vUv;void main(){vec4 c=texture2D(tMap,vUv);if(c.a<0.1)discard;gl_FragColor=c;}`,
      uniforms: { tMap: { value: texture } },
      transparent: true,
    })
    this.mesh = new Mesh(this.gl, { geometry: geo, program: prog })
    const aspect   = width / height
    const tH       = this.plane.scale.y * 0.13
    this.mesh.scale.set(tH * aspect, tH, 1)
    this.mesh.position.y = -this.plane.scale.y * 0.5 - tH * 0.5 - 0.05
    this.mesh.setParent(this.plane)
  }
}

class Media {
  constructor({ geometry, gl, image, index, length, renderer, scene, screen, text, viewport, bend, textColor, borderRadius = 0, font }) {
    this.extra = 0
    Object.assign(this, { geometry, gl, image, index, length, renderer, scene, screen, text, viewport, bend, textColor, borderRadius, font })
    this.createShader(); this.createMesh(); this.createTitle(); this.onResize()
  }
  createShader() {
    const tex = new Texture(this.gl, { generateMipmaps: true })
    this.program = new Program(this.gl, {
      depthTest: false, depthWrite: false,
      vertex: `precision highp float;attribute vec3 position;attribute vec2 uv;uniform mat4 modelViewMatrix;uniform mat4 projectionMatrix;uniform float uTime;uniform float uSpeed;varying vec2 vUv;void main(){vUv=uv;vec3 p=position;p.z=(sin(p.x*4.0+uTime)*1.5+cos(p.y*2.0+uTime)*1.5)*(0.1+uSpeed*0.5);gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);}`,
      fragment: `precision highp float;uniform vec2 uImageSizes;uniform vec2 uPlaneSizes;uniform sampler2D tMap;uniform float uBorderRadius;varying vec2 vUv;float roundedBoxSDF(vec2 p,vec2 b,float r){vec2 d=abs(p)-b;return length(max(d,vec2(0.0)))+min(max(d.x,d.y),0.0)-r;}void main(){vec2 ratio=vec2(min((uPlaneSizes.x/uPlaneSizes.y)/(uImageSizes.x/uImageSizes.y),1.0),min((uPlaneSizes.y/uPlaneSizes.x)/(uImageSizes.y/uImageSizes.x),1.0));vec2 uv=vec2(vUv.x*ratio.x+(1.0-ratio.x)*0.5,vUv.y*ratio.y+(1.0-ratio.y)*0.5);vec4 color=texture2D(tMap,uv);float d=roundedBoxSDF(vUv-0.5,vec2(0.5-uBorderRadius),uBorderRadius);float alpha=1.0-smoothstep(-0.002,0.002,d);gl_FragColor=vec4(color.rgb,alpha);}`,
      uniforms: {
        tMap:         { value: tex },
        uPlaneSizes:  { value: [0, 0] },
        uImageSizes:  { value: [0, 0] },
        uSpeed:       { value: 0 },
        uTime:        { value: 100 * Math.random() },
        uBorderRadius:{ value: this.borderRadius },
      },
      transparent: true,
    })
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = this.image
    img.onload = () => {
      tex.image = img
      this.program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight]
    }
  }
  createMesh() {
    this.plane = new Mesh(this.gl, { geometry: this.geometry, program: this.program })
    this.plane.setParent(this.scene)
  }
  createTitle() {
    this.title = new Title({ gl: this.gl, plane: this.plane, renderer: this.renderer, text: this.text, textColor: this.textColor, font: this.font })
  }
  update(scroll, direction) {
    this.plane.position.x = this.x - scroll.current - this.extra
    const x = this.plane.position.x
    const H = this.viewport.width / 2
    if (this.bend === 0) {
      this.plane.position.y = 0; this.plane.rotation.z = 0
    } else {
      const R = (H * H + Math.abs(this.bend) ** 2) / (2 * Math.abs(this.bend))
      const ex = Math.min(Math.abs(x), H)
      const arc = R - Math.sqrt(R * R - ex * ex)
      this.plane.position.y  = this.bend > 0 ? -arc : arc
      this.plane.rotation.z  = (this.bend > 0 ? -1 : 1) * Math.sign(x) * Math.asin(ex / R)
    }
    this.speed = scroll.current - scroll.last
    this.program.uniforms.uTime.value  += 0.04
    this.program.uniforms.uSpeed.value  = this.speed
    const po = this.plane.scale.x / 2
    const vo = this.viewport.width / 2
    this.isBefore = this.plane.position.x + po < -vo
    this.isAfter  = this.plane.position.x - po >  vo
    if (direction === 'right' && this.isBefore) { this.extra -= this.widthTotal; this.isBefore = this.isAfter = false }
    if (direction === 'left'  && this.isAfter)  { this.extra += this.widthTotal; this.isBefore = this.isAfter = false }
  }
  onResize({ screen, viewport } = {}) {
    if (screen)   this.screen   = screen
    if (viewport) this.viewport = viewport
    this.scale        = this.screen.height / 1500
    this.plane.scale.y = (this.viewport.height * (900 * this.scale)) / this.screen.height
    this.plane.scale.x = (this.viewport.width  * (700 * this.scale)) / this.screen.width
    this.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y]
    this.padding    = 2
    this.width      = this.plane.scale.x + this.padding
    this.widthTotal = this.width * this.length
    this.x          = this.width * this.index
  }
}

class App {
  constructor(container, { items, bend, textColor = '#9d6fff', borderRadius = 0, font = 'bold 24px Syne, sans-serif', scrollSpeed = 2, scrollEase = 0.05 } = {}) {
    this.container   = container
    this.scrollSpeed = scrollSpeed
    this.scroll      = { ease: scrollEase, current: 0, target: 0, last: 0 }
    this.onCheckDebounce = debounce(this.onCheck.bind(this), 200)
    this.createRenderer(); this.createCamera(); this.createScene()
    this.onResize(); this.createGeometry()
    this.createMedias(items, bend, textColor, borderRadius, font)
    this.update(); this.addEventListeners()
  }
  createRenderer() {
    this.renderer = new Renderer({ alpha: true, antialias: true, dpr: Math.min(devicePixelRatio, 2) })
    this.gl = this.renderer.gl
    this.gl.clearColor(0, 0, 0, 0)
    this.container.appendChild(this.gl.canvas)
  }
  createCamera() {
    this.camera = new Camera(this.gl)
    this.camera.fov = 45
    this.camera.position.z = 20
  }
  createScene()    { this.scene = new Transform() }
  createGeometry() { this.planeGeometry = new Plane(this.gl, { heightSegments: 50, widthSegments: 100 }) }
  createMedias(items, bend = 1, textColor, borderRadius, font) {
    const defaults = [
      { image: 'https://picsum.photos/seed/1/800/600', text: 'Bridge'       },
      { image: 'https://picsum.photos/seed/2/800/600', text: 'Desk Setup'   },
      { image: 'https://picsum.photos/seed/3/800/600', text: 'Waterfall'    },
      { image: 'https://picsum.photos/seed/4/800/600', text: 'City Lights'  },
      { image: 'https://picsum.photos/seed/5/800/600', text: 'Ocean'        },
      { image: 'https://picsum.photos/seed/6/800/600', text: 'Mountains'    },
      { image: 'https://picsum.photos/seed/7/800/600', text: 'Forest'       },
      { image: 'https://picsum.photos/seed/8/800/600', text: 'Architecture' },
    ]
    const galleryItems = items?.length ? items : defaults
    this.mediasImages  = [...galleryItems, ...galleryItems]
    this.medias = this.mediasImages.map((data, i) =>
      new Media({ geometry: this.planeGeometry, gl: this.gl, image: data.image, index: i, length: this.mediasImages.length, renderer: this.renderer, scene: this.scene, screen: this.screen, text: data.text, viewport: this.viewport, bend, textColor, borderRadius, font })
    )
  }
  onTouchDown(e) { this.isDown = true; this.scroll.position = this.scroll.current; this.start = e.touches?.[0].clientX ?? e.clientX }
  onTouchMove(e) {
    if (!this.isDown) return
    const x = e.touches?.[0].clientX ?? e.clientX
    this.scroll.target = this.scroll.position + (this.start - x) * this.scrollSpeed * 0.025
  }
  onTouchUp()   { this.isDown = false; this.onCheck() }
  onWheel(e)    { this.scroll.target += (e.deltaY > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.2; this.onCheckDebounce() }
  onCheck()     {
    if (!this.medias?.[0]) return
    const w = this.medias[0].width
    const idx = Math.round(Math.abs(this.scroll.target) / w)
    this.scroll.target = Math.sign(this.scroll.target || 1) * w * idx
  }
  onResize() {
    this.screen = { width: this.container.clientWidth, height: this.container.clientHeight }
    this.renderer.setSize(this.screen.width, this.screen.height)
    this.camera.perspective({ aspect: this.screen.width / this.screen.height })
    const fov    = (this.camera.fov * Math.PI) / 180
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z
    this.viewport = { width: height * this.camera.aspect, height }
    this.medias?.forEach((m) => m.onResize({ screen: this.screen, viewport: this.viewport }))
  }
  update() {
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease)
    const dir = this.scroll.current > this.scroll.last ? 'right' : 'left'
    this.medias?.forEach((m) => m.update(this.scroll, dir))
    this.renderer.render({ scene: this.scene, camera: this.camera })
    this.scroll.last = this.scroll.current
    this.raf = requestAnimationFrame(this.update.bind(this))
  }
  addEventListeners() {
    this._resize    = this.onResize.bind(this)
    this._wheel     = this.onWheel.bind(this)
    this._touchDown = this.onTouchDown.bind(this)
    this._touchMove = this.onTouchMove.bind(this)
    this._touchUp   = this.onTouchUp.bind(this)
    window.addEventListener('resize',     this._resize)
    window.addEventListener('wheel',      this._wheel,     { passive: true })
    window.addEventListener('mousedown',  this._touchDown)
    window.addEventListener('mousemove',  this._touchMove)
    window.addEventListener('mouseup',    this._touchUp)
    window.addEventListener('touchstart', this._touchDown, { passive: true })
    window.addEventListener('touchmove',  this._touchMove, { passive: true })
    window.addEventListener('touchend',   this._touchUp)
  }
  destroy() {
    cancelAnimationFrame(this.raf)
    window.removeEventListener('resize',     this._resize)
    window.removeEventListener('wheel',      this._wheel)
    window.removeEventListener('mousedown',  this._touchDown)
    window.removeEventListener('mousemove',  this._touchMove)
    window.removeEventListener('mouseup',    this._touchUp)
    window.removeEventListener('touchstart', this._touchDown)
    window.removeEventListener('touchmove',  this._touchMove)
    window.removeEventListener('touchend',   this._touchUp)
    this.gl?.canvas?.parentNode?.removeChild(this.gl.canvas)
  }
}

export default function CircularGallery({ items, bend = 2, textColor = '#9d6fff', borderRadius = 0.05, font = 'bold 24px Syne, sans-serif', scrollSpeed = 2, scrollEase = 0.05 }) {
  const ref = useRef(null)
  useEffect(() => {
    const app = new App(ref.current, { items, bend, textColor, borderRadius, font, scrollSpeed, scrollEase })
    return () => app.destroy()
  }, [items, bend, textColor, borderRadius, font, scrollSpeed, scrollEase])
  return <div className="circular-gallery" ref={ref} />
}