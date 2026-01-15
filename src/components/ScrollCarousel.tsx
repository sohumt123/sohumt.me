import { useState, useRef, useEffect } from 'react'

interface ScrollCarouselProps {
  photos: string[]
}

// Hand-drawn wavy frame component
const WavyFrame = ({ children }: { children: React.ReactNode }) => (
  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
    {/* Hand-drawn wavy border SVG */}
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 2
      }}
      viewBox="0 0 800 600"
      preserveAspectRatio="none"
    >
      {/* Top wavy line */}
      <path
        d="M 10 10 Q 50 8 100 10 T 200 10 T 300 10 T 400 10 T 500 10 T 600 10 T 700 10 T 790 10"
        stroke="#2c2c2c"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        style={{ filter: 'drop-shadow(2px 2px 3px rgba(0,0,0,0.3))' }}
      />
      {/* Right wavy line */}
      <path
        d="M 790 10 Q 792 50 790 100 T 790 200 T 790 300 T 790 400 T 790 500 T 790 590"
        stroke="#2c2c2c"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        style={{ filter: 'drop-shadow(2px 2px 3px rgba(0,0,0,0.3))' }}
      />
      {/* Bottom wavy line */}
      <path
        d="M 790 590 Q 750 592 700 590 T 600 590 T 500 590 T 400 590 T 300 590 T 200 590 T 100 590 T 10 590"
        stroke="#2c2c2c"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        style={{ filter: 'drop-shadow(2px 2px 3px rgba(0,0,0,0.3))' }}
      />
      {/* Left wavy line */}
      <path
        d="M 10 590 Q 8 550 10 500 T 10 400 T 10 300 T 10 200 T 10 100 T 10 10"
        stroke="#2c2c2c"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        style={{ filter: 'drop-shadow(2px 2px 3px rgba(0,0,0,0.3))' }}
      />
    </svg>

    {/* Content (photo) */}
    <div style={{
      position: 'relative',
      zIndex: 1,
      width: '100%',
      height: '100%',
      padding: '20px'
    }}>
      {children}
    </div>
  </div>
)

// Corner doodle decorations
const CornerDoodles = () => (
  <>
    {/* Top-left doodle */}
    <svg
      style={{
        position: 'absolute',
        top: '-15px',
        left: '-15px',
        width: '50px',
        height: '50px',
        zIndex: 3
      }}
      viewBox="0 0 50 50"
    >
      <path
        d="M 5 25 Q 12 12 25 5 Q 38 12 45 25"
        stroke="#2c2c2c"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="25" cy="20" r="3" fill="#2c2c2c" />
    </svg>

    {/* Top-right doodle */}
    <svg
      style={{
        position: 'absolute',
        top: '-15px',
        right: '-15px',
        width: '50px',
        height: '50px',
        zIndex: 3
      }}
      viewBox="0 0 50 50"
    >
      <path
        d="M 45 25 Q 38 12 25 5 Q 12 12 5 25"
        stroke="#2c2c2c"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="25" cy="20" r="3" fill="#2c2c2c" />
    </svg>

    {/* Bottom-left doodle */}
    <svg
      style={{
        position: 'absolute',
        bottom: '-15px',
        left: '-15px',
        width: '50px',
        height: '50px',
        zIndex: 3
      }}
      viewBox="0 0 50 50"
    >
      <path
        d="M 5 25 Q 12 38 25 45 Q 38 38 45 25"
        stroke="#2c2c2c"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="25" cy="30" r="3" fill="#2c2c2c" />
    </svg>

    {/* Bottom-right doodle */}
    <svg
      style={{
        position: 'absolute',
        bottom: '-15px',
        right: '-15px',
        width: '50px',
        height: '50px',
        zIndex: 3
      }}
      viewBox="0 0 50 50"
    >
      <path
        d="M 45 25 Q 38 38 25 45 Q 12 38 5 25"
        stroke="#2c2c2c"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="25" cy="30" r="3" fill="#2c2c2c" />
    </svg>
  </>
)

export default function ScrollCarousel({ photos }: ScrollCarouselProps) {
  // State management
  const [photoProgress, setPhotoProgress] = useState(0) // 0 to photos.length - 1
  const [isFixed, setIsFixed] = useState(false)
  const [carouselStartY, setCarouselStartY] = useState(0)

  // Refs
  const containerRef = useRef<HTMLDivElement>(null)

  // Detect carousel start position on mount
  useEffect(() => {
    const updateCarouselStart = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setCarouselStartY(window.scrollY + rect.top)
      }
    }

    updateCarouselStart()
    // Update on resize
    window.addEventListener('resize', updateCarouselStart)
    return () => window.removeEventListener('resize', updateCarouselStart)
  }, [])

  // Listen to scroll position - this is the core scroll-jacking mechanism
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY
      const relativeScroll = currentScroll - carouselStartY

      // Constants for scroll zones
      const ENTRY_ZONE = window.innerHeight * 0.5 // 50vh entry
      const SCROLL_PER_PHOTO = 400 // 400px per photo
      const photoZoneEnd = ENTRY_ZONE + (photos.length * SCROLL_PER_PHOTO)

      if (relativeScroll < 0) {
        // Zone 1: Before carousel
        setIsFixed(false)
        setPhotoProgress(0)
      } else if (relativeScroll < ENTRY_ZONE) {
        // Zone 2: Entry - carousel slides in and locks
        setIsFixed(true)
        setPhotoProgress(0)
      } else if (relativeScroll < photoZoneEnd) {
        // Zone 3: Photo navigation - locked carousel
        setIsFixed(true)
        const progress = (relativeScroll - ENTRY_ZONE) / SCROLL_PER_PHOTO
        setPhotoProgress(Math.min(progress, photos.length - 1))
      } else {
        // Zone 4: After carousel - unlocked
        setIsFixed(false)
        setPhotoProgress(photos.length - 1)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial call
    return () => window.removeEventListener('scroll', handleScroll)
  }, [carouselStartY, photos.length])

  // Calculate photo style based on smooth progress
  const getPhotoStyle = (index: number) => {
    const distance = Math.abs(photoProgress - index)
    const scale = distance < 0.5 ? 1 : distance < 1.5 ? 0.75 : 0.55
    const opacity = distance < 0.5 ? 1 : distance < 1.5 ? 0.6 : 0.3
    const zIndex = distance < 0.5 ? 10 : distance < 1.5 ? 5 : 1

    return {
      transform: `scale(${scale})`,
      opacity: opacity,
      zIndex: zIndex,
      transition: 'all 0.3s ease-out',
      width: '90%',
      height: '80%',
      margin: 'auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative' as const,
      willChange: 'transform, opacity'
    }
  }

  // Calculate current photo index for progress indicator
  const currentPhotoIndex = Math.round(photoProgress)

  return (
    <div
      ref={containerRef}
      style={{
        position: isFixed ? 'fixed' : 'absolute',
        top: isFixed ? '50vh' : 'auto',
        left: 0,
        right: 0,
        transform: isFixed ? 'translateY(-50%)' : 'none',
        backgroundColor: 'white',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        zIndex: isFixed ? 10 : 1
      }}
    >
      {/* Horizontal track */}
      <div style={{
        display: 'flex',
        transform: `translate3d(calc(20vw - ${photoProgress * 60}vw), 0, 0)`,
        transition: 'transform 0.1s linear',
        width: `${photos.length * 60}vw`,
        height: '100%',
        alignItems: 'center',
        willChange: 'transform'
      }}>
        {photos.map((photo, index) => (
          <div
            key={index}
            style={{
              width: '60vw',
              height: '100%',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div style={getPhotoStyle(index)}>
              <div style={{
                position: 'relative',
                backgroundColor: '#fff',
                boxShadow: '10px 10px 0px rgba(0,0,0,0.1)',
                border: 'none',
                width: '100%',
                height: '100%',
                maxWidth: '800px',
                maxHeight: '600px'
              }}>
                <WavyFrame>
                  <CornerDoodles />
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '0',
                      filter: 'brightness(0.98) contrast(1.02)'
                    }}
                  />
                </WavyFrame>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress indicator dots */}
      <div style={{
        position: 'absolute',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '12px',
        zIndex: 20
      }}>
        {photos.map((_, index) => (
          <div
            key={index}
            style={{
              width: currentPhotoIndex === index ? '32px' : '12px',
              height: '12px',
              backgroundColor: currentPhotoIndex === index ? '#2c2c2c' : '#ccc',
              borderRadius: '6px',
              transition: 'all 0.3s ease',
              border: currentPhotoIndex === index ? '2px solid #2c2c2c' : '2px solid #ccc',
              boxShadow: currentPhotoIndex === index ? '2px 2px 4px rgba(0,0,0,0.3)' : 'none'
            }}
          />
        ))}
      </div>
    </div>
  )
}
