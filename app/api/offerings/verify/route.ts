import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function POST(req: NextRequest) {
  const { reference } = await req.json();
  if (!reference) return NextResponse.json({ error: 'Reference required' }, { status: 400 });

  try {
    const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();

    if (!data.status) {
      return NextResponse.json({ success: false, error: 'Paystack verification failed' }, { status: 400 });
    }

    const tx = data.data;

    if (tx?.status === 'success') {
      const amountNaira = tx.amount / 100; // Convert kobo back to naira

      await sql`
        UPDATE offerings SET
          status        = 'success',
          paystack_ref  = ${tx.reference},
          channel       = ${tx.channel || null},
          paid_at       = ${tx.paid_at || new Date().toISOString()},
          amount        = ${amountNaira},
          donor_name    = COALESCE(
                            NULLIF(${tx.customer?.first_name
                              ? (tx.customer.first_name + ' ' + (tx.customer.last_name || '')).trim()
                              : null}, ''),
                            donor_name
                          ),
          donor_email   = COALESCE(NULLIF(${tx.customer?.email || null}, ''), donor_email)
        WHERE reference = ${reference}
      `;

      return NextResponse.json({
        success: true,
        amount: amountNaira,
        currency: tx.currency,
        reference: tx.reference,
        channel: tx.channel,
      });

    } else {
      // Payment was not successful (abandoned, failed, etc.)
      await sql`
        UPDATE offerings SET status = 'failed', paid_at = NOW()
        WHERE reference = ${reference}
      `;
      return NextResponse.json({ success: false, status: tx?.status });
    }

  } catch (error) {
    console.error('Paystack verify error:', error);
    return NextResponse.json({ error: 'Verification request failed' }, { status: 500 });
  }
}
