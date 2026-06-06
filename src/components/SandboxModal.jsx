import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles, SlidersHorizontal, Check, Copy, Code, Terminal, CheckCircle, HelpCircle } from "lucide-react";

export default function SandboxModal({ 
  activeSandboxModal, 
  setActiveSandboxModal, 
  onPreviewSound, 
  onAddToast, 
  user, 
  setAuthModal 
}) {
  const [activeUseCasesTab, setActiveUseCasesTab] = useState("youtube");
  const [sandboxBusinessInputs, setSandboxBusinessInputs] = useState({ videosCount: 8, reachEstimate: 45000, type: "commercial" });
  const [friendEmailInput, setFriendEmailInput] = useState("");
  const [suggestionInput, setSuggestionInput] = useState("");
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [feedbackList, setFeedbackList] = useState([
    "Add more vintage synthesizer presets! (Clement D.)",
    "Loved the instant claims clearance logs widget! (Bijay K.)",
  ]);

  // Squarespace dynamic Form and Embed configuration states
  const [sqTheme, setSqTheme] = useState("dark-night");
  const [sqTrack, setSqTrack] = useState("Acoustic Melodies");
  const [sqAutoplay, setSqAutoplay] = useState(false);
  const [sqVisualizer, setSqVisualizer] = useState("3d");
  const [sqFormType, setSqFormType] = useState("licensing"); // "licensing", "newsletter", "custom-safelist"
  const [sqSubmitted, setSqSubmitted] = useState(false);
  const [sqFormData, setSqFormData] = useState({ name: "", email: "", website: "", notes: "", agree: true });

  if (!activeSandboxModal) return null;

  const triggerSFXSound = (type) => {
    onPreviewSound(type === "laser" ? 950 : 260, `SFX Triggered: ${type}`);
  };

  return (
    <>
      <div 
        onClick={() => setActiveSandboxModal(null)}
        className="fixed inset-0 bg-black/80 z-52 backdrop-blur-md"
      />

      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ type: "spring", damping: 25 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-[#121214] border-2 border-[#ff4e98]/35 text-white rounded-lg p-6 md:p-8 shadow-2xl z-54 overflow-hidden max-h-[85vh] overflow-y-auto font-sans"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-[#ff4e98] flex items-center justify-center text-black font-extrabold shadow-md shadow-[#ff4e98]/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#ff5ea5]">INTERACTIVE REPLICATION PLAYGROUND</span>
              <h3 className="font-serif text-lg md:text-xl font-light text-white capitalize leading-tight mt-0.5">
                {activeSandboxModal.replace("plugin-", "Plugin: ").replace("mac-", "macOS ").replace("win-", "Windows ").replace("ios-", "iOS ").replace("android-", "Android ").replace(/-/g, " ")}
              </h3>
            </div>
          </div>

          <button 
            onClick={() => setActiveSandboxModal(null)}
            className="p-1 px-2.5 text-stone-400 hover:text-[#ff4e98] bg-white/5 hover:bg-white/10 border border-white/10 rounded cursor-pointer transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contents based on modal key */}
        <div className="text-stone-300 text-sm leading-relaxed mb-6">
          
          {activeSandboxModal === "ai-voices" && (
            <div className="space-y-4">
              <p className="text-xs text-stone-400">Epidemic Sound AI Voice generator is a state-of-the-art synthetic voice tuning engine. Use the keyboard synthesizer triggers below to listen to pitch modulation harmonics in real-time:</p>
              <div className="p-4.5 bg-black/40 border border-[#ff4e98]/15 rounded space-y-4">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#ff4e98] font-semibold">Tuning Knobs</span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { name: "Super Soprano Voice", synth: "synth-arpeggio", hz: "880Hz" },
                    { name: "Lofi Vocoder Vibe", synth: "ambient-pad", hz: "440Hz" },
                    { name: "Synthetic Laser Pitch", synth: "laser", hz: "660Hz" },
                    { name: "Thumping Sub Vocal", synth: "deep-chime", hz: "110Hz" },
                  ].map((voice, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        triggerSFXSound(voice.synth);
                        onAddToast(`Modulating synth voice target: ${voice.name} (${voice.hz})`);
                      }}
                      className="p-3 bg-[#18191b] hover:bg-[#ff4e98]/10 border border-white/5 hover:border-[#ff4e98] text-left rounded cursor-pointer transition-all"
                    >
                      <span className="font-mono text-[9px] text-[#ff5ea5] block mb-1">{voice.hz}</span>
                      <span className="text-xs text-white">{voice.name}</span>
                    </button>
                  ))}
                </div>
                <div className="pt-2">
                  <label className="block font-mono text-[9px] text-stone-400 uppercase mb-2">Simulate Vocal Prompt Text</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      className="flex-1 bg-[#18191b] border border-[#ff4e98]/15 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#ff5ea5] text-white" 
                      placeholder="Type a vocal script line (e.g., 'Welcome to tomorrow, producer!')" 
                    />
                    <button 
                      onClick={() => {
                        onPreviewSound(530, "AI voice clip vocalization");
                        onAddToast("🔊 AI Voice: Synthesized vocal sequence successfully!");
                      }}
                      className="bg-[#ff4e98] hover:bg-[#ff1e78] text-black px-4 py-2 font-mono text-[10px] uppercase tracking-wider rounded font-bold transition-all cursor-pointer"
                    >
                      Vocalize
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSandboxModal === "how-it-works" && (
            <div className="space-y-6">
              <p className="text-stone-300 text-xs">Our dynamic clearance architecture runs on direct music license safelists. Here is how you can achieve 100% video upload protection in seconds:</p>
              <div className="relative border-l border-[#ff4e98]/20 pl-6 ml-3 space-y-6 py-2">
                <div className="relative">
                  <span className="absolute -left-[35px] top-0 w-5 h-5 rounded-full bg-[#ff4e98] text-black flex items-center justify-center font-mono text-[9px] font-bold">1</span>
                  <h4 className="text-white font-medium text-sm">Select Your Soundtracks</h4>
                  <p className="text-xs text-stone-400 mt-1">Browse our real-time playlist sandbox and add track licenses to your checkout cart catalog.</p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[35px] top-0 w-5 h-5 rounded-full bg-[#ff4e98] text-black flex items-center justify-center font-mono text-[9px] font-bold">2</span>
                  <h4 className="text-white font-medium text-sm">Attach Your Social Media Channels</h4>
                  <p className="text-xs text-stone-400 mt-1">Link your YouTube, Instagram, or TikTok handles. Our clearance protocol immediately registers your channel with copyright registries.</p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[35px] top-0 w-5 h-5 rounded-full bg-[#ff4e98] text-black flex items-center justify-center font-mono text-[9px] font-bold">3</span>
                  <h4 className="text-white font-medium text-sm">Upload Without Stress</h4>
                  <p className="text-xs text-stone-400 mt-1">Publish content worldwide safely. If auto-bots flags are raised, our safelist clearance instantly resolves the claim automatically.</p>
                </div>
              </div>
            </div>
          )}

          {activeSandboxModal === "use-cases" && (
            <div className="space-y-4">
              <p className="text-stone-300 text-xs text-[#a8b0ba]">How different content creators safeguard their creative assets globally:</p>
              <div className="flex gap-2 border-b border-white/5 pb-2 overflow-x-auto">
                {["youtube", "podcasts", "tiktok", "freelance"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => { setActiveUseCasesTab(tab); triggerSFXSound("laser"); }}
                    className={`px-4 py-2 text-xs font-mono uppercase tracking-wider capitalize cursor-pointer rounded transition-all ${
                      activeUseCasesTab === tab ? "bg-[#ff4e98] text-black font-extrabold" : "text-stone-400 hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-5 bg-black/40 border border-[#ff5ea5]/15 rounded min-h-[140px] flex flex-col justify-between">
                {activeUseCasesTab === "youtube" && (
                  <div>
                    <h4 className="text-white text-sm font-semibold">YouTube Creator Safelist Coverage</h4>
                    <p className="text-xs text-stone-400 mt-2 leading-relaxed">Direct synchronization with YouTube Content ID. Your channels are placed under our instant-clear exempt list, allowing maximum ad-revenue payouts without copyright delays or split claims.</p>
                  </div>
                )}
                {activeUseCasesTab === "podcasts" && (
                  <div>
                    <h4 className="text-white text-sm font-semibold">Digital Audio Podcast Safeguards</h4>
                    <p className="text-xs text-stone-400 mt-2 leading-relaxed">Cleared for Apple Podcasts, Spotify, and commercial stitch integrations globally. Zero performance fee liability on spoken audio tracks combined with dynamic sound effects overlays.</p>
                  </div>
                )}
                {activeUseCasesTab === "tiktok" && (
                  <div>
                    <h4 className="text-white text-sm font-semibold">Shortform Dynamic Reels & TikTok Safety</h4>
                    <p className="text-xs text-stone-400 mt-2 leading-relaxed">Enjoy full commercial licensing clearances on vertical channels including YouTube Shorts and Instagram Reels. Instant audio synchronization with high-energy beat catalogs.</p>
                  </div>
                )}
                {activeUseCasesTab === "freelance" && (
                  <div>
                    <h4 className="text-white text-sm font-semibold">Commercial Client Assignments</h4>
                    <p className="text-xs text-stone-400 mt-2 leading-relaxed">Freelancers producing video campaigns for corporate clients get full legal clearance certificates. Deliver standard PDF licenses directly to your client brands with every final cut.</p>
                  </div>
                )}
                <div className="mt-4 flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-[10px] font-mono text-stone-400 uppercase">Coverage status: Guaranteed Premium</span>
                  <button 
                    onClick={() => { setAuthModal({ isOpen: true, type: "register" }); setActiveSandboxModal(null); }}
                    className="text-[10px] font-mono text-[#ff4e98] hover:underline uppercase tracking-wider font-bold cursor-pointer"
                  >
                    Unlock Safelist Account &rarr;
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSandboxModal === "for-businesses" && (
            <div className="space-y-6">
              <p className="text-xs text-stone-400">Use our Commercial Quotient calculator to estimate aggregate pricing costs for clients, marketing pipelines, and agencies:</p>
              <div className="p-5 bg-black/50 border border-[#ff5ea5]/15 rounded space-y-4">
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs text-stone-300">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#ff4e98] font-semibold">Active Campaigns Per Month</span>
                    <span className="text-white font-mono">{sandboxBusinessInputs.videosCount} projects</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="30" 
                    value={sandboxBusinessInputs.videosCount}
                    onChange={(e) => setSandboxBusinessInputs({ ...sandboxBusinessInputs, videosCount: Number(e.target.value) })}
                    className="w-full accent-[#ff5ea5] bg-white/10 rounded-lg h-1.5 cursor-ew-resize"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs text-stone-300">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#ff4e98] font-semibold">Estimated Reach Audience Size</span>
                    <span className="text-white font-mono">{(sandboxBusinessInputs.reachEstimate / 1000).toLocaleString()}K viewers</span>
                  </div>
                  <input 
                    type="range" 
                    min="5000" 
                    max="500000" 
                    step="5000"
                    value={sandboxBusinessInputs.reachEstimate}
                    onChange={(e) => setSandboxBusinessInputs({ ...sandboxBusinessInputs, reachEstimate: Number(e.target.value) })}
                    className="w-full accent-[#ff5ea5] bg-white/10 rounded-lg h-1.5 cursor-ew-resize"
                  />
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-[8px] text-stone-400 uppercase tracking-widest block">SUGGESTED LICENSE FEE</span>
                    <div className="text-2xl font-serif text-[#ff5ea5] font-semibold">
                      ${Math.floor(sandboxBusinessInputs.videosCount * 4.5 + sandboxBusinessInputs.reachEstimate * 0.00018 + 19)}
                      <span className="text-xs text-stone-400 font-sans font-light normal-case"> / month</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      onAddToast("Interactive Quote calculation saved! Check your email for formal PDF documentation.");
                      triggerSFXSound("chime");
                    }}
                    className="px-5 py-3.5 bg-[#ff4e98] hover:bg-[#ff1e78] text-black font-mono text-[10.5px] uppercase tracking-wider font-extrabold rounded-none cursor-pointer border-0"
                  >
                    Lock Current Quote
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSandboxModal === "enterprise" && (
            <div className="space-y-4">
              <p className="text-xs text-stone-400">Broadcasters, television networks, and multi-channel international agencies benefit from tailored digital safelist blueprints. Request customized license clearances below:</p>
              <div className="p-5 bg-black/40 border border-white/5 rounded space-y-4 font-mono text-xs">
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[9px] text-[#ff4e98] uppercase tracking-wider">Company Or network Name</label>
                    <input type="text" className="w-full bg-[#18191b] border border-white/10 text-white rounded p-2.5 outline-none font-bold placeholder:text-zinc-650" placeholder="e.g. Paramount Network" />
                  </div>
                  <div>
                    <label className="text-[9px] text-[#ff4e98] uppercase tracking-wider">Target Channels Count</label>
                    <input type="number" className="w-full bg-[#18191b] border border-white/10 text-white rounded p-2.5 outline-none font-bold" placeholder="50+" />
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => {
                    onAddToast("Enterprise proposal received! Our media licensing officer will get in touch with your legal team.");
                    onPreviewSound(380, "Proposal Submit Chime");
                  }}
                  className="w-full py-3.5 bg-white text-black font-sans text-xs uppercase font-extrabold tracking-wider mt-2 hover:bg-[#ff4e98] transition-colors cursor-pointer rounded"
                >
                  Request Customized Clearance Blueprint
                </button>
              </div>
            </div>
          )}

          {activeSandboxModal === "customer-stories" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "Clement Desmaison", role: "Vlog Director (1.2M Subs)", text: "Our aggregate video channels experienced zero copyright delays across 200+ uploaded cinematic sequences." },
                  { name: "Sarah Jenkins", role: "TikTok Agency Head", text: "Adding the safelist was absolute magic. Clearance logs resolved three automatic claim blocks in under ten seconds." }
                ].map((story, i) => (
                  <div key={i} className="p-4 bg-[#18191b] border border-white/5 rounded-lg">
                    <p className="text-xs text-stone-300 italic">"{story.text}"</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-white text-xs font-semibold">{story.name}</span>
                      <span className="text-[8px] font-mono text-[#ff4e98] uppercase">{story.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSandboxModal === "refer-a-friend" && (
            <div className="space-y-4">
              <p className="text-xs text-stone-400">Gift your peers, filmmakers, or editors 30 days of standard channels claims safelisting for free. Enter their creator profile address below:</p>
              <div className="p-5 bg-black/40 border border-white/5 rounded space-y-4">
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    value={friendEmailInput}
                    onChange={(e) => setFriendEmailInput(e.target.value)}
                    className="flex-1 bg-[#18191b] border border-[#ff4e98]/15 rounded px-3 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#ff5ea5] text-white" 
                    placeholder="e.g. filmmaker@example.com" 
                  />
                  <button 
                    onClick={() => {
                      if (!friendEmailInput) {
                        onAddToast("Please enter a valid email address!");
                        return;
                      }
                      onAddToast(`🎁 Free 30-Day clearance invitation dispatched to ${friendEmailInput}!`);
                      setFriendEmailInput("");
                      onPreviewSound(700, "Invitation sent sfx");
                    }}
                    className="bg-[#ff4e98] hover:bg-[#ff1e78] text-black px-5 py-2 font-mono text-[10px] uppercase tracking-wider rounded font-bold transition-all cursor-pointer"
                  >
                    Grant Free Access
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSandboxModal === "careers" && (
            <div className="space-y-4 text-xs select-none">
              <p className="text-stone-350">We are recruiting creative minds, layout designers, and audio DSP developers to scale our synthesizers suite:</p>
              <div className="space-y-2 max-h-[220px] overflow-y-auto">
                {[
                  { title: "Senior Sound Synthesizer Engineer (remote)", dept: "DSP ENGINEERING", location: "Stockholm, SE" },
                  { title: "Visual Layout & Motion Designer (hybrid)", dept: "PRODUCT EXPERIENCE", location: "New York, USA" },
                  { title: "Creator Whitelist Partnership Lead (global)", dept: "LEGAL & CONTENT OUTREACH", location: "London, UK" },
                ].map((job, idx) => {
                  const isApplied = appliedJobs.includes(job.title);
                  return (
                    <div key={idx} className="p-3.5 bg-black/40 border border-white/5 rounded flex justify-between items-center hover:border-brand-pink/30 transition-all">
                      <div>
                        <p className="text-white font-medium text-xs">{job.title}</p>
                        <p className="text-[9px] uppercase font-mono text-stone-500 mt-1">{job.dept} • {job.location}</p>
                      </div>
                      <button 
                        onClick={() => {
                          if (isApplied) return;
                          setAppliedJobs([...appliedJobs, job.title]);
                          onAddToast(`Application submitted for: ${job.title}! Code: ES-HR-${Math.floor(Math.random() * 9000)}`);
                          onPreviewSound(450, "Resume file uploaded sound");
                        }}
                        className={`text-[9px] font-mono uppercase tracking-wider font-extrabold px-3 py-1.5 rounded transition-colors ${
                          isApplied ? "bg-stone-850 text-emerald-400 border border-emerald-500/10 cursor-default" : "bg-[#ff4e98] hover:bg-rose-600 text-black cursor-pointer"
                        }`}
                      >
                        {isApplied ? "✓ APPLIED" : "APPLY"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeSandboxModal === "help-us-improve" && (
            <div className="space-y-4 font-sans text-xs">
              <p className="text-stone-400">Your direct recommendations shape our platform templates. Send feature suggestions below:</p>
              <div className="p-4 bg-black/40 border border-white/5 rounded space-y-3.5">
                <textarea 
                  value={suggestionInput}
                  onChange={(e) => setSuggestionInput(e.target.value)}
                  className="w-full bg-[#18191b] border border-white/10 rounded p-3 text-xs placeholder:text-stone-650 min-h-[100px] outline-none text-stone-100" 
                  placeholder="e.g. Extend Web Audio synthesizers to support reverb, multi-channel exports or MIDI keyboards..."
                />
                <button 
                  onClick={() => {
                    if (!suggestionInput) {
                      onAddToast("Please write down your suggestion first.");
                      return;
                    }
                    const updated = [suggestionInput + " (Anonymous Creator)", ...feedbackList];
                    setFeedbackList(updated);
                    onAddToast("💡 Suggestion received! Added to the feedback board.");
                    setSuggestionInput("");
                  }}
                  className="w-full py-3 bg-[#ff4e98] text-black font-mono font-extrabold text-[10.5px] uppercase tracking-wider hover:bg-rose-600 transition-colors cursor-pointer"
                >
                  File Anonymous Suggestion
                </button>
              </div>

              <div className="pt-2">
                <p className="font-mono text-[9px] uppercase tracking-widest text-[#ff4e98] mb-3 font-semibold">Creator Suggestion Board</p>
                <div className="space-y-2 max-h-[140px] overflow-y-auto">
                  {feedbackList.map((feedback, idx) => (
                    <div key={idx} className="p-2.5 bg-white/5 border border-white/5 rounded font-mono text-[10px]/relaxed text-stone-300">
                      • {feedback}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSandboxModal === "squarespace-form" && (
            <div className="space-y-6">
              <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-lg">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-white font-serif text-base font-semibold flex items-center gap-2">
                      <Code className="w-4 h-4 text-[#ff4e98]" />
                      Squarespace Embed Code & Form Block Builder
                    </h4>
                    <p className="text-xs text-stone-400 mt-1">
                      Customize and embed a clean Epidemic Sound music/license validation block directly into your Squarespace website portfolio using custom HTML widgets.
                    </p>
                  </div>
                  <span className="shrink-0 bg-stone-800 text-[10px] text-[#ff4e98] font-mono px-2 py-1 rounded font-bold border border-[#ff4e98]/20 uppercase">
                    Developer API v1.2
                  </span>
                </div>
              </div>

              {/* Grid split: Controls on Left, Live Squarespace Preview & Iframe Code on Right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* 1. CONFIGURATION COLUMN (5 Columns) */}
                <div className="lg:col-span-5 space-y-5 bg-black/40 p-4 border border-white/5 rounded-md text-xs">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#ff4e98] font-semibold block border-b border-white/5 pb-2">
                    1. WIDGET LAYOUT CONFIG
                  </span>
                  
                  {/* Select Theme */}
                  <div className="space-y-2">
                    <label className="block text-stone-400 font-mono text-[9px] uppercase">Form Canvas Theme</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "classic-light", name: "Paper Light" },
                        { id: "dark-night", name: "Slate Dark" }
                      ].map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => {
                            setSqTheme(theme.id);
                            triggerSFXSound("laser");
                          }}
                          className={`py-2 px-3 text-left border font-mono transition-all text-[11px] cursor-pointer ${
                            sqTheme === theme.id 
                              ? "bg-white text-black font-extrabold border-white" 
                              : "bg-transparent text-stone-400 hover:text-white border-zinc-800"
                          }`}
                        >
                          {theme.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Form Type Selection */}
                  <div className="space-y-2">
                    <label className="block text-stone-400 font-mono text-[9px] uppercase">Squarespace Form Block Task</label>
                    <select
                      value={sqFormType}
                      onChange={(e) => {
                        setSqFormType(e.target.value);
                        setSqSubmitted(false);
                        triggerSFXSound("ambient-pad");
                      }}
                      className="w-full bg-[#18191b] border border-zinc-800 text-stone-200 p-2.5 font-sans outline-none focus:ring-1 focus:ring-[#ff4e98]"
                    >
                      <option value="licensing">Licensing & Clearance Form</option>
                      <option value="newsletter">Soundtrack Newsletter & VIP Invites</option>
                      <option value="custom-safelist">Custom Account Safelist Appeal</option>
                    </select>
                  </div>

                  {/* Visualizer Mode Selection */}
                  <div className="space-y-2">
                    <label className="block text-stone-400 font-mono text-[9px] uppercase">Embedded Kinetic Visualizer</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: "3d", name: "3D Globe" },
                        { id: "2d", name: "2D Wave" },
                        { id: "none", name: "No Canvas" }
                      ].map((vis) => (
                        <button
                          key={vis.id}
                          onClick={() => {
                            setSqVisualizer(vis.id);
                            triggerSFXSound("deep-chime");
                          }}
                          className={`py-1.5 text-center border font-mono transition-all text-[10px] cursor-pointer ${
                            sqVisualizer === vis.id 
                              ? "bg-[#ff4e98] text-black font-extrabold border-[#ff4e98]" 
                              : "bg-transparent text-stone-400 hover:text-white border-zinc-800"
                          }`}
                        >
                          {vis.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Choose Default Track */}
                  <div className="space-y-2">
                    <label className="block text-stone-400 font-mono text-[9px] uppercase">Featured Background Soundtrack</label>
                    <select
                      value={sqTrack}
                      onChange={(e) => {
                        setSqTrack(e.target.value);
                        onAddToast(`Featured track updated to ${e.target.value}`);
                        onPreviewSound(480, `Track selected: ${e.target.value}`);
                      }}
                      className="w-full bg-[#18191b] border border-zinc-800 text-stone-200 p-2.5 font-sans outline-none focus:ring-1 focus:ring-[#ff4e98]"
                    >
                      <option value="Acoustic Melodies">Golden Horizon (Acoustic)</option>
                      <option value="Lofi Beats">Midnight Slate (Lofi)</option>
                      <option value="Cinematic Orchestra">Symphony of the Echoes (Classic)</option>
                      <option value="Synth Wave">Neon Horizons (Electronic)</option>
                    </select>
                  </div>

                  {/* Toggle Options */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-mono text-[9px] uppercase text-stone-400">Autoplay preview track</span>
                    <button
                      onClick={() => {
                        setSqAutoplay(!sqAutoplay);
                        triggerSFXSound("laser");
                      }}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                        sqAutoplay ? "bg-[#ff4e98]" : "bg-stone-800"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-black absolute top-1 transition-all ${
                        sqAutoplay ? "left-6" : "left-1"
                      }`} />
                    </button>
                  </div>
                </div>

                {/* 2. LIVE PREVIEW COLUMN (7 Columns) */}
                <div className="lg:col-span-7 space-y-5">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-stone-400 font-semibold block">
                    2. REPLICA PREVIEW (SQUARESPACE VISUAL IDENTITY)
                  </span>

                  {/* Simulated Squarespace Container Frame */}
                  <div className={`border transition-all duration-300 font-sans ${
                    sqTheme === "classic-light" 
                      ? "bg-[#fafaf9] border-[#e7e5e4] text-[#1c1917]" 
                      : "bg-[#171717] border-[#262626] text-[#fafafa]"
                  }`}>
                    
                    {/* Header bar of simulated browser widget */}
                    <div className="px-4 py-2 border-b border-dashed border-stone-500/20 flex items-center justify-between text-[9px] font-mono opacity-60">
                      <span>⚡ SQUARESPACE FORM RENDERING</span>
                      <span>PREVIEW MODE</span>
                    </div>

                    {/* Pre-submit Form content */}
                    <div className="p-6 md:p-8 space-y-6">
                      <AnimatePresence mode="wait">
                        {!sqSubmitted ? (
                          <motion.form
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onSubmit={(e) => {
                              e.preventDefault();
                              triggerSFXSound("chime");
                              setSqSubmitted(true);
                              onAddToast("🚀 Squarespace Form Submission Successful! Whitelisting credentials.");
                            }}
                            className="space-y-4"
                          >
                            <div className="space-y-1">
                              <h2 className="text-lg font-normal tracking-tight font-sans">
                                {sqFormType === "licensing" && "Music Licensing & Safeguard Intake"}
                                {sqFormType === "newsletter" && "Soundtrack Newsletter Subscription"}
                                {sqFormType === "custom-safelist" && "Copyright Claim Safelist Appeal"}
                              </h2>
                              <p className={`text-[11px] ${sqTheme === "classic-light" ? "text-stone-500" : "text-stone-400"}`}>
                                {sqFormType === "licensing" && "Submit your creator credentials to lock down automatic video safelisting."}
                                {sqFormType === "newsletter" && "Join our dynamic circle of producers and receive free licenses weekly."}
                                {sqFormType === "custom-safelist" && "Appeal an existing copyright claim strike directly to our legal desk."}
                              </p>
                            </div>

                            {/* Standard Squarespace Name Block */}
                            <div>
                              <label className="block text-[11px] font-extrabold mb-1">Full Name *</label>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <input
                                    type="text"
                                    required
                                    placeholder="First Name"
                                    className={`w-full text-xs p-2.5 rounded-none border outline-none font-sans ${
                                      sqTheme === "classic-light"
                                        ? "bg-white border-stone-300 text-stone-900 focus:border-stone-900"
                                        : "bg-stone-900 border-zinc-800 text-white focus:border-[#ff4e98]"
                                    }`}
                                  />
                                </div>
                                <div>
                                  <input
                                    type="text"
                                    required
                                    placeholder="Last Name"
                                    className={`w-full text-xs p-2.5 rounded-none border outline-none font-sans ${
                                      sqTheme === "classic-light"
                                        ? "bg-white border-stone-300 text-stone-900 focus:border-stone-900"
                                        : "bg-stone-900 border-zinc-800 text-white focus:border-[#ff4e98]"
                                    }`}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Email Input */}
                            <div>
                              <label className="block text-[11px] font-extrabold mb-1">Email Address *</label>
                              <input
                                type="email"
                                required
                                placeholder="bijaykharel807@gmail.com"
                                className={`w-full text-xs p-2.5 rounded-none border outline-none font-sans ${
                                  sqTheme === "classic-light"
                                    ? "bg-white border-stone-300 text-stone-900 focus:border-stone-900"
                                    : "bg-stone-900 border-zinc-800 text-white focus:border-[#ff4e98]"
                                }`}
                              />
                            </div>

                            {/* Additional conditionally relevant fields */}
                            {sqFormType !== "newsletter" && (
                              <div>
                                <label className="block text-[11px] font-extrabold mb-1">Creative Website / Channel URL *</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="e.g. portfolio.squarespace.com"
                                  className={`w-full text-xs p-2.5 rounded-none border outline-none font-sans ${
                                    sqTheme === "classic-light"
                                      ? "bg-white border-stone-300 text-stone-900 focus:border-stone-900"
                                      : "bg-stone-900 border-zinc-800 text-white focus:border-[#ff4e98]"
                                  }`}
                                />
                              </div>
                            )}

                            {/* Custom Inquiry textarea */}
                            <div>
                              <label className="block text-[11px] font-extrabold mb-1">Inquiry Details & Comments</label>
                              <textarea
                                rows="2"
                                placeholder={`Include background details regarding selected track: ${sqTrack}...`}
                                className={`w-full text-xs p-2.5 rounded-none border outline-none font-sans ${
                                  sqTheme === "classic-light"
                                    ? "bg-white border-stone-300 text-stone-900 focus:border-stone-900"
                                    : "bg-stone-900 border-zinc-800 text-white focus:border-[#ff4e98]"
                                }`}
                              />
                              <p className={`text-[9px] mt-1 ${sqTheme === "classic-light" ? "text-stone-400" : "text-stone-500"}`}>
                                Maximum 500 characters. Re-routing secure channel clearance.
                              </p>
                            </div>

                            {/* Standard Squarespace Checkbox and label */}
                            <div className="flex items-start gap-2 pt-1">
                              <input
                                type="checkbox"
                                id="sqAgree"
                                required
                                defaultChecked
                                className="mt-1 transition-all"
                              />
                              <label htmlFor="sqAgree" className={`text-[10px] leading-tight select-none cursor-pointer ${
                                sqTheme === "classic-light" ? "text-stone-500" : "text-stone-400"
                              }`}>
                                I accept the trademark clearance blueprints of Epidemic Music Sync. (Safelists are compiled globally).
                              </label>
                            </div>

                            {/* Submit Button Block: Zero Border-Radius, Solid Crisp Color */}
                            <button
                              type="submit"
                              className={`w-full py-3.5 px-6 font-mono text-[11px] uppercase tracking-wider font-extrabold transition-all cursor-pointer border-0 mt-2 ${
                                sqTheme === "classic-light"
                                  ? "bg-black text-white hover:bg-stone-850"
                                  : "bg-white text-black hover:bg-stone-200"
                              }`}
                            >
                              SUBMIT PRODUCER BLUEPRINT
                            </button>
                          </motion.form>
                        ) : (
                          /* Post-Submit Squarespace message */
                          <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="py-10 text-center space-y-4 font-sans"
                          >
                            <div className="w-12 h-12 bg-emerald-500/15 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                              <CheckCircle className="w-6 h-6 shrink-0" />
                            </div>
                            <div className="space-y-1">
                              <h3 className="text-base font-semibold tracking-tight">Form Submitted Successfully</h3>
                              <p className={`text-xs max-w-sm mx-auto ${sqTheme === "classic-light" ? "text-stone-500" : "text-stone-400"}`}>
                                Thank you! Your licensing credentials for <strong>{sqTrack}</strong> are now whitelisted under high-fidelity clearance arrays.
                              </p>
                            </div>

                            {/* Additional customized options */}
                            <div className="pt-2">
                              <button
                                onClick={() => {
                                  setSqSubmitted(false);
                                  triggerSFXSound("laser");
                                }}
                                className={`text-[10px] underline font-mono cursor-pointer bg-transparent border-0 uppercase ${
                                  sqTheme === "classic-light" ? "text-stone-800 hover:text-black" : "text-stone-300 hover:text-white"
                                }`}
                              >
                                &larr; fill form again
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Footer bar with live visualizer preview status */}
                    {sqVisualizer !== "none" && (
                      <div className={`p-4 font-mono text-[9px] border-t flex items-center justify-between uppercase ${
                        sqTheme === "classic-light" ? "bg-stone-100 border-[#e7e5e4]" : "bg-stone-900 border-[#262626]"
                      }`}>
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                          Visualizer active: {sqVisualizer.toUpperCase()}
                        </span>
                        <span>Soundtrack: {sqTrack} {sqAutoplay ? "(AUTOPLAY)" : ""}</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* 3. HTML EMBED CODE BLOCK */}
              <div className="space-y-3 bg-zinc-950 p-5 border border-zinc-850 rounded-lg">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-[#ff4e98]" />
                    <span className="font-mono text-xs text-stone-200">Squarespace Code Block HTML Widget</span>
                  </div>
                  
                  {/* Copy Code Action Button */}
                  <button
                    onClick={() => {
                      const embedCode = `<!-- Epidemic Sound Soundtrack & Safelist clearance Block for Squarespace -->\n<div class="es-squarespace-sound-widget" style="margin: 24px 0px; font-family: sans-serif; border: 1px solid ${sqTheme === "classic-light" ? "#e5e5e5" : "#2d2d2d"}; background: ${sqTheme === "classic-light" ? "#ffffff" : "#121214"}; text-align: left;">\n  <iframe \n    src="https://epidemicsound-replica.com/embed?track=${encodeURIComponent(sqTrack)}&theme=${sqTheme}&visualizer=${sqVisualizer}&autoplay=${sqAutoplay}&formType=${sqFormType}" \n    style="width: 100%; height: 530px; border: none; overflow: hidden; display: block;" \n    allow="autoplay; clipboard-write;" \n    loading="lazy">\n  </iframe>\n  <div style="padding: 10px 16px; border-t: 1px solid ${sqTheme === "classic-light" ? "#f4f4f4" : "#1a1a1c"}; text-align: right; background: ${sqTheme === "classic-light" ? "#fafafa" : "#09090b"};">\n    <a href="https://ais-pre-bgvpblwicawjxn6onfk6go-20537216979.asia-east1.run.app" target="_blank" style="text-decoration: none; font-size: 9.5px; font-weight: bold; color: #ff4e98; letter-spacing: 0.1em; text-transform: uppercase;">\n      ⚡ Clearance Whitelist Sync Secure\n    </a>\n  </div>\n</div>`;
                      navigator.clipboard.writeText(embedCode);
                      onAddToast("📋 Squarespace Iframe Code block copied to device clipboard!");
                      triggerSFXSound("laser");
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ff4e98] hover:bg-rose-600 text-black font-mono text-[10px] uppercase font-bold transition-all cursor-pointer border-0 rounded"
                  >
                    <Copy className="w-3 h-3 text-black" />
                    Copy Code Block
                  </button>
                </div>

                {/* Readable Code Display */}
                <div className="bg-black/80 rounded p-4 font-mono text-[10px]/relaxed text-zinc-400 overflow-x-auto max-h-[160px] border border-zinc-900 select-all">
                  <pre>{`<!-- Epidemic Sound Soundtrack & Safelist clearance Block for Squarespace -->
<div class="es-squarespace-sound-widget" style="margin: 24px 0px; font-family: sans-serif; border: 1px solid ${sqTheme === "classic-light" ? "#e5e5e5" : "#2d2d2d"}; background: ${sqTheme === "classic-light" ? "#ffffff" : "#121214"};">
  <iframe 
    src="https://epidemicsound-replica.com/embed?track=${encodeURIComponent(sqTrack)}&theme=${sqTheme}&visualizer=${sqVisualizer}&autoplay=${sqAutoplay}&formType=${sqFormType}" 
    style="width: 100%; height: 530px; border: none; overflow: hidden; display: block;" 
    allow="autoplay; clipboard-write;" 
    loading="lazy">
  </iframe>
  <div style="padding: 10px 16px; text-align: right; background: ${sqTheme === "classic-light" ? "#fafafa" : "#09090b"}; border-top: 1px solid ${sqTheme === "classic-light" ? "#e5e5e5" : "#1c1c1e"};">
    <a href="https://ais-pre-bgvpblwicawjxn6onfk6go-20537216979.asia-east1.run.app" target="_blank" style="text-decoration: none; font-size: 9.5px; font-weight: bold; color: #ff4e98; text-transform: uppercase; letter-spacing: 0.08em;">
      ⚡ Clearance Whitelist Sync Secure
    </a>
  </div>
</div>`}</pre>
                </div>

                {/* Bullet guide */}
                <div className="pt-2 font-sans text-xs text-stone-400 space-y-1">
                  <p className="font-bold text-[#ff4e98] text-[9.5px] uppercase font-mono">How to integrate into Squarespace Site Builder:</p>
                  <ol className="list-decimal pl-4.5 space-y-1 text-[11px] leading-relaxed">
                    <li>Open your Squarespace Page Editor and click <strong className="text-white">+ Add Block</strong> or insert an insertion point.</li>
                    <li>Select the <strong className="text-white">Code (&lt;/&gt;)</strong> block widget from the drop menu.</li>
                    <li>Inside the block settings, make sure the format is set to <strong className="text-white">HTML</strong> (uncheck "Display Source Code").</li>
                    <li>Paste the copied iframe snippet code into the text input, resize the container block to fit, and save!</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* Standard generic fallbacks */}
          {!["ai-voices", "how-it-works", "use-cases", "for-businesses", "enterprise", "customer-stories", "refer-a-friend", "careers", "help-us-improve", "squarespace-form"].includes(activeSandboxModal) && (
            <div className="space-y-3 p-4 bg-black/40 border border-white/10 rounded">
              <p className="text-zinc-300 text-xs leading-relaxed">
                Thank you for previewing the simulated section of our layout. This module replicates Epidemic Sound features including licensing blueprints, developer APIs, and client-whitelisting workflows with master clearance assurances.
              </p>
              <p className="text-stone-400 text-xs">
                To activate this layout under a production environment, you can connect your channels to our secure live server database. All content published is cleared automatically.
              </p>
            </div>
          )}

        </div>

        <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-zinc-500">
          <span>Simulation Engine: active</span>
          <span>Security Protocol Secure</span>
        </div>
      </motion.div>
    </>
  );
}
