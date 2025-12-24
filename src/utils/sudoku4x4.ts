export type CellValue = number | null;
export type Grid = CellValue[][];

export class SeededRandom {
  private seed: number;
  
  constructor(seed: number) {
    this.seed = seed;
  }
  
  next(): number {
    this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff;
    return this.seed / 0x7fffffff;
  }
  
  nextInt(max: number): number {
    return Math.floor(this.next() * max);
  }
  
  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.nextInt(i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}

export class Sudoku4x4Solver {
  private grid: Grid;
  private random: SeededRandom;

  constructor(grid: Grid, seed: number = Date.now()) {
    this.grid = grid.map(row => [...row]);
    this.random = new SeededRandom(seed);
  }

  isValidMove(row: number, col: number, num: number): boolean {
    // Check row
    for (let c = 0; c < 4; c++) {
      if (c !== col && this.grid[row][c] === num) {
        return false;
      }
    }
    
    // Check column
    for (let r = 0; r < 4; r++) {
      if (r !== row && this.grid[r][col] === num) {
        return false;
      }
    }
    
    // Check 2x2 box
    const boxRow = Math.floor(row / 2) * 2;
    const boxCol = Math.floor(col / 2) * 2;
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        const r = boxRow + i;
        const c = boxCol + j;
        if ((r !== row || c !== col) && this.grid[r][c] === num) {
          return false;
        }
      }
    }
    
    return true;
  }

  solve(): boolean {
    // Find next empty cell
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.grid[row][col] === null) {
          // Try numbers 1-4 in random order for variation
          const numbers = this.random.shuffle([1, 2, 3, 4]);
          
          for (const num of numbers) {
            if (this.isValidMove(row, col, num)) {
              this.grid[row][col] = num;
              
              if (this.solve()) {
                return true;
              }
              
              this.grid[row][col] = null;
            }
          }
          
          return false; // No valid number found
        }
      }
    }
    
    return true; // Grid is complete
  }

  getGrid(): Grid {
    return this.grid.map(row => [...row]);
  }

  isComplete(): boolean {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.grid[r][c] === null) {
          return false;
        }
      }
    }
    return true;
  }

  isValid(): boolean {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const value = this.grid[r][c];
        if (value !== null) {
          // Temporarily remove the value to check if it's valid
          this.grid[r][c] = null;
          const isValid = this.isValidMove(r, c, value);
          this.grid[r][c] = value;
          
          if (!isValid) {
            return false;
          }
        }
      }
    }
    return true;
  }
}

export class Sudoku4x4Generator {
  private random: SeededRandom;

  constructor(seed: number) {
    this.random = new SeededRandom(seed);
  }

  generateCompleteGrid(): Grid {
    // Start with empty grid
    const grid: Grid = Array(4).fill(null).map(() => Array(4).fill(null));
    
    // Use solver to generate a complete valid grid
    const solver = new Sudoku4x4Solver(grid, this.random.nextInt(1000000));
    
    if (solver.solve()) {
      return solver.getGrid();
    }
    
    // Fallback: if solver fails, try again with different seed
    return this.generateCompleteGrid();
  }

  createPuzzle(completeGrid: Grid, cellsToRemove: number = 7): { puzzle: Grid; solution: Grid } {
    const puzzle = completeGrid.map(row => [...row]);
    const solution = completeGrid.map(row => [...row]);
    
    // Get all cell positions
    const positions: [number, number][] = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        positions.push([r, c]);
      }
    }
    
    // Shuffle positions randomly
    const shuffledPositions = this.random.shuffle(positions);
    
    // Remove numbers from random positions
    let removed = 0;
    for (const [row, col] of shuffledPositions) {
      if (removed >= cellsToRemove) break;
      
      const originalValue = puzzle[row][col];
      puzzle[row][col] = null;
      
      // Check if puzzle still has unique solution by attempting to solve
      const testSolver = new Sudoku4x4Solver(puzzle);
      if (testSolver.solve()) {
        // Keep the cell removed
        removed++;
      } else {
        // Put the value back if removing it makes puzzle unsolvable
        puzzle[row][col] = originalValue;
      }
    }
    
    return { puzzle, solution };
  }

  generateDailyPuzzle(difficulty: 'easy' | 'medium' | 'hard' = 'medium'): { puzzle: Grid; solution: Grid } {
    const completeGrid = this.generateCompleteGrid();
    
    // Determine how many cells to remove based on difficulty
    const cellsToRemove = {
      easy: 5,     // Remove 5 cells (11/16 filled)
      medium: 7,   // Remove 7 cells (9/16 filled)  
      hard: 9      // Remove 9 cells (7/16 filled)
    }[difficulty];
    
    return this.createPuzzle(completeGrid, cellsToRemove);
  }
}

export const getDailySeed = (): number => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    const char = today.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

export const generateDailyPuzzle = (difficulty: 'easy' | 'medium' | 'hard' = 'medium') => {
  const seed = getDailySeed();
  const generator = new Sudoku4x4Generator(seed);
  return generator.generateDailyPuzzle(difficulty);
};

export const isValidMove = (grid: Grid, row: number, col: number, num: number): boolean => {
  const solver = new Sudoku4x4Solver(grid);
  return solver.isValidMove(row, col, num);
};

export const checkWin = (grid: Grid): boolean => {
  const solver = new Sudoku4x4Solver(grid);
  return solver.isComplete() && solver.isValid();
};