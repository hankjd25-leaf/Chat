import FeatureCard from '@/components/cards/FeatureCard';

export default function Home() {
  const features = [
    {
      title: '기본 챗봇',
      description: '일반적인 질문에 대한 지식 있는 답변을 받아보세요. 스트리밍으로 실시간 응답을 확인할 수 있습니다.',
      iconName: 'MessageSquare',
      href: '/chat-basic',
      isNew: true
    },
    {
      title: '역할 기반 AI',
      description: '여행 플래너, 코딩 리뷰어, 재무분석가 등 특정 역할의 AI와 대화하세요.',
      iconName: 'UserCheck',
      href: '/role-assistant',
      isExperimental: true
    },
    {
      title: '블로그 글 AI',
      description: '주제와 톤을 지정하면 SEO 최적화된 블로그 글을 자동으로 생성해드립니다.',
      iconName: 'FileText',
      href: '/blog-writer',
      isExperimental: true
    },
    {
      title: 'JSON-UI AI',
      description: 'AI가 JSON으로 응답하고 즉시 UI로 렌더링되는 혁신적인 기능을 체험해보세요.',
      iconName: 'Code',
      href: '/json-ui',
      isExperimental: true
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* 헤더 */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            JinhooSpace AI
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Next.js와 OpenAI를 활용한 다양한 AI 기능을 체험해보세요.
            스트리밍, 역할 기반 AI, 블로그 작성, JSON-UI까지 모든 것을 한 곳에서.
          </p>
        </div>

        {/* 기능 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              iconName={feature.iconName}
              href={feature.href}
              isNew={feature.isNew}
              isExperimental={feature.isExperimental}
            />
          ))}
        </div>

        {/* 푸터 */}
        <div className="text-center mt-16 text-gray-500">
          <p>Powered by Next.js & OpenAI</p>
        </div>
      </div>
    </main>
  );
}
