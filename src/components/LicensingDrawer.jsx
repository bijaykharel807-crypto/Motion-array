import * as React from "react";
import { motion } from "motion/react";
import { X, ShoppingBag, Music, CheckCircle2, FileText } from "lucide-react";

export default function LicensingDrawer({
  isLicensingDrawerOpen,
  setIsLicensingDrawerOpen,
  licensedTrackIds,
  setLicensedTrackIds,
  tracks,
  user,
  setAuthModal,
  licenseSuccessDetails,
  setLicenseSuccessDetails,
  onAddToast,
  onPreviewSound,
  processFinalLicense
}) {
  if (!isLicensingDrawerOpen) return null;

  return (
    <>
      <div 
        onClick={() => setIsLicensingDrawerOpen(false)}
        className="fixed inset-0 bg-black z-50 backdrop-blur-sm"
      />

      <motion.div 
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 220 }}
        className="fixed top-0 right-0 h-full w-full max-w-md bg-[#121214] border-l border-[#ff4e98]/20 text-white shadow-2xl p-6.5 flex flex-col justify-between z-50 overflow-y-auto font-sans"
      >
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-[#ff4e98]/15 mb-6">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#ff4e98]" />
              <h3 className="text-lg font-serif font-light text-white">Claims Clearance Center</h3>
            </div>
            <button 
              onClick={() => setIsLicensingDrawerOpen(false)}
              className="p-1 px-2.5 rounded bg-white/5 hover:bg-[#ff4e98] hover:text-black cursor-pointer transition-colors border border-white/10"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {licensedTrackIds.length === 0 ? (
            <div className="text-center py-14 flex flex-col items-center justify-center gap-4 text-stone-400">
              <Music className="w-10 h-10 text-stone-500 stroke-[1.5]" />
              <p className="text-xs font-light tracking-wide leading-relaxed">Your clearance dashboard is empty. Add track permits from below to safeguard your channel uploads!</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-[10px] text-stone-400 uppercase font-mono tracking-[0.2em] font-semibold text-[#ff4e98]">Ready to Safelist</p>
              {tracks.filter((t) => licensedTrackIds.includes(t.id)).map((track) => (
                <div key={track.id} className="p-3.5 bg-white/5 border border-[#ff4e98]/15 rounded flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-3">
                    <div 
                      style={{ backgroundColor: track.accentColor }} 
                      className="w-9 h-9 rounded flex items-center justify-center text-black"
                    >
                      <Music className="w-4.5 h-4.5 text-black" />
                    </div>
                    <div>
                      <p className="text-xs font-serif text-white">{track.title}</p>
                      <p className="text-[10px] text-stone-400 font-mono mt-0.5">{track.artist}</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setLicensedTrackIds((prev) => prev.filter((id) => id !== track.id));
                      onAddToast(`Removed track Clearance`);
                    }}
                    className="p-1.5 rounded text-stone-400 hover:text-[#ff4e98] hover:bg-white/5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              <hr className="border-white/5 my-5" />

              {/* Choose Channel Profile License Plan */}
              <div className="space-y-3 p-4 bg-white/5 border border-[#ff4e98]/15 rounded">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#a8b0ba] font-bold block mb-1">Authorizing Profile</span>
                {user ? (
                  <div className="text-xs space-y-1.5 text-stone-300 font-mono">
                    <p>👤 <strong className="text-white">Producer:</strong> {user.name}</p>
                    <p className="truncate">📺 <strong className="text-white">Channel:</strong> {user.channelUrl}</p>
                    <p>🏷️ <strong className="text-white">Plan:</strong> {user.plan}</p>
                  </div>
                ) : (
                  <div className="text-xs text-stone-400 space-y-2">
                    <p className="font-light">No active channel link verified. Cleared uploads will require creating a free profile.</p>
                    <button 
                      onClick={() => setAuthModal({ isOpen: true, type: "register" })}
                      className="w-full py-2 bg-white/10 hover:bg-[#ff4e98] hover:text-black text-white font-mono uppercase tracking-[0.1em] text-[10px] rounded transition-colors duration-250 cursor-pointer border border-[#ff4e98]/20"
                    >
                      Assign Target Channel (Safelisting)
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action buttons footer */}
        {licensedTrackIds.length > 0 && (
          <div className="space-y-3 pt-6 border-t border-white/5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-400 font-light">Global Claim Protection:</span>
              <span className="text-green-400 font-mono font-medium">100% Guaranteed</span>
            </div>

            {licenseSuccessDetails ? (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded space-y-3">
                <div className="flex items-center gap-2 text-green-400 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Safelisted Claim Key Activated</span>
                </div>
                <p className="text-[10px] font-mono text-stone-300 break-all bg-black/30 p-2.5 rounded select-all leading-tight">
                  {licenseSuccessDetails}
                </p>
                <button 
                  onClick={() => {
                    setLicenseSuccessDetails(null);
                    setLicensedTrackIds([]);
                    setIsLicensingDrawerOpen(false);
                    onAddToast("Permit record reset successfully!");
                  }}
                  className="w-full text-xs font-semibold text-center text-stone-400 hover:text-white transition-colors block pb-1 border-b border-transparent hover:border-stone-400 pt-1 cursor-pointer"
                >
                  Reset and License More
                </button>
              </div>
            ) : (
              <button
                onClick={processFinalLicense}
                className="w-full py-4 bg-[#ff4e98] hover:bg-rose-600 text-black font-sans text-xs font-extrabold uppercase tracking-[0.2em] rounded border-0 shadow-2xl transition-all duration-300 hover:scale-[1.01] active:scale-95 text-center cursor-pointer flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4 text-black" />
                <span>Clear Active Tracks Clearance</span>
              </button>
            )}
          </div>
        )}
      </motion.div>
    </>
  );
}
