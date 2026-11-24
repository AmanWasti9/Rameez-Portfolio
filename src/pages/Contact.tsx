import { useRef, useState, type FormEvent } from 'react';
import emailjs from '@emailjs/browser';
import { useReveal } from '../hooks/useReveal';
import { Magnetic } from '../components/Magnetic';
import { Roll } from '../components/Roll';
import { Clock } from '../components/Clock';
import { site } from '../data/site';

const kinds = ['SaaS or dashboard', 'Marketing website', 'Figma to React', 'Something else'];
const budgets = ['Under $1k', '$1k – $3k', '$3k – $8k', '$8k+', 'Not sure yet'];

// EmailJS credentials come from .env (see .env.example). The public key is safe in the browser.
const EMAILJS = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
};
const emailJsReady = Boolean(EMAILJS.serviceId && EMAILJS.templateId && EMAILJS.publicKey);

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const [kind, setKind] = useState(kinds[0]);
  const [status, setStatus] = useState<Status>('idle');
  useReveal(ref);

  const mailtoFallback = (f: FormData) => {
    const body = [
      `Name: ${f.get('name')}`,
      `Email: ${f.get('email')}`,
      `Project: ${kind}`,
      `Budget: ${f.get('budget')}`,
      '',
      String(f.get('message') ?? ''),
    ].join('\n');
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(`Project enquiry: ${kind}`)}&body=${encodeURIComponent(body)}`;
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'sending') return;
    const form = e.currentTarget;
    const f = new FormData(form);

    // Hidden field only bots fill in: pretend it worked and drop it.
    if (f.get('website')) { setStatus('sent'); return; }

    // Until EmailJS is configured, fall back to the visitor's mail app.
    if (!emailJsReady) { mailtoFallback(f); return; }

    setStatus('sending');
    try {
      await emailjs.send(
        EMAILJS.serviceId!,
        EMAILJS.templateId!,
        {
          from_name: String(f.get('name') ?? ''),
          from_email: String(f.get('email') ?? ''),
          reply_to: String(f.get('email') ?? ''),
          project_type: kind,
          budget: String(f.get('budget') ?? ''),
          message: String(f.get('message') ?? ''),
        },
        { publicKey: EMAILJS.publicKey! },
      );
      form.reset();
      setKind(kinds[0]);
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  return (
    <main ref={ref} className="page contact">
      <section className="page-hero" data-hero>
        <h1 className="display" data-split="chars">Let’s talk</h1>
        <p className="page-hero-lede" data-split="lines" data-delay="0.3">
          Tell me what you’re building and where it’s stuck. I’ll come back within a working day with questions, a rough timeline and next steps.
        </p>
      </section>

      <section className="contact-grid">
        <aside className="contact-side" data-hero>
          <div data-reveal="fade" data-delay="0.5">
            <h2 className="case-label">Email</h2>
            <a className="contact-email roll-host" href={`mailto:${site.email}`}><Roll text={site.email} /></a>
          </div>
          <div data-reveal="fade" data-delay="0.6">
            <h2 className="case-label">Prefer Upwork?</h2>
            <Magnetic>
              <a className="btn btn--accent roll-host" href={site.upwork} target="_blank" rel="noreferrer">
                <Roll text="Hire me on Upwork" />
              </a>
            </Magnetic>
          </div>
          <div data-reveal="fade" data-delay="0.7">
            <h2 className="case-label">Local time</h2>
            <p className="contact-time"><Clock /></p>
          </div>
        </aside>

        <form className="form" onSubmit={submit} data-hero>
          <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <fieldset className="field field--chips" data-reveal="fade" data-delay="0.55">
            <legend>What do you need?</legend>
            <div className="chips">
              {kinds.map((k) => (
                <label key={k} className={`chip${kind === k ? ' is-on' : ''}`}>
                  <input type="radio" name="kind" value={k} checked={kind === k} onChange={() => setKind(k)} />
                  {k}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="field-row" data-reveal="fade" data-delay="0.62">
            <label className="field">
              <span>Your name</span>
              <input name="name" required autoComplete="name" />
            </label>
            <label className="field">
              <span>Email</span>
              <input name="email" type="email" required autoComplete="email" />
            </label>
          </div>

          <label className="field" data-reveal="fade" data-delay="0.69">
            <span>Budget</span>
            <select name="budget" defaultValue={budgets[4]}>
              {budgets.map((b) => <option key={b}>{b}</option>)}
            </select>
          </label>

          <label className="field" data-reveal="fade" data-delay="0.76">
            <span>About the project</span>
            <textarea name="message" rows={5} required placeholder="What are you building, who is it for, and when do you need it?" />
          </label>

          <div className="form-actions" data-reveal="fade" data-delay="0.83">
            <Magnetic>
              <button type="submit" className="btn btn--ink roll-host" disabled={status === 'sending'}>
                <Roll text={status === 'sending' ? 'Sending…' : 'Send enquiry'} />
              </button>
            </Magnetic>
            <p className={`form-note form-note--${status}`} role="status" aria-live="polite">
              {status === 'sent' && 'Thanks, your message is in. I’ll reply within a working day.'}
              {status === 'error' && (
                <>Something went wrong sending that. Please email <a href={`mailto:${site.email}`}>{site.email}</a> directly.</>
              )}
            </p>
          </div>
        </form>
      </section>
    </main>
  );
}
