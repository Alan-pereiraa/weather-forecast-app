'use client';

import { useState, FormEvent } from 'react';
import { FaSearch, FaMapMarkerAlt, FaSpinner } from 'react-icons/fa';
import { MdMyLocation } from 'react-icons/md';

interface SearchBarProps {
  onSearch: (city: string) => void;
  onLocationSearch: () => void;
  isLoading: boolean;
}

export default function SearchBar({ onSearch, onLocationSearch, isLoading }: SearchBarProps) {
  const [city, setCity] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
    }
  };

  const popularCities = [
    'São Paulo',
    'Rio de Janeiro',
    'New York',
    'London',
    'Tokyo',
    'Paris'
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-4 text-white/50">
            <FaMapMarkerAlt className="text-xl" />
          </div>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Buscar cidade..."
            className="w-full py-4 pl-12 pr-32 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300 text-lg"
            disabled={isLoading}
          />
          <div className="absolute right-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onLocationSearch}
              className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all duration-300 hover:scale-105 disabled:opacity-50"
              disabled={isLoading}
              title="Usar minha localização"
            >
              <MdMyLocation className="text-xl" />
            </button>
            <button
              type="submit"
              className="p-3 rounded-xl bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <FaSpinner className="text-xl animate-spin" />
              ) : (
                <FaSearch className="text-xl" />
              )}
            </button>
          </div>
        </div>
      </form>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {popularCities.map((popularCity) => (
          <button
            key={popularCity}
            onClick={() => onSearch(popularCity)}
            className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-sm transition-all duration-300 hover:scale-105 border border-white/10 hover:border-white/30"
            disabled={isLoading}
          >
            {popularCity}
          </button>
        ))}
      </div>
    </div>
  );
}
