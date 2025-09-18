import React, { useState } from 'react';
import { Sprout, Send, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const CropAdvice = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/crop-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `As an expert agricultural advisor for Indian farmers, provide detailed practical advice for this farmer profile:
Location: ${user.location || 'India'},
Farm Size: ${user.farmSize || '1'} acres,
Soil Type: ${user.soilType || 'Mixed'}.
Query: ${query}.
Include specific recommendations for Indian farming conditions, seasonal considerations, local crop varieties, and cost-effective solutions.
Format response in clear, actionable points.`
        })
      });

      const data = await response.json();

      if (data.candidates && data.candidates[0].content.parts[0].text) {
        setAdvice(data.candidates[0].content.parts[0].text);
      } else {
        setAdvice(t('errorAdvice'));
      }
    } catch (error) {
      console.error('Error getting crop advice:', error);
      setAdvice(t('errorAdvice'));
    }
    setLoading(false);
  };

  const quickQuestions = [
    t('whatCropsPlant'),
    t('improveSoilFertility'),
    t('bestIrrigation'),
    t('pestControl'),
    t('organicFarming')
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Sprout className="h-8 w-8 text-primary-600 mr-3" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('aiCropAdvice')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {t('personalizedRecommendations')}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('askFarmingQuestion')}
            </label>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="input-field h-24 resize-none"
              placeholder={t('exampleQuestion')}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50 flex items-center"
          >
            {loading ? (
              <Loader className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            {loading ? t('gettingAdvice') : t('getAdvice')}
          </button>
        </form>
      </div>

      {/* Quick Questions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('quickQuestions')}
        </h3>
        <div className="grid gap-2">
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => setQuery(question)}
              className="text-left p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {question}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Advice Display */}
      {advice && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('aiRecommendation')}
          </h3>
          <div className="prose dark:prose-invert max-w-none">
            <div className="whitespace-pre-line text-gray-700 dark:text-gray-300">
              {advice}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropAdvice;
