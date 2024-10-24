import React from 'react';
import { motion } from 'framer-motion';
import Square from './Square';
import { useGameStore } from '../store/gameStore';
import { getSquareColor } from '../utils/chess';

const ChessBoard: React.FC = () => {
  const { gameState, selectedPiece, possibleMoves, setSelectedPiece, makeMove } = useGameStore();
  const board = gameState.board;

  const handleSquareClick = (position: string) => {
    if (selectedPiece) {
      if (possibleMoves.includes(position)) {
        makeMove(selectedPiece, position);
      } else {
        setSelectedPiece(null);
      }
    } else if (board[position]?.color === gameState.turn) {
      setSelectedPiece(position);
    }
  };

  return (
    <motion.div 
      className="aspect-square bg-gray-700 rounded-lg p-4 shadow-2xl"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-8 gap-1 h-full">
        {Array.from({ length: 64 }, (_, i) => {
          const file = String.fromCharCode(97 + (i % 8));
          const rank = 8 - Math.floor(i / 8);
          const position = `${file}${rank}`;
          const piece = board[position];
          
          return (
            <Square
              key={position}
              position={position}
              piece={piece}
              color={getSquareColor(position)}
              isSelected={position === selectedPiece}
              isValidMove={possibleMoves.includes(position)}
              onClick={() => handleSquareClick(position)}
            />
          );
        })}
      </div>
    </motion.div>
  );
};

export default ChessBoard;