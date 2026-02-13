'use client';

import { useState, useCallback } from 'react';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import WeatherDetails, { SunTimes } from './components/WeatherDetails';
import Forecast, { HourlyForecast } from './components/Forecast';
import { LoadingWeather, ErrorMessage, WelcomeScreen } from './components/WeatherStates';
import { WeatherData, ForecastData } from './types/weather';
import { 
  getCurrentWeather, 
  getForecast, 
  getWeatherByCoords, 
  getForecastByCoords,
  getWeatherBackground 
} from './services/weatherApi';
import { FiCloud } from 'react-icons/fi';

export default function Home() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchCity = useCallback(async (city: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [weatherData, forecastData] = await Promise.all([
        getCurrentWeather(city),
        getForecast(city)
      ]);
      
      setWeather(weatherData);
      setForecast(forecastData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar dados do clima');
      setWeather(null);
      setForecast(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchByLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Geolocalização não é suportada pelo seu navegador');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const [weatherData, forecastData] = await Promise.all([
            getWeatherByCoords(latitude, longitude),
            getForecastByCoords(latitude, longitude)
          ]);
          
          setWeather(weatherData);
          setForecast(forecastData);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Erro ao buscar dados do clima');
          setWeather(null);
          setForecast(null);
        } finally {
          setIsLoading(false);
        }
      },
      (err) => {
        setError('Não foi possível obter sua localização. Por favor, permita o acesso ou busque manualmente.');
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const backgroundGradient = weather 
    ? getWeatherBackground(weather.weather[0].main)
    : 'from-indigo-900 via-purple-900 to-pink-800';

  return (
    <main className={`min-h-screen bg-linear-to-br ${backgroundGradient} transition-all duration-1000 relative overflow-hidden`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
            <span className="flex gap-4 items-center justify-center bg-clip-text text-transparent bg-linear-to-r from-white via-blue-200 to-purple-200">
              <FiCloud  className="text-white"/>
              Weather Forecast
            </span>
          </h1>
          <p className="text-white/60">Previsão do tempo em tempo real</p>
        </header>

        <SearchBar 
          onSearch={searchCity} 
          onLocationSearch={searchByLocation}
          isLoading={isLoading} 
        />

        <div className="mt-12 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-6 md:p-8">
          {isLoading ? (
            <LoadingWeather />
          ) : error ? (
            <ErrorMessage message={error} onRetry={() => setError(null)} />
          ) : weather && forecast ? (
            <div className="space-y-8 animate-fade-in">
              <CurrentWeather weather={weather} />
              
              <SunTimes weather={weather} />
              
              <div className="mt-8">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-linear-to-b from-pink-400 to-orange-500 rounded-full"></span>
                  Detalhes do clima
                </h3>
                <WeatherDetails weather={weather} />
              </div>
              
              <HourlyForecast forecast={forecast} />
              
              <Forecast forecast={forecast} />
            </div>
          ) : (
            <WelcomeScreen />
          )}
        </div>

        <footer className="mt-8 text-center text-white/40 text-sm">
          <p>
            Dados fornecidos por{' '}
            <a 
              href="https://www.weatherapi.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors underline underline-offset-2"
            >
              WeatherAPI
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
