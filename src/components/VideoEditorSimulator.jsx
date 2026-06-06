import * as React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Play, 
  Pause, 
  Music, 
  Plus, 
  Sparkles, 
  Trash2, 
  PlusCircle,
  Film,
  SlidersHorizontal
} from "lucide-react";
import Visualizer2D from "./Visualizer2D";
import Visualizer3D from "./Visualizer3D";

const SIMULATOR_TRACKS = [
  {
    id: "sim-1",
    title: "Slippery Ladders",
    artist: "Martin Landström",
    genre: "Classic Jazz",
    mood: "Happy, Quirky",
    bpm: 105,
    duration: "1:52",
    color: "from-amber-500 to-yellow-600",
    audioFrequency: 290
  },
  {
    id: "sim-2",
    title: "ICON",
    artist: "Janset",
    genre: "Grime",
    mood: "Dark, Restless",
    bpm: 136,
    duration: "2:51",
    color: "from-pink-500 to-rose-600",
    audioFrequency: 330
  },
  {
    id: "sim-3",
    title: "Late Nights and Dark Skies",
    artist: "Anna Landström",
    genre: "Solo Instrumental",
    mood: "Sad, Peaceful",
    bpm: 72,
    duration: "2:41",
    color: "from-indigo-500 to-blue-600",
    audioFrequency: 220
  },
  {
    id: "sim-4",
    title: "Build a Foundation",
    artist: "Nyck Caution",
    genre: "Alternative Hip Hop",
    mood: "Laid Back, Restless",
    bpm: 82,
    duration: "2:04",
    isExplicit: true,
    color: "from-emerald-500 to-teal-600",
    audioFrequency: 410
  },
  {
    id: "sim-5",
    title: "Oolong",
    artist: "Viriya",
    genre: "Ambient House",
    mood: "Dreamy, Mysterious",
    bpm: 120,
    duration: "3:18",
    color: "from-purple-500 to-violet-600",
    audioFrequency: 260
  }
];

export default function VideoEditorSimulator({ onAddTrackToast, onPreviewSound }) {
  // Simulator States
  const [activeTab, setActiveTab] = useState("Creators Pick");
  const [selectedTrack, setSelectedTrack] = useState(SIMULATOR_TRACKS[0]);
  const [isPlayingTimeline, setIsPlayingTimeline] = useState(false);
  const [timelineProgress, setTimelineProgress] = useState(35); // Initial percentage
  const [timelineTracks, setTimelineTracks] = useState([SIMULATOR_TRACKS[0], SIMULATOR_TRACKS[2]]);
  const [activeMediaFilter, setActiveMediaFilter] = useState("fit");
  const [leftMonitorMode, setLeftMonitorMode] = useState("2d"); // "video" or "2d"
  const [rightMonitorMode, setRightMonitorMode] = useState("3d"); // "video" or "3d"

  // Auto-playing progress of Timeline simulation
  useEffect(() => {
    let interval;
    if (isPlayingTimeline) {
      interval = window.setInterval(() => {
        setTimelineProgress((prev) => {
          if (prev >= 100) {
            // loop
            return 0;
          }
          return prev + 0.4;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlayingTimeline]);

  // Handle timeline waveform click to change position
  const handleTimelineProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progressPercent = Math.min(Math.max((clickX / rect.width) * 100, 0), 100);
    setTimelineProgress(progressPercent);
  };

  const handlePlayToggle = () => {
    setIsPlayingTimeline(!isPlayingTimeline);
    if (!isPlayingTimeline) {
      // Trigger short preview of current track as start sound
      onPreviewSound(selectedTrack.audioFrequency, `Synthesizing ${selectedTrack.title} rhythm`);
      onAddTrackToast(`Timeline playback active at ${selectedTrack.bpm} BPM!`);
    } else {
      onAddTrackToast("Timeline playback paused.");
    }
  };

  const handleAddTrackToTimeline = (track) => {
    if (timelineTracks.some(t => t.id === track.id)) {
      onAddTrackToast(`"${track.title}" is already layered onto your timeline!`);
      return;
    }
    setTimelineTracks([...timelineTracks, track]);
    onAddTrackToast(`✂️ Linked "${track.title}" to Audio Track ${timelineTracks.length + 1}!`);
    onPreviewSound(track.audioFrequency * 1.2, `Layered ${track.title}`);
  };

  const handleRemoveTrack = (id, name) => {
    setTimelineTracks(timelineTracks.filter(t => t.id !== id));
    onAddTrackToast(`Removed "${name}" from sequence.`);
  };

  return (
    <section id="studio-timeline-simulator" className="bg-[#ff4e98] py-16 px-4 md:px-12 relative overflow-hidden select-none">
      {/* Decorative vector background nodes */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-black/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-10 max-w-3xl mx-auto text-black">
          <div className="inline-flex items-center gap-2 bg-black text-[#ff4e98] px-3.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-mono font-extrabold mb-4">
            <Sparkles className="w-3 h-3 text-[#ff4e98]" />
            <span>Interactive Premiere Pro Integration Demo</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-sans font-extrabold tracking-tight text-stone-950">
            Preview, Sync & Soundcheck
          </h2>
          <p className="text-sm md:text-base mt-3 font-semibold text-stone-900 max-w-xl">
            Experience our premium, frame-perfect browser plugin. Search our catalog, audition royalty-safe tracks, and lock beats directly with your media.
          </p>
        </div>

        {/* FULL-VIEW EMULATOR BOX */}
        <div className="bg-[#18181a] border-4 border-black rounded-lg shadow-2xl relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 text-stone-300 font-sans">
          
          {/* HEADER BAR OF EMULATOR */}
          <div className="col-span-12 bg-[#2d2d30] border-b border-black py-2.5 px-4 flex items-center justify-between text-xs tracking-wide">
            <div className="flex items-center gap-3">
              {/* Window Controls */}
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500 block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500 block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500 block"></span>
              </div>
              <span className="font-mono text-stone-400 text-[11px] uppercase font-bold ml-1 border-l border-zinc-700 pl-4 flex items-center gap-1.5 text-stone-100">
                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping"></span>
                Project: CosmicTimeline_Edit_v2.prproj
              </span>
            </div>
            <div className="flex items-center gap-5 font-mono text-[10px] text-stone-400">
              <span>SEQUENCE 01</span>
              <span className="text-[#ff4e98] font-bold">EPIDEMIC PREVIEW COMPACT</span>
            </div>
          </div>

          {/* LEFT SIDE: PREMIERE PRO CORE INTERFACE (8 COLS) */}
          <div className="lg:col-span-8 flex flex-col border-r border-[#101011]">
            
            {/* VIDEO SEQUENCE PANELS HEADER & MONITORS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black">
              
              {/* Left Monitor: Original Astronaut Sequence */}
              <div className="bg-[#1b1c1e] p-4 flex flex-col justify-between relative min-h-[220px]">
                <div className="flex items-center justify-between text-[10px] font-mono tracking-wider text-stone-400">
                  <div className="flex items-center gap-1.5 bg-[#2d2d30] rounded p-0.5 border border-zinc-700">
                    <button 
                      onClick={() => {
                        setLeftMonitorMode("video");
                        onAddTrackToast("Left monitor mapped to raw video media");
                      }}
                      className={`px-1.5 py-0.5 rounded text-[8.5px] uppercase font-bold transition-all cursor-pointer ${leftMonitorMode === "video" ? "bg-black text-[#ff4e98] font-extrabold" : "text-stone-400 hover:text-white"}`}
                    >
                      Video Feed
                    </button>
                    <button 
                      onClick={() => {
                        setLeftMonitorMode("2d");
                        onAddTrackToast("Left monitor mapped to live 2D Waveform Canvas");
                      }}
                      className={`px-1.5 py-0.5 rounded text-[8.5px] uppercase font-bold transition-all cursor-pointer ${leftMonitorMode === "2d" ? "bg-[#ff4e98] text-black font-extrabold" : "text-stone-400 hover:text-white"}`}
                    >
                      2D Kinetic
                    </button>
                  </div>
                  <span className="text-zinc-500 font-mono">00:00:00:00</span>
                </div>

                {/* Simulated Astronaut / 2D Canvas Screen Graphic */}
                <div className="my-3 flex-1 flex flex-col items-center justify-center relative overflow-hidden rounded bg-black border border-zinc-800 min-h-[125px]">
                  {leftMonitorMode === "2d" ? (
                    <Visualizer2D isPlaying={isPlayingTimeline} bpm={selectedTrack.bpm} accentColor="#ff4e98" />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.06),transparent_80%)] pointer-events-none"></div>
                      
                      {/* Floating Micro Astronaut */}
                      <motion.div 
                        animate={{
                          y: [0, -10, 0],
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                          duration: 6,
                          repeat: Infinity,
                        }}
                        className="flex flex-col items-center justify-center text-center text-zinc-500 relative z-10"
                      >
                        <svg className="w-10 h-10 text-[#ff4e98]/80 mb-2 cursor-pointer transform hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M12 2a5 5 0 0 1 5 5v3a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5z" />
                          <path d="M19 11v1a7 7 0 0 1-14 0v-1" />
                          <line x1="12" y1="19" x2="12" y2="22" />
                        </svg>
                        <span className="font-mono text-[9px] text-[#ff4e98] tracking-widest uppercase font-bold">Space Floating Sequence</span>
                        <span className="text-[8px] text-zinc-400 mt-0.5">Duration: 12.0s</span>
                      </motion.div>
                    </>
                  )}
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                  <span>Source Source</span>
                  <span>00:00:12:00</span>
                </div>
              </div>

              {/* Right Monitor: Program Sequence with Planet / Earth view */}
              <div className="bg-[#1b1c1e] p-4 flex flex-col justify-between relative min-h-[220px]">
                <div className="flex items-center justify-between text-[10px] font-mono tracking-wider text-stone-400">
                  <div className="flex items-center gap-1.5 bg-[#2d2d30] rounded p-0.5 border border-zinc-700">
                    <button 
                      onClick={() => {
                        setRightMonitorMode("video");
                        onAddTrackToast("Program monitor mapped to raw sequence stream");
                      }}
                      className={`px-1.5 py-0.5 rounded text-[8.5px] uppercase font-bold transition-all cursor-pointer ${rightMonitorMode === "video" ? "bg-black text-[#ff4e98] font-extrabold" : "text-stone-400 hover:text-white"}`}
                    >
                      Program Feed
                    </button>
                    <button 
                      onClick={() => {
                        setRightMonitorMode("3d");
                        onAddTrackToast("Program monitor mapped to live 3D Rasterizer sphere model");
                      }}
                      className={`px-1.5 py-0.5 rounded text-[8.5px] uppercase font-bold transition-all cursor-pointer ${rightMonitorMode === "3d" ? "bg-[#ff4e98] text-black font-extrabold" : "text-stone-400 hover:text-white"}`}
                    >
                      3D Vector
                    </button>
                  </div>
                  <span className="text-[#ff4e98] font-bold">00:00:{(timelineProgress * 0.12).toFixed(2)}</span>
                </div>

                {/* Space Planet Earth Arc Video Screen */}
                <div className="my-3 flex-1 overflow-hidden relative rounded bg-black border border-zinc-800 flex flex-col justify-between p-3 min-h-[125px]">
                  {rightMonitorMode === "3d" ? (
                    <Visualizer3D isPlaying={isPlayingTimeline} bpm={selectedTrack.bpm} accentColor="#ff4e98" />
                  ) : (
                    <>
                      <div className="absolute top-[-30px] right-[-30px] w-48 h-48 rounded-full bg-gradient-to-tr from-sky-950 via-teal-900 to-emerald-950 opacity-60"></div>
                      
                      {/* Arc earth line curve */}
                      <div className="absolute bottom-0 left-[-20%] w-[140%] h-[60%] rounded-t-full border-t-2 border-indigo-400 bg-gradient-to-b from-indigo-950/40 to-black/90 flex flex-col items-center justify-center">
                        <span className="text-[10px] font-mono text-indigo-300 font-bold tracking-widest uppercase animate-pulse">Earth Horizon</span>
                        <span className="text-[8px] text-indigo-400 tracking-wider">Sync Scale 1.0</span>
                      </div>

                      {/* Program view metadata overlays */}
                      <div className="relative z-10 flex items-center justify-between">
                        <div className="px-1.5 py-0.5 bg-black/80 rounded border border-zinc-700 font-mono text-[8px] text-[#ff4e98]">
                          FIT {activeMediaFilter.toUpperCase()}
                        </div>
                        <div className="px-1.5 py-0.5 bg-black/80 rounded border border-zinc-700 font-mono text-[8px]">
                          {selectedTrack.bpm} AUDIO LAYER INDEX
                        </div>
                      </div>

                      {/* Playhead visualization pulse inside screen */}
                      {isPlayingTimeline && (
                        <div className="absolute left-1/2 top-10 -translate-x-1/2 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                          <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest">LIVE MASTER SYNC</span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Fit menu select */}
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                  <div className="flex items-center gap-2">
                    <span className="text-[#ff4e98] font-bold">00:00:00:23</span>
                    <select 
                      value={activeMediaFilter} 
                      onChange={(e) => setActiveMediaFilter(e.target.value)}
                      className="bg-[#2d2d30] text-zinc-200 text-[9px] border-0 outline-none rounded py-0.5 px-1 font-bold cursor-pointer"
                    >
                      <option value="fit">Fit</option>
                      <option value="50%">50%</option>
                      <option value="100%">100%</option>
                    </select>
                  </div>
                  <span>Full</span>
                  <span>00:02:51:00</span>
                </div>
              </div>

            </div>

            {/* TIMELINE CONTROL PLATFORM TRACKS LIST */}
            <div className="bg-[#232325] border-t border-black p-3 flex flex-col justify-between">
              
              {/* Playback Controls Row */}
              <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-zinc-800">
                <div className="flex items-center gap-4">
                  
                  {/* Sequence 01 Tab */}
                  <div className="flex items-center gap-2 bg-[#1b1c1e] text-zinc-200 border-t-2 border-[#ff4e98] px-3.5 py-1.5 rounded-t text-xs font-mono font-bold">
                    <Film className="w-3.5 h-3.5 text-[#ff4e98]" />
                    <span>Sequence 01</span>
                  </div>

                  {/* Current Position Marker */}
                  <div className="hidden md:flex items-center gap-2 border border-zinc-800 bg-black/30 rounded px-2.5 py-1 text-xs font-mono font-bold">
                    <span className="text-[#ff4e98]">PLAY POSITION:</span>
                    <span className="text-stone-100">00:00:{(timelineProgress * 0.12).toFixed(2)}</span>
                  </div>
                </div>

                {/* Primary Premiere Play button selector */}
                <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded border border-zinc-800">
                  <button 
                    onClick={handlePlayToggle}
                    className="p-1 px-3 bg-[#ff4e98] hover:bg-[#ff1e78] text-black rounded font-mono font-extrabold text-[10px] uppercase flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {isPlayingTimeline ? (
                      <>
                        <Pause className="w-3 h-3 fill-current stroke-[2.5]" />
                        <span>PAUSE</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 fill-current stroke-[2.5]" />
                        <span>PLAY SEQUENCE</span>
                      </>
                    )}
                  </button>

                  <button 
                    onClick={() => {
                      setTimelineProgress(0);
                      onAddTrackToast("Sequence reset to frame 0.");
                    }}
                    className="p-1 px-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded font-mono text-[9px] uppercase cursor-pointer"
                  >
                    RESET
                  </button>
                </div>
              </div>

              {/* TIMELINE TRACK ROWS GRID */}
              <div className="space-y-1.5 font-mono text-[10px]">
                
                {/* Timeline Progress Bar Wrapper */}
                <div 
                  className="bg-black/80 h-6.5 rounded relative border border-zinc-800 cursor-pointer overflow-hidden flex items-center select-none"
                  onClick={handleTimelineProgressClick}
                >
                  <div className="absolute inset-y-0 left-0 bg-[#ff4e98]/5 pointer-events-none" style={{ width: `${timelineProgress}%` }}></div>
                  
                  {/* Grid Lines ticks */}
                  <div className="absolute inset-0 flex justify-between px-2 text-[8px] text-zinc-600 pointer-events-none select-none">
                    <span>0:00</span>
                    <span>1:00</span>
                    <span>2:00</span>
                    <span>3:00</span>
                    <span>4:00</span>
                  </div>

                  {/* Playhead Red Needle Pin */}
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-10"
                    style={{ left: `${timelineProgress}%` }}
                  >
                    <div className="absolute top-0 -left-1.5 w-3.5 h-2 bg-rose-600 border border-black rounded-sm"></div>
                  </div>
                </div>

                {/* VIDEO CHANNELS */}
                <div className="grid grid-cols-12 gap-1 items-stretch bg-black/25 p-1 rounded border border-zinc-800/60">
                  <div className="col-span-2 bg-[#2d2d30] p-1.5 rounded flex items-center justify-between px-2">
                    <span className="font-bold text-zinc-400">V3</span>
                    <span className="text-[8px] text-zinc-600">FX Overlay</span>
                  </div>
                  <div className="col-span-10 bg-indigo-950/20 border border-indigo-500/25 p-1.5 rounded text-[9px] text-[#ff4e98] font-bold tracking-wider flex items-center gap-2 pl-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff4e98] animate-pulse"></span>
                    🎬 Active Space_Planet.mp4 Sequence & Cosmic Overlay SFX
                  </div>
                </div>

                {/* AUDIO TRACKS (Dynamic synced based on catalog clicks!) */}
                {timelineTracks.map((trCode, trIdx) => (
                  <div key={`track-${trCode.id}-${trIdx}`} className="grid grid-cols-12 gap-1 items-stretch bg-black/25 p-1 rounded border border-zinc-800/60">
                    <div className="col-span-2 bg-[#ff4e98]/10 border border-[#ff4e98]/20 p-1.5 rounded flex items-center justify-between px-2">
                      <span className="font-bold text-[#ff4e98]">A{trIdx + 1}</span>
                      <span className="text-[7.5px] font-mono text-[#ff4e98] uppercase">Epidemic</span>
                    </div>
                    
                    {/* Synchronized sound waveform block */}
                    <div className="col-span-10 relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded p-1 flex items-center justify-between pl-3 group">
                      
                      {/* Fake stylized waveform spikes */}
                      <div className="absolute inset-0 flex items-center gap-0.5 opacity-20 pointer-events-none select-none pl-2">
                        {Array.from({ length: 48 }).map((_, wId) => {
                          const height = Math.abs(Math.sin((wId + trIdx * 10) * 0.3)) * 80;
                          return (
                            <span 
                              key={wId} 
                              style={{ height: `${height}%` }} 
                              className={`w-1 rounded-full bg-emerald-400`}
                            ></span>
                          );
                        })}
                      </div>

                      <div className="relative z-10 flex items-center gap-2.5 text-[10px]">
                        <span className="px-1.5 py-0.5 bg-zinc-850 rounded text-stone-300 border border-zinc-800 font-bold block">
                          🎹 EPIDEMIC SOURCE
                        </span>
                        <span className="font-extrabold text-stone-100">{trCode.title}</span>
                        <span className="text-zinc-400 text-[9px]">by {trCode.artist}</span>
                        <span className="text-[#ff4e98] text-[9.5px]/none bg-[#ff4e98]/10 border border-[#ff4e98]/20 px-1 rounded font-bold font-mono">
                          {trCode.bpm} BPM
                        </span>
                      </div>

                      <button 
                        onClick={() => handleRemoveTrack(trCode.id, trCode.title)}
                        className="relative z-10 p-1 hover:bg-black/40 text-zinc-500 hover:text-rose-500 rounded transition-colors cursor-pointer"
                        title="Delete Layer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {timelineTracks.length === 0 && (
                  <div className="p-4 text-center bg-black/40 border border-dashed border-zinc-800 rounded text-zinc-500 font-mono text-[9px]/relaxed">
                    NO LICENSED AUDIO SYNCED ON THE TIMELINE.<br />
                    SELECT A TRACK FROM THE RIGHT EPIDEMIC SOUND PLUGIN PANEL AND CLICK <span className="font-bold text-[#ff4e98]">"ADD TO TIMELINE"</span>
                  </div>
                )}

              </div>

            </div>

          </div>

          {/* RIGHT SIDE: EPIDEMIC SOUND PREMIUM PLUGIN OVERLAY (4 COLS) */}
          <div className="lg:col-span-4 bg-[#1e1e21] flex flex-col justify-between">
            
            <div className="p-4 border-b border-black">
              {/* Plugin Header with search bar */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-stone-100 text-[11px] uppercase tracking-widest font-mono font-extrabold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Epidemic Sound Panel
                </span>
                <span className="text-[8px] uppercase tracking-[0.2em] bg-stone-850 border border-zinc-800 text-stone-400 px-1.5 py-0.5 rounded font-extrabold">
                  v4.1 PRO
                </span>
              </div>

              {/* Add filter tab */}
              <div className="bg-[#2a2a2d] hover:bg-[#343438] transition-colors p-2 text-[10px] text-stone-300 font-mono border border-zinc-800 rounded flex items-center justify-between cursor-pointer mb-4">
                <span className="flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#ff4e98]" />
                  <span>Filter by BPM / Mood scale...</span>
                </span>
                <Plus className="w-3.5 h-3.5" />
              </div>

              {/* Interactive Horizontal Cards Tab Row */}
              <div className="grid grid-cols-3 gap-1 px-0.5 mb-5 select-none text-[8.5px] uppercase tracking-wider font-extrabold text-center">
                {["Now Trending", "Epidemic Essentials", "Creators Pick"].map((tab) => {
                  const isTabActive = activeTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => {
                        setActiveTab(tab);
                        onAddTrackToast(`Viewing curated playlist: ${tab}`);
                      }}
                      className={`py-2 px-1 rounded transition-all cursor-pointer font-extrabold ${
                        isTabActive 
                          ? "bg-[#ff4e98] text-black shadow-lg" 
                          : "bg-[#252527] hover:bg-[#2d2d2f] text-stone-400 hover:text-stone-200 border border-zinc-850"
                      }`}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>

              {/* Curated Sub-Catalog Section Header */}
              <div className="flex items-center justify-between mb-4 text-[9px] font-mono uppercase tracking-widest text-[#ff4e98] font-bold">
                <span>Curated Matches</span>
                <span className="text-zinc-600">Sort by: NEWEST</span>
              </div>

              {/* TRACK LISTING CARDS */}
              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                {SIMULATOR_TRACKS.map((item) => {
                  const isCurrent = selectedTrack.id === item.id;
                  
                  return (
                    <div 
                      key={item.id}
                      onClick={() => {
                        setSelectedTrack(item);
                        onPreviewSound(item.audioFrequency, item.title);
                      }}
                      className={`p-3 rounded border text-left transition-all cursor-pointer select-none relative ${
                        isCurrent 
                          ? "bg-[#252527] border-[#ff4e98]/50 shadow-md translate-y-[-1px]" 
                          : "bg-[#18181a] hover:bg-[#202022] border-zinc-850"
                      }`}
                    >
                      {/* Active green pin bullet */}
                      {isCurrent && (
                        <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#ff4e98] animate-pulse"></span>
                      )}

                      <div className="flex items-start gap-2.5">
                        {/* Audio Wave Icon decoration */}
                        <div className="w-7 h-7 bg-zinc-850 rounded flex items-center justify-center shrink-0 border border-zinc-800">
                          <Music className={`w-3.5 h-3.5 ${isCurrent ? "text-[#ff4e98] animate-pulse" : "text-zinc-600"}`} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-sans text-[11px] font-bold text-stone-100 truncate flex items-center gap-1.5">
                            {item.title}
                            {item.isExplicit && (
                              <span className="bg-zinc-800 text-[7px] font-mono px-1 rounded text-red-400 font-extrabold border border-red-500/10">EXPLICIT</span>
                            )}
                          </p>
                          <p className="font-sans text-[9px]/none text-stone-400 mt-1 truncate">{item.artist}</p>
                          
                          <div className="flex items-center gap-2 mt-2 font-mono text-[8px] text-zinc-500">
                            <span className="text-zinc-400">{item.bpm} BPM</span>
                            <span>•</span>
                            <span>{item.duration}</span>
                            <span>•</span>
                            <span className="truncate">{item.genre}</span>
                          </div>
                        </div>
                      </div>

                      {/* Expandable sound knob triggers */}
                      {isCurrent && (
                        <div className="mt-2.5 pt-2 border-t border-zinc-800 flex items-center justify-between select-none">
                          <span className="text-[8px] font-mono text-zinc-400 uppercase italic">
                            {item.mood}
                          </span>

                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddTrackToTimeline(item);
                            }}
                            className="bg-[#ff4e98] hover:bg-[#ff1e78] text-black text-[8px] tracking-wider uppercase font-extrabold px-2.5 py-1 rounded flex items-center gap-1 cursor-pointer transition-transform hover:scale-[1.02]"
                          >
                            <PlusCircle className="w-2.5 h-2.5 stroke-[3]" />
                            <span>Add to Timeline</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>

            {/* LOWER STATS AND LICENSING SAFE CHANNELS INFO */}
            <div className="p-4 bg-[#141416] border-t border-black text-[9px] font-mono text-stone-400 leading-relaxed space-y-3">
              <div className="flex items-center justify-between text-[#ff4e98] font-bold">
                <span>Safe Channel Whitelisted</span>
                <span className="w-1.5 h-1.5 rounded bg-emerald-500"></span>
              </div>
              <p className="text-[8.5px] leading-relaxed text-zinc-500">
                All music selected undergoes zero-claim matching immediately. Previewing at 256kbps master accuracy. Save changes and export safely below.
              </p>
              
              <button 
                onClick={() => {
                  onAddTrackToast("Exporting project media synced with Epidemic sound clearances: Completed!");
                  onPreviewSound(440, "Export Success chime");
                }}
                className="w-full bg-stone-800 hover:bg-black text-stone-100 font-sans font-bold text-[10px] uppercase tracking-wider py-2.5 rounded border border-zinc-700 hover:border-[#ff4e98] transition-all cursor-pointer text-center block"
              >
                📥 Save & Clear sequence claims
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
