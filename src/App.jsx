import { useState, useEffect, useCallback } from "react";

const ADMIN_USER = "sphere";
const ADMIN_PASS = "Sphere#1";
const INVITE_CODE = "spherecreator";
const REQUIRED_HASHTAG = "#SphereApp";
const LOGO_SRC = "/public/spherelogo1.jpg";

const LOGO = "data:image/png;base64,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";

//const store = {
  //async get(k) { try { const r = await window.storage.get(k); return r ? JSON.parse(r.value) : null; } catch { return null; } },
  //async set(k, v) { try { await window.storage.set(k, JSON.stringify(v)); } catch(e) { console.error(e); } }
//};
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

const PIPELINE = ["identified","contacted","responded","onboarded","active"];

const T = {
  bg:"#06080f", bg2:"#0e1219", card:"#141a24", cardH:"#1a2233", input:"#0a0f18",
  brd:"#1e2a3a", brdF:"#7c5cfc", text:"#e8eaf0", muted:"#6b7a8d", dim:"#3d4d5f",
  acc:"#7c5cfc", accH:"#6a4ce0", accS:"rgba(124,92,252,0.1)", accSB:"rgba(124,92,252,0.3)",
  teal:"#14b8a6", tealS:"rgba(20,184,166,0.1)", tealSB:"rgba(20,184,166,0.3)",
  red:"#f43f5e", redS:"rgba(244,63,94,0.08)", redSB:"rgba(244,63,94,0.25)",
  warn:"#f59e0b", warnS:"rgba(245,158,11,0.08)", warnSB:"rgba(245,158,11,0.25)",
  grn:"#22c55e", grnS:"rgba(34,197,94,0.08)", grnSB:"rgba(34,197,94,0.25)",
  pink:"#ec4899", pinkS:"rgba(236,72,153,0.08)",
};

const STAT_C = {
  identified:{bg:T.pinkS,text:T.pink,brd:"rgba(236,72,153,0.25)"},
  contacted:{bg:T.warnS,text:T.warn,brd:T.warnSB},
  responded:{bg:"rgba(59,130,246,0.08)",text:"#3b82f6",brd:"rgba(59,130,246,0.25)"},
  onboarded:{bg:T.accS,text:T.acc,brd:T.accSB},
  active:{bg:T.grnS,text:T.grn,brd:T.grnSB},
};

const F = `'DM Sans',system-ui,-apple-system,sans-serif`;
const FM = `'JetBrains Mono','SF Mono',monospace`;

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${T.brd};border-radius:3px}
input,select,textarea,button{font-family:${F}}
input:focus,textarea:focus,select:focus{outline:none;border-color:${T.brdF}!important}
`;

// ── Primitives ──
function Ico({d,s=18,c="currentColor"}){return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>}
const I={
  home:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1",
  users:"M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  video:"M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
  mail:"M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  brief:"M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  out:"M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
  check:"M5 13l4 4L19 7",x:"M6 18L18 6M6 6l12 12",
  eye:"M15 12a3 3 0 11-6 0 3 3 0 016 0z",plus:"M12 4v16m8-8H4",
  chart:"M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  clip:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  dollar:"M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  clock:"M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  copy:"M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z",
  search:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  arr:"M14 5l7 7m0 0l-7 7m7-7H3",
  guide:"M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
};

function Logo({s=28}){return <img src={LOGO} alt="Sphere" style={{width:s,height:s,borderRadius:6,objectFit:"cover"}} />}

function Badge({children,color="acc",s={}}){
  const m={acc:{bg:T.accS,c:T.acc,b:T.accSB},red:{bg:T.redS,c:T.red,b:T.redSB},warn:{bg:T.warnS,c:T.warn,b:T.warnSB},grn:{bg:T.grnS,c:T.grn,b:T.grnSB},pink:{bg:T.pinkS,c:T.pink,b:"rgba(236,72,153,0.25)"},muted:{bg:"rgba(107,122,141,0.08)",c:T.muted,b:"rgba(107,122,141,0.2)"}};
  const v=m[color]||m.acc;
  return <span style={{display:"inline-flex",alignItems:"center",padding:"2px 9px",borderRadius:999,fontSize:10,fontWeight:700,letterSpacing:"0.04em",textTransform:"uppercase",background:v.bg,color:v.c,border:`1px solid ${v.b}`,...s}}>{children}</span>
}

function Btn({children,onClick,v="primary",sz="md",ico,dis,s={}}){
  const base={display:"inline-flex",alignItems:"center",gap:6,fontFamily:F,fontWeight:600,borderRadius:10,cursor:dis?"not-allowed":"pointer",border:"none",transition:"all .15s",opacity:dis?.45:1,WebkitAppearance:"none"};
  const szs={sm:{padding:"7px 13px",fontSize:12},md:{padding:"10px 18px",fontSize:13},lg:{padding:"13px 24px",fontSize:14}};
  const vs={primary:{background:`linear-gradient(135deg,${T.acc},#9f7aea)`,color:"#fff",boxShadow:"0 2px 12px rgba(124,92,252,0.25)"},secondary:{background:"transparent",color:T.text,border:`1px solid ${T.brd}`},danger:{background:T.redS,color:T.red,border:`1px solid ${T.redSB}`},ghost:{background:"transparent",color:T.muted,padding:"6px 10px"}};
  return <button onClick={onClick} disabled={dis} style={{...base,...szs[sz],...vs[v],...s}}>{ico&&<Ico d={I[ico]} s={sz==="sm"?13:15}/>}{children}</button>
}

function Inp({label,value,onChange,type="text",ph,ta,s={},req}){
  const is={width:"100%",padding:ta?"10px 14px":"10px 14px",background:T.input,border:`1px solid ${T.brd}`,borderRadius:10,color:T.text,fontFamily:F,fontSize:13,outline:"none",resize:ta?"vertical":"none",minHeight:ta?80:"auto",transition:"border .15s",WebkitAppearance:"none"};
  return <div style={{marginBottom:14,...s}}>
    {label&&<label style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,marginBottom:6,letterSpacing:"0.05em",textTransform:"uppercase"}}>{label}{req&&<span style={{color:T.red}}> *</span>}</label>}
    {ta?<textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={ph} style={is}/>:
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={ph} style={is}/>}
  </div>
}

function Sel({label,value,onChange,options,s={}}){
  return <div style={{marginBottom:14,...s}}>
    {label&&<label style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,marginBottom:6,letterSpacing:"0.05em",textTransform:"uppercase"}}>{label}</label>}
    <select value={value} onChange={e=>onChange(e.target.value)} style={{width:"100%",padding:"10px 14px",background:T.input,border:`1px solid ${T.brd}`,borderRadius:10,color:T.text,fontFamily:F,fontSize:13,outline:"none",cursor:"pointer",WebkitAppearance:"none"}}>{options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select>
  </div>
}

function Modal({title,onClose,children,w=520}){
  return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.75)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:16}} onClick={onClose}>
    <div style={{background:T.card,borderRadius:18,border:`1px solid ${T.brd}`,width:"100%",maxWidth:w,maxHeight:"85vh",overflow:"auto",padding:"24px 22px",WebkitOverflowScrolling:"touch"}} onClick={e=>e.stopPropagation()}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <h2 style={{fontSize:17,fontWeight:800,color:T.text}}>{title}</h2>
        <button onClick={onClose} style={{background:"none",border:"none",color:T.muted,cursor:"pointer",padding:4}}><Ico d={I.x} s={20}/></button>
      </div>
      {children}
    </div>
  </div>
}

function Metric({label,value,ico,color=T.acc}){
  return <div style={{background:T.card,borderRadius:14,border:`1px solid ${T.brd}`,padding:"18px 20px",flex:"1 1 140px",minWidth:0}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
      <span style={{fontSize:10,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.06em"}}>{label}</span>
      <div style={{color,opacity:.6}}><Ico d={I[ico]} s={16}/></div>
    </div>
    <div style={{fontSize:24,fontWeight:800,color:T.text,fontFamily:FM}}>{value}</div>
  </div>
}

function Empty({ico,title,desc,action}){
  return <div style={{textAlign:"center",padding:"50px 20px"}}>
    <div style={{color:T.dim,marginBottom:10}}><Ico d={I[ico]} s={36}/></div>
    <h3 style={{fontSize:15,fontWeight:600,color:T.muted,marginBottom:4}}>{title}</h3>
    <p style={{fontSize:12,color:T.dim,marginBottom:14}}>{desc}</p>
    {action}
  </div>
}

// Responsive hook
function useIsMobile(){
  const [m,setM]=useState(window.innerWidth<768);
  useEffect(()=>{const h=()=>setM(window.innerWidth<768);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h)},[]);
  return m;
}

// ═══════════════════════ AUTH ═══════════════════════
function Auth({onLogin}){
  const [mode,setMode]=useState("login");
  const [role,setRole]=useState("creator");
  const [u,setU]=useState("");const [p,setP]=useState("");
  const [dn,setDn]=useState("");const [ic,setIc]=useState("");
  const [tt,setTt]=useState("");const [ig,setIg]=useState("");
  const [err,setErr]=useState("");

  const login=async()=>{
    setErr("");
    if(role==="admin"){if(u===ADMIN_USER&&p===ADMIN_PASS)onLogin({role:"admin",username:ADMIN_USER});else setErr("Invalid admin credentials");}
    else{const cs=await store.get("creators")||[];const c=cs.find(x=>x.username===u&&x.password===p);if(!c){setErr("Invalid username or password");return}if(c.status==="pending"){setErr("Account pending approval — check back soon!");return}if(c.status==="rejected"){setErr("Account not approved.");return}onLogin({role:"creator",...c})}
  };

  const signup=async()=>{
    setErr("");if(!u||!p||!dn){setErr("Fill in all required fields");return}if(!tt&&!ig){setErr("Provide at least one social handle");return}
    const cs=await store.get("creators")||[];if(cs.find(x=>x.username===u)){setErr("Username taken");return}
    const auto=ic.toLowerCase()===INVITE_CODE;
    const nc={id:"cr_"+Date.now(),username:u,password:p,displayName:dn,tiktok:tt,instagram:ig,inviteCode:ic||null,status:auto?"active":"pending",pipelineStage:auto?"onboarded":"identified",joinedAt:new Date().toISOString(),notes:auto?"Auto-approved via invite code":"Signed up without invite code",followerCount:"",niche:"",totalEarnings:0};
    cs.push(nc);await store.set("creators",cs);
    if(auto)onLogin({role:"creator",...nc});else setMode("pending");
  };

  if(mode==="pending")return(
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:F,padding:20}}>
      <style>{CSS}</style>
      <div style={{textAlign:"center",maxWidth:380}}>
        <div style={{width:56,height:56,borderRadius:"50%",background:T.warnS,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px",border:`1px solid ${T.warnSB}`}}><Ico d={I.clock} s={24} c={T.warn}/></div>
        <h2 style={{fontSize:20,fontWeight:800,color:T.text,marginBottom:8}}>Account Pending</h2>
        <p style={{fontSize:13,color:T.muted,lineHeight:1.6}}>We're reviewing your account. You'll get access once approved!</p>
        <Btn onClick={()=>{setMode("login");setErr("")}} v="secondary" s={{marginTop:18}}>Back to Sign In</Btn>
      </div>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:F,padding:20}}>
      <style>{CSS}</style>
      <div style={{width:"100%",maxWidth:400}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:10,marginBottom:4}}><Logo s={36}/><span style={{fontSize:28,fontWeight:800,color:T.text,letterSpacing:"-0.03em"}}>Sphere</span></div>
          <p style={{fontSize:12,color:T.muted,letterSpacing:"0.08em",textTransform:"uppercase",fontWeight:600}}>Creator Hub</p>
        </div>
        <div style={{background:T.card,borderRadius:18,border:`1px solid ${T.brd}`,padding:"24px 22px"}}>
          <div style={{display:"flex",gap:3,marginBottom:22,background:T.input,borderRadius:10,padding:3}}>
            {[["login","Sign In"],["signup","Sign Up"]].map(([m,l])=><button key={m} onClick={()=>{setMode(m);setErr("")}} style={{flex:1,padding:"9px 0",borderRadius:8,border:"none",fontFamily:F,fontSize:13,fontWeight:700,cursor:"pointer",background:mode===m?T.card:"transparent",color:mode===m?T.text:T.muted,transition:"all .15s"}}>{l}</button>)}
          </div>
          {mode==="login"&&<>
            <div style={{display:"flex",gap:8,marginBottom:18}}>
              {[["admin","Admin"],["creator","Creator"]].map(([r,l])=><button key={r} onClick={()=>{setRole(r);setErr("")}} style={{flex:1,padding:"10px 0",borderRadius:10,border:`1px solid ${role===r?T.acc:T.brd}`,background:role===r?T.accS:"transparent",color:role===r?T.acc:T.muted,fontFamily:F,fontSize:13,fontWeight:700,cursor:"pointer"}}>{l}</button>)}
            </div>
            <Inp label="Username" value={u} onChange={setU} ph={role==="admin"?"Admin username":"Your username"}/>
            <Inp label="Password" value={p} onChange={setP} type="password" ph="••••••••"/>
          </>}
          {mode==="signup"&&<>
            <Inp label="Display Name" value={dn} onChange={setDn} ph="Your name" req/>
            <Inp label="Username" value={u} onChange={setU} ph="Choose a username" req/>
            <Inp label="Password" value={p} onChange={setP} type="password" ph="Choose a password" req/>
            <div style={{display:"flex",gap:8}}>
              <Inp label="TikTok" value={tt} onChange={setTt} ph="@handle" s={{flex:1}}/>
              <Inp label="Instagram" value={ig} onChange={setIg} ph="@handle" s={{flex:1}}/>
            </div>
            <Inp label="Invite Code (optional)" value={ic} onChange={setIc} ph="Enter code if you have one"/>
            <p style={{fontSize:11,color:T.dim,margin:"-8px 0 14px",lineHeight:1.5}}>Have an invite code? Enter it for instant access.</p>
          </>}
          {err&&<div style={{background:T.redS,border:`1px solid ${T.redSB}`,borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:12,color:T.red,fontWeight:600}}>{err}</div>}
          <Btn onClick={mode==="login"?login:signup} s={{width:"100%",justifyContent:"center",marginTop:4}} sz="lg">{mode==="login"?"Sign In":"Create Account"}</Btn>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════ SHELL ═══════════════════════
function Shell({nav,page,setPage,onLogout,label,userName,userHandle,children}){
  const mobile=useIsMobile();
  if(mobile)return(
    <div style={{minHeight:"100vh",minHeight:"-webkit-fill-available",background:T.bg,fontFamily:F,display:"flex",flexDirection:"column"}}>
      <style>{CSS}</style>
      {/* Top bar */}
      <div style={{padding:"14px 16px",borderBottom:`1px solid ${T.brd}`,display:"flex",alignItems:"center",justifyContent:"space-between",background:T.card,position:"sticky",top:0,zIndex:100,WebkitBackdropFilter:"blur(12px)",backdropFilter:"blur(12px)"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}><Logo s={26}/><span style={{fontSize:17,fontWeight:800,color:T.text}}>Sphere</span><span style={{fontSize:9,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.06em"}}>{label}</span></div>
        <button onClick={onLogout} style={{background:"none",border:"none",color:T.muted,cursor:"pointer",padding:4}}><Ico d={I.out} s={18}/></button>
      </div>
      {/* Content */}
      <div style={{flex:1,overflow:"auto",padding:"20px 16px",paddingBottom:80,WebkitOverflowScrolling:"touch"}}>{children}</div>
      {/* Bottom nav */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:T.card,borderTop:`1px solid ${T.brd}`,display:"flex",paddingBottom:"env(safe-area-inset-bottom,0px)",zIndex:100}}>
        {nav.map(n=><button key={n.id} onClick={()=>setPage(n.id)} style={{flex:1,padding:"10px 0 8px",border:"none",background:"transparent",display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer",color:page===n.id?T.acc:T.dim,transition:"all .15s",position:"relative"}}>
          <Ico d={I[n.ico]} s={18}/>
          <span style={{fontSize:9,fontWeight:700,letterSpacing:"0.03em"}}>{n.short||n.label}</span>
          {n.badge>0&&<span style={{position:"absolute",top:4,right:"50%",marginRight:-16,background:T.red,color:"#fff",fontSize:8,fontWeight:800,borderRadius:99,padding:"1px 5px",minWidth:14,textAlign:"center"}}>{n.badge}</span>}
        </button>)}
      </div>
    </div>
  );

  // Desktop
  return(
    <div style={{minHeight:"100vh",background:T.bg,fontFamily:F,display:"flex"}}>
      <style>{CSS}</style>
      <div style={{width:210,background:T.card,borderRight:`1px solid ${T.brd}`,padding:"18px 10px",display:"flex",flexDirection:"column",position:"fixed",top:0,left:0,bottom:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"2px 10px 18px"}}><Logo s={28}/><div><div style={{fontSize:17,fontWeight:800,color:T.text,lineHeight:1}}>Sphere</div><div style={{fontSize:9,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.08em",marginTop:1}}>{label}</div></div></div>
        <nav style={{flex:1,display:"flex",flexDirection:"column",gap:1}}>
          {nav.map(n=><button key={n.id} onClick={()=>setPage(n.id)} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 11px",borderRadius:10,border:"none",background:page===n.id?T.accS:"transparent",color:page===n.id?T.acc:T.muted,fontFamily:F,fontSize:13,fontWeight:600,cursor:"pointer",textAlign:"left",transition:"all .15s",position:"relative"}}>
            <Ico d={I[n.ico]} s={16}/>{n.label}
            {n.badge>0&&<span style={{marginLeft:"auto",background:T.red,color:"#fff",fontSize:9,fontWeight:800,borderRadius:99,padding:"1px 6px",minWidth:16,textAlign:"center"}}>{n.badge}</span>}
          </button>)}
        </nav>
        {userName&&<div style={{padding:"10px 11px",borderTop:`1px solid ${T.brd}`,marginTop:6}}>
          <div style={{fontSize:12,fontWeight:700,color:T.text}}>{userName}</div>
          {userHandle&&<div style={{fontSize:10,color:T.muted,marginTop:1}}>{userHandle}</div>}
        </div>}
        <button onClick={onLogout} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 11px",borderRadius:10,border:"none",background:"transparent",color:T.muted,fontFamily:F,fontSize:13,fontWeight:600,cursor:"pointer"}}><Ico d={I.out} s={16}/>Sign Out</button>
      </div>
      <div style={{flex:1,marginLeft:210,padding:"24px 28px",maxWidth:1000}}>{children}</div>
    </div>
  );
}

// ═══════════════════════ ADMIN ═══════════════════════
function Admin({onLogout}){
  const [pg,setPg]=useState("home");
  const [creators,setC]=useState([]);const [subs,setSubs]=useState([]);
  const [camps,setCamps]=useState([]);const [dms,setDms]=useState([]);
  const [ld,setLd]=useState(true);

  const load=useCallback(async()=>{
    const [c,s,ca,d]=await Promise.all([store.get("creators"),store.get("submissions"),store.get("campaigns"),store.get("dm_templates")]);
    setC(c||[]);setSubs(s||[]);setCamps(ca||DEFAULT_CAMPAIGNS);setDms(d||DEFAULT_DM_TEMPLATES);
    if(!ca)await store.set("campaigns",DEFAULT_CAMPAIGNS);if(!d)await store.set("dm_templates",DEFAULT_DM_TEMPLATES);setLd(false);
  },[]);
  useEffect(()=>{load()},[load]);

  const uC=async u=>{setC(u);await store.set("creators",u)};
  const uS=async u=>{setSubs(u);await store.set("submissions",u)};
  const uCa=async u=>{setCamps(u);await store.set("campaigns",u)};

  const pC=creators.filter(c=>c.status==="pending");
  const pS=subs.filter(s=>s.status==="pending");
  const aS=subs.filter(s=>s.status==="approved");
  const spend=aS.reduce((a,s)=>a+(s.basePay||5)+(s.bonus||0),0);
  const views=aS.reduce((a,s)=>a+(s.views||0),0);

  const nav=[
    {id:"home",label:"Dashboard",short:"Home",ico:"home"},
    {id:"creators",label:"Creators",short:"Creators",ico:"users",badge:pC.length},
    {id:"subs",label:"Submissions",short:"Videos",ico:"video",badge:pS.length},
    {id:"camps",label:"Campaigns",short:"Briefs",ico:"brief"},
    {id:"dms",label:"DM Templates",short:"DMs",ico:"mail"},
    {id:"pay",label:"Payouts",short:"Pay",ico:"dollar"},
  ];

  if(ld)return <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:F,color:T.muted}}>Loading...</div>;

  return(
    <Shell nav={nav} page={pg} setPage={setPg} onLogout={onLogout} label="Admin">
      {pg==="home"&&<AHome cs={creators} ss={subs} pC={pC} pS={pS} spend={spend} views={views} go={setPg}/>}
      {pg==="creators"&&<ACreators cs={creators} uC={uC}/>}
      {pg==="subs"&&<ASubs ss={subs} uS={uS} cs={creators} camps={camps}/>}
      {pg==="camps"&&<ACamps camps={camps} uCa={uCa}/>}
      {pg==="dms"&&<ADms dms={dms}/>}
      {pg==="pay"&&<APay ss={subs} cs={creators}/>}
    </Shell>
  );
}

function AHome({cs,ss,pC,pS,spend,views,go}){
  const active=cs.filter(c=>c.status==="active"||c.pipelineStage==="active");
  const aV=ss.filter(s=>s.status==="approved");
  const avg=aV.length?(spend/aV.length).toFixed(2):"0.00";
  return <>
    <h1 style={{fontSize:22,fontWeight:800,color:T.text,marginBottom:20}}>Dashboard</h1>
    <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}><Metric label="Creators" value={cs.length} ico="users" color={T.acc}/><Metric label="Approved" value={aV.length} ico="video" color={T.grn}/><Metric label="Spend" value={`$${spend}`} ico="dollar" color={T.warn}/><Metric label="Avg $/Vid" value={`$${avg}`} ico="chart" color={T.pink}/></div>
    <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap"}}><Metric label="Pending Creators" value={pC.length} ico="clock" color={T.red}/><Metric label="Pending Videos" value={pS.length} ico="eye" color={T.warn}/><Metric label="Active" value={active.length} ico="check" color={T.grn}/><Metric label="Views" value={views.toLocaleString()} ico="chart" color={T.acc}/></div>
    {/* Pipeline */}
    <div style={{background:T.card,borderRadius:14,border:`1px solid ${T.brd}`,padding:"18px 20px",marginBottom:16}}>
      <h3 style={{fontSize:13,fontWeight:700,color:T.text,marginBottom:14}}>Creator Pipeline</h3>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{PIPELINE.map(s=>{const n=cs.filter(c=>c.pipelineStage===s).length;const sc=STAT_C[s];return <div key={s} style={{flex:"1 1 0",minWidth:60,background:sc.bg,border:`1px solid ${sc.brd}`,borderRadius:10,padding:"12px 8px",textAlign:"center"}}><div style={{fontSize:20,fontWeight:800,color:sc.text,fontFamily:FM}}>{n}</div><div style={{fontSize:9,fontWeight:700,color:sc.text,textTransform:"capitalize",marginTop:2}}>{s}</div></div>})}</div>
    </div>
    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{pC.length>0&&<Btn onClick={()=>go("creators")} ico="users" v="secondary" sz="sm">Review {pC.length} Creator{pC.length>1?"s":""}</Btn>}{pS.length>0&&<Btn onClick={()=>go("subs")} ico="video" v="secondary" sz="sm">Review {pS.length} Video{pS.length>1?"s":""}</Btn>}</div>
  </>
}

function ACreators({cs,uC}){
  const [modal,setM]=useState(null);const [flt,setFlt]=useState("all");const [q,setQ]=useState("");
  const [f,setF]=useState({displayName:"",username:"",password:"",tiktok:"",instagram:"",followerCount:"",niche:"",pipelineStage:"identified",notes:""});
  const fl=cs.filter(c=>{if(flt==="pending"&&c.status!=="pending")return false;if(flt!=="all"&&flt!=="pending"&&c.pipelineStage!==flt)return false;if(q&&!c.displayName?.toLowerCase().includes(q.toLowerCase())&&!c.tiktok?.toLowerCase().includes(q.toLowerCase())&&!c.instagram?.toLowerCase().includes(q.toLowerCase()))return false;return true});
  const add=async()=>{if(!f.displayName)return;await uC([...cs,{id:"cr_"+Date.now(),...f,status:"active",joinedAt:new Date().toISOString(),totalEarnings:0}]);setM(null);setF({displayName:"",username:"",password:"",tiktok:"",instagram:"",followerCount:"",niche:"",pipelineStage:"identified",notes:""})};
  const approve=async id=>uC(cs.map(c=>c.id===id?{...c,status:"active",pipelineStage:"onboarded"}:c));
  const reject=async id=>uC(cs.map(c=>c.id===id?{...c,status:"rejected"}:c));
  const updStage=async(id,s)=>uC(cs.map(c=>c.id===id?{...c,pipelineStage:s}:c));
  const updNotes=async(id,n)=>uC(cs.map(c=>c.id===id?{...c,notes:n}:c));
  const pend=cs.filter(c=>c.status==="pending");

  return <>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18,gap:10,flexWrap:"wrap"}}><h1 style={{fontSize:22,fontWeight:800,color:T.text}}>Creators</h1><Btn onClick={()=>setM("add")} ico="plus" sz="sm">Add</Btn></div>
    {pend.length>0&&<div style={{background:T.warnS,border:`1px solid ${T.warnSB}`,borderRadius:14,padding:"14px 18px",marginBottom:18}}>
      <h3 style={{fontSize:13,fontWeight:700,color:T.warn,marginBottom:10}}>{pend.length} Awaiting Approval</h3>
      {pend.map(c=><div key={c.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderTop:`1px solid ${T.warnSB}`,gap:8,flexWrap:"wrap"}}>
        <div><span style={{fontWeight:600,color:T.text,fontSize:13}}>{c.displayName}</span><span style={{color:T.muted,fontSize:11,marginLeft:6}}>{c.tiktok||c.instagram}</span></div>
        <div style={{display:"flex",gap:5}}><Btn onClick={()=>approve(c.id)} sz="sm" ico="check">Approve</Btn><Btn onClick={()=>reject(c.id)} v="danger" sz="sm" ico="x">Reject</Btn></div>
      </div>)}
    </div>}
    <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
      <div style={{position:"relative",flex:"1 1 200px",maxWidth:260}}><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search..." style={{width:"100%",padding:"8px 12px 8px 32px",background:T.input,border:`1px solid ${T.brd}`,borderRadius:8,color:T.text,fontFamily:F,fontSize:12,outline:"none"}}/><div style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:T.dim}}><Ico d={I.search} s={13}/></div></div>
      {["all","pending",...PIPELINE].map(v=><button key={v} onClick={()=>setFlt(v)} style={{padding:"5px 10px",borderRadius:6,border:`1px solid ${flt===v?T.accSB:T.brd}`,background:flt===v?T.accS:"transparent",color:flt===v?T.acc:T.muted,fontFamily:F,fontSize:11,fontWeight:700,cursor:"pointer",textTransform:"capitalize"}}>{v}</button>)}
    </div>
    {fl.length===0?<Empty ico="users" title="No creators" desc="Add creators or wait for signups." action={<Btn onClick={()=>setM("add")} ico="plus" sz="sm">Add</Btn>}/>:
    <div style={{display:"flex",flexDirection:"column",gap:5}}>{fl.map(c=>{const sc=STAT_C[c.pipelineStage]||STAT_C.identified;return <div key={c.id} onClick={()=>setM(c)} style={{background:T.card,border:`1px solid ${T.brd}`,borderRadius:12,padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",transition:"all .15s",gap:10}}>
      <div style={{display:"flex",alignItems:"center",gap:10,minWidth:0}}><div style={{width:32,height:32,borderRadius:"50%",background:sc.bg,border:`1px solid ${sc.brd}`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13,color:sc.text,flexShrink:0}}>{c.displayName?.[0]?.toUpperCase()||"?"}</div><div style={{minWidth:0}}><div style={{fontWeight:600,fontSize:13,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.displayName}</div><div style={{fontSize:11,color:T.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{[c.tiktok,c.instagram].filter(Boolean).join(" · ")}</div></div></div>
      <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>{c.followerCount&&<span style={{fontSize:11,color:T.muted,fontFamily:FM}}>{c.followerCount}</span>}<Badge color={c.status==="pending"?"warn":c.pipelineStage==="active"?"grn":c.pipelineStage==="onboarded"?"acc":"muted"}>{c.status==="pending"?"pending":c.pipelineStage}</Badge></div>
    </div>})}</div>}
    {modal==="add"&&<Modal title="Add Creator" onClose={()=>setM(null)}>
      <Inp label="Display Name" value={f.displayName} onChange={v=>setF({...f,displayName:v})} req/>
      <div style={{display:"flex",gap:8}}><Inp label="TikTok" value={f.tiktok} onChange={v=>setF({...f,tiktok:v})} ph="@handle" s={{flex:1}}/><Inp label="Instagram" value={f.instagram} onChange={v=>setF({...f,instagram:v})} ph="@handle" s={{flex:1}}/></div>
      <div style={{display:"flex",gap:8}}><Inp label="Followers" value={f.followerCount} onChange={v=>setF({...f,followerCount:v})} ph="e.g. 2.5k" s={{flex:1}}/><Inp label="Niche" value={f.niche} onChange={v=>setF({...f,niche:v})} ph="e.g. finance" s={{flex:1}}/></div>
      <Sel label="Pipeline Stage" value={f.pipelineStage} onChange={v=>setF({...f,pipelineStage:v})} options={PIPELINE.map(s=>({value:s,label:s[0].toUpperCase()+s.slice(1)}))}/>
      <Inp label="Notes" value={f.notes} onChange={v=>setF({...f,notes:v})} ta ph="DM status, interests..."/>
      <Btn onClick={add} s={{width:"100%",justifyContent:"center"}}>Add Creator</Btn>
    </Modal>}
    {modal&&modal!=="add"&&typeof modal==="object"&&<Modal title="Creator Details" onClose={()=>setM(null)}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:18,paddingBottom:14,borderBottom:`1px solid ${T.brd}`}}>
        <div style={{width:42,height:42,borderRadius:"50%",background:T.accS,border:`1px solid ${T.accSB}`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:18,color:T.acc,flexShrink:0}}>{modal.displayName?.[0]?.toUpperCase()}</div>
        <div style={{minWidth:0}}><div style={{fontWeight:700,fontSize:16,color:T.text}}>{modal.displayName}</div><div style={{fontSize:12,color:T.muted}}>{[modal.tiktok,modal.instagram].filter(Boolean).join(" · ")}{modal.followerCount?` · ${modal.followerCount}`:""}</div></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
        <div style={{background:T.input,borderRadius:10,padding:"10px 12px"}}><div style={{fontSize:9,fontWeight:700,color:T.dim,textTransform:"uppercase",marginBottom:3}}>Joined</div><div style={{fontSize:12,color:T.text}}>{new Date(modal.joinedAt).toLocaleDateString()}</div></div>
        <div style={{background:T.input,borderRadius:10,padding:"10px 12px"}}><div style={{fontSize:9,fontWeight:700,color:T.dim,textTransform:"uppercase",marginBottom:3}}>Earnings</div><div style={{fontSize:12,color:T.acc,fontFamily:FM}}>${modal.totalEarnings||0}</div></div>
      </div>
      <Sel label="Pipeline Stage" value={modal.pipelineStage} onChange={v=>{updStage(modal.id,v);setM({...modal,pipelineStage:v})}} options={PIPELINE.map(s=>({value:s,label:s[0].toUpperCase()+s.slice(1)}))}/>
      <Inp label="Notes" value={modal.notes||""} onChange={v=>{updNotes(modal.id,v);setM({...modal,notes:v})}} ta ph="Add notes..."/>
    </Modal>}
  </>
}

function ASubs({ss,uS,cs,camps}){
  const [flt,setFlt]=useState("pending");const [sel,setSel]=useState(null);
  const fl=ss.filter(s=>flt==="all"?true:s.status===flt);
  const approve=async id=>{await uS(ss.map(s=>s.id===id?{...s,status:"approved"}:s));if(sel?.id===id)setSel({...sel,status:"approved"})};
  const rej=async(id,fb)=>{await uS(ss.map(s=>s.id===id?{...s,status:"rejected",feedback:fb}:s));if(sel?.id===id)setSel({...sel,status:"rejected",feedback:fb})};
  const updSt=async(id,st)=>{await uS(ss.map(s=>s.id===id?{...s,...st}:s));if(sel?.id===id)setSel({...sel,...st})};
  const gc=id=>cs.find(c=>c.id===id)||{};const gca=id=>camps.find(c=>c.id===id)||{};

  return <>
    <h1 style={{fontSize:22,fontWeight:800,color:T.text,marginBottom:18}}>Submissions</h1>
    <div style={{display:"flex",gap:6,marginBottom:18,flexWrap:"wrap"}}>
      {["pending","approved","rejected","all"].map(v=><button key={v} onClick={()=>setFlt(v)} style={{padding:"5px 12px",borderRadius:6,border:`1px solid ${flt===v?T.accSB:T.brd}`,background:flt===v?T.accS:"transparent",color:flt===v?T.acc:T.muted,fontFamily:F,fontSize:11,fontWeight:700,cursor:"pointer",textTransform:"capitalize"}}>{v} ({ss.filter(s=>v==="all"?true:s.status===v).length})</button>)}
    </div>
    {fl.length===0?<Empty ico="video" title="No submissions" desc="Submissions from creators will appear here."/>:
    <div style={{display:"flex",flexDirection:"column",gap:5}}>{fl.map(s=>{const cr=gc(s.creatorId);const ca=gca(s.campaignId);return <div key={s.id} onClick={()=>setSel(s)} style={{background:T.card,border:`1px solid ${T.brd}`,borderRadius:12,padding:"12px 16px",cursor:"pointer",transition:"all .15s"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
        <div style={{minWidth:0}}><div style={{fontWeight:600,fontSize:13,color:T.text}}>{cr.displayName||"Unknown"}</div><div style={{fontSize:11,color:T.muted}}>{ca.title||"—"} · {s.platform}</div></div>
        <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>{s.views>0&&<span style={{fontSize:11,color:T.muted,fontFamily:FM}}>{s.views?.toLocaleString()}v</span>}<Badge color={s.status==="approved"?"grn":s.status==="rejected"?"red":"warn"}>{s.status}</Badge></div>
      </div>
    </div>})}</div>}
    {sel&&<Modal title="Submission Details" onClose={()=>setSel(null)} w={580}>
      {(()=>{const cr=gc(sel.creatorId);const ca=gca(sel.campaignId);return <>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
          <div style={{background:T.input,borderRadius:10,padding:"10px 12px"}}><div style={{fontSize:9,fontWeight:700,color:T.dim,textTransform:"uppercase",marginBottom:3}}>Creator</div><div style={{fontSize:12,color:T.text,fontWeight:600}}>{cr.displayName}</div><div style={{fontSize:10,color:T.muted}}>{cr.tiktok||cr.instagram}</div></div>
          <div style={{background:T.input,borderRadius:10,padding:"10px 12px"}}><div style={{fontSize:9,fontWeight:700,color:T.dim,textTransform:"uppercase",marginBottom:3}}>Campaign</div><div style={{fontSize:12,color:T.text,fontWeight:600}}>{ca.title||"None"}</div></div>
          <div style={{background:T.input,borderRadius:10,padding:"10px 12px"}}><div style={{fontSize:9,fontWeight:700,color:T.dim,textTransform:"uppercase",marginBottom:3}}>Platform</div><div style={{fontSize:12,color:T.text}}>{sel.platform}</div></div>
          <div style={{background:T.input,borderRadius:10,padding:"10px 12px"}}><div style={{fontSize:9,fontWeight:700,color:T.dim,textTransform:"uppercase",marginBottom:3}}>Status</div><Badge color={sel.status==="approved"?"grn":sel.status==="rejected"?"red":"warn"}>{sel.status}</Badge></div>
        </div>
        <div style={{background:T.input,borderRadius:10,padding:"12px 14px",marginBottom:12}}>
          <div style={{fontSize:9,fontWeight:700,color:T.dim,textTransform:"uppercase",marginBottom:5}}>Video Link</div>
          <a href={sel.videoLink} target="_blank" rel="noopener noreferrer" style={{color:T.acc,fontSize:12,wordBreak:"break-all",textDecoration:"none"}}>{sel.videoLink} ↗</a>
        </div>
        {sel.description&&<div style={{background:T.input,borderRadius:10,padding:"12px 14px",marginBottom:12}}><div style={{fontSize:9,fontWeight:700,color:T.dim,textTransform:"uppercase",marginBottom:5}}>Caption</div><div style={{fontSize:12,color:T.text,lineHeight:1.5}}>{sel.description}</div></div>}
        <div style={{background:T.input,borderRadius:10,padding:"12px 14px",marginBottom:12}}><div style={{fontSize:9,fontWeight:700,color:T.dim,textTransform:"uppercase",marginBottom:5}}>Hashtag Check</div><div style={{fontSize:12,color:sel.description?.toLowerCase().includes("#sphereapp")?T.grn:T.red}}>{sel.description?.toLowerCase().includes("#sphereapp")?"✓ #SphereApp included":"✗ #SphereApp missing"}</div></div>
        <div style={{marginBottom:16}}><div style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",marginBottom:8}}>Stats (Manual)</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:6}}>{[["views","Views"],["likes","Likes"],["comments","Cmts"],["shares","Shares"]].map(([k,l])=><div key={k}><label style={{fontSize:9,fontWeight:700,color:T.dim,textTransform:"uppercase"}}>{l}</label><input type="number" value={sel[k]||""} onChange={e=>{const v=parseInt(e.target.value)||0;setSel({...sel,[k]:v});updSt(sel.id,{[k]:v})}} style={{width:"100%",padding:"7px 8px",background:T.bg,border:`1px solid ${T.brd}`,borderRadius:8,color:T.text,fontFamily:FM,fontSize:12,outline:"none",marginTop:3}} placeholder="0"/></div>)}</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:16}}>
          <div><label style={{fontSize:9,fontWeight:700,color:T.dim,textTransform:"uppercase"}}>Base Pay ($)</label><input type="number" value={sel.basePay||5} onChange={e=>{const v=parseFloat(e.target.value)||0;setSel({...sel,basePay:v});updSt(sel.id,{basePay:v})}} style={{width:"100%",padding:"7px 8px",background:T.bg,border:`1px solid ${T.brd}`,borderRadius:8,color:T.text,fontFamily:FM,fontSize:12,outline:"none",marginTop:3}}/></div>
          <div><label style={{fontSize:9,fontWeight:700,color:T.dim,textTransform:"uppercase"}}>Bonus ($)</label><input type="number" value={sel.bonus||0} onChange={e=>{const v=parseFloat(e.target.value)||0;setSel({...sel,bonus:v});updSt(sel.id,{bonus:v})}} style={{width:"100%",padding:"7px 8px",background:T.bg,border:`1px solid ${T.brd}`,borderRadius:8,color:T.text,fontFamily:FM,fontSize:12,outline:"none",marginTop:3}}/></div>
        </div>
        {sel.status==="pending"&&<div style={{display:"flex",gap:8,paddingTop:14,borderTop:`1px solid ${T.brd}`}}>
          <Btn onClick={()=>approve(sel.id)} ico="check" s={{flex:1,justifyContent:"center"}}>Approve</Btn>
          <Btn onClick={()=>rej(sel.id,"Didn't meet guidelines")} v="danger" ico="x" s={{flex:1,justifyContent:"center"}}>Reject</Btn>
        </div>}
      </>})()}
    </Modal>}
  </>
}

function ACamps({camps,uCa}){
  const [modal,setM]=useState(null);const [f,setF]=useState({title:"",description:"",hashtag:REQUIRED_HASHTAG,status:"active"});
  const add=async()=>{if(!f.title)return;await uCa([...camps,{id:"c_"+Date.now(),...f}]);setM(null);setF({title:"",description:"",hashtag:REQUIRED_HASHTAG,status:"active"})};
  return <>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18,gap:10,flexWrap:"wrap"}}><h1 style={{fontSize:22,fontWeight:800,color:T.text}}>Campaign Briefs</h1><Btn onClick={()=>setM("add")} ico="plus" sz="sm">New Brief</Btn></div>
    <p style={{fontSize:12,color:T.muted,marginBottom:18,lineHeight:1.6}}>Video angles creators choose from when submitting.</p>
    <div style={{display:"flex",flexDirection:"column",gap:10}}>{camps.map(c=><div key={c.id} style={{background:T.card,border:`1px solid ${T.brd}`,borderRadius:14,padding:"16px 20px"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6,gap:8}}><h3 style={{fontSize:15,fontWeight:700,color:T.text}}>{c.title}</h3><Badge color={c.status==="active"?"grn":"muted"}>{c.status}</Badge></div><p style={{fontSize:12,color:T.muted,lineHeight:1.6}}>{c.description}</p><div style={{marginTop:8,fontSize:11,color:T.acc,fontWeight:600}}>Required: {c.hashtag}</div></div>)}</div>
    {modal==="add"&&<Modal title="New Campaign Brief" onClose={()=>setM(null)}>
      <Inp label="Title" value={f.title} onChange={v=>setF({...f,title:v})} ph="e.g. The Wake-Up Call" req/>
      <Inp label="Description" value={f.description} onChange={v=>setF({...f,description:v})} ta ph="What the video should show..." req/>
      <Inp label="Hashtag" value={f.hashtag} onChange={v=>setF({...f,hashtag:v})}/>
      <Btn onClick={add} s={{width:"100%",justifyContent:"center"}}>Create</Btn>
    </Modal>}
  </>
}

function ADms({dms}){
  const [copied,setC]=useState(null);
  return <>
    <h1 style={{fontSize:22,fontWeight:800,color:T.text,marginBottom:6}}>DM Templates</h1>
    <p style={{fontSize:12,color:T.muted,marginBottom:18,lineHeight:1.6}}>Copy and personalize — replace {"{{handle}}"} and {"{{topic}}"} with creator info.</p>
    <div style={{display:"flex",flexDirection:"column",gap:10}}>{dms.map(t=><div key={t.id} style={{background:T.card,border:`1px solid ${T.brd}`,borderRadius:14,padding:"16px 20px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,gap:8}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontWeight:700,fontSize:14,color:T.text}}>{t.name}</span><Badge color="muted">{t.platform}</Badge></div>
        <Btn onClick={()=>{navigator.clipboard?.writeText(t.message);setC(t.id);setTimeout(()=>setC(null),2000)}} v="ghost" sz="sm" ico={copied===t.id?"check":"copy"}>{copied===t.id?"Copied":"Copy"}</Btn>
      </div>
      <div style={{background:T.input,borderRadius:10,padding:"12px 14px",fontSize:12,color:T.muted,lineHeight:1.7,whiteSpace:"pre-wrap"}}>{t.message}</div>
    </div>)}</div>
  </>
}

function APay({ss,cs}){
  const ap=ss.filter(s=>s.status==="approved");const by={};
  ap.forEach(s=>{if(!by[s.creatorId])by[s.creatorId]={vids:0,base:0,bonus:0,views:0};by[s.creatorId].vids++;by[s.creatorId].base+=(s.basePay||5);by[s.creatorId].bonus+=(s.bonus||0);by[s.creatorId].views+=(s.views||0)});
  const rows=Object.entries(by).map(([id,d])=>{const cr=cs.find(c=>c.id===id)||{};return{...d,...cr,total:d.base+d.bonus}}).sort((a,b)=>b.total-a.total);
  const gt=rows.reduce((s,r)=>s+r.total,0);
  return <>
    <h1 style={{fontSize:22,fontWeight:800,color:T.text,marginBottom:18}}>Payouts</h1>
    {rows.length===0?<Empty ico="dollar" title="No payouts yet" desc="Approve submissions to see payout data."/>:<>
      <div style={{background:T.accS,border:`1px solid ${T.accSB}`,borderRadius:14,padding:"14px 18px",marginBottom:18,display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:13,fontWeight:700,color:T.acc}}>Total Owed</span><span style={{fontSize:22,fontWeight:800,color:T.acc,fontFamily:FM}}>${gt.toFixed(2)}</span></div>
      <div style={{background:T.card,border:`1px solid ${T.brd}`,borderRadius:14,overflow:"auto",WebkitOverflowScrolling:"touch"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,minWidth:500}}>
          <thead><tr style={{borderBottom:`1px solid ${T.brd}`}}>{["Creator","Vids","Base","Bonus","Total","Views"].map(h=><th key={h} style={{textAlign:"left",padding:"10px 14px",fontSize:10,fontWeight:700,color:T.dim,textTransform:"uppercase",letterSpacing:"0.05em"}}>{h}</th>)}</tr></thead>
          <tbody>{rows.map((r,i)=><tr key={i} style={{borderBottom:`1px solid ${T.brd}`}}>
            <td style={{padding:"10px 14px",fontWeight:600,color:T.text}}>{r.displayName||"Unknown"}</td>
            <td style={{padding:"10px 14px",color:T.muted,fontFamily:FM}}>{r.vids}</td>
            <td style={{padding:"10px 14px",color:T.muted,fontFamily:FM}}>${r.base.toFixed(2)}</td>
            <td style={{padding:"10px 14px",color:T.acc,fontFamily:FM}}>${r.bonus.toFixed(2)}</td>
            <td style={{padding:"10px 14px",color:T.text,fontWeight:700,fontFamily:FM}}>${r.total.toFixed(2)}</td>
            <td style={{padding:"10px 14px",color:T.muted,fontFamily:FM}}>{r.views.toLocaleString()}</td>
          </tr>)}</tbody>
        </table>
      </div>
    </>}
  </>
}

// ═══════════════════════ CREATOR ═══════════════════════
function Creator({user,onLogout}){
  const [pg,setPg]=useState("home");
  const [camps,setCamps]=useState([]);const [subs,setSubs]=useState([]);const [ld,setLd]=useState(true);

  const load=useCallback(async()=>{const [c,s]=await Promise.all([store.get("campaigns"),store.get("submissions")]);setCamps(c||DEFAULT_CAMPAIGNS);setSubs(s||[]);setLd(false)},[]);
  useEffect(()=>{load()},[load]);

  const my=subs.filter(s=>s.creatorId===user.id);
  const ap=my.filter(s=>s.status==="approved");
  const earn=ap.reduce((a,s)=>a+(s.basePay||5)+(s.bonus||0),0);
  const views=ap.reduce((a,s)=>a+(s.views||0),0);

  const submit=async sub=>{const all=await store.get("submissions")||[];const ns={id:"sub_"+Date.now(),creatorId:user.id,status:"pending",basePay:5,bonus:0,views:0,likes:0,comments:0,shares:0,submittedAt:new Date().toISOString(),...sub};all.push(ns);await store.set("submissions",all);setSubs(all);setPg("mysubs")};

  const nav=[
    {id:"home",label:"Dashboard",short:"Home",ico:"home"},
    {id:"briefs",label:"Briefs",short:"Briefs",ico:"brief"},
    {id:"submit",label:"Submit",short:"Submit",ico:"video"},
    {id:"mysubs",label:"My Videos",short:"Videos",ico:"clip"},
    {id:"guide",label:"Guidelines",short:"Guide",ico:"guide"},
  ];

  if(ld)return <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:F,color:T.muted}}>Loading...</div>;

  return(
    <Shell nav={nav} page={pg} setPage={setPg} onLogout={onLogout} label="Creator" userName={user.displayName} userHandle={user.tiktok||user.instagram}>
      {pg==="home"&&<>
        <h1 style={{fontSize:22,fontWeight:800,color:T.text,marginBottom:4}}>Welcome, {user.displayName}</h1>
        <p style={{fontSize:12,color:T.muted,marginBottom:20}}>Your creator overview</p>
        <div style={{display:"flex",gap:10,marginBottom:22,flexWrap:"wrap"}}><Metric label="Submitted" value={my.length} ico="video" color={T.acc}/><Metric label="Approved" value={ap.length} ico="check" color={T.grn}/><Metric label="Earnings" value={`$${earn}`} ico="dollar" color={T.warn}/><Metric label="Views" value={views.toLocaleString()} ico="chart" color={T.pink}/></div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}><Btn onClick={()=>setPg("briefs")} ico="brief" v="secondary" sz="sm">View Briefs</Btn><Btn onClick={()=>setPg("submit")} ico="plus" sz="sm">Submit Video</Btn></div>
      </>}
      {pg==="briefs"&&<>
        <h1 style={{fontSize:22,fontWeight:800,color:T.text,marginBottom:6}}>Campaign Briefs</h1>
        <p style={{fontSize:12,color:T.muted,marginBottom:18,lineHeight:1.6}}>Pick a brief, create a 15–30s video, include <span style={{color:T.acc,fontWeight:700}}>{REQUIRED_HASHTAG}</span></p>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>{camps.filter(c=>c.status==="active").map(c=><div key={c.id} style={{background:T.card,border:`1px solid ${T.brd}`,borderRadius:14,padding:"16px 20px"}}><h3 style={{fontSize:15,fontWeight:700,color:T.text,marginBottom:6}}>{c.title}</h3><p style={{fontSize:12,color:T.muted,lineHeight:1.6,marginBottom:12}}>{c.description}</p><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:11,color:T.acc,fontWeight:600}}>{c.hashtag}</span><Btn onClick={()=>setPg("submit")} sz="sm" ico="arr">Create</Btn></div></div>)}</div>
      </>}
      {pg==="submit"&&<CSubmit camps={camps} onSubmit={submit}/>}
      {pg==="mysubs"&&<>
        <h1 style={{fontSize:22,fontWeight:800,color:T.text,marginBottom:18}}>My Videos</h1>
        {my.length===0?<Empty ico="video" title="No submissions" desc="Submit your first video!" action={<Btn onClick={()=>setPg("submit")} ico="plus" sz="sm">Submit</Btn>}/>:
        <div style={{display:"flex",flexDirection:"column",gap:8}}>{my.sort((a,b)=>new Date(b.submittedAt)-new Date(a.submittedAt)).map(s=>{const ca=camps.find(c=>c.id===s.campaignId);return <div key={s.id} style={{background:T.card,border:`1px solid ${T.brd}`,borderRadius:14,padding:"14px 18px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8,gap:8}}>
            <div><div style={{fontWeight:600,fontSize:13,color:T.text}}>{ca?.title||"General"}</div><div style={{fontSize:11,color:T.muted,marginTop:2}}>{s.platform} · {new Date(s.submittedAt).toLocaleDateString()}</div></div>
            <Badge color={s.status==="approved"?"grn":s.status==="rejected"?"red":"warn"}>{s.status}</Badge>
          </div>
          <a href={s.videoLink} target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:T.acc,textDecoration:"none",wordBreak:"break-all"}}>{s.videoLink} ↗</a>
          {s.status==="approved"&&<div style={{display:"flex",gap:14,marginTop:10,paddingTop:10,borderTop:`1px solid ${T.brd}`,flexWrap:"wrap"}}>
            <div><span style={{fontSize:9,fontWeight:700,color:T.dim,textTransform:"uppercase"}}>Earned</span><div style={{fontSize:13,fontWeight:700,color:T.acc,fontFamily:FM}}>${(s.basePay||5)+(s.bonus||0)}</div></div>
            <div><span style={{fontSize:9,fontWeight:700,color:T.dim,textTransform:"uppercase"}}>Views</span><div style={{fontSize:13,fontWeight:600,color:T.text,fontFamily:FM}}>{(s.views||0).toLocaleString()}</div></div>
            <div><span style={{fontSize:9,fontWeight:700,color:T.dim,textTransform:"uppercase"}}>Likes</span><div style={{fontSize:13,fontWeight:600,color:T.text,fontFamily:FM}}>{(s.likes||0).toLocaleString()}</div></div>
          </div>}
          {s.status==="rejected"&&s.feedback&&<div style={{marginTop:8,background:T.redS,borderRadius:8,padding:"8px 12px",fontSize:11,color:T.red}}>Feedback: {s.feedback}</div>}
        </div>})}</div>}
      </>}
      {pg==="guide"&&<>
        <h1 style={{fontSize:22,fontWeight:800,color:T.text,marginBottom:18}}>Guidelines</h1>
        <div style={{background:T.card,border:`1px solid ${T.brd}`,borderRadius:14,padding:"20px 22px"}}>
          {[["Video Length","15–30 seconds. Short, punchy, scroll-stopping."],["Format","Vertical (9:16). Shot on your phone — authentic > polished."],["Hashtag",`Include ${REQUIRED_HASHTAG} in every caption.`],["Platform","Post on your own TikTok or Instagram."],["Audio","Clear audio. Trending sounds OK if speech is clear."],["Content","Show Sphere in use — your level, streak, tier. Keep it real."],["Don'ts","No misleading claims. No hate speech. No competitors."]].map(([t,d],i)=><div key={i} style={{padding:"12px 0",borderBottom:i<6?`1px solid ${T.brd}`:"none"}}><div style={{fontSize:13,fontWeight:700,color:T.text,marginBottom:3}}>{t}</div><div style={{fontSize:12,color:T.muted,lineHeight:1.5}}>{d}</div></div>)}
        </div>
        <h3 style={{fontSize:15,fontWeight:700,color:T.text,margin:"20px 0 12px"}}>Pay Structure</h3>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:8}}>
          <div style={{background:T.card,border:`1px solid ${T.brd}`,borderRadius:12,padding:"14px 16px",textAlign:"center"}}><div style={{fontSize:20,fontWeight:800,color:T.acc,fontFamily:FM}}>$5</div><div style={{fontSize:11,fontWeight:600,color:T.muted,marginTop:3}}>Base / video</div></div>
          <div style={{background:T.card,border:`1px solid ${T.brd}`,borderRadius:12,padding:"14px 16px",textAlign:"center"}}><div style={{fontSize:20,fontWeight:800,color:T.warn,fontFamily:FM}}>$2–10</div><div style={{fontSize:11,fontWeight:600,color:T.muted,marginTop:3}}>Perf. bonus</div></div>
          <div style={{background:T.card,border:`1px solid ${T.brd}`,borderRadius:12,padding:"14px 16px",textAlign:"center"}}><div style={{fontSize:20,fontWeight:800,color:T.pink}}>🏆</div><div style={{fontSize:11,fontWeight:600,color:T.muted,marginTop:3}}>Leaderboard</div></div>
        </div>
      </>}
    </Shell>
  );
}

function CSubmit({camps,onSubmit}){
  const [f,setF]=useState({campaignId:camps[0]?.id||"",platform:"tiktok",videoLink:"",description:""});const [ok,setOk]=useState(false);
  const go=()=>{if(!f.videoLink)return;onSubmit(f);setOk(true);setTimeout(()=>setOk(false),3000);setF({campaignId:camps[0]?.id||"",platform:"tiktok",videoLink:"",description:""})};
  return <>
    <h1 style={{fontSize:22,fontWeight:800,color:T.text,marginBottom:6}}>Submit a Video</h1>
    <p style={{fontSize:12,color:T.muted,marginBottom:20,lineHeight:1.6}}>Post on TikTok/IG, paste the link. Include <span style={{color:T.acc,fontWeight:700}}>{REQUIRED_HASHTAG}</span>!</p>
    {ok&&<div style={{background:T.grnS,border:`1px solid ${T.grnSB}`,borderRadius:12,padding:"12px 16px",marginBottom:16,fontSize:12,color:T.grn,fontWeight:700}}>✓ Submitted! We'll review it shortly.</div>}
    <div style={{background:T.card,border:`1px solid ${T.brd}`,borderRadius:14,padding:"20px 22px"}}>
      <Sel label="Campaign" value={f.campaignId} onChange={v=>setF({...f,campaignId:v})} options={camps.filter(c=>c.status==="active").map(c=>({value:c.id,label:c.title}))}/>
      <div style={{marginBottom:14}}><label style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,marginBottom:6,letterSpacing:"0.05em",textTransform:"uppercase"}}>Platform</label>
        <div style={{display:"flex",gap:6}}>{[["tiktok","TikTok"],["instagram","Instagram"]].map(([v,l])=><button key={v} onClick={()=>setF({...f,platform:v})} style={{flex:1,padding:"10px 0",borderRadius:10,border:`1px solid ${f.platform===v?T.acc:T.brd}`,background:f.platform===v?T.accS:"transparent",color:f.platform===v?T.acc:T.muted,fontFamily:F,fontSize:13,fontWeight:700,cursor:"pointer"}}>{l}</button>)}</div>
      </div>
      <Inp label="Video Link" value={f.videoLink} onChange={v=>setF({...f,videoLink:v})} ph="https://www.tiktok.com/@you/video/..." req/>
      <Inp label="Caption" value={f.description} onChange={v=>setF({...f,description:v})} ta ph={`Your caption (include ${REQUIRED_HASHTAG})...`}/>
      {f.description&&!f.description.toLowerCase().includes("#sphereapp")&&<div style={{background:T.warnS,border:`1px solid ${T.warnSB}`,borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:11,color:T.warn,fontWeight:600}}>⚠ Don't forget {REQUIRED_HASHTAG}!</div>}
      <div style={{background:T.input,borderRadius:10,padding:"10px 14px",marginBottom:18,fontSize:11,color:T.dim,lineHeight:1.6}}>By submitting, you grant Sphere the right to use and promote this video. You retain ownership.</div>
      <Btn onClick={go} dis={!f.videoLink} s={{width:"100%",justifyContent:"center"}} sz="lg">Submit Video</Btn>
    </div>
  </>
}

// ═══════════════════════ MAIN ═══════════════════════
export default function App(){
  const [user,setUser]=useState(null);const [ld,setLd]=useState(true);
  useEffect(()=>{(async()=>{const s=await store.get("current_user");if(s)setUser(s);setLd(false)})()},[]);
  const login=async u=>{setUser(u);await store.set("current_user",u)};
  const logout=async()=>{setUser(null);await store.set("current_user",null)};
  if(ld)return <div style={{minHeight:"100vh",background:"#06080f",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:F,color:"#6b7a8d"}}>Loading...</div>;
  if(!user)return <Auth onLogin={login}/>;
  if(user.role==="admin")return <Admin onLogout={logout}/>;
  return <Creator user={user} onLogout={logout}/>;
}