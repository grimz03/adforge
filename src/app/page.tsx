'use client';

import { useEffect, useMemo, useState } from 'react';

type AdType = { name: string; icon: string; desc: string };
type SavedAd = { id: string; business: string; adType: string; location: string; packageName: string; price: number; headline: string; createdAt: string; status: string };

type Profile = { business: string; logo: string; phone: string; website: string; address: string; socials: string; description: string };

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

const emptyProfile: Profile = { business: '', logo: '', phone: '', website: '', address: '', socials: '', description: '' };

export default function Home() {
  const [view, setView] = useState<'home' | 'dashboard' | 'create' | 'profile'>('home');
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [ads, setAds] = useState<SavedAd[]>([]);
  const [signedIn, setSignedIn] = useState(false);
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

  useEffect(() => {
    const savedProfile = localStorage.getItem('cataply_profile');
    const savedAds = localStorage.getItem('cataply_ads');
    const savedSignIn = localStorage.getItem('cataply_signed_in');
    if (savedProfile) setProfile(JSON.parse(savedProfile));
    if (savedAds) setAds(JSON.parse(savedAds));
    if (savedSignIn === 'true') setSignedIn(true);
  }, []);

  const selected = useMemo(() => packages.find((p) => p.name === selectedPackage)!, [selectedPackage]);

  function openCreate() {
    setView('create'); setStep(1);
    if (profile.business) setBusiness(profile.business);
    if (profile.address) setLocation(profile.address);
  }

  function signInDemo() {
    setSignedIn(true); localStorage.setItem('cataply_signed_in', 'true'); setView('dashboard');
  }

  function signOut() {
    setSignedIn(false); localStorage.removeItem('cataply_signed_in'); setView('home');
  }

  function saveProfile() {
    localStorage.setItem('cataply_profile', JSON.stringify(profile));
    setBusiness(profile.business); setView('dashboard');
  }

  function saveAd() {
    const ad: SavedAd = {
      id: crypto.randomUUID(), business: business || profile.business || 'Your Business', adType,
      location: location || profile.address || 'Local area', packageName: selected.name, price: selected.price,
      headline, createdAt: new Date().toLocaleDateString(), status: 'Draft'
    };
    const next = [ad, ...ads];
    setAds(next); localStorage.setItem('cataply_ads', JSON.stringify(next));
    setView('dashboard'); setStep(1);
  }

  async function generateAd() {
    setGenerating(true); setAiError('');
    try {
      const response = await fetch('/api/generate-ad', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ business: business || profile.business, location, adType, offer }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to generate ad.');
      setHeadline(data.headline); setPrimaryText(data.primaryText); setCta(data.cta); setBadge(data.badge);
    } catch (error) { setAiError(error instanceof Error ? error.message : 'Unable to generate ad.'); }
    finally { setGenerating(false); }
  }

  const Brand = () => <button className="brand" onClick={() => setView('home')}>Cata<span>ply</span></button>;

  if (view === 'dashboard') return <main className="app-shell"><header className="topbar"><Brand /><div className="topbar-right"><button className="text-button" onClick={() => setView('profile')}>Business Profile</button><button className="text-button" onClick={signOut}>Sign out</button></div></header><div className="dashboard-wrap"><div className="dashboard-hero"><div><p className="eyebrow">YOUR CATAPLY DASHBOARD</p><h1>Put your business in motion.</h1><p className="muted">Create ads, keep your business details ready, and track every campaign in one place.</p></div><button className="primary large" onClick={openCreate}>Create an ad <span>→</span></button></div><div className="dashboard-grid"><section className="card dashboard-card"><div className="section-title"><div><label>Recent campaigns</label><p className="muted">Your saved ads and campaign drafts.</p></div><span className="count-pill">{ads.length}</span></div>{ads.length === 0 ? <div className="empty-state"><div className="empty-icon">✦</div><h3>Your first campaign starts here.</h3><p>Create an ad and save it to your dashboard.</p><button className="primary" onClick={openCreate}>Create your first ad</button></div> : <div className="campaign-list">{ads.map((ad) => <div className="campaign" key={ad.id}><div className="campaign-icon">{ad.adType === 'Sale / Promotion' ? '%' : '✦'}</div><div className="campaign-main"><strong>{ad.headline}</strong><span>{ad.business} · {ad.location}</span></div><div className="campaign-meta"><b>${ad.price}</b><span>{ad.status}</span></div></div>)}</div>}</section><aside className="card profile-card"><p className="eyebrow">BUSINESS PROFILE</p><div className="profile-avatar">{(profile.business || 'C').slice(0, 1).toUpperCase()}</div><h2>{profile.business || 'Set up your business'}</h2><p className="muted">{profile.description || 'Save your business details once, then reuse them across every ad.'}</p><button className="secondary full" onClick={() => setView('profile')}>{profile.business ? 'Edit profile' : 'Set up profile'} <span>→</span></button></aside></div></div></main>;

  if (view === 'profile') return <main className="app-shell"><header className="topbar"><Brand /><div className="topbar-right"><button className="text-button" onClick={() => setView(signedIn ? 'dashboard' : 'home')}>← Back</button></div></header><div className="wizard-wrap profile-wrap"><div className="wizard-head"><div><p className="eyebrow">BUSINESS PROFILE</p><h1>Tell Cataply about your business.</h1><p className="muted">We'll reuse these details whenever you create an ad.</p></div></div><section className="card wizard-card"><div className="form-grid"><div><label>Business name</label><input value={profile.business} placeholder="e.g. Green's Auto Care" onChange={e => setProfile({...profile, business:e.target.value})}/></div><div><label>Phone</label><input value={profile.phone} placeholder="(555) 555-5555" onChange={e => setProfile({...profile, phone:e.target.value})}/></div><div><label>Website</label><input value={profile.website} placeholder="https://yourbusiness.com" onChange={e => setProfile({...profile, website:e.target.value})}/></div><div><label>Social links</label><input value={profile.socials} placeholder="Facebook, Instagram, etc." onChange={e => setProfile({...profile, socials:e.target.value})}/></div></div><label>Business address / service area</label><input value={profile.address} placeholder="Elberton, GA" onChange={e => setProfile({...profile, address:e.target.value})}/><label>Business description</label><textarea rows={4} value={profile.description} placeholder="What does your business do? Who do you serve?" onChange={e => setProfile({...profile, description:e.target.value})}/><div className="actions"><span className="muted">Your profile is stored in this browser for v0.3.</span><button className="primary" onClick={saveProfile}>Save profile <span>→</span></button></div></section></div></main>;

  if (view === 'create') return <main className="app-shell"><header className="topbar"><Brand /><div className="topbar-right"><span className="save-pill">● Draft saved</span><button className="text-button" onClick={() => setView(signedIn ? 'dashboard' : 'home')}>Exit</button></div></header><div className="wizard-wrap"><div className="wizard-head"><div><p className="eyebrow">CREATE YOUR AD</p><h1>{step === 1 ? 'Tell us about your ad.' : step === 2 ? 'Choose your campaign.' : 'Make it yours.'}</h1><p className="muted">Step {step} of 3 · Cataply handles the complicated stuff.</p></div><div className="progress"><div style={{width:`${step/3*100}%`}}/></div></div>{step === 1 && <section className="card wizard-card"><label>What are you promoting?</label><div className="type-grid">{adTypes.map(type => <button key={type.name} className={`type-card ${adType===type.name?'selected':''}`} onClick={()=>setAdType(type.name)}><span className="type-icon">{type.icon}</span><span><strong>{type.name}</strong><small>{type.desc}</small></span></button>)}</div><div className="form-grid"><div><label>Business name</label><input placeholder="e.g. Green's Auto Care" value={business} onChange={e=>setBusiness(e.target.value)}/></div><div><label>Target location</label><input placeholder="e.g. Elberton, GA + 25 miles" value={location} onChange={e=>setLocation(e.target.value)}/></div></div><label>What should people know?</label><textarea rows={4} placeholder="Describe your offer, product, event, or message in a sentence or two..." value={offer} onChange={e=>setOffer(e.target.value)}/><div className="actions"><button className="secondary" onClick={()=>setView(signedIn?'dashboard':'home')}>Cancel</button><button className="primary" disabled={!business||!offer} onClick={()=>setStep(2)}>Continue <span>→</span></button></div></section>}{step===2 && <section className="card wizard-card"><div className="section-title"><div><label>Choose your campaign</label><p className="muted">Start small or put more fuel behind the campaign.</p></div></div><div className="package-grid">{packages.map(p=><button key={p.name} className={`package-card ${selectedPackage===p.name?'selected':''}`} onClick={()=>setSelectedPackage(p.name)}>{p.featured&&<span className="popular">MOST POPULAR</span>}<span className="package-name">{p.name}</span><span className="price"><b>${p.price}</b><small> one-time</small></span><span className="reach">✓ {p.reach}</span><span className="reach">✓ AI creative included</span><span className="reach">✓ Campaign reporting</span></button>)}</div><div className="actions"><button className="secondary" onClick={()=>setStep(1)}>← Back</button><button className="primary" onClick={()=>setStep(3)}>Customize <span>→</span></button></div></section>}{step===3 && <section className="preview-layout"><div className="card wizard-card"><div className="section-title"><div><label>Your ad preview</label><p className="muted">Generate polished copy with Cataply AI, then edit it yourself.</p></div><span className="ai-pill">✦ AI POWERED</span></div><div className="ai-controls"><button className="primary ai-button" onClick={generateAd} disabled={generating||!business||!offer}>{generating?'Creating your ad…':'✦ Generate with AI'}</button><span className="helper">AI writes the first draft. You stay in control.</span>{aiError&&<div className="ai-error">{aiError}</div>}</div><div className="ad-preview"><div className="preview-top"><span>{business||'YOUR BUSINESS'}</span><span>SPONSORED</span></div><div className="creative"><input className="badge-input" value={badge} onChange={e=>setBadge(e.target.value)}/><input className="creative-headline" value={headline} onChange={e=>setHeadline(e.target.value)}/><textarea className="creative-copy" value={primaryText} onChange={e=>setPrimaryText(e.target.value)} rows={3}/><input className="cta-input" value={cta} onChange={e=>setCta(e.target.value)}/></div></div><div className="actions"><button className="secondary" onClick={()=>setStep(2)}>← Back</button><button className="primary" onClick={saveAd}>Save campaign <span>→</span></button></div></div><aside className="card summary"><p className="eyebrow">CAMPAIGN SUMMARY</p><h3>{business||'Your Business'}</h3><div className="summary-row"><span>Ad type</span><b>{adType}</b></div><div className="summary-row"><span>Location</span><b>{location||'Local area'}</b></div><div className="summary-row"><span>Package</span><b>{selected.name}</b></div><div className="total"><span>Total</span><b>${selected.price}</b></div><p className="fine">v0.3 saves your campaign as a draft. Payments and live ad delivery come next.</p></aside></section>}</div></main>;

  return <main className="landing"><nav className="nav"><Brand/><div className="nav-links"><a href="#how">How it works</a><a href="#pricing">Pricing</a>{signedIn?<button className="sign-in" onClick={()=>setView('dashboard')}>Dashboard</button>:<button className="sign-in" onClick={signInDemo}>Sign in</button>}</div></nav><section className="hero"><div className="hero-badge"><span>✦</span> Advertising made simple</div><h1>Create an ad.<br/><em>Cataply it.</em><br/>Grow your business.</h1><p>Professional advertising for small businesses, without the agency price tag or the advertising degree.</p><div className="hero-actions"><button className="primary large" onClick={openCreate}>Create your first ad <span>→</span></button><a className="secondary large" href="#how">See how it works</a></div><div className="trust"><span>✓ No subscription</span><span>✓ Launch in minutes</span><span>✓ From $5</span></div></section><section id="how" className="features"><div className="section-kicker">WHY CATAPLY</div><h2>Advertising without the headache.</h2><div className="feature-grid"><article><div className="feature-icon">✦</div><h3>AI does the heavy lifting</h3><p>Give us the basics. Cataply turns your idea into polished ad copy ready for customers.</p></article><article><div className="feature-icon">◈</div><h3>Make it your brand</h3><p>Adjust your message, offer, audience, location, colors, and imagery before you spend a dollar.</p></article><article><div className="feature-icon">↗</div><h3>One simple campaign</h3><p>No confusing ad manager. Pick a package, review your campaign, and save it in your dashboard.</p></article></div></section><section id="pricing" className="pricing"><div><div className="section-kicker">SIMPLE PRICING</div><h2>Start with a few bucks.</h2><p>Test an idea, promote a special, or reach your neighborhood without committing to a monthly plan.</p></div><div className="price-strip">{packages.map(p=><div key={p.name}><span>{p.name}</span><strong>${p.price}</strong></div>)}</div></section><footer><Brand/><span>Built for the businesses that keep communities moving.</span></footer></main>;
}
