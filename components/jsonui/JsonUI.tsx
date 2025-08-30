'use client';

import { useState } from 'react';
import { Code, Send, RefreshCw } from 'lucide-react';
import JsonRenderer from './JsonRenderer';
import { SchemaType, SCHEMA_MAP } from '@/lib/schemas';
import LoadingDots from '@/components/common/LoadingDots';

const SCHEMA_OPTIONS = [
  { value: 'cards', label: '카드형 답변', description: '정보를 카드 형태로 표시' },
  { value: 'dashboard', label: '대시보드', description: '통계와 메트릭을 시각화' },
  { value: 'todoList', label: '할 일 목록', description: '체크 가능한 할 일 목록' },
  { value: 'productCatalog', label: '제품 카탈로그', description: '제품 정보를 카드로 표시' }
] as const;

export default function JsonUI() {
  const [prompt, setPrompt] = useState('');
  const [selectedSchema, setSelectedSchema] = useState<SchemaType>('cards');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/json-ui', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          schemaType: selectedSchema,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('JSON-UI error:', err);
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (prompt.trim()) {
      handleSubmit(new Event('submit') as any);
    }
  };

  const resetForm = () => {
    setPrompt('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3 mb-2">
          <Code className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-semibold text-gray-900">JSON-UI AI</h1>
        </div>
        <p className="text-sm text-gray-600">
          AI가 JSON Schema에 맞는 응답을 생성하고 즉시 UI로 렌더링합니다.
        </p>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 입력 영역 */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">설정</h2>
              
              {/* 스키마 선택 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  UI 타입 선택
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SCHEMA_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedSchema(option.value as SchemaType)}
                      className={`p-4 text-left border rounded-lg transition-colors ${
                        selectedSchema === option.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-gray-900">{option.label}</div>
                      <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 프롬프트 입력 */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                    프롬프트
                  </label>
                  <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={`예: ${getPlaceholderForSchema(selectedSchema)}`}
                    className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={!prompt.trim() || isLoading}
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <LoadingDots />
                        생성 중...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        생성하기
                      </>
                    )}
                  </button>
                  
                  {result && (
                    <button
                      type="button"
                      onClick={handleRegenerate}
                      disabled={isLoading}
                      className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </form>

              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                  <p className="font-medium">오류가 발생했습니다:</p>
                  <p className="text-sm">{error}</p>
                </div>
              )}
            </div>

            {/* 스키마 정보 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">선택된 스키마 정보</h3>
              <div className="text-sm text-blue-700">
                <p><strong>타입:</strong> {SCHEMA_OPTIONS.find(opt => opt.value === selectedSchema)?.label}</p>
                <p><strong>설명:</strong> {SCHEMA_OPTIONS.find(opt => opt.value === selectedSchema)?.description}</p>
              </div>
            </div>
          </div>

          {/* 결과 영역 */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">미리보기</h2>
                {result && (
                  <button
                    onClick={resetForm}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    새로 시작
                  </button>
                )}
              </div>

              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <LoadingDots />
                    <p className="text-gray-600 mt-2">UI를 생성하고 있습니다...</p>
                  </div>
                </div>
              )}

              {result && !isLoading && (
                <div className="space-y-4">
                  <JsonRenderer data={result} schemaType={selectedSchema} />
                  
                  {/* JSON 데이터 표시 */}
                  <details className="mt-6">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                      JSON 데이터 보기
                    </summary>
                    <pre className="mt-2 p-4 bg-gray-50 border border-gray-200 rounded-lg text-xs overflow-x-auto">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </details>
                </div>
              )}

              {!result && !isLoading && (
                <div className="text-center py-12 text-gray-500">
                  <Code className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>프롬프트를 입력하고 생성 버튼을 클릭하세요.</p>
                  <p className="text-sm mt-2">AI가 JSON Schema에 맞는 응답을 생성하고 UI로 렌더링합니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getPlaceholderForSchema(schemaType: SchemaType): string {
  switch (schemaType) {
    case 'cards':
      return '웹 개발 기술들을 카드 형태로 정리해주세요. React, Vue, Angular, Next.js 등을 포함해서요.';
    case 'dashboard':
      return '회사의 월별 매출 통계를 대시보드 형태로 만들어주세요.';
    case 'todoList':
      return '프로젝트 완료를 위한 할 일 목록을 만들어주세요.';
    case 'productCatalog':
      return '전자제품 카탈로그를 만들어주세요. 스마트폰, 노트북, 태블릿 등을 포함해서요.';
    default:
      return '원하는 내용을 입력하세요...';
  }
}
