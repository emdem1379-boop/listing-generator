import Link from 'next/link';

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="container heroGrid">
          <div>
            <p className="eyebrow">Launch-ready digital product</p>
            <h1>Turn rough item details into clean listings that sell faster.</h1>
            <p className="lede">
              A simple tool for Facebook Marketplace, Craigslist, eBay, and OfferUp sellers.
              Paste a few details, get a title, price range, description, tags, and quick selling tips.
            </p>
            <div className="heroActions">
              <Link href="/tool" className="button primary">Try the generator</Link>
              <a href="#pricing" className="button secondary">See pricing</a>
            </div>
            <p className="microcopy">3 free generations, then unlock unlimited use.</p>
          </div>
          <div className="card exampleCard">
            <span className="pill">Example output</span>
            <h3>Men&apos;s XL Sierra Nevada Tee - Clean, Great Shape</h3>
            <p className="muted"><strong>Price:</strong> $15-$20</p>
            <p>
              Gently used Sierra Nevada beer t-shirt in size XL. Clean, comfortable, and in very good condition with no major flaws noted. Great casual shirt for brewery fans, collectors, or everyday wear. Ready to wear and easy to pair with jeans or shorts.
            </p>
            <p className="muted"><strong>Tags:</strong> brewery shirt, beer tee, XL shirt, graphic tee, casual wear</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container threeUp">
          <div className="card">
            <h3>Faster posting</h3>
            <p>Skip the blank-page problem and generate polished listings in seconds.</p>
          </div>
          <div className="card">
            <h3>Better copy</h3>
            <p>Get cleaner titles, more natural descriptions, and tags people actually search for.</p>
          </div>
          <div className="card">
            <h3>Simple monetization</h3>
            <p>Free trial up front, then a one-click Stripe checkout to unlock unlimited use.</p>
          </div>
        </div>
      </section>

      <section className="section alt" id="pricing">
        <div className="container pricingWrap">
          <div>
            <p className="eyebrow">Pricing</p>
            <h2>Cheap enough to try. Useful enough to keep.</h2>
            <p className="lede small">
              This MVP uses a one-time unlock. Swap the Stripe Price ID later if you want to turn it into a subscription.
            </p>
          </div>
          <div className="pricingGrid">
            <div className="card pricingCard">
              <span className="pill">Free</span>
              <h3>Starter</h3>
              <p className="price">$0</p>
              <ul>
                <li>3 listing generations</li>
                <li>Title, description, tags</li>
                <li>Price suggestion</li>
              </ul>
              <Link href="/tool" className="button secondary block">Start free</Link>
            </div>
            <div className="card pricingCard featured">
              <span className="pill">Paid</span>
              <h3>Unlimited unlock</h3>
              <p className="price">Set in Stripe</p>
              <ul>
                <li>Unlimited generations</li>
                <li>Stripe-hosted checkout</li>
                <li>Works on Vercel</li>
              </ul>
              <Link href="/tool" className="button primary block">Launch the paid version</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
