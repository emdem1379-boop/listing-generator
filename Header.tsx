import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getStripe } from '@/lib/stripe';
import { setProCookie } from '@/lib/auth';

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  if (!session_id) {
    notFound();
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(session_id);
  const paid = session.payment_status === 'paid' || session.status === 'complete';

  if (!paid) {
    return (
      <main className="section">
        <div className="container narrow card centeredCard">
          <h1>Payment not completed</h1>
          <p className="muted">We couldn&apos;t confirm the payment yet.</p>
          <Link href="/tool" className="button primary">Back to generator</Link>
        </div>
      </main>
    );
  }

  await setProCookie();

  return (
    <main className="section">
      <div className="container narrow card centeredCard">
        <span className="pill">Unlocked</span>
        <h1>You now have unlimited generations on this device.</h1>
        <p className="muted">
          This MVP stores access in a signed browser cookie after Stripe confirms payment.
          For multi-device accounts, add auth and a database next.
        </p>
        <Link href="/tool" className="button primary">Go to generator</Link>
      </div>
    </main>
  );
}
