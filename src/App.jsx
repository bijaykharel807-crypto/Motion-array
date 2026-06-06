import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Globe, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  Search, 
  ShoppingBag, 
  X, 
  Music, 
  Download, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  User, 
  FileText,
  Radio,
  Sliders,
  Check,
  Disc,
  ArrowRightLeft
} from "lucide-react";
import { 
  tracks, 
  slides, 
  faqs, 
  footerColumns 
} from "./data";
import VideoEditorSimulator from "./components/VideoEditorSimulator";
import SandboxModal from "./components/SandboxModal";
import AuthModal from "./components/AuthModal";
import LicensingDrawer from "./components/LicensingDrawer";

export default function App() {
  // Global Layout States
  const [bannerOpen, setBannerOpen] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("English (US)");
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  
  // Interactive Navigation Dropdowns
  const [activeHeaderDropdown, setActiveHeaderDropdown] = useState(null);

  // FAQ Search & Expansion state
  const [faqSearch, setFaqSearch] = useState("");
  const [expandedFaqId, setExpandedFaqId] = useState("faq-1");

  // Authentication Modals state
  const [authModal, setAuthModal] = useState({
    isOpen: false,
    type: "register"
  });
  const [user, setUser] = useState(null);

  // Toast Notification State
  const [toast, setToast] = useState(null);

  // Audio Playback Engine States
  const [currentTrack, setCurrentTrack] = useState(tracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackProgress, setTrackProgress] = useState(0);
  const [instrumentalOnly, setInstrumentalOnly] = useState(false);
  const [reverbEffect, setReverbEffect] = useState(false);
  const [volume, setVolume] = useState(80);
  const [tempoScale, setTempoScale] = useState(1); // Modulate synthesized beat frequency
  const [activeBeatIndex, setActiveBeatIndex] = useState(-1);
  const [licensedTrackIds, setLicensedTrackIds] = useState([]);
  const [isLicensingDrawerOpen, setIsLicensingDrawerOpen] = useState(false);
  const [licenseSuccessDetails, setLicenseSuccessDetails] = useState(null);

  // Footer Interactive Sandbox states
  const [activeSandboxModal, setActiveSandboxModal] = useState(null);

  // Web Audio Synth Ref/Logic
  const audioCtxRef = useRef(null);
  const sequencerIntervalRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const autoSlideTimerRef = useRef(null);

  useEffect(() => {
    startAutoSlide();
    return () => {
      stopAutoSlide();
      stopTrackSynth();
    };
  }, [activeSlide]);

  const startAutoSlide = () => {
    stopAutoSlide();
    autoSlideTimerRef.current = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
  };

  const stopAutoSlide = () => {
    if (autoSlideTimerRef.current) {
      clearInterval(autoSlideTimerRef.current);
      autoSlideTimerRef.current = null;
    }
  };

  const handleNextSlide = () => {
    stopAutoSlide();
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    stopAutoSlide();
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const triggerToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const previewSimulatorSound = (frequency, title) => {
    if (!audioCtxRef.current) {
      const AudioCtxConstructor = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxConstructor) {
        audioCtxRef.current = new AudioCtxConstructor();
      }
    }
    const audioCtx = audioCtxRef.current;
    if (audioCtx) {
      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const filter = audioCtx.createBiquadFilter();
      const gainNode = audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, now);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1000, now);

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime((volume / 100) * 0.12, now + 0.04);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.55);
    }
  };

  const playTrackSynth = (track) => {
    stopTrackSynth();
    setIsPlaying(true);

    if (!audioCtxRef.current) {
      const AudioCtxConstructor = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxConstructor) {
        audioCtxRef.current = new AudioCtxConstructor();
      }
    }

    const audioCtx = audioCtxRef.current;
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const noteFreqs = {
      C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
      C4: 261.63, "C#4": 277.18, D4: 293.66, E4: 329.63, F4: 349.23, "F#4": 369.99, G4: 392.00, A4: 440.00, B4: 493.88
    };

    let step = 0;
    const stepTime = (60 / track.tempo / 2) / tempoScale;

    const runSynthesizedTick = () => {
      if (!audioCtx || audioCtx.state === "suspended") return;
      const now = audioCtx.currentTime;
      const notesArray = track.synthNotes;
      const currentNote = notesArray[step % notesArray.length];
      const frequency = noteFreqs[currentNote] || 261.63;

      const osc = audioCtx.createOscillator();
      const filter = audioCtx.createBiquadFilter();
      const gainNode = audioCtx.createGain();

      osc.type = instrumentalOnly ? "sine" : "triangle";
      osc.frequency.setValueAtTime(frequency, now);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(reverbEffect ? 600 : 1300, now);
      filter.frequency.exponentialRampToValueAtTime(120, now + 0.35);

      gainNode.gain.setValueAtTime(0, now);
      const targetGain = (volume / 100) * 0.12;
      gainNode.gain.linearRampToValueAtTime(targetGain, now + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      if (step % 4 === 0) {
        const subOsc = audioCtx.createOscillator();
        const subGain = audioCtx.createGain();
        subOsc.type = "sine";
        subOsc.frequency.setValueAtTime(frequency / 2, now);
        subGain.gain.setValueAtTime(0, now);
        subGain.gain.linearRampToValueAtTime((volume / 100) * 0.14, now + 0.04);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        subOsc.connect(subGain);
        subGain.connect(audioCtx.destination);
        subOsc.start(now);
        subOsc.stop(now + 0.6);
      }

      osc.start(now);
      osc.stop(now + 0.45);

      setActiveBeatIndex(step % notesArray.length);
      step++;
    };

    runSynthesizedTick();
    sequencerIntervalRef.current = window.setInterval(runSynthesizedTick, stepTime * 1000);

    progressIntervalRef.current = window.setInterval(() => {
      setTrackProgress((prev) => {
        if (prev >= 100) {
          return 0;
        }
        return prev + 1;
      });
    }, 1200);
  };

  const stopTrackSynth = () => {
    setIsPlaying(false);
    setActiveBeatIndex(-1);
    if (sequencerIntervalRef.current) {
      clearInterval(sequencerIntervalRef.current);
      sequencerIntervalRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const handlePlayPause = (track) => {
    if (currentTrack.id === track.id && isPlaying) {
      stopTrackSynth();
      triggerToast(`Paused playback: ${track.title}`);
    } else {
      setCurrentTrack(track);
      if (currentTrack.id !== track.id) {
        setTrackProgress(0);
      }
      playTrackSynth(track);
      triggerToast(`🎧 Now Playing Synthesizer: ${track.title} by ${track.artist}`);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      playTrackSynth(currentTrack);
    }
  }, [tempoScale, instrumentalOnly, reverbEffect]);

  const toggleLicenseTrack = (track) => {
    if (licensedTrackIds.includes(track.id)) {
      setLicensedTrackIds((prev) => prev.filter((id) => id !== track.id));
      triggerToast(`Removed "${track.title}" from your license manager.`);
    } else {
      setLicensedTrackIds((prev) => [...prev, track.id]);
      setIsLicensingDrawerOpen(true);
      triggerToast(`✨ Added "${track.title}" to licensing checklist!`);
    }
  };

  const processFinalLicense = () => {
    if (!user) {
      setAuthModal({ isOpen: true, type: "register" });
      triggerToast("Please create a free creator account first to authorize your licensing token!");
      return;
    }

    const licenseKey = `ES-LIC-${Math.floor(100000 + Math.random() * 900000)}-${user.channelUrl ? user.channelUrl.replace(/[^a-zA-Z0-9]/g, "").substring(0, 5).toUpperCase() : "FREE"}`;
    setLicenseSuccessDetails(licenseKey);
    triggerToast("🎉 Track clearance certificate generated successfully!");
  };

  const triggerSFXSound = (type) => {
    if (!audioCtxRef.current) {
      const AudioCtxConstructor = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxConstructor) {
        audioCtxRef.current = new AudioCtxConstructor();
      }
    }
    const audioCtx = audioCtxRef.current;
    if (audioCtx) {
      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }
      const now = audioCtx.currentTime;
      
      if (type === "laser") {
        const osc = audioCtx.createOscillator();
        const filt = audioCtx.createBiquadFilter();
        const gainNode = audioCtx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(950, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.5);
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime((volume / 100) * 0.12, now + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.48);
        osc.connect(filt);
        filt.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.5);
      } else if (type === "chime" || type === "deep-chime" || type === "synth-arpeggio" || type === "ambient-pad") {
        const notes = type === "deep-chime" ? [130.81, 164.81, 196.00] : [523.25, 659.25, 783.99];
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gainNode.gain.setValueAtTime(0, now + idx * 0.08);
          gainNode.gain.linearRampToValueAtTime((volume / 100) * 0.08, now + idx * 0.08 + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.45);
          osc.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.5);
        });
      }
    }
  };

  const handleFooterLinkClick = (linkName) => {
    const term = linkName.toLowerCase().trim();
    stopTrackSynth();
    
    if (term === "royalty-free music") {
      const dest = document.getElementById("music-hub");
      dest?.scrollIntoView({ behavior: "smooth" });
      const targetTrack = tracks[0];
      setCurrentTrack(targetTrack);
      playTrackSynth(targetTrack);
      triggerToast("🎻 Playing royalty-free music spotlight: Golden Horizon");
    } else if (term === "sound effects") {
      triggerSFXSound("laser");
      triggerToast("⚡ Real-time Web Audio Synthesized laser sound effect triggered!");
    } else if (term === "ai voices") {
      triggerSFXSound("synth-arpeggio");
      setActiveSandboxModal("ai-voices");
      triggerToast("🗣️ Initiating simulated pitch-shifting vocal synthesizer");
    } else if (term === "pricing") {
      const dest = document.getElementById("music-hub");
      dest?.scrollIntoView({ behavior: "smooth" });
      setIsLicensingDrawerOpen(true);
      triggerToast("📋 Displaying Claims Clearance pricing manager");
    } else if (term === "log in") {
      setAuthModal({ isOpen: true, type: "login" });
    } else if (term === "create free account") {
      setAuthModal({ isOpen: true, type: "register" });
    } else if (term === "explore catalog") {
      const dest = document.getElementById("music-hub");
      dest?.scrollIntoView({ behavior: "smooth" });
      triggerToast("🔎 Navigated to Catalog Search: Type your desired genre/mood");
    } else if (term === "tools") {
      const dest = document.getElementById("music-hub");
      dest?.scrollIntoView({ behavior: "smooth" });
      triggerToast("🎛️ Scroll down to try active knobs, tempo dials, and resonance filters");
    } else if (term === "how it works") {
      setActiveSandboxModal("how-it-works");
      triggerToast("ℹ️ Opened interactive step-by-step workflow tutorial");
    } else if (term === "use cases") {
      setActiveSandboxModal("use-cases");
      triggerToast("💼 Displaying custom Social Channel Safelist scenarios");
    } else if (term === "for businesses") {
      setActiveSandboxModal("for-businesses");
      triggerSFXSound("chime");
      triggerToast("📈 Opening Commercial Pricing Quote calculator");
    } else if (term === "enterprise") {
      setActiveSandboxModal("enterprise");
      triggerSFXSound("ambient-pad");
      triggerToast("🏢 Opening customizable Broadcaster/Enterprise proposal form");
    } else if (term === "customer stories") {
      setActiveSandboxModal("customer-stories");
      triggerToast("⭐️ Displaying authentic producer testimonials & verification logs");
    } else if (term === "in-store music") {
      triggerSFXSound("deep-chime");
      setActiveSandboxModal("in-store-music");
      triggerToast("🛍️ Ambient in-store acoustic audio layout enabled");
    } else if (term === "business plan") {
      setAuthModal({ isOpen: true, type: "register" });
      triggerToast("Selected: Commercial Safelist Plan pre-registration");
    } else if (term === "refer a friend") {
      setActiveSandboxModal("refer-a-friend");
      triggerToast("🎁 Gift your peers 30 days of free social claims safelisting!");
    } else if (term === "help center") {
      const dest = document.getElementById("faqs");
      dest?.scrollIntoView({ behavior: "smooth" });
      setExpandedFaqId("faq-1");
      triggerToast("📖 Opened FAQ Help Center");
    } else if (term === "careers") {
      setActiveSandboxModal("careers");
      triggerToast("Careers dashboard of the Epidemic Music team");
    } else if (term === "help us improve") {
      setActiveSandboxModal("help-[#ff4e98]");
      setActiveSandboxModal("help-us-improve");
    } else {
      triggerToast(`Footer details triggered: ${linkName}`);
    }
  };

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    setLangMenuOpen(false);
    triggerToast(`Website translated to ${lang}`);
  };

  const submitRegistration = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("fullname");
    const email = formData.get("email");
    const channel = formData.get("channel");
    const selectedPlan = formData.get("plan");

    setUser({
      name: name || "Creative Producer",
      email: email || "producer@example.com",
      channelUrl: channel || "youtube.com/myworkspace",
      isPremium: true,
      plan: selectedPlan || "Personal Trial"
    });

    setAuthModal((prev) => ({ ...prev, isOpen: false }));
    triggerToast(`Welcome aboard, ${name}! Your channels are fully safelisted under the ${selectedPlan}.`);
  };

  const submitLogin = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");

    setUser({
      name: "VIP Designer",
      email: email || "creator@epidemicsound.com",
      channelUrl: "instagram.com/viralcuts",
      isPremium: true,
      plan: "Commercial License"
    });

    setAuthModal((prev) => ({ ...prev, isOpen: false }));
    triggerToast("Welcome back! Synced valid social channel credentials successfully.");
  };

  const filteredFaqs = faqs.filter(
    (item) => 
      item.question.toLowerCase().includes(faqSearch.toLowerCase()) || 
      item.answer.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <div className="relative min-h-screen bg-[#f4f2ee] text-[#121214] overflow-x-hidden selection:bg-[#ff4e98] selection:text-white">
      
      {/* 1. TOP BANNER */}
      <AnimatePresence>
        {bannerOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-[#ff4e98] text-black py-3 px-4 relative flex items-center justify-center select-none z-50 text-center border-b border-black/5"
          >
            <div className="flex items-center justify-center gap-3 max-w-5xl mx-auto px-4">
              <span className="bg-black text-[9px] text-white font-mono px-2 py-0.5 rounded font-extrabold tracking-wider shrink-0 uppercase">
                NEW
              </span>
              <span className="font-sans text-xs sm:text-sm font-semibold tracking-tight text-black leading-tight">
                Introducing Studio, the world's fastest soundtracking flow for your content.{' '}
                <button 
                  onClick={() => {
                    const dest = document.getElementById("hero-slider");
                    dest?.scrollIntoView({ behavior: "smooth" });
                    triggerToast("Discover our new layout below!");
                  }}
                  className="underline hover:text-stone-900 font-extrabold transition-colors cursor-pointer ml-1 inline-block border-0 bg-transparent"
                >
                  Learn more
                </button>
              </span>
            </div>

            <button 
              onClick={() => {
                setBannerOpen(false);
                triggerToast("Notification dismissed");
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-black/5 rounded-full transition-colors cursor-pointer border-0 bg-transparent"
            >
              <X className="w-4 h-4 text-black font-extrabold" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. NAVIGATION BAR */}
      <nav className="sticky top-0 bg-[#f4f2ee] py-5 px-6 md:px-12 flex items-center justify-between border-b border-[#e5e2db] z-45">
        <div className="flex items-center gap-8">
          <button 
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              triggerToast("Scrolled back to start");
            }} 
            className="flex items-center gap-3 group cursor-pointer text-left focus:outline-none border-0 bg-transparent"
          >
            <div className="w-8 h-8 flex items-center justify-center shrink-0">
              <svg className="w-8 h-8 text-black fill-current shrink-0 transform group-hover:scale-105 transition-transform" viewBox="0 0 100 100">
                <path d="M50,10 C27.9,10 10,27.9 10,50 C10,72.1 27.9,90 50,90 C72.1,90 90,72.1 90,50 C90,27.9 72.1,10 50,10 Z M50,75 C36.2,75 25,63.8 25,50 C25,36.2 36.2,25 50,25 C63.8,25 75,36.2 75,50 C75,52 74,53 72,53 C70,53 69,52 69,50 C69,39.5 60.5,31 50,31 C39.5,31 31,39.5 31,50 C31,60.5 39.5,69 50,69 C57.2,69 63.4,65 66.5,59 C67.5,57 69.5,56.5 71.5,57.5 C73.5,58.5 74,60.5 73,62.5 C68.5,70 60,75 50,75 Z" />
              </svg>
            </div>
            <span className="font-sans text-xl font-extrabold tracking-tight text-black flex items-center gap-2">
              Epidemic Sound
            </span>
          </button>

          {/* Nav Actions */}
          <div className="hidden lg:flex items-center gap-7 text-[11.5px] font-extrabold text-stone-880">
            <div 
              className="relative cursor-pointer py-1.5 hover:text-black transition-all flex items-center gap-1 uppercase tracking-[0.12em]"
              onMouseEnter={() => setActiveHeaderDropdown("offer")}
              onMouseLeave={() => setActiveHeaderDropdown(null)}
            >
              <span>What we offer</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              
              <AnimatePresence>
                {activeHeaderDropdown === "offer" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-white border border-[#e5e2db] rounded p-5 shadow-2xl z-50 text-stone-900 normal-case tracking-normal font-normal font-sans"
                  >
                    <p className="text-[10px] uppercase tracking-[0.25em] text-[#A5947F] font-bold mb-3">Our Music Catalog</p>
                    <ul className="space-y-2 text-sm">
                      <li className="hover:text-black transition-colors p-1.5 rounded hover:bg-[#f4f2ee]">
                        <button 
                          onClick={() => {
                            const dest = document.getElementById("music-hub");
                            dest?.scrollIntoView({ behavior: "smooth" });
                            setCurrentTrack(tracks[3]);
                            playTrackSynth(tracks[3]);
                            triggerToast("🎻 Playing Orchestral: Symphony of the Echoes");
                          }}
                          className="w-full text-left cursor-pointer border-0 bg-transparent focus:outline-none"
                        >
                          🎻 Cinematic Orchestra
                        </button>
                      </li>
                      <li className="hover:text-black transition-colors p-1.5 rounded hover:bg-[#f4f2ee]">
                        <button 
                          onClick={() => {
                            const dest = document.getElementById("music-hub");
                            dest?.scrollIntoView({ behavior: "smooth" });
                            setCurrentTrack(tracks[2]);
                            playTrackSynth(tracks[2]);
                            triggerToast("🎧 Playing Lofi: Midnight Slate");
                          }}
                          className="w-full text-left cursor-pointer border-0 bg-transparent focus:outline-none"
                        >
                          🎧 Lofi Beats
                        </button>
                      </li>
                      <li className="hover:text-black transition-colors p-1.5 rounded hover:bg-[#f4f2ee]">
                        <button 
                          onClick={() => {
                            const dest = document.getElementById("music-hub");
                            dest?.scrollIntoView({ behavior: "smooth" });
                            setCurrentTrack(tracks[0]);
                            playTrackSynth(tracks[0]);
                            triggerToast("🎸 Playing Acoustic: Golden Horizon");
                          }}
                          className="w-full text-left cursor-pointer border-0 bg-transparent focus:outline-none"
                        >
                          🎸 Acoustic Melodies
                        </button>
                      </li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button 
              onClick={() => {
                const dest = document.getElementById("music-hub");
                dest?.scrollIntoView({ behavior: "smooth" });
                setIsLicensingDrawerOpen(true);
              }}
              className="hover:text-black transition-all py-1.5 font-extrabold text-stone-850 text-[12.5px] tracking-normal cursor-pointer text-left focus:outline-none border-0 bg-transparent"
            >
              Pricing
            </button>

            <button 
              onClick={() => {
                setActiveSandboxModal("squarespace-form");
              }}
              className="text-[#ff4e98] hover:text-white hover:bg-[#ff4e98] border border-[#ff4e98]/30 hover:border-[#ff4e98] transition-all px-3 py-1 font-extrabold rounded-full text-[11.5px] tracking-tight cursor-pointer flex items-center gap-1 bg-[#ff4e98]/5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff4e98] animate-pulse"></span>
              Squarespace Embed
            </button>
          </div>
        </div>

        {/* Authenticated user UI */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden md:inline-flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-[0.1em] text-green-700 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/30 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></span>
                Active Safelist
              </span>
              <button 
                onClick={() => {
                  setUser(null);
                  triggerToast("Logged out successfully.");
                }}
                className="bg-stone-200/60 hover:bg-stone-200 px-4 py-2 border border-stone-350 text-stone-900 rounded-none cursor-pointer transition-colors text-[10.5px] font-extrabold"
              >
                LOG OUT
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setAuthModal({ isOpen: true, type: "login" })}
                className="bg-[#e5e2db] text-black hover:bg-[#d8d5cd] hover:scale-[1.02] active:scale-95 transition-all px-6 py-3.5 font-extrabold tracking-wider text-[11px] uppercase rounded-none cursor-pointer border-0 h-[46px] flex items-center justify-center font-sans"
              >
                LOG IN
              </button>
              
              <button 
                onClick={() => setAuthModal({ isOpen: true, type: "register" })}
                className="bg-black text-white hover:bg-zinc-900 hover:scale-[1.02] active:scale-95 transition-all px-6 py-3.5 font-extrabold tracking-wider text-[11px] uppercase rounded-none cursor-pointer border border-black h-[46px] flex items-center justify-center font-sans"
              >
                CREATE FREE ACCOUNT
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* 3. HERO SLIDER CAROUSEL SECTION */}
      <header id="hero-slider" className="relative h-[530px] md:h-[580px] bg-black text-white overflow-hidden select-none">
        <AnimatePresence mode="wait">
          {slides.map((slide, index) => {
            if (index !== activeSlide) return null;
            return (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 w-full h-full"
              >
                {/* Background Artwork layout */}
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${slide.image})` }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                </div>

                <div className="absolute inset-y-0 left-0 w-full max-w-2xl px-6 md:px-16 flex flex-col justify-center items-start z-10">
                  <span className="font-mono text-[9px]/tight text-[#ff4e98] tracking-[0.22em] font-extrabold uppercase mb-4 bg-[#ff4e98]/10 border border-[#ff4e98]/30 px-3 py-1.5 rounded-full block">
                    {slide.badge}
                  </span>

                  <h1 className="text-4xl md:text-5xl font-sans font-extrabold tracking-tight leading-tight text-white mb-4">
                    {slide.title}
                  </h1>

                  <p className="text-sm md:text-base text-stone-300 font-normal leading-relaxed mb-8 max-w-lg">
                    {slide.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4">
                    <button 
                      onClick={() => {
                        const dest = document.getElementById("music-hub");
                        dest?.scrollIntoView({ behavior: "smooth" });
                        triggerToast(`Activated: ${slide.badge}`);
                      }}
                      className="bg-[#ff4e98] text-black hover:bg-rose-500 hover:scale-[1.01] active:scale-95 transition-all px-8 py-4 font-mono font-extrabold tracking-wider text-[11px] uppercase rounded-none cursor-pointer border-0 flex items-center gap-2"
                    >
                      <span>Explore Catalog</span>
                      <ArrowRight className="w-4 h-4 text-black stroke-[3]" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Carousel indicators */}
        <div className="absolute bottom-8 right-6 md:right-16 z-20 flex items-center gap-4">
          <div className="flex gap-2.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  stopAutoSlide();
                  setActiveSlide(idx);
                }}
                className={`w-10 h-1.5 transition-all duration-350 cursor-pointer rounded-none border-0 ${
                  idx === activeSlide ? "bg-[#ff4e98]" : "bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
          
          <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 p-1">
            <button 
              onClick={handlePrevSlide}
              className="p-1 px-1.5 bg-transparent hover:bg-white/10 rounded cursor-pointer text-white border-0 focus:outline-none"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={handleNextSlide}
              className="p-1 px-1.5 bg-transparent hover:bg-white/10 rounded cursor-pointer text-white border-0 focus:outline-none"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 4. MAIN MUSIC HUB SEARCH SECTION */}
      <section id="music-hub" className="py-20 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 select-none">
        
        {/* Left column (8 cols): Catalog lists */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#e5e2db]">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#ff4e98] font-bold">LIVE SYNTH SELECTION</span>
              <h2 className="text-3xl font-serif text-black font-semibold mt-1">
                Spotlight Tracks
              </h2>
            </div>

            {/* Quick volume visualizer slider */}
            <div className="flex items-center gap-2.5 bg-white border border-[#e5e2db] rounded px-3 py-1.5 font-mono text-[10px] text-stone-500 shadow-sm">
              <span className="font-bold text-[#ff4e98]">MASTER FREQ:</span>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))} 
                className="w-24 accent-[#ff4e98] h-1" 
              />
              <span className="font-bold text-stone-900">{volume}%</span>
            </div>
          </div>

          {/* List of high-fidelity replica music blocks */}
          <div className="space-y-4">
            {tracks.map((track) => {
              const isSelected = currentTrack.id === track.id;
              const isSynthPlaying = isSelected && isPlaying;
              
              return (
                <div 
                  key={track.id}
                  onClick={() => {
                    setCurrentTrack(track);
                  }}
                  className={`p-6 bg-white border-2 rounded transition-all cursor-pointer relative ${
                    isSelected 
                      ? "border-[#ff4e98] shadow-md scale-[1.01]" 
                      : "border-transparent hover:border-[#e5e2db]/80 shadow-sm"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 leading-tight">
                      {/* Interactive Custom playback switch trigger */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayPause(track);
                        }}
                        style={{ backgroundColor: isSelected ? "#ff4e98" : "#f4f2ee" }}
                        className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-0 cursor-pointer hover:scale-[1.03] transition-transform"
                      >
                        {isSynthPlaying ? (
                          <Pause className="w-5 h-5 text-black fill-current" />
                        ) : (
                          <Play className="w-5 h-5 text-black fill-current ml-0.5" />
                        )}
                      </button>

                      <div className="space-y-1">
                        <p className="text-stone-900 font-serif text-base font-semibold">{track.title}</p>
                        <p className="text-xs text-stone-500 font-mono">By {track.artist} • {track.genre}</p>
                        
                        {/* Dynamic Web Audio Micro synth indicators */}
                        {isSynthPlaying && (
                          <div className="flex items-center gap-1.5 pt-1">
                            <span className="text-[8px] font-mono font-bold text-[#ff4e98] uppercase animate-pulse">SYNTHESIZING MATRIX:</span>
                            <div className="flex gap-0.5 h-3 items-end">
                              {track.synthNotes.map((note, noteIdx) => (
                                <span 
                                  key={noteIdx}
                                  style={{ 
                                    height: activeBeatIndex === noteIdx ? "100%" : "30%",
                                    backgroundColor: track.accentColor
                                  }}
                                  className="w-1 transition-all duration-100 rounded-sm"
                                  title={`Beat note: ${note}`}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* BPM Indicator */}
                      <span className="font-mono text-[10px] bg-stone-100 px-3 py-1 rounded text-stone-500 font-bold border border-stone-200">
                        {track.bpm} BPM
                      </span>

                      {/* Add/Remove track to global permit whitelisted check checks */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLicenseTrack(track);
                        }}
                        className={`p-2.5 rounded transition-all border-0 cursor-pointer ${
                          licensedTrackIds.includes(track.id)
                            ? "bg-[#ff4e98] hover:bg-rose-600 text-black shadow-inner"
                            : "bg-stone-100 hover:bg-stone-200 text-stone-700"
                        }`}
                        title={licensedTrackIds.includes(track.id) ? "Licensed (Clearance Approved)" : "Add upload clearance protect"}
                      >
                        <Disc className={`w-4 h-4 ${licensedTrackIds.includes(track.id) ? "animate-spin text-black" : ""}`} />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right column (4 cols): Synthesizing dashboard controllers */}
        <div className="lg:col-span-4 bg-white border border-[#e5e2db] p-6 rounded-lg shadow-sm space-y-6">
          <div className="pb-4 border-b border-[#e5e2db]">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#ff4e98] font-bold block">REAL-TIME ADSR KNOBS</span>
            <h3 className="text-xl font-serif text-black font-semibold mt-1">Live Synth Deck</h3>
          </div>

          {/* Core Player Deck Info */}
          <div className="p-4 bg-[#f4f2ee] rounded flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[8px] font-mono text-[#ff4e98] uppercase font-bold block">NOW ROUTED</span>
              <p className="text-sm font-semibold text-black truncate mt-1">{currentTrack.title}</p>
              <p className="text-[10px] text-stone-500 font-mono truncate">{currentTrack.artist}</p>
            </div>

            <button 
              onClick={() => handlePlayPause(currentTrack)}
              className="w-10 h-10 rounded-full bg-[#ff4e98] flex items-center justify-center shrink-0 border-0 cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4 text-black" /> : <Play className="w-4 h-4 text-black ml-0.5" />}
            </button>
          </div>

          <div className="space-y-4">
            {/* Speed Dial knob scale */}
            <div>
              <div className="flex justify-between items-center text-xs text-stone-500 mb-1.5">
                <span className="font-mono font-semibold">TEMPO SCALE:</span>
                <span className="font-mono font-bold text-[#ff4e98]">{tempoScale.toFixed(2)}x</span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="2.0" 
                step="0.1"
                value={tempoScale} 
                onChange={(e) => setTempoScale(Number(e.target.value))}
                className="w-full accent-[#ff4e98] bg-stone-100 rounded h-1 cursor-ew-resize" 
              />
            </div>

            {/* Audio Filters Toggle Switches checkboxes */}
            <div className="space-y-2.5 pt-3">
              <button 
                onClick={() => {
                  setInstrumentalOnly(!instrumentalOnly);
                  triggerToast(instrumentalOnly ? "Reverted to vocal synthesized timbres" : "Muted primary synthetic harmonics");
                }}
                className={`w-full p-3 font-mono text-[10px] font-bold text-left rounded flex items-center justify-between cursor-pointer border ${
                  instrumentalOnly
                    ? "bg-[#ff4e98]/10 border-[#ff4e98]/50 text-[#ff4e98]"
                    : "bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-600"
                }`}
              >
                <span>SINE OSCILLATOR (VOCAL CUT)</span>
                <span className="text-[9px] uppercase font-bold">
                  {instrumentalOnly ? "ON" : "OFF"}
                </span>
              </button>

              <button 
                onClick={() => {
                  setReverbEffect(!reverbEffect);
                  triggerToast(reverbEffect ? "Dry filter acoustics active" : "Reverb filter acoustic matrix active");
                }}
                className={`w-full p-3 font-mono text-[10px] font-bold text-left rounded flex items-center justify-between cursor-pointer border ${
                  reverbEffect
                    ? "bg-[#ff4e98]/10 border-[#ff4e98]/50 text-[#ff4e98]"
                    : "bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-600"
                }`}
              >
                <span>REVERB MATRIX (LOWPASS CONVOLVER)</span>
                <span className="text-[9px] uppercase font-bold">
                  {reverbEffect ? "ON" : "OFF"}
                </span>
              </button>
            </div>

            {/* Quick Permit Drawer Link */}
            <hr className="border-stone-150 my-4" />
            <div className="pt-2 text-center">
              <button 
                onClick={() => {
                  setIsLicensingDrawerOpen(true);
                }}
                className="bg-black text-white hover:bg-stone-900 w-full py-3 text-[10.5px] font-mono tracking-widest uppercase font-extrabold cursor-pointer border-0 rounded-none flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-white" />
                <span>OPEN CLEARANCE CAR ({licensedTrackIds.length})</span>
              </button>
            </div>

          </div>

        </div>

      </section>

      {/* 5. PREMIERE PRO SIMULATOR SECTION */}
      <VideoEditorSimulator 
        onAddTrackToast={triggerToast} 
        onPreviewSound={previewSimulatorSound} 
      />

      {/* 7. FAQ ACCORDION HELP SECTIONS */}
      <section id="faqs" className="py-20 bg-stone-100 px-6 md:px-12 select-none border-t border-b border-[#e5e2db]">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="text-center space-y-2.5">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#ff4e98] font-bold block">GOT QUESTIONS?</span>
            <h2 className="text-3xl font-serif text-black font-semibold">Licensing & Safelists</h2>
            <p className="text-xs sm:text-sm text-stone-500 font-light max-w-xl mx-auto leading-relaxed">
              Find instant answers regarding coverage structures, safe-matching channels, and legal copyright protections.
            </p>
          </div>

          {/* Interactive Search */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input 
                type="text"
                placeholder="Search FAQs (e.g. copyright, personal, cancel)..."
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-lg pl-11 pr-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#ff4e98] text-[#121214] font-medium"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {faqSearch && (
                <button 
                  onClick={() => setFaqSearch("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#ff4e98] font-extrabold hover:underline cursor-pointer border-0 bg-transparent"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Loop FAQs */}
          <div className="space-y-3.5">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => {
                const isExpanded = expandedFaqId === faq.id;
                return (
                  <div 
                    key={faq.id}
                    className="bg-white rounded-lg border border-brand-dark/15 overflow-hidden shadow-sm transition-all duration-300 pointer-events-auto"
                  >
                    <button
                      onClick={() => {
                        setExpandedFaqId(isExpanded ? null : faq.id);
                        triggerToast(isExpanded ? `Collapsing FAQ` : `Reading FAQ`);
                      }}
                      className="w-full text-left p-5 md:p-6 flex items-center justify-between gap-4 font-normal text-brand-dark hover:bg-stone-50 transition-colors cursor-pointer text-sm sm:text-base font-serif border-0 bg-transparent"
                    >
                      <span>{faq.question}</span>
                      <span className="w-8 h-8 rounded bg-[#f4f2ee] flex items-center justify-center text-black shrink-0 transition-transform duration-300">
                        {isExpanded ? <ChevronUp className="w-4.5 h-4.5 text-black" /> : <ChevronDown className="w-4.5 h-4.5 text-black" />}
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden border-t border-brand-dark/5"
                        >
                          <div className="p-5 md:p-6 text-stone-600 text-xs sm:text-sm leading-relaxed font-light bg-brand-beige/10">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            ) : (
              <div className="text-center p-12 bg-white rounded-lg border border-dashed border-stone-200">
                <p className="text-stone-500 text-sm font-light">No matching questions found.</p>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* 8. FOOTER SECTIONS */}
      <footer className="bg-black text-stone-300 border-t border-white/5 pt-20 pb-12 px-6 md:px-14 select-none">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 md:gap-8 pb-14 border-b border-white/5">
            
            {/* Slogan column */}
            <div className="lg:col-span-2 flex flex-col justify-between items-start gap-8 z-10">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-[#ff4e98] rounded-md flex items-center justify-center text-black">
                    <Music className="w-4 h-4 text-black" />
                  </div>
                  <span className="font-serif text-lg font-light text-white tracking-tight">Epidemic Sound</span>
                </div>
                <p className="text-xs text-stone-400 font-light mt-1.5 max-w-xs leading-relaxed">
                  Clear channels instantly, play custom melodies, and soundtrack your videos globally with complete safety assurances.
                </p>
              </div>

              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/15 text-stone-250 text-xs font-semibold py-2.5 px-4 rounded border border-white/5 cursor-pointer transition-colors font-mono tracking-wider"
                >
                  <Globe className="w-4 h-4 text-[#ff4e98]" />
                  <span>{selectedLanguage}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
                </button>

                <AnimatePresence>
                  {langMenuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-full left-0 mb-2 bg-[#121214] border border-[#ff4e98]/20 rounded p-2 w-48 shadow-xl z-50 text-stone-200 text-xs"
                    >
                      {["English (US)", "Español (España)", "Deutsch (Deutschland)", "Français (France)"].map((lang) => (
                        <button
                          key={lang}
                          onClick={() => handleLanguageChange(lang)}
                          className="w-full text-left py-2 px-3 hover:bg-white/5 hover:text-[#ff4e98] rounded transition-colors capitalize cursor-pointer flex items-center justify-between border-0 bg-transparent text-white"
                        >
                          <span>{lang}</span>
                          {selectedLanguage === lang && <Check className="w-3.5 h-3.5 text-[#ff4e98] font-bold" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Link columns */}
            {footerColumns.map((col, index) => (
              <div key={index} className="flex flex-col gap-4">
                <span className="text-[10px] uppercase font-mono tracking-[0.2em] font-bold text-[#ff4e98]">
                  {col.title}
                </span>

                <ul className="flex flex-col gap-2.5 text-xs text-stone-450 font-normal">
                  {col.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <button 
                        onClick={() => handleFooterLinkClick(link)}
                        className="hover:text-[#ff4e98] transition-colors cursor-pointer text-left focus:outline-none border-0 bg-transparent text-stone-400 hover:scale-[1.01]"
                      >
                        {link}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Extra desktop link integrations */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <span className="text-[10px] uppercase font-mono tracking-[0.2em] font-bold text-[#ff4e98]">PLUGINS</span>
                <ul className="text-xs text-stone-400 space-y-2 font-normal">
                  <li><button onClick={() => { setActiveSandboxModal("plugin-davinci"); triggerToast("DaVinci Resolve panel requested"); }} className="hover:text-[#ff4e98] transition-colors py-0.5 text-left border-0 bg-transparent cursor-pointer">DaVinci Resolve Studio</button></li>
                  <li><button onClick={() => { setActiveSandboxModal("plugin-premiere"); triggerToast("Creative Cloud panel requested"); }} className="hover:text-[#ff4e98] transition-colors py-0.5 text-left border-0 bg-transparent cursor-pointer">Adobe Premiere Pro</button></li>
                  <li><button onClick={() => { setActiveSandboxModal("squarespace-form"); }} className="hover:text-white text-[#ff4e98] font-bold transition-colors py-0.5 text-left border-0 bg-transparent cursor-pointer">Squarespace Embed Form ✨</button></li>
                </ul>
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-[10px] uppercase font-mono tracking-[0.2em] font-bold text-[#ff4e98]">MOBILE APPS</span>
                <ul className="text-xs text-stone-400 space-y-2 font-normal">
                  <li><button onClick={() => { setActiveSandboxModal("ios-app"); triggerToast("Requesting App Store build package"); }} className="hover:text-[#ff4e98] transition-colors py-0.5 text-left border-0 bg-transparent cursor-pointer">iOS app 📱</button></li>
                  <li><button onClick={() => { setActiveSandboxModal("android-app"); triggerToast("Requesting Google Play build package"); }} className="hover:text-[#ff4e98] transition-colors py-0.5 text-left border-0 bg-transparent cursor-pointer">Android app 🤖</button></li>
                </ul>
              </div>
            </div>

          </div>

          {/* Social icons row */}
          <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-stone-500">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <span>Copyright © Epidemic Sound Replica</span>
              <span className="text-zinc-800">|</span>
              <button onClick={() => triggerToast("Clearance Legal constraints active")} className="hover:text-[#ff4e98] transition-all border-0 bg-transparent cursor-pointer">Legal Terms</button>
              <button onClick={() => triggerToast("Privacy details whitelisted")} className="hover:text-[#ff4e98] transition-all border-0 bg-transparent cursor-pointer">Privacy Notice</button>
            </div>

            <div className="flex items-center gap-2">
              {["Spotify", "YouTube", "Instagram", "TikTok"].map((social) => (
                <button
                  key={social}
                  onClick={() => triggerToast(`Simulated connection to official ${social} handle`)}
                  className="w-8 h-8 bg-white/5 hover:bg-[#ff4e98] hover:text-black text-stone-300 rounded font-mono text-[10px] tracking-wider uppercase font-bold flex items-center justify-center border border-white/10 transition-all cursor-pointer duration-350 hover:scale-105"
                  title={`Official ${social}`}
                >
                  <span>{social.substring(0, 2)}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </footer>

      {/* Interactive subcomponents modals */}
      <SandboxModal 
        activeSandboxModal={activeSandboxModal}
        setActiveSandboxModal={setActiveSandboxModal}
        onPreviewSound={(hz, txt) => previewSimulatorSound(hz, txt)}
        onAddToast={(msg) => triggerToast(msg)}
        user={user}
        setAuthModal={setAuthModal}
      />

      <AuthModal 
        authModal={authModal}
        setAuthModal={setAuthModal}
        onSubmitRegistration={submitRegistration}
        onSubmitLogin={submitLogin}
      />

      <LicensingDrawer 
        isLicensingDrawerOpen={isLicensingDrawerOpen}
        setIsLicensingDrawerOpen={setIsLicensingDrawerOpen}
        licensedTrackIds={licensedTrackIds}
        setLicensedTrackIds={setLicensedTrackIds}
        tracks={tracks}
        user={user}
        setAuthModal={setAuthModal}
        licenseSuccessDetails={licenseSuccessDetails}
        setLicenseSuccessDetails={setLicenseSuccessDetails}
        onAddToast={(msg) => triggerToast(msg)}
        onPreviewSound={(hz, txt) => previewSimulatorSound(hz, txt)}
        processFinalLicense={processFinalLicense}
      />

      {/* Floating interactive notification alert popup */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 left-6 max-w-sm bg-[#121214] border border-[#ff4e98]/30 shadow-2xl p-4 z-55 flex items-start gap-3 rounded-md"
          >
            <div className="w-5 h-5 bg-[#ff4e98] rounded-full flex items-center justify-center text-black shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-black" />
            </div>
            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-wider text-[#ff4e98] font-mono block font-bold">Soundcheck Clearance alert</span>
              <p className="text-stone-300 text-[11.5px] leading-relaxed font-semibold">{toast}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
