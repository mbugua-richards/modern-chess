import { create } from 'zustand';
import { GameState, PieceColor, Square, Piece, createInitialBoard } from '../utils/chess';
import { isValidMove } from '../utils/moveValidator';

interface Player {
  id: string;
  score: number;
}

interface GameStore {
  gameState: GameState;
  selectedPiece: Square | null;
  possibleMoves: Square[];
  capturedPieces: Piece[];
  players: Record<PieceColor, Player>;
  setSelectedPiece: (position: Square | null) => void;
  makeMove: (from: Square, to: Square) => void;
  resetGame: () => void;
  updateGameState: (newState: GameState) => void;
  updateScore: (color: PieceColor) => void;
}

const createInitialState = (): GameState => ({
  board: createInitialBoard(),
  turn: 'w',
  isCheck: false,
  isCheckmate: false,
  moveHistory: [],
});

export const useGameStore = create<GameStore>((set) => ({
  gameState: createInitialState(),
  selectedPiece: null,
  possibleMoves: [],
  capturedPieces: [],
  players: {
    w: { id: '', score: 0 },
    b: { id: '', score: 0 },
  },
  
  setSelectedPiece: (position) => {
    set((state) => {
      if (!position) return { selectedPiece: null, possibleMoves: [] };
      
      const piece = state.gameState.board[position];
      if (!piece || piece.color !== state.gameState.turn) {
        return { selectedPiece: null, possibleMoves: [] };
      }
      
      const moves = calculatePossibleMoves(position, state.gameState);
      return { selectedPiece: position, possibleMoves: moves };
    });
  },
  
  makeMove: (from, to) => {
    set((state) => {
      const piece = state.gameState.board[from];
      const targetPiece = state.gameState.board[to];
      
      if (!piece || !isValidMove(from, to, piece, state.gameState)) {
        return state;
      }
      
      const newBoard = { ...state.gameState.board };
      newBoard[to] = newBoard[from];
      newBoard[from] = null;
      
      const newCapturedPieces = [...state.capturedPieces];
      if (targetPiece) {
        newCapturedPieces.push(targetPiece);
      }

      const moveHistory = [...state.gameState.moveHistory, { from, to, piece }];
      
      return {
        gameState: {
          ...state.gameState,
          board: newBoard,
          turn: state.gameState.turn === 'w' ? 'b' : 'w',
          moveHistory,
        },
        selectedPiece: null,
        possibleMoves: [],
        capturedPieces: newCapturedPieces,
      };
    });
  },
  
  resetGame: () => {
    set({
      gameState: createInitialState(),
      selectedPiece: null,
      possibleMoves: [],
      capturedPieces: [],
      players: {
        w: { id: '', score: 0 },
        b: { id: '', score: 0 },
      },
    });
  },

  updateGameState: (newState) => {
    set((state) => ({
      ...state,
      gameState: newState,
    }));
  },

  updateScore: (color) => {
    set((state) => ({
      players: {
        ...state.players,
        [color]: {
          ...state.players[color],
          score: state.players[color].score + 1,
        },
      },
    }));
  },
}));

function calculatePossibleMoves(position: Square, gameState: GameState): Square[] {
  const piece = gameState.board[position];
  if (!piece) return [];

  const moves: Square[] = [];
  
  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const targetPos = `${String.fromCharCode(97 + file)}${rank + 1}`;
      if (isValidMove(position, targetPos, piece, gameState)) {
        moves.push(targetPos);
      }
    }
  }

  return moves;
}