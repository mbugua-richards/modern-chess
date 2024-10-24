import { Piece, PieceType, Square, GameState } from './chess';

export function isValidMove(
  from: Square,
  to: Square,
  piece: Piece,
  gameState: GameState
): boolean {
  const [fromFile, fromRank] = [from.charCodeAt(0) - 97, parseInt(from[1]) - 1];
  const [toFile, toRank] = [to.charCodeAt(0) - 97, parseInt(to[1]) - 1];
  const dx = toFile - fromFile;
  const dy = toRank - fromRank;
  const targetPiece = gameState.board[to];

  if (targetPiece?.color === piece.color) return false;

  switch (piece.piece) {
    case 'p':
      return validatePawnMove(fromRank, toRank, dx, dy, piece.color, !!targetPiece);
    case 'n':
      return validateKnightMove(dx, dy);
    case 'b':
      return validateBishopMove(dx, dy, from, to, gameState);
    case 'r':
      return validateRookMove(dx, dy, from, to, gameState);
    case 'q':
      return validateQueenMove(dx, dy, from, to, gameState);
    case 'k':
      return validateKingMove(dx, dy);
    default:
      return false;
  }
}

function validatePawnMove(
  fromRank: number,
  toRank: number,
  dx: number,
  dy: number,
  color: 'w' | 'b',
  hasTarget: boolean
): boolean {
  const direction = color === 'w' ? 1 : -1;
  const startRank = color === 'w' ? 1 : 6;

  if (hasTarget) {
    return dx === 1 && dy === direction;
  }

  if (fromRank === startRank) {
    return dx === 0 && (dy === direction || dy === direction * 2);
  }

  return dx === 0 && dy === direction;
}

function validateKnightMove(dx: number, dy: number): boolean {
  return (Math.abs(dx) === 2 && Math.abs(dy) === 1) ||
         (Math.abs(dx) === 1 && Math.abs(dy) === 2);
}

function validateBishopMove(
  dx: number,
  dy: number,
  from: Square,
  to: Square,
  gameState: GameState
): boolean {
  if (Math.abs(dx) !== Math.abs(dy)) return false;
  return !isPathBlocked(from, to, gameState);
}

function validateRookMove(
  dx: number,
  dy: number,
  from: Square,
  to: Square,
  gameState: GameState
): boolean {
  if (dx !== 0 && dy !== 0) return false;
  return !isPathBlocked(from, to, gameState);
}

function validateQueenMove(
  dx: number,
  dy: number,
  from: Square,
  to: Square,
  gameState: GameState
): boolean {
  if (dx !== 0 && dy !== 0 && Math.abs(dx) !== Math.abs(dy)) return false;
  return !isPathBlocked(from, to, gameState);
}

function validateKingMove(dx: number, dy: number): boolean {
  return Math.abs(dx) <= 1 && Math.abs(dy) <= 1;
}

function isPathBlocked(from: Square, to: Square, gameState: GameState): boolean {
  const [fromFile, fromRank] = [from.charCodeAt(0) - 97, parseInt(from[1]) - 1];
  const [toFile, toRank] = [to.charCodeAt(0) - 97, parseInt(to[1]) - 1];
  
  const dx = Math.sign(toFile - fromFile);
  const dy = Math.sign(toRank - fromRank);
  
  let currentFile = fromFile + dx;
  let currentRank = fromRank + dy;
  
  while (currentFile !== toFile || currentRank !== toRank) {
    const square = `${String.fromCharCode(97 + currentFile)}${currentRank + 1}`;
    if (gameState.board[square]) return true;
    
    currentFile += dx;
    currentRank += dy;
  }
  
  return false;
}