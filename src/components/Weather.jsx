import React, { useState, useEffect } from 'react';
import { Cloud, Thermometer, Droplets, Wind, AlertTriangle, Sun, CloudRain, CloudSun } from 'lucide-react';

// Mock hooks for demonstration. Replace with your actual implementation.
const useAuth = () => ({
  user: {
    location: 'Hyderabad',
  },
});

const useLanguage = () => ({
  t: (key) => {
    const translations = {
      weatherForecast: 'Weather Forecast',
      updating: 'Updating...',
      refresh: 'Refresh',
      weatherAlertsTitle: 'Weather Alerts',
      monitorWeather: 'Monitor weather conditions closely for optimal farming decisions.',
      noAlerts: 'No immediate weather alerts for your area.',
      temperature: 'Temperature',
      humidity: 'Humidity',
      windSpeed: 'Wind Speed',
      rainfall: 'Rainfall',
      detailedWeather: 'Detailed Weather & Farming Recommendations',
      sevenDayForecast: '7-Day Forecast',
      farmingRecommendations: 'Farming Recommendations',
      unableToLoad: 'Unable to load weather data. Please try refreshing.',
    };
    return translations[key] || key;
  },
});

const Weather = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWeatherData();
  }, [user.location]);

  const WeatherIcon = ({ iconName, ...props }) => {
    switch (iconName?.toLowerCase()) {
      case 'sunny':
        return <Sun className="text-yellow-400" {...props} />;
      case 'cloudy':
        return <Cloud className="text-gray-400" {...props} />;
      case 'partly cloudy':
        return <CloudSun className="text-sky-400" {...props} />;
      case 'rain':
        return <CloudRain className="text-blue-400" {...props} />;
      default:
        return <Cloud className="text-gray-400" {...props} />;
    }
  };

  const fetchWeatherData = async () => {
    setLoading(true);
    setError(null);
    try {
      const mockApiResponse = {
        current_conditions: {
          temperature: 31,
          humidity: 75,
          wind_speed: 15,
          rainfall_today: 2,
          description: "Partly cloudy with a chance of afternoon showers."
        },
        weather_alerts: [
          "High humidity levels may increase the risk of fungal diseases for crops. Ensure good air circulation."
        ],
        forecast_7_day: [
          { day: "Today", max_temp: 32, min_temp: 24, condition: "Partly Cloudy" },
          { day: "Tomorrow", max_temp: 33, min_temp: 25, condition: "Sunny" },
          { day: "Sat", max_temp: 31, min_temp: 24, condition: "Rain" },
          { day: "Sun", max_temp: 30, min_temp: 23, condition: "Rain" },
          { day: "Mon", max_temp: 32, min_temp: 24, condition: "Partly Cloudy" },
          { day: "Tue", max_temp: 34, min_temp: 25, condition: "Sunny" },
          { day: "Wed", max_temp: 33, min_temp: 24, condition: "Cloudy" }
        ],
        farming_recommendations: "With scattered rain expected, avoid over-irrigation. The upcoming sunny days are ideal for pesticide application if needed. Monitor crops for pests that thrive in humid conditions."
      };
      
      await new Promise(res => setTimeout(res, 1500));
      setWeatherData(mockApiResponse);

    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError(t('unableToLoad'));
    }
    setLoading(false);
  };

  const renderLoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-gray-200 dark:bg-gray-700"></div>
        ))}
      </div>
      <div className="space-y-6">
        <div className="h-48 rounded-xl bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-32 rounded-xl bg-gray-200 dark:bg-gray-700"></div>
      </div>
    </div>
  );

  const InfoCard = ({ icon, title, value, gradient }) => (
    <div className={`p-4 rounded-xl text-white shadow-lg ${gradient}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{title}</span>
        {icon}
      </div>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Cloud className="h-8 w-8 text-blue-500 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('weatherForecast')}</h1>
            <p className="text-gray-600 dark:text-gray-300">{user.location}</p>
          </div>
        </div>
        <button
          onClick={fetchWeatherData}
          className="px-4 py-2 bg-white dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-600 transition-colors disabled:opacity-50"
          disabled={loading}
        >
          {loading ? t('updating') : t('refresh')}
        </button>
      </div>
      
      {loading ? renderLoadingSkeleton() : error ? (
        <div className="card text-center py-10 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
        </div>
      ) : weatherData && (
        <>
          {/* Weather Alerts */}
          <div className="p-4 rounded-xl bg-amber-400/20 dark:bg-amber-900/30 border border-amber-500/30">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400 mr-2 flex-shrink-0" />
              <h2 className="text-lg font-semibold text-amber-800 dark:text-amber-200">
                {t('weatherAlertsTitle')}
              </h2>
            </div>
            <div className="text-amber-700 dark:text-amber-300">
              {weatherData.weather_alerts.length > 0
                ? weatherData.weather_alerts.map((alert, i) => <p key={i}>{alert}</p>)
                : <p>{t('noAlerts')}</p>
              }
            </div>
          </div>

          {/* Current Weather */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InfoCard icon={<Thermometer size={24} />} title={t('temperature')} value={`${weatherData.current_conditions.temperature}°C`} gradient="from-red-500 to-orange-500 bg-gradient-to-br" />
            <InfoCard icon={<Droplets size={24} />} title={t('humidity')} value={`${weatherData.current_conditions.humidity}%`} gradient="from-sky-500 to-blue-500 bg-gradient-to-br" />
            <InfoCard icon={<Wind size={24} />} title={t('windSpeed')} value={`${weatherData.current_conditions.wind_speed} km/h`} gradient="from-slate-500 to-gray-500 bg-gradient-to-br" />
            <InfoCard icon={<CloudRain size={24} />} title={t('rainfall')} value={`${weatherData.current_conditions.rainfall_today} mm`} gradient="from-indigo-500 to-purple-500 bg-gradient-to-br" />
          </div>

          {/* 7-Day Forecast */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('sevenDayForecast')}
            </h2>
            <div className="overflow-x-auto pb-2">
              <div className="flex space-x-4">
                {weatherData.forecast_7_day.map((day, index) => (
                  <div key={index} className="flex-shrink-0 w-28 text-center p-3 border dark:border-gray-700 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <p className="font-bold text-gray-800 dark:text-white">{day.day}</p>
                    <WeatherIcon iconName={day.condition} className="h-10 w-10 mx-auto my-2" />
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{day.max_temp}°</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{day.min_temp}°</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Farming Recommendations */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('farmingRecommendations')}
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300">{weatherData.farming_recommendations}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Weather;
