import { NextRequest } from 'next/server';
import { createOpenAIClient, DEFAULT_MODEL } from '@/lib/openai';
import { SYSTEM_PROMPTS } from '@/lib/prompts';
import { SCHEMA_MAP, SchemaType } from '@/lib/schemas';

interface JsonUIRequest {
  prompt: string;
  schemaType: SchemaType;
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, schemaType }: JsonUIRequest = await req.json();

    // 입력 검증
    if (!prompt || !schemaType) {
      return new Response('Missing prompt or schemaType', { status: 400 });
    }

    // 스키마 타입 검증
    if (!SCHEMA_MAP[schemaType]) {
      return new Response('Invalid schema type', { status: 400 });
    }

    // 입력 길이 제한
    if (prompt.length > 2000) {
      return new Response('Prompt too long', { status: 400 });
    }

    // OpenAI 클라이언트 생성
    const openai = createOpenAIClient();

    // 메시지 구성
    const messages = [
      { role: 'system' as const, content: SYSTEM_PROMPTS.jsonUI },
      { role: 'user' as const, content: prompt }
    ];

    // Chat Completions API 호출 (Structured Outputs)
    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: messages,
      response_format: { type: "json_object" },
      max_tokens: 4000,
    });

    // 응답에서 JSON 추출
    if (response.choices && response.choices.length > 0) {
      const content = response.choices[0].message.content;
      if (content) {
        try {
          // JSON 파싱하여 유효성 검사
          const jsonData = JSON.parse(content);
          return new Response(JSON.stringify(jsonData), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (parseError) {
          console.error('JSON parsing error:', parseError);
          return new Response('Invalid JSON response', { status: 500 });
        }
      }
    }

    return new Response('No valid response', { status: 500 });

  } catch (error) {
    console.error('JSON-UI API error:', error);
    
    // OpenAI API 에러 처리
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return new Response('OpenAI API key not configured', { status: 500 });
      }
      if (error.message.includes('rate limit')) {
        return new Response('Rate limit exceeded', { status: 429 });
      }
      if (error.message.includes('schema')) {
        return new Response('Schema validation failed', { status: 400 });
      }
    }

    return new Response('Internal server error', { status: 500 });
  }
}
