import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="border-t border-ink-700/60 bg-ink-950 pt-16 pb-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-signal-violet/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="mx-auto max-w-6xl px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-1 flex flex-col items-start gap-4">
            <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
              <Image src="/logo.png" alt="Logo" width={32} height={32} className="rounded-md object-cover" />
              <span className="font-display text-2xl font-black tracking-tight text-white">Bracketed</span>
            </Link>
            <p className="text-mist-400 text-sm leading-relaxed max-w-xs">
              The ultimate platform for organizing and competing in esports tournaments. Automated brackets, seamless registration, and instant payouts.
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold text-white uppercase tracking-widest mb-6">Platform</h4>
            <ul className="space-y-3 text-sm font-medium text-mist-400">
              <li><Link href="/tournaments" className="hover:text-signal-teal transition-colors">Browse Tournaments</Link></li>
              <li><Link href="/results" className="hover:text-signal-teal transition-colors">Match Results</Link></li>
              <li><Link href="/dashboard" className="hover:text-signal-teal transition-colors">Player Dashboard</Link></li>
              <li><Link href="/register" className="hover:text-signal-teal transition-colors">Create Account</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold text-white uppercase tracking-widest mb-6">Connect</h4>
            <ul className="space-y-3 text-sm font-medium text-mist-400">
              <li><Link href="/contact" className="hover:text-signal-violet transition-colors">Contact Us</Link></li>
              <li>
                <a 
                  href="https://www.instagram.com/manthan.py7?igsh=YzBvNnQ2azEyeTlz" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-signal-violet transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-ink-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-mist-400">
          <p>© {new Date().getFullYear()} Bracketed Esports. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-mist-200 transition-colors">Terms of Service</Link>
            <Link href="/contact" className="hover:text-mist-200 transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
