import React, { useState, useCallback, useRef, useEffect } from 'react'

interface Pixel {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  color: string
  life: number
  maxLife: number
  size: number
}

const COLORS = [
  '#d856bf', '#6750a2', '#c247ac', // Left cars (pink/purple shades)
  '#03b3c3', '#0e5ea5', '#324555'  // Right cars (cyan/blue shades)
]

const GlobalPixelExplosion: React.FC = () => {
  const [pixels, setPixels] = useState<Pixel[]>([])
  const animationRef = useRef<number | null>(null)

  const createExplosion = useCallback((x: number, y: number) => {
    // Completely random pixel count from 0 to 120
    // Using exponential distribution to favor smaller numbers but allow huge explosions
    const randomBase = Math.random()
    let pixelCount: number
    
    if (randomBase < 0.15) {
      // 15% chance: No pixels at all
      pixelCount = 0
    } else {
      // Use power curve to create exponential distribution
      // Most clicks will be small, but rare massive explosions possible
      const curve = Math.pow(Math.random(), 2.5) // Power of 2.5 heavily favors small numbers
      pixelCount = Math.floor(curve * 120) // 0-120 pixels
      
      // Add some completely random spikes
      if (Math.random() < 0.05) {
        pixelCount += Math.floor(Math.random() * 80) // Random extra boost
      }
    }

    console.log(`Creating explosion with ${pixelCount} pixels at:`, x, y)
    
    if (pixelCount === 0) return

    const newPixels: Pixel[] = []

    for (let i = 0; i < pixelCount; i++) {
      // More random angles and speeds
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 8 + 1 // 1-9 speed
      const life = Math.random() * 80 + 20 // 20-100 frames
      
      // Glitchy pixel sizes - mostly small, sometimes bigger blocks
      const sizeType = Math.random()
      let size: number
      if (sizeType < 0.6) {
        size = 2 // Most pixels are 2x2
      } else if (sizeType < 0.8) {
        size = 4 // Some are 4x4
      } else {
        size = Math.floor(Math.random() * 3) + 6 // Few are 6-8px blocks
      }

      newPixels.push({
        id: Date.now() + Math.random() * 10000 + i,
        x: x + (Math.random() - 0.5) * 20, // Larger scatter for glitch effect
        y: y + (Math.random() - 0.5) * 20,
        vx: Math.cos(angle) * speed * (Math.random() > 0.3 ? 1 : -1), // Random direction flips
        vy: Math.sin(angle) * speed * (Math.random() > 0.3 ? 1 : -1),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: life,
        maxLife: life,
        size: size
      })
    }

    setPixels(prev => [...prev, ...newPixels])
  }, [])

  // Global click handler
  const handleGlobalClick = useCallback((event: MouseEvent) => {
    console.log('Global click detected at:', event.clientX, event.clientY)
    createExplosion(event.clientX, event.clientY)
  }, [createExplosion])

  // Animation loop using requestAnimationFrame
  const animate = useCallback(() => {
    setPixels(currentPixels => {
      if (currentPixels.length === 0) {
        return currentPixels
      }

      const updatedPixels = currentPixels
        .map(pixel => ({
          ...pixel,
          x: pixel.x + pixel.vx + (Math.random() - 0.5) * 0.5, // Add jitter
          y: pixel.y + pixel.vy + (Math.random() - 0.5) * 0.5, // Add jitter
          vy: pixel.vy + 0.1 + (Math.random() - 0.5) * 0.1, // Irregular gravity
          vx: pixel.vx * (0.95 + Math.random() * 0.1), // Irregular air resistance
          life: pixel.life - (1 + Math.random() * 0.5) // Irregular fade
        }))
        .filter(pixel => pixel.life > 0)

      return updatedPixels
    })

    animationRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    // Add global click listener
    document.addEventListener('click', handleGlobalClick)

    return () => {
      document.removeEventListener('click', handleGlobalClick)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }
  }, [handleGlobalClick])

  useEffect(() => {
    if (pixels.length > 0 && !animationRef.current) {
      animationRef.current = requestAnimationFrame(animate)
    }
  }, [pixels.length, animate])

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      zIndex: 9999,
      overflow: 'hidden'
    }}>
      {pixels.map(pixel => {
        const opacity = pixel.life / pixel.maxLife
        const glitchIntensity = Math.random() * 0.4 + 0.6 // More variation
        
        // Heavy glitch effects
        const isCorrupted = Math.random() < 0.3
        const isStretched = Math.random() < 0.2
        const isFragmented = Math.random() < 0.15
        const isInverted = Math.random() < 0.1
        const isChromaticShifted = Math.random() < 0.25
        
        // Random RGB channel shifting
        const rShift = Math.random() * 4 - 2
        const gShift = Math.random() * 4 - 2
        const bShift = Math.random() * 4 - 2
        
        return (
          <div
            key={pixel.id}
            style={{
              position: 'fixed',
              left: Math.floor(pixel.x - pixel.size / 2 + (isCorrupted ? (Math.random() - 0.5) * 3 : 0)),
              top: Math.floor(pixel.y - pixel.size / 2 + (isCorrupted ? (Math.random() - 0.5) * 3 : 0)),
              width: `${pixel.size}px`,
              height: `${isStretched ? pixel.size * (0.5 + Math.random() * 2) : pixel.size}px`,
              backgroundColor: isInverted ? '#ffffff' : pixel.color,
              opacity: opacity * glitchIntensity * (isCorrupted ? 0.3 + Math.random() * 0.7 : 1),
              pointerEvents: 'none',
              borderRadius: '0px',
              mixBlendMode: isCorrupted ? (Math.random() > 0.5 ? 'difference' : 'exclusion') : 'normal',
              filter: `
                brightness(${isCorrupted ? 0.5 + Math.random() * 2 : 1 + Math.random() * 0.3})
                contrast(${isCorrupted ? 0.8 + Math.random() * 1.5 : 1.1 + Math.random() * 0.4})
                saturate(${isCorrupted ? 0.2 + Math.random() * 2 : 1.3 + Math.random() * 0.7})
                hue-rotate(${isCorrupted ? Math.random() * 360 : 0}deg)
                ${isFragmented ? `blur(${Math.random() * 2}px)` : ''}
                ${isInverted ? 'invert(1)' : ''}
              `,
              transform: `
                ${isStretched ? `scaleX(${0.3 + Math.random() * 2})` : ''}
                ${isFragmented ? `scaleY(${0.2 + Math.random() * 1.5})` : ''}
                ${isCorrupted ? `rotate(${(Math.random() - 0.5) * 90}deg)` : ''}
                ${isCorrupted ? `skewX(${(Math.random() - 0.5) * 30}deg)` : ''}
                ${isFragmented ? `perspective(${50 + Math.random() * 100}px) rotateX(${Math.random() * 60}deg)` : ''}
              `,
              boxShadow: `
                ${isChromaticShifted ? `${rShift}px 0 0 #ff0000` : ''}
                ${isChromaticShifted ? `, ${gShift}px 0 0 #00ff00` : ''}
                ${isChromaticShifted ? `, ${bShift}px 0 0 #0000ff` : ''}
                ${isCorrupted ? `, ${Math.random() * 6 - 3}px ${Math.random() * 6 - 3}px 0 ${pixel.color}` : ''}
                ${isFragmented ? `, inset 1px 1px 0 rgba(255,255,255,0.3)` : ''}
              `,
              animation: `
                ${Math.random() > 0.8 ? 'glitchFlicker 0.05s infinite' : ''}
                ${isCorrupted ? ', glitchShake 0.1s infinite' : ''}
                ${isFragmented ? ', glitchFade 0.3s ease-out' : ''}
              `,
              // Scanline effect
              background: isCorrupted ? `
                repeating-linear-gradient(
                  0deg,
                  ${pixel.color} 0px,
                  ${pixel.color} 1px,
                  transparent 1px,
                  transparent 2px
                )
              ` : pixel.color
            }}
          />
        )
      })}
      
      {/* CSS for glitch animations */}
      <style>{`
        @keyframes glitchFlicker {
          0% { opacity: 1; transform: translateX(0); }
          10% { opacity: 0.1; transform: translateX(2px) scaleX(1.1); }
          20% { opacity: 0.9; transform: translateX(-1px) scaleY(0.8); }
          30% { opacity: 0.2; transform: translateX(1px) rotate(2deg); }
          40% { opacity: 0.8; transform: translateX(-2px) skewX(5deg); }
          50% { opacity: 0.1; transform: translateX(0) scaleX(0.9); }
          60% { opacity: 1; transform: translateX(1px); }
          70% { opacity: 0.3; transform: translateX(-1px) scaleY(1.2); }
          80% { opacity: 0.9; transform: translateX(0); }
          90% { opacity: 0.1; transform: translateX(1px) rotate(-1deg); }
          100% { opacity: 0.7; transform: translateX(0); }
        }
        
        @keyframes glitchShake {
          0% { transform: translateX(0) translateY(0); }
          10% { transform: translateX(-1px) translateY(1px) rotate(0.5deg); }
          20% { transform: translateX(1px) translateY(-1px) skewX(1deg); }
          30% { transform: translateX(-2px) translateY(0) rotate(-0.5deg); }
          40% { transform: translateX(1px) translateY(1px) scaleX(1.1); }
          50% { transform: translateX(0) translateY(-2px) skewY(1deg); }
          60% { transform: translateX(-1px) translateY(1px) scaleY(0.9); }
          70% { transform: translateX(1px) translateY(0) rotate(1deg); }
          80% { transform: translateX(0) translateY(-1px) skewX(-1deg); }
          90% { transform: translateX(-1px) translateY(0) scaleX(0.95); }
          100% { transform: translateX(0) translateY(0); }
        }
        
        @keyframes glitchFade {
          0% { 
            opacity: 1; 
            filter: brightness(2) contrast(1.5) hue-rotate(0deg);
            transform: scaleX(1) scaleY(1);
          }
          25% { 
            opacity: 0.3; 
            filter: brightness(0.5) contrast(3) hue-rotate(90deg);
            transform: scaleX(2) scaleY(0.5);
          }
          50% { 
            opacity: 0.8; 
            filter: brightness(1.5) contrast(0.8) hue-rotate(180deg);
            transform: scaleX(0.5) scaleY(2);
          }
          75% { 
            opacity: 0.1; 
            filter: brightness(3) contrast(2) hue-rotate(270deg);
            transform: scaleX(1.5) scaleY(0.3);
          }
          100% { 
            opacity: 0; 
            filter: brightness(0) contrast(0) hue-rotate(360deg);
            transform: scaleX(0) scaleY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default GlobalPixelExplosion