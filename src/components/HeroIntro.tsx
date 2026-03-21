import { useEffect, useRef } from 'react'

interface HeroIntroProps {
  onComplete: () => void
}

export default function HeroIntro({ onComplete }: HeroIntroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const subRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const canvasWrap = canvasRef.current
    const introText = textRef.current
    const introSub = subRef.current
    if (!container || !canvasWrap || !introText || !introSub) return

    let raf = 0
    let renderer: any = null
    let resizeHandler: (() => void) | null = null
    const timers: ReturnType<typeof setTimeout>[] = []

    function runTextAnim() {
      timers.push(
        setTimeout(() => {
          if (!introText) return
          introText.style.transition = 'opacity 0.9s ease, text-shadow 0.9s ease'
          introText.style.opacity = '1'
        }, 400)
      )
      timers.push(
        setTimeout(() => {
          if (!introSub) return
          introSub.style.transition = 'opacity 0.7s ease'
          introSub.style.opacity = '1'
        }, 900)
      )
      timers.push(
        setTimeout(() => {
          if (!container) return
          container.style.transition = 'opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1)'
          container.style.opacity = '0'
        }, 2600)
      )
      timers.push(
        setTimeout(() => {
          cancelAnimationFrame(raf)
          if (renderer?.dispose) renderer.dispose()
          if (resizeHandler) window.removeEventListener('resize', resizeHandler)
          onComplete()
        }, 3500)
      )
    }

    // Dynamically load Three.js from CDN (avoids adding it to bundle)
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/89/three.min.js'

    script.onload = () => {
      const THREE = (window as any).THREE
      if (!THREE) { runTextAnim(); return }

      const camera = new THREE.Camera()
      camera.position.z = 1
      const scene = new THREE.Scene()
      const geometry = new THREE.PlaneBufferGeometry(2, 2)

      const uniforms = {
        time: { type: 'f', value: 1.0 },
        resolution: { type: 'v2', value: new THREE.Vector2() },
      }

      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: `void main(){gl_Position=vec4(position,1.0);}`,
        fragmentShader: `
          #define TWO_PI 6.2831853072
          #define PI 3.14159265359
          precision highp float;
          uniform vec2 resolution;
          uniform float time;
          float random(in float x){return fract(sin(x)*1e4);}
          float random(vec2 st){return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);}
          void main(void){
            vec2 uv=(gl_FragCoord.xy*2.0-resolution.xy)/min(resolution.x,resolution.y);
            vec2 fMosaicScal=vec2(4.0,2.0);
            vec2 vScreenSize=vec2(256,256);
            uv.x=floor(uv.x*vScreenSize.x/fMosaicScal.x)/(vScreenSize.x/fMosaicScal.x);
            uv.y=floor(uv.y*vScreenSize.y/fMosaicScal.y)/(vScreenSize.y/fMosaicScal.y);
            float t=time*0.06+random(uv.x)*0.4;
            float lineWidth=0.0008;
            vec3 color=vec3(0.0);
            for(int j=0;j<3;j++){
              for(int i=0;i<5;i++){
                color[j]+=lineWidth*float(i*i)/abs(fract(t-0.01*float(j)+float(i)*0.01)*1.0-length(uv));
              }
            }
            gl_FragColor=vec4(color[2],color[1],color[0],1.0);
          }
        `,
      })

      const mesh = new THREE.Mesh(geometry, material)
      scene.add(mesh)
      renderer = new THREE.WebGLRenderer({ antialias: false })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      canvasWrap.appendChild(renderer.domElement)

      resizeHandler = () => {
        if (!canvasWrap) return
        renderer.setSize(canvasWrap.offsetWidth, canvasWrap.offsetHeight)
        uniforms.resolution.value.x = renderer.domElement.width
        uniforms.resolution.value.y = renderer.domElement.height
      }
      resizeHandler()
      window.addEventListener('resize', resizeHandler)

      const tick = () => {
        raf = requestAnimationFrame(tick)
        uniforms.time.value += 0.05
        renderer.render(scene, camera)
      }
      tick()

      runTextAnim()
    }

    script.onerror = () => { runTextAnim() }
    document.head.appendChild(script)

    return () => {
      cancelAnimationFrame(raf)
      timers.forEach(clearTimeout)
      if (renderer?.dispose) renderer.dispose()
      if (resizeHandler) window.removeEventListener('resize', resizeHandler)
      script.remove()
    }
  }, [onComplete])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 500,
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      {/* WebGL shader canvas */}
      <div
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      />

      {/* Name text */}
      <div
        ref={textRef}
        style={{
          position: 'relative',
          zIndex: 10,
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: 'clamp(36px, 8vw, 96px)',
          letterSpacing: '-0.04em',
          color: '#fff',
          textAlign: 'center',
          opacity: 0,
          textShadow:
            '0 0 80px rgba(110,231,183,0.6), 0 0 160px rgba(110,231,183,0.3)',
        }}
      >
        Rithwik Bandi
      </div>

      {/* Subtitle */}
      <div
        ref={subRef}
        style={{
          position: 'relative',
          zIndex: 10,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 'clamp(12px, 2vw, 16px)',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'rgba(110,231,183,0.8)',
          marginTop: '12px',
          opacity: 0,
        }}
      >
        Full Stack &amp; AI Engineer
      </div>
    </div>
  )
}
