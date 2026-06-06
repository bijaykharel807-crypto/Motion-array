import * as React from "react";
import { motion } from "motion/react";
import { X, Music } from "lucide-react";

export default function AuthModal({ 
  authModal, 
  setAuthModal, 
  onSubmitRegistration, 
  onSubmitLogin 
}) {
  if (!authModal.isOpen) return null;

  return (
    <>
      <div 
        onClick={() => setAuthModal({ ...authModal, isOpen: false })}
        className="fixed inset-0 bg-black z-50 backdrop-blur-sm"
      />

      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#121214] border border-[#ff4e98]/20 text-white rounded p-7 shadow-2xl z-53 overflow-hidden font-sans"
      >
        {/* Top Row */}
        <div className="flex items-center justify-between mb-6 pb-2.5 border-b border-[#ff4e98]/15">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#ff4e98] rounded flex items-center justify-center text-black">
              <Music className="w-4 h-4" />
            </div>
            <span className="font-serif text-lg font-light text-white">
              {authModal.type === "register" ? "Safelist New Account" : "Access Safelist Profile"}
            </span>
          </div>

          <button 
            onClick={() => setAuthModal({ ...authModal, isOpen: false })}
            className="p-1 px-2 text-stone-400 hover:text-[#ff4e98] bg-white/5 border border-white/10 rounded cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Modal Switch Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#151617] rounded-none mb-6 border border-[#ff4e98]/10">
          <button
            type="button"
            onClick={() => setAuthModal({ ...authModal, type: "register" })}
            className={`flex-1 py-2 text-xs font-medium rounded-none text-center transition-all cursor-pointer ${
              authModal.type === "register" ? "bg-[#ff4e98] text-black font-extrabold" : "text-stone-400 hover:text-white"
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => setAuthModal({ ...authModal, type: "login" })}
            className={`flex-1 py-2 text-xs font-medium rounded-none text-center transition-all cursor-pointer ${
              authModal.type === "login" ? "bg-[#ff4e98] text-black font-extrabold" : "text-stone-400 hover:text-white"
            }`}
          >
            Log In
          </button>
        </div>

        {authModal.type === "register" ? (
          /* Registration Form */
          <form onSubmit={onSubmitRegistration} className="space-y-4 font-sans text-sm">
            <div>
              <label className="block text-[10px] font-mono uppercase text-[#ff4e98] tracking-[0.15em] mb-2 font-semibold">Creator Real Name</label>
              <input 
                type="text"
                name="fullname"
                required
                placeholder="e.g. Bijay Kharel"
                className="w-full bg-[#18191b] border border-[#ff4e98]/20 rounded px-4 py-3 text-xs placeholder:text-stone-500 font-mono tracking-wide focus:outline-none focus:ring-1 focus:ring-[#ff4e98] text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-[#ff4e98] tracking-[0.15em] mb-2 font-semibold">Primary Social Channel URL</label>
              <input 
                type="text"
                name="channel"
                required
                placeholder="e.g. youtube.com/bijaykharel"
                className="w-full bg-[#18191b] border border-[#ff4e98]/20 rounded px-4 py-3 text-xs placeholder:text-stone-500 font-mono tracking-wide focus:outline-none focus:ring-1 focus:ring-[#ff4e98] text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-[#ff4e98] tracking-[0.15em] mb-2 font-semibold">Email address</label>
              <input 
                type="email"
                name="email"
                required
                placeholder="e.g. bijaykharel807@gmail.com"
                className="w-full bg-[#18191b] border border-[#ff4e98]/20 rounded px-4 py-3 text-xs placeholder:text-stone-500 font-mono tracking-wide focus:outline-none focus:ring-1 focus:ring-[#ff4e98] text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-[#ff4e98] tracking-[0.15em] mb-2 font-semibold">Select Coverage Plan</label>
              <select 
                name="plan"
                className="w-full bg-[#18191b] border border-[#ff4e98]/20 rounded px-4 py-3 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#ff4e98] text-stone-300"
              >
                <option value="Personal Trial (Free 30-Day trial)">Personal Coverage Plan (Free 30-Day trial)</option>
                <option value="Commercial Plan ($15/mo)">Commercial Plan ($15/mo - For Clients)</option>
                <option value="Enterprise Coverage (Custom)">Enterprise Broadcaster License (Custom)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#ff4e98] hover:bg-rose-600 text-black font-sans font-extrabold uppercase tracking-[0.25em] text-xs rounded-none border-0 transition-all duration-300 cursor-pointer block text-center"
            >
              Authorize Channel Safelists
            </button>

            <p className="text-[10px] text-stone-400 font-mono leading-relaxed text-center font-light pt-2 uppercase tracking-wide">
              Signing up clears you under Epidemic Sound Layout guidelines. No payment details required.
            </p>
          </form>
        ) : (
          /* Login Form */
          <form onSubmit={onSubmitLogin} className="space-y-4 font-sans text-sm">
            <div>
              <label className="block text-[10px] font-mono uppercase text-[#ff4e98] tracking-[0.15em] mb-2 font-semibold">Creator Account Email</label>
              <input 
                type="email"
                name="email"
                required
                placeholder="e.g. bijaykharel807@gmail.com"
                className="w-full bg-[#18191b] border border-[#ff4e98]/20 rounded px-4 py-3 text-xs placeholder:text-stone-500 font-mono tracking-wide focus:outline-none focus:ring-1 focus:ring-[#ff4e98] text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-[#ff4e98] tracking-[0.15em] mb-2 font-semibold">Protected Password</label>
              <input 
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-[#18191b] border border-[#ff4e98]/20 rounded px-4 py-3 text-xs placeholder:text-stone-500 font-mono tracking-wide focus:outline-none focus:ring-1 focus:ring-[#ff4e98] text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#ff4e98] hover:bg-rose-600 text-black font-sans font-extrabold uppercase tracking-[0.25em] text-xs rounded-none border-0 transition-all duration-300 cursor-pointer block text-center"
            >
              Sync Safelist Credentials
            </button>
          </form>
        )}
      </motion.div>
    </>
  );
}
