
import { NextRequest } from 'next/server';
import { createOpenAIClient, DEFAULT_MODEL, MAX_TOKENS } from '@/lib/openai';
import { SYSTEM_PROMPTS } from '@/lib/prompts';

interface BlogRequest {
  topic: string;
  audience: string;
  tone: string;
  length: string;
  keywords: string[];
}

export async function POST(req: NextRequest) {
  try {
    const { topic, audience, tone, length, keywords }: BlogRequest = await req.json();

    // 입력 검증
    if (!topic || !audience || !tone || !length) {
      return new Response('Missing required fields', { status: 400 });
    }

    // 입력 길이 제한
    if (topic.length > 200 || audience.length > 100 || tone.length > 100) {
      return new Response('Input too long', { status: 400 });
    }

    // OpenAI 클라이언트 생성
    const openai = createOpenAIClient();

    // 블로그 작성 프롬프트 구성
    const blogPrompt = `${SYSTEM_PROMPTS.blog}

주제: ${topic}
타겟 독자: ${audience}
톤: ${tone}
글자 수: ${length}
SEO 키워드: ${keywords.join(', ')}

다음 형식으로 블로그 글을 작성해주세요:

# 제목
(SEO 최적화된 매력적인 제목)

## 요약
(글의 핵심 내용을 간단히 요약)

## 본문
(구체적이고 실용적인 내용으로 구성)

## 결론
(핵심 포인트 요약 및 다음 단계 제안)

## FAQ
(독자들이 궁금해할 만한 질문과 답변)

---
메타데이터:
- 제목: [SEO 최적화된 제목]
- 설명: [150자 이내의 메타 설명]
- 태그: [관련 태그들]`;

    // 메시지 구성
    const messages = [
      { role: 'system' as const, content: blogPrompt }
    ];

    // Chat Completions API 호출 (스트리밍)
    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: messages,
      stream: true,
      max_tokens: MAX_TOKENS,
    });

    // 스트리밍 응답 생성
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            // 각 청크에서 텍스트 추출
            if (chunk.choices && chunk.choices.length > 0) {
              const choice = chunk.choices[0];
              if (choice.delta && choice.delta.content) {
                const text = choice.delta.content;
                controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ text })}\n\n`));
              }
            }
          }
          controller.enqueue(new TextEncoder().encode(`data: [DONE]\n\n`));
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Blog API error:', error);
    
    // OpenAI API 에러 처리
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return new Response('OpenAI API key not configured', { status: 500 });
      }
      if (error.message.includes('rate limit')) {
        return new Response('Rate limit exceeded', { status: 429 });
      }
    }

    return new Response('Internal server error', { status: 500 });
  }
}
