'use client';

import { useMemo, useState } from 'react';

type AdType = { name: string; icon: string; desc: string };
const adTypes: AdType[] = [
  { name: 'Sale / Promotion', icon: '%', desc: 'Discounts, specials, limited-time offers' },
  { name: 'Product / Service', icon: '◆', desc: 'Showcase what your business sells' },
  { name: 'Event', icon: '◷', desc: 'Drive attendance to an upcoming event' },
  { name: 'Grand Opening', icon: '★', desc: 'Introduce a new location or business' },
  { name: 'Hiring', icon: '+', desc: 'Find the right people for your team' },
  { name: 'Awareness', icon: '◎', desc: 'Put your business in front of more locals' },
];

const packages = [
  { name: 'Quick Blast', price: 5, reach: '1,000+ local impressions', featured: false },
  { name: 'Local Blast', price: 10, reach: '2,500+ local impressions', featured: true },
  { name: 'Power Blast', price: 25, reach: '7,500+ local impressions', featured: false },
];

export default function Home() {
  const [view, setView] = useState<'home' | 'create'>('home');
  const [step, setStep] = useState(1);
  const [business, setBusiness] = useState('');
  const [offer, setOffer] = useState('');
  const [location, setLocation] = useState('');
  const [adType, setAdType] = useState('Sale / Promotion');
  const [selectedPackage, setSelectedPackage] = useState('Local Blast');
  const [headline, setHeadline] = useState('Your next customer is closer than you think.');
  const [primaryText, setPrimaryText] = useState('Create a message that gets your local customers to stop, look, and act.');
  const [cta, setCta] = useState('Get Offer');
  const [badge, setBadge] = useState('SAVE');
  const [generating, setGenerating] = useState(false);
  const [aiError, setAiError] = useState('');

  const selected = useMemo(() => packages.find((p) => p.name === selectedPackage)!, [selectedPackage]);

  function start() { setView('create'); setStep(1); }
  function reset() { setView('home'); setStep(1); }

  async function generateAd() {
    setGenerating(true);
    setAiError('');
    try {
      const response = await fetch('/api/generate-ad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business, location, adType, offer }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to generate ad.');
      setHeadline(data.headline);
      setPrimaryText(data.primaryText);
      setCta(data.cta);
      setBadge(data.badge);
    } catch (error) {
      setAiError(error instanceof Error ? error.message : 'Unable to generate ad.');
    } finally {
      setGenerating(false);
    }
  }

  if (view === 'create') {
    return (
      <main className="app-shell">
        <header className="topbar">
          <button className="brand" onClick={reset}>Ad<span>Forge</span></button>
          <div className="topbar-right"><span className="save-pill">● Draft saved</span><button className="text-button" onClick={reset}>Exit</button></div>
        </header>
        <div className="wizard-wrap">
          <div className="wizard-head">
            <div><p className="eyebrow">CREATE YOUR AD</p><h1>{step === 1 ? 'Tell us about your ad.' : step === 2 ? 'Choose your campaign.' : 'Make it yours.'}</h1><p className="muted">Step {step} of 3 · AdForge handles the complicated stuff.</p></div>
            <div className="progress"><div style={{ width: `${(step / 3) * 100}%` }} /></div>
          </div>

          {step === 1 && <section className="card wizard-card">
            <label>What are you promoting?</label>
            <div className="type-grid">{adTypes.map((type) => <button key={type.name} className={`type-card ${adType === type.name ? 'selected' : ''}`} onClick={() => setAdType(type.name)}><span className="type-icon">{type.icon}</span><span><strong>{type.name}</strong><small>{type.desc}</small></span></button>)}</div>
            <div className="form-grid"><div><label htmlFor="business">Business name</label><input id="business" placeholder="e.g. Green's Auto Care" value={business} onChange={(e) => setBusiness(e.target.value)} /></div><div><label htmlFor="location">Target location</label><input id="location" placeholder="e.g. Elberton, GA + 25 miles" value={location} onChange={(e) => setLocation(e.target.value)} /></div></div>
            <label htmlFor="offer">What should people know?</label><textarea id="offer" rows={4} placeholder="Describe your offer, product, event, or message in a sentence or two..." value={offer} onChange={(e) => setOffer(e.target.value)} />
            <div className="actions"><span className="muted">You can change everything later.</span><button className="primary" onClick={() => setStep(2)}>Continue <span>→</span></button></div>
          </section>}

          {step === 2 && <section className="card wizard-card"><div className="section-title"><div><label>Choose your blast</label><p className="muted">Start small or put more fuel behind the campaign.</p></div></div><div className="package-grid">{packages.map((p) => <button key={p.name} className={`package-card ${selectedPackage === p.name ? 'selected' : ''}`} onClick={() => setSelectedPackage(p.name)}>{p.featured && <span className="popular">MOST POPULAR</span>}<span className="package-name">{p.name}</span><span className="price"><b>${p.price}</b><small> one-time</small></span><span className="reach">✓ {p.reach}</span><span className="reach">✓ AI creative included</span><span className="reach">✓ Campaign reporting</span></button>)}</div><div className="actions"><button className="secondary" onClick={() => setStep(1)}>← Back</button><button className="primary" onClick={() => setStep(3)}>Customize <span>→</span></button></div></section>}

          {step === 3 && <section className="preview-layout"><div className="card wizard-card"><div className="section-title"><div><label>Your ad preview</label><p className="muted">Generate polished copy with AdForge AI, then edit it yourself.</p></div><span className="ai-pill">✦ AI POWERED</span></div>
            <div className="ai-controls">
              <button className="primary ai-button" onClick={generateAd} disabled={generating || !business || !offer}>{generating ? 'Creating your ad…' : '✦ Generate with AI'}</button>
              {!business || !offer ? <span className="helper">Add your business name and promotion details in Step 1 first.</span> : <span className="helper">AI uses your details to write the ad. You can edit everything below.</span>}
              {aiError && <div className="ai-error">{aiError}</div>}
            </div>
            <div className="ad-preview"><div className="preview-top"><span>{business || 'YOUR BUSINESS'}</span><span>SPONSORED</span></div><div className="creative"><input className="badge-input" value={badge} onChange={(e) => setBadge(e.target.value)} aria-label="Ad badge" /><input className="creative-headline" value={headline} onChange={(e) => setHeadline(e.target.value)} aria-label="Ad headline" /><textarea className="creative-copy" value={primaryText} onChange={(e) => setPrimaryText(e.target.value)} aria-label="Ad primary text" rows={3} /><input className="cta-input" value={cta} onChange={(e) => setCta(e.target.value)} aria-label="Call to action" /></div></div>
            <div className="actions"><button className="secondary" onClick={() => setStep(2)}>← Back</button><button className="primary" onClick={() => alert(`Demo campaign ready: ${selected.name}`)}>Review ${selected.price} Blast <span>→</span></button></div></div><aside className="card summary"><p className="eyebrow">CAMPAIGN SUMMARY</p><h3>{business || 'Your Business'}</h3><div className="summary-row"><span>Ad type</span><b>{adType}</b></div><div className="summary-row"><span>Location</span><b>{location || 'Local area'}</b></div><div className="summary-row"><span>Package</span><b>{selected.name}</b></div><div className="total"><span>Total</span><b>${selected.price}</b></div><p className="fine">No subscription required. You'll review your campaign before any charge is made.</p></aside></section>}
        </div>
      </main>
    );
  }

  return <main className="landing"><nav className="nav"><button className="brand" onClick={reset}>Ad<span>Forge</span></button><div className="nav-links"><a href="#how">How it works</a><a href="#pricing">Pricing</a><button className="sign-in">Sign in</button></div></nav><section className="hero"><div className="hero-badge"><span>✦</span> Advertising made simple</div><h1>Create an ad.<br/><em>Blast it.</em> Grow your business.</h1><p>Professional advertising for small businesses, without the agency price tag or the advertising degree.</p><div className="hero-actions"><button className="primary large" onClick={start}>Create your first ad <span>→</span></button><a className="secondary large" href="#how">See how it works</a></div><div className="trust"><span>✓ No subscription</span><span>✓ Launch in minutes</span><span>✓ From $5</span></div></section><section id="how" className="features"><div className="section-kicker">WHY ADFORGE</div><h2>Advertising without the headache.</h2><div className="feature-grid"><article><div className="feature-icon">✦</div><h3>AI does the heavy lifting</h3><p>Give us the basics. AdForge turns your idea into polished ad copy and creative ready for customers.</p></article><article><div className="feature-icon">◈</div><h3>Make it your brand</h3><p>Adjust your message, offer, audience, location, colors, and imagery before you spend a dollar.</p></article><article><div className="feature-icon">↗</div><h3>One simple blast</h3><p>No confusing ad manager. Pick a package, review your campaign, and launch.</p></article></div></section><section id="pricing" className="pricing"><div><div className="section-kicker">SIMPLE PRICING</div><h2>Start with a few bucks.</h2><p>Test an idea, promote a special, or reach your neighborhood without committing to a monthly plan.</p></div><div className="price-strip">{packages.map((p) => <div key={p.name}><span>{p.name}</span><strong>${p.price}</strong></div>)}</div></section><footer><button className="brand" onClick={reset}>Ad<span>Forge</span></button><span>Built for the businesses that keep communities moving.</span></footer></main>;
}
