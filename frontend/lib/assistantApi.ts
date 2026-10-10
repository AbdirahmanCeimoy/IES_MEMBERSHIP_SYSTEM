import { apiJsonRequest } from './apiClient';

export interface AssistantSource {
  title: string;
  href: string;
}

export interface AssistantTurn {
  role: 'user' | 'assistant';
  content: string;
}

export interface AssistantChatResponse {
  success: boolean;
  reply: string;
  sources?: AssistantSource[];
  model?: string;
}

export const sendAssistantMessage = async (
  message: string,
  history: AssistantTurn[],
): Promise<AssistantChatResponse> => {
  const trimmedHistory = history.slice(-16).map((turn) => ({
    role: turn.role,
    content: turn.content,
  }));

  const res = await apiJsonRequest<AssistantChatResponse>(
    '/assistant/chat',
    'POST',
    { message, history: trimmedHistory },
  );

  if (res.ok && res.data) {
    return res.data;
  }

  // Fall through with a safe default so the UI never shows nothing.
  return {
    success: false,
    reply:
      res.status === 429
        ? "You're sending questions a bit fast — please wait a moment and try again."
        : "Sorry, I ran into a problem answering that. Please try again in a moment, or contact info@iesomalia.org.so for help.",
  };
};
