export default function TermsPage() {
  return (
    <div className="bg-ink-950 min-h-screen py-24 px-6 relative selection:bg-signal-violet/30 selection:text-white">
      {/* Background Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-signal-violet/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <h1 className="font-display text-4xl md:text-5xl font-black text-white mb-4">Terms & Conditions</h1>
        <p className="text-mist-400 font-medium mb-12">Last Updated: August 2026</p>
        
        <div className="prose prose-invert prose-mist max-w-none bg-ink-900/60 backdrop-blur-md border border-ink-800 rounded-3xl p-8 md:p-12 shadow-2xl">
          <p className="text-mist-200 text-lg leading-relaxed mb-8">
            Welcome to <strong className="text-white">Bracketed</strong>. By registering, participating, or making payments on our platform, you agree to the following Terms & Conditions.
          </p>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-signal-teal mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-signal-teal/10 text-signal-teal text-sm border border-signal-teal/20">1</span>
              Eligibility
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-mist-200">
              <li>Participants must provide accurate personal information during registration.</li>
              <li>Each player may register only once per tournament unless multiple entries are specifically allowed.</li>
              <li>Providing false information may result in account suspension or tournament disqualification.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-signal-violet mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-signal-violet/10 text-signal-violet text-sm border border-signal-violet/20">2</span>
              Tournament Registration
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-mist-200">
              <li>Registration is confirmed only after successful payment.</li>
              <li>Entry fees are non-transferable.</li>
              <li>Registration closes automatically when the participant limit is reached.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-signal-teal mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-signal-teal/10 text-signal-teal text-sm border border-signal-teal/20">3</span>
              Tournament Types
            </h2>
            <p className="text-mist-200 mb-4">Our platform may organize:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {['Solo Tournaments', 'Duo Tournaments', 'Squad/Team Tournaments', 'Custom Room Matches', 'Paid Tournaments', 'Free Tournaments', 'Special Events'].map(type => (
                <div key={type} className="bg-ink-950/50 border border-ink-800 rounded-lg p-3 text-center text-sm font-medium text-mist-200">
                  {type}
                </div>
              ))}
            </div>
            <p className="text-mist-400 text-sm italic">Each tournament may have different rules and prize structures.</p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-signal-violet mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-signal-violet/10 text-signal-violet text-sm border border-signal-violet/20">4</span>
              Entry Fee
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-mist-200">
              <li>Entry fees are displayed before registration.</li>
              <li>Fees must be paid using approved payment methods.</li>
              <li>Registration is confirmed only after successful payment verification.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-signal-amber mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-signal-amber/10 text-signal-amber text-sm border border-signal-amber/20">5</span>
              Refund Policy
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-signal-teal/5 border border-signal-teal/20 rounded-xl p-6">
                <h3 className="text-signal-teal font-bold mb-4 uppercase tracking-wider text-sm">Eligible Refunds</h3>
                <ul className="list-disc pl-5 space-y-2 text-mist-200 text-sm">
                  <li>Tournament cancelled by the organizer.</li>
                  <li>Tournament cannot be conducted due to technical issues.</li>
                  <li>Duplicate payment.</li>
                  <li>Payment deducted but registration not completed.</li>
                </ul>
              </div>
              <div className="bg-signal-red/5 border border-signal-red/20 rounded-xl p-6">
                <h3 className="text-signal-red font-bold mb-4 uppercase tracking-wider text-sm">Non-Refundable</h3>
                <ul className="list-disc pl-5 space-y-2 text-mist-200 text-sm">
                  <li>Player does not join the match.</li>
                  <li>Player is disqualified.</li>
                  <li>Wrong game ID submitted.</li>
                  <li>Internet or device issues.</li>
                  <li>Rule violations or voluntary withdrawal.</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-mist-100 mb-4">6. Refund Method</h2>
            <p className="text-mist-200 mb-4">If approved, refunds will be processed to the same UPI ID or payment method used during registration.</p>
            <div className="bg-ink-950 p-4 rounded-lg border border-ink-800 text-mist-300">
              <strong>Typical processing time:</strong> 3–7 business days (Depending on the payment gateway or bank).
            </div>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-mist-100 mb-4">7. UPI Information</h2>
            <p className="text-mist-200 mb-4">Participants must enter the correct UPI ID. Example: <code>playername@upi</code> or <code>9876543210@paytm</code></p>
            <p className="text-signal-red font-medium text-sm">Refunds cannot be processed if an incorrect UPI ID is provided.</p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-signal-lime mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-signal-lime/10 text-signal-lime text-sm border border-signal-lime/20">8</span>
              Prize Distribution
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-mist-200">
              <li>Prize amounts are announced before the tournament.</li>
              <li>Winners must provide valid payment details.</li>
              <li>Incorrect payment information may delay prize distribution.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-signal-red mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-signal-red/10 text-signal-red text-sm border border-signal-red/20">9</span>
              Disqualification
            </h2>
            <p className="text-mist-200 mb-4">Players may be disqualified for cheating, hacking, emulator usage (if prohibited), teaming, offensive language, fake screenshots, multiple accounts, account sharing, or rule violations.</p>
            <p className="text-mist-400 font-bold uppercase tracking-wider text-xs">The organizer's decision is final.</p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-mist-100 mb-4">10. Match Rules</h2>
            <ul className="list-disc pl-6 space-y-2 text-mist-200 mb-4">
              <li>Join before the scheduled time.</li>
              <li>Use the registered Game ID.</li>
              <li>Follow game-specific rules.</li>
              <li>Respect opponents and organizers.</li>
            </ul>
            <p className="text-signal-amber text-sm font-medium">Late joining may result in disqualification.</p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-mist-100 mb-4">11. Cancellation</h2>
            <p className="text-mist-200 mb-2">The organizer reserves the right to cancel tournaments, reschedule tournaments, modify tournament rules, or change prize pools if necessary.</p>
            <p className="text-mist-400 text-sm">Participants will be informed whenever possible.</p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-mist-100 mb-4">12. Technical Issues</h2>
            <p className="text-mist-200">The platform is not responsible for internet failure, power failure, device malfunction, game server downtime, mobile application crashes, or ISP issues.</p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-mist-100 mb-4">13. Account Suspension</h2>
            <p className="text-mist-200">Accounts may be permanently suspended for fraud, chargeback abuse, fake payments, abuse of promotions, harassment, or illegal activities.</p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-mist-100 mb-4">14. Privacy</h2>
            <p className="text-mist-200">We collect only necessary information, including your Name, Email Address, Mobile Number, UPI ID, Game ID, and Payment Details. Your data is securely stored and is not sold to third parties except where required by law or trusted payment providers.</p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-mist-100 mb-4">15. Contact Us</h2>
            <div className="bg-ink-950 border border-ink-800 rounded-xl p-6">
              <p className="text-mist-200 mb-2"><strong className="text-white">Phone:</strong> +91 XXXXXXXXXX</p>
              <p className="text-mist-200"><strong className="text-white">Email:</strong> manager@example.com</p>
            </div>
          </section>

          <section className="pt-8 border-t border-ink-800">
            <h2 className="font-display text-2xl font-bold text-mist-100 mb-4">16. Acceptance</h2>
            <p className="text-mist-200 mb-6">By registering for any tournament, you confirm that you have read these Terms & Conditions, agree to follow all tournament rules, understand the refund policy, and agree to abide by the organizer's decisions.</p>
            <div className="bg-signal-violet/10 border border-signal-violet/30 rounded-xl p-6 text-signal-violet text-sm">
              <strong className="block mb-2 text-base">Important Notice</strong>
              Participation in any tournament constitutes full acceptance of these Terms & Conditions. Failure to comply with the rules may result in disqualification, suspension, or permanent account termination without prior notice.
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
