import React, { useState, useEffect } from 'react';
import { TrendingUp, RefreshCw, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const MarketPrices = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarketData();
  }, []);

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
          created_object_name: 'market_prices',
          goal: `Get current agricultural market prices and trends for ${user.location}, India including prices for wheat, rice, sugarcane, cotton, onion, potato, tomato, and other major crops. Include price trends, best selling locations, and market recommendations for farmers.`
        })
      });

      const data = await response.json();
      if (data.value) {
        setMarketData(data.value);
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
    }
    setLoading(false);
  };

  const samplePrices = [
    { crop: 'Wheat', price: '₹2,150', unit: t('perQuintal'), trend: 'up', change: '+2.5%' },
    { crop: 'Rice', price: '₹3,200', unit: t('perQuintal'), trend: 'down', change: '-1.2%' },
    { crop: 'Sugarcane', price: '₹350', unit: t('perQuintal'), trend: 'up', change: '+5.1%' },
    { crop: 'Cotton', price: '₹6,800', unit: t('perQuintal'), trend: 'up', change: '+3.8%' },
    { crop: 'Onion', price: '₹1,800', unit: t('perQuintal'), trend: 'down', change: '-8.2%' },
    { crop: 'Potato', price: '₹1,200', unit: t('perQuintal'), trend: 'up', change: '+1.5%' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <TrendingUp className="h-8 w-8 text-purple-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('marketPrices')}</h1>
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <MapPin className="h-4 w-4 mr-1" />
              {user.location}
            </div>
          </div>
        </div>
        <button
          onClick={fetchMarketData}
          className="btn-secondary flex items-center"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? t('updating') : t('refresh')}
        </button>
      </div>

      {/* Price Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {samplePrices.map((item, index) => (
          <div key={index} className="card">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {item.crop}
              </h3>
              <span className={`text-sm px-2 py-1 rounded-full ${
                item.trend === 'up' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {item.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {item.price}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {item.unit}
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Market Analysis */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('marketAnalysis')}
        </h2>
        {loading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ) : marketData ? (
          <div className="prose dark:prose-invert max-w-none">
            <div className="whitespace-pre-line text-gray-700 dark:text-gray-300">
              {marketData}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            {t('unableToLoad')}
          </p>
        )}
      </div>

      {/* Market Tips */}
      <div className="card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">
          {t('marketTips')}
        </h3>
        <ul className="space-y-2 text-blue-700 dark:text-blue-300">
          <li>• {t('checkPricesRegularly')}</li>
          <li>• {t('considerNearbyMarkets')}</li>
          <li>• {t('storeCrops')}</li>
          <li>• {t('joinFarmerGroups')}</li>
        </ul>
      </div>
    </div>
  );
};

export default MarketPrices;
