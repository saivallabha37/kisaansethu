import React, { useState } from 'react';
import { BookOpen, Play, FileText, Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const LearningHub = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: t('allTopics') },
    { id: 'crops', name: t('cropManagement') },
    { id: 'soil', name: t('soilHealth') },
    { id: 'irrigation', name: t('irrigation') },
    { id: 'pests', name: t('pestControlCategory') },
    { id: 'organic', name: t('organicFarmingCategory') }
  ];

  const learningContent = [
    {
      id: 1,
      title: 'Modern Wheat Cultivation Techniques',
      type: 'video',
      category: 'crops',
      duration: `15 ${t('min')}`,
      description: 'Learn the latest techniques for wheat cultivation including seed selection, planting, and harvesting.',
      thumbnail: '/api/placeholder/300/200'
    },
    {
      id: 2,
      title: 'Soil Testing and Nutrient Management',
      type: 'article',
      category: 'soil',
      readTime: `8 ${t('minRead')}`,
      description: 'Complete guide to soil testing, understanding nutrient deficiencies, and organic fertilization.',
      thumbnail: '/api/placeholder/300/200'
    },
    {
      id: 3,
      title: 'Drip Irrigation Setup Guide',
      type: 'video',
      category: 'irrigation',
      duration: `20 ${t('min')}`,
      description: 'Step-by-step guide to setting up an efficient drip irrigation system for your farm.',
      thumbnail: '/api/placeholder/300/200'
    },
    {
      id: 4,
      title: 'Integrated Pest Management',
      type: 'article',
      category: 'pests',
      readTime: `12 ${t('minRead')}`,
      description: 'Sustainable approaches to pest control using biological and organic methods.',
      thumbnail: '/api/placeholder/300/200'
    },
    {
      id: 5,
      title: 'Organic Farming Certification Process',
      type: 'video',
      category: 'organic',
      duration: `18 ${t('min')}`,
      description: 'Understanding the certification process and requirements for organic farming.',
      thumbnail: '/api/placeholder/300/200'
    },
    {
      id: 6,
      title: 'Crop Rotation Benefits and Planning',
      type: 'article',
      category: 'crops',
      readTime: `10 ${t('minRead')}`,
      description: 'How to plan effective crop rotation to improve soil health and increase yields.',
      thumbnail: '/api/placeholder/300/200'
    }
  ];

  const filteredContent = learningContent.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <BookOpen className="h-8 w-8 text-orange-600 mr-3" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('learningHub')}</h1>
          <p className="text-gray-600 dark:text-gray-300">
            {t('expandKnowledge')}
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={t('searchArticles')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field md:w-48"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContent.map(item => (
          <div key={item.id} className="card hover:shadow-xl transition-shadow cursor-pointer">
            <div className="relative mb-4">
              <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                {item.type === 'video' ? (
                  <Play className="h-12 w-12 text-gray-400" />
                ) : (
                  <FileText className="h-12 w-12 text-gray-400" />
                )}
              </div>
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  item.type === 'video' 
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                }`}>
                  {item.type === 'video' ? item.duration : item.readTime}
                </span>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {item.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              {item.description}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {categories.find(cat => cat.id === item.category)?.name}
              </span>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                {item.type === 'video' ? t('watch') : t('read')}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredContent.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            {t('noContentFound')}
          </p>
        </div>
      )}
    </div>
  );
};

export default LearningHub;
