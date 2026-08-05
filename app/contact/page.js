'use client';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-ink-950 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center py-20 px-6 relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 blur-sm pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/40 via-ink-950/80 to-ink-950 pointer-events-none" />
        
        <div className="relative z-10 w-full max-w-2xl text-center">
          <span className="inline-block rounded-full bg-signal-teal/10 border border-signal-teal/30 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-signal-teal mb-6 shadow-[0_0_20px_rgba(45,212,191,0.2)]">
            Get in touch
          </span>
          <h1 className="font-display text-4xl font-extrabold text-white md:text-6xl mb-6">Contact Us</h1>
          <p className="text-lg text-mist-200 font-medium mb-12">
            Have questions about hosting a tournament or need support with your account? We're here to help!
          </p>

          <form className="bg-ink-900/80 backdrop-blur-xl border border-ink-700 rounded-2xl p-8 text-left shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-semibold text-mist-400 uppercase tracking-wider mb-2">Name</label>
                <input type="text" className="w-full bg-ink-950 border border-ink-700 rounded-lg px-4 py-3 text-sm text-mist-100 focus:outline-none focus:border-signal-violet transition-colors" placeholder="Your Name" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-mist-400 uppercase tracking-wider mb-2">Email</label>
                <input type="email" className="w-full bg-ink-950 border border-ink-700 rounded-lg px-4 py-3 text-sm text-mist-100 focus:outline-none focus:border-signal-violet transition-colors" placeholder="your@email.com" />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-xs font-semibold text-mist-400 uppercase tracking-wider mb-2">Message</label>
              <textarea rows="5" className="w-full bg-ink-950 border border-ink-700 rounded-lg px-4 py-3 text-sm text-mist-100 focus:outline-none focus:border-signal-violet transition-colors resize-none" placeholder="How can we help you?" />
            </div>

            <button type="button" onClick={() => alert("Message sent successfully! (Demo)")} className="w-full bg-gradient-to-r from-signal-violet to-signal-teal text-ink-950 font-bold uppercase tracking-wider text-sm py-4 rounded-lg hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(178,133,240,0.3)]">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
