"use client";

import { useMemo, useState } from 'react';

export type GenerationRequest = {
  topic: string;
  tone: 'Professional' | 'Conversational' | 'Thought leadership' | 'Storytelling';
  audience: string;
  goal: string;
  length: 'Short' | 'Medium' | 'Long';
  emojis: boolean;
  hashtags: boolean;
  hook: 'Data' | 'Question' | 'Contrarian' | 'Story';
  cta: string;
  variants: number; // 1-3
};

export default function PostForm({ onGenerate, loading }: { onGenerate: (req: GenerationRequest) => Promise<void>; loading: boolean; }) {
  const [form, setForm] = useState<GenerationRequest>({
    topic: '',
    tone: 'Professional',
    audience: 'Startup founders, product leaders',
    goal: 'Drive conversation and inbound leads',
    length: 'Medium',
    emojis: true,
    hashtags: true,
    hook: 'Question',
    cta: 'Comment with your experience or DM for the framework',
    variants: 2,
  });

  const isValid = useMemo(() => form.topic.trim().length >= 5, [form.topic]);

  const handleChange = (key: keyof GenerationRequest, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Compose</h2>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <label className="text-sm font-medium">Topic</label>
          <input
            className="w-full rounded border px-3 py-2"
            placeholder="e.g., Lessons from scaling a SaaS to $5M ARR"
            value={form.topic}
            onChange={(e) => handleChange('topic', e.target.value)}
          />
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Tone</label>
            <select
              className="w-full rounded border px-3 py-2"
              value={form.tone}
              onChange={(e) => handleChange('tone', e.target.value as GenerationRequest['tone'])}
            >
              <option>Professional</option>
              <option>Conversational</option>
              <option>Thought leadership</option>
              <option>Storytelling</option>
            </select>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Length</label>
            <select
              className="w-full rounded border px-3 py-2"
              value={form.length}
              onChange={(e) => handleChange('length', e.target.value as GenerationRequest['length'])}
            >
              <option>Short</option>
              <option>Medium</option>
              <option>Long</option>
            </select>
          </div>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Audience</label>
          <input
            className="w-full rounded border px-3 py-2"
            placeholder="e.g., B2B SaaS founders in seed to Series A"
            value={form.audience}
            onChange={(e) => handleChange('audience', e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Goal</label>
          <input
            className="w-full rounded border px-3 py-2"
            placeholder="e.g., Spark discussion, generate demo requests"
            value={form.goal}
            onChange={(e) => handleChange('goal', e.target.value)}
          />
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Hook</label>
            <select
              className="w-full rounded border px-3 py-2"
              value={form.hook}
              onChange={(e) => handleChange('hook', e.target.value as GenerationRequest['hook'])}
            >
              <option>Data</option>
              <option>Question</option>
              <option>Contrarian</option>
              <option>Story</option>
            </select>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Variants</label>
            <input
              type="number"
              min={1}
              max={3}
              className="w-full rounded border px-3 py-2"
              value={form.variants}
              onChange={(e) => handleChange('variants', Math.max(1, Math.min(3, Number(e.target.value))))}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Include</label>
            <div className="flex items-center gap-4 px-1 py-2">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.emojis} onChange={(e) => handleChange('emojis', e.target.checked)} /> Emojis</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.hashtags} onChange={(e) => handleChange('hashtags', e.target.checked)} /> Hashtags</label>
            </div>
          </div>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Call to Action</label>
          <input
            className="w-full rounded border px-3 py-2"
            placeholder="e.g., Comment for the template / DM to get the checklist"
            value={form.cta}
            onChange={(e) => handleChange('cta', e.target.value)}
          />
        </div>

        <div className="pt-2">
          <button
            disabled={!isValid || loading}
            onClick={() => onGenerate(form)}
            className="inline-flex items-center justify-center rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? 'Generating?' : 'Generate posts'}
          </button>
        </div>
      </div>
    </div>
  );
}
