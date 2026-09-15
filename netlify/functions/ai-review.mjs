import Anthropic from '@anthropic-ai/sdk';

const LANGUAGE_NAMES = {
  python: 'Python',
  c: 'C',
  javascript: 'JavaScript',
  sql: 'SQL',
};

const anthropic = new Anthropic();

export default async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  let code, language;
  try {
    const body = await req.json();
    code = body.code;
    language = body.language;
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!code || typeof code !== 'string') {
    return Response.json({ error: 'No code provided' }, { status: 400 });
  }

  const languageName = LANGUAGE_NAMES[language] || language || 'code';

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-5',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Review the following ${languageName} code. Reply using exactly these five uppercase labels, each on its own line, followed by a short explanation on the same or following lines. Keep it concise.

VERDICT: (one short line — does it work as written)
BUGS: (correctness issues, or "None found")
PERFORMANCE: (efficiency concerns, or "No concerns")
STYLE: (readability/style notes, or "Looks fine")
SUGGESTION: (one concrete improvement)

Code:
\`\`\`${language || ''}
${code}
\`\`\``,
        },
      ],
    });

    const text = message.content?.[0]?.text || '';
    return Response.json({ text });
  } catch (err) {
    return Response.json({ error: 'Failed to reach the AI review service: ' + err.message }, { status: 502 });
  }
};
