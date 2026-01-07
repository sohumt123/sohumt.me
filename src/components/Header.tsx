import { useState } from 'react'
import '@fontsource/caveat-brush/index.css'

type Page = 'home' | 'me' | 'jobs'

interface HeaderProps {
  onNavigate?: (page: Page) => void
}

const Header = ({ onNavigate }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [goblinSpin, setGoblinSpin] = useState('')

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const spinGoblin = () => {
    const isClockwise = Math.random() > 0.5
    const spinClass = isClockwise ? 'spin360CW' : 'spin360CCW'
    setGoblinSpin(spinClass)
    
    // Reset the animation after it completes
    setTimeout(() => {
      setGoblinSpin('')
    }, 500)
  }

  const goToHomepage = () => {
    setIsMenuOpen(false)
    if (onNavigate) {
      onNavigate('home')
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const navigateToMe = () => {
    setIsMenuOpen(false)
    if (onNavigate) {
      onNavigate('me')
    }
  }

  const navigateToJobs = () => {
    setIsMenuOpen(false)
    if (onNavigate) {
      onNavigate('jobs')
    }
  }

  return (
    <header style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      width: '100vw', 
      height: '60px', 
      zIndex: 50, 
      backgroundColor: 'transparent',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      padding: '10px 20px 0 20px'
    }}>
      {/* Hand-drawn menu lines - Top Left */}
      <div style={{ cursor: 'pointer' }} onClick={() => { toggleMenu(); spinGoblin(); }}>
        <svg width="30" height="24" viewBox="0 0 30 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M3 6C6 5.5 10 7 13 6.5C16 6 20 5 23 6C25 6.5 27 5.5 27 6" 
            stroke="#000" 
            strokeWidth="2" 
            strokeLinecap="round"
            style={{
              filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.3))'
            }}
          />
          <path 
            d="M3 12C6 11.5 10 13 13 12.5C16 12 20 11.5 23 12C25 12.5 27 11.5 27 12" 
            stroke="#000" 
            strokeWidth="2" 
            strokeLinecap="round"
            style={{
              filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.3))'
            }}
          />
          <path 
            d="M3 18C6 17.5 10 19 13 18.5C16 18 20 17.5 23 18C25 18.5 27 17.5 27 18" 
            stroke="#000" 
            strokeWidth="2" 
            strokeLinecap="round"
            style={{
              filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.3))'
            }}
          />
        </svg>
      </div>

      {/* Logo in center */}
      <div style={{ 
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        top: '10px'
      }}>
        <h1 
          style={{ 
            fontFamily: '"Caveat Brush", cursive',
            fontSize: '2.2rem',
            color: '#000',
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
            margin: 0,
            cursor: 'pointer',
            transition: 'color 0.3s ease-in-out',
            zIndex: isMenuOpen ? 1001 : 'auto',
            position: 'relative',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none'
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLHeadingElement).style.color = '#f0f0f0';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLHeadingElement).style.color = '#000';
          }}
          onClick={goToHomepage}
        >
          sohumt.me
        </h1>
      </div>
      
      {/* Clash Royale Goblin GIF - Top Right */}
      <div style={{ marginRight: '20px' }}>
        <img 
          src="/clash-royale-goblin.gif" 
          alt="Clash Royale Goblin" 
          style={{
            width: '40px',
            height: '40px',
            objectFit: 'contain',
            filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.3))',
            cursor: 'pointer',
            transition: 'transform 0.1s ease-in-out',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none'
          }}
          className={goblinSpin}
          onMouseEnter={(e) => {
            if (!goblinSpin) {
              (e.target as HTMLImageElement).style.animation = 'jiggle 0.3s ease-in-out infinite';
            }
          }}
          onMouseLeave={(e) => {
            if (!goblinSpin) {
              (e.target as HTMLImageElement).style.animation = '';
            }
          }}
        />
        <style>{`
          @keyframes jiggle {
            0% { transform: rotate(-1deg) translateX(-1px); }
            25% { transform: rotate(1deg) translateX(1px); }
            50% { transform: rotate(-1deg) translateX(-1px); }
            75% { transform: rotate(1deg) translateX(1px); }
            100% { transform: rotate(0deg) translateX(0px); }
          }
          
          @keyframes spin360CW {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes spin360CCW {
            from { transform: rotate(0deg); }
            to { transform: rotate(-360deg); }
          }
          
          .spin360CW {
            animation: spin360CW 0.5s ease-in-out !important;
          }
          
          .spin360CCW {
            animation: spin360CCW 0.5s ease-in-out !important;
          }
        `}</style>
      </div>

      {/* Animated Navigation Menu */}
      {isMenuOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 100,
            pointerEvents: 'none',
            animation: 'fadeIn 0.3s ease-out'
          }}
        >
          {/* Clickable overlay to close menu, excludes header area */}
          <div 
            style={{
              position: 'absolute',
              top: '70px',
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: 'auto'
            }}
            onClick={toggleMenu}
          />
          {/* Triangle Container */}
          <div 
            style={{
              position: 'absolute',
              top: '-180px',
              left: 'calc(50% + 25px)',
              transform: 'translateX(-50%)',
              width: '500px',
              height: '400px',
              animation: 'expandFromHeader 0.4s ease-out',
              transformOrigin: '250px 189px',
              pointerEvents: 'none'
            }}
          >
            {/* Hand-drawn Triangle Border */}
            <svg 
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0
              }}
              viewBox="0 0 500 400"
              fill="none"
            >
              <g>
                {/* Left side */}
                <path 
                  d="M50 350 L58 328 L62 308 L69 288 L74 268 L81 248 L86 228 L93 208 L98 188 L105 168 L112 148 L119 128 L126 108 L133 88 L140 73 L148 58 L158 50 L168 48 L178 50 L188 52 L198 48 L208 51 L218 49 L228 52 L238 48 L248 51 L250 50"
                  stroke="#000"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Bottom side */}
                <path 
                  d="M50 350 L75 352 L100 348 L125 351 L150 349 L175 352 L200 348 L225 351 L250 349 L275 351 L300 348 L325 352 L350 349 L375 351 L400 348 L425 352 L450 350"
                  stroke="#000"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Right side */}
                <path 
                  d="M450 350 L442 328 L438 308 L431 288 L426 268 L419 248 L414 228 L407 208 L402 188 L395 168 L388 148 L381 128 L374 108 L367 88 L360 73 L352 58 L342 50 L332 48 L322 50 L312 52 L302 48 L292 51 L282 49 L272 52 L262 48 L252 51 L250 50"
                  stroke="#000"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>

            {/* Bottom Left: me stuff */}
            <div style={{
              position: 'absolute',
              bottom: '70px',
              left: '100px',
              textAlign: 'center',
              pointerEvents: 'auto'
            }}>
              <button 
                style={{
                  fontFamily: '"Caveat Brush", cursive',
                  fontSize: '1.6rem',
                  color: '#000',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.color = '#555';
                  (e.target as HTMLButtonElement).style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.color = '#000';
                  (e.target as HTMLButtonElement).style.transform = 'scale(1)';
                }}
                onClick={navigateToMe}
              >
                me stuff
              </button>
            </div>

            {/* Bottom Right: job stuff */}
            <div style={{
              position: 'absolute',
              bottom: '70px',
              right: '100px',
              textAlign: 'center',
              pointerEvents: 'auto'
            }}>
              <button 
                style={{
                  fontFamily: '"Caveat Brush", cursive',
                  fontSize: '1.6rem',
                  color: '#000',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.color = '#555';
                  (e.target as HTMLButtonElement).style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.color = '#000';
                  (e.target as HTMLButtonElement).style.transform = 'scale(1)';
                }}
                onClick={navigateToJobs}
              >
                job stuff
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes jiggle {
          0% { transform: rotate(-1deg) translateX(-1px); }
          25% { transform: rotate(1deg) translateX(1px); }
          50% { transform: rotate(-1deg) translateX(-1px); }
          75% { transform: rotate(1deg) translateX(1px); }
          100% { transform: rotate(0deg) translateX(0px); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes expandFromHeader {
          from { 
            transform: translateX(-50%) scale(0.1);
            opacity: 0;
          }
          to { 
            transform: translateX(-50%) scale(1);
            opacity: 1;
          }
        }
        
        @keyframes drawTriangle {
          from {
            stroke-dashoffset: 100;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </header>
  )
}

export default Header