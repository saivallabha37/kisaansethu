import React, { useState, useEffect } from 'react';
import { Sprout, Cloud, TrendingUp, AlertTriangle, BookOpen, MessageCircle, Languages } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Profile from './Profile';

const Dashboard = () => {
  const { user } = useAuth();
  const { t, toggleLanguage, language } = useLanguage();
  const [weatherData, setWeatherData] = useState(null);
  const [marketData, setMarketData] = useState(null);

  useEffect(() => {
    if (user?.isProfileComplete) {
      fetchWeatherData();
      fetchMarketData();
    }
  }, [user]);

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
          created_object_name: 'weather_data',
          goal: `Get current weather conditions and 3-day forecast for ${user.location}, India including temperature, humidity, rainfall prediction, and farming recommendations`
        })
      });
      
      const data = await response.json();
      if (data.value) {
        setWeatherData(data.value);
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const fetchMarketData = async () => {
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
          created_object_name: 'market_data',
          goal: `Get current agricultural market prices for major crops in ${user.location}, India including wheat, rice, sugarcane, cotton, and seasonal vegetables`
        })
      });
      
      const data = await response.json();
      if (data.value) {
        setMarketData(data.value);
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
    }
  };

  if (!user?.isProfileComplete) {
    return <Profile />;
  }

  const quickActions = [
    { icon: Sprout, label: t('getCropAdvice'), path: '/crop-advice', color: 'bg-green-500' },
    { icon: Cloud, label: t('weatherAlerts'), path: '/weather', color: 'bg-blue-500' },
    { icon: TrendingUp, label: t('marketPrices'), path: '/market-prices', color: 'bg-purple-500' },
    { icon: BookOpen, label: t('learningHub'), path: '/learning-hub', color: 'bg-orange-500' },
    { icon: MessageCircle, label: t('askAiHelper'), path: '/chatbot', color: 'bg-indigo-500' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('welcomeBack')}, {user.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {user.location} • {user.farmSize} {t('farmSize').includes('acres') ? 'acres' : 'एकड़'} • {user.soilType} {t('soilType').includes('Soil') ? 'soil' : 'मिट्टी'}
          </p>
        </div>
        <button
          onClick={toggleLanguage}
          className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
        >
          <Languages className="h-4 w-4 mr-2" />
          {language === 'en' ? 'हिंदी में बदलें' : 'Switch to English'}
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {quickActions.map(({ icon: Icon, label, path, color }) => (
          <a
            key={path}
            href={path}
            className="card hover:shadow-xl transition-shadow cursor-pointer text-center"
          >
            <div className={`${color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
          </a>
        ))}
      </div>

      {/* Weather & Market Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center mb-4">
            <Cloud className="h-6 w-6 text-blue-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('weatherUpdate')}</h2>
          </div>
          {weatherData ? (
            <div className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">
              {weatherData.substring(0, 300)}...
            </div>
          ) : (
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-6 w-6 text-purple-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('marketPrices')}</h2>
          </div>
          {marketData ? (
            <div className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">
              {marketData.substring(0, 300)}...
            </div>
          ) : (
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('recentActivity')}</h2>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{t('weatherAlertsTitle')}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t('heavyRainfall')}</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Sprout className="h-5 w-5 text-green-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{t('cropAdvice')}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t('newRecommendations')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
