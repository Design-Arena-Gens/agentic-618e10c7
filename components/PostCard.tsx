"use client";

import { useMemo } from 'react';
import type { GeneratedResult } from '@/components/HomeClient';

function copyText(text: string) {
  navigator.clipboard.writeText(text);
}

function downloadText(text: string, filename: string) {
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function PostCard({ result, loading }: { result: GeneratedResult | null; loading: boolean; }) {
  const hasResult = !!result && result.variants.length > 0;

  const header = useMemo(() => {
    if (!result) return '';
    const { topic, tone } = result.meta;
    return `${tone} post on: ${topic}`;
  }, [result]);

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm min-h-[200px]">
      <h2 className="text-lg font-semibold mb-2">Preview</h2>
      {!hasResult && (
        <div className="text-sm text-gray-600">
          {loading ? 'Generating your posts?' : 'Your posts will appear here after generation.'}
        </div>
      )}

      {hasResult && (
        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-500">{header}</p>
          </div>
          {result!.variants.map((v, idx) => (
            <div key={idx} className="rounded-lg border p-4">
              <pre className="whitespace-pre-wrap text-sm leading-6">{v}</pre>
              <div className="mt-3 flex items-center gap-2">
                <button
                  className="rounded border px-3 py-1.5 text-sm hover:bg-gray-50"
                  onClick={() => copyText(v)}
                >Copy</button>
                <button
                  className="rounded border px-3 py-1.5 text-sm hover:bg-gray-50"
                  onClick={() => downloadText(v, `linkedin-post-${idx + 1}.txt`)}
                >Download</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
