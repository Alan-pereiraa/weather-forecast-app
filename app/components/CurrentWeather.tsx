'use client';

import Image from 'next/image';
import { WeatherData } from '../types/weather';
import { getWeatherIcon, formatDate } from '../services/weatherApi';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { WiThermometer } from 'react-icons/wi';

interface CurrentWeatherProps {
  weather: WeatherData;
}

export default function CurrentWeather({ weather }: CurrentWeatherProps) {
  const iconUrl = getWeatherIcon(weather.weather[0].icon);
  const dateStr = formatDate(weather.dt, weather.timezone);

  return (
    <div className="text-center py-8 animate-fade-in">
      <div className="flex items-center justify-center gap-2 mb-2">
        <FaMapMarkerAlt className="text-red-400 text-xl animate-bounce" />
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          {weather.name}
        </h1>
        <span className="px-2 py-1 bg-white/20 rounded-md text-sm text-white/80 font-medium">
          {weather.sys.country}
        </span>
      </div>

      <p className="text-white/60 capitalize mb-6">{dateStr}</p>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
        <div className="relative w-48 h-48 md:w-56 md:h-56 animate-float">
          <div className="absolute inset-0 bg-linear-to-br from-white/20 to-transparent rounded-full blur-2xl"></div>
          <Image
            src={iconUrl}
            alt={weather.weather[0].description}
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>

        <div className="text-center md:text-left">
          <div className="flex items-start justify-center md:justify-start">
            <span className="text-8xl md:text-9xl font-extralight text-white tracking-tighter">
              {Math.round(weather.main.temp)}
            </span>
            <span className="text-4xl md:text-5xl font-light text-white/80 mt-4">°C</span>
          </div>
          
          <p className="text-xl text-white/90 capitalize font-medium mt-2">
            {weather.weather[0].description}
          </p>

          <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
            <div className="flex items-center gap-1 px-3 py-1 bg-red-500/20 rounded-full">
              <WiThermometer className="text-red-400 text-2xl" />
              <span className="text-white font-medium">{Math.round(weather.main.temp_max)}°</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1 bg-blue-500/20 rounded-full">
              <WiThermometer className="text-blue-400 text-2xl" />
              <span className="text-white font-medium">{Math.round(weather.main.temp_min)}°</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
