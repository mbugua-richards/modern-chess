import { useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useGameStore } from '../store/gameStore';
import { nanoid } from 'nanoid';

const WEBSOCKET_URL = 'wss://chess-websocket.stackblitz.io';
const STORAGE_KEY = 'chess_game_state';

export const useMultiplayer = (gameId: string = nanoid()) => {
  const { gameState, updateGameState, makeMove } = useGameStore();
  
  // Initialize socket connection
  const initializeSocket = useCallback(() => {
    const socket: Socket = io(WEBSOCKET_URL, {
      query: { gameId },
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Connected to game server');
    });

    socket.on('move', ({ from, to }) => {
      makeMove(from, to);
    });

    socket.on('game_state', (newState) => {
      updateGameState(newState);
    });

    return socket;
  }, [gameId, makeMove, updateGameState]);

  // Load saved game state
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        updateGameState(parsedState);
      } catch (error) {
        console.error('Error loading saved game state:', error);
      }
    }
  }, [updateGameState]);

  // Save game state when it changes
  useEffect(() => {
    if (!gameState.isCheckmate) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [gameState]);

  // Initialize WebSocket connection
  useEffect(() => {
    const socket = initializeSocket();
    return () => {
      socket.disconnect();
    };
  }, [initializeSocket]);

  return {
    gameId,
  };
};