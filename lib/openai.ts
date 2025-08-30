import OpenAI from 'openai';

// OpenAI 클라이언트 팩토리
export function createOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }

  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: false, // 서버에서만 사용
  });
}

// 기본 모델 설정
export const DEFAULT_MODEL = 'gpt-4o-mini';

// 토큰 제한 설정
export const MAX_TOKENS = 4000;
export const MAX_MESSAGES = 20;
