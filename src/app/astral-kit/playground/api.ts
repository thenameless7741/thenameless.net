import Anthropic from '@anthropic-ai/sdk';

import store from '../store';

interface ChatParams {
  messages: Anthropic.Messages.MessageParam[];
  system?: string;
  temperature?: number;
  handleStream: (chunk: string) => void;
  handleDone: () => void;
  abort?: AbortController;
}

export const chat = async ({
  messages,
  system,
  temperature = 0,
  handleStream,
  handleDone,
  abort = new AbortController(),
}: ChatParams) => {
  const params: Anthropic.MessageCreateParamsStreaming = {
    max_tokens: 2048,
    messages,
    model: 'claude-3-haiku-20240307', // claude-3-sonnet-20240229, claude-3-opus-20240229
    stream: true,
    system,
    temperature,
  };

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const { showMetric } = store.getState();

    const res = await fetch(`${baseUrl}/api/chat/anthropic`, {
      body: JSON.stringify({
        params,
        apiKey: '', // TODO: implement UI for storing user's API key
        metric: showMetric,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      signal: abort.signal,
    });
    if (!res.body) throw Error('playground: response body is empty'); // TODO: error handling

    if (res.status !== 200) {
      const { error } = await res.json();
      throw Error(error); // TODO: error handling
    }

    const reader = res.body.getReader();
    const textDecoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = textDecoder.decode(value, { stream: true });
      handleStream(chunk);
    }
    reader.releaseLock();
  } catch (err) {
    let abortErr = false;
    if (typeof err === 'object') {
      const e = err as object;
      abortErr = 'name' in e && e.name === 'AbortError';
    }
    if (!abortErr) throw err;
  } finally {
    handleDone();
  }
};

interface ToolParams {
  messages: Anthropic.Beta.Tools.ToolsBetaMessageParam[];
  tools: Anthropic.Beta.Tools.Tool[];
  temperature?: number;
  abort?: AbortController;
}

export const tool = async <T>({
  messages,
  tools,
  temperature = 0,
  abort = new AbortController(),
}: ToolParams): Promise<T> => {
  const params: Anthropic.Beta.Tools.MessageCreateParamsNonStreaming = {
    max_tokens: 1024,
    messages,
    model: 'claude-3-haiku-20240307', // claude-3-sonnet-20240229, claude-3-opus-20240229
    temperature,
    tools,
  };

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const res = await fetch(`${baseUrl}/api/tool/anthropic`, {
      body: JSON.stringify({
        apiKey: '', // TODO: implement UI for storing user's API key
        params,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      signal: abort.signal,
    });
    if (!res.body) throw Error('playground: response body is empty'); // TODO: error handling

    if (res.status !== 200) {
      return await res.json();
    }

    const tool: T = await res.json();
    return tool;
  } catch (err) {
    let abortErr = false;
    if (typeof err === 'object') {
      const e = err as object;
      abortErr = 'name' in e && e.name === 'AbortError';
    }
    if (abortErr) return { error: 'aborted' } as T;

    return { error: 'unknown error', description: JSON.stringify(err) } as T;
  }
};
