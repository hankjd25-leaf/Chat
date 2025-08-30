'use client';

import { useState } from 'react';
import { Copy, Download, Check, Eye, EyeOff } from 'lucide-react';
import { BlogFormData } from './BlogForm';

interface BlogPreviewProps {
  content: string;
  formData: BlogFormData;
  onRegenerate: () => void;
}

export default function BlogPreview({ content, formData, onRegenerate }: BlogPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [showMetadata, setShowMetadata] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadAsMarkdown = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.topic.replace(/[^a-zA-Z0-9가-힣]/g, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 메타데이터 추출 (마크다운에서 메타데이터 섹션 찾기)
  const extractMetadata = (content: string) => {
    const metadataMatch = content.match(/---\s*\n메타데이터:\s*\n([\s\S]*?)(?=\n---|\n$|$)/);
    if (metadataMatch) {
      const metadataText = metadataMatch[1];
      const titleMatch = metadataText.match(/제목:\s*(.+)/);
      const descriptionMatch = metadataText.match(/설명:\s*(.+)/);
      const tagsMatch = metadataText.match(/태그:\s*(.+)/);
      
      return {
        title: titleMatch ? titleMatch[1].trim() : '',
        description: descriptionMatch ? descriptionMatch[1].trim() : '',
        tags: tagsMatch ? tagsMatch[1].trim().split(',').map(tag => tag.trim()) : []
      };
    }
    return null;
  };

  const metadata = extractMetadata(content);
  const contentWithoutMetadata = content.replace(/---\s*\n메타데이터:\s*\n[\s\S]*?(?=\n---|\n$|$)/, '');

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* 헤더 */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">생성된 블로그 글</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMetadata(!showMetadata)}
              className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              {showMetadata ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showMetadata ? '메타데이터 숨기기' : '메타데이터 보기'}
            </button>
          </div>
        </div>
      </div>

      {/* 메타데이터 섹션 */}
      {showMetadata && metadata && (
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-4">
          <h4 className="font-medium text-blue-900 mb-3">SEO 메타데이터</h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-blue-800">제목:</span>
              <span className="text-blue-700 ml-2">{metadata.title}</span>
            </div>
            <div>
              <span className="font-medium text-blue-800">설명:</span>
              <span className="text-blue-700 ml-2">{metadata.description}</span>
            </div>
            <div>
              <span className="font-medium text-blue-800">태그:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {metadata.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 블로그 내용 */}
      <div className="p-6">
        <div className="prose prose-sm max-w-none">
          <div className="whitespace-pre-wrap text-gray-900 leading-relaxed">
            {contentWithoutMetadata}
          </div>
        </div>
      </div>

      {/* 액션 버튼들 */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? '복사됨!' : '복사하기'}
            </button>
            <button
              onClick={downloadAsMarkdown}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              다운로드
            </button>
          </div>
          <button
            onClick={onRegenerate}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            다시 생성
          </button>
        </div>
      </div>
    </div>
  );
}
