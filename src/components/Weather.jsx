import React, { useState, useEffect } from 'react';
import { Cloud, Thermometer, Droplets, Wind, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Weather = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    try {
      const response = await fetch('https://builder.empromptu.ai/api_tools/rapid_research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 78c603dd15a83e48927e7dc52b2a8a6c',
          'X-Generated-App-ID': 'fb966449-837b-4a1b-b874-1afcdcab3e35',
          'X-Usage-Key': 'bea07626d89ebd2a9ab76e0ada0b62ad'
        },
        body: JSON.stringify({
          created_object_name: 'detailed_weather',
          goal: `Get detailed weather information for ${user.location}, India including current conditions, 7-day forecast, rainfall predictions, temperature trends, humidity levels, wind patterns, and specific farming recommendations based on weather conditions`
        })
      });

      const data = await response.json();
      if (data.value) {
        setWeatherData(data.value);
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Cloud className="h-8 w-8 text-blue-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('weatherForecast')}</h1>
            <p className="text-gray-600 dark:text-gray-300">{user.location}</p>
          </div>
        </div>
        <button
          onClick={fetchWeatherData}
          className="btn-secondary"
          disabled={loading}
        >
          {loading ? t('updating') : t('refresh')}
        </button>
      </div>

      {/* Weather Alerts */}
      <div className="card bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
        <div className="flex items-center mb-3">
          <AlertTriangle className="h-6 w-6 text-yellow-600 mr-2" />
          <h2 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
            {t('weatherAlertsTitle')}
          </h2>
        </div>
        <p className="text-yellow-700 dark:text-yellow-300">
          {t('monitorWeather')}
        </p>
      </div>

      {/* Current Weather */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="card text-center">
          <Thermometer className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('temperature')}</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">28°C</p>
        </div>
        <div className="card text-center">
          <Droplets className="h-8 w-8 text-blue-500 mx-auto mb-2" />
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('humidity')}</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">65%</p>
        </div>
        <div className="card text-center">
          <Wind className="h-8 w-8 text-gray-500 mx-auto mb-2" />
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('windSpeed')}</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">12 km/h</p>
        </div>
        <div className="card text-center">
          <Cloud className="h-8 w-8 text-gray-500 mx-auto mb-2" />
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('rainfall')}</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">5mm</p>
        </div>
      </div>

      {/* Detailed Weather Information */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('detailedWeather')}
        </h2>
        {loading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ) : weatherData ? (
          <div className="prose dark:prose-invert max-w-none">
            <div className="whitespace-pre-line text-gray-700 dark:text-gray-300">
              {weatherData}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            {t('unableToLoad')}
          </p>
        )}
      </div>
    </div>
  );
};

export default Weather;
