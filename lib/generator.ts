export type FallbackInput = {
  topic: string;
  tone: string;
  audience: string;
  goal: string;
  length: 'Short' | 'Medium' | 'Long';
  emojis: boolean;
  hashtags: boolean;
  hook: 'Data' | 'Question' | 'Contrarian' | 'Story';
  cta: string;
  variants: number;
};

const TONE_GLOSSES: Record<string, string> = {
  Professional: 'Clear, concise, direct, and credible. Avoid hype.',
  Conversational: 'Friendly, relatable, and casual. Use simple sentences.',
  'Thought leadership': 'Insightful and authoritative. Share frameworks and unique perspectives.',
  Storytelling: 'Narrative-driven. Use a beginning-middle-end arc with a lesson learned.',
};

function pickLengthRange(length: FallbackInput['length']): [number, number] {
  if (length === 'Short') return [80, 140];
  if (length === 'Long') return [240, 380];
  return [150, 250];
}

function hashtagify(topic: string, max = 4): string[] {
  const base = topic
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(Boolean);
  const uniq = Array.from(new Set(base));
  const picks = uniq.slice(0, max).map((t) => `#${t}`);
  const always = ['#linkedin', '#growth'];
  return Array.from(new Set([...picks, ...always])).slice(0, max + 2);
}

function hookLine(input: FallbackInput): string {
  const { hook, topic } = input;
  switch (hook) {
    case 'Data':
      return `Data point that surprised me about ${topic}:`;
    case 'Question':
      return `What if we approached ${topic} differently?`;
    case 'Contrarian':
      return `Unpopular take: most advice on ${topic} is backwards.`;
    case 'Story':
      return `A quick story about ${topic}:`;
    default:
      return `${topic}:`;
  }
}

function maybeEmojis(input: FallbackInput): { prefix: string; bullets: string[] } {
  if (!input.emojis) return { prefix: '', bullets: ['-', '-', '-'] };
  return {
    prefix: '? ',
    bullets: ['?', '??', '??'],
  };
}

function bodyPoints(input: FallbackInput): string[] {
  const { audience, goal, tone } = input;
  const toneTip = TONE_GLOSSES[tone] || 'Be clear and useful.';
  return [
    `For ${audience}. ${toneTip}`,
    `Three takeaways you can apply today:`,
    `Aligned to the goal: ${goal}.`,
  ];
}

export function fallbackGenerate(input: FallbackInput): string[] {
  const [min, max] = pickLengthRange(input.length);
  const target = Math.floor((min + max) / 2);
  const { prefix, bullets } = maybeEmojis(input);
  const hs = input.hashtags ? `\n\n${hashtagify(input.topic).join(' ')}` : '';

  const points = bodyPoints(input);

  const variants: string[] = [];
  const vCount = Math.min(3, Math.max(1, input.variants || 1));

  for (let i = 0; i < vCount; i++) {
    const lines: string[] = [];
    lines.push(prefix + hookLine(input));
    lines.push('');
    lines.push(`${bullets[0]} ${points[0]}`);
    lines.push(`${bullets[1]} ${points[1]}`);
    lines.push(`${bullets[2]} ${points[2]}`);
    if (input.cta) {
      lines.push('');
      lines.push(`Call to action: ${input.cta}`);
    }
    const draft = lines.join('\n') + hs;

    // Trim or pad to target-ish length
    let finalText = draft;
    if (draft.length > max) {
      finalText = draft.slice(0, max - 1) + '?';
    } else if (draft.length < min) {
      finalText = draft + '\n\n' + 'Worth saving?' + (input.emojis ? ' ??' : '');
    }
    variants.push(finalText);
  }

  return variants;
}

export async function openAiGenerate(input: FallbackInput, apiKey: string): Promise<string[]> {
  const sys = [
    'You are an expert LinkedIn content strategist and copywriter.',
    'Write posts that fit LinkedIn best practices: tight lines, white-space, strong hook, concrete takeaways, specific CTA.',
    'Never include markdown code fences, keep text plain. Avoid hashtags mid-body. Keep emojis tasteful.'
  ].join(' ');

  const user = [
    `Topic: ${input.topic}`,
    `Tone: ${input.tone}`,
    `Audience: ${input.audience}`,
    `Goal: ${input.goal}`,
    `Length: ${input.length}`,
    `Hook: ${input.hook}`,
    `CTA: ${input.cta}`,
    `Include emojis: ${input.emojis}`,
    `Include hashtags (at end): ${input.hashtags}`,
    `Variants: ${input.variants}`
  ].join('\n');

  const messages = [
    { role: 'system', content: sys },
    { role: 'user', content: user }
  ];

  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      n: Math.min(3, Math.max(1, input.variants || 1)),
      messages,
    }),
  });

  if (!resp.ok) {
    throw new Error(`OpenAI error ${resp.status}`);
  }
  const data = await resp.json();
  const outputs: string[] = (data.choices || []).map((c: any) => String(c.message?.content || '').trim());

  // Append hashtags at the end if requested
  if (input.hashtags) {
    const tags = hashtagify(input.topic).join(' ');
    return outputs.map((t) => `${t}\n\n${tags}`);
  }
  return outputs;
}
