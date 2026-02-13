'use client';

import { WiDaySunny, WiCloud, WiRain, WiSnow, WiThunderstorm } from 'react-icons/wi';

export function LoadingWeather() {
  return (
    <div className="flex flex-col items-center justify-center min-h-100 animate-pulse">
      <div className="relative">
        <div className="flex items-center gap-4">
          <WiDaySunny className="text-6xl text-yellow-400 animate-spin-slow" />
          <WiCloud className="text-5xl text-gray-400 animate-bounce" />
          <WiRain className="text-5xl text-blue-400 animate-pulse" />
        </div>
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-2 bg-white/20 rounded-full blur-sm animate-pulse"></div>
      </div>
      <p className="mt-8 text-white/70 text-lg">Carregando previsão do tempo...</p>
      <div className="mt-4 flex gap-2">
        <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
}

export function ErrorMessage({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-75 text-center px-4">
      <div className="relative mb-6">
        <WiThunderstorm className="text-8xl text-red-400 animate-pulse" />
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-2 bg-red-500/30 rounded-full blur-sm"></div>
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">Oops!</h3>
      <p className="text-white/70 text-lg mb-6 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-linear-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg"
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
}

export function WelcomeScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-100 text-center px-4 animate-fade-in">
      <div className="relative mb-8">
        <div className="flex items-center gap-2">
          <WiDaySunny className="text-7xl text-yellow-400 animate-spin-slow" />
          <WiCloud className="text-6xl text-gray-300 animate-float" />
          <WiRain className="text-5xl text-blue-400 animate-bounce" />
          <WiSnow className="text-5xl text-blue-200 animate-pulse" />
        </div>
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
        Bem-vindo ao Weather Forecast
      </h2>
      <p className="text-white/70 text-lg max-w-md mb-6">
        Digite o nome de uma cidade ou use sua localização atual para ver a previsão do tempo
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="p-4 bg-white/10 rounded-xl backdrop-blur-md">
          <WiDaySunny className="text-4xl text-yellow-400 mx-auto mb-2" />
          <span className="text-white/60 text-sm">Ensolarado</span>
        </div>
        <div className="p-4 bg-white/10 rounded-xl backdrop-blur-md">
          <WiCloud className="text-4xl text-gray-400 mx-auto mb-2" />
          <span className="text-white/60 text-sm">Nublado</span>
        </div>
        <div className="p-4 bg-white/10 rounded-xl backdrop-blur-md">
          <WiRain className="text-4xl text-blue-400 mx-auto mb-2" />
          <span className="text-white/60 text-sm">Chuvoso</span>
        </div>
        <div className="p-4 bg-white/10 rounded-xl backdrop-blur-md">
          <WiThunderstorm className="text-4xl text-purple-400 mx-auto mb-2" />
          <span className="text-white/60 text-sm">Tempestade</span>
        </div>
      </div>
    </div>
  );
}
