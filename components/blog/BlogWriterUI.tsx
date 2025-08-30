'use client';

import { useState } from 'react';
import { FileText, ArrowLeft } from 'lucide-react';
import BlogForm, { BlogFormData } from './BlogForm';
import BlogPreview from './BlogPreview';
import LoadingDots from '@/components/common/LoadingDots';

export default function BlogWriterUI() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [formData, setFormData] = useState<BlogFormData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (data: BlogFormData) => {
    setIsGenerating(true);
    setError(null);
    setFormData(data);

    try {
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      let content = '';
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              setIsGenerating(false);
              return;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                content += parsed.text;
                setGeneratedContent(content);
              }
            } catch (e) {
              console.error('Failed to parse SSE data:', e);
            }
          }
        }
      }

      setIsGenerating(false);
    } catch (err) {
      console.error('Blog generation error:', err);
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      setIsGenerating(false);
    }
  };

  const handleRegenerate = () => {
    if (formData) {
      setGeneratedContent('');
      handleGenerate(formData);
    }
  };

  const resetForm = () => {
    setGeneratedContent('');
    setFormData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-semibold text-gray-900">블로그 글 AI</h1>
        </div>
        <p className="text-sm text-gray-600">
          주제와 설정을 입력하면 SEO 최적화된 블로그 글을 자동으로 생성해드립니다.
        </p>
      </div>

      <div className="container mx-auto px-4 py-8">
        {!generatedContent ? (
          // 폼 화면
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">블로그 글 설정</h2>
              <BlogForm onSubmit={handleGenerate} isLoading={isGenerating} />
              
              {error && (
                <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                  <p className="font-medium">오류가 발생했습니다:</p>
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {isGenerating && (
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <LoadingDots />
                    <span className="text-blue-700">블로그 글을 생성하고 있습니다...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          // 미리보기 화면
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <button
                onClick={resetForm}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                새로운 블로그 글 작성하기
              </button>
            </div>
            
            {formData && (
              <BlogPreview
                content={generatedContent}
                formData={formData}
                onRegenerate={handleRegenerate}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
