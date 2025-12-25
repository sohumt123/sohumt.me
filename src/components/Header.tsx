import '@fontsource/caveat-brush/index.css'

const Header = () => {
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
      <div style={{ cursor: 'pointer' }}>
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
            transition: 'color 0.3s ease-in-out'
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLHeadingElement).style.color = '#f0f0f0';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLHeadingElement).style.color = '#000';
          }}
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
            transition: 'transform 0.1s ease-in-out'
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLImageElement).style.animation = 'jiggle 0.3s ease-in-out infinite';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLImageElement).style.animation = '';
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
        `}</style>
      </div>
    </header>
  )
}

export default Header