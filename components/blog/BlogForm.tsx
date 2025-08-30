'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface BlogFormProps {
  onSubmit: (data: BlogFormData) => void;
  isLoading: boolean;
}

export interface BlogFormData {
  topic: string;
  audience: string;
  tone: string;
  length: string;
  keywords: string[];
}

const TONE_OPTIONS = [
  '친근하고 실용적',
  '전문적이고 신뢰할 수 있는',
  '창의적이고 영감을 주는',
  '객관적이고 분석적',
  '격려적이고 동기부여적',
  '재미있고 유머러스한'
];

const LENGTH_OPTIONS = [
  '500-800자 (짧은 글)',
  '800-1200자 (중간 글)',
  '1200-1800자 (긴 글)',
  '1800-2500자 (매우 긴 글)'
];

export default function BlogForm({ onSubmit, isLoading }: BlogFormProps) {
  const [formData, setFormData] = useState<BlogFormData>({
    topic: '',
    audience: '',
    tone: TONE_OPTIONS[0],
    length: LENGTH_OPTIONS[1],
    keywords: []
  });
  const [newKeyword, setNewKeyword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.topic.trim() && formData.audience.trim()) {
      onSubmit(formData);
    }
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.keywords.includes(newKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()]
      }));
      setNewKeyword('');
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(keyword => keyword !== keywordToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 주제 */}
      <div>
        <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
          블로그 주제 *
        </label>
        <input
          type="text"
          id="topic"
          value={formData.topic}
          onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
          placeholder="예: Next.js와 OpenAI를 활용한 웹앱 개발"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
          disabled={isLoading}
        />
      </div>

      {/* 타겟 독자 */}
      <div>
        <label htmlFor="audience" className="block text-sm font-medium text-gray-700 mb-2">
          타겟 독자 *
        </label>
        <input
          type="text"
          id="audience"
          value={formData.audience}
          onChange={(e) => setFormData(prev => ({ ...prev, audience: e.target.value }))}
          placeholder="예: 초급 개발자, 마케팅 담당자, 일반 사용자"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
          disabled={isLoading}
        />
      </div>

      {/* 톤 */}
      <div>
        <label htmlFor="tone" className="block text-sm font-medium text-gray-700 mb-2">
          글의 톤
        </label>
        <select
          id="tone"
          value={formData.tone}
          onChange={(e) => setFormData(prev => ({ ...prev, tone: e.target.value }))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        >
          {TONE_OPTIONS.map((tone) => (
            <option key={tone} value={tone}>
              {tone}
            </option>
          ))}
        </select>
      </div>

      {/* 글자 수 */}
      <div>
        <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-2">
          글자 수
        </label>
        <select
          id="length"
          value={formData.length}
          onChange={(e) => setFormData(prev => ({ ...prev, length: e.target.value }))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        >
          {LENGTH_OPTIONS.map((length) => (
            <option key={length} value={length}>
              {length}
            </option>
          ))}
        </select>
      </div>

      {/* SEO 키워드 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          SEO 키워드
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="키워드를 입력하고 Enter 또는 + 버튼 클릭"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={addKeyword}
            disabled={!newKeyword.trim() || isLoading}
            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        
        {/* 키워드 태그들 */}
        {formData.keywords.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.keywords.map((keyword) => (
              <span
                key={keyword}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {keyword}
                <button
                  type="button"
                  onClick={() => removeKeyword(keyword)}
                  disabled={isLoading}
                  className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 제출 버튼 */}
      <button
        type="submit"
        disabled={!formData.topic.trim() || !formData.audience.trim() || isLoading}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {isLoading ? '블로그 글 생성 중...' : '블로그 글 생성하기'}
      </button>
    </form>
  );
}
