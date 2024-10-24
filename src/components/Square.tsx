import React from 'react';
import { motion } from 'framer-motion';
import ChessPiece from './ChessPiece';
import { Piece } from '../utils/chess';

interface SquareProps {
  position: string;
  piece: Piece | null;
  color: 'light' | 'dark';
  isSelected: boolean;
  isValidMove: boolean;
  onClick: () => void;
}

const Square: React.FC<SquareProps> = ({ position, piece, color, isSelected, isValidMove, onClick }) => {
  const baseColor = color === 'light' ? 'bg-amber-100' : 'bg-amber-800';
  const selectedColor = 'ring-4 ring-blue-400';
  const validMoveColor = 'after:absolute after:inset-0 after:bg-green-400 after:bg-opacity-40';

  return (
    <motion.div
      className={`
        relative aspect-square cursor-pointer
        ${baseColor}
        ${isSelected ? selectedColor : ''}
        ${isValidMove ? validMoveColor : ''}
        transition-all duration-200
      `}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {piece && <ChessPiece piece={piece.piece} color={piece.color} />}
      {(position[1] === '1' || position[1] === '8') && (
        <span className="absolute bottom-1 right-1 text-xs opacity-50">{position[0]}</span>
      )}
      {(position[0] === 'a' || position[0] === 'h') && (
        <span className="absolute top-1 left-1 text-xs opacity-50">{position[1]}</span>
      )}
    </motion.div>
  );
};

export default Square;