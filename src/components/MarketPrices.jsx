import React, { useState, useEffect } from 'react';
import { TrendingUp, RefreshCw, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const API_BASE =
  "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070";

const MarketPrices = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch market data whenever user.location changes
  useEffect(() => {
    if (user.location) {
      fetchMarketData(user.location);
    }
  }, [user.location]);

  const fetchMarketData = async (location) => {
    try {
      setLoading(true);

      // Construct API URL with district or market filter
      const url = `${API_BASE}?api-key=579b464db66ec23bdd000001c751851baedd413e5314cbca1fe592a7&format=json&filter[district]=${encodeURIComponent(location)}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.records && data.records.length > 0) {
        setMarketData(data.records);
      } else {
        setMarketData([]); // No records found
      }
    } catch (error) {
      console.error("Error fetching market data:", error);
      setMarketData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <TrendingUp className="h-8 w-8 text-purple-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t("marketPrices")}
            </h1>
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <MapPin className="h-4 w-4 mr-1" />
              {user.location || t("locationNotSet")}
            </div>
          </div>
        </div>
        <button
          onClick={() => fetchMarketData(user.location)}
          className="btn-secondary flex items-center"
          disabled={loading || !user.location}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          {loading ? t("updating") : t("refresh")}
        </button>
      </div>

      {/* Price Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p>Loading...</p>
        ) : marketData.length === 0 ? (
          <p>{t("noDataForLocation")}</p>
        ) : (
          marketData.map((item, index) => (
            <div key={index} className="card">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {item.commodity}
                </h3>
                <span className="text-sm px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  ₹{item.modal_price}
                </span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Market: {item.market}, {item.district}, {item.state}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Min: ₹{item.min_price} | Max: ₹{item.max_price}
              </div>
              <div className="text-xs text-gray-400">
                Date: {item.arrival_date}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MarketPrices;
