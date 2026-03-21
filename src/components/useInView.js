import { useEffect, useRef, useState } from 'react'

export function useInView(options = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (!options.repeat) observer.unobserve(element)
        } else if (options.repeat) {
          setInView(false)
        }
      },
      { threshold: options.threshold || 0.15, ...options }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return [ref, inView]
}
