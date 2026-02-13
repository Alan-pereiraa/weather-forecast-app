'use client';

import { ForecastData, ForecastItem } from '../types/weather';
import { getWeatherIcon } from '../services/weatherApi';
import Image from 'next/image';

interface ForecastProps {
  forecast: ForecastData;
}

export default function Forecast({ forecast }: ForecastProps) {
  const dailyForecast = getDailyForecast(forecast.list);

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="w-1 h-6 bg-linear-to-b from-blue-400 to-purple-500 rounded-full"></span>
        Previsão para os próximos dias
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {dailyForecast.map((day, index) => (
          <DayCard key={index} item={day} index={index} />
        ))}
      </div>
    </div>
  );
}

function DayCard({ item, index }: { item: ForecastItem; index: number }) {
  const date = new Date(item.dt * 1000);
  const dayName = index === 0 ? 'Amanhã' : date.toLocaleDateString('pt-BR', { weekday: 'short' });
  const dayNumber = date.getDate();
  const month = date.toLocaleDateString('pt-BR', { month: 'short' });

  return (
    <div 
      className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-xl group"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="text-center">
        <p className="text-sm font-semibold text-white/80 capitalize">{dayName}</p>
        <p className="text-xs text-white/50">{dayNumber} {month}</p>
        
        <div className="relative w-20 h-20 mx-auto my-2 group-hover:scale-110 transition-transform duration-300">
          <Image
            src={getWeatherIcon(item.weather[0].icon)}
            alt={item.weather[0].description}
            fill
            className="object-contain drop-shadow-lg"
          />
        </div>
        
        <p className="text-xs text-white/60 capitalize mb-2">{item.weather[0].description}</p>
        
        <div className="flex justify-center items-center gap-2">
          <span className="text-lg font-bold text-white">{Math.round(item.main.temp_max)}°</span>
          <span className="text-sm text-white/50">{Math.round(item.main.temp_min)}°</span>
        </div>
        
        <div className="mt-2 pt-2 border-t border-white/10">
          <div className="flex justify-between text-xs text-white/50">
            <span>💧 {item.main.humidity}%</span>
            <span>💨 {Math.round(item.wind.speed * 3.6)}km/h</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function getDailyForecast(list: ForecastItem[]): ForecastItem[] {
  const daily: { [key: string]: ForecastItem } = {};
  const today = new Date().toDateString();
  
  list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const dateStr = date.toDateString();
    
    if (dateStr === today) return;
    
    if (!daily[dateStr]) {
      daily[dateStr] = item;
    } else {
      const existingHour = new Date(daily[dateStr].dt * 1000).getHours();
      const currentHour = date.getHours();
      
      if (Math.abs(currentHour - 12) < Math.abs(existingHour - 12)) {
        daily[dateStr] = item;
      }
    }
  });
  
  return Object.values(daily).slice(0, 5);
}

export function HourlyForecast({ forecast }: ForecastProps) {
  const hourlyData = forecast.list.slice(0, 8);

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="w-1 h-6 bg-linear-to-b from-cyan-400 to-blue-500 rounded-full"></span>
        Próximas horas
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {hourlyData.map((item, index) => (
          <HourCard key={index} item={item} isNow={index === 0} />
        ))}
      </div>
    </div>
  );
}

function HourCard({ item, isNow }: { item: ForecastItem; isNow: boolean }) {
  const date = new Date(item.dt * 1000);
  const hour = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div 
      className={`shrink-0 bg-linear-to-br ${
        isNow ? 'from-blue-500/30 to-purple-500/30 border-blue-400/50' : 'from-white/10 to-white/5 border-white/10'
      } backdrop-blur-md rounded-2xl p-4 border hover:border-white/30 transition-all duration-300 hover:scale-105 min-w-25`}
    >
      <div className="text-center">
        <p className={`text-sm font-semibold ${isNow ? 'text-blue-300' : 'text-white/70'}`}>
          {isNow ? 'Agora' : hour}
        </p>
        
        <div className="relative w-14 h-14 mx-auto my-1">
          <Image
            src={getWeatherIcon(item.weather[0].icon)}
            alt={item.weather[0].description}
            fill
            className="object-contain"
          />
        </div>
        
        <p className="text-xl font-bold text-white">{Math.round(item.main.temp)}°</p>
        
        {item.pop > 0 && (
          <p className="text-xs text-blue-300 mt-1">
            💧 {Math.round(item.pop * 100)}%
          </p>
        )}
      </div>
    </div>
  );
}
