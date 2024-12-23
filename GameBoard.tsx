// GameBoard.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const SIZE = 4; // Размер игрового поля

const GameBoard = () => {
  const [board, setBoard] = useState(createNewBoard());

  useEffect(() => {
    const handleKeyPress = (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          move('left');
          break;
        case 'ArrowRight':
          move('right');
          break;
        case 'ArrowUp':
          move('up');
          break;
        case 'ArrowDown':
          move('down');
          break;
        default:
          break;
      }
    };

    // Подписка на события клавиатуры
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      // Убираем подписку
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [board]);

  function createNewBoard() {
    const newBoard = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
    placeRandomTile(newBoard);
    placeRandomTile(newBoard);
    return newBoard;
  }

  function placeRandomTile(board) {
    let emptyTiles = [];
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (board[i][j] === 0) {
          emptyTiles.push({ x: i, y: j });
        }
      }
    }
    const { x, y } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    board[x][y] = Math.random() < 0.9 ? 2 : 4;
  }

  function move(direction) {
    let newBoard = [...board];
    // Логика движения плиток в зависимости от направления
    if (direction === 'left') {
      // Реализуйте логику для движения влево
    } else if (direction === 'right') {
      // Реализуйте логику для движения вправо
    } else if (direction === 'up') {
      // Реализуйте логику для движения вверх
    } else if (direction === 'down') {
      // Реализуйте логику для движения вниз
    }
    setBoard(newBoard);
    placeRandomTile(newBoard); // Добавьте новую плитку
  }

  return (
    <View style={styles.board}>
      {board.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((tile, tileIndex) => (
            <View key={tileIndex} style={styles.tile}>
              <Text style={styles.tileText}>{tile !== 0 ? tile : ''}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  tile: {
    width: 80,
    height: 80,
    margin: 5,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  tileText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default GameBoard;