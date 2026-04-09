import { useState, useEffect, useCallback } from "react";

const ADMIN_USER = "sphere";
const ADMIN_PASS = "Sphere#1";
const INVITE_CODE = "spherecreator";
const REQUIRED_HASHTAG = "#SphereApp";
const LOGO_SRC = "/public/spherelogo.png";

// Storage helpers
const store = {
  async get(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  async set(key, val) {
    try {
      if (val === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(val));
      }
    } catch (e) {
      console.error(e);
    }
  }
};

// Seed data
const DEFAULT_CAMPAIGNS = [
  { id: "c1", title: "The Wake-Up Call", description: "Check your bank account, react to how much you spent, then open Sphere and show your level/streak. Hook: relatable financial anxiety turned into motivation.", status: "active", hashtag: REQUIRED_HASHTAG },
  { id: "c2", title: "The Level-Up Moment", description: "Show the notification that you leveled up. React with genuine excitement. Show your tier and unlocked items. This is the core dopamine loop on display.", status: "active", hashtag: REQUIRED_HASHTAG },
  { id: "c3", title: "The Comparison Flex", description: "Show your Sphere profile to a friend or talk to camera about it. Demonstrate the social currency — 'I'm level 22, what are you?' Playful competition, not preachy.", status: "active", hashtag: REQUIRED_HASHTAG },
];

const DEFAULT_DM_TEMPLATES = [
  { id: "t1", name: "Initial Outreach", platform: "TikTok", message: `Hey {{handle}}! 👋 Love your content — especially your recent stuff about {{topic}}. I'm building a finance app called Sphere that gamifies saving for college students, and I think your audience would genuinely vibe with it. We're looking for creators to make short 15-30s videos about the app. $5 per video + bonuses if it performs well (some creators are making $15-25/video). Interested? I can send you access to our creator portal right away. Just sign up at [PORTAL LINK] and use the code: spherecreator` },
  { id: "t2", name: "Follow-Up", platform: "TikTok", message: `Hey {{handle}}! Just following up on my last message — totally understand if you're busy. The offer's still open: quick 15-30s videos, $5 guaranteed + performance bonuses. No contracts, no pressure. Let me know if you're down! 🚀` },
  { id: "t3", name: "Initial Outreach", platform: "Instagram", message: `Hi {{handle}}! Been following your content and think you'd be a great fit for something I'm working on. Sphere is a gamified finance app for students — we're paying creators $5/video + performance bonuses for short-form content. Super low-effort, 15-30 seconds, post on your own account. Want in? Sign up at [PORTAL LINK] with code: spherecreator` },
];

// Icons as simple SVG components
const Icon = ({ name, size = 18 }) => {
  const icons = {
    home: <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />,
    users: <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />,
    video: <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />,
    mail: <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
    briefcase: <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
    logout: <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />,
    check: <path d="M5 13l4 4L19 7" />,
    x: <path d="M6 18L18 6M6 6l12 12" />,
    eye: <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />,
    plus: <path d="M12 4v16m8-8H4" />,
    chart: <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
    clipboard: <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />,
    dollar: <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    clock: <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
    filter: <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />,
    copy: <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />,
    star: <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />,
    link: <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />,
    edit: <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />,
    search: <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
    arrowRight: <path d="M14 5l7 7m0 0l-7 7m7-7H3" />,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  );
};

// Styles
const font = `'DM Sans', sans-serif`;
const fontMono = `'JetBrains Mono', monospace`;

const theme = {
  bg: "#0a0e17",
  bgCard: "#111827",
  bgCardHover: "#1a2332",
  bgInput: "#0d1321",
  border: "#1e293b",
  borderFocus: "#14b8a6",
  text: "#e2e8f0",
  textMuted: "#64748b",
  textDim: "#475569",
  accent: "#14b8a6",
  accentHover: "#0d9488",
  accentSoft: "rgba(20, 184, 166, 0.1)",
  accentSoftBorder: "rgba(20, 184, 166, 0.25)",
  danger: "#ef4444",
  dangerSoft: "rgba(239, 68, 68, 0.1)",
  warning: "#f59e0b",
  warningSoft: "rgba(245, 158, 11, 0.1)",
  success: "#22c55e",
  successSoft: "rgba(34, 197, 94, 0.1)",
  purple: "#8b5cf6",
  purpleSoft: "rgba(139, 92, 246, 0.1)",
};

const STATUS_COLORS = {
  identified: { bg: theme.purpleSoft, text: theme.purple, border: "rgba(139,92,246,0.3)" },
  contacted: { bg: theme.warningSoft, text: theme.warning, border: "rgba(245,158,11,0.3)" },
  responded: { bg: "rgba(59,130,246,0.1)", text: "#3b82f6", border: "rgba(59,130,246,0.3)" },
  onboarded: { bg: theme.accentSoft, text: theme.accent, border: theme.accentSoftBorder },
  active: { bg: theme.successSoft, text: theme.success, border: "rgba(34,197,94,0.3)" },
};

const PIPELINE_STAGES = ["identified", "contacted", "responded", "onboarded", "active"];

function Badge({ children, color = "accent", style = {} }) {
  const colors = {
    accent: { bg: theme.accentSoft, text: theme.accent, border: theme.accentSoftBorder },
    danger: { bg: theme.dangerSoft, text: theme.danger, border: "rgba(239,68,68,0.3)" },
    warning: { bg: theme.warningSoft, text: theme.warning, border: "rgba(245,158,11,0.3)" },
    success: { bg: theme.successSoft, text: theme.success, border: "rgba(34,197,94,0.3)" },
    purple: { bg: theme.purpleSoft, text: theme.purple, border: "rgba(139,92,246,0.3)" },
    muted: { bg: "rgba(100,116,139,0.1)", text: theme.textMuted, border: "rgba(100,116,139,0.3)" },
  };
  const c = colors[color] || colors.accent;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, letterSpacing: "0.03em", textTransform: "uppercase", background: c.bg, color: c.text, border: `1px solid ${c.border}`, ...style }}>{children}</span>
  );
}

function Button({ children, onClick, variant = "primary", size = "md", icon, disabled, style = {} }) {
  const base = { display: "inline-flex", alignItems: "center", gap: 6, fontFamily: font, fontWeight: 600, borderRadius: 8, cursor: disabled ? "not-allowed" : "pointer", border: "none", transition: "all 0.15s ease", opacity: disabled ? 0.5 : 1, letterSpacing: "0.01em" };
  const sizes = { sm: { padding: "6px 12px", fontSize: 12 }, md: { padding: "10px 18px", fontSize: 13 }, lg: { padding: "12px 24px", fontSize: 14 } };
  const variants = {
    primary: { background: theme.accent, color: "#0a0e17" },
    secondary: { background: "transparent", color: theme.text, border: `1px solid ${theme.border}` },
    danger: { background: theme.dangerSoft, color: theme.danger, border: `1px solid rgba(239,68,68,0.3)` },
    ghost: { background: "transparent", color: theme.textMuted, padding: "6px 10px" },
  };
  return <button onClick={onClick} disabled={disabled} style={{ ...base, ...sizes[size], ...variants[variant], ...style }}>{icon && <Icon name={icon} size={size === "sm" ? 14 : 16} />}{children}</button>;
}

function Input({ label, value, onChange, type = "text", placeholder, textarea, style = {}, required }) {
  const inputStyle = { width: "100%", padding: textarea ? "10px 14px" : "10px 14px", background: theme.bgInput, border: `1px solid ${theme.border}`, borderRadius: 8, color: theme.text, fontFamily: font, fontSize: 13, outline: "none", resize: textarea ? "vertical" : "none", minHeight: textarea ? 80 : "auto", transition: "border-color 0.15s", boxSizing: "border-box" };
  return (
    <div style={{ marginBottom: 14, ...style }}>
      {label && <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: theme.textMuted, marginBottom: 6, letterSpacing: "0.03em", textTransform: "uppercase" }}>{label}{required && <span style={{ color: theme.danger }}> *</span>}</label>}
      {textarea ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={inputStyle} onFocus={e => e.target.style.borderColor = theme.borderFocus} onBlur={e => e.target.style.borderColor = theme.border} /> :
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={inputStyle} onFocus={e => e.target.style.borderColor = theme.borderFocus} onBlur={e => e.target.style.borderColor = theme.border} />}
    </div>
  );
}

function Select({ label, value, onChange, options, style = {} }) {
  return (
    <div style={{ marginBottom: 14, ...style }}>
      {label && <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: theme.textMuted, marginBottom: 6, letterSpacing: "0.03em", textTransform: "uppercase" }}>{label}</label>}
      <select value={value} onChange={e => onChange(e.target.value)} style={{ width: "100%", padding: "10px 14px", background: theme.bgInput, border: `1px solid ${theme.border}`, borderRadius: 8, color: theme.text, fontFamily: font, fontSize: 13, outline: "none", cursor: "pointer" }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function Modal({ title, onClose, children, width = 520 }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div style={{ background: theme.bgCard, borderRadius: 16, border: `1px solid ${theme.border}`, width: "90%", maxWidth: width, maxHeight: "85vh", overflow: "auto", padding: 28 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: theme.text, margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: theme.textMuted, cursor: "pointer", padding: 4 }}><Icon name="x" size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon, color = theme.accent }) {
  return (
    <div style={{ background: theme.bgCard, borderRadius: 12, border: `1px solid ${theme.border}`, padding: "20px 22px", flex: 1, minWidth: 160 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
        <div style={{ color, opacity: 0.7 }}><Icon name={icon} size={18} /></div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: theme.text, fontFamily: fontMono }}>{value}</div>
    </div>
  );
}

function EmptyState({ icon, title, description, action }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ color: theme.textDim, marginBottom: 12 }}><Icon name={icon} size={40} /></div>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: theme.textMuted, margin: "0 0 6px" }}>{title}</h3>
      <p style={{ fontSize: 13, color: theme.textDim, margin: "0 0 16px" }}>{description}</p>
      {action}
    </div>
  );
}

// ═══════════════════════════════════════
// LOGIN / SIGNUP
// ═══════════════════════════════════════
function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("login"); // login, signup
  const [role, setRole] = useState("creator"); // admin, creator
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [instagram, setInstagram] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    if (role === "admin") {
      if (username === ADMIN_USER && password === ADMIN_PASS) {
        onLogin({ role: "admin", username: ADMIN_USER });
      } else {
        setError("Invalid admin credentials");
      }
    } else {
      const creators = await store.get("creators") || [];
      const creator = creators.find(c => c.username === username && c.password === password);
      if (!creator) { setError("Invalid username or password"); return; }
      if (creator.status === "pending") { setError("Your account is pending approval. Check back soon!"); return; }
      if (creator.status === "rejected") { setError("Your account was not approved."); return; }
      onLogin({ role: "creator", ...creator });
    }
  };

  const handleSignup = async () => {
    setError("");
    if (!username || !password || !displayName) { setError("Fill in all required fields"); return; }
    if (!tiktok && !instagram) { setError("Provide at least one social handle"); return; }
    const creators = await store.get("creators") || [];
    if (creators.find(c => c.username === username)) { setError("Username already taken"); return; }
    const autoApproved = inviteCode.toLowerCase() === INVITE_CODE.toLowerCase();
    const newCreator = {
      id: "cr_" + Date.now(),
      username, password, displayName, tiktok, instagram,
      inviteCode: inviteCode || null,
      status: autoApproved ? "active" : "pending",
      pipelineStage: autoApproved ? "onboarded" : "identified",
      joinedAt: new Date().toISOString(),
      notes: autoApproved ? "Auto-approved via invite code" : "Signed up without invite code",
      followerCount: "",
      niche: "",
      totalEarnings: 0,
    };
    creators.push(newCreator);
    await store.set("creators", creators);
    if (autoApproved) {
      onLogin({ role: "creator", ...newCreator });
    } else {
      setMode("pending");
    }
  };

  if (mode === "pending") {
    return (
      <div style={{ minHeight: "100vh", background: theme.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font }}>
        <div style={{ textAlign: "center", maxWidth: 400, padding: 40 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: theme.warningSoft, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", border: `1px solid rgba(245,158,11,0.3)` }}>
            <Icon name="clock" size={28} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: theme.text, margin: "0 0 10px" }}>Account Pending</h2>
          <p style={{ fontSize: 14, color: theme.textMuted, lineHeight: 1.6 }}>Your account is waiting for approval. We'll let you know once you're in!</p>
          <Button onClick={() => { setMode("login"); setError(""); }} variant="secondary" style={{ marginTop: 20 }}>Back to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');`}</style>
      <div style={{ width: "100%", maxWidth: 420, padding: 20 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontSize: 32, fontWeight: 800, color: theme.text, letterSpacing: "-0.02em" }}>
  <img
    src={LOGO_SRC}
    alt="Sphere logo"
    style={{ width: 34, height: 34, objectFit: "cover", borderRadius: 8 }}
  />
  <span>Sphere</span>
</div>
          <p style={{ fontSize: 13, color: theme.textMuted, marginTop: 4 }}>Creator Hub</p>
        </div>

        <div style={{ background: theme.bgCard, borderRadius: 16, border: `1px solid ${theme.border}`, padding: 28 }}>
          {/* Mode tabs */}
          <div style={{ display: "flex", gap: 4, marginBottom: 24, background: theme.bgInput, borderRadius: 8, padding: 3 }}>
            {[["login", "Sign In"], ["signup", "Sign Up"]].map(([m, label]) => (
              <button key={m} onClick={() => { setMode(m); setError(""); }} style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: "none", fontFamily: font, fontSize: 13, fontWeight: 600, cursor: "pointer", background: mode === m ? theme.bgCard : "transparent", color: mode === m ? theme.text : theme.textMuted, transition: "all 0.15s" }}>{label}</button>
            ))}
          </div>

          {mode === "login" && (
            <>
              {/* Role selector */}
              <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                {[["admin", "Admin"], ["creator", "Creator"]].map(([r, label]) => (
                  <button key={r} onClick={() => { setRole(r); setError(""); }} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: `1px solid ${role === r ? theme.accent : theme.border}`, background: role === r ? theme.accentSoft : "transparent", color: role === r ? theme.accent : theme.textMuted, fontFamily: font, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}>{label}</button>
                ))}
              </div>
              <Input label="Username" value={username} onChange={setUsername} placeholder={role === "admin" ? "Admin username" : "Your username"} />
              <Input label="Password" value={password} onChange={setPassword} type="password" placeholder="••••••••" />
            </>
          )}

          {mode === "signup" && (
            <>
              <Input label="Display Name" value={displayName} onChange={setDisplayName} placeholder="Your name" required />
              <Input label="Username" value={username} onChange={setUsername} placeholder="Choose a username" required />
              <Input label="Password" value={password} onChange={setPassword} type="password" placeholder="Choose a password" required />
              <div style={{ display: "flex", gap: 10 }}>
                <Input label="TikTok Handle" value={tiktok} onChange={setTiktok} placeholder="@yourhandle" style={{ flex: 1 }} />
                <Input label="Instagram Handle" value={instagram} onChange={setInstagram} placeholder="@yourhandle" style={{ flex: 1 }} />
              </div>
              <Input label="Invite Code (optional)" value={inviteCode} onChange={setInviteCode} placeholder="Enter code if you have one" />
              <p style={{ fontSize: 11, color: theme.textDim, margin: "-8px 0 14px", lineHeight: 1.5 }}>Have an invite code? Enter it for instant access. Without one, your account will be reviewed by our team.</p>
            </>
          )}

          {error && <div style={{ background: theme.dangerSoft, border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: theme.danger }}>{error}</div>}

          <Button onClick={mode === "login" ? handleLogin : handleSignup} style={{ width: "100%", justifyContent: "center", marginTop: 4 }} size="lg">
            {mode === "login" ? "Sign In" : "Create Account"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// ADMIN DASHBOARD
// ═══════════════════════════════════════
function AdminDashboard({ onLogout }) {
  const [page, setPage] = useState("home");
  const [creators, setCreators] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [dmTemplates, setDmTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    const [c, s, camp, dm] = await Promise.all([
      store.get("creators"),
      store.get("submissions"),
      store.get("campaigns"),
      store.get("dm_templates"),
    ]);
    setCreators(c || []);
    setSubmissions(s || []);
    setCampaigns(camp || DEFAULT_CAMPAIGNS);
    setDmTemplates(dm || DEFAULT_DM_TEMPLATES);
    if (!camp) await store.set("campaigns", DEFAULT_CAMPAIGNS);
    if (!dm) await store.set("dm_templates", DEFAULT_DM_TEMPLATES);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const updateCreators = async (updated) => { setCreators(updated); await store.set("creators", updated); };
  const updateSubmissions = async (updated) => { setSubmissions(updated); await store.set("submissions", updated); };
  const updateCampaigns = async (updated) => { setCampaigns(updated); await store.set("campaigns", updated); };

  const nav = [
    { id: "home", label: "Dashboard", icon: "home" },
    { id: "creators", label: "Creators", icon: "users" },
    { id: "submissions", label: "Submissions", icon: "video" },
    { id: "campaigns", label: "Campaigns", icon: "briefcase" },
    { id: "templates", label: "DM Templates", icon: "mail" },
    { id: "payouts", label: "Payouts", icon: "dollar" },
  ];

  const pendingCreators = creators.filter(c => c.status === "pending");
  const pendingSubs = submissions.filter(s => s.status === "pending");
  const approvedSubs = submissions.filter(s => s.status === "approved");
  const totalSpend = approvedSubs.reduce((sum, s) => sum + (s.basePay || 5) + (s.bonus || 0), 0);
  const totalViews = approvedSubs.reduce((sum, s) => sum + (s.views || 0), 0);

  if (loading) return <div style={{ minHeight: "100vh", background: theme.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font, color: theme.textMuted }}>Loading...</div>;

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, fontFamily: font, display: "flex" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap'); * { box-sizing: border-box; } ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 3px; }`}</style>

      {/* Sidebar */}
      <div style={{ width: 220, background: theme.bgCard, borderRight: `1px solid ${theme.border}`, padding: "20px 12px", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 100 }}>
        <div style={{ padding: "4px 12px 20px" }}>
  <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 20, fontWeight: 800, color: theme.text, letterSpacing: "-0.02em" }}>
    <img
      src={LOGO_SRC}
      alt="Sphere logo"
      style={{ width: 24, height: 24, objectFit: "cover", borderRadius: 6 }}
    />
    <span>Sphere</span>
  </div>
  <span style={{ display: "block", fontSize: 10, fontWeight: 600, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>
    Admin Hub
  </span>
</div>
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          {nav.map(n => (
            <button key={n.id} onClick={() => setPage(n.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, border: "none", background: page === n.id ? theme.accentSoft : "transparent", color: page === n.id ? theme.accent : theme.textMuted, fontFamily: font, fontSize: 13, fontWeight: 600, cursor: "pointer", textAlign: "left", transition: "all 0.15s", position: "relative" }}>
              <Icon name={n.icon} size={16} />{n.label}
              {n.id === "creators" && pendingCreators.length > 0 && <span style={{ marginLeft: "auto", background: theme.danger, color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 999, padding: "1px 6px", minWidth: 18, textAlign: "center" }}>{pendingCreators.length}</span>}
              {n.id === "submissions" && pendingSubs.length > 0 && <span style={{ marginLeft: "auto", background: theme.warning, color: "#0a0e17", fontSize: 10, fontWeight: 700, borderRadius: 999, padding: "1px 6px", minWidth: 18, textAlign: "center" }}>{pendingSubs.length}</span>}
            </button>
          ))}
        </nav>
        <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, border: "none", background: "transparent", color: theme.textMuted, fontFamily: font, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}>
          <Icon name="logout" size={16} />Sign Out
        </button>
      </div>

      {/* Main */}
      <div style={{ flex: 1, marginLeft: 220, padding: "28px 32px", maxWidth: 1100 }}>
        {page === "home" && <AdminHome creators={creators} submissions={submissions} pendingCreators={pendingCreators} pendingSubs={pendingSubs} totalSpend={totalSpend} totalViews={totalViews} setPage={setPage} />}
        {page === "creators" && <AdminCreators creators={creators} updateCreators={updateCreators} />}
        {page === "submissions" && <AdminSubmissions submissions={submissions} updateSubmissions={updateSubmissions} creators={creators} campaigns={campaigns} />}
        {page === "campaigns" && <AdminCampaigns campaigns={campaigns} updateCampaigns={updateCampaigns} />}
        {page === "templates" && <AdminTemplates templates={dmTemplates} />}
        {page === "payouts" && <AdminPayouts submissions={submissions} creators={creators} />}
      </div>
    </div>
  );
}

function AdminHome({ creators, submissions, pendingCreators, pendingSubs, totalSpend, totalViews, setPage }) {
  const activeCreators = creators.filter(c => c.status === "active" || c.status === "onboarded");
  const approvedVids = submissions.filter(s => s.status === "approved");
  const avgCost = approvedVids.length > 0 ? (totalSpend / approvedVids.length).toFixed(2) : "0.00";

  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: theme.text, margin: "0 0 24px", letterSpacing: "-0.02em" }}>Dashboard</h1>
      <div style={{ display: "flex", gap: 14, marginBottom: 28, flexWrap: "wrap" }}>
        <MetricCard label="Total Creators" value={creators.length} icon="users" color={theme.accent} />
        <MetricCard label="Videos Approved" value={approvedVids.length} icon="video" color={theme.success} />
        <MetricCard label="Total Spend" value={`$${totalSpend}`} icon="dollar" color={theme.warning} />
        <MetricCard label="Avg $/Video" value={`$${avgCost}`} icon="chart" color={theme.purple} />
      </div>
      <div style={{ display: "flex", gap: 14, marginBottom: 28, flexWrap: "wrap" }}>
        <MetricCard label="Pending Creators" value={pendingCreators.length} icon="clock" color={theme.danger} />
        <MetricCard label="Pending Videos" value={pendingSubs.length} icon="eye" color={theme.warning} />
        <MetricCard label="Active Creators" value={activeCreators.length} icon="check" color={theme.success} />
        <MetricCard label="Total Views" value={totalViews.toLocaleString()} icon="chart" color={theme.accent} />
      </div>

      {/* Pipeline summary */}
      <div style={{ background: theme.bgCard, borderRadius: 12, border: `1px solid ${theme.border}`, padding: 22, marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: theme.text, margin: "0 0 16px" }}>Creator Pipeline</h3>
        <div style={{ display: "flex", gap: 8 }}>
          {PIPELINE_STAGES.map(stage => {
            const count = creators.filter(c => c.pipelineStage === stage).length;
            const sc = STATUS_COLORS[stage];
            return (
              <div key={stage} style={{ flex: 1, background: sc.bg, border: `1px solid ${sc.border}`, borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: sc.text, fontFamily: fontMono }}>{count}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: sc.text, textTransform: "capitalize", marginTop: 2 }}>{stage}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display: "flex", gap: 10 }}>
        {pendingCreators.length > 0 && <Button onClick={() => setPage("creators")} icon="users" variant="secondary">Review {pendingCreators.length} Creator{pendingCreators.length > 1 ? "s" : ""}</Button>}
        {pendingSubs.length > 0 && <Button onClick={() => setPage("submissions")} icon="video" variant="secondary">Review {pendingSubs.length} Submission{pendingSubs.length > 1 ? "s" : ""}</Button>}
      </div>
    </>
  );
}

function AdminCreators({ creators, updateCreators }) {
  const [modal, setModal] = useState(null); // "add" | creator object
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ displayName: "", username: "", password: "", tiktok: "", instagram: "", followerCount: "", niche: "", pipelineStage: "identified", notes: "" });

  const filtered = creators.filter(c => {
    if (filter === "pending" && c.status !== "pending") return false;
    if (filter !== "all" && filter !== "pending" && c.pipelineStage !== filter) return false;
    if (search && !c.displayName?.toLowerCase().includes(search.toLowerCase()) && !c.tiktok?.toLowerCase().includes(search.toLowerCase()) && !c.instagram?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleAdd = async () => {
    if (!form.displayName) return;
    const newCreator = { id: "cr_" + Date.now(), ...form, status: "active", joinedAt: new Date().toISOString(), totalEarnings: 0 };
    await updateCreators([...creators, newCreator]);
    setModal(null);
    setForm({ displayName: "", username: "", password: "", tiktok: "", instagram: "", followerCount: "", niche: "", pipelineStage: "identified", notes: "" });
  };

  const handleApprove = async (id) => {
    await updateCreators(creators.map(c => c.id === id ? { ...c, status: "active", pipelineStage: "onboarded" } : c));
  };

  const handleReject = async (id) => {
    await updateCreators(creators.map(c => c.id === id ? { ...c, status: "rejected" } : c));
  };

  const handleUpdateStage = async (id, stage) => {
    await updateCreators(creators.map(c => c.id === id ? { ...c, pipelineStage: stage } : c));
  };

  const handleUpdateNotes = async (id, notes) => {
    await updateCreators(creators.map(c => c.id === id ? { ...c, notes } : c));
  };

  const pendingCreators = creators.filter(c => c.status === "pending");

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: theme.text, margin: 0 }}>Creators</h1>
        <Button onClick={() => setModal("add")} icon="plus">Add Creator</Button>
      </div>

      {/* Pending approvals banner */}
      {pendingCreators.length > 0 && (
        <div style={{ background: theme.warningSoft, border: "1px solid rgba(245,158,11,0.3)", borderRadius: 12, padding: "16px 20px", marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: theme.warning, margin: "0 0 12px" }}>{pendingCreators.length} Creator{pendingCreators.length > 1 ? "s" : ""} Awaiting Approval</h3>
          {pendingCreators.map(c => (
            <div key={c.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderTop: `1px solid rgba(245,158,11,0.15)` }}>
              <div>
                <span style={{ fontWeight: 600, color: theme.text, fontSize: 13 }}>{c.displayName}</span>
                <span style={{ color: theme.textMuted, fontSize: 12, marginLeft: 8 }}>{c.tiktok || c.instagram}</span>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <Button onClick={() => handleApprove(c.id)} variant="primary" size="sm" icon="check">Approve</Button>
                <Button onClick={() => handleReject(c.id)} variant="danger" size="sm" icon="x">Reject</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 280 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search creators..." style={{ width: "100%", padding: "8px 12px 8px 34px", background: theme.bgInput, border: `1px solid ${theme.border}`, borderRadius: 8, color: theme.text, fontFamily: font, fontSize: 13, outline: "none" }} />
          <div style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: theme.textDim }}><Icon name="search" size={14} /></div>
        </div>
        {["all", "pending", ...PIPELINE_STAGES].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${filter === f ? theme.accentSoftBorder : theme.border}`, background: filter === f ? theme.accentSoft : "transparent", color: filter === f ? theme.accent : theme.textMuted, fontFamily: font, fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "capitalize" }}>{f}</button>
        ))}
      </div>

      {/* Creator list */}
      {filtered.length === 0 ? (
        <EmptyState icon="users" title="No creators found" description="Add creators manually or wait for signups." action={<Button onClick={() => setModal("add")} icon="plus" size="sm">Add Creator</Button>} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {filtered.map(c => {
            const sc = STATUS_COLORS[c.pipelineStage] || STATUS_COLORS.identified;
            return (
              <div key={c.id} onClick={() => setModal(c)} style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", transition: "all 0.15s" }} onMouseOver={e => e.currentTarget.style.borderColor = theme.borderFocus} onMouseOut={e => e.currentTarget.style.borderColor = theme.border}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: sc.bg, border: `1px solid ${sc.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color: sc.text }}>{c.displayName?.[0]?.toUpperCase() || "?"}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: theme.text }}>{c.displayName}</div>
                    <div style={{ fontSize: 12, color: theme.textMuted }}>{[c.tiktok, c.instagram].filter(Boolean).join(" · ")}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {c.followerCount && <span style={{ fontSize: 12, color: theme.textMuted, fontFamily: fontMono }}>{c.followerCount}</span>}
                  <Badge color={c.status === "pending" ? "warning" : c.pipelineStage === "active" ? "success" : c.pipelineStage === "onboarded" ? "accent" : c.pipelineStage === "responded" ? "purple" : "muted"}>
                    {c.status === "pending" ? "pending" : c.pipelineStage}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / View modal */}
      {modal === "add" && (
        <Modal title="Add Creator" onClose={() => setModal(null)}>
          <Input label="Display Name" value={form.displayName} onChange={v => setForm({ ...form, displayName: v })} required />
          <div style={{ display: "flex", gap: 10 }}>
            <Input label="TikTok" value={form.tiktok} onChange={v => setForm({ ...form, tiktok: v })} placeholder="@handle" style={{ flex: 1 }} />
            <Input label="Instagram" value={form.instagram} onChange={v => setForm({ ...form, instagram: v })} placeholder="@handle" style={{ flex: 1 }} />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Input label="Follower Count" value={form.followerCount} onChange={v => setForm({ ...form, followerCount: v })} placeholder="e.g. 2.5k" style={{ flex: 1 }} />
            <Input label="Niche" value={form.niche} onChange={v => setForm({ ...form, niche: v })} placeholder="e.g. finance, lifestyle" style={{ flex: 1 }} />
          </div>
          <Select label="Pipeline Stage" value={form.pipelineStage} onChange={v => setForm({ ...form, pipelineStage: v })} options={PIPELINE_STAGES.map(s => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))} />
          <Input label="Notes" value={form.notes} onChange={v => setForm({ ...form, notes: v })} textarea placeholder="DM status, interests, etc." />
          <Button onClick={handleAdd} style={{ width: "100%", justifyContent: "center" }}>Add Creator</Button>
        </Modal>
      )}

      {modal && modal !== "add" && typeof modal === "object" && (
        <Modal title="Creator Details" onClose={() => setModal(null)} width={560}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${theme.border}` }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: theme.accentSoft, border: `1px solid ${theme.accentSoftBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 20, color: theme.accent }}>{modal.displayName?.[0]?.toUpperCase()}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18, color: theme.text }}>{modal.displayName}</div>
              <div style={{ fontSize: 13, color: theme.textMuted }}>{[modal.tiktok, modal.instagram].filter(Boolean).join(" · ")}{modal.followerCount ? ` · ${modal.followerCount} followers` : ""}</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            <div style={{ background: theme.bgInput, borderRadius: 8, padding: "10px 14px" }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: theme.textDim, textTransform: "uppercase", marginBottom: 4 }}>Joined</div>
              <div style={{ fontSize: 13, color: theme.text }}>{new Date(modal.joinedAt).toLocaleDateString()}</div>
            </div>
            <div style={{ background: theme.bgInput, borderRadius: 8, padding: "10px 14px" }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: theme.textDim, textTransform: "uppercase", marginBottom: 4 }}>Earnings</div>
              <div style={{ fontSize: 13, color: theme.accent, fontFamily: fontMono }}>${modal.totalEarnings || 0}</div>
            </div>
          </div>

          <Select label="Pipeline Stage" value={modal.pipelineStage} onChange={v => { handleUpdateStage(modal.id, v); setModal({ ...modal, pipelineStage: v }); }} options={PIPELINE_STAGES.map(s => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))} />
          <Input label="Notes" value={modal.notes || ""} onChange={v => { handleUpdateNotes(modal.id, v); setModal({ ...modal, notes: v }); }} textarea placeholder="Add notes about this creator..." />
        </Modal>
      )}
    </>
  );
}

function AdminSubmissions({ submissions, updateSubmissions, creators, campaigns }) {
  const [filter, setFilter] = useState("pending");
  const [selected, setSelected] = useState(null);

  const filtered = submissions.filter(s => filter === "all" ? true : s.status === filter);

  const handleApprove = async (id) => {
    await updateSubmissions(submissions.map(s => s.id === id ? { ...s, status: "approved" } : s));
    if (selected?.id === id) setSelected({ ...selected, status: "approved" });
  };

  const handleReject = async (id, feedback) => {
    await updateSubmissions(submissions.map(s => s.id === id ? { ...s, status: "rejected", feedback } : s));
    if (selected?.id === id) setSelected({ ...selected, status: "rejected", feedback });
  };

  const handleUpdateStats = async (id, stats) => {
    await updateSubmissions(submissions.map(s => s.id === id ? { ...s, ...stats } : s));
    if (selected?.id === id) setSelected({ ...selected, ...stats });
  };

  const getCreator = (cid) => creators.find(c => c.id === cid) || {};
  const getCampaign = (cid) => campaigns.find(c => c.id === cid) || {};

  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: theme.text, margin: "0 0 20px" }}>Submissions</h1>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["pending", "approved", "rejected", "all"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 14px", borderRadius: 6, border: `1px solid ${filter === f ? theme.accentSoftBorder : theme.border}`, background: filter === f ? theme.accentSoft : "transparent", color: filter === f ? theme.accent : theme.textMuted, fontFamily: font, fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "capitalize" }}>
            {f} ({submissions.filter(s => f === "all" ? true : s.status === f).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="video" title="No submissions yet" description="Submissions from creators will appear here." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {filtered.map(s => {
            const creator = getCreator(s.creatorId);
            const campaign = getCampaign(s.campaignId);
            return (
              <div key={s.id} onClick={() => setSelected(s)} style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 10, padding: "14px 18px", cursor: "pointer", transition: "all 0.15s" }} onMouseOver={e => e.currentTarget.style.borderColor = theme.borderFocus} onMouseOut={e => e.currentTarget.style.borderColor = theme.border}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: theme.text }}>{creator.displayName || "Unknown"}</div>
                      <div style={{ fontSize: 12, color: theme.textMuted }}>{campaign.title || "No campaign"} · {s.platform}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {s.views > 0 && <span style={{ fontSize: 12, color: theme.textMuted, fontFamily: fontMono }}>{s.views?.toLocaleString()} views</span>}
                    <Badge color={s.status === "approved" ? "success" : s.status === "rejected" ? "danger" : "warning"}>{s.status}</Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Submission detail modal */}
      {selected && (
        <Modal title="Submission Details" onClose={() => setSelected(null)} width={600}>
          {(() => {
            const creator = getCreator(selected.creatorId);
            const campaign = getCampaign(selected.campaignId);
            return (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                  <div style={{ background: theme.bgInput, borderRadius: 8, padding: "10px 14px" }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: theme.textDim, textTransform: "uppercase", marginBottom: 4 }}>Creator</div>
                    <div style={{ fontSize: 13, color: theme.text, fontWeight: 600 }}>{creator.displayName}</div>
                    <div style={{ fontSize: 11, color: theme.textMuted }}>{creator.tiktok || creator.instagram}</div>
                  </div>
                  <div style={{ background: theme.bgInput, borderRadius: 8, padding: "10px 14px" }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: theme.textDim, textTransform: "uppercase", marginBottom: 4 }}>Campaign</div>
                    <div style={{ fontSize: 13, color: theme.text, fontWeight: 600 }}>{campaign.title || "None"}</div>
                  </div>
                  <div style={{ background: theme.bgInput, borderRadius: 8, padding: "10px 14px" }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: theme.textDim, textTransform: "uppercase", marginBottom: 4 }}>Platform</div>
                    <div style={{ fontSize: 13, color: theme.text }}>{selected.platform}</div>
                  </div>
                  <div style={{ background: theme.bgInput, borderRadius: 8, padding: "10px 14px" }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: theme.textDim, textTransform: "uppercase", marginBottom: 4 }}>Status</div>
                    <Badge color={selected.status === "approved" ? "success" : selected.status === "rejected" ? "danger" : "warning"}>{selected.status}</Badge>
                  </div>
                </div>

                {/* Video link */}
                <div style={{ background: theme.bgInput, borderRadius: 8, padding: "12px 14px", marginBottom: 16 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: theme.textDim, textTransform: "uppercase", marginBottom: 6 }}>Video Link</div>
                  <a href={selected.videoLink} target="_blank" rel="noopener noreferrer" style={{ color: theme.accent, fontSize: 13, wordBreak: "break-all", textDecoration: "none" }}>{selected.videoLink} ↗</a>
                </div>

                {/* Description */}
                {selected.description && (
                  <div style={{ background: theme.bgInput, borderRadius: 8, padding: "12px 14px", marginBottom: 16 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: theme.textDim, textTransform: "uppercase", marginBottom: 6 }}>Description / Caption</div>
                    <div style={{ fontSize: 13, color: theme.text, lineHeight: 1.5 }}>{selected.description}</div>
                  </div>
                )}

                {/* Hashtag */}
                <div style={{ background: theme.bgInput, borderRadius: 8, padding: "12px 14px", marginBottom: 16 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: theme.textDim, textTransform: "uppercase", marginBottom: 6 }}>Required Hashtag</div>
                  <div style={{ fontSize: 13, color: selected.description?.includes("#SphereApp") || selected.description?.includes("#sphereapp") ? theme.success : theme.danger }}>
                    {selected.description?.toLowerCase().includes("#sphereapp") ? "✓ #SphereApp included" : "✗ #SphereApp missing"}
                  </div>
                </div>

                {/* Stats */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: theme.textMuted, textTransform: "uppercase", marginBottom: 10 }}>Video Stats (Manual Entry)</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
                    {[["views", "Views"], ["likes", "Likes"], ["comments", "Comments"], ["shares", "Shares"]].map(([key, label]) => (
                      <div key={key}>
                        <label style={{ fontSize: 10, fontWeight: 600, color: theme.textDim, textTransform: "uppercase" }}>{label}</label>
                        <input type="number" value={selected[key] || ""} onChange={e => { const val = parseInt(e.target.value) || 0; setSelected({ ...selected, [key]: val }); handleUpdateStats(selected.id, { [key]: val }); }} style={{ width: "100%", padding: "8px 10px", background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 6, color: theme.text, fontFamily: fontMono, fontSize: 13, outline: "none", marginTop: 4 }} placeholder="0" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payout */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
                  <div>
                    <label style={{ fontSize: 10, fontWeight: 600, color: theme.textDim, textTransform: "uppercase" }}>Base Pay ($)</label>
                    <input type="number" value={selected.basePay || 5} onChange={e => { const val = parseFloat(e.target.value) || 0; setSelected({ ...selected, basePay: val }); handleUpdateStats(selected.id, { basePay: val }); }} style={{ width: "100%", padding: "8px 10px", background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 6, color: theme.text, fontFamily: fontMono, fontSize: 13, outline: "none", marginTop: 4 }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 10, fontWeight: 600, color: theme.textDim, textTransform: "uppercase" }}>Bonus ($)</label>
                    <input type="number" value={selected.bonus || 0} onChange={e => { const val = parseFloat(e.target.value) || 0; setSelected({ ...selected, bonus: val }); handleUpdateStats(selected.id, { bonus: val }); }} style={{ width: "100%", padding: "8px 10px", background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 6, color: theme.text, fontFamily: fontMono, fontSize: 13, outline: "none", marginTop: 4 }} />
                  </div>
                </div>

                {/* Actions */}
                {selected.status === "pending" && (
                  <div style={{ display: "flex", gap: 10, paddingTop: 16, borderTop: `1px solid ${theme.border}` }}>
                    <Button onClick={() => handleApprove(selected.id)} icon="check" style={{ flex: 1, justifyContent: "center" }}>Approve & Pay $5 Base</Button>
                    <Button onClick={() => handleReject(selected.id, "Did not meet guidelines")} variant="danger" icon="x" style={{ flex: 1, justifyContent: "center" }}>Reject</Button>
                  </div>
                )}
              </>
            );
          })()}
        </Modal>
      )}
    </>
  );
}

function AdminCampaigns({ campaigns, updateCampaigns }) {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", hashtag: REQUIRED_HASHTAG, status: "active" });

  const handleAdd = async () => {
    if (!form.title) return;
    await updateCampaigns([...campaigns, { id: "c_" + Date.now(), ...form }]);
    setModal(null);
    setForm({ title: "", description: "", hashtag: REQUIRED_HASHTAG, status: "active" });
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: theme.text, margin: 0 }}>Campaign Briefs</h1>
        <Button onClick={() => setModal("add")} icon="plus">New Campaign</Button>
      </div>
      <p style={{ fontSize: 13, color: theme.textMuted, margin: "0 0 20px", lineHeight: 1.6 }}>These are the video angles/topics creators can choose from when submitting content. Creators see these in their portal.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {campaigns.map(c => (
          <div key={c.id} style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 12, padding: "18px 22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: theme.text, margin: 0 }}>{c.title}</h3>
              <Badge color={c.status === "active" ? "success" : "muted"}>{c.status}</Badge>
            </div>
            <p style={{ fontSize: 13, color: theme.textMuted, lineHeight: 1.6, margin: 0 }}>{c.description}</p>
            <div style={{ marginTop: 10, fontSize: 12, color: theme.accent }}>Required: {c.hashtag}</div>
          </div>
        ))}
      </div>

      {modal === "add" && (
        <Modal title="New Campaign Brief" onClose={() => setModal(null)}>
          <Input label="Title" value={form.title} onChange={v => setForm({ ...form, title: v })} placeholder="e.g. The Wake-Up Call" required />
          <Input label="Description / Instructions" value={form.description} onChange={v => setForm({ ...form, description: v })} textarea placeholder="Describe what the video should show, the tone, and any specific requirements..." required />
          <Input label="Required Hashtag" value={form.hashtag} onChange={v => setForm({ ...form, hashtag: v })} />
          <Button onClick={handleAdd} style={{ width: "100%", justifyContent: "center" }}>Create Campaign</Button>
        </Modal>
      )}
    </>
  );
}

function AdminTemplates({ templates }) {
  const [copiedId, setCopiedId] = useState(null);

  const copyTemplate = (text) => {
    navigator.clipboard?.writeText(text);
  };

  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: theme.text, margin: "0 0 8px" }}>DM Templates</h1>
      <p style={{ fontSize: 13, color: theme.textMuted, margin: "0 0 20px", lineHeight: 1.6 }}>Copy these templates when reaching out to creators. Replace {"{{handle}}"} and {"{{topic}}"} with the creator's info.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {templates.map(t => (
          <div key={t.id} style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 12, padding: "18px 22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div>
                <span style={{ fontWeight: 700, fontSize: 15, color: theme.text }}>{t.name}</span>
                <Badge style={{ marginLeft: 10 }} color="muted">{t.platform}</Badge>
              </div>
              <Button onClick={() => { copyTemplate(t.message); setCopiedId(t.id); setTimeout(() => setCopiedId(null), 2000); }} variant="ghost" size="sm" icon={copiedId === t.id ? "check" : "copy"}>
                {copiedId === t.id ? "Copied!" : "Copy"}
              </Button>
            </div>
            <div style={{ background: theme.bgInput, borderRadius: 8, padding: "14px 16px", fontSize: 13, color: theme.textMuted, lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: font }}>{t.message}</div>
          </div>
        ))}
      </div>
    </>
  );
}

function AdminPayouts({ submissions, creators }) {
  const approved = submissions.filter(s => s.status === "approved");
  const byCreator = {};
  approved.forEach(s => {
    if (!byCreator[s.creatorId]) byCreator[s.creatorId] = { videos: 0, base: 0, bonus: 0, views: 0 };
    byCreator[s.creatorId].videos++;
    byCreator[s.creatorId].base += (s.basePay || 5);
    byCreator[s.creatorId].bonus += (s.bonus || 0);
    byCreator[s.creatorId].views += (s.views || 0);
  });

  const rows = Object.entries(byCreator).map(([cid, data]) => {
    const creator = creators.find(c => c.id === cid) || {};
    return { ...data, ...creator, total: data.base + data.bonus };
  }).sort((a, b) => b.total - a.total);

  const grandTotal = rows.reduce((s, r) => s + r.total, 0);

  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: theme.text, margin: "0 0 8px" }}>Payouts</h1>
      <p style={{ fontSize: 13, color: theme.textMuted, margin: "0 0 20px" }}>Summary of what's owed to each creator based on approved submissions.</p>

      {rows.length === 0 ? (
        <EmptyState icon="dollar" title="No payouts yet" description="Approve some video submissions to see payout data." />
      ) : (
        <>
          <div style={{ background: theme.accentSoft, border: `1px solid ${theme.accentSoftBorder}`, borderRadius: 12, padding: "16px 20px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: theme.accent }}>Total Owed</span>
            <span style={{ fontSize: 24, fontWeight: 800, color: theme.accent, fontFamily: fontMono }}>${grandTotal.toFixed(2)}</span>
          </div>
          <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 12, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                  {["Creator", "Videos", "Base", "Bonus", "Total", "Views"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 11, fontWeight: 600, color: theme.textDim, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${theme.border}` }}>
                    <td style={{ padding: "12px 16px", fontWeight: 600, color: theme.text }}>{r.displayName || "Unknown"}</td>
                    <td style={{ padding: "12px 16px", color: theme.textMuted, fontFamily: fontMono }}>{r.videos}</td>
                    <td style={{ padding: "12px 16px", color: theme.textMuted, fontFamily: fontMono }}>${r.base.toFixed(2)}</td>
                    <td style={{ padding: "12px 16px", color: theme.accent, fontFamily: fontMono }}>${r.bonus.toFixed(2)}</td>
                    <td style={{ padding: "12px 16px", color: theme.text, fontWeight: 700, fontFamily: fontMono }}>${r.total.toFixed(2)}</td>
                    <td style={{ padding: "12px 16px", color: theme.textMuted, fontFamily: fontMono }}>{r.views.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}

// ═══════════════════════════════════════
// CREATOR PORTAL
// ═══════════════════════════════════════
function CreatorPortal({ user, onLogout }) {
  const [page, setPage] = useState("home");
  const [campaigns, setCampaigns] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    const [camp, subs] = await Promise.all([store.get("campaigns"), store.get("submissions")]);
    setCampaigns(camp || DEFAULT_CAMPAIGNS);
    setSubmissions(subs || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const mySubmissions = submissions.filter(s => s.creatorId === user.id);
  const approvedSubs = mySubmissions.filter(s => s.status === "approved");
  const totalEarnings = approvedSubs.reduce((s, sub) => s + (sub.basePay || 5) + (sub.bonus || 0), 0);
  const totalViews = approvedSubs.reduce((s, sub) => s + (sub.views || 0), 0);

  const handleSubmit = async (submission) => {
    const allSubs = await store.get("submissions") || [];
    const newSub = { id: "sub_" + Date.now(), creatorId: user.id, status: "pending", basePay: 5, bonus: 0, views: 0, likes: 0, comments: 0, shares: 0, submittedAt: new Date().toISOString(), ...submission };
    allSubs.push(newSub);
    await store.set("submissions", allSubs);
    setSubmissions(allSubs);
    setPage("submissions");
  };

  const nav = [
    { id: "home", label: "Dashboard", icon: "home" },
    { id: "briefs", label: "Briefs", icon: "briefcase" },
    { id: "submit", label: "Submit Video", icon: "video" },
    { id: "submissions", label: "My Submissions", icon: "clipboard" },
    { id: "guidelines", label: "Guidelines", icon: "clipboard" },
  ];

  if (loading) return <div style={{ minHeight: "100vh", background: theme.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font, color: theme.textMuted }}>Loading...</div>;

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, fontFamily: font, display: "flex" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap'); * { box-sizing: border-box; } ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 3px; }`}</style>

      {/* Sidebar */}
      <div style={{ width: 220, background: theme.bgCard, borderRight: `1px solid ${theme.border}`, padding: "20px 12px", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 100 }}>
        <div style={{ padding: "4px 12px 20px" }}>
  <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 20, fontWeight: 800, color: theme.text, letterSpacing: "-0.02em" }}>
    <img
      src={LOGO_SRC}
      alt="Sphere logo"
      style={{ width: 24, height: 24, objectFit: "cover", borderRadius: 6 }}
    />
    <span>Sphere</span>
  </div>
  <span style={{ display: "block", fontSize: 10, fontWeight: 600, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>
    Admin Hub
  </span>
</div>
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          {nav.map(n => (
            <button key={n.id} onClick={() => setPage(n.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, border: "none", background: page === n.id ? theme.accentSoft : "transparent", color: page === n.id ? theme.accent : theme.textMuted, fontFamily: font, fontSize: 13, fontWeight: 600, cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
              <Icon name={n.icon} size={16} />{n.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: "12px", borderTop: `1px solid ${theme.border}`, marginTop: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: theme.text, marginBottom: 2 }}>{user.displayName}</div>
          <div style={{ fontSize: 11, color: theme.textMuted, marginBottom: 10 }}>{user.tiktok || user.instagram}</div>
          <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: theme.textMuted, fontFamily: font, fontSize: 12, fontWeight: 600, cursor: "pointer", padding: 0 }}>
            <Icon name="logout" size={14} />Sign Out
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, marginLeft: 220, padding: "28px 32px", maxWidth: 900 }}>
        {page === "home" && (
          <>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: theme.text, margin: "0 0 6px" }}>Welcome back, {user.displayName}</h1>
            <p style={{ fontSize: 13, color: theme.textMuted, margin: "0 0 24px" }}>Here's your creator overview.</p>
            <div style={{ display: "flex", gap: 14, marginBottom: 28, flexWrap: "wrap" }}>
              <MetricCard label="Videos Submitted" value={mySubmissions.length} icon="video" color={theme.accent} />
              <MetricCard label="Approved" value={approvedSubs.length} icon="check" color={theme.success} />
              <MetricCard label="Total Earnings" value={`$${totalEarnings}`} icon="dollar" color={theme.warning} />
              <MetricCard label="Total Views" value={totalViews.toLocaleString()} icon="chart" color={theme.purple} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Button onClick={() => setPage("briefs")} icon="briefcase" variant="secondary">View Briefs</Button>
              <Button onClick={() => setPage("submit")} icon="plus">Submit a Video</Button>
            </div>
          </>
        )}

        {page === "briefs" && (
          <>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: theme.text, margin: "0 0 8px" }}>Campaign Briefs</h1>
            <p style={{ fontSize: 13, color: theme.textMuted, margin: "0 0 20px", lineHeight: 1.6 }}>Pick a brief that fits your style and create a 15–30 second video. Include <span style={{ color: theme.accent, fontWeight: 600 }}>{REQUIRED_HASHTAG}</span> in your caption.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {campaigns.filter(c => c.status === "active").map(c => (
                <div key={c.id} style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 12, padding: "20px 24px" }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: theme.text, margin: "0 0 8px" }}>{c.title}</h3>
                  <p style={{ fontSize: 13, color: theme.textMuted, lineHeight: 1.6, margin: "0 0 14px" }}>{c.description}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: theme.accent }}>Hashtag: {c.hashtag}</span>
                    <Button onClick={() => setPage("submit")} size="sm" icon="arrowRight">Create Video</Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {page === "submit" && <CreatorSubmitForm campaigns={campaigns} onSubmit={handleSubmit} />}

        {page === "submissions" && (
          <>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: theme.text, margin: "0 0 20px" }}>My Submissions</h1>
            {mySubmissions.length === 0 ? (
              <EmptyState icon="video" title="No submissions yet" description="Submit your first video to start earning!" action={<Button onClick={() => setPage("submit")} icon="plus" size="sm">Submit a Video</Button>} />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {mySubmissions.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)).map(s => {
                  const campaign = campaigns.find(c => c.id === s.campaignId);
                  return (
                    <div key={s.id} style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 12, padding: "16px 20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14, color: theme.text }}>{campaign?.title || "General"}</div>
                          <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>{s.platform} · {new Date(s.submittedAt).toLocaleDateString()}</div>
                        </div>
                        <Badge color={s.status === "approved" ? "success" : s.status === "rejected" ? "danger" : "warning"}>{s.status}</Badge>
                      </div>
                      <a href={s.videoLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: theme.accent, textDecoration: "none", wordBreak: "break-all" }}>{s.videoLink} ↗</a>
                      {s.status === "approved" && (
                        <div style={{ display: "flex", gap: 16, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${theme.border}` }}>
                          <div><span style={{ fontSize: 10, fontWeight: 600, color: theme.textDim, textTransform: "uppercase" }}>Earned</span><div style={{ fontSize: 14, fontWeight: 700, color: theme.accent, fontFamily: fontMono }}>${(s.basePay || 5) + (s.bonus || 0)}</div></div>
                          <div><span style={{ fontSize: 10, fontWeight: 600, color: theme.textDim, textTransform: "uppercase" }}>Views</span><div style={{ fontSize: 14, fontWeight: 600, color: theme.text, fontFamily: fontMono }}>{(s.views || 0).toLocaleString()}</div></div>
                          <div><span style={{ fontSize: 10, fontWeight: 600, color: theme.textDim, textTransform: "uppercase" }}>Likes</span><div style={{ fontSize: 14, fontWeight: 600, color: theme.text, fontFamily: fontMono }}>{(s.likes || 0).toLocaleString()}</div></div>
                        </div>
                      )}
                      {s.status === "rejected" && s.feedback && (
                        <div style={{ marginTop: 10, background: theme.dangerSoft, borderRadius: 6, padding: "8px 12px", fontSize: 12, color: theme.danger }}>Feedback: {s.feedback}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {page === "guidelines" && (
          <>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: theme.text, margin: "0 0 20px" }}>Content Guidelines</h1>
            <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 12, padding: "24px 28px" }}>
              {[
                { title: "Video Length", desc: "15–30 seconds. Short, punchy, scroll-stopping." },
                { title: "Format", desc: "Vertical (9:16). Shot on your phone — authentic > polished." },
                { title: "Required Hashtag", desc: `Include ${REQUIRED_HASHTAG} in your caption. Every video, every time.` },
                { title: "Platform", desc: "Post on your own TikTok or Instagram account." },
                { title: "Audio", desc: "Clear audio, no background music that drowns out speech (unless it's a trending sound)." },
                { title: "Content", desc: "Show Sphere in use — your level, your streak, your tier. Make it feel real, not scripted." },
                { title: "Don'ts", desc: "No misleading claims about the app. No hate speech. No competitors mentioned." },
              ].map((item, i) => (
                <div key={i} style={{ padding: "14px 0", borderBottom: i < 6 ? `1px solid ${theme.border}` : "none" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: theme.text, marginBottom: 4 }}>{item.title}</div>
                  <div style={{ fontSize: 13, color: theme.textMuted, lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: theme.text, marginBottom: 12 }}>Pay Structure</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 10, padding: "16px 18px", textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: theme.accent, fontFamily: fontMono }}>$5</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: theme.textMuted, marginTop: 4 }}>Base per video</div>
                </div>
                <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 10, padding: "16px 18px", textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: theme.warning, fontFamily: fontMono }}>$2–10</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: theme.textMuted, marginTop: 4 }}>Performance bonus</div>
                </div>
                <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 10, padding: "16px 18px", textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: theme.purple, fontFamily: fontMono }}>🏆</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: theme.textMuted, marginTop: 4 }}>Monthly leaderboard</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function CreatorSubmitForm({ campaigns, onSubmit }) {
  const [form, setForm] = useState({ campaignId: campaigns[0]?.id || "", platform: "tiktok", videoLink: "", description: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!form.videoLink) return;
    onSubmit(form);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm({ campaignId: campaigns[0]?.id || "", platform: "tiktok", videoLink: "", description: "" });
  };

  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: theme.text, margin: "0 0 8px" }}>Submit a Video</h1>
      <p style={{ fontSize: 13, color: theme.textMuted, margin: "0 0 24px", lineHeight: 1.6 }}>
        Post your video on TikTok or Instagram, then paste the link below. Don't forget <span style={{ color: theme.accent, fontWeight: 600 }}>{REQUIRED_HASHTAG}</span>!
      </p>

      {submitted && (
        <div style={{ background: theme.successSoft, border: "1px solid rgba(34,197,94,0.3)", borderRadius: 10, padding: "14px 18px", marginBottom: 20, fontSize: 13, color: theme.success, fontWeight: 600 }}>✓ Video submitted! We'll review it shortly.</div>
      )}

      <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 12, padding: "24px 28px" }}>
        <Select label="Campaign / Brief" value={form.campaignId} onChange={v => setForm({ ...form, campaignId: v })} options={campaigns.filter(c => c.status === "active").map(c => ({ value: c.id, label: c.title }))} />

        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: theme.textMuted, marginBottom: 6, letterSpacing: "0.03em", textTransform: "uppercase" }}>Platform</label>
          <div style={{ display: "flex", gap: 8 }}>
            {[["tiktok", "TikTok"], ["instagram", "Instagram"]].map(([v, label]) => (
              <button key={v} onClick={() => setForm({ ...form, platform: v })} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: `1px solid ${form.platform === v ? theme.accent : theme.border}`, background: form.platform === v ? theme.accentSoft : "transparent", color: form.platform === v ? theme.accent : theme.textMuted, fontFamily: font, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{label}</button>
            ))}
          </div>
        </div>

        <Input label="Video Link" value={form.videoLink} onChange={v => setForm({ ...form, videoLink: v })} placeholder="https://www.tiktok.com/@you/video/..." required />
        <Input label="Caption / Description" value={form.description} onChange={v => setForm({ ...form, description: v })} textarea placeholder={`Your caption (make sure to include ${REQUIRED_HASHTAG})...`} />

        {form.description && !form.description.toLowerCase().includes("#sphereapp") && (
          <div style={{ background: theme.warningSoft, border: "1px solid rgba(245,158,11,0.3)", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 12, color: theme.warning }}>⚠ Don't forget to include {REQUIRED_HASHTAG} in your caption!</div>
        )}

        <div style={{ background: theme.bgInput, borderRadius: 8, padding: "12px 16px", marginBottom: 20, fontSize: 12, color: theme.textMuted, lineHeight: 1.6 }}>
          By submitting, you grant Sphere the right to use, repost, and promote this video across our channels. You retain ownership of your content.
        </div>

        <Button onClick={handleSubmit} disabled={!form.videoLink} style={{ width: "100%", justifyContent: "center" }} size="lg">Submit Video</Button>
      </div>
    </>
  );
}

// ═══════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const saved = await store.get("current_user");
      if (saved) setUser(saved);
      setLoading(false);
    })();
  }, []);

  const handleLogin = async (userData) => {
    setUser(userData);
    await store.set("current_user", userData);
  };

  const handleLogout = async () => {
    setUser(null);
    await store.set("current_user", null);
  };

  if (loading) return <div style={{ minHeight: "100vh", background: "#0a0e17", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", color: "#64748b" }}>Loading...</div>;

  if (!user) return <AuthScreen onLogin={handleLogin} />;
  if (user.role === "admin") return <AdminDashboard onLogout={handleLogout} />;
  return <CreatorPortal user={user} onLogout={handleLogout} />;
}
