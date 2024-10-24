import React from 'react';
import ChessBoard from './components/ChessBoard';
import GameInfo from './components/GameInfo';
import { useMultiplayer } from './hooks/useMultiplayer';

function App() {
  const { gameId } = useMultiplayer();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-8">
      <div className="max-w-6xl w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">Chess Royal</h1>
          <div className="bg-gray-800 px-4 py-2 rounded-lg">
            <p className="text-white text-sm">Game ID: <span className="font-mono">{gameId}</span></p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ChessBoard />
          </div>
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <GameInfo />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;