'use client';

export default function AdminSettingsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-mist-100 mb-2">Platform Settings</h1>
        <p className="text-sm text-mist-400">Configure global platform behavior.</p>
      </div>

      <div className="space-y-6">
        
        {/* General Settings */}
        <div className="rounded-xl border border-ink-700 bg-ink-900/60 p-8 shadow-xl">
          <h2 className="font-display text-xl font-medium text-mist-100 mb-6 border-b border-ink-700 pb-2">General Configuration</h2>
          
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-mist-200">Maintenance Mode</p>
                <p className="text-xs text-mist-400 mt-1">Temporarily disable access to the platform for all non-admin users.</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-ink-700 transition-colors focus-ring">
                <span className="inline-block h-4 w-4 translate-x-1 rounded-full bg-white transition-transform" />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-mist-200">Open Registration</p>
                <p className="text-xs text-mist-400 mt-1">Allow new users to sign up for accounts.</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-signal-teal transition-colors focus-ring">
                <span className="inline-block h-4 w-4 translate-x-6 rounded-full bg-white transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* API Settings */}
        <div className="rounded-xl border border-ink-700 bg-ink-900/60 p-8 shadow-xl opacity-50 cursor-not-allowed">
          <h2 className="font-display text-xl font-medium text-mist-100 mb-6 border-b border-ink-700 pb-2 flex items-center gap-2">
            Payment Gateway 
            <span className="text-[10px] uppercase font-bold bg-ink-800 border border-ink-700 px-2 py-0.5 rounded-full text-mist-400">Coming Soon</span>
          </h2>
          
          <div className="space-y-4 pointer-events-none">
            <div>
              <label className="block text-sm font-medium text-mist-200 mb-1">Stripe Secret Key</label>
              <input disabled type="password" value="********************************" className="w-full rounded-md border border-ink-700 bg-ink-950 px-4 py-2 text-mist-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-mist-200 mb-1">Stripe Webhook Secret</label>
              <input disabled type="password" value="************************" className="w-full rounded-md border border-ink-700 bg-ink-950 px-4 py-2 text-mist-500" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
