'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CheckCircle, Circle, Star, TrendingUp, TrendingDown } from 'lucide-react';
import { SchemaType } from '@/lib/schemas';

interface JsonRendererProps {
  data: Record<string, unknown>;
  schemaType: SchemaType;
}

export default function JsonRenderer({ data, schemaType }: JsonRendererProps) {
  const [error, setError] = useState<string | null>(null);

  if (!data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <p>데이터가 없습니다.</p>
      </div>
    );
  }

  try {
    switch (schemaType) {
      case 'cards':
        return <CardsRenderer data={data} />;
      case 'dashboard':
        return <DashboardRenderer data={data} />;
      case 'todoList':
        return <TodoListRenderer data={data} />;
      case 'productCatalog':
        return <ProductCatalogRenderer data={data} />;
      default:
        return (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-700">
            <p>지원하지 않는 스키마 타입입니다: {schemaType}</p>
          </div>
        );
    }
  } catch (err) {
    setError(err instanceof Error ? err.message : '렌더링 오류');
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <p>렌더링 오류: {error}</p>
      </div>
    );
  }
}

// 카드 렌더러
function CardsRenderer({ data }: { data: Record<string, unknown> }) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">{String(data.title || '')}</h2>
                 {data.subtitle && String(data.subtitle) && (
           <p className="text-gray-600 mt-2">{String(data.subtitle)}</p>
         )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(data.cards as Array<Record<string, unknown>>)?.map((card: Record<string, unknown>, index: number) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
                         <div className="flex items-center justify-between mb-2">
               <h3 className="font-semibold text-gray-900">{String(card.label || '')}</h3>
               {card.color && String(card.color) && (
                 <div 
                   className="w-4 h-4 rounded-full"
                   style={{ backgroundColor: String(card.color) }}
                 />
               )}
             </div>
             <p className="text-gray-600">{String(card.value || '')}</p>
                         {card.href && String(card.href) && (
               <a
                 href={String(card.href)}
                 className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block"
               >
                 자세히 보기 →
               </a>
             )}
          </div>
        ))}
      </div>
    </div>
  );
}

// 대시보드 렌더러
function DashboardRenderer({ data }: { data: Record<string, unknown> }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{String(data.title || '')}</h2>
                 {data.summary && String(data.summary) && (
           <p className="text-gray-600 mt-2">{String(data.summary)}</p>
         )}
      </div>
      
      {/* 메트릭스 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(data.metrics as Array<Record<string, unknown>>)?.map((metric: Record<string, unknown>, index: number) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                         <div className="flex items-center justify-between">
               <div>
                 <p className="text-sm text-gray-600">{String(metric.name || '')}</p>
                 <p className="text-2xl font-bold text-gray-900">{String(metric.value || '')}</p>
               </div>
                             {metric.trend && String(metric.trend) && (
                 <div className="flex items-center gap-1">
                   {String(metric.trend) === 'up' ? (
                     <TrendingUp className="w-5 h-5 text-green-600" />
                   ) : (
                     <TrendingDown className="w-5 h-5 text-red-600" />
                   )}
                   {metric.change && String(metric.change) && (
                     <span className={`text-sm ${String(metric.trend) === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                       {String(metric.change)}
                     </span>
                   )}
                 </div>
               )}
            </div>
          </div>
        ))}
      </div>
      
      {/* 차트 */}
      {data.chart && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
                     <h3 className="text-lg font-semibold text-gray-900 mb-4">
             {(data.chart as Record<string, unknown>)?.type === 'bar' ? '막대 차트' : '차트'} 데이터
           </h3>
          <div className="space-y-2">
                         {((data.chart as Record<string, unknown>)?.data as Array<Record<string, unknown>>)?.map((item: Record<string, unknown>, index: number) => (
                             <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                 <span className="font-medium">{String(item.label || '')}</span>
                 <span className="text-blue-600 font-semibold">{String(item.value || '')}</span>
               </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// 할 일 목록 렌더러
function TodoListRenderer({ data }: { data: Record<string, unknown> }) {
  const [todos, setTodos] = useState(data.todos || []);

  const toggleTodo = (id: string) => {
    setTodos((todos as Array<Record<string, unknown>>).map((todo: Record<string, unknown>) => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{String(data.title || '')}</h2>
                 {data.description && String(data.description) && (
           <p className="text-gray-600 mt-2">{String(data.description)}</p>
         )}
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg">
        {(todos as Array<Record<string, unknown>>).map((todo: Record<string, unknown>, index: number) => (
          <div
                         key={String(todo.id || index)}
            className={`flex items-center gap-3 p-4 border-b border-gray-100 last:border-b-0 ${
              todo.completed ? 'bg-gray-50' : ''
            }`}
          >
            <button
                             onClick={() => toggleTodo(String(todo.id || ''))}
              className="flex-shrink-0"
            >
              {todo.completed ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400" />
              )}
            </button>
            
                         <div className="flex-1">
               <p className={`font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                 {String(todo.text || '')}
               </p>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                 {todo.priority && String(todo.priority) && (
                   <span className={`px-2 py-1 rounded text-xs ${
                     String(todo.priority) === 'high' ? 'bg-red-100 text-red-800' :
                     String(todo.priority) === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                     'bg-green-100 text-green-800'
                   }`}>
                     {String(todo.priority)}
                   </span>
                 )}
                                 {todo.dueDate && String(todo.dueDate) && (
                   <span>마감일: {String(todo.dueDate)}</span>
                 )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 제품 카탈로그 렌더러
function ProductCatalogRenderer({ data }: { data: Record<string, unknown> }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{String(data.title || '')}</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(data.products as Array<Record<string, unknown>>)?.map((product: Record<string, unknown>, index: number) => (
                     <div key={String(product.id || index)} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                         {product.image && String(product.image) && (
               <div className="aspect-square bg-gray-100 flex items-center justify-center">
                 <Image
                   src={product.image as string}
                   alt={product.name as string}
                   width={300}
                   height={300}
                   className="w-full h-full object-cover"
                   onError={() => {
                     // 에러 처리
                   }}
                 />
               </div>
             )}
            
            <div className="p-4">
                             <div className="flex items-start justify-between mb-2">
                 <h3 className="font-semibold text-gray-900">{String(product.name || '')}</h3>
                 <span className="text-lg font-bold text-blue-600">{String(product.price || '')}</span>
               </div>
              
                             {product.description && String(product.description) && (
                 <p className="text-gray-600 text-sm mb-3">{String(product.description)}</p>
               )}
              
              <div className="flex items-center justify-between">
                                 {product.category && String(product.category) && (
                   <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                     {String(product.category)}
                   </span>
                 )}
                
                                 {product.rating && String(product.rating) && (
                   <div className="flex items-center gap-1">
                     <Star className="w-4 h-4 text-yellow-400 fill-current" />
                     <span className="text-sm text-gray-600">{String(product.rating)}</span>
                   </div>
                 )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
