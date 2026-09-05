import OpenAI from 'openai';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type RequestBody = {
  business: string;
  location: string;
  adType: string;
  offer: string;
};

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'AI is not configured yet. Add OPENAI_API_KEY to your Vercel environment variables.' },
      { status: 503 }
    );
  }

  try {
    const body = (await request.json()) as RequestBody;
    if (!body.business?.trim() || !body.offer?.trim()) {
      return NextResponse.json({ error: 'Business name and promotion details are required.' }, { status: 400 });
    }

    const response = await client.responses.create({
      model: 'gpt-5.6-luna',
      input: [
        {
          role: 'system',
          content:
            'You are AdForge, an expert local advertising copywriter. Create concise, truthful, high-converting ad copy for small businesses. Never invent prices, guarantees, credentials, dates, addresses, or claims that were not supplied. Return ONLY valid JSON with keys headline, primaryText, cta, badge. Keep headline under 70 characters, primaryText under 240 characters, cta under 24 characters, and badge under 14 characters.',
        },
        {
          role: 'user',
          content: JSON.stringify({
            business: body.business,
            location: body.location,
            adType: body.adType,
            offer: body.offer,
          }),
        },
      ],
    });

    const raw = response.output_text.trim();
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
    const ad = JSON.parse(cleaned);

    return NextResponse.json({
      headline: String(ad.headline || '').slice(0, 70),
      primaryText: String(ad.primaryText || '').slice(0, 240),
      cta: String(ad.cta || 'Learn More').slice(0, 24),
      badge: String(ad.badge || 'FEATURED').slice(0, 14),
    });
  } catch (error) {
    console.error('AdForge AI generation error', error);
    return NextResponse.json({ error: 'We could not generate the ad right now. Please try again.' }, { status: 500 });
  }
}
