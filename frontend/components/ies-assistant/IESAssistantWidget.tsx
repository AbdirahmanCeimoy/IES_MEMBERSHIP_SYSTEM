'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { site } from '@/config/site';
import { sendAssistantMessage, type AssistantSource, type AssistantTurn } from '@/lib/assistantApi';

const SUGGESTED_QUESTIONS = [
  'What is IES?',
  'How can I become an IES member?',
  'What membership categories are available?',
  'What services does IES provide?',
  'Which official documents are available?',
];

const WELCOME_MESSAGE =
  "I'm IES's AI Virtual Assistant, ready to assist you. How may I assist you today?";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: AssistantSource[];
}

const randomId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function IESAssistantWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const inputId = useId();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to latest message when a new one arrives.
  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, open]);

  // Esc closes the panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const reset = useCallback(() => {
    setMessages([]);
    setInput('');
  }, []);

  const askAssistant = useCallback(
    async (question: string) => {
      const trimmed = question.trim();
      if (!trimmed || sending) return;

      const userMsg: Message = { id: randomId(), role: 'user', content: trimmed };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setSending(true);

      const history: AssistantTurn[] = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await sendAssistantMessage(trimmed, history.slice(0, -1));
      setSending(false);

      setMessages((prev) => [
        ...prev,
        {
          id: randomId(),
          role: 'assistant',
          content: res.reply,
          sources: res.sources,
        },
      ]);
    },
    [messages, sending],
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void askAssistant(input);
  };

  return (
    <>
      {/* Floating launcher — always visible */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open IES AI Assistant"
          title="Open IES AI Assistant"
          className="fixed bottom-5 right-5 z-[70] inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#035CB3] text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#024790] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#48C184] sm:bottom-6 sm:right-6"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className="sr-only">Open IES AI Assistant</span>
        </button>
      )}

      {/* Panel */}
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-label="IES AI Assistant"
          className="fixed bottom-5 right-5 z-[70] flex w-[calc(100vw-2rem)] max-w-[400px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:bottom-6 sm:right-6"
          style={{ height: 'min(640px, calc(100dvh - 100px))' }}
        >
          {/* Header */}
          <header className="flex items-center gap-3 bg-[#035CB3] px-4 py-3 text-white">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white p-1">
              <Image src={site.logo} alt="IES" fill className="object-contain" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold leading-tight">IES AI Assistant</p>
              <p className="truncate text-[11px] text-white/80 leading-tight">Virtual Assistant · Online</p>
            </div>
            <button
              type="button"
              onClick={reset}
              title="New conversation"
              aria-label="New conversation"
              className="rounded-md p-1.5 text-white/90 transition-colors hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15A9 9 0 1 1 5.64 5.64L23 10" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              title="Close"
              aria-label="Close assistant"
              className="rounded-md p-1.5 text-white/90 transition-colors hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </header>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-slate-50 px-4 py-4">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-start text-center">
                <div className="relative mt-2 h-20 w-20 overflow-hidden rounded-2xl bg-white p-2 shadow-sm">
                  <Image src={site.logo} alt="IES" fill className="object-contain" />
                </div>
                <h2 className="mt-3 text-sm font-bold text-[#022D5A]">IES AI Assistant</h2>
                <p className="mt-1.5 max-w-[280px] text-xs leading-relaxed text-slate-600">
                  {WELCOME_MESSAGE}
                </p>

                <div className="mt-5 flex w-full flex-col gap-2">
                  <p className="text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Suggested questions
                  </p>
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => void askAssistant(q)}
                      disabled={sending}
                      className="rounded-lg border border-[#035CB3]/20 bg-[#035CB3]/5 px-3 py-2 text-left text-xs font-medium text-[#035CB3] transition-colors hover:border-[#035CB3]/40 hover:bg-[#035CB3]/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <ul className="flex flex-col gap-3">
                {messages.map((m) => (
                  <li
                    key={m.id}
                    className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
                  >
                    <div
                      className={
                        m.role === 'user'
                          ? 'max-w-[85%] rounded-2xl rounded-br-sm bg-[#035CB3] px-3 py-2 text-sm text-white shadow-sm'
                          : 'max-w-[90%] rounded-2xl rounded-bl-sm bg-white px-3 py-2 text-sm text-slate-800 shadow-sm ring-1 ring-slate-100'
                      }
                    >
                      <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                      {m.role === 'assistant' && m.sources && m.sources.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5 border-t border-slate-100 pt-2">
                          {m.sources.map((s) => (
                            <Link
                              key={s.href}
                              href={s.href}
                              className="inline-flex items-center gap-1 rounded-full bg-[#48C184]/15 px-2 py-0.5 text-[10px] font-semibold text-[#2d7a50] hover:bg-[#48C184]/25"
                              onClick={() => setOpen(false)}
                            >
                              {s.title}
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <polyline points="9 18 15 12 9 6" />
                              </svg>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </li>
                ))}

                {sending && (
                  <li className="flex justify-start">
                    <div className="rounded-2xl rounded-bl-sm bg-white px-3 py-2 text-sm text-slate-500 shadow-sm ring-1 ring-slate-100">
                      <span className="inline-flex items-center gap-1">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#035CB3]" style={{ animationDelay: '0ms' }} />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#035CB3]" style={{ animationDelay: '120ms' }} />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#035CB3]" style={{ animationDelay: '240ms' }} />
                      </span>
                    </div>
                  </li>
                )}

                <div ref={messagesEndRef} />
              </ul>
            )}
          </div>

          {/* Composer */}
          <form onSubmit={handleSubmit} className="border-t border-slate-200 bg-white p-3">
            <label htmlFor={inputId} className="sr-only">
              Ask the IES AI Assistant
            </label>
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 pl-4 pr-1 focus-within:border-[#035CB3] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#035CB3]/20">
              <input
                id={inputId}
                type="text"
                autoComplete="off"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about IES, membership, events…"
                disabled={sending}
                className="h-10 flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none disabled:opacity-70"
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                aria-label="Send"
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#035CB3] text-white transition-colors hover:bg-[#024790] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
            <p className="mt-1.5 text-center text-[9px] text-slate-400">
              Answers are AI-generated. Verify important details with IES Secretariat.
            </p>
          </form>
        </div>
      )}
    </>
  );
}
