import { useState, useEffect, useCallback, useMemo } from 'react';
import { generateDailyPuzzle, checkWin, isValidMove, type Grid } from '../utils/sudoku4x4';

interface Sudoku4x4Props {
  onGameComplete?: () => void;
}

export default function Sudoku4x4({ onGameComplete }: Sudoku4x4Props) {
  // Generate puzzle once on component mount
  const { puzzle: initialPuzzle } = useMemo(() => 
    generateDailyPuzzle('medium'), []
  );

  const initialCells = useMemo(() => {
    const initial: boolean[][] = Array(4).fill(null).map(() => Array(4).fill(false));
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        initial[r][c] = initialPuzzle[r][c] !== null;
      }
    }
    return initial;
  }, [initialPuzzle]);

  const [grid, setGrid] = useState<Grid>(initialPuzzle);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [invalidMove, setInvalidMove] = useState<{ row: number; col: number } | null>(null);

  const handleCellClick = (row: number, col: number) => {
    if (initialCells[row][col] || isComplete) return;
    setSelectedCell({ row, col });
    setInvalidMove(null);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!selectedCell || isComplete) return;
    
    const { row, col } = selectedCell;
    if (initialCells[row]?.[col]) return;

    if (e.key >= '1' && e.key <= '4') {
      const num = parseInt(e.key);
      if (isValidMove(grid, row, col, num)) {
        const newGrid = grid.map((gridRow, r) => 
          gridRow.map((cell, c) => (r === row && c === col) ? num : cell)
        );
        setGrid(newGrid);
        const gameWon = checkWin(newGrid);
        setIsComplete(gameWon);
        if (gameWon && onGameComplete) {
          onGameComplete();
        }
        setInvalidMove(null);
      } else {
        setInvalidMove({ row, col });
        setTimeout(() => setInvalidMove(null), 1000);
      }
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      const newGrid = grid.map((gridRow, r) => 
        gridRow.map((cell, c) => (r === row && c === col) ? null : cell)
      );
      setGrid(newGrid);
      setIsComplete(false);
      setInvalidMove(null);
    }
  }, [selectedCell, grid, initialCells, isComplete, onGameComplete]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const getCellStyle = (row: number, col: number) => {
    const isSelected = selectedCell?.row === row && selectedCell?.col === col;
    const isPrefilled = initialCells[row]?.[col];
    const isInvalid = invalidMove?.row === row && invalidMove?.col === col;
    const isCompleteGrid = isComplete;
    
    let backgroundColor = '#ffffff';
    if (isPrefilled) backgroundColor = '#ffffff';
    else if (isInvalid) backgroundColor = '#ffebee';
    else if (isSelected) backgroundColor = '#fff3cd';
    else if (isCompleteGrid) backgroundColor = '#fce4ec';
    
    return {
      width: '40px',
      height: '40px',
      border: '1px solid #000000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      fontWeight: '700',
      fontFamily: "'Arial', sans-serif",
      cursor: isPrefilled || isComplete ? 'default' : 'pointer',
      backgroundColor,
      borderTop: row === 2 ? '3px solid #000000' : '1px solid #000000',
      borderLeft: col === 2 ? '3px solid #000000' : '1px solid #000000',
      borderRight: col === 3 ? '3px solid #000000' : '1px solid #000000',
      borderBottom: row === 3 ? '3px solid #000000' : '1px solid #000000',
      color: '#000000'
    };
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Monsieur+La+Doulaise&display=swap');
      `}</style>
      <h2 style={{ 
        fontSize: '48px', 
        fontWeight: '400', 
        marginBottom: '40px', 
        color: '#1e293b',
        fontFamily: "'Monsieur La Doulaise', cursive",
        letterSpacing: '0.02em'
      }}>
        Daily seed-generated puzzle
      </h2>
      
      {isComplete && (
        <div style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          color: '#059669', 
          marginBottom: '24px',
          fontFamily: "'Inter', 'SF Pro Display', -apple-system, system-ui, sans-serif"
        }}>
        </div>
      )}
      
      <div style={{ 
        display: 'inline-block', 
        border: '3px solid #000000',
        backgroundColor: '#ffffff',
        position: 'relative',
        zIndex: 3
      }}>
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex' }}>
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                style={getCellStyle(rowIndex, colIndex)}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {cell || ''}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}