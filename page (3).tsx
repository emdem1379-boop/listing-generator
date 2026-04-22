import { NextResponse } from 'next/server';
import { consumeFreeUse, getRemainingFreeUses } from '@/lib/usage';
import { generateListing } from '@/lib/openai';
import { isProUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const itemName = String(body.itemName || '').trim();
    const condition = String(body.condition || '').trim();
    const platform = String(body.platform || '').trim();
    const notes = String(body.notes || '').trim();

    if (!itemName) {
      return NextResponse.json({ error: 'Item name is required.' }, { status: 400 });
    }

    const pro = await isProUser();
    const remainingFreeUses = await getRemainingFreeUses();

    if (!pro && remainingFreeUses <= 0) {
      return NextResponse.json(
        { error: 'You used all free generations. Unlock unlimited to continue.' },
        { status: 402 },
      );
    }

    const result = await generateListing({ itemName, condition, platform, notes });

    if (!pro) {
      await consumeFreeUse();
    }

    const updatedRemaining = pro ? remainingFreeUses : Math.max(0, remainingFreeUses - 1);

    return NextResponse.json({
      result,
      remainingFreeUses: updatedRemaining,
      isPro: pro,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Generation failed. Check your OpenAI API key and model name.' },
      { status: 500 },
    );
  }
}
