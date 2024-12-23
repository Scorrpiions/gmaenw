import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const Game = () => {

   const createEmptyBoard = () => {
    const board: number[][] = [];
    for (let i = 0; i < 4; i++) {
      const row = [0, 0, 0, 0];
      board.push(row);
    }
    return board;
  };

  const [board, setBoard] = useState<number[][]>(createEmptyBoard());
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(
    parseInt(localStorage.getItem('highScore') || '0')
  );

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('highScore', score.toString());
    }
  }, [score]);

 

  const generateRandomTile = () => {
    const emptyTiles: { x: number; y: number }[] = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) emptyTiles.push({ x: i, y: j });
      }
    }

    if (emptyTiles.length === 0) return;

    const randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    const newBoard = [...board];
    newBoard[randomTile.x][randomTile.y] = Math.random() < 0.9 ? 2 : 4;

    setBoard(newBoard);
  };

  const resetGame = () => {
    setBoard(createEmptyBoard());
    setScore(0);
  };

  // Function to move and combine tiles in a specific direction
  const slideAndCombine = (direction: string) => {
    let newBoard = [...board];
    let moved = false;
    let newScore = score;

    switch (direction) {
      case 'up':
        for (let col = 0; col < 4; col++) {
          let column = newBoard.map(row => row[col]);
          const { movedColumn, scoreGained } = slideColumn(column);
          newBoard = newBoard.map((row, i) => {
            row[col] = movedColumn[i];
            return row;
          });
          newScore += scoreGained;
        }
        break;
      case 'down':
        for (let col = 0; col < 4; col++) {
          let column = newBoard.map(row => row[col]);
          column.reverse();
          const { movedColumn, scoreGained } = slideColumn(column);
          newBoard = newBoard.map((row, i) => {
            row[col] = movedColumn[3 - i]; // Reverse back the column
            return row;
          });
          newScore += scoreGained;
        }
        break;
      case 'left':
        for (let row = 0; row < 4; row++) {
          const { movedRow, scoreGained } = slideRow(newBoard[row]);
          newBoard[row] = movedRow;
          newScore += scoreGained;
        }
        break;
      case 'right':
        for (let row = 0; row < 4; row++) {
          newBoard[row].reverse();
          const { movedRow, scoreGained } = slideRow(newBoard[row]);
          newBoard[row] = movedRow.reverse();
          newScore += scoreGained;
        }
        break;
      default:
        break;
    }

    if (moved) {
      setBoard(newBoard);
      setScore(newScore);
      generateRandomTile();
    }
  };

  // Helper function to slide and combine a row
  const slideRow = (row: number[]) => {
    let newRow = row.filter(val => val !== 0);
    let scoreGained = 0;

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] = newRow[i] * 2;
        scoreGained += newRow[i];
        newRow[i + 1] = 0;
        i++; // Skip the next tile since it was merged
      }
    }

    newRow = newRow.filter(val => val !== 0);
    while (newRow.length < 4) newRow.push(0); // Fill empty spaces

    return { movedRow: newRow, scoreGained };
  };

  // Helper function to slide and combine a column
  const slideColumn = (column: number[]) => {
    let newColumn = column.filter(val => val !== 0);
    let scoreGained = 0;

    for (let i = 0; i < newColumn.length - 1; i++) {
      if (newColumn[i] === newColumn[i + 1]) {
        newColumn[i] = newColumn[i] * 2;
        scoreGained += newColumn[i];
        newColumn[i + 1] = 0;
        i++; // Skip the next tile since it was merged
      }
    }

    newColumn = newColumn.filter(val => val !== 0);
    while (newColumn.length < 4) newColumn.push(0); // Fill empty spaces

    return { movedColumn: newColumn, scoreGained };
  };

  const renderTile = (value: number) => {
    return value !== 0 ? (
      <View style={styles.tile}>
        <Text style={styles.tileText}>{value}</Text>
      </View>
    ) : (
      <View style={styles.emptyTile}></View>
    );
  };

  const handleSwipe = (direction: string) => {
    slideAndCombine(direction);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>2048</Text>
      <Text style={styles.highScore}>High Score: {highScore}</Text>
      <Text style={styles.score}>Score: {score}</Text>

      <View style={styles.board}>
        {board.map((row, rowIndex) => (
          <View style={styles.row} key={rowIndex}>
            {row.map((tile, colIndex) => (
              <View style={styles.cell} key={colIndex}>
                {renderTile(tile)}
              </View>
            ))}
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={generateRandomTile}>
        <Text style={styles.buttonText}>Generate Tile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={resetGame}>
        <Text style={styles.buttonText}>Reset Game</Text>
      </TouchableOpacity>

      <View style={styles.swipeControls}>
        <TouchableOpacity onPress={() => handleSwipe('up')}>
          <Text style={styles.buttonText}>↑</Text>
        </TouchableOpacity>
        <View style={styles.row}>
          <TouchableOpacity onPress={() => handleSwipe('left')}>
            <Text style={styles.buttonText}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSwipe('right')}>
            <Text style={styles.buttonText}>→</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => handleSwipe('down')}>
          <Text style={styles.buttonText}>↓</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  highScore: {
    fontSize: 18,
    marginBottom: 10,
  },
  score: {
    fontSize: 18,
    marginBottom: 20,
  },
  board: {
    width: 320,
    height: 320,
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cell: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#eee4da',
  },
  tile: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee4da',
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  tileText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  emptyTile: {
    backgroundColor: 'transparent',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  swipeControls: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Game;
