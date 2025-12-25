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
    if (isPrefilled) backgroundColor = '#f8fafc';
    else if (isInvalid) backgroundColor = '#fee2e2';
    else if (isSelected) backgroundColor = '#e0f2fe';
    else if (isCompleteGrid) backgroundColor = '#ecfdf5';
    
    return {
      width: '60px',
      height: '60px',
      border: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      fontWeight: '600',
      fontFamily: "'Inter', 'SF Pro Display', -apple-system, system-ui, sans-serif",
      cursor: isPrefilled || isComplete ? 'default' : 'pointer',
      backgroundColor,
      borderTop: row === 2 ? '2px solid #334155' : '1px solid #e2e8f0',
      borderLeft: col === 2 ? '2px solid #334155' : '1px solid #e2e8f0',
      borderRight: col === 3 ? '2px solid #334155' : '1px solid #e2e8f0',
      borderBottom: row === 3 ? '2px solid #334155' : '1px solid #e2e8f0',
      transition: 'all 0.2s ease',
      color: isPrefilled ? '#64748b' : '#0f172a'
    };
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2 style={{ 
        fontSize: '32px', 
        fontWeight: '700', 
        marginBottom: '40px', 
        color: '#1e293b',
        fontFamily: "'Inter', 'SF Pro Display', -apple-system, system-ui, sans-serif",
        letterSpacing: '-0.025em'
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
        border: '2px solid #334155',
        borderRadius: '8px',
        backgroundColor: '#ffffff',
        padding: '8px',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
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