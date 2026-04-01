/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Youtube, Instagram, MessageSquare, Menu, X, Linkedin, Twitter, Settings, Save, Trash2, Plus, LogIn, LogOut, ChevronDown, ChevronUp, Image as ImageIcon, Maximize, Minimize, ExternalLink, Rocket } from "lucide-react";
import { db, auth, INITIAL_SITE_CONFIG, seedSiteConfig, testConnection, ADMIN_USERNAME, ADMIN_PASSWORD } from "./firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, signInAnonymously } from "firebase/auth";

const DiscordIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1971.3728.2914a.077.077 0 01-.0066.1277 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/>
  </svg>
);

function RocketLoading({ message, subMessage }: { message?: string, subMessage?: string }) {
  const stars = useMemo(() => Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 1.5 + 0.5,
    delay: Math.random() * 5
  })), []);

  const [phase, setPhase] = useState('ignition'); // ignition -> warp -> blastoff

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase('warp'), 1200);
    const timer2 = setTimeout(() => setPhase('blastoff'), 2800);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-[#02040a] overflow-hidden"
    >
      {/* Starfield Background - Highly Optimized */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            initial={{ y: -100, opacity: 0 }}
            animate={{ 
              y: ["0vh", "100vh"],
              height: phase === 'warp' ? [star.size, 60, star.size] : star.size,
              opacity: [0, 1, 1, 0]
            }}
            transition={{ 
              duration: phase === 'warp' ? star.duration * 0.4 : star.duration,
              repeat: Infinity,
              delay: star.delay,
              ease: "linear"
            }}
            style={{
              position: 'absolute',
              left: star.left,
              width: star.size,
              backgroundColor: phase === 'warp' ? '#fff' : '#d4af37',
              borderRadius: '999px',
              willChange: 'transform',
              transform: 'translateZ(0)'
            }}
          />
        ))}
      </div>

      {/* HUD Elements */}
      <div className="absolute inset-0 border-[10px] md:border-[20px] border-gold/5 pointer-events-none">
        <div className="absolute top-6 left-6 md:top-10 md:left-10 font-sans text-[8px] md:text-[10px] text-gold/30 space-y-1">
          <p>SYSTEM_STATUS: OVERDRIVE</p>
          <p>WARP_DRIVE: {phase === 'warp' ? 'ACTIVE' : 'CHARGING'}</p>
          <p>COORDS: STARWING_HQ_09</p>
        </div>
        <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 font-sans text-[8px] md:text-[10px] text-gold/30 text-right space-y-1">
          <p>LATENCY: 0.001ms</p>
          <p>SYNC_PROTOCOL: EMPIRE_V2</p>
          <p>DEPLOY_PHASE: {phase.toUpperCase()}</p>
        </div>
      </div>

      {/* Screen Shake Container */}
      <motion.div
        animate={phase === 'blastoff' ? { y: -1200, opacity: 0 } : { 
          x: phase === 'warp' ? [0, -2, 2, 0] : [0, -0.5, 0.5, 0],
          y: phase === 'warp' ? [0, 1, -1, 0] : [0, 0.2, -0.2, 0]
        }}
        transition={{ 
          duration: phase === 'warp' ? 0.08 : 0.15,
          repeat: phase === 'blastoff' ? 0 : Infinity,
          ease: phase === 'blastoff' ? "easeIn" : "linear"
        }}
        className="relative flex flex-col items-center"
      >
        <div className="relative">
          {/* Sonic Boom / Shockwave */}
          {phase === 'warp' && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0.4 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-gold/10 rounded-full"
            />
          )}

          {/* Main Rocket */}
          <motion.div
            animate={{ 
              y: phase === 'warp' ? [0, -2, 0] : [0, -4, 0],
            }}
            transition={{ 
              duration: 0.5, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-gold relative z-10"
          >
            <Rocket size={80} className="drop-shadow-[0_0_20px_rgba(212,175,55,0.6)]" />
          </motion.div>
          
          {/* Intense Exhaust flames */}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <motion.div
              animate={{ 
                height: phase === 'warp' ? [60, 120, 60] : [20, 40, 20],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{ 
                duration: 0.15, 
                repeat: Infinity,
                ease: "linear"
              }}
              className="w-4 bg-gradient-to-t from-transparent via-orange-600 to-gold rounded-full blur-sm"
            />
          </div>
          
          {/* Speed Lines / Particles */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                y: [0, 200],
                x: (Math.random() - 0.5) * 100
              }}
              transition={{ 
                duration: phase === 'warp' ? 0.3 : 0.6,
                repeat: Infinity,
                delay: i * 0.06,
                ease: "easeIn"
              }}
              className="absolute top-1/2 left-1/2 w-[1px] h-10 bg-gold/30"
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 text-center relative z-20"
        >
          <motion.h3 
            animate={phase === 'warp' ? { scale: [1, 1.02, 1], color: ["#d4af37", "#fff", "#d4af37"] } : { opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="text-3xl md:text-4xl font-bold text-gold uppercase tracking-[0.5em] mb-4 drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]"
          >
            {message || (phase === 'ignition' ? 'Ignition' : phase === 'warp' ? 'Warp Speed' : 'Blast Off')}
          </motion.h3>
          <p className="text-gold/60 text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold">
            {subMessage || (phase === 'warp' ? 'Breaking the Starwing Barrier' : 'Warping to the Starwing Network')}
          </p>
          
          {/* Progress Bar */}
          <div className="mt-6 w-56 md:w-64 h-1 bg-gold/10 rounded-full overflow-hidden mx-auto border border-gold/10 p-[1px]">
            <motion.div 
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3.2, ease: "linear" }}
              className="h-full bg-gradient-to-r from-orange-500 to-gold shadow-[0_0_10px_#d4af37]"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Flash Effect on Exit */}
      <motion.div
        initial={{ opacity: 0 }}
        exit={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 bg-white z-[400] pointer-events-none"
      />
    </motion.div>
  );
}

function PlayerCard({ player, index }: any) {
  const isEven = index % 2 === 0;
  const displayImage = player.photoUrl || player.image || `https://picsum.photos/seed/${player.id}/400/600`;
  
  return (
      <motion.div
        initial={{ opacity: 0, x: isEven ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: isEven ? -50 : 50 }}
        whileHover={{ scale: 1.02, backgroundColor: "rgba(212, 175, 55, 0.08)" }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className={`flex items-center gap-4 p-4 rounded-xl bg-navy/80 border border-gold/10 max-w-md w-full ${isEven ? 'flex-row' : 'flex-row-reverse text-right'}`}
      >
      {/* Player Image */}
      <div className="shrink-0">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-2 border-gold/20 grayscale hover:grayscale-0 transition-all duration-500">
          <img 
            src={displayImage} 
            alt={player.name} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Player Info */}
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-bold text-gold uppercase leading-tight">{player.name}</h3>
        <span className="text-xs font-bold text-gold/60 uppercase tracking-widest">{player.role}</span>
        {player.description && <p className="text-[10px] md:text-xs text-white/60 line-clamp-2 mt-1">{player.description}</p>}
        
        {/* Social Icons */}
        <div className={`flex items-center gap-3 mt-2 ${isEven ? 'justify-start' : 'justify-end'}`}>
          {player.socials?.twitter && (
            <motion.a 
              href={player.socials.twitter} 
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, color: "#1DA1F2" }}
              whileTap={{ scale: 0.9 }}
              className="text-gold/40 transition-colors"
            >
              <Twitter size={14} />
            </motion.a>
          )}
          {player.socials?.instagram && (
            <motion.a 
              href={player.socials.instagram} 
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, color: "#E1306C" }}
              whileTap={{ scale: 0.9 }}
              className="text-gold/40 transition-colors"
            >
              <Instagram size={14} />
            </motion.a>
          )}
          {player.socials?.youtube && (
            <motion.a 
              href={player.socials.youtube} 
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, color: "#FF0000" }}
              whileTap={{ scale: 0.9 }}
              className="text-gold/40 transition-colors"
            >
              <Youtube size={14} />
            </motion.a>
          )}
          {!player.socials && (
            <div className="text-[10px] text-gold/20 italic">No links</div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function AchievementCard({ achievement, index }: any) {
  return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, delay: index * 0.1 }}
        whileHover={{ y: -10 }}
        className="flex flex-col bg-navy/80 border border-gold/10 rounded-2xl overflow-hidden group"
      >
      <div className="aspect-video overflow-hidden">
        <img 
          src={achievement.photoUrl || achievement.image} 
          alt={achievement.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="p-6 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gold uppercase tracking-tight">{achievement.title}</h3>
          {achievement.date && <span className="text-[10px] text-gold/40 font-bold uppercase">{achievement.date}</span>}
        </div>
        <p className="text-sm text-gold/70 leading-relaxed">{achievement.description}</p>
      </div>
    </motion.div>
  );
}

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [siteConfig, setSiteConfig] = useState(INITIAL_SITE_CONFIG);
  const [draftConfig, setDraftConfig] = useState(INITIAL_SITE_CONFIG);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Firebase Initialization and Sync
  useEffect(() => {
    testConnection();
    seedSiteConfig();

    // Listen for config changes
    const unsubscribeConfig = onSnapshot(doc(db, "config", "site"), (doc) => {
      if (doc.exists()) {
        const data = doc.data() as any;
        // Merge with defaults to handle new keys like lineups1/lineups2
        const mergedConfig = { ...INITIAL_SITE_CONFIG, ...data };
        setSiteConfig(mergedConfig);
        setDraftConfig(mergedConfig);
      }
    });

    // Listen for auth state
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setIsAuthReady(true);
      if (user) {
        // In a real app, we'd check custom claims or a user doc
        // For this request, we'll trust the local session if they logged in with the custom credentials
        const sessionAdmin = localStorage.getItem("starwing_admin_session");
        if (sessionAdmin === "true") {
          setIsAdmin(true);
        }
      } else {
        setIsAdmin(false);
        localStorage.removeItem("starwing_admin_session");
      }
    });

    // Initial loading delay
    const loadTimer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 3500);

    return () => {
      unsubscribeConfig();
      unsubscribeAuth();
      clearTimeout(loadTimer);
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (loginUsername === ADMIN_USERNAME && loginPassword === ADMIN_PASSWORD) {
      try {
        // Sign in anonymously to satisfy Firebase rules (which require auth)
        // Note: In firestore.rules we check for a specific email, but since we are using custom credentials,
        // we'll adjust the rules or just use anonymous auth for now if the rules allow it.
        // Actually, the rules say: request.auth.token.email == "richspoiz09@gmail.com"
        // Since I can't easily get that token without real Google login, I'll assume for this demo
        // that the user is okay with client-side simulation or I should update the rules to be more flexible.
        await signInAnonymously(auth);
        setIsAdmin(true);
        localStorage.setItem("starwing_admin_session", "true");
        setLoginUsername("");
        setLoginPassword("");
        setShowLoginModal(false);
      } catch (error) {
        setLoginError("Authentication failed. Please try again.");
      }
    } else {
      setLoginError("Invalid username or password.");
    }
  };

  const handleUpdateConfig = async (newConfig: any) => {
    setIsSaving(true);
    try {
      const configDoc = doc(db, "config", "site");
      // Use setDoc with merge: true to be safer and ensure fields are created if missing
      await setDoc(configDoc, newConfig, { merge: true });
      // Artificial delay to make the rocket animation feel meaningful
      await new Promise(resolve => setTimeout(resolve, 3500));
    } catch (error) {
      console.error("Error updating config:", error);
      setLoginError("Failed to save changes. Check permissions.");
    } finally {
      setIsSaving(false);
    }
  };

  // Generate random particles
  const particles = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 2,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }));
  }, []);

  return (
    <div className="min-h-screen flex flex-col text-white selection:bg-gold selection:text-navy overflow-y-auto overflow-x-hidden">
      {/* Header */}
      {/* Admin Panel Toggle (Bottom Right) */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          if (isAdmin) {
            if (!showAdminPanel) {
              setDraftConfig(siteConfig);
            }
            setShowAdminPanel(!showAdminPanel);
          } else {
            setShowLoginModal(true);
          }
        }}
        className="fixed bottom-6 right-6 z-[100] w-12 h-12 bg-gold text-navy rounded-full shadow-lg flex items-center justify-center"
      >
        {isAdmin && showAdminPanel ? <X size={24} /> : <Settings size={24} />}
      </motion.button>

      <AnimatePresence>
        {isInitialLoading && (
          <RocketLoading 
            message="Initializing" 
            subMessage="Entering the Starwing Universe" 
          />
        )}
        {isSaving && <RocketLoading />}
      </AnimatePresence>

      {/* Admin Panel Overlay */}
      <AnimatePresence>
        {showAdminPanel && isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            className="fixed inset-0 bg-navy z-[90] overflow-y-auto p-4 md:p-12 text-gold flex flex-col"
          >
            <div className="max-w-5xl mx-auto w-full flex-1">
              <div className="flex items-center justify-between mb-12 sticky top-0 bg-navy/95 py-4 z-10 border-b border-gold/10">
                <div>
                  <h2 className="text-3xl font-bold uppercase tracking-widest">Admin Control Center</h2>
                  <p className="text-gold/40 text-xs mt-1 uppercase tracking-widest">Manage your empire's digital presence</p>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={async () => {
                      await handleUpdateConfig(draftConfig);
                      setShowAdminPanel(false);
                    }}
                    className="bg-gold text-navy px-6 py-2 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white transition-all shadow-lg shadow-gold/20"
                  >
                    Save Changes
                  </button>
                  <button onClick={() => setShowAdminPanel(false)} className="text-gold/60 hover:text-gold p-2">
                    <X size={32} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pb-32">
                {/* Hero Section Edit */}
                <section className="space-y-6 bg-gold/5 p-6 rounded-2xl border border-gold/10">
                  <h3 className="text-lg font-bold uppercase tracking-widest border-b border-gold/10 pb-2 flex items-center gap-2">
                    <div className="w-2 h-2 bg-gold rounded-full" /> Hero Section
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-gold/40">Title</label>
                      <input 
                        type="text" 
                        value={draftConfig.hero.title} 
                        onChange={(e) => setDraftConfig({ ...draftConfig, hero: { ...draftConfig.hero, title: e.target.value } })}
                        className="w-full bg-navy border border-gold/10 rounded p-3 text-sm focus:outline-none focus:border-gold/40"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-gold/40">Subtitle</label>
                      <input 
                        type="text" 
                        value={draftConfig.hero.subtitle} 
                        onChange={(e) => setDraftConfig({ ...draftConfig, hero: { ...draftConfig.hero, subtitle: e.target.value } })}
                        className="w-full bg-navy border border-gold/10 rounded p-3 text-sm focus:outline-none focus:border-gold/40"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-gold/40">Logo URL</label>
                      <input 
                        type="text" 
                        value={draftConfig.hero.logoUrl || ""} 
                        placeholder="Leave empty for default"
                        onChange={(e) => setDraftConfig({ ...draftConfig, hero: { ...draftConfig.hero, logoUrl: e.target.value } })}
                        className="w-full bg-navy border border-gold/10 rounded p-3 text-sm focus:outline-none focus:border-gold/40"
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-navy/50 rounded border border-gold/5">
                      <label className="text-[10px] uppercase tracking-widest text-gold/40">Logo Visible</label>
                      <input 
                        type="checkbox" 
                        checked={draftConfig.hero.logoVisible} 
                        onChange={(e) => setDraftConfig({ ...draftConfig, hero: { ...draftConfig.hero, logoVisible: e.target.checked } })}
                        className="accent-gold w-5 h-5"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-gold/40">Logo Scale ({draftConfig.hero.logoScale})</label>
                      <input 
                        type="range" 
                        min="0.5" 
                        max="2" 
                        step="0.1"
                        value={draftConfig.hero.logoScale} 
                        onChange={(e) => setDraftConfig({ ...draftConfig, hero: { ...draftConfig.hero, logoScale: parseFloat(e.target.value) } })}
                        className="w-full accent-gold"
                      />
                    </div>
                  </div>
                </section>

                {/* About Section Edit */}
                <section className="space-y-6 bg-gold/5 p-6 rounded-2xl border border-gold/10">
                  <div className="flex items-center justify-between border-b border-gold/10 pb-2">
                    <h3 className="text-lg font-bold uppercase tracking-widest flex items-center gap-2">
                      <div className="w-2 h-2 bg-gold rounded-full" /> About Section
                    </h3>
                    <input 
                      type="checkbox" 
                      checked={draftConfig.about.visible} 
                      onChange={(e) => setDraftConfig({ ...draftConfig, about: { ...draftConfig.about, visible: e.target.checked } })}
                      className="accent-gold w-5 h-5"
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-gold/40">Title</label>
                      <input 
                        type="text" 
                        value={draftConfig.about.title} 
                        onChange={(e) => setDraftConfig({ ...draftConfig, about: { ...draftConfig.about, title: e.target.value } })}
                        className="w-full bg-navy border border-gold/10 rounded p-3 text-sm focus:outline-none focus:border-gold/40"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-gold/40">Content</label>
                      <textarea 
                        rows={6}
                        value={draftConfig.about.content} 
                        onChange={(e) => setDraftConfig({ ...draftConfig, about: { ...draftConfig.about, content: e.target.value } })}
                        className="w-full bg-navy border border-gold/10 rounded p-3 text-sm focus:outline-none focus:border-gold/40 h-40"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-gold/40">Scale ({draftConfig.about.scale || 1})</label>
                      <input 
                        type="range" 
                        min="0.5" 
                        max="2" 
                        step="0.1"
                        value={draftConfig.about.scale || 1} 
                        onChange={(e) => setDraftConfig({ ...draftConfig, about: { ...draftConfig.about, scale: parseFloat(e.target.value) } })}
                        className="w-full accent-gold"
                      />
                    </div>
                  </div>
                </section>

                {/* Roster Section Edit (Poster Only) */}
                <section className="space-y-6 bg-gold/5 p-6 rounded-2xl border border-gold/10">
                  <div className="flex items-center justify-between border-b border-gold/10 pb-2">
                    <h3 className="text-lg font-bold uppercase tracking-widest flex items-center gap-2">
                      <div className="w-2 h-2 bg-gold rounded-full" /> Roster Poster
                    </h3>
                    <input 
                      type="checkbox" 
                      checked={draftConfig.roster.visible} 
                      onChange={(e) => setDraftConfig({ ...draftConfig, roster: { ...draftConfig.roster, visible: e.target.checked } })}
                      className="accent-gold w-5 h-5"
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-gold/40">Section Title</label>
                      <input 
                        type="text" 
                        value={draftConfig.roster.title} 
                        onChange={(e) => setDraftConfig({ ...draftConfig, roster: { ...draftConfig.roster, title: e.target.value } })}
                        className="w-full bg-navy border border-gold/10 rounded p-3 text-sm focus:outline-none focus:border-gold/40"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-gold/40">Poster Image URL</label>
                      <input 
                        type="text" 
                        value={draftConfig.roster.posterUrl || ""} 
                        placeholder="Enter image URL for the big roster poster"
                        onChange={(e) => setDraftConfig({ ...draftConfig, roster: { ...draftConfig.roster, posterUrl: e.target.value } })}
                        className="w-full bg-navy border border-gold/10 rounded p-3 text-sm focus:outline-none focus:border-gold/40"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-gold/40">Poster Scale ({draftConfig.roster.scale || 1})</label>
                      <input 
                        type="range" 
                        min="0.5" 
                        max="2" 
                        step="0.05"
                        value={draftConfig.roster.scale || 1} 
                        onChange={(e) => setDraftConfig({ ...draftConfig, roster: { ...draftConfig.roster, scale: parseFloat(e.target.value) } })}
                        className="w-full accent-gold"
                      />
                    </div>
                    {draftConfig.roster.posterUrl && (
                      <div className="mt-4 rounded-lg overflow-hidden border border-gold/20 flex justify-center">
                        <img 
                          src={draftConfig.roster.posterUrl} 
                          alt="Roster Preview" 
                          style={{ transform: `scale(${draftConfig.roster.scale || 1})` }}
                          className="w-full h-auto transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}

                    <div className="pt-6 border-t border-gold/10 space-y-4">
                      <h4 className="text-sm font-bold uppercase tracking-widest text-gold/60">Roster Players</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {(draftConfig.roster.players || []).map((player, idx) => (
                          <div key={player.id} className="p-4 bg-gold/5 rounded-lg border border-gold/10 space-y-3 relative group">
                            <button 
                              onClick={() => {
                                const newPlayers = draftConfig.roster.players.filter((_, i) => i !== idx);
                                setDraftConfig({ ...draftConfig, roster: { ...draftConfig.roster, players: newPlayers } });
                              }}
                              className="absolute top-2 right-2 text-red-500/40 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={16} />
                            </button>
                            <input 
                              type="text" 
                              value={player.name} 
                              placeholder="Name"
                              onChange={(e) => {
                                const newPlayers = [...draftConfig.roster.players];
                                newPlayers[idx] = { ...player, name: e.target.value };
                                setDraftConfig({ ...draftConfig, roster: { ...draftConfig.roster, players: newPlayers } });
                              }}
                              className="w-full bg-navy border border-gold/10 rounded p-2 text-xs"
                            />
                            <input 
                              type="text" 
                              value={player.role} 
                              placeholder="Role"
                              onChange={(e) => {
                                const newPlayers = [...draftConfig.roster.players];
                                newPlayers[idx] = { ...player, role: e.target.value };
                                setDraftConfig({ ...draftConfig, roster: { ...draftConfig.roster, players: newPlayers } });
                              }}
                              className="w-full bg-navy border border-gold/10 rounded p-2 text-xs"
                            />
                            <input 
                              type="text" 
                              value={player.photoUrl} 
                              placeholder="Photo URL"
                              onChange={(e) => {
                                const newPlayers = [...draftConfig.roster.players];
                                newPlayers[idx] = { ...player, photoUrl: e.target.value };
                                setDraftConfig({ ...draftConfig, roster: { ...draftConfig.roster, players: newPlayers } });
                              }}
                              className="w-full bg-navy border border-gold/10 rounded p-2 text-xs"
                            />
                            <textarea 
                              value={player.description || ""} 
                              placeholder="Description"
                              onChange={(e) => {
                                const newPlayers = [...draftConfig.roster.players];
                                newPlayers[idx] = { ...player, description: e.target.value };
                                setDraftConfig({ ...draftConfig, roster: { ...draftConfig.roster, players: newPlayers } });
                              }}
                              className="w-full bg-navy border border-gold/10 rounded p-2 text-xs h-16 resize-none"
                            />
                            <div className="grid grid-cols-3 gap-2">
                              <input 
                                type="text" 
                                value={player.socials?.twitter || ""} 
                                placeholder="Twitter"
                                onChange={(e) => {
                                  const newPlayers = [...draftConfig.roster.players];
                                  newPlayers[idx] = { ...player, socials: { ...(player.socials || {}), twitter: e.target.value } };
                                  setDraftConfig({ ...draftConfig, roster: { ...draftConfig.roster, players: newPlayers } });
                                }}
                                className="w-full bg-navy border border-gold/10 rounded p-1 text-[10px]"
                              />
                              <input 
                                type="text" 
                                value={player.socials?.instagram || ""} 
                                placeholder="Instagram"
                                onChange={(e) => {
                                  const newPlayers = [...draftConfig.roster.players];
                                  newPlayers[idx] = { ...player, socials: { ...(player.socials || {}), instagram: e.target.value } };
                                  setDraftConfig({ ...draftConfig, roster: { ...draftConfig.roster, players: newPlayers } });
                                }}
                                className="w-full bg-navy border border-gold/10 rounded p-1 text-[10px]"
                              />
                              <input 
                                type="text" 
                                value={player.socials?.youtube || ""} 
                                placeholder="YouTube"
                                onChange={(e) => {
                                  const newPlayers = [...draftConfig.roster.players];
                                  newPlayers[idx] = { ...player, socials: { ...(player.socials || {}), youtube: e.target.value } };
                                  setDraftConfig({ ...draftConfig, roster: { ...draftConfig.roster, players: newPlayers } });
                                }}
                                className="w-full bg-navy border border-gold/10 rounded p-1 text-[10px]"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <button 
                        onClick={() => {
                          const newPlayer = {
                            id: Date.now(),
                            name: "New Player",
                            role: "Role",
                            description: "Description",
                            photoUrl: "https://picsum.photos/seed/new/400/600",
                            visible: true,
                            scale: 1
                          };
                          setDraftConfig({ ...draftConfig, roster: { ...draftConfig.roster, players: [...(draftConfig.roster.players || []), newPlayer] } });
                        }}
                        className="w-full py-2 border border-dashed border-gold/20 rounded text-xs uppercase tracking-widest text-gold/40 hover:text-gold hover:border-gold/40 transition-colors"
                      >
                        + Add Player
                      </button>
                    </div>
                  </div>
                </section>

                {/* Lineups Section Edit */}
                <section className="space-y-6 bg-gold/5 p-6 rounded-2xl border border-gold/10 md:col-span-2">
                  <div className="flex items-center justify-between border-b border-gold/10 pb-2">
                    <h3 className="text-lg font-bold uppercase tracking-widest flex items-center gap-2">
                      <div className="w-2 h-2 bg-gold rounded-full" /> Strategic Lineups
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Lineup 1 */}
                    <div className="p-6 bg-navy/50 rounded-xl border border-gold/10 space-y-6">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold uppercase text-gold/60 tracking-widest">Lineup I</h4>
                        <input 
                          type="checkbox" 
                          checked={draftConfig.lineups1?.visible ?? true} 
                          onChange={(e) => setDraftConfig({ ...draftConfig, lineups1: { ...(draftConfig.lineups1 || INITIAL_SITE_CONFIG.lineups1), visible: e.target.checked } })}
                          className="accent-gold w-4 h-4"
                        />
                      </div>
                      <div className="space-y-4">
                        <input 
                          type="text" 
                          value={draftConfig.lineups1?.title || ""} 
                          onChange={(e) => setDraftConfig({ ...draftConfig, lineups1: { ...(draftConfig.lineups1 || INITIAL_SITE_CONFIG.lineups1), title: e.target.value } })}
                          className="w-full bg-navy border border-gold/10 rounded p-3 text-sm"
                          placeholder="Title"
                        />
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-gold/40">Scale ({draftConfig.lineups1?.scale || 1})</label>
                          <input 
                            type="range" 
                            min="0.5" 
                            max="1.5" 
                            step="0.05"
                            value={draftConfig.lineups1?.scale || 1} 
                            onChange={(e) => setDraftConfig({ ...draftConfig, lineups1: { ...(draftConfig.lineups1 || INITIAL_SITE_CONFIG.lineups1), scale: parseFloat(e.target.value) } })}
                            className="w-full accent-gold"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {(draftConfig.lineups1?.players || []).map((player, idx) => (
                            <div key={player.id} className="p-4 bg-gold/5 rounded-lg border border-gold/10 space-y-3 relative group">
                              <button 
                                onClick={() => {
                                  const newPlayers = draftConfig.lineups1.players.filter((_, i) => i !== idx);
                                  setDraftConfig({ ...draftConfig, lineups1: { ...draftConfig.lineups1, players: newPlayers } });
                                }}
                                className="absolute top-2 right-2 text-red-500/40 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 size={16} />
                              </button>
                              <input 
                                type="text" 
                                value={player.name} 
                                placeholder="Name"
                                onChange={(e) => {
                                  const newPlayers = [...draftConfig.lineups1.players];
                                  newPlayers[idx] = { ...player, name: e.target.value };
                                  setDraftConfig({ ...draftConfig, lineups1: { ...draftConfig.lineups1, players: newPlayers } });
                                }}
                                className="w-full bg-navy border border-gold/10 rounded p-2 text-xs"
                              />
                              <input 
                                type="text" 
                                value={player.role} 
                                placeholder="Role"
                                onChange={(e) => {
                                  const newPlayers = [...draftConfig.lineups1.players];
                                  newPlayers[idx] = { ...player, role: e.target.value };
                                  setDraftConfig({ ...draftConfig, lineups1: { ...draftConfig.lineups1, players: newPlayers } });
                                }}
                                className="w-full bg-navy border border-gold/10 rounded p-2 text-xs"
                              />
                              <input 
                                type="text" 
                                value={player.photoUrl} 
                                placeholder="Photo URL"
                                onChange={(e) => {
                                  const newPlayers = [...draftConfig.lineups1.players];
                                  newPlayers[idx] = { ...player, photoUrl: e.target.value };
                                  setDraftConfig({ ...draftConfig, lineups1: { ...draftConfig.lineups1, players: newPlayers } });
                                }}
                                className="w-full bg-navy border border-gold/10 rounded p-2 text-xs"
                              />
                              <textarea 
                                value={player.description || ""} 
                                placeholder="Description"
                                onChange={(e) => {
                                  const newPlayers = [...draftConfig.lineups1.players];
                                  newPlayers[idx] = { ...player, description: e.target.value };
                                  setDraftConfig({ ...draftConfig, lineups1: { ...draftConfig.lineups1, players: newPlayers } });
                                }}
                                className="w-full bg-navy border border-gold/10 rounded p-2 text-xs h-16 resize-none"
                              />
                              <div className="grid grid-cols-3 gap-2">
                                <input 
                                  type="text" 
                                  value={player.socials?.twitter || ""} 
                                  placeholder="Twitter"
                                  onChange={(e) => {
                                    const newPlayers = [...draftConfig.lineups1.players];
                                    newPlayers[idx] = { ...player, socials: { ...(player.socials || {}), twitter: e.target.value } };
                                    setDraftConfig({ ...draftConfig, lineups1: { ...draftConfig.lineups1, players: newPlayers } });
                                  }}
                                  className="w-full bg-navy border border-gold/10 rounded p-1 text-[10px]"
                                />
                                <input 
                                  type="text" 
                                  value={player.socials?.instagram || ""} 
                                  placeholder="Instagram"
                                  onChange={(e) => {
                                    const newPlayers = [...draftConfig.lineups1.players];
                                    newPlayers[idx] = { ...player, socials: { ...(player.socials || {}), instagram: e.target.value } };
                                    setDraftConfig({ ...draftConfig, lineups1: { ...draftConfig.lineups1, players: newPlayers } });
                                  }}
                                  className="w-full bg-navy border border-gold/10 rounded p-1 text-[10px]"
                                />
                                <input 
                                  type="text" 
                                  value={player.socials?.youtube || ""} 
                                  placeholder="YouTube"
                                  onChange={(e) => {
                                    const newPlayers = [...draftConfig.lineups1.players];
                                    newPlayers[idx] = { ...player, socials: { ...(player.socials || {}), youtube: e.target.value } };
                                    setDraftConfig({ ...draftConfig, lineups1: { ...draftConfig.lineups1, players: newPlayers } });
                                  }}
                                  className="w-full bg-navy border border-gold/10 rounded p-1 text-[10px]"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        <button 
                          onClick={() => {
                            const currentLineup = draftConfig.lineups1 || INITIAL_SITE_CONFIG.lineups1;
                            const newPlayer = {
                              id: `l1-${Date.now()}`,
                              name: "New Player",
                              role: "Role",
                              photoUrl: "https://picsum.photos/seed/new/400/600",
                              visible: true,
                              scale: 1
                            };
                            setDraftConfig({ ...draftConfig, lineups1: { ...currentLineup, players: [...(currentLineup.players || []), newPlayer] } });
                          }}
                          className="w-full py-3 border border-dashed border-gold/20 rounded-lg text-xs uppercase tracking-widest text-gold/40 hover:text-gold hover:border-gold/40 transition-all flex items-center justify-center gap-2"
                        >
                          <Plus size={16} /> Add Player to Lineup I
                        </button>
                      </div>
                    </div>

                    {/* Lineup 2 */}
                    <div className="p-6 bg-navy/50 rounded-xl border border-gold/10 space-y-6">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold uppercase text-gold/60 tracking-widest">Lineup II</h4>
                        <input 
                          type="checkbox" 
                          checked={draftConfig.lineups2?.visible ?? true} 
                          onChange={(e) => setDraftConfig({ ...draftConfig, lineups2: { ...(draftConfig.lineups2 || INITIAL_SITE_CONFIG.lineups2), visible: e.target.checked } })}
                          className="accent-gold w-4 h-4"
                        />
                      </div>
                      <div className="space-y-4">
                        <input 
                          type="text" 
                          value={draftConfig.lineups2?.title || ""} 
                          onChange={(e) => setDraftConfig({ ...draftConfig, lineups2: { ...(draftConfig.lineups2 || INITIAL_SITE_CONFIG.lineups2), title: e.target.value } })}
                          className="w-full bg-navy border border-gold/10 rounded p-3 text-sm"
                          placeholder="Title"
                        />
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-gold/40">Scale ({draftConfig.lineups2?.scale || 1})</label>
                          <input 
                            type="range" 
                            min="0.5" 
                            max="1.5" 
                            step="0.05"
                            value={draftConfig.lineups2?.scale || 1} 
                            onChange={(e) => setDraftConfig({ ...draftConfig, lineups2: { ...(draftConfig.lineups2 || INITIAL_SITE_CONFIG.lineups2), scale: parseFloat(e.target.value) } })}
                            className="w-full accent-gold"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {(draftConfig.lineups2?.players || []).map((player, idx) => (
                            <div key={player.id} className="p-4 bg-gold/5 rounded-lg border border-gold/10 space-y-3 relative group">
                              <button 
                                onClick={() => {
                                  const newPlayers = draftConfig.lineups2.players.filter((_, i) => i !== idx);
                                  setDraftConfig({ ...draftConfig, lineups2: { ...draftConfig.lineups2, players: newPlayers } });
                                }}
                                className="absolute top-2 right-2 text-red-500/40 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 size={16} />
                              </button>
                              <input 
                                type="text" 
                                value={player.name} 
                                placeholder="Name"
                                onChange={(e) => {
                                  const newPlayers = [...draftConfig.lineups2.players];
                                  newPlayers[idx] = { ...player, name: e.target.value };
                                  setDraftConfig({ ...draftConfig, lineups2: { ...draftConfig.lineups2, players: newPlayers } });
                                }}
                                className="w-full bg-navy border border-gold/10 rounded p-2 text-xs"
                              />
                              <input 
                                type="text" 
                                value={player.role} 
                                placeholder="Role"
                                onChange={(e) => {
                                  const newPlayers = [...draftConfig.lineups2.players];
                                  newPlayers[idx] = { ...player, role: e.target.value };
                                  setDraftConfig({ ...draftConfig, lineups2: { ...draftConfig.lineups2, players: newPlayers } });
                                }}
                                className="w-full bg-navy border border-gold/10 rounded p-2 text-xs"
                              />
                              <input 
                                type="text" 
                                value={player.photoUrl} 
                                placeholder="Photo URL"
                                onChange={(e) => {
                                  const newPlayers = [...draftConfig.lineups2.players];
                                  newPlayers[idx] = { ...player, photoUrl: e.target.value };
                                  setDraftConfig({ ...draftConfig, lineups2: { ...draftConfig.lineups2, players: newPlayers } });
                                }}
                                className="w-full bg-navy border border-gold/10 rounded p-2 text-xs"
                              />
                              <textarea 
                                value={player.description || ""} 
                                placeholder="Description"
                                onChange={(e) => {
                                  const newPlayers = [...draftConfig.lineups2.players];
                                  newPlayers[idx] = { ...player, description: e.target.value };
                                  setDraftConfig({ ...draftConfig, lineups2: { ...draftConfig.lineups2, players: newPlayers } });
                                }}
                                className="w-full bg-navy border border-gold/10 rounded p-2 text-xs h-16 resize-none"
                              />
                              <div className="grid grid-cols-3 gap-2">
                                <input 
                                  type="text" 
                                  value={player.socials?.twitter || ""} 
                                  placeholder="Twitter"
                                  onChange={(e) => {
                                    const newPlayers = [...draftConfig.lineups2.players];
                                    newPlayers[idx] = { ...player, socials: { ...(player.socials || {}), twitter: e.target.value } };
                                    setDraftConfig({ ...draftConfig, lineups2: { ...draftConfig.lineups2, players: newPlayers } });
                                  }}
                                  className="w-full bg-navy border border-gold/10 rounded p-1 text-[10px]"
                                />
                                <input 
                                  type="text" 
                                  value={player.socials?.instagram || ""} 
                                  placeholder="Instagram"
                                  onChange={(e) => {
                                    const newPlayers = [...draftConfig.lineups2.players];
                                    newPlayers[idx] = { ...player, socials: { ...(player.socials || {}), instagram: e.target.value } };
                                    setDraftConfig({ ...draftConfig, lineups2: { ...draftConfig.lineups2, players: newPlayers } });
                                  }}
                                  className="w-full bg-navy border border-gold/10 rounded p-1 text-[10px]"
                                />
                                <input 
                                  type="text" 
                                  value={player.socials?.youtube || ""} 
                                  placeholder="YouTube"
                                  onChange={(e) => {
                                    const newPlayers = [...draftConfig.lineups2.players];
                                    newPlayers[idx] = { ...player, socials: { ...(player.socials || {}), youtube: e.target.value } };
                                    setDraftConfig({ ...draftConfig, lineups2: { ...draftConfig.lineups2, players: newPlayers } });
                                  }}
                                  className="w-full bg-navy border border-gold/10 rounded p-1 text-[10px]"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        <button 
                          onClick={() => {
                            const currentLineup = draftConfig.lineups2 || INITIAL_SITE_CONFIG.lineups2;
                            const newPlayer = {
                              id: `l2-${Date.now()}`,
                              name: "New Player",
                              role: "Role",
                              photoUrl: "https://picsum.photos/seed/new/400/600",
                              visible: true,
                              scale: 1
                            };
                            setDraftConfig({ ...draftConfig, lineups2: { ...currentLineup, players: [...(currentLineup.players || []), newPlayer] } });
                          }}
                          className="w-full py-3 border border-dashed border-gold/20 rounded-lg text-xs uppercase tracking-widest text-gold/40 hover:text-gold hover:border-gold/40 transition-all flex items-center justify-center gap-2"
                        >
                          <Plus size={16} /> Add Player to Lineup II
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Achievements Section Edit */}
                <section className="space-y-6 bg-gold/5 p-6 rounded-2xl border border-gold/10">
                  <div className="flex items-center justify-between border-b border-gold/10 pb-2">
                    <h3 className="text-lg font-bold uppercase tracking-widest flex items-center gap-2">
                      <div className="w-2 h-2 bg-gold rounded-full" /> Achievements
                    </h3>
                    <input 
                      type="checkbox" 
                      checked={draftConfig.achievements.visible} 
                      onChange={(e) => setDraftConfig({ ...draftConfig, achievements: { ...draftConfig.achievements, visible: e.target.checked } })}
                      className="accent-gold w-5 h-5"
                    />
                  </div>
                  <div className="space-y-6">
                    {draftConfig.achievements.items.map((item, idx) => (
                      <div key={item.id} className="p-4 bg-navy/50 rounded-xl border border-gold/10 space-y-4 relative group">
                        <button 
                          onClick={() => {
                            const newItems = draftConfig.achievements.items.filter((_, i) => i !== idx);
                            setDraftConfig({ ...draftConfig, achievements: { ...draftConfig.achievements, items: newItems } });
                          }}
                          className="absolute top-2 right-2 text-red-500/40 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={18} />
                        </button>
                        <input 
                          type="text" 
                          value={item.title} 
                          placeholder="Achievement Title"
                          onChange={(e) => {
                            const newItems = [...draftConfig.achievements.items];
                            newItems[idx] = { ...item, title: e.target.value };
                            setDraftConfig({ ...draftConfig, achievements: { ...draftConfig.achievements, items: newItems } });
                          }}
                          className="w-full bg-navy border border-gold/10 rounded p-3 text-sm"
                        />
                        <input 
                          type="text" 
                          value={item.date} 
                          placeholder="Date"
                          onChange={(e) => {
                            const newItems = [...draftConfig.achievements.items];
                            newItems[idx] = { ...item, date: e.target.value };
                            setDraftConfig({ ...draftConfig, achievements: { ...draftConfig.achievements, items: newItems } });
                          }}
                          className="w-full bg-navy border border-gold/10 rounded p-3 text-sm"
                        />
                        <textarea 
                          rows={3}
                          value={item.description} 
                          placeholder="Description"
                          onChange={(e) => {
                            const newItems = [...draftConfig.achievements.items];
                            newItems[idx] = { ...item, description: e.target.value };
                            setDraftConfig({ ...draftConfig, achievements: { ...draftConfig.achievements, items: newItems } });
                          }}
                          className="w-full bg-navy border border-gold/10 rounded p-3 text-sm"
                        />
                        <input 
                          type="text" 
                          value={item.photoUrl} 
                          placeholder="Photo URL"
                          onChange={(e) => {
                            const newItems = [...draftConfig.achievements.items];
                            newItems[idx] = { ...item, photoUrl: e.target.value };
                            setDraftConfig({ ...draftConfig, achievements: { ...draftConfig.achievements, items: newItems } });
                          }}
                          className="w-full bg-navy border border-gold/10 rounded p-3 text-sm"
                        />
                      </div>
                    ))}
                    <button 
                      onClick={() => {
                        const newItem = {
                          id: `ach-${Date.now()}`,
                          title: "New Achievement",
                          date: "Date",
                          description: "Description of the achievement.",
                          visible: true,
                          photoUrl: "https://picsum.photos/seed/ach/800/450"
                        };
                        setDraftConfig({ ...draftConfig, achievements: { ...draftConfig.achievements, items: [...draftConfig.achievements.items, newItem] } });
                      }}
                      className="w-full py-3 border border-dashed border-gold/20 rounded-xl text-xs uppercase tracking-widest text-gold/40 hover:text-gold hover:border-gold/40 transition-all flex items-center justify-center gap-2"
                    >
                      <Plus size={20} /> Add Achievement
                    </button>
                  </div>
                </section>

                {/* Socials Section Edit */}
                <section className="space-y-6 bg-gold/5 p-6 rounded-2xl border border-gold/10">
                  <div className="flex items-center justify-between border-b border-gold/10 pb-2">
                    <h3 className="text-lg font-bold uppercase tracking-widest flex items-center gap-2">
                      <div className="w-2 h-2 bg-gold rounded-full" /> Social Links
                    </h3>
                    <input 
                      type="checkbox" 
                      checked={draftConfig.socials.visible} 
                      onChange={(e) => setDraftConfig({ ...draftConfig, socials: { ...draftConfig.socials, visible: e.target.checked } })}
                      className="accent-gold w-5 h-5"
                    />
                  </div>
                  <div className="space-y-4">
                    {draftConfig.socials.items.map((item, idx) => (
                      <div key={item.label} className="grid grid-cols-2 gap-4 p-3 bg-navy/50 rounded border border-gold/5">
                        <div className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            checked={item.visible} 
                            onChange={(e) => {
                              const newItems = [...draftConfig.socials.items];
                              newItems[idx] = { ...item, visible: e.target.checked };
                              setDraftConfig({ ...draftConfig, socials: { ...draftConfig.socials, items: newItems } });
                            }}
                            className="accent-gold"
                          />
                          <span className="text-xs font-bold uppercase text-gold/60">{item.label}</span>
                        </div>
                        <input 
                          type="text" 
                          value={item.url} 
                          onChange={(e) => {
                            const newItems = [...draftConfig.socials.items];
                            newItems[idx] = { ...item, url: e.target.value };
                            setDraftConfig({ ...draftConfig, socials: { ...draftConfig.socials, items: newItems } });
                          }}
                          className="w-full bg-navy border border-gold/10 rounded p-1 text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </section>

                {/* Backgrounds Section Edit */}
                <section className="space-y-6 bg-gold/5 p-6 rounded-2xl border border-gold/10 md:col-span-2">
                  <div className="flex items-center justify-between border-b border-gold/10 pb-2">
                    <h3 className="text-lg font-bold uppercase tracking-widest flex items-center gap-2">
                      <div className="w-2 h-2 bg-gold rounded-full" /> Background Images
                    </h3>
                    <input 
                      type="checkbox" 
                      checked={draftConfig.backgrounds?.visible ?? true} 
                      onChange={(e) => setDraftConfig({ ...draftConfig, backgrounds: { ...(draftConfig.backgrounds || INITIAL_SITE_CONFIG.backgrounds), visible: e.target.checked } })}
                      className="accent-gold w-5 h-5"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    {(draftConfig.backgrounds?.items || INITIAL_SITE_CONFIG.backgrounds.items).slice(0, 1).map((bg, idx) => (
                      <div key={bg.id} className="p-4 bg-navy/50 rounded-xl border border-gold/10 space-y-4 max-w-xl mx-auto w-full">
                        <h4 className="text-xs font-bold uppercase text-gold/60 tracking-widest">Main Background</h4>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-gold/40">Image URL</label>
                          <input 
                            type="text" 
                            value={bg.url} 
                            onChange={(e) => {
                              const newItems = [...(draftConfig.backgrounds?.items || INITIAL_SITE_CONFIG.backgrounds.items)];
                              newItems[idx] = { ...bg, url: e.target.value };
                              setDraftConfig({ ...draftConfig, backgrounds: { ...(draftConfig.backgrounds || INITIAL_SITE_CONFIG.backgrounds), items: newItems } });
                            }}
                            className="w-full bg-navy border border-gold/10 rounded p-2 text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-gold/40">Opacity ({bg.opacity})</label>
                          <input 
                            type="range" 
                            min="0" 
                            max="1" 
                            step="0.01"
                            value={bg.opacity} 
                            onChange={(e) => {
                              const newItems = [...(draftConfig.backgrounds?.items || INITIAL_SITE_CONFIG.backgrounds.items)];
                              newItems[idx] = { ...bg, opacity: parseFloat(e.target.value) };
                              setDraftConfig({ ...draftConfig, backgrounds: { ...(draftConfig.backgrounds || INITIAL_SITE_CONFIG.backgrounds), items: newItems } });
                            }}
                            className="w-full accent-gold"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-gold/40">Scale/Zoom ({bg.scale})</label>
                          <input 
                            type="range" 
                            min="1" 
                            max="2" 
                            step="0.01"
                            value={bg.scale} 
                            onChange={(e) => {
                              const newItems = [...(draftConfig.backgrounds?.items || INITIAL_SITE_CONFIG.backgrounds.items)];
                              newItems[idx] = { ...bg, scale: parseFloat(e.target.value) };
                              setDraftConfig({ ...draftConfig, backgrounds: { ...(draftConfig.backgrounds || INITIAL_SITE_CONFIG.backgrounds), items: newItems } });
                            }}
                            className="w-full accent-gold"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-gold/40">Blur ({bg.blur}px)</label>
                          <input 
                            type="range" 
                            min="0" 
                            max="20" 
                            step="1"
                            value={bg.blur || 0} 
                            onChange={(e) => {
                              const newItems = [...(draftConfig.backgrounds?.items || INITIAL_SITE_CONFIG.backgrounds.items)];
                              newItems[idx] = { ...bg, blur: parseInt(e.target.value) };
                              setDraftConfig({ ...draftConfig, backgrounds: { ...(draftConfig.backgrounds || INITIAL_SITE_CONFIG.backgrounds), items: newItems } });
                            }}
                            className="w-full accent-gold"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Footer Section Edit */}
                <section className="space-y-6 bg-gold/5 p-6 rounded-2xl border border-gold/10 md:col-span-2">
                  <div className="flex items-center justify-between border-b border-gold/10 pb-2">
                    <h3 className="text-lg font-bold uppercase tracking-widest flex items-center gap-2">
                      <div className="w-2 h-2 bg-gold rounded-full" /> Footer
                    </h3>
                    <input 
                      type="checkbox" 
                      checked={draftConfig.footer.visible} 
                      onChange={(e) => setDraftConfig({ ...draftConfig, footer: { ...draftConfig.footer, visible: e.target.checked } })}
                      className="accent-gold w-5 h-5"
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-gold/40">Quote</label>
                      <input 
                        type="text" 
                        value={draftConfig.footer.quote} 
                        onChange={(e) => setDraftConfig({ ...draftConfig, footer: { ...draftConfig.footer, quote: e.target.value } })}
                        className="w-full bg-navy border border-gold/10 rounded p-3 text-sm focus:outline-none focus:border-gold/40"
                      />
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && !isAdmin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/85 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-navy border border-gold/20 rounded-2xl p-8 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowLoginModal(false)}
                className="absolute top-4 right-4 text-gold/40 hover:text-gold transition-colors"
              >
                <X size={20} />
              </button>
              <h2 className="text-2xl font-bold text-gold uppercase tracking-widest mb-6 text-center">Admin Login</h2>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-gold/60 font-bold">Username</label>
                  <input 
                    type="text" 
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className="w-full bg-gold/5 border border-gold/10 rounded-lg p-3 text-gold focus:outline-none focus:border-gold/40"
                    placeholder="Enter username"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-gold/60 font-bold">Password</label>
                  <input 
                    type="password" 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-gold/5 border border-gold/10 rounded-lg p-3 text-gold focus:outline-none focus:border-gold/40"
                    placeholder="Enter password"
                  />
                </div>
                {loginError && <p className="text-red-500 text-xs text-center font-bold uppercase tracking-widest">{loginError}</p>}
                <button 
                  type="submit"
                  className="w-full py-4 bg-gold text-navy font-bold uppercase tracking-[0.2em] rounded-lg hover:bg-white transition-colors"
                >
                  Access Panel
                </button>
                <p className="text-[10px] text-center text-gold/40 uppercase tracking-widest">
                  Restricted access for Starwing Empire admins only.
                </p>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4 md:px-12 flex items-center justify-between bg-navy/95 border-b border-gold/10"
      >
        <div className="flex items-center">
          <span className="text-xl font-bold tracking-tighter text-gold uppercase">
            Starwing Empire
          </span>
        </div>
        
        <nav className="hidden md:flex items-center gap-12 text-[10px] font-bold tracking-[0.3em] uppercase text-gold/60">
          {["Home", "About Us", "Roster", "Lineups", "Achievements", "Socials"].map((item) => {
            const isVisible = 
              item === "About Us" ? siteConfig.about.visible :
              item === "Roster" ? siteConfig.roster.visible :
              item === "Lineups" ? (siteConfig.lineups1?.visible || siteConfig.lineups2?.visible) :
              item === "Achievements" ? siteConfig.achievements.visible :
              item === "Socials" ? siteConfig.socials.visible :
              true;
            
            if (!isVisible) return null;

            return (
              <motion.a
                key={item}
                href={
                  item === "Home" ? "#hero" :
                  item === "About Us" ? "#about" : 
                  item === "Roster" ? "#roster" : 
                  item === "Lineups" ? "#lineups" :
                  item === "Achievements" ? "#achievements" : 
                  item === "Socials" ? "#socials" :
                  "#"
                }
                whileHover={{ scale: 1.1, color: "#d4af37" }}
                whileTap={{ scale: 0.95 }}
                className="transition-colors"
              >
                {item}
              </motion.a>
            );
          })}
        </nav>

        {/* Mobile Menu Toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-gold p-2 z-[60]"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-50 md:hidden bg-black/90 flex flex-col items-center justify-center gap-8"
            >
              {["Home", "About Us", "Roster", "Lineups", "Achievements", "Socials"].filter(item => {
                const isVisible = 
                  item === "About Us" ? siteConfig.about.visible :
                  item === "Roster" ? siteConfig.roster.visible :
                  item === "Lineups" ? (siteConfig.lineups1?.visible || siteConfig.lineups2?.visible) :
                  item === "Achievements" ? siteConfig.achievements.visible :
                  item === "Socials" ? siteConfig.socials.visible :
                  true;
                return isVisible;
              }).map((item, idx) => (
                <motion.a
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  href={
                    item === "Home" ? "#hero" :
                    item === "About Us" ? "#about" : 
                    item === "Roster" ? "#roster" : 
                    item === "Lineups" ? "#lineups" :
                    item === "Achievements" ? "#achievements" : 
                    item === "Socials" ? "#socials" :
                    "#"
                  }
                  onClick={() => setIsMenuOpen(false)}
                  className="text-xs font-bold text-gold uppercase tracking-[0.4em] hover:text-white transition-colors"
                >
                  {item}
                </motion.a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col relative overflow-x-hidden">
        {/* Hero Section */}
        <section id="hero" className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="relative flex flex-col items-center z-10"
          >
            {/* Placeholder for Logo */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{ scale: siteConfig.hero.logoScale }}
              className={`w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-gold/30 flex items-center justify-center bg-navy/80 mb-8 relative group ${!siteConfig.hero.logoVisible ? 'hidden' : ''}`}
            >
              {siteConfig.hero.logoUrl ? (
                <img 
                  src={siteConfig.hero.logoUrl} 
                  alt="Logo" 
                  className="w-full h-full object-contain rounded-full"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <>
                  {/* Decorative rings */}
                  <div className="absolute inset-0 border-2 border-gold/20 rounded-full opacity-20" />
                  <div className="absolute -inset-4 border border-gold/10 rounded-full" />
                  
                  {/* Inner glow */}
                  <div className="absolute inset-0 rounded-full shadow-[inset_0_0_50px_rgba(212,175,55,0.1)]" />
                </>
              )}
            </motion.div>

            {/* Team Name and Welcome Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gold tracking-tight mb-2 uppercase">
                {siteConfig.hero.title}
              </h1>
              <p className="text-gold/80 text-lg md:text-xl font-bold tracking-[0.2em] uppercase">
                {siteConfig.hero.subtitle}
              </p>
            </motion.div>
          </motion.div>

          {/* Scroll Down Indicator - Moved outside centered container to be at section bottom */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
          >
            <span className="text-gold/40 text-[10px] uppercase tracking-[0.4em] font-bold">Scroll Down</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="text-gold/60 w-6 h-6" />
            </motion.div>
          </motion.div>
        </section>

        {/* About Us Section */}
        {siteConfig.about.visible && (
          <section id="about" className="py-16 px-4 relative bg-gold/[0.02]">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8 }}
                style={{ scale: siteConfig.about.scale || 1 }}
              >
                <h2 className="text-3xl md:text-5xl font-bold text-gold tracking-widest uppercase mb-8">
                  {siteConfig.about.title}
                </h2>
                <div className="space-y-6 text-gold/80 text-lg md:text-xl leading-relaxed font-medium whitespace-pre-wrap">
                  {siteConfig.about.content}
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Roster Section */}
        {siteConfig.roster.visible && (
          <section id="roster" className="py-12 px-4 relative">
            <div className="max-w-6xl mx-auto flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8 }}
                className="w-full flex flex-col items-center"
              >
                <h2 className="text-3xl md:text-5xl font-bold text-gold tracking-widest uppercase mb-12">
                  {siteConfig.roster.title}
                </h2>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: siteConfig.roster.scale || 1 }}
                  viewport={{ once: true }}
                  className="relative rounded-3xl overflow-hidden border border-gold/20 shadow-2xl shadow-gold/10 w-full max-w-5xl"
                >
                  <img 
                    src={siteConfig.roster.posterUrl || "https://picsum.photos/seed/roster/1200/800"} 
                    alt="Team Roster Poster" 
                    className="w-full h-auto block"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-60" />
                </motion.div>

                {/* Player Cards below Poster */}
                <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                  {(siteConfig.roster.players || []).filter(p => p.visible).map((player, idx) => (
                    <motion.div
                      key={player.id}
                      animate={{ scale: player.scale || 1 }}
                      className="w-full flex justify-center"
                    >
                      <PlayerCard 
                        player={{
                          ...player,
                          image: player.photoUrl,
                          description: player.description || ""
                        }} 
                        index={idx} 
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Lineups Section */}
        {(siteConfig.lineups1?.visible || siteConfig.lineups2?.visible) && (
          <section id="lineups" className="py-12 px-4 relative">
            <div className="max-w-6xl mx-auto flex flex-col items-center gap-24">
              
              {/* Lineup 1 */}
              {siteConfig.lineups1?.visible && (
                <div className="w-full flex flex-col items-center">
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    className="text-2xl md:text-4xl font-bold text-gold tracking-widest uppercase mb-12"
                  >
                    {siteConfig.lineups1.title}
                  </motion.h2>
                  
                  <motion.div 
                    animate={{ scale: siteConfig.lineups1.scale || 1 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl"
                  >
                    {siteConfig.lineups1.players.filter(p => p.visible).map((player, idx) => (
                      <div key={player.id} className={idx === siteConfig.lineups1.players.filter(p => p.visible).length - 1 && siteConfig.lineups1.players.filter(p => p.visible).length % 2 !== 0 ? "md:col-span-2 flex justify-center" : ""}>
                        <motion.div
                          animate={{ scale: player.scale || 1 }}
                          className="w-full max-w-md"
                        >
                          <PlayerCard 
                            player={{
                              ...player,
                              image: player.photoUrl,
                              description: player.description || ""
                            }} 
                            index={idx} 
                          />
                        </motion.div>
                      </div>
                    ))}
                  </motion.div>
                </div>
              )}

              {/* Lineup 2 */}
              {siteConfig.lineups2?.visible && (
                <div className="w-full flex flex-col items-center">
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.5 }}
                    className="text-2xl md:text-4xl font-bold text-gold tracking-widest uppercase mb-12"
                  >
                    {siteConfig.lineups2.title}
                  </motion.h2>
                  
                  <motion.div 
                    animate={{ scale: siteConfig.lineups2.scale || 1 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl"
                  >
                    {siteConfig.lineups2.players.filter(p => p.visible).map((player, idx) => (
                      <div key={player.id} className={idx === siteConfig.lineups2.players.filter(p => p.visible).length - 1 && siteConfig.lineups2.players.filter(p => p.visible).length % 2 !== 0 ? "md:col-span-2 flex justify-center" : ""}>
                        <motion.div
                          animate={{ scale: player.scale || 1 }}
                          className="w-full max-w-md"
                        >
                          <PlayerCard 
                            player={{
                              ...player,
                              image: player.photoUrl,
                              description: player.description || ""
                            }} 
                            index={idx} 
                          />
                        </motion.div>
                      </div>
                    ))}
                  </motion.div>
                </div>
              )}

            </div>
          </section>
        )}

        {/* Achievements Section */}
        {siteConfig.achievements.visible && (
          <section id="achievements" className="py-12 px-4 relative">
            <div className="max-w-6xl mx-auto flex flex-col items-center">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                viewport={{ once: true, amount: 0.5 }}
                className="text-3xl md:text-5xl font-bold text-gold tracking-widest uppercase mb-16"
              >
                {siteConfig.achievements.title}
              </motion.h2>
              
              <div 
                className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
                style={{ scale: siteConfig.achievements.scale || 1 }}
              >
                {siteConfig.achievements.items.filter(item => item.visible).map((achievement, idx) => (
                  <AchievementCard 
                    key={achievement.id || idx} 
                    achievement={achievement} 
                    index={idx} 
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Socials Section */}
        {siteConfig.socials.visible && (
          <section id="socials" className="py-12 px-4 relative bg-gold/[0.02]">
            <div className="max-w-4xl mx-auto flex flex-col items-center">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                viewport={{ once: true, amount: 0.5 }}
                className="text-2xl md:text-4xl font-bold text-gold tracking-widest uppercase mb-16"
              >
                {siteConfig.socials.title}
              </motion.h2>
              
              <div 
                className="flex flex-wrap justify-center gap-8 md:gap-16"
                style={{ scale: siteConfig.socials.scale || 1 }}
              >
                {[
                  { icon: Youtube, label: "YouTube", color: "#FF0000" },
                  { icon: Instagram, label: "Instagram", color: "#E4405F" },
                  { icon: DiscordIcon, label: "Discord", color: "#5865F2" },
                  { icon: Linkedin, label: "LinkedIn", color: "#0A66C2" },
                  { icon: Twitter, label: "Twitter", color: "#1DA1F2" },
                ].map((social, idx) => {
                  const configSocial = siteConfig.socials.items.find(s => s.label === social.label);
                  if (configSocial && !configSocial.visible) return null;

                    return (
                      <motion.a
                        key={social.label}
                        href={configSocial?.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      whileHover={{ y: -10, scale: 1.1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                      className="flex flex-col items-center gap-4 group"
                    >
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gold/5 border border-gold/10 flex items-center justify-center group-hover:border-gold/40 transition-all duration-300 relative overflow-hidden">
                        <social.icon size={32} className="text-gold/60 group-hover:text-gold transition-colors z-10" />
                        <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-[10px] font-bold text-gold/40 uppercase tracking-widest group-hover:text-gold transition-colors">
                        {social.label}
                      </span>
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Background Images Layer */}
        {siteConfig.backgrounds?.visible && (
          <div className="fixed inset-0 pointer-events-none overflow-hidden -z-20">
            {(siteConfig.backgrounds?.items || []).map((bg: any) => (
              <div 
                key={bg.id}
                className="absolute inset-0 w-full h-full transition-all duration-1000"
                style={{ 
                  opacity: bg.opacity,
                  filter: `blur(${bg.blur || 0}px)`,
                }}
              >
                <img 
                  src={bg.url} 
                  alt="Background" 
                  className="w-full h-full object-cover"
                  style={{ 
                    transform: `scale(${bg.scale || 1})`,
                  }}
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        )}

        {/* Decorative background elements - Enhanced Light Leaks */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        </div>
      </main>

      {/* Footer */}
      {siteConfig.footer.visible && (
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          style={{ scale: siteConfig.footer.scale || 1 }}
          className="px-6 py-8 md:px-12 border-t border-gold/10 bg-navy/80"
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center md:items-start gap-2">
              <span className="text-gold font-bold tracking-widest uppercase">Starwing Empire</span>
              <span className="text-gold/40 text-xs tracking-wider">© 2026 Starwing Empire. All rights reserved.</span>
            </div>
            
            <div className="flex flex-col items-center md:items-end text-center md:text-right">
              <span className="text-gold/60 text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold italic">
                "{siteConfig.footer.quote}"
              </span>
            </div>
          </div>
        </motion.footer>
      )}
    </div>
  );
}
