'use client';

import { MessageSquare, UserCheck, FileText, Code } from 'lucide-react';
import Link from 'next/link';

interface FeatureCardProps {
  title: string;
  description: string;
  iconName: string;
  href: string;
  isNew?: boolean;
  isExperimental?: boolean;
}

const iconMap = {
  MessageSquare,
  UserCheck,
  FileText,
  Code
};

export default function FeatureCard({
  title,
  description,
  iconName,
  href,
  isNew = false,
  isExperimental = false
}: FeatureCardProps) {
  const Icon = iconMap[iconName as keyof typeof iconMap];
  return (
    <Link href={href}>
      <div className="group relative p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100 hover:border-blue-200 cursor-pointer">
        {/* 배지 */}
        <div className="absolute top-4 right-4 flex gap-2">
          {isNew && (
            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
              NEW
            </span>
          )}
          {isExperimental && (
            <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
              실험적
            </span>
          )}
        </div>

        {/* 아이콘 */}
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>

        {/* 제목 */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>

        {/* 설명 */}
        <p className="text-gray-600 text-sm leading-relaxed">
          {description}
        </p>

        {/* 시작하기 버튼 */}
        <div className="mt-4 flex items-center text-blue-600 font-medium text-sm group-hover:text-blue-700 transition-colors">
          시작하기
          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
