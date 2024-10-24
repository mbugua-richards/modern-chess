import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Cross, Church, Castle } from 'lucide-react';

interface ChessPieceProps {
  piece: string;
  color: 'w' | 'b';
}

const ChessPiece: React.FC<ChessPieceProps> = ({ piece, color }) => {
  const getIcon = () => {
    const iconProps = {
      className: `w-8 h-8 ${color === 'w' ? 'text-white stroke-2' : 'text-black stroke-2'}`,
    };

    switch (piece.toLowerCase()) {
      case 'k': return <Crown {...iconProps} />;
      case 'q': return <Cross {...iconProps} />;
      case 'b': return <Church {...iconProps} />;
      case 'n': return (
        <span className={`text-3xl ${color === 'w' ? 'text-white' : 'text-black'}`}>♞</span>
      );
      case 'r': return <Castle {...iconProps} />;
      case 'p': return (
        <span className={`text-3xl ${color === 'w' ? 'text-white' : 'text-black'}`}>♟</span>
      );
      default: return null;
    }
  };

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {getIcon()}
    </motion.div>
  );
};

export default ChessPiece;