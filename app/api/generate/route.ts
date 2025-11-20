import { NextRequest } from 'next/server';
import { fallbackGenerate, openAiGenerate, type FallbackInput } from '@/lib/generator';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as FallbackInput;
    if (!body?.topic || typeof body.topic !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid topic' }), { status: 400 });
    }

    const input: FallbackInput = {
      topic: String(body.topic).slice(0, 300),
      tone: ['Professional', 'Conversational', 'Thought leadership', 'Storytelling'].includes(body.tone as string)
        ? (body.tone as any)
        : 'Professional',
      audience: String(body.audience || '').slice(0, 300),
      goal: String(body.goal || '').slice(0, 300),
      length: (['Short', 'Medium', 'Long'] as const).includes(body.length as any) ? body.length : 'Medium',
      emojis: Boolean(body.emojis),
      hashtags: Boolean(body.hashtags),
      hook: (['Data', 'Question', 'Contrarian', 'Story'] as const).includes(body.hook as any) ? body.hook : 'Question',
      cta: String(body.cta || '').slice(0, 280),
      variants: Math.min(3, Math.max(1, Number(body.variants) || 1)),
    };

    const apiKey = process.env.OPENAI_API_KEY;
    let variants: string[] = [];

    if (apiKey) {
      try {
        variants = await openAiGenerate(input, apiKey);
      } catch (err) {
        variants = fallbackGenerate(input);
      }
    } else {
      variants = fallbackGenerate(input);
    }

    return Response.json({
      variants,
      meta: {
        topic: input.topic,
        tone: input.tone,
        audience: input.audience,
        goal: input.goal,
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Bad request' }), { status: 400 });
  }
}
