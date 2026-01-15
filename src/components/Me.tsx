// import React from 'react'
import Header from './Header'
import ScrollCarousel from './ScrollCarousel'

type Page = 'home' | 'me' | 'jobs'

interface MeProps {
  onNavigate?: (page: Page) => void
}

const Me = ({ onNavigate }: MeProps = {}) => {

  const navigateToPage = (page: Page) => {
    if (onNavigate) {
      onNavigate(page)
    }
  }

  // Photo array for the carousel
  // TODO: Replace these placeholder SVGs with your actual photos (JPG/PNG)
  const photos = [
    '/photos/photo1.svg',
    '/photos/photo2.svg',
    '/photos/photo3.svg',
    '/photos/photo4.svg',
    '/photos/photo5.svg',
    '/photos/photo6.svg',
    '/photos/photo7.svg',
    '/photos/photo8.svg'
  ]

  // Calculate scroll height needed for carousel section
  const SCROLL_PER_PHOTO = 400 // pixels to scroll per photo
  const ENTRY_EXIT_BUFFER = typeof window !== 'undefined' ? window.innerHeight * 0.5 : 400
  const carouselScrollHeight = (ENTRY_EXIT_BUFFER * 2) + (photos.length * SCROLL_PER_PHOTO)

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'white',
      width: '100%',
      position: 'relative',
      top: 0,
      left: 0
    }}>
      <Header onNavigate={navigateToPage} />

      {/* Title Section - Zone 1 */}
      <div style={{
        paddingTop: '100px',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Gloria Hallelujah", cursive',
        fontSize: '4rem',
        color: '#333',
        backgroundColor: 'white'
      }}>
        <h1 style={{ margin: 0 }}>Sohum</h1>
        <div style={{
          fontSize: '1.5rem',
          marginTop: '30px',
          opacity: 0.7,
          animation: 'fadeInOut 2s ease-in-out infinite',
          fontFamily: '"Caveat Brush", cursive'
        }}>
          ↓
        </div>
      </div>

      {/* Carousel Section - Zones 2 & 3 (entry + locked navigation) */}
      <div style={{
        height: `${carouselScrollHeight}px`,
        position: 'relative',
        backgroundColor: 'white'
      }}>
        <ScrollCarousel photos={photos} />
      </div>

      {/* Additional Content Below Carousel - Zone 4 */}
      <div style={{
        minHeight: '100vh',
        padding: '80px 40px',
        fontFamily: '"Gloria Hallelujah", cursive',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <h2 style={{ fontSize: '3rem', marginBottom: '40px', textAlign: 'center' }}>
          More About Me
        </h2>
        <p style={{ fontSize: '1.5rem', maxWidth: '800px', textAlign: 'center', lineHeight: '1.8' }}>
          This is where you can add more content about yourself...
        </p>
      </div>

      {/* Fade in/out animation for scroll prompt */}
      <style>{`
        @keyframes fadeInOut {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

export default Me