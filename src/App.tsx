import ASCIIText from './components/ASCIIText'
import Sudoku4x4 from './components/Sudoku4x4'

function App() {
  return (
    <div>
      {/* ASCII Text Section */}
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
        <ASCIIText
          text='Sohum'
          enableWaves={true}
          asciiFontSize={18}
        />
      </div>
      
      {/* Sudoku Section */}
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', padding: '40px 20px' }}>
        <Sudoku4x4 />
      </div>
    </div>
  )
}

export default App