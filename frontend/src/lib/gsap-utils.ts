import { gsap } from 'gsap'
import { useEffect, useRef } from 'react'

/**
 * GSAP Hook for Scroll Animations
 * Usage: const ref = useGSAPScrollAnimation(animation)
 */
export function useGSAPScrollAnimation(
  animationFn: (element: HTMLElement) => gsap.core.Timeline | gsap.core.Tween,
  dependencies: any[] = []
) {
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!elementRef.current) return

    const animation = animationFn(elementRef.current)

    return () => {
      animation.kill()
    }
  }, [animationFn, ...dependencies])

  return elementRef
}

/**
 * Pre-built GSAP Animations
 */
export const gsapAnimations = {
  /**
   * Fade in from bottom
   */
  fadeInUp: (element: HTMLElement) => {
    return gsap.fromTo(
      element,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    )
  },

  /**
   * Scale in
   */
  scaleIn: (element: HTMLElement) => {
    return gsap.fromTo(
      element,
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'back.out(1.4)',
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
        },
      }
    )
  },

  /**
   * Slide in from left
   */
  slideInLeft: (element: HTMLElement) => {
    return gsap.fromTo(
      element,
      { opacity: 0, x: -100 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
        },
      }
    )
  },

  /**
   * Slide in from right
   */
  slideInRight: (element: HTMLElement) => {
    return gsap.fromTo(
      element,
      { opacity: 0, x: 100 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
        },
      }
    )
  },

  /**
   * Stagger children (for lists/grids)
   */
  staggerChildren: (element: HTMLElement) => {
    const children = element.children
    return gsap.fromTo(
      children,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
        },
      }
    )
  },

  /**
   * Number counter animation
   */
  numberCounter: (element: HTMLElement, endValue: number) => {
    const obj = { value: 0 }
    return gsap.to(obj, {
      value: endValue,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => {
        element.textContent = Math.round(obj.value).toString()
      },
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
      },
    })
  },
}

/**
 * GSAP Timeline builder for complex animations
 */
export function createTimeline() {
  return gsap.timeline()
}

/**
 * Parallax effect helper
 */
export function useParallax(speed: number = 0.5) {
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!elementRef.current) return

    gsap.to(elementRef.current, {
      yPercent: -50 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: elementRef.current,
        scrub: true,
      },
    })
  }, [speed])

  return elementRef
}
