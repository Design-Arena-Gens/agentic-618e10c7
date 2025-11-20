"use client";

import { useState } from 'react';
import PostForm, { GenerationRequest } from '@/components/PostForm';
import PostCard from '@/components/PostCard';

export type GeneratedResult = {
  variants: string[];
  meta: {
    topic: string;
    tone: string;
    audience: string;
    goal: string;
  };
};

export default function HomeClient() {
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onGenerate = async (req: GenerationRequest) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });
      if (!res.ok) {
        throw new Error(`Generation failed (${res.status})`);
      }
      const data = await res.json();
      setResult(data);
    } catch (e: any) {
      setError(e?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <PostForm onGenerate={onGenerate} loading={loading} />
        {error && (
          <p className="mt-3 text-sm text-red-600">{error}</p>
        )}
      </div>
      <div>
        <PostCard result={result} loading={loading} />
      </div>
    </div>
  );
}
