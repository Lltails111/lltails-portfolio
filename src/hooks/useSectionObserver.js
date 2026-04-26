// src/hooks/useSectionObserver.js
import { useEffect, useMemo, useState } from 'react'

export function useSectionObserver(sectionIds, { rootMargin = '-40% 0px -40% 0px' } = {}) {
  const ids = useMemo(() => (Array.isArray(sectionIds) ? sectionIds : []), [sectionIds])
  const [activeId, setActiveId] = useState(ids[0] ?? null)

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    if (elements.length === 0) return undefined

    const io = new IntersectionObserver(
      (entries) => {
        // 找出所有可见的元素
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length === 0) return
        
        // 按交叉比例排序，取最可见的那个
        visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        const newActiveId = visible[0].target.id
        
        // 只有当 activeId 变化时才更新
        setActiveId((prev) => (prev !== newActiveId ? newActiveId : prev))
      },
      { 
        root: null, 
        threshold: [0.1, 0.2, 0.3, 0.4, 0.5],  // 多个阈值
        rootMargin: '-35% 0px -45% 0px'  // 视口中心区域检测
      },
    )

    for (const el of elements) io.observe(el)
    return () => io.disconnect()
  }, [ids])

  return activeId
}