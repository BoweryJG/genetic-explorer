import React, { useEffect, useRef } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  color: string
  animationDuration: number
  animationDelay: number
  animationType: number
}

export function FloatingParticles() {
  const containerRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<Particle[]>([])

  useEffect(() => {
    const colors = [
      'var(--bioluminescent-blue)',
      'var(--genetic-purple)',
      'var(--helix-pink)',
      'var(--phosphorescent-green)',
      'var(--aurora-cyan)'
    ]

    // Generate particles
    const particles: Particle[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      animationDuration: Math.random() * 20 + 10,
      animationDelay: Math.random() * 20,
      animationType: Math.floor(Math.random() * 3) + 1
    }))

    particlesRef.current = particles

    // Create particle elements
    if (containerRef.current) {
      particles.forEach(particle => {
        const el = document.createElement('div')
        el.className = 'floating-particle'
        el.style.left = `${particle.x}%`
        el.style.top = `${particle.y}%`
        el.style.width = `${particle.size}px`
        el.style.height = `${particle.size}px`
        el.style.background = particle.color
        el.style.boxShadow = `0 0 ${particle.size * 2}px ${particle.color}`
        el.style.animation = `float-particle-${particle.animationType} ${particle.animationDuration}s ${particle.animationDelay}s ease-in-out infinite`
        containerRef.current?.appendChild(el)
      })
    }

    return () => {
      // Cleanup
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [])

  return <div ref={containerRef} id="particle-container" />
}

// Usage: Add <FloatingParticles /> to your main App component
// This will create floating particles throughout the entire viewport