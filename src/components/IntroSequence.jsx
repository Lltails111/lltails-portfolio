import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'


export default function IntroSequence({ onEntered }) {
 
  const [busy, setBusy] = useState(false)

  const rootRef = useRef(null)
  const rigRef = useRef(null)
  const minerRef = useRef(null)
  const hookImgRef = useRef(null)
  const hookRef = useRef(null)
  const hookLineRef = useRef(null)
  const chestRef = useRef(null)
  const chestOpenRef = useRef(null)
  const mapRef = useRef(null)
  const veilRef = useRef(null)

  const tl = useMemo(() => gsap.timeline({ paused: true }), [])
  
  // 存储连线参数
  const lineAngleRef = useRef(0)
  const lineLengthRef = useRef(0)
  const startPosRef = useRef({ x: 0, y: 0 })
  const endPosRef = useRef({ x: 0, y: 0 })

  // 计算连线参数
  const updateLineParams = () => {
    const rig = rigRef.current
    const miner = minerRef.current
    const chest = chestRef.current
    const line = hookLineRef.current
    if (!rig || !miner || !chest || !line) return

    const rb = rig.getBoundingClientRect()
    const mb = miner.getBoundingClientRect()
    const cb = chest.getBoundingClientRect()

    // 起点：矿工图片正下方中心点
    const startX = mb.left - rb.left + mb.width *0.67
    const startY = mb.top - rb.top + mb.height
    
    // 终点：宝箱上部中心点
    const endX = cb.left - rb.left + cb.width / 2
    const endY = cb.top - rb.top

    const dx = endX - startX
    const dy = endY - startY
    const len = Math.max(1, Math.sqrt(dx * dx + dy * dy))
    const ang = Math.atan2(dy, dx) * (180 / Math.PI)

    // 存储参数
    lineAngleRef.current = ang
    lineLengthRef.current = len
    startPosRef.current = { x: startX, y: startY }
    endPosRef.current = { x: endX, y: endY }

    // 设置连线样式
    line.style.left = `${startX}px`
    line.style.top = `${startY}px`
    line.style.width = `${len}px`
    line.style.transform = `rotate(${ang}deg)`
    line.style.backgroundColor = '#000000'
    line.style.height = '4px'
    line.style.boxShadow = 'none'
    
    // 设置钩子图片初始位置（起点 - 钩子中心点）
    if (hookImgRef.current) {
      hookImgRef.current.style.left = `${startX - 14}px`  // 钩子宽度的一半
      hookImgRef.current.style.top = `${startY - 14}px`   // 钩子高度的一半
      hookImgRef.current.style.transform = `rotate(${ang- 90 }deg)`
    }
  }

  // 初始化连线参数
  useLayoutEffect(() => {
    updateLineParams()
  }, [])

  // 监听窗口大小变化重新计算
  useEffect(() => {
    const handleResize = () => updateLineParams()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 宝箱闪烁特效
  useEffect(() => {
    if (chestRef.current && !busy) {
      gsap.to(chestRef.current, {
        duration: 0.6,
        opacity: 0.6,
        scale: 1.05,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      })
    }
    return () => {
      if (chestRef.current) {
        gsap.killTweensOf(chestRef.current)
      }
    }
  }, [busy])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    // 重新获取最新的连线参数
    updateLineParams()

    gsap.set([hookRef.current, chestOpenRef.current, mapRef.current], {
      opacity: 0,
    })
    gsap.set(hookLineRef.current, { transformOrigin: '0% 50%', scaleX: 0.05 })
    gsap.set(mapRef.current, { scale: 0.25, y: 120, rotate: -12 })
    gsap.set(veilRef.current, { opacity: 0 })
    
    // 钩子图片初始设置
    if (hookImgRef.current) {
      gsap.set(hookImgRef.current, { 
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
        zIndex: 20
      })
    }

    // 计算钩子运动终点位置（沿连线方向移动）
    const angleRad = (lineAngleRef.current * Math.PI) / 180
    const moveDistance = lineLengthRef.current
    const targetX = Math.cos(angleRad) * moveDistance
    const targetY = Math.sin(angleRad) * moveDistance

    tl.clear()
      // 显示连线和钩子落点
      .to([hookRef.current, hookLineRef.current], { opacity: 1, duration: 0.01 }, 0)
      // 连线伸长
      .to(hookLineRef.current, { scaleX: 1, duration: 0.55, ease: 'power2.out' }, 0)
      // 钩子图片沿连线运动到底部
      .to(hookImgRef.current, { 
        x: targetX, 
        y: targetY, 
        duration: 0.55, 
        ease: 'power2.out',
        onComplete: () => {
          // 钩子到达宝箱后，隐藏钩子和连线
          gsap.set(hookImgRef.current, { opacity: 0 })
          gsap.set(hookLineRef.current, { opacity: 0 })
        }
      }, 0)
      // 宝箱抖动
      .to(chestRef.current, { y: '+=-10', duration: 0.18, yoyo: true, repeat: 1 }, 0.28)
      // 宝箱被抓起向上移动
      .to(chestRef.current, { x: '+=-40', y: '+=-130', duration: 0.65, ease: 'power2.inOut' }, 0.58)
      // 宝箱消失
      .to(chestRef.current, { opacity: 0, duration: 0.12 }, 1.18)
      // 宝箱打开
      .to(chestOpenRef.current, { opacity: 1, duration: 0.01 }, 1.18)
      .to(chestOpenRef.current, { scale: 1.03, duration: 0.18, yoyo: true, repeat: 1 }, 1.2)
      // 地图飞出
      .to(mapRef.current, { opacity: 1, duration: 0.01 }, 1.32)
      .to(mapRef.current, { y: -10, rotate: 0, scale: 0.9, duration: 0.7, ease: 'power3.out' }, 1.32)
      .to(mapRef.current, { scale: 1.2, duration: 0.35, ease: 'power2.inOut' }, 2.0)
      // 遮罩淡入
      .to(veilRef.current, { opacity: 1, duration: 0.35, ease: 'power2.out' }, 2.05)
      .add(() => onEntered?.(), 2.25)

    return () => tl.kill()
  }, [onEntered, tl])

  function start() {
    if (busy) return
    setBusy(true)
    
    if (chestRef.current) {
      gsap.killTweensOf(chestRef.current)
      gsap.set(chestRef.current, { opacity: 1, scale: 1 })
    }
    
    
    tl.eventCallback('onUpdate', () => {
      const t = tl.time()
      
    })
    tl.play(0)
  }

  return (
    <div ref={rootRef} className="fixed inset-0 z-[60] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-[var(--color-paper)]/50" />

      <div className="absolute left-1/2 top-1/2 w-[min(1000px,90vw)] -translate-x-1/2 -translate-y-1/2">
        <div className="grid grid-cols-2 gap-4">
          
          {/* 左侧：文字板块 */}
          <div className="flex flex-col justify-center rounded-3xl bg-white/30 p-8 backdrop-blur-sm">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/40 px-3 py-1 text-base font-semibold tracking-wide text-black/60 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-heart)]" />
              ✨ Welcome
            </div>
            <div className="mt-3 text-4xl font-semibold leading-tight text-black/85">
              欢迎来到<br />
              我的个人网页
            </div>
            <div className="mt-3 max-w-[32ch] text-base leading-relaxed text-black/60">
              点击下方按钮，开启一段奇妙的探索之旅。
            </div>
            <button
              type="button"
              disabled={busy}
              onClick={start}
              className="mt-6 inline-flex w-fit items-center gap-2 rounded-2xl bg-[var(--color-moss)] px-6 py-3 text-lg font-semibold text-white shadow-[0_6px_0_#2d5a2a] transition-all hover:brightness-105 active:translate-y-1 active:shadow-[0_3px_0_#2d5a2a] disabled:opacity-60"
            >
              进入频道
              <span className="text-white/85 text-lg">→</span>
            </button>
          </div>

          {/* 右侧：动画区域 */}
          <div 
            className="relative rounded-3xl overflow-hidden shadow-2xl"
            style={{
              backgroundImage: "url('/img/bg.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
            <div className="absolute inset-2 rounded-2xl border border-white/30 pointer-events-none" />
            
            <div ref={rigRef} className="relative h-[420px] w-full">
              {/* 矿工图片 */}
              <img
                ref={minerRef}
                src="/img/miner.gif"
                alt="miner"
                className="absolute left-1/2 -translate-x-1/2 top-4 h-[140px] w-auto select-none drop-shadow-xl"
                loading="eager"
                draggable="false"
              />

              {/* 黑色实线连接线容器 */}
              <div className="absolute inset-0 overflow-visible" style={{ zIndex: 10 }}>
                {/* 黑色实线连接线 */}
                <div
                  ref={hookLineRef}
                  className="absolute h-[4px] rounded-full bg-black shadow-none"
                  style={{ zIndex: 5 }}
                />

                {/* 钩子图片 */}
                <img
                  ref={hookImgRef}
                  src="/img/hook.png"
                  alt="hook"
                  className="absolute w-auto select-none drop-shadow-md"
                  style={{ 
                    zIndex: 20,
                    height: '28px',
                    transformOrigin: 'center center'
                  }}
                  loading="eager"
                  draggable="false"
                />
              </div>

              {/* 钩子落点标识 */}
              <div
                ref={hookRef}
                className="absolute h-8 w-8 rounded-2xl border-2 border-white/40 bg-white/40 shadow-lg backdrop-blur-sm opacity-0"
                style={{
                  left: endPosRef.current.x,
                  top: endPosRef.current.y,
                }}
              />

              {/* 宝箱 */}
              <img
                ref={chestRef}
                src="/img/chest.png"
                alt="chest"
                className="absolute right-[30px] bottom-[30px] h-[85px] w-auto select-none drop-shadow-xl"
                loading="eager"
                draggable="false"
              />

              {/* 宝箱打开状态 */}
              <img
                ref={chestOpenRef}
                src="/img/chest_open.png"
                alt="chest open"
                className="absolute right-[30px] bottom-[30px] h-[85px] w-auto select-none drop-shadow-xl"
                loading="eager"
                draggable="false"
              />

              {/* 飞出的地图 */}
              <img
                ref={mapRef}
                src="/img/map.png"
                alt="map"
                className="absolute right-[-15px] top-[50px] h-[180px] w-auto select-none rounded-2xl border-2 border-white/50 bg-white/80 shadow-2xl"
                loading="eager"
                draggable="false"
              />
            </div>
          
          </div>
        </div>
      </div>

      <div
        ref={veilRef}
        className="pointer-events-none absolute inset-0 bg-[var(--color-paper)]"
      />
    </div>
  )
}