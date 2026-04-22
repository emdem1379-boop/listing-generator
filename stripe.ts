'use client';

import { useMemo, useState } from 'react';

type ListingResult = {
  title: string;
  priceSuggestion: string;
  description: string;
  tags: string[];
  category: string;
  sellingTips: string[];
};

type Props = {
  initialRemainingFreeUses: number;
  initialIsPro: boolean;
};

export function GeneratorClient({ initialRemainingFreeUses, initialIsPro }: Props) {
  const [itemName, setItemName] = useState('');
  const [condition, setCondition] = useState('Used - good');
  const [platform, setPlatform] = useState('Facebook Marketplace');
  const [notes, setNotes] = useState('');
  const [result, setResult] = useState<ListingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [remainingFreeUses, setRemainingFreeUses] = useState(initialRemainingFreeUses);
  const [isPro, setIsPro] = useState(initialIsPro);

  const canGenerate = useMemo(() => isPro || remainingFreeUses > 0, [isPro, remainingFreeUses]);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemName, condition, platform, notes }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setResult(data.result);
      setRemainingFreeUses(data.remainingFreeUses ?? remainingFreeUses);
      setIsPro(Boolean(data.isPro));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckout() {
    setCheckoutLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/create-checkout-session', { method: 'POST' });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Unable to start checkout');
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to start checkout');
      setCheckoutLoading(false);
    }
  }

  return (
    <div className="toolLayout">
      <div className="card">
        <div className="statusRow">
          <span className="pill">{isPro ? 'Pro unlocked' : `${remainingFreeUses} free uses left`}</span>
          {!isPro && <button type="button" className="button secondary small" onClick={handleCheckout} disabled={checkoutLoading}>{checkoutLoading ? 'Opening checkout...' : 'Unlock unlimited'}</button>}
        </div>

        <form onSubmit={handleGenerate} className="formStack">
          <label>
            <span>Item name</span>
            <input value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="Logitech G920 racing wheel" required />
          </label>

          <div className="twoCol">
            <label>
              <span>Condition</span>
              <select value={condition} onChange={(e) => setCondition(e.target.value)}>
                <option>New</option>
                <option>Open box</option>
                <option>Used - like new</option>
                <option>Used - good</option>
                <option>Used - fair</option>
                <option>For parts</option>
              </select>
            </label>

            <label>
              <span>Platform</span>
              <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
                <option>Facebook Marketplace</option>
                <option>Craigslist</option>
                <option>eBay</option>
                <option>OfferUp</option>
              </select>
            </label>
          </div>

          <label>
            <span>Notes</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Size XL, clean, no stains, works great, includes cords, pickup only..."
              rows={7}
            />
          </label>

          <button className="button primary" disabled={loading || !canGenerate}>
            {loading ? 'Generating...' : canGenerate ? 'Generate listing' : 'Unlock to continue'}
          </button>

          {error && <p className="errorText">{error}</p>}
        </form>
      </div>

      <div className="card outputCard">
        <h2>Your listing</h2>
        {!result ? (
          <p className="muted">Your generated listing will show up here.</p>
        ) : (
          <div className="outputStack">
            <div>
              <p className="label">Title</p>
              <p>{result.title}</p>
            </div>
            <div>
              <p className="label">Price suggestion</p>
              <p>{result.priceSuggestion}</p>
            </div>
            <div>
              <p className="label">Category</p>
              <p>{result.category}</p>
            </div>
            <div>
              <p className="label">Description</p>
              <p>{result.description}</p>
            </div>
            <div>
              <p className="label">Tags</p>
              <div className="tagWrap">
                {result.tags.map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="label">Selling tips</p>
              <ul>
                {result.sellingTips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
