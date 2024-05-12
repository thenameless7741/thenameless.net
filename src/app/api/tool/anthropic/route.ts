import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface Payload {
  params: Anthropic.Beta.Tools.MessageCreateParamsNonStreaming;
  apiKey: string;
}

export const POST = async (req: NextRequest) => {
  const { params, apiKey }: Payload = await req.json();
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Anthropic API key is required' },
      { status: 400 },
    );
  }

  const anthropic = new Anthropic({ apiKey });

  try {
    const message = await anthropic.beta.tools.messages.create(params);
    if (message.stop_reason !== 'tool_use') {
      let description;
      if (message.content[0].type === 'text') {
        description = message.content[0].text; // type-checked
      }
      const error = { error: 'failed to create Message', description };
      return NextResponse.json(error, { status: 400 });
    }

    const block = message.content.find(
      (content): content is Anthropic.Beta.Tools.ToolUseBlock =>
        content.type === 'tool_use',
    );
    if (!block) {
      const error = { error: 'failed to find ToolUseBlock' };
      return NextResponse.json(error, { status: 400 });
    }

    return NextResponse.json(block);
  } catch (err) {
    const error = { error: 'unknown error', description: JSON.stringify(err) };
    return NextResponse.json(error, { status: 500 });
  }
};
