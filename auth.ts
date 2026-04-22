import { GeneratorClient } from './GeneratorClient';
import { getRemainingFreeUses } from '@/lib/usage';
import { isProUser } from '@/lib/auth';

export default async function ToolPage() {
  const [remainingFreeUses, pro] = await Promise.all([getRemainingFreeUses(), isProUser()]);

  return (
    <main className="section">
      <div className="container narrow">
        <div className="pageIntro">
          <p className="eyebrow">Generator</p>
          <h1>Build a listing in under a minute.</h1>
          <p className="lede small">
            This MVP is text-first on purpose: fewer moving parts, easier deployment, and fast validation.
            Add image upload after you confirm people will pay for it.
          </p>
        </div>
        <GeneratorClient initialRemainingFreeUses={remainingFreeUses} initialIsPro={pro} />
      </div>
    </main>
  );
}
