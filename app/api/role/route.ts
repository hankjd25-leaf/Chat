import { NextRequest } from 'next/server';
import { createOpenAIClient, DEFAULT_MODEL, MAX_TOKENS } from '@/lib/openai';
import { SYSTEM_PROMPTS, ROLE_PRESETS } from '@/lib/prompts';

export async function POST(req: NextRequest) {
  try {
    const { roleKey, userInput } = await req.json();

    // 입력 검증
    if (!roleKey || !userInput) {
      return new Response('Missing roleKey or userInput', { status: 400 });
    }

    // 역할 프리셋 확인
    const rolePreset = ROLE_PRESETS[roleKey as keyof typeof ROLE_PRESETS];
    if (!rolePreset) {
      return new Response('Invalid role key', { status: 400 });
    }

    // 입력 길이 제한
    if (userInput.length > 2000) {
      return new Response('Input too long', { status: 400 });
    }

    // OpenAI 클라이언트 생성
    const openai = createOpenAIClient();

    // 역할별 시스템 프롬프트 생성
    const systemPrompt = SYSTEM_PROMPTS.roleTemplate
      .replace('{roleName}', rolePreset.name)
      .replace('{goal}', rolePreset.goal)
      .replace('{tone}', rolePreset.tone)
      .replace('{banned}', rolePreset.banned)
      .replace('{formatHints}', rolePreset.formatHints);

    // 메시지 구성
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: userInput }
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
    console.error('Role API error:', error);
    
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
