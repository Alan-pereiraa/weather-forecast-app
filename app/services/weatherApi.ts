import { WeatherData, ForecastData, ForecastItem } from '../types/weather';

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY || 'YOUR_API_KEY';
const BASE_URL = 'https://api.weatherapi.com/v1';

interface WeatherAPIResponse {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime_epoch: number;
    localtime: string;
  };
  current: {
    last_updated_epoch: number;
    last_updated: string;
    temp_c: number;
    temp_f: number;
    is_day: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_mph: number;
    wind_kph: number;
    wind_degree: number;
    wind_dir: string;
    pressure_mb: number;
    pressure_in: number;
    precip_mm: number;
    precip_in: number;
    humidity: number;
    cloud: number;
    feelslike_c: number;
    feelslike_f: number;
    vis_km: number;
    vis_miles: number;
    uv: number;
    gust_mph: number;
    gust_kph: number;
  };
}

interface WeatherAPIForecastResponse extends WeatherAPIResponse {
  forecast: {
    forecastday: {
      date: string;
      date_epoch: number;
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        avgtemp_c: number;
        maxwind_kph: number;
        totalprecip_mm: number;
        avghumidity: number;
        daily_will_it_rain: number;
        daily_chance_of_rain: number;
        daily_will_it_snow: number;
        daily_chance_of_snow: number;
        condition: {
          text: string;
          icon: string;
          code: number;
        };
        uv: number;
      };
      astro: {
        sunrise: string;
        sunset: string;
        moonrise: string;
        moonset: string;
        moon_phase: string;
      };
      hour: {
        time_epoch: number;
        time: string;
        temp_c: number;
        condition: {
          text: string;
          icon: string;
          code: number;
        };
        wind_kph: number;
        wind_degree: number;
        wind_dir: string;
        pressure_mb: number;
        humidity: number;
        cloud: number;
        feelslike_c: number;
        will_it_rain: number;
        chance_of_rain: number;
        will_it_snow: number;
        chance_of_snow: number;
        vis_km: number;
        gust_kph: number;
        uv: number;
      }[];
    }[];
  };
}

function transformCurrentWeather(data: WeatherAPIForecastResponse): WeatherData {
  const sunriseTime = parseTime(data.forecast.forecastday[0].astro.sunrise);
  const sunsetTime = parseTime(data.forecast.forecastday[0].astro.sunset);
  
  return {
    coord: {
      lon: data.location.lon,
      lat: data.location.lat,
    },
    weather: [{
      id: data.current.condition.code,
      main: mapConditionToMain(data.current.condition.code),
      description: data.current.condition.text,
      icon: data.current.condition.icon,
    }],
    base: 'weatherapi',
    main: {
      temp: data.current.temp_c,
      feels_like: data.current.feelslike_c,
      temp_min: data.forecast.forecastday[0].day.mintemp_c,
      temp_max: data.forecast.forecastday[0].day.maxtemp_c,
      pressure: data.current.pressure_mb,
      humidity: data.current.humidity,
    },
    visibility: data.current.vis_km * 1000,
    wind: {
      speed: data.current.wind_kph / 3.6,
      deg: data.current.wind_degree,
      gust: data.current.gust_kph / 3.6,
    },
    clouds: {
      all: data.current.cloud,
    },
    dt: data.current.last_updated_epoch,
    sys: {
      country: data.location.country.length > 2 ? getCountryCode(data.location.country) : data.location.country,
      sunrise: sunriseTime,
      sunset: sunsetTime,
    },
    timezone: 0,
    id: 0,
    name: data.location.name,
    cod: 200,
  };
}

function transformForecast(data: WeatherAPIForecastResponse): ForecastData {
  const hourlyList: ForecastItem[] = [];

  data.forecast.forecastday.forEach(day => {
    day.hour.forEach(hour => {
      hourlyList.push({
        dt: hour.time_epoch,
        main: {
          temp: hour.temp_c,
          feels_like: hour.feelslike_c,
          temp_min: hour.temp_c,
          temp_max: hour.temp_c,
          pressure: hour.pressure_mb,
          sea_level: hour.pressure_mb,
          grnd_level: hour.pressure_mb,
          humidity: hour.humidity,
          temp_kf: 0,
        },
        weather: [{
          id: hour.condition.code,
          main: mapConditionToMain(hour.condition.code),
          description: hour.condition.text,
          icon: hour.condition.icon,
        }],
        clouds: {
          all: hour.cloud,
        },
        wind: {
          speed: hour.wind_kph / 3.6,
          deg: hour.wind_degree,
          gust: hour.gust_kph / 3.6,
        },
        visibility: hour.vis_km * 1000,
        pop: hour.chance_of_rain / 100,
        sys: {
          pod: hour.condition.icon.includes('day') ? 'd' : 'n',
        },
        dt_txt: hour.time,
      });
    });
  });

  const now = Math.floor(Date.now() / 1000);
  const futureHours = hourlyList.filter(h => h.dt >= now);

  return {
    cod: '200',
    message: 0,
    cnt: futureHours.length,
    list: futureHours,
    city: {
      id: 0,
      name: data.location.name,
      coord: {
        lat: data.location.lat,
        lon: data.location.lon,
      },
      country: data.location.country.length > 2 ? getCountryCode(data.location.country) : data.location.country,
      population: 0,
      timezone: 0,
      sunrise: parseTime(data.forecast.forecastday[0].astro.sunrise),
      sunset: parseTime(data.forecast.forecastday[0].astro.sunset),
    },
  };
}

function parseTime(timeStr: string): number {
  // Parse time like "06:45 AM" or "07:30 PM"
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return 0;
  
  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const period = match[3].toUpperCase();
  
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  
  const now = new Date();
  now.setHours(hours, minutes, 0, 0);
  return Math.floor(now.getTime() / 1000);
}

function getCountryCode(country: string): string {
  const countryCodes: { [key: string]: string } = {
    'Brazil': 'BR',
    'United States of America': 'US',
    'United Kingdom': 'GB',
    'France': 'FR',
    'Germany': 'DE',
    'Japan': 'JP',
    'China': 'CN',
    'Italy': 'IT',
    'Spain': 'ES',
    'Portugal': 'PT',
    'Argentina': 'AR',
    'Mexico': 'MX',
    'Canada': 'CA',
    'Australia': 'AU',
  };
  return countryCodes[country] || country.substring(0, 2).toUpperCase();
}

function mapConditionToMain(code: number): string {
  // WeatherAPI condition codes mapping
  if (code === 1000) return 'Clear';
  if (code >= 1003 && code <= 1009) return 'Clouds';
  if (code >= 1030 && code <= 1039) return 'Mist';
  if (code >= 1063 && code <= 1072) return 'Drizzle';
  if (code >= 1087) return 'Thunderstorm';
  if (code >= 1114 && code <= 1117) return 'Snow';
  if (code >= 1135 && code <= 1147) return 'Fog';
  if (code >= 1150 && code <= 1201) return 'Rain';
  if (code >= 1204 && code <= 1237) return 'Snow';
  if (code >= 1240 && code <= 1246) return 'Rain';
  if (code >= 1249 && code <= 1264) return 'Snow';
  if (code >= 1273 && code <= 1282) return 'Thunderstorm';
  return 'Clouds';
}

export async function getCurrentWeather(city: string): Promise<WeatherData> {
  const response = await fetch(
    `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=3&lang=pt`
  );
  
  if (!response.ok) {
    throw new Error('Cidade não encontrada');
  }
  
  const data: WeatherAPIForecastResponse = await response.json();
  return transformCurrentWeather(data);
}

export async function getForecast(city: string): Promise<ForecastData> {
  const response = await fetch(
    `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=7&lang=pt`
  );
  
  if (!response.ok) {
    throw new Error('Cidade não encontrada');
  }
  
  const data: WeatherAPIForecastResponse = await response.json();
  return transformForecast(data);
}

export async function getWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
  const response = await fetch(
    `${BASE_URL}/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=3&lang=pt`
  );
  
  if (!response.ok) {
    throw new Error('Erro ao buscar dados');
  }
  
  const data: WeatherAPIForecastResponse = await response.json();
  return transformCurrentWeather(data);
}

export async function getForecastByCoords(lat: number, lon: number): Promise<ForecastData> {
  const response = await fetch(
    `${BASE_URL}/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=7&lang=pt`
  );
  
  if (!response.ok) {
    throw new Error('Erro ao buscar dados');
  }
  
  const data: WeatherAPIForecastResponse = await response.json();
  return transformForecast(data);
}

export function getWeatherIcon(iconUrl: string): string {
  if (iconUrl.startsWith('//')) {
    return `https:${iconUrl.replace('64x64', '128x128')}`;
  }
  return iconUrl.replace('64x64', '128x128');
}

export function getWeatherBackground(weatherMain: string): string {
  const backgrounds: { [key: string]: string } = {
    Clear: 'from-yellow-400 via-orange-500 to-pink-500',
    Sunny: 'from-yellow-400 via-orange-500 to-pink-500',
    Clouds: 'from-gray-400 via-gray-500 to-gray-600',
    Cloudy: 'from-gray-400 via-gray-500 to-gray-600',
    Overcast: 'from-gray-500 via-gray-600 to-gray-700',
    Rain: 'from-blue-600 via-blue-700 to-gray-800',
    Drizzle: 'from-blue-400 via-blue-500 to-blue-600',
    Thunderstorm: 'from-purple-800 via-gray-800 to-gray-900',
    Snow: 'from-blue-100 via-blue-200 to-white',
    Mist: 'from-gray-300 via-gray-400 to-gray-500',
    Fog: 'from-gray-300 via-gray-400 to-gray-500',
    Haze: 'from-yellow-200 via-yellow-300 to-gray-400',
    default: 'from-blue-500 via-purple-500 to-pink-500'
  };
  
  return backgrounds[weatherMain] || backgrounds.default;
}

export function formatDate(timestamp: number, timezone: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export function formatTime(timestamp: number, timezone: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getWindDirection(deg: number): string {
  const directions = ['N', 'NE', 'L', 'SE', 'S', 'SO', 'O', 'NO'];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
}
