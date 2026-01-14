import { useState } from 'react'
import ASCIIText from './components/ASCIIText'
import Sudoku4x4 from './components/Sudoku4x4'
import Hyperspeed from './components/Hyperspeed'
import Header from './components/Header'
import GlobalPixelExplosion from './components/GlobalPixelExplosion'
import Me from './components/Me'
import Jobs from './components/Jobs'

type Page = 'home' | 'me' | 'jobs'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const [showHyperspeed, setShowHyperspeed] = useState(false)

  const handleSudokuComplete = () => {
    setShowHyperspeed(true)
  }

  const handleHyperspeedClose = () => {
    setShowHyperspeed(false)
  }

  const navigateToPage = (page: Page) => {
    setCurrentPage(page)
  }

  if (currentPage === 'me') {
    return <Me onNavigate={navigateToPage} />
  }

  if (currentPage === 'jobs') {
    return <Jobs onNavigate={navigateToPage} />
  }

  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh' }}>
      <Header onNavigate={navigateToPage} />
      <GlobalPixelExplosion />
      {/* ASCII Text Section */}
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', paddingTop: '64px' }}>
        <div style={{ position: 'relative', zIndex: 2, width: '100%', height: '100%' }}>
          <ASCIIText
            text='Sohum'
            enableWaves={true}
            asciiFontSize={18}
          />
        </div>
      </div>
      
      {/* Sudoku Section */}
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', position: 'relative', paddingTop: '104px' }}>
        <Sudoku4x4 onGameComplete={handleSudokuComplete} />
      </div>

      {/* Hyperspeed Effect */}
      {showHyperspeed && (
        <div 
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100vw', 
            height: '100vh', 
            zIndex: 1,
            pointerEvents: 'auto'
          }}
        >
          <Hyperspeed 
            effectOptions={{
              speedUp: 3,
              fovSpeedUp: 180,
              distortion: 'turbulentDistortion'
            }}
          />
          {/* Close button overlay */}
          <div 
            style={{ 
              position: 'absolute', 
              bottom: '20px', 
              right: '20px', 
              zIndex: 10,
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontFamily: 'Arial, sans-serif'
            }}
            onClick={handleHyperspeedClose}
          >
            × Close
          </div>
        </div>
      )}
    </div>
  )
}

export default App