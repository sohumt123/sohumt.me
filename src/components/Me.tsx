import Header from './Header'

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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white' }}>
      <Header onNavigate={navigateToPage} />
      <div style={{ 
        paddingTop: '100px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: 'calc(100vh - 100px)',
        fontFamily: '"Caveat Brush", cursive',
        fontSize: '3rem',
        color: '#333'
      }}>
        Me Stuff Page
      </div>
    </div>
  )
}

export default Me