'use client';

import { WiHumidity, WiStrongWind, WiBarometer, WiSunrise, WiSunset, WiThermometer, WiCloudy } from 'react-icons/wi';
import { FaEye, FaLocationArrow } from 'react-icons/fa';
import { WeatherData } from '../types/weather';
import { formatTime, getWindDirection } from '../services/weatherApi';

interface WeatherDetailsProps {
  weather: WeatherData;
}

export default function WeatherDetails({ weather }: WeatherDetailsProps) {
  const details = [
    {
      icon: <WiThermometer className="text-4xl text-orange-400" />,
      label: 'Sensação',
      value: `${Math.round(weather.main.feels_like)}°`,
      bgColor: 'from-orange-500/20 to-red-500/20'
    },
    {
      icon: <WiHumidity className="text-4xl text-blue-400" />,
      label: 'Umidade',
      value: `${weather.main.humidity}%`,
      bgColor: 'from-blue-500/20 to-cyan-500/20'
    },
    {
      icon: <WiStrongWind className="text-4xl text-teal-400" />,
      label: 'Vento',
      value: `${Math.round(weather.wind.speed * 3.6)} km/h`,
      subValue: getWindDirection(weather.wind.deg),
      bgColor: 'from-teal-500/20 to-green-500/20'
    },
    {
      icon: <WiBarometer className="text-4xl text-purple-400" />,
      label: 'Pressão',
      value: `${weather.main.pressure} hPa`,
      bgColor: 'from-purple-500/20 to-pink-500/20'
    },
    {
      icon: <FaEye className="text-3xl text-indigo-400" />,
      label: 'Visibilidade',
      value: `${(weather.visibility / 1000).toFixed(1)} km`,
      bgColor: 'from-indigo-500/20 to-blue-500/20'
    },
    {
      icon: <WiCloudy className="text-4xl text-gray-400" />,
      label: 'Nuvens',
      value: `${weather.clouds.all}%`,
      bgColor: 'from-gray-500/20 to-slate-500/20'
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {details.map((detail, index) => (
        <div
          key={index}
          className={`bg-linear-to-br ${detail.bgColor} backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-lg`}
        >
          <div className="flex flex-col items-center text-center space-y-2">
            {detail.icon}
            <span className="text-xs text-white/70 uppercase tracking-wider">{detail.label}</span>
            <span className="text-xl font-bold text-white">{detail.value}</span>
            {detail.subValue && (
              <span className="text-xs text-white/60 flex items-center gap-1">
                <FaLocationArrow className="text-xs" />
                {detail.subValue}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function SunTimes({ weather }: WeatherDetailsProps) {
  return (
    <div className="flex justify-center gap-8 mt-6">
      <div className="flex items-center gap-3 bg-linear-to-r from-yellow-500/20 to-orange-500/20 px-6 py-3 rounded-full backdrop-blur-md border border-white/10">
        <WiSunrise className="text-4xl text-yellow-400" />
        <div className="text-left">
          <span className="text-xs text-white/60 block">Nascer do Sol</span>
          <span className="text-lg font-semibold text-white">
            {formatTime(weather.sys.sunrise, weather.timezone)}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3 bg-linear-to-r from-orange-500/20 to-red-500/20 px-6 py-3 rounded-full backdrop-blur-md border border-white/10">
        <WiSunset className="text-4xl text-orange-400" />
        <div className="text-left">
          <span className="text-xs text-white/60 block">Pôr do Sol</span>
          <span className="text-lg font-semibold text-white">
            {formatTime(weather.sys.sunset, weather.timezone)}
          </span>
        </div>
      </div>
    </div>
  );
}
