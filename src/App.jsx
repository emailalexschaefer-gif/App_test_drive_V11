import { useState, useEffect, useRef } from "react";

// ─── CELEBRATION AUDIO ────────────────────────────────────────────────────────
var _celebAudio = null;
function getAudio() {
  if (!_celebAudio) {
    _celebAudio = new Audio('/sounds/crowd-cheer.mp3');
    _celebAudio.preload = 'auto';
    console.log('Audio file loaded');
  }
  return _celebAudio;
}
function unlockAudio() {
  var a = getAudio();
  a.play().then(function(){a.pause();a.currentTime=0;}).catch(function(){});
}

// ─── ANALYTICS ──────────────────────────────────────────────────────────────
// Replace G-XXXXXXXXXX with your real GA4 Measurement ID in index.html
function trackEvent(name, params) {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', name, params || {});
    }
  } catch (e) {}
}


const LOGO_SRC = "data:image/webp;base64,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";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  greenDeep:"#0f2d1c", green:"#1a4731", greenMid:"#236040", greenBright:"#2d7a52", greenLight:"#4a9e72",
  goldDark:"#8b6914", gold:"#c9a84c", goldMid:"#d4b060", goldLight:"#e8c96a", goldPale:"#f5e6b8", goldSheen:"#fdf0c8",
  parchment:"#f2e8d0", parchmentMid:"#ede0c4", parchmentDark:"#d9c9a3",
  cream:"#faf6ed", ivory:"#f8f4eb",
  ink:"#1a1a16", inkMid:"#3d3929", inkLight:"#7a7260", inkFaint:"#a89e88", white:"#ffffff",
  eagle:"#fef9c3", eagleText:"#854d0e",
  birdie:"#dcfce7", birdieText:"#14532d",
  par:"#f1f5f9", parText:"#475569",
  bogey:"#fee2e2", bogeyText:"#991b1b",
  double:"#fecaca", doubleText:"#7f1d1d",
  amber:"#d97706",
};
const T = {
  display:{ fontFamily:"'Playfair Display', Georgia, serif" },
  body:   { fontFamily:"'Lato', 'Helvetica Neue', sans-serif" },
};

function InjectCSS() {
  useEffect(() => {
    if (document.getElementById("tiu-css")) return;
    const el = document.createElement("style");
    el.id = "tiu-css";
    el.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=Lato:wght@300;400;600;700&display=swap');
      *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
      ::-webkit-scrollbar{width:0;}
      @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
      @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      @keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}
      @keyframes glowPulse{0%,100%{box-shadow:0 0 8px rgba(201,168,76,.3)}50%{box-shadow:0 0 22px rgba(201,168,76,.7)}}
      @keyframes rankUp{from{background:rgba(22,163,74,.22)}to{background:transparent}}
      @keyframes rankDown{from{background:rgba(220,38,38,.12)}to{background:transparent}}
      @keyframes trophyBounce{0%,100%{transform:scale(1)}40%{transform:scale(1.06)}70%{transform:scale(0.97)}}
      @keyframes goldGlow{0%,100%{text-shadow:0 2px 18px rgba(201,168,76,.5)}50%{text-shadow:0 2px 40px rgba(201,168,76,1),0 0 60px rgba(201,168,76,.5)}}
      @keyframes confettiFall{0%{opacity:1;transform:translateY(0) rotate(0deg) scale(1)}80%{opacity:.7}100%{opacity:0;transform:translateY(500px) rotate(540deg) scale(.5)}}
      @keyframes toastSlide{from{opacity:0;transform:translateX(-50%) translateY(-10px) scale(.94)}to{opacity:1;transform:translateX(-50%) translateY(0) scale(1)}}
      @keyframes drivePulse{0%{box-shadow:0 0 0 0 rgba(22,163,74,.8)}70%{box-shadow:0 0 0 14px rgba(22,163,74,0)}100%{box-shadow:0 0 0 0 rgba(22,163,74,0)}}
      @keyframes leaderPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.02)}}
      .btn-press:active{transform:scale(0.96)!important;}
      .hole-tap:active{transform:scale(0.90)!important;}
      .trophy-bounce{animation:trophyBounce 1.6s ease-in-out infinite;}
      .gold-glow-text{animation:goldGlow 2.4s ease-in-out infinite;}
      .winner-glow{animation:winnerPulse 2.4s ease-out 0.3s 1;}
      @keyframes winnerPulse{0%{box-shadow:0 0 0 rgba(201,168,76,0);}40%{box-shadow:0 0 38px rgba(201,168,76,.55),0 0 80px rgba(201,168,76,.2);}100%{box-shadow:0 0 12px rgba(201,168,76,.15);}}
      .leader-row{animation:leaderPulse 3s ease-in-out infinite;}
    `;
    document.head.appendChild(el);
  }, []);
  return null;
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const mockTrip = {
  name:"King Island Classic", location:"King Island, Tasmania",
  course:"Cape Wickham Links", courseDetails:"Par 72 · Rating 76.1 · Slope 148",
  format:"Stableford", rounds:2,
  players:[
    {id:1,name:"Matty Jones", initials:"MJ",hcp:14,color:"#1e6b45",group:1},
    {id:2,name:"Dave Walsh",  initials:"DW",hcp:8, color:"#9b1c1c",group:1},
    {id:3,name:"Sarah Chen",  initials:"SC",hcp:22,color:"#6b21a8",group:1},
    {id:4,name:"Pete Dunbar", initials:"PD",hcp:18,color:"#1d4ed8",group:1},
    {id:5,name:"Tom Rafferty",initials:"TR",hcp:11,color:"#b45309",group:2},
    {id:6,name:"Liam O'Brien",initials:"LO",hcp:6, color:"#0e7490",group:2},
    {id:7,name:"Bec Morrison",initials:"BM",hcp:24,color:"#7c3aed",group:2},
    {id:8,name:"Jack Nguyen", initials:"JN",hcp:16,color:"#374151",group:2},
  ],
  groups:[
    {id:1,label:"Group 1",teeTime:"7:00 AM"},
    {id:2,label:"Group 2",teeTime:"7:10 AM"},
  ],
  sideComps:{prosApproach:"H12 · Par 4",longestDrive:"H15 · Par 5",nearestPin:"H17 · Par 3"},
  joinCode:"KING7X",
};

const holePars = [4,4,3,4,5,3,4,4,3, 4,3,4,5,4,5,4,3,4];
const holeStrokeIndex = [3,9,15,5,11,17,1,13,7, 17,13,16,7,11,6,1,10,5];

const mockScores = {
  1:[4,5,3,5,5,3,5,5,4, 4,4,4,6,5,5,5,3,5],  // Matty hcp14 → 40pts
  2:[5,4,3,5,5,3,5,4,4, 4,3,4,6,5,5,5,3,5],  // Dave  hcp8  → 36pts
  3:[5,5,4,5,6,4,5,5,4, 5,3,5,6,5,6,5,4,5],  // Sarah hcp22 → 40pts
  4:[5,5,4,5,6,4,5,4,4, 5,4,5,6,5,6,5,4,5],  // Pete  hcp18 → 37pts
  5:[5,5,3,5,6,3,5,4,4, 4,3,4,6,5,6,5,3,5],  // Tom   hcp11 → 37pts
  6:[5,4,3,5,5,3,5,4,3, 4,3,4,5,5,5,5,3,5],  // Liam  hcp6  → 36pts
  7:[6,5,4,6,6,4,5,5,4, 5,3,5,6,5,6,6,4,6],  // Bec   hcp24 → 39pts
  8:[5,5,4,5,6,3,5,5,4, 4,4,5,6,5,6,5,3,5],  // Jack  hcp16 → 37pts
};

// Simulated back-9 scores for players 2–8 (used in both live and final leaderboards)
const otherBack9={2:[5,3,4,6,4,6,5,3,6],3:[5,3,5,5,4,5,6,3,5],4:[5,4,5,6,5,6,5,4,5],5:[4,4,4,6,4,6,5,4,5],6:[4,3,4,6,4,6,5,4,5],7:[4,3,5,5,5,7,6,3,6],8:[4,3,5,5,5,6,5,3,5]};

function getStrokesReceived(hcp, si) {
  return Math.floor(hcp/18) + (si <= hcp%18 ? 1 : 0);
}
function calcPts(gross, par, hcp, holeNum) {
  const si = holeStrokeIndex[holeNum-1] ?? holeNum;
  const net = gross - getStrokesReceived(hcp, si);
  return Math.max(0, 2-(net-par));
}
function playerPts(id, scores) {
  const p = mockTrip.players.find(x=>x.id===id);
  return scores.map((s,i)=>calcPts(s, holePars[i], p.hcp, i+1));
}
function scoreColors(pts) {
  if (pts>=4) return {bg:C.eagle, tc:C.eagleText};
  if (pts===3) return {bg:C.birdie,tc:C.birdieText};
  if (pts===2) return {bg:C.par,   tc:C.parText};
  if (pts===1) return {bg:C.bogey, tc:C.bogeyText};
  return {bg:C.double,tc:C.doubleText};
}

// ─── ATOMS ────────────────────────────────────────────────────────────────────
function Card({children,style={},noPad}) {
  return <div style={{background:C.ivory,borderRadius:14,border:`1.5px solid ${C.parchmentDark}`,boxShadow:"0 2px 16px rgba(15,45,28,0.09),inset 0 1px 0 rgba(255,255,255,0.75)",overflow:"hidden",padding:noPad?0:undefined,...style}}>{children}</div>;
}
function GoldCard({children,style={}}) {
  return <div style={{background:`linear-gradient(160deg,#1e5c38 0%,${C.green} 60%,${C.greenDeep} 100%)`,borderRadius:16,border:`2px solid ${C.gold}`,boxShadow:"0 4px 24px rgba(15,45,28,0.4)",overflow:"hidden",...style}}>{children}</div>;
}
function Avatar({player,size=38}) {
  return <div style={{width:size,height:size,borderRadius:"50%",background:player.color,border:"2px solid rgba(255,255,255,0.22)",display:"flex",alignItems:"center",justifyContent:"center",color:C.white,fontWeight:700,fontSize:Math.round(size*.34),flexShrink:0,boxShadow:"0 2px 8px rgba(0,0,0,0.22)",...T.body}}>{player.initials}</div>;
}
function GoldAvatar({initials,size=44}) {
  return <div style={{width:size,height:size,borderRadius:"50%",background:`radial-gradient(circle at 38% 35%,${C.goldLight},${C.gold})`,border:`2.5px solid ${C.goldSheen}`,display:"flex",alignItems:"center",justifyContent:"center",color:C.greenDeep,fontWeight:800,fontSize:Math.round(size*.32),flexShrink:0,boxShadow:`0 3px 12px rgba(0,0,0,0.35)`,...T.body}}>{initials}</div>;
}
function TIULogo({size="hero"}) {
  if (size==="hero") return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
      <div style={{width:164,height:164,borderRadius:"50%",background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 24px rgba(0,0,0,.45),0 0 0 3px rgba(201,168,76,.4)",padding:10}}>
        <img src={LOGO_SRC} alt="Teein It Up" style={{width:"100%",height:"100%",objectFit:"contain"}}/>
      </div>
    </div>
  );
  if (size==="header") return (
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <div style={{width:36,height:36,borderRadius:"50%",background:"#fff",border:`2px solid ${C.gold}`,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",padding:3}}>
        <img src={LOGO_SRC} alt="" style={{width:"100%",height:"100%",objectFit:"contain"}}/>
      </div>
      <div style={{lineHeight:1}}>
        <div style={{...T.display,color:C.goldLight,fontSize:14,fontWeight:800,letterSpacing:.3}}>Teein' It Up</div>
        <div style={{...T.body,color:C.goldPale,fontSize:9,fontWeight:600,letterSpacing:1.5,textTransform:"uppercase",opacity:.65,marginTop:1}}>Scoring App</div>
      </div>
    </div>
  );
  return null;
}
function Header({subtitle}) {
  const p = mockTrip.players[0];
  return (
    <div style={{background:`linear-gradient(135deg,${C.greenDeep} 0%,${C.green} 100%)`,padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`2px solid ${C.gold}`,boxShadow:"0 2px 12px rgba(0,0,0,0.3)",flexShrink:0}}>
      <TIULogo size="header"/>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <div style={{textAlign:"right"}}>
          <div style={{...T.body,color:C.white,fontWeight:700,fontSize:12.5}}>{p.name}</div>
          <div style={{...T.body,color:C.goldPale,fontSize:10.5,marginTop:1}}>{subtitle||mockTrip.name}</div>
        </div>
        <GoldAvatar initials={p.initials} size={36}/>
        <div style={{background:"rgba(201,168,76,.18)",border:`1px solid ${C.gold}`,borderRadius:16,padding:"3px 9px",...T.body,color:C.goldLight,fontSize:10,fontWeight:700,letterSpacing:.5}}>PASS</div>
      </div>
    </div>
  );
}
function ProgressBar({step,total=5}) {
  return (
    <div style={{display:"flex",gap:3,padding:"9px 16px 6px",background:C.cream,flexShrink:0}}>
      {Array.from({length:total}).map((_,i)=>(
        <div key={i} style={{flex:1,height:3,borderRadius:2,background:i<step?`linear-gradient(90deg,${C.gold},${C.goldLight})`:C.parchmentDark,boxShadow:i<step?"0 0 6px rgba(201,168,76,.45)":"none",transition:"background .4s"}}/>
      ))}
    </div>
  );
}
function SLabel({children,style={}}) {
  return <div style={{...T.body,fontSize:10.5,fontWeight:700,letterSpacing:1.1,color:C.inkLight,textTransform:"uppercase",marginBottom:7,...style}}>{children}</div>;
}
function GreenBtn({label,onClick,disabled}) {
  return <button className="btn-press" onClick={onClick} disabled={disabled} style={{width:"100%",padding:"15px 20px",background:disabled?"#b0b0a0":`linear-gradient(160deg,${C.greenBright} 0%,${C.green} 100%)`,color:C.white,border:"none",borderRadius:12,...T.body,fontWeight:700,fontSize:16,letterSpacing:.7,cursor:disabled?"not-allowed":"pointer",boxShadow:disabled?"none":"0 4px 18px rgba(26,71,49,.4)",transition:"transform .12s"}}>{label}</button>;
}
function GoldBtn({label,onClick,style={}}) {
  return <button className="btn-press" onClick={onClick} style={{padding:"15px 24px",background:`linear-gradient(135deg,${C.gold} 0%,${C.goldLight} 50%,${C.gold} 100%)`,color:C.greenDeep,border:"none",borderRadius:12,...T.body,fontWeight:800,fontSize:16,letterSpacing:1,cursor:"pointer",boxShadow:`0 5px 20px rgba(201,168,76,.5)`,transition:"transform .12s",...style}}>{label}</button>;
}
function NavBar({active="home"}) {
  const items=[{k:"home",ic:"🏠",l:"Home"},{k:"leaderboard",ic:"🏆",l:"Leaderboard"},{k:"schedule",ic:"📅",l:"Schedule"},{k:"sidegames",ic:"🎯",l:"Side Games"},{k:"courses",ic:"$",l:"Skins",icStyle:{color:"#c9a84c",fontWeight:700,fontFamily:"serif"}},{k:"chat",ic:"💬",l:"Chat"}];
  return (
    <div style={{background:`linear-gradient(180deg,${C.greenDeep} 0%,#09180d 100%)`,borderTop:`2px solid ${C.gold}`,display:"flex",padding:"5px 0 10px",flexShrink:0,boxShadow:"0 -2px 12px rgba(0,0,0,0.3)"}}>
      {items.map(it=>{
        const on=it.k===active;
        return (
          <div key={it.k} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,padding:"4px 0",cursor:"pointer"}}>
            <span style={{fontSize:19,opacity:on?1:.38,...(it.icStyle||{})}}>{it.ic}</span>
            <span style={{...T.body,fontSize:9,fontWeight:on?700:400,color:on?C.goldLight:"rgba(245,230,184,0.38)",letterSpacing:.3}}>{it.l}</span>
            {on&&<div style={{width:16,height:2,borderRadius:1,background:C.gold,marginTop:-1}}/>}
          </div>
        );
      })}
    </div>
  );
}
function Divider() { return <div style={{height:1,background:C.parchmentMid,margin:"0 14px"}}/>; }
function GoldRule() { return <div style={{height:1,margin:"0 20px",background:`linear-gradient(90deg,transparent,${C.gold},transparent)`}}/>; }

// ─── SHARE LOGIC ─────────────────────────────────────────────────────────────────
function buildShareMessage(winnerName, winnerScore, tripName) {
  return [
    "🏆 " + tripName + " Results",
    "",
    winnerName + " wins with " + winnerScore + " points 🏆",
    "",
    "We just ran this entire golf trip on this app — live leaderboard, side comps and all.",
    "",
    "Try it:",
    "",
    "Try it yourself:",
    "https://app-test-drive-v12.vercel.app/"
  ].join("\n");
}

function doShare(msg, onCopied) {
  if (typeof navigator === "undefined") { if(onCopied) onCopied(); return; }
  if (navigator.share) {
    navigator.share({ title: "Teein' It Up Demo", text: msg })
      .then(function(){ if(onCopied) onCopied(); })
      .catch(function(){
        if (navigator.clipboard) {
          navigator.clipboard.writeText(msg).then(function(){ if(onCopied) onCopied(); }).catch(function(){});
        }
      });
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(msg)
      .then(function(){ if(onCopied) onCopied(); })
      .catch(function(){ try{alert(msg);}catch(_){} if(onCopied) onCopied(); });
  } else {
    try{alert(msg);}catch(_){}
    if(onCopied) onCopied();
  }
}

// ─── CONFETTI ─────────────────────────────────────────────────────────────────
function Confetti() {
  const pieces = Array.from({length:30},(_,i)=>({
    id:i, x:5+Math.random()*90,
    delay:Math.random()*1.2, dur:3.5+Math.random()*1.5,
    size:4+Math.random()*5,
    color:i%5===0?"#e8c96a":i%5===1?"#4ade80":i%5===2?"#c9a84c":i%5===3?"#f0d060":"#86efac",
    rotate:Math.random()*360,
  }));
  return (
    <div style={{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden",zIndex:0}}>
      {pieces.map(p=>(
        <div key={p.id} style={{position:"absolute",left:`${p.x}%`,top:"-12px",width:p.size,height:p.size*1.7,background:p.color,borderRadius:2,opacity:0,transform:`rotate(${p.rotate}deg)`,animation:`confettiFall ${p.dur}s ${p.delay}s ease-in forwards`}}/>
      ))}
    </div>
  );
}

// ─── SCORE COUNTER ────────────────────────────────────────────────────────────
function ScoreCounter({target}) {
  const [count,setCount] = useState(0);
  useEffect(()=>{
    const start=Date.now(), dur=820;
    const tick=setInterval(()=>{
      const p=Math.min(1,(Date.now()-start)/dur);
      const e=1-Math.pow(1-p,3);
      setCount(Math.round(e*target));
      if(p>=1) clearInterval(tick);
    },16);
    return ()=>clearInterval(tick);
  },[target]);
  return <>{count}</>;
}


// ─── LEAD CAPTURE ─────────────────────────────────────────────────────────────
// STEP 1: Paste your Google Apps Script Web App URL below.
// How: Extensions -> Apps Script -> Deploy -> Web app -> Execute as: Me -> Anyone -> Copy URL
var GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbymtBDowtk3OAbJhEE8OOavIZKp0R058TMtPeZds-S-rdZ_rQXXXb0ePuVXLjumcxS2/exec";

function LeadModal({onClose}) {
  var [firstName, setFirstName] = useState("");
  var [email, setEmail] = useState("");
  var [role, setRole] = useState("");
  var [tripsPerYear, setTripsPerYear] = useState("");
  var [groupSize, setGroupSize] = useState("");
  var [nextTrip, setNextTrip] = useState("");
  var [showOpt, setShowOpt] = useState(false);
  var [errors, setErrors] = useState({});
  var [loading, setLoading] = useState(false);
  var [success, setSuccess] = useState(false);
  var [submitErr, setSubmitErr] = useState("");

  useEffect(function() {
    document.body.style.overflow = "hidden";
    trackEvent("early_access_opened");
    return function() { document.body.style.overflow = ""; };
  }, []);

  function validate() {
    var e = {};
    if (!firstName.trim()) e.firstName = "Required";
    if (!email.trim()) e.email = "Required";
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) e.email = "Enter a valid email";
    if (!role) e.role = "Select your role";
    return e;
  }

  function pickRole(val) {
    if (val === role) return;
    setRole(val);
    if (val === "Player") trackEvent("player_selected");
    else if (val === "Organiser") trackEvent("organiser_selected");
    else if (val === "Both") { trackEvent("player_selected"); trackEvent("organiser_selected"); }
  }

  async function handleSubmit(ev) {
    ev.stopPropagation();
    var errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true); setErrors({}); setSubmitErr("");
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          firstName: firstName || "",
          email: email || "",
          role: role || "",
          tripsPerYear: tripsPerYear || "",
          groupSize: groupSize || "",
          nextTrip: nextTrip || "",
          createdAt: new Date().toISOString()
        })
      });
      trackEvent("early_access_submitted", { role: role, tripsPerYear: tripsPerYear, groupSize: groupSize });
      setSuccess(true);
      setTimeout(function() { onClose(); }, 5000);
    } catch(err) {
      trackEvent("early_access_failed");
      setSubmitErr("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  var inp = { width:"100%", padding:"10px 13px", background:"rgba(255,255,255,.07)", border:"1px solid rgba(201,168,76,.28)", borderRadius:9, color:"rgba(245,230,184,.92)", fontSize:14, outline:"none", boxSizing:"border-box" };
  var lbl = { ...T.body, fontSize:11.5, color:"rgba(201,168,76,.72)", fontWeight:700, letterSpacing:.4, marginBottom:4, display:"block" };
  var errStyle = { ...T.body, fontSize:11, color:"#f87171", marginTop:3 };
  var sel = { ...inp, appearance:"none", WebkitAppearance:"none", cursor:"pointer" };

  return (
    <div onClick={function(e){e.stopPropagation();}} style={{position:"fixed",inset:0,zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(0,0,0,.74)"}}/>
      <div style={{position:"relative",zIndex:1,background:"rgba(6,22,12,.98)",border:"1px solid rgba(201,168,76,.3)",borderRadius:"18px 18px 0 0",padding:"22px 20px 28px",width:"100%",maxWidth:440,maxHeight:"92vh",overflowY:"auto",boxShadow:"0 -8px 40px rgba(0,0,0,.65)"}}>
        <button onClick={onClose} style={{position:"absolute",top:14,right:16,background:"none",border:"none",color:"rgba(245,230,184,.45)",fontSize:20,cursor:"pointer",lineHeight:1,padding:4,fontWeight:700}}>x</button>

        {success ? (
          <div style={{textAlign:"center",padding:"28px 0"}}>
            <div style={{fontSize:36,marginBottom:10}}>⛳</div>
            <div style={{...T.display,color:"rgba(201,168,76,.9)",fontSize:18,fontWeight:800,marginBottom:8}}>You are in.</div>
            <div style={{...T.body,color:"rgba(245,230,184,.72)",fontSize:13.5,lineHeight:1.7}}>Thanks -- we will keep you updated as Teein It Up launches.</div>
          </div>
        ) : (
          <div>
            <div style={{...T.display,color:"rgba(201,168,76,.9)",fontSize:18,fontWeight:900,marginBottom:5,paddingRight:28}}>Join Early Access</div>
            <div style={{...T.body,color:"rgba(245,230,184,.5)",fontSize:12.5,lineHeight:1.6,marginBottom:18}}>Don't miss out on securing your early access spot.</div>

            <div style={{marginBottom:13}}>
              <label style={lbl}>First Name</label>
              <input value={firstName} onChange={function(e){setFirstName(e.target.value);}} placeholder="Your first name" style={inp}/>
              {errors.firstName && <div style={errStyle}>{errors.firstName}</div>}
            </div>

            <div style={{marginBottom:13}}>
              <label style={lbl}>Email Address</label>
              <input type="email" value={email} onChange={function(e){setEmail(e.target.value);}} placeholder="you@example.com" style={inp}/>
              {errors.email && <div style={errStyle}>{errors.email}</div>}
            </div>

            <div style={{marginBottom:18}}>
              <label style={lbl}>I am:</label>
              <div style={{display:"flex",gap:8}}>
                {["Player","Organiser","Both"].map(function(v){return(
                  <button key={v} onClick={function(){pickRole(v);}} style={{flex:1,padding:"10px 0",background:role===v?"rgba(201,168,76,.22)":"rgba(255,255,255,.05)",border:"1px solid "+(role===v?"rgba(201,168,76,.6)":"rgba(255,255,255,.14)"),borderRadius:9,...T.body,fontSize:13,fontWeight:role===v?700:500,color:role===v?"rgba(201,168,76,.95)":"rgba(245,230,184,.7)",cursor:"pointer"}}>{v}</button>
                );})}
              </div>
              {errors.role && <div style={errStyle}>{errors.role}</div>}
            </div>

            <div style={{marginBottom:18,border:"1px solid rgba(201,168,76,.16)",borderRadius:10,overflow:"hidden"}}>
              <div onClick={function(){setShowOpt(function(v){return !v;});}} style={{padding:"10px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",background:"rgba(255,255,255,.03)"}}>
                <span style={{...T.body,fontSize:12.5,color:"rgba(201,168,76,.58)",fontWeight:600}}>Optional trip details</span>
                <span style={{fontSize:11,color:"rgba(201,168,76,.45)",transform:showOpt?"rotate(180deg)":"rotate(0deg)",transition:"transform .2s"}}>▼</span>
              </div>
              {showOpt && (
                <div style={{padding:"14px 14px 8px",borderTop:"1px solid rgba(201,168,76,.1)"}}>
                  <div style={{marginBottom:12}}>
                    <label style={lbl}>Golf Trips Per Year</label>
                    <select value={tripsPerYear} onChange={function(e){setTripsPerYear(e.target.value);}} style={sel}>
                      <option value="">Select...</option>
                      <option value="1-2">1-2</option>
                      <option value="3-5">3-5</option>
                      <option value="6+">6+</option>
                    </select>
                  </div>
                  <div style={{marginBottom:12}}>
                    <label style={lbl}>Typical Group Size</label>
                    <select value={groupSize} onChange={function(e){setGroupSize(e.target.value);}} style={sel}>
                      <option value="">Select...</option>
                      <option value="Under 8">Under 8</option>
                      <option value="8-16">8-16</option>
                      <option value="17-32">17-32</option>
                      <option value="32+">32+</option>
                    </select>
                  </div>
                  <div style={{marginBottom:6}}>
                    <label style={lbl}>Next Trip <span style={{opacity:.4}}>(optional)</span></label>
                    <input value={nextTrip} onChange={function(e){setNextTrip(e.target.value);}} placeholder="e.g. June, September, King Island 2026" style={inp}/>
                  </div>
                </div>
              )}
            </div>

            {submitErr && <div style={{...T.body,fontSize:12,color:"#f87171",marginBottom:10,textAlign:"center"}}>{submitErr}</div>}
            <button onClick={handleSubmit} disabled={loading} style={{width:"100%",padding:"14px 0",background:loading?"rgba(201,168,76,.35)":"linear-gradient(135deg,#b8892a 0%,#f0d060 45%,#c9952a 100%)",border:"none",borderRadius:12,...T.body,fontSize:15,fontWeight:900,color:C.greenDeep,cursor:loading?"not-allowed":"pointer",letterSpacing:.3,boxShadow:"0 4px 18px rgba(201,168,76,.38)",marginBottom:8}}>
              {loading ? "Submitting..." : "Join Early Access →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


// ─── WINNER OVERLAY ───────────────────────────────────────────────────────────
function WinnerOverlay({winner,sideW,onClose,finalBoard}) {
  const [vis,setVis] = useState(false);
  const [shareToast,setShareToast] = useState(false);
  const [showSharePanel,setShowSharePanel] = useState(false);
  const [showLeadModal,setShowLeadModal] = useState(false);
  function shareText(msg){doShare(msg,function(){setShareToast(true);setShowSharePanel(false);setTimeout(function(){setShareToast(false);},2800);});setShowSharePanel(false);}
  const MSG_DEMO="Here's the golf trip scoring app Teein It Up.\n\nLive leaderboards, side comps and final results all handled automatically without the admin chaos.\n\nTry the demo Test Drive here:\nhttps://app-test-drive-v12.vercel.app/";
  const MSG_GROUP="Here's the golf scoring app we'll be using for the trip.\n\nLive scoring, leaderboard updates, side comps and final results are all handled automatically.\n\nCheck out how it works before the trip:\n\nhttps://app-test-drive-v12.vercel.app/";
  function buildOrgMsg(){var m="Thought you'd like this - it's an easy to use golf trip scoring app called Teein It Up.\n\nLive scoring, automatic leaderboard updates, side comps and final results all handled automatically.\n\nCould be perfect for your next golf trip.\n\nTry the demo Test Drive:\nhttps://app-test-drive-v12.vercel.app/";return m;}
  function buildResults(){var top=(finalBoard&&finalBoard.length>0?finalBoard:winner?[winner]:[]).slice(0,3);var m="🏆 Teein' It Up Demo Results\n\n";top.forEach(function(p,i){m+=(i+1)+". "+p.name+" — "+p.total+" pts\n";});m+="\nLive leaderboard, side comps and final results all handled automatically.\n\nCould be perfect for your next golf trip.\n\nTry the demo:\nhttps://app-test-drive-v12.vercel.app/";return m;}
  const SHARE_OPTIONS=[
    {label:"Share with another organiser",msg:buildOrgMsg()},
    {label:"Share with your players",msg:MSG_GROUP},
  ];
  var overlayRef=useRef(null);
  const [soundOn,setSoundOn]=useState(true);
  const hasPlayedCelebration=useRef(false);
  const audioRef=useRef(null);

  // Pre-load audio on mount so it is ready instantly
  useEffect(function(){
    try{
      var a=new Audio("/sounds/crowd-cheer.wav");
      a.preload="auto";
      a.volume=0.55;
      a.addEventListener("canplaythrough",function(){console.log("Celebration audio file loaded");});
      a.addEventListener("error",function(e){console.log("Celebration audio load error:",e);});
      audioRef.current=a;
    }catch(e){console.log("Audio init error:",e);}
  },[]);

  useEffect(()=>{ const t=setTimeout(()=>setVis(true),60); return ()=>clearTimeout(t); },[]);
  useEffect(()=>{ if(overlayRef.current) overlayRef.current.scrollTop=0; },[]);
  useEffect(()=>{ trackEvent("results_screen_viewed"); },[]);

  // Play celebration when overlay becomes visible
  useEffect(function(){
    if(vis&&soundOn&&!hasPlayedCelebration.current){
      hasPlayedCelebration.current=true;
      console.log("Attempting celebration sound");
      var audio=audioRef.current;
      if(audio){
        audio.currentTime=0;
        var p=audio.play();
        if(p&&typeof p.then==="function"){
          p.then(function(){console.log("Celebration sound played");}).catch(function(err){
            console.log("Celebration sound failed:",err);
          });
        }
      } else {
        // Fallback: create new instance
        try{
          var fb=new Audio("/sounds/crowd-cheer.wav");
          fb.volume=0.55;
          fb.play().then(function(){console.log("Celebration sound played (fallback)");}).catch(function(err){console.log("Celebration sound failed:",err);});
        }catch(e){console.log("Celebration audio exception:",e);}
      }
    }
  },[vis,soundOn]);

  function playCelebrationManual(){
    console.log("Manual celebration triggered");
    try{
      var a=new Audio("/sounds/crowd-cheer.wav");
      a.volume=0.7;
      a.play().then(function(){console.log("Manual play: success");}).catch(function(e){console.log("Manual play failed:",e);});
    }catch(e){console.log("Manual play exception:",e);}
  }
  return (
    <div ref={overlayRef} style={{position:"fixed",inset:0,zIndex:50,background:"rgba(4,14,8,0.96)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-start",animation:"fadeIn .3s",overflowY:"auto"}}>
      <Confetti/>
      <div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:280,height:280,borderRadius:"50%",pointerEvents:"none",background:"radial-gradient(circle,rgba(201,168,76,.18) 0%,transparent 68%)"}}/>
      <div style={{position:"relative",zIndex:1,textAlign:"center",padding:"16px 24px 20px",width:"100%",maxWidth:390}}>

        {/* Sound toggle */}
        <div style={{position:"absolute",top:14,right:16,opacity:vis?1:0,transition:"opacity .5s .5s"}}>
          <div style={{display:"flex",gap:6}}>
            <button onClick={(e)=>{e.stopPropagation();try{var a=getAudio();a.currentTime=0;a.volume=0.6;a.play().catch(function(err){console.log("Test play failed:",err);});}catch(x){}}} style={{background:"rgba(255,255,255,.07)",border:"1px solid rgba(201,168,76,.2)",borderRadius:8,padding:"5px 9px",cursor:"pointer",...T.body,fontSize:11,color:"rgba(245,230,184,.5)"}}>&#9654;</button>
            <button onClick={(e)=>{e.stopPropagation();setSoundOn(function(v){return !v;});}} style={{background:"rgba(255,255,255,.07)",border:"1px solid rgba(201,168,76,.2)",borderRadius:8,padding:"5px 9px",cursor:"pointer",...T.body,fontSize:11,color:"rgba(245,230,184,.55)"}}>{soundOn?"🔊":"🔇"}</button>
            <button onClick={(e)=>{e.stopPropagation();playCelebrationManual();}} style={{background:"rgba(255,255,255,.07)",border:"1px solid rgba(201,168,76,.2)",borderRadius:8,padding:"5px 9px",cursor:"pointer",...T.body,fontSize:10,color:"rgba(245,230,184,.45)"}}>▶</button>
          </div>
        </div>
      {/* Label */}
        <div style={{...T.body,color:C.goldMid,fontSize:10,fontWeight:700,letterSpacing:3,textTransform:"uppercase",marginBottom:6,opacity:vis?1:0,transition:"opacity .5s .1s"}}>Round 1 Complete</div>

        {/* Trophy */}
        <div className="trophy-bounce" style={{fontSize:42,marginBottom:4,display:"inline-block",opacity:vis?1:0,transition:"opacity .5s .18s",filter:"drop-shadow(0 3px 14px rgba(201,168,76,.55))"}}>🏆</div>

        {/* CONGRATULATIONS */}
        <div className={vis?"gold-glow-text":""} style={{...T.display,color:C.goldLight,fontSize:28,fontWeight:900,letterSpacing:.2,marginBottom:4,lineHeight:1.1,opacity:vis?1:0,transition:"opacity .6s .22s"}}>CONGRATULATIONS</div>

        {/* Winner name + tagline */}
        <div style={{opacity:vis?1:0,transition:"opacity .6s .3s",marginBottom:10}}>
          <div style={{...T.display,color:"#fff",fontSize:24,fontWeight:900,lineHeight:1.2}}>{winner.name}</div>
          <div style={{...T.body,color:"rgba(245,230,184,.5)",fontSize:12,marginTop:2}}>You've won the trip.</div>
        </div>

        {/* Score pill */}
        <div className="winner-glow" style={{display:"inline-flex",alignItems:"center",gap:8,background:"linear-gradient(135deg,#b8892a 0%,#f0d060 45%,#c9952a 100%)",borderRadius:28,padding:"9px 22px",marginBottom:12,boxShadow:"0 6px 22px rgba(201,168,76,.5)",opacity:vis?1:0,transition:"opacity .5s .38s"}}>
          <span style={{...T.display,color:C.greenDeep,fontSize:26,fontWeight:900}}>{vis?<ScoreCounter target={winner.total}/>:0}</span>
          <span style={{...T.body,color:C.greenDeep,fontSize:12,fontWeight:700}}>Stableford pts</span>
        </div>

        {/* Compact leaderboard snapshot */}
        {finalBoard&&finalBoard.length>0&&(
          <div style={{background:"rgba(8,28,16,.92)",border:"1px solid rgba(201,168,76,.22)",borderRadius:14,borderBottomLeftRadius:0,borderBottomRightRadius:0,padding:"20px 22px 16px",marginBottom:0,opacity:vis?1:0,transition:"opacity .5s .56s"}}>
            <div style={{...T.display,fontSize:12.5,fontWeight:800,color:"rgba(201,168,76,.9)",letterSpacing:1.2,textTransform:"uppercase",marginBottom:16,textAlign:"center"}}>Final Leaderboard Snapshot</div>
            {finalBoard.slice(0,3).map(function(p,ri){
              var trophies=["\u{1F947}","\u{1F948}","\u{1F949}"];
              var lbls=["1st","2nd","3rd"];
              return(
              <div key={p.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:13,paddingBottom:13,borderBottom:ri<2?"1px solid rgba(255,255,255,.08)":"none"}}>
                <span style={{fontSize:20,flexShrink:0,width:28,textAlign:"center"}}>{trophies[ri]}</span>
                <span style={{...T.body,fontSize:10,color:ri===0?"rgba(201,168,76,.7)":"rgba(245,230,184,.35)",width:26,flexShrink:0,fontWeight:600}}>{lbls[ri]}</span>
                <span style={{...T.body,fontSize:16,flex:1,color:p.id===1?"#f0d060":"rgba(245,230,184,.92)",fontWeight:p.id===1?900:700}}>{p.name}</span>
                <span style={{...T.body,fontSize:15,fontWeight:700,color:p.id===1?"#f0d060":"rgba(255,255,255,.65)",flexShrink:0}}>{p.total}<span style={{...T.body,fontSize:10,opacity:.6}}> pts</span></span>
              </div>
            );})
            }
          </div>
        )}
        {/* View Full Leaderboard - secondary ghost */}
        <button onClick={(e)=>{e.stopPropagation();trackEvent("leaderboard_viewed");onClose();}} style={{width:"100%",background:"rgba(12,42,24,.85)",border:"1px solid rgba(201,168,76,.22)",borderTop:"none",borderRadius:0,borderBottomLeftRadius:14,borderBottomRightRadius:14,padding:"12px 0",...T.body,fontSize:13.5,fontWeight:700,color:"rgba(245,230,184,.82)",cursor:"pointer",letterSpacing:.2,marginBottom:24,opacity:vis?1:0,transition:"opacity .5s .62s"}}>View Full Leaderboard →</button>
        {/* Side comp card */}
        <div style={{background:"rgba(8,28,16,.92)",border:"1px solid rgba(201,168,76,.25)",borderRadius:12,padding:"14px 16px",marginBottom:16,textAlign:"left",opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(10px)",transition:"opacity .5s .5s,transform .5s .5s"}}>
          <div style={{...T.body,fontSize:11.5,fontWeight:800,color:C.goldMid,letterSpacing:1.1,textTransform:"uppercase",marginBottom:10}}>Side Comp Winners</div>
          {sideW.map((c,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,paddingBottom:i<2?7:0,marginBottom:i<2?7:0,borderBottom:i<2?"1px solid rgba(255,255,255,.07)":"none"}}>
              <span style={{fontSize:15,flexShrink:0}}>{c.ic}</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{...T.body,fontSize:13,fontWeight:800,color:C.goldLight,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</div>
                <div style={{...T.body,fontSize:12.5,fontWeight:700,color:"rgba(245,230,184,.82)",marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.detail}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Hero CTA card */}
        <div style={{background:"rgba(6,22,12,.97)",border:"1px solid rgba(201,168,76,.32)",borderRadius:14,padding:"22px 18px 18px",marginBottom:20,opacity:vis?1:0,transition:"opacity .5s .65s",textAlign:"center",boxShadow:"0 6px 28px rgba(0,0,0,.55)"}}>
          <div style={{...T.display,color:C.goldLight,fontSize:22,fontWeight:900,lineHeight:1.15,marginBottom:10}}>Ready to Run Your Own Golf Trip Like a Pro?</div>
          <div style={{...T.body,color:"rgba(245,230,184,.5)",fontSize:12.5,lineHeight:1.7,marginBottom:18}}>No admin chaos. Just great golf.</div>
          <button className="btn-press" onClick={(e)=>{e.stopPropagation();trackEvent("early_access_clicked");setShowLeadModal(true);}} style={{width:"100%",padding:"15px 0",background:"linear-gradient(135deg,#b8892a 0%,#f0d060 45%,#c9952a 100%)",border:"none",borderRadius:13,...T.body,fontSize:16,fontWeight:900,color:C.greenDeep,cursor:"pointer",letterSpacing:.3,boxShadow:"0 4px 18px rgba(201,168,76,.4)"}}>Join Early Access →</button>
          <div style={{...T.body,textAlign:"center",color:"rgba(230,195,100,.82)",fontSize:12.5,fontWeight:700,marginTop:14,letterSpacing:.4}}>First 20 Founding Organisers receive free lifetime access</div>
        </div>
        {/* Share section */}
        <div style={{opacity:vis?1:0,transition:"opacity .5s .72s",paddingBottom:28}}>
          <div style={{...T.body,fontSize:10.5,fontWeight:800,color:"rgba(201,168,76,.75)",letterSpacing:1.6,textTransform:"uppercase",textAlign:"center",marginBottom:14}}>Share the Demo</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {[
              {label:"Share with another organiser",ic:"👥",msg:buildOrgMsg()},
              {label:"Share with your players",ic:"🤼",msg:MSG_GROUP},
              {label:"Share Demo",ic:"📤",msg:MSG_DEMO}
            ].map(function(opt,i){return(
              <button key={i} className="btn-press" onClick={(e)=>{e.stopPropagation();var ev=i===0?"organiser":i===1?"players":"demo";trackEvent("share_clicked",{share_type:ev});shareText(opt.msg);}} style={{width:"100%",padding:"14px 18px",background:"rgba(10,38,20,.85)",border:"1px solid rgba(201,168,76,.3)",borderRadius:12,display:"flex",alignItems:"center",gap:12,cursor:"pointer",boxShadow:"0 2px 12px rgba(0,0,0,.35)"}}>
                <span style={{fontSize:18,flexShrink:0}}>{opt.ic}</span>
                <span style={{...T.body,flex:1,fontSize:13.5,fontWeight:700,color:"rgba(245,230,184,.88)",textAlign:"left"}}>{opt.label}</span>
                <span style={{...T.body,fontSize:13,color:"rgba(201,168,76,.6)",fontWeight:600}}>→</span>
              </button>
            );})
            }
          </div>
        </div>

        {/* Lead capture modal */}
        {showLeadModal&&<LeadModal onClose={function(){setShowLeadModal(false);}}/>}
        {/* Share toast */}
        {shareToast&&(
          <div style={{position:"fixed",top:72,left:"50%",transform:"translateX(-50%)",zIndex:300,pointerEvents:"none",background:"rgba(10,30,18,.97)",border:"1px solid rgba(201,168,76,.55)",borderRadius:22,padding:"8px 18px",whiteSpace:"nowrap",animation:"toastSlide .3s ease-out",boxShadow:"0 4px 24px rgba(0,0,0,.7)"}}>
            <span style={{...T.body,fontSize:12,color:"#e8c96a",fontWeight:700}}>Link copied. Send it to your group 👍</span>
          </div>
        )}

      </div>
    </div>
  );
}

// ─── SCREEN 1 · WELCOME ───────────────────────────────────────────────────────
var WELCOME_SHARE_MSG=[
  "Here's the golf trip scoring app Teein It Up.",
  "",
  "Live leaderboards, side comps, and final results handled automatically.",
  "",
  "No spreadsheets, no admin chaos.",
  "",
  "Try the demo here: https://app-test-drive-v12.vercel.app/"
].join("\n");

function WelcomeScreen({onNext}) {
  const [a,setA]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setA(true),120);return()=>clearTimeout(t);},[]);
  useEffect(()=>{trackEvent("landing_page_viewed");},[]);
  return (
    <div style={{minHeight:"100vh",background:"#0d2318",display:"flex",flexDirection:"column",alignItems:"center",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,zIndex:0,background:"linear-gradient(170deg, #0a1f10 0%, #0f2d1a 18%, #122e1a 36%, #163520 52%, #0e2516 68%, #091a0f 84%, #050e08 100%)"}}/>
      {/* Subtle texture layer for depth */}
      <div style={{position:"absolute",inset:0,zIndex:0,background:"radial-gradient(ellipse 120% 80% at 50% 30%, rgba(30,80,40,0.45) 0%, transparent 65%), radial-gradient(ellipse 80% 60% at 20% 70%, rgba(15,45,22,0.35) 0%, transparent 55%)"}}/>
      <div style={{position:"absolute",inset:0,zIndex:1,pointerEvents:"none",background:"linear-gradient(180deg,rgba(5,18,10,0.70) 0%,rgba(8,26,15,0.32) 35%,rgba(8,26,15,0.28) 62%,rgba(4,14,8,0.85) 100%)"}}/>
      <div style={{position:"relative",zIndex:2,paddingTop:28,display:"flex",flexDirection:"column",alignItems:"center",opacity:a?1:0,transform:a?"translateY(0)":"translateY(-14px)",transition:"opacity .75s,transform .75s"}}>
        <div style={{position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{position:"absolute",inset:-10,borderRadius:"50%",background:"radial-gradient(circle,rgba(8,28,16,0.72) 30%,transparent 72%)"}}/>
          <img src={LOGO_SRC} alt="Teein It Up" style={{position:"relative",zIndex:1,width:210,height:210,objectFit:"contain",filter:"drop-shadow(0 6px 24px rgba(0,0,0,.6))"}}/>
        </div>
      </div>

      <div style={{position:"relative",zIndex:2,width:96,height:1,marginTop:12,background:`linear-gradient(90deg,transparent,${C.gold},transparent)`,opacity:a?.42:0,transition:"opacity .9s .4s"}}/>
      <div style={{position:"relative",zIndex:2,marginTop:12,padding:"0 32px",textAlign:"center",flex:1,display:"flex",flexDirection:"column",justifyContent:"center",opacity:a?1:0,transform:a?"translateY(0)":"translateY(16px)",transition:"opacity .85s .3s,transform .85s .3s"}}>
        <div style={{...T.display,color:"#fff",fontSize:26,fontWeight:800,lineHeight:1.25,maxWidth:300,margin:"0 auto 16px",textShadow:"0 2px 16px rgba(0,0,0,.65)"}}>Run Your Next Golf Trip Like a Pro.</div>
        <div style={{...T.body,color:"rgba(245,230,184,.72)",fontSize:14.5,lineHeight:1.85,marginBottom:8,textShadow:"0 1px 6px rgba(0,0,0,.35)"}}>
          Live scoring.{" "}Side comps.{" "}Leaderboards.
        </div>
        <div style={{width:40,height:1,background:`linear-gradient(90deg,transparent,${C.gold},transparent)`,margin:"10px auto",opacity:.5}}/>
        <div style={{...T.body,color:"rgba(245,230,184,.55)",fontSize:13.5,lineHeight:1.85,marginBottom:4}}>
          No admin chaos. Just great golf.
        </div>
        <div style={{...T.body,color:"rgba(245,230,184,.8)",fontSize:14,fontWeight:600,marginTop:6,textShadow:"0 1px 8px rgba(0,0,0,.4)"}}>
        </div>
      </div>
      <div style={{position:"relative",zIndex:2,width:"100%",padding:"18px 24px 44px",display:"flex",flexDirection:"column",alignItems:"center",opacity:a?1:0,transition:"opacity .7s 1.05s"}}>
        <button className="btn-press" onClick={function(){trackEvent("demo_started");onNext();}} style={{width:"100%",maxWidth:340,padding:"17px 24px",background:"linear-gradient(135deg,#c08a20 0%,#f0d060 38%,#dbb040 68%,#b87e20 100%)",color:"#0a2010",border:"none",borderRadius:15,...T.body,fontWeight:900,fontSize:17,letterSpacing:.4,cursor:"pointer",boxShadow:"0 6px 32px rgba(201,168,76,.58),inset 0 1px 0 rgba(255,255,255,.28)",transition:"transform .12s"}}>Start Demo Round →</button>
        <div style={{...T.body,textAlign:"center",color:"rgba(245,230,184,.92)",fontSize:12,marginTop:5,letterSpacing:.3}}>No signup required</div>
        <div style={{...T.body,textAlign:"center",color:"rgba(201,168,76,.5)",fontSize:11,marginTop:5,marginBottom:2,letterSpacing:.3}}>First 20 Founding Organisers receive free lifetime access</div>
        <button className="btn-press" onClick={function(){doShare(WELCOME_SHARE_MSG,null);}} style={{width:"100%",maxWidth:340,padding:"13px 24px",background:"rgba(255,255,255,.06)",color:"rgba(245,230,184,.75)",border:"1px solid rgba(201,168,76,.25)",borderRadius:13,...T.body,fontWeight:700,fontSize:14,letterSpacing:.2,cursor:"pointer",marginTop:10}}>Share Demo</button>
        <div style={{...T.body,textAlign:"center",color:"rgba(245,230,184,.32)",fontSize:11,marginTop:4,letterSpacing:.2}}>Players join in seconds. No app download needed.</div>
      </div>
    </div>
  );
}

// ─── SCREEN 1.5 · TEST DRIVE ───────────────────────────────────────────────────────
function TestDriveScreen({onOrganiser,onPlayer}) {
  const [a,setA]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setA(true),100);return()=>clearTimeout(t);},[]);
  return(
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",background:"#0a1f10"}}>
      {/* Background — golfer hitting driver */}
      <div style={{position:"absolute",inset:0,zIndex:0,backgroundImage:'url("https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=900&q=80")',backgroundSize:"cover",backgroundPosition:"center 40%",filter:"brightness(0.45) saturate(1.1)"}}/>
      <div style={{position:"absolute",inset:0,zIndex:1,background:"linear-gradient(180deg,rgba(4,14,8,.65) 0%,rgba(4,14,8,.5) 45%,rgba(4,14,8,.9) 100%)"}}/>
      <div style={{position:"relative",zIndex:2,padding:"0 28px",width:"100%",maxWidth:430,textAlign:"center"}}>
        {/* Driver image above headline */}
        <div style={{opacity:a?1:0,transition:"opacity .6s .05s",marginBottom:20}}>
          <img
            src="https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=700&q=85&auto=format&fit=crop"
            alt="Golfer hitting driver"
            style={{width:"100%",maxWidth:320,height:160,borderRadius:16,objectFit:"cover",objectPosition:"center 35%",boxShadow:"0 8px 36px rgba(0,0,0,.6), 0 0 0 1px rgba(201,168,76,.25)",display:"block",margin:"0 auto"}}
          />
        </div>
        <div style={{opacity:a?1:0,transform:a?"translateY(0)":"translateY(16px)",transition:"opacity .65s .15s,transform .65s .15s",marginBottom:28}}>
          <div style={{...T.display,color:C.white,fontSize:22,fontWeight:800,lineHeight:1.3,marginBottom:14,textShadow:"0 2px 16px rgba(0,0,0,.7)"}}>Get ready to Test Drive<br/>your next golf trip.</div>
          <div style={{...T.body,color:"rgba(245,230,184,.65)",fontSize:13.5,lineHeight:1.9,marginBottom:6}}>Watch the live scores,<br/>side comp leaders<br/>and leaderboard change in real time.</div>
        </div>
        {/* Role selection */}
        <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:8,opacity:a?1:0,transition:"opacity .6s .45s"}}>
          <button className="btn-press" onClick={onOrganiser} style={{width:"100%",padding:"16px 24px",background:"linear-gradient(135deg,#c08a20 0%,#f0d060 38%,#dbb040 68%,#b87e20 100%)",color:"#0a2010",border:"none",borderRadius:14,...T.body,fontWeight:900,fontSize:16,letterSpacing:.3,cursor:"pointer",boxShadow:"0 6px 28px rgba(201,168,76,.55)"}}>I'm the organiser →</button>
          <button className="btn-press" onClick={onPlayer} style={{width:"100%",padding:"15px 24px",background:"rgba(255,255,255,.07)",color:"rgba(245,230,184,.85)",border:"1px solid rgba(201,168,76,.3)",borderRadius:14,...T.body,fontWeight:700,fontSize:15,letterSpacing:.2,cursor:"pointer"}}>I'm a player →</button>
          <div style={{...T.body,fontSize:11,color:"rgba(245,230,184,.3)",marginTop:4}}>Player? Skip straight to scoring →</div>
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN 2 · CREATE TRIP ────────────────────────────────────────────────────
function CreateTripScreen({onNext,cfg,onCfg}) {
  const [a,setA]=useState(false);
  const [formatOpen,setFormatOpen]=useState(false);
  const [readyMsg,setReadyMsg]=useState(false);
  const powerplayOn   = cfg?.powerplayOn===true;
  const powerplayHole = cfg?.powerplayHole ?? 16;
  const numRounds     = cfg?.numRounds     ?? 2;
  function upd(patch){onCfg&&onCfg(prev=>({...prev,...patch}));}
  useEffect(()=>{const t=setTimeout(()=>setA(true),80);return()=>clearTimeout(t);},[]);
  function handleNext(){setReadyMsg(true);setTimeout(onNext,1600);}

  const Label=({ch})=><div style={{...T.body,fontSize:10.5,fontWeight:700,letterSpacing:1.1,color:C.inkLight,textTransform:"uppercase",marginBottom:5,marginTop:14}}>{ch}</div>;
  const Field=({value,verified})=>(
    <div>
      <div style={{background:C.white,border:`1.5px solid ${C.parchmentDark}`,borderRadius:8,padding:"11px 14px",...T.body,fontSize:15,color:C.ink,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span>{value}</span><span style={{color:C.inkFaint,fontSize:13}}>▾</span>
      </div>
      {verified&&<div style={{background:"#f0faf4",border:"1px solid #86efac",borderRadius:6,padding:"6px 10px",...T.body,fontSize:11.5,color:"#15803d",marginTop:4}}>✓ {verified}</div>}
    </div>
  );
  const formats=[
    {id:"stableford",label:"Stableford",desc:"Points-based scoring",active:true},
    {id:"ambrose",label:"Ambrose",desc:"Best ball team format",active:false},
    {id:"ryder",label:"Ryder Cup",desc:"Match play team event",active:false},
    {id:"stroke",label:"Stroke Play",desc:"Traditional gross/net scoring",active:false},
  ];

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",background:C.cream,minHeight:"100vh"}}>
      <Header subtitle="Create Trip"/>
      <ProgressBar step={2}/>
      <div style={{flex:1,overflowY:"auto",padding:"14px 16px 0"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14,opacity:a?1:0,transition:"opacity .45s"}}>
          <span style={{fontSize:22}}>🚩</span>
          <div>
            <div style={{...T.display,fontSize:17,fontWeight:700,color:C.ink}}>Step 1 — Trip Details</div>
            <div style={{...T.body,fontSize:12,color:C.inkLight}}>Your trip details</div>
          </div>
        </div>
        <Card style={{padding:"4px 14px 16px",opacity:a?1:0,transform:a?"translateY(0)":"translateY(10px)",transition:"opacity .5s .1s,transform .5s .1s",overflow:formatOpen?"visible":"hidden",position:"relative",zIndex:formatOpen?10:1}}>
          <Label ch="Trip Name"/><Field value={mockTrip.name}/>
          <Label ch="Location"/><Field value={mockTrip.location}/>
          <Label ch="Primary Course"/><Field value={mockTrip.course} verified={`${mockTrip.course} · ${mockTrip.courseDetails}`}/>
          <Label ch="Format"/>
          <div style={{position:"relative"}}>
            <div onClick={()=>setFormatOpen(o=>!o)} style={{background:C.white,border:`1.5px solid ${formatOpen?C.green:C.parchmentDark}`,borderRadius:formatOpen?"8px 8px 0 0":8,padding:"11px 14px",...T.body,fontSize:15,color:C.ink,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{background:C.greenBright,color:C.white,...T.body,fontSize:10,fontWeight:700,borderRadius:4,padding:"2px 6px"}}>ACTIVE</span>
                <span>Stableford</span>
              </div>
              <span style={{color:C.inkLight,fontSize:13,transform:formatOpen?"rotate(180deg)":"rotate(0deg)",transition:"transform .2s",display:"inline-block"}}>▾</span>
            </div>
            {formatOpen&&(
              <div style={{position:"absolute",left:0,right:0,top:"100%",background:C.white,border:`1.5px solid ${C.green}`,borderTop:"none",borderRadius:"0 0 10px 10px",boxShadow:"0 8px 24px rgba(15,45,28,.18)",zIndex:20,overflow:"hidden"}}>
                {formats.map((f,i)=>(
                  <div key={f.id} onClick={()=>f.active&&setFormatOpen(false)} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 14px",borderTop:i>0?`1px solid ${C.parchment}`:"none",cursor:f.active?"pointer":"default",opacity:f.active?1:0.48,background:f.active?C.white:"#f7f5f0"}}>
                    <div style={{flex:1}}>
                      <div style={{...T.body,fontSize:14,fontWeight:f.active?600:500,color:f.active?C.ink:C.inkLight,display:"flex",alignItems:"center",gap:8}}>
                        {f.label}
                        {f.active&&<span style={{background:C.greenBright,color:C.white,fontSize:9,fontWeight:700,borderRadius:4,padding:"2px 6px"}}>✓ SELECTED</span>}
                        {!f.active&&<span style={{background:C.parchmentMid,color:C.inkFaint,fontSize:9,fontWeight:700,borderRadius:4,padding:"2px 6px"}}>🔒 SOON</span>}
                      </div>
                      <div style={{...T.body,fontSize:11,color:C.inkFaint,marginTop:2}}>{f.desc}</div>
                    </div>
                    {f.active&&<span style={{color:C.greenBright,fontSize:16}}>✓</span>}
                  </div>
                ))}
                <div style={{padding:"8px 14px",borderTop:`1px solid ${C.parchmentMid}`,...T.body,fontSize:11,color:C.inkFaint,fontStyle:"italic"}}>More formats launching soon</div>
              </div>
            )}
          </div>
          <Label ch="Number of Rounds"/>
          <div style={{display:"flex",gap:8,marginBottom:6,alignItems:"center"}}>
            {[1,2,3,4].map(n=>(
              <div key={n} style={{flex:1,padding:"9px 0",background:n===2?`linear-gradient(135deg,${C.greenBright},${C.green})`:C.white,border:n===2?`2px solid ${C.greenBright}`:`1.5px solid ${C.parchmentDark}`,borderRadius:9,...T.body,fontSize:14,fontWeight:n===2?700:400,color:n===2?C.white:C.inkFaint,textAlign:"center",opacity:n===2?1:0.38}}>{n}</div>
            ))}
            <span style={{...T.body,fontSize:10,color:C.inkFaint,marginLeft:4,whiteSpace:"nowrap"}}>Demo: 2 rounds</span>
          </div>
        </Card>

        <div style={{marginTop:10,marginBottom:4,opacity:a?1:0,transition:"opacity .4s .1s"}}>
          <div style={{background:"#fff7ed",border:"1.5px solid #fed7aa",borderRadius:10,padding:"10px 14px",display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:18}}>🔒</span>
            <div>
              <div style={{...T.body,fontSize:13,fontWeight:700,color:"#c2410c"}}>Round 1 Not Started</div>
              <div style={{...T.body,fontSize:11,color:"#9a3412",marginTop:2}}>Scorecards locked until organiser starts the round</div>
            </div>
          </div>
        </div>

        <div style={{marginTop:14,opacity:a?1:0,transition:"opacity .5s .2s"}}>
          <SLabel>Players ({mockTrip.players.length})</SLabel>
          {mockTrip.groups.map((grp,gi)=>(
            <div key={grp.id} style={{marginBottom:gi<mockTrip.groups.length-1?10:0}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"4px 2px 4px"}}>
                <div style={{...T.body,fontSize:11,fontWeight:700,color:C.inkLight,letterSpacing:.8,textTransform:"uppercase"}}>{grp.label}</div>
                <div style={{...T.body,fontSize:11,color:C.goldDark,fontWeight:600}}>⏱ {grp.teeTime}</div>
              </div>
              <Card noPad>
                {mockTrip.players.filter(p=>p.group===grp.id).map((p,i,arr)=>(
                  <div key={p.id}>
                    <div style={{display:"flex",alignItems:"center",gap:11,padding:"10px 14px"}}>
                      <Avatar player={p} size={34}/>
                      <div style={{flex:1}}>
                        <div style={{...T.body,fontSize:14,fontWeight:600,color:C.ink}}>{p.name}</div>
                        <div style={{...T.body,fontSize:12,color:C.inkLight}}>HCP {p.hcp}</div>
                      </div>
                      <div style={{background:"#f0faf4",border:"1px solid #86efac",borderRadius:5,padding:"3px 9px",...T.body,fontSize:11,fontWeight:700,color:"#15803d"}}>✓ Added</div>
                    </div>
                    {i<arr.length-1&&<Divider/>}
                  </div>
                ))}
              </Card>
            </div>
          ))}
        </div>

        <div style={{marginTop:12,opacity:a?1:0,transition:"opacity .5s .3s"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:C.ivory,borderRadius:10,border:`1.5px solid ${C.parchmentDark}`,padding:"11px 14px",gap:12}}>
            <div style={{flex:1}}>
              <div style={{...T.body,fontSize:14,fontWeight:600,color:C.ink}}>⚡ Powerplay Hole</div>
              <div style={{...T.body,fontSize:11,color:C.inkLight,marginTop:2}}>Double Stableford points on one selected hole</div>
            </div>
            <button onClick={()=>upd({powerplayOn:!powerplayOn})} style={{width:44,height:24,borderRadius:12,border:"none",cursor:"pointer",background:powerplayOn?C.greenBright:C.parchmentDark,position:"relative",transition:"background .2s",flexShrink:0}}>
              <div style={{position:"absolute",top:2,left:powerplayOn?22:2,width:20,height:20,borderRadius:"50%",background:C.white,boxShadow:"0 1px 4px rgba(0,0,0,.25)",transition:"left .2s"}}/>
            </button>
          </div>
          {powerplayOn&&(
            <div style={{marginTop:10}}>
              <div style={{...T.body,fontSize:11.5,color:C.ink,fontWeight:600,marginBottom:6}}>Select Powerplay Hole</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {[10,11,12,13,14,15,16,17,18].map(h=>(
                  <button key={h} onClick={()=>upd({powerplayHole:h})} style={{width:38,height:32,borderRadius:8,background:powerplayHole===h?`linear-gradient(135deg,${C.greenBright},${C.green})`:C.white,border:powerplayHole===h?`2px solid ${C.greenBright}`:`1.5px solid ${C.parchmentDark}`,...T.body,fontSize:12,fontWeight:powerplayHole===h?700:400,color:powerplayHole===h?C.white:C.ink,cursor:"pointer"}}>H{h}</button>
                ))}
              </div>
              <div style={{...T.body,fontSize:11,color:C.greenBright,marginTop:6,fontWeight:600}}>⚡ H{powerplayHole} selected — 2× Stableford points</div>
            </div>
          )}
        </div>

        <div style={{marginTop:14,opacity:a?1:0,transition:"opacity .5s .3s"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:7}}>
            <SLabel style={{marginBottom:0}}>Side Games</SLabel>
            <div style={{...T.body,fontSize:10.5,fontWeight:700,color:C.greenBright}}>✦ Pre-configured</div>
          </div>
          <Card noPad>
            {[{ic:"📍",name:"Nearest the Pin",detail:mockTrip.sideComps.nearestPin},{ic:"💥",name:"Longest Drive",detail:mockTrip.sideComps.longestDrive},{ic:"🎯",name:"Pro's Approach",detail:mockTrip.sideComps.prosApproach}].map((sg,i,arr)=>(
              <div key={i}>
                <div style={{display:"flex",alignItems:"center",padding:"9px 14px",gap:10}}>
                  <span style={{fontSize:17,flexShrink:0}}>{sg.ic}</span>
                  <div style={{flex:1}}>
                    <div style={{...T.body,fontSize:13,fontWeight:600,color:C.ink}}>{sg.name}</div>
                    <div style={{...T.body,fontSize:11,color:C.inkLight}}>{sg.detail}</div>
                  </div>
                  <div style={{width:36,height:20,borderRadius:10,background:`linear-gradient(90deg,${C.greenBright},${C.greenLight})`,position:"relative",flexShrink:0}}>
                    <div style={{position:"absolute",right:2,top:2,width:16,height:16,borderRadius:"50%",background:C.white}}/>
                  </div>
                </div>
                {i<arr.length-1&&<Divider/>}
              </div>
            ))}
          </Card>
        </div>
        <div style={{height:96}}/>
      </div>
      <div style={{padding:"12px 16px 16px",background:C.cream,borderTop:`1px solid ${C.parchmentDark}`,boxShadow:"0 -4px 16px rgba(15,45,28,.07)",flexShrink:0}}>
        {readyMsg&&<div style={{...T.body,fontSize:12.5,fontWeight:700,color:C.greenBright,textAlign:"center",marginBottom:8,animation:"fadeIn .35s"}}>✓ Your trip is ready — jumping into the round…</div>}
        <GreenBtn label="Next: Trip Overview →" onClick={handleNext}/>
      </div>
      <NavBar active="home"/>
    </div>
  );
}

// ─── SCREEN 3 · TRIP OVERVIEW ──────────────────────────────────────────────────
function TripOverviewScreen({onNext,cfg,dailyHcps,onDailyHcps}) {
  const [a,setA]=useState(false);
  const powerplayOn   = cfg?.powerplayOn===true;
  const powerplayHole = cfg?.powerplayHole ?? 16;
  const hcpEdit = dailyHcps ?? Object.fromEntries(mockTrip.players.map(p=>[p.id,p.hcp]));
  function adjHcp(id,d){
    const next=Math.max(0,Math.min(54,(hcpEdit[id]||0)+d));
    onDailyHcps&&onDailyHcps(prev=>({...prev,[id]:next}));
  }
  useEffect(()=>{const t=setTimeout(()=>setA(true),80);return()=>clearTimeout(t);},[]);

  const Stat=({ic,val,lbl})=>(
    <div style={{flex:1,textAlign:"center",padding:"13px 6px"}}>
      <div style={{fontSize:22,marginBottom:4}}>{ic}</div>
      <div style={{...T.display,fontSize:20,fontWeight:700,color:C.green}}>{val}</div>
      <div style={{...T.body,fontSize:10,color:C.inkFaint,letterSpacing:.7,marginTop:1}}>{lbl}</div>
    </div>
  );

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",background:C.cream,minHeight:"100vh"}}>
      <Header/>
      <ProgressBar step={3}/>
      <div style={{background:`linear-gradient(135deg,${C.greenDeep} 0%,${C.green} 60%,${C.greenMid} 100%)`,padding:"14px 16px 12px",borderBottom:`2px solid ${C.gold}`,opacity:a?1:0,transition:"opacity .4s",flexShrink:0}}>
        <GoldRule/>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",margin:"10px 0"}}>
          <div>
            <div style={{...T.body,color:C.goldMid,fontSize:10.5,fontWeight:700,letterSpacing:1.1,textTransform:"uppercase",marginBottom:3}}>🌏 Active Trip</div>
            <div style={{...T.display,color:C.white,fontSize:19,fontWeight:700,letterSpacing:.2}}>{mockTrip.name}</div>
            <div style={{...T.body,color:C.goldPale,fontSize:12,marginTop:3}}>{mockTrip.course}</div>
          </div>
          <div style={{background:"rgba(201,168,76,.15)",border:`1.5px solid ${C.gold}`,borderRadius:10,padding:"7px 13px",textAlign:"center",flexShrink:0}}>
            <div style={{...T.display,color:C.goldLight,fontSize:22,fontWeight:700}}>{mockTrip.rounds}</div>
            <div style={{...T.body,color:C.goldPale,fontSize:9,letterSpacing:.7}}>ROUNDS</div>
          </div>
        </div>
        <div style={{background:"rgba(0,0,0,.2)",border:"1px dashed rgba(201,168,76,.45)",borderRadius:8,padding:"8px 14px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{...T.body,color:"rgba(245,230,184,.6)",fontSize:10.5,letterSpacing:.7}}>TRIP JOIN CODE</div>
          <div style={{...T.display,color:C.goldLight,fontSize:21,fontWeight:700,letterSpacing:3.5}}>{mockTrip.joinCode}</div>
        </div>
        <GoldRule style={{marginTop:10}}/>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"14px 16px 0"}}>
        <Card noPad style={{marginBottom:12,opacity:a?1:0,transform:a?"translateY(0)":"translateY(10px)",transition:"opacity .45s .1s,transform .45s .1s"}}>
          <div style={{display:"flex",borderBottom:`1px solid ${C.parchmentMid}`}}>
            <Stat ic="👥" val={mockTrip.players.length} lbl="PLAYERS"/>
            <div style={{width:1,background:C.parchmentMid}}/>
            <Stat ic="⛳" val={mockTrip.rounds} lbl="ROUNDS"/>
            <div style={{width:1,background:C.parchmentMid}}/>
            <Stat ic="🎯" val="3" lbl="SIDE COMPS"/>
          </div>
          {powerplayOn ? (
            <div style={{background:`linear-gradient(90deg,rgba(217,119,6,.07),transparent)`,borderTop:`1px solid rgba(217,119,6,.16)`,padding:"9px 14px",display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:16}}>⚡</span>
              <span style={{...T.body,fontSize:13,color:C.inkMid}}>Powerplay: <strong style={{color:C.amber}}>Hole {powerplayHole}</strong><span style={{color:C.inkFaint}}> · 2× Stableford Points</span></span>
            </div>
          ) : (
            <div style={{background:`linear-gradient(90deg,rgba(100,100,100,.04),transparent)`,borderTop:`1px solid rgba(100,100,100,.1)`,padding:"9px 14px",display:"flex",alignItems:"center",gap:8}}>
              <span style={{...T.body,fontSize:13,color:C.inkFaint}}>No Powerplay — standard Stableford scoring</span>
            </div>
          )}
        </Card>

        <SLabel style={{opacity:a?1:0,transition:"opacity .4s .15s"}}>Playing Groups</SLabel>
        {mockTrip.groups.map((grp,gi)=>(
          <div key={grp.id} style={{marginBottom:10,opacity:a?1:0,transition:`opacity .4s ${.2+gi*.1}s`}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 4px 4px"}}>
              <div style={{...T.body,fontSize:11,fontWeight:700,color:C.inkLight,letterSpacing:.8,textTransform:"uppercase"}}>{grp.label}</div>
              <div style={{...T.body,fontSize:11,color:C.goldDark,fontWeight:600}}>⏱ {grp.teeTime}</div>
            </div>
            <Card noPad>
              {mockTrip.players.filter(p=>p.group===grp.id).map((p,i,arr)=>{
                const daily=hcpEdit[p.id]??p.hcp;
                const diff=daily-p.hcp;
                return (
                  <div key={p.id}>
                    <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px"}}>
                      <Avatar player={p} size={34}/>
                      <div style={{flex:1}}>
                        <div style={{...T.body,fontSize:14,fontWeight:600,color:C.ink}}>{p.name}</div>
                        <div style={{...T.body,fontSize:11,color:C.inkLight,marginTop:1}}>GA: {p.hcp}<span style={{color:C.greenBright,fontWeight:700}}>{" → "}Daily: {daily}{diff!==0?(diff>0?` (+${diff})`:`(${diff})`):""}</span></div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:5,flexShrink:0}}>
                        <button onClick={()=>adjHcp(p.id,-1)} style={{width:28,height:28,borderRadius:"50%",border:`1px solid ${C.parchmentDark}`,background:C.white,cursor:"pointer",fontSize:18,fontWeight:300,lineHeight:1,display:"flex",alignItems:"center",justifyContent:"center",color:C.inkMid}}>−</button>
                        <div style={{...T.display,fontSize:18,fontWeight:800,color:C.green,minWidth:26,textAlign:"center"}}>{daily}</div>
                        <button onClick={()=>adjHcp(p.id,+1)} style={{width:28,height:28,borderRadius:"50%",border:`1px solid ${C.parchmentDark}`,background:C.white,cursor:"pointer",fontSize:18,fontWeight:300,lineHeight:1,display:"flex",alignItems:"center",justifyContent:"center",color:C.inkMid}}>+</button>
                      </div>
                    </div>
                    {i<arr.length-1&&<Divider/>}
                  </div>
                );
              })}
            </Card>
          </div>
        ))}

        <div style={{opacity:a?1:0,transition:"opacity .4s .25s"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:7}}>
            <SLabel style={{marginBottom:0}}>Side Competitions</SLabel>
            <div style={{...T.body,fontSize:10.5,fontWeight:700,color:C.greenBright}}>✦ Auto-tracked</div>
          </div>
        </div>
        <Card noPad style={{marginBottom:8,opacity:a?1:0,transition:"opacity .4s .3s"}}>
          {[{ic:"📍",lbl:"Nearest the Pin",detail:mockTrip.sideComps.nearestPin},{ic:"💥",lbl:"Longest Drive",detail:mockTrip.sideComps.longestDrive},{ic:"🎯",lbl:"Pro's Approach",detail:mockTrip.sideComps.prosApproach}].map((c,i,arr)=>(
            <div key={i}>
              <div style={{display:"flex",alignItems:"center",gap:11,padding:"11px 14px"}}>
                <div style={{width:36,height:36,borderRadius:9,background:`linear-gradient(135deg,${C.goldPale},${C.parchment})`,border:`1.5px solid ${C.gold}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{c.ic}</div>
                <div style={{flex:1}}>
                  <div style={{...T.body,fontSize:13,fontWeight:600,color:C.ink}}>{c.lbl}</div>
                  <div style={{...T.body,fontSize:11.5,color:C.inkLight}}>{c.detail}</div>
                </div>
                <div style={{width:36,height:20,borderRadius:10,background:`linear-gradient(90deg,${C.greenBright},${C.greenLight})`,position:"relative",flexShrink:0}}>
                  <div style={{position:"absolute",right:2,top:2,width:16,height:16,borderRadius:"50%",background:C.white}}/>
                </div>
              </div>
              {i<arr.length-1&&<Divider/>}
            </div>
          ))}
        </Card>

        {powerplayOn&&(
          <div style={{marginTop:12,opacity:a?1:0,transition:"opacity .5s .35s"}}>
            <Card style={{padding:"12px 14px"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <span style={{fontSize:16}}>⚡</span>
                <div style={{...T.body,fontSize:13,fontWeight:600,color:C.ink}}>Powerplay</div>
                <div style={{marginLeft:"auto",background:"#f0faf4",border:"1px solid #86efac",borderRadius:5,padding:"2px 9px",...T.body,fontSize:11,fontWeight:700,color:"#15803d"}}>ON</div>
              </div>
              <div style={{background:"#f0faf4",border:"1px solid #86efac",borderRadius:8,padding:"8px 12px"}}>
                <div style={{...T.body,fontSize:12.5,fontWeight:700,color:C.green}}>⚡ Hole {powerplayHole} · 2× Stableford Points</div>
                <div style={{...T.body,fontSize:11,color:C.inkLight,marginTop:2}}>All players score double on H{powerplayHole}</div>
              </div>
            </Card>
          </div>
        )}

        <div style={{display:"flex",alignItems:"center",gap:8,background:`linear-gradient(90deg,rgba(45,122,82,.1),rgba(45,122,82,.04))`,border:`1px solid rgba(45,122,82,.25)`,borderRadius:9,padding:"9px 13px",margin:"14px 0 16px",opacity:a?1:0,transition:"opacity .4s .35s"}}>
          <span style={{fontSize:15,flexShrink:0}}>✨</span>
          <div style={{...T.body,fontSize:12,color:C.inkMid,lineHeight:1.5}}>Winners are determined automatically as scores are entered. <span style={{color:C.greenBright,fontWeight:700}}>No setup needed.</span></div>
        </div>
        <div style={{height:90}}/>
      </div>
      <div style={{padding:"12px 16px 16px",background:C.cream,borderTop:`1px solid ${C.parchmentDark}`,boxShadow:"0 -4px 16px rgba(15,45,28,.07)",flexShrink:0}}>
        <GreenBtn label="Start Round 1 — Tee Off →" onClick={onNext}/>
      </div>
      <NavBar active="home"/>
    </div>
  );
}

// ─── SCREEN 4 · SCORE ENTRY ────────────────────────────────────────────────────
function ScoreEntryScreen({onNext,cfg,dailyHcps,scRes,onScRes}) {
  const BACK9_START=9, BACK9_HOLES=9;
  const player=mockTrip.players[0];
  function getActiveHcp(p){return (dailyHcps?.[p.id]!==undefined)?dailyHcps[p.id]:p.hcp;}
  const activeHcp=getActiveHcp(player);
  // Powerplay — read directly from cfg, no fallback default
  const ppOn   = cfg?.powerplayOn===true;
  const ppHole = ppOn ? (cfg?.powerplayHole ?? 16) : null;
  function applyPP(pts,holeNo){return (ppHole&&holeNo===ppHole&&pts>0)?pts*2:pts;}

  const BACK9_DATA=[
    {hole:10,par:4,hcpIdx:17,tip:"Get your tee shot between the two mounds either side of the fairway — anything inside funnels to the bowl-shaped fairway leaving a short pitch."},
    {hole:11,par:3,hcpIdx:13,tip:"Take enough club to reach the centre. There is trouble everywhere else on this hole."},
    {hole:12,par:4,hcpIdx:16,tip:"A mid-to-long iron is better than driver to avoid the narrow neck. Aim before the furthest right bunker for the best angle in."},
    {hole:13,par:5,hcpIdx:7, tip:"The longest hole on the course. Start 10m right of the fairway bunker. Accept it will take 3–4 shots to reach the green."},
    {hole:14,par:4,hcpIdx:11,tip:"Aim well right of the bunkers and use the sloping terrain to feed the ball. Aim for the pot bunker behind and take one less club."},
    {hole:15,par:5,hcpIdx:6, tip:"Thread the tee shot through the gap. On approach, aim 5m right to use the mound that feeds the ball left."},
    {hole:16,par:4,hcpIdx:1, tip:"Aim left off the tee to stay on the top tier. Use the red and white barbers pole as your line for the best angle into this spectacular hole."},
    {hole:17,par:3,hcpIdx:10,tip:"Take one less club and aim left — use the slope to feed the ball to the green. Adjust only into a strong headwind."},
    {hole:18,par:4,hcpIdx:5, tip:"Aim straight for the clubhouse off the tee. Block out the cliff face, take an extra club, and aim a few metres right of the bunker."},
  ];
  const SIDE_GAMES=[
    {holeIdx:11,icon:"🎯",name:"Pro's Approach", label:"H12 · Par 4",type:"approach",unit:"m from pin"},
    {holeIdx:14,icon:"💥",name:"Longest Drive",  label:"H15 · Par 5",type:"drive",   unit:null},
    {holeIdx:16,icon:"📍",name:"Nearest the Pin",label:"H17 · Par 3",type:"pin",    unit:"m from pin"},
  ];
  function getSG(gi){return SIDE_GAMES.find(s=>s.holeIdx===gi)||null;}
  function getUpcoming(gi){return SIDE_GAMES.find(s=>s.holeIdx===gi+1)||null;}

  const front9User=mockScores[1].slice(0,9);
  const [back9,setBack9]=useState(Array(BACK9_HOLES).fill(null));
  const [holeIdx,setHoleIdx]=useState(0);
  const [confirmed,setConfirmed]=useState(Array(BACK9_HOLES).fill(false));
  const [flash,setFlash]=useState(false);
  const [flashPts,setFlashPts]=useState(null);
  const [flashMsg,setFlashMsg]=useState("");
  const [metresVal,setMetresVal]=useState("");
  const [liveThru,setLiveThru]=useState({2:4,3:3,4:3,5:5,6:5,7:2,8:2});
  const [isLongest,setIsLongest]=useState(null);
  const [driveFlash,setDriveFlash]=useState(false);
  const [showFullLB,setShowFullLB]=useState(false);
  const [recentUp,setRecentUp]=useState(null);
  const [liveToast,setLiveToast]=useState(null);
  const toastTimerRef=useRef(null);
  const prevBoardLeaderRef=useRef(null);
  const prevDriveRef=useRef(null);
  const prevAppLeaderRef=useRef(null);
  const prevPinLeaderRef=useRef(null);
  const confirmedRanksRef=useRef({});

  const scApproach=scRes?.approach??[];
  const scPin=scRes?.pin??[];
  const scDrive=scRes?.drive??null;
  function setScApproach(fn){onScRes&&onScRes(prev=>({...prev,approach:typeof fn==="function"?fn(prev.approach):fn}));}
  function setScPin(fn){onScRes&&onScRes(prev=>({...prev,pin:typeof fn==="function"?fn(prev.pin):fn}));}
  function setScDrive(v){onScRes&&onScRes(prev=>({...prev,drive:v}));}

  const SIM_APP={5:{name:"Tom",dist:1.8},2:{name:"Dave",dist:3.4},4:{name:"Pete",dist:4.7}};
  const SIM_PIN={6:{name:"Liam",dist:2.2},8:{name:"Jack",dist:5.8},4:{name:"Pete",dist:3.1}};
  function pinLeader(entries){if(!entries.length)return null;return entries.reduce((a,b)=>a.distance<=b.distance?a:b);}

  // Seed sim side comp results + fire lead-change toasts
  useEffect(()=>{
    // Pro's Approach
    const pastApp=Object.entries(liveThru).filter(([id,thru])=>thru>2&&SIM_APP[id]).map(([id])=>({playerId:Number(id),name:SIM_APP[id].name,distance:SIM_APP[id].dist}));
    if(pastApp.length>0){
      setScApproach(prev=>{
        const ids=new Set(prev.map(e=>e.playerId));
        const newOnes=pastApp.filter(e=>!ids.has(e.playerId));
        if(!newOnes.length) return prev;
        const merged=[...prev,...newOnes];
        const ldr=merged.reduce((a,b)=>a.distance<=b.distance?a:b);
        if(prevAppLeaderRef.current!==ldr.name){
          prevAppLeaderRef.current=ldr.name;
          showToast(ldr.name+" leads Pro's Approach");
        }
        return merged;
      });
    }
    // Longest Drive
    const pastDrive=Object.keys(liveThru).some(id=>liveThru[id]>5);
    if(pastDrive&&scDrive===null){
      setScDrive({name:"Dave"});
      if(prevDriveRef.current!=="Dave"){
        prevDriveRef.current="Dave";
        showToast("Dave takes Longest Drive");
      }
    }
    // Nearest the Pin
    const pastPin=Object.entries(liveThru).filter(([id,thru])=>thru>7&&SIM_PIN[id]).map(([id])=>({playerId:Number(id),name:SIM_PIN[id].name,distance:SIM_PIN[id].dist}));
    if(pastPin.length>0){
      setScPin(prev=>{
        const ids=new Set(prev.map(e=>e.playerId));
        const newOnes=pastPin.filter(e=>!ids.has(e.playerId));
        if(!newOnes.length) return prev;
        const merged=[...prev,...newOnes];
        const ldr=merged.reduce((a,b)=>a.distance<=b.distance?a:b);
        if(prevPinLeaderRef.current!==ldr.name){
          prevPinLeaderRef.current=ldr.name;
          showToast(ldr.name+" takes Nearest the Pin");
        }
        return merged;
      });
    }
  },[liveThru,holeIdx]);

  // Tick other players
  useEffect(()=>{
    const ids=[2,3,4,5,6,7,8];
    const tick=setInterval(()=>{
      const el=ids.filter(id=>(liveThru[id]??0)<9);
      if(!el.length){clearInterval(tick);return;}
      const id=el[Math.floor(Math.random()*el.length)];
      setLiveThru(prev=>({...prev,[id]:Math.min(9,(prev[id]??0)+1)}));
      setRecentUp(id);
      setTimeout(()=>setRecentUp(null),900);
    },2500+Math.random()*1500);
    return()=>clearInterval(tick);
  },[]);

  // showToast: event-driven only, replaces any current toast
  function showToast(msg){
    if(toastTimerRef.current)clearTimeout(toastTimerRef.current);
    setLiveToast(msg);
    toastTimerRef.current=setTimeout(()=>setLiveToast(null),3000);
  }


  function buildBoard(userBack9,holesPlayed,confirmedHoles){
    return mockTrip.players.map(p=>{
      const thru=p.id===1?holesPlayed:(liveThru[p.id]??0);
      const pHcp=p.id===1?getActiveHcp(p):(dailyHcps?.[p.id]??p.hcp);
      let scores18,total,userB9;
      if(p.id===1){
        // Player 1: only CONFIRMED holes count toward leaderboard total.
        // confirmed[] array is passed as confirmedHoles param.
        const b9=userBack9.map((s,i)=>confirmedHoles[i]&&s>0?s:mockScores[1][BACK9_START+i]);
        scores18=[...front9User,...b9];
        const pts=scores18.map((s,i)=>applyPP(calcPts(s,holePars[i],pHcp,i+1),i+1));
        const f9=pts.slice(0,9).reduce((a,b)=>a+b,0);
        userB9=userBack9.reduce((a,s,i)=>{
          if(!confirmedHoles[i]||!s||s===0)return a;
          return a+applyPP(calcPts(s,holePars[BACK9_START+i],pHcp,BACK9_START+i+1),BACK9_START+i+1);
        },0);
        total=f9+userB9;
        return{...p,scores:scores18,pts,f9,b9:userB9,total,thru};
      } else {
        // Simulated players: F9 from mockScores (fixed), back9 builds hole-by-hole.
        // Only holes already played (i < thru) contribute to total.
        // This gives realistic starting pts (F9 only) and steady progression.
        scores18=[...mockScores[p.id].slice(0,9),...otherBack9[p.id]];
        const f9pts=mockScores[p.id].slice(0,9)
          .map((s,i)=>applyPP(calcPts(s,holePars[i],pHcp,i+1),i+1))
          .reduce((a,b)=>a+b,0);
        let b9pts=0;
        for(let i=0;i<thru;i++){
          b9pts+=applyPP(calcPts(otherBack9[p.id][i],holePars[BACK9_START+i],pHcp,BACK9_START+i+1),BACK9_START+i+1);
        }
        const pts=scores18.map((s,i)=>applyPP(calcPts(s,holePars[i],pHcp,i+1),i+1));
        total=f9pts+b9pts;
        return{...p,scores:scores18,pts,f9:f9pts,b9:b9pts,total,thru};
      }
    }).sort((a,b)=>b.total-a.total);
  }

  const holesConfirmed=confirmed.filter(Boolean).length;
  const board=buildBoard(back9,holesConfirmed,confirmed);

  // Fire toast when overall leaderboard leader changes (board is now defined)
  useEffect(()=>{
    if(!board||board.length===0) return;
    const leader=board[0];
    if(prevBoardLeaderRef.current!==null && prevBoardLeaderRef.current!==leader.id){
      showToast(leader.name.split(" ")[0]+" takes the lead");
    }
    prevBoardLeaderRef.current=leader.id;
  },[liveThru,holesConfirmed]);
  const holeData=BACK9_DATA[holeIdx];
  const globalHole=BACK9_START+holeIdx;
  const par=holeData.par;
  const holeNo=holeData.hole;
  const selected=back9[holeIdx];
  const activeSG=getSG(globalHole);
  const upcomingSG=getUpcoming(globalHole);
  const currentPts=selected!==null?calcPts(selected,par,activeHcp,holeNo):null;
  const isPPHole=ppOn&&holeNo===ppHole;
  const displayPts=currentPts!==null?applyPP(currentPts,holeNo):null;
  const front9pts=front9User.reduce((a,s,i)=>a+applyPP(calcPts(s,holePars[i],activeHcp,i+1),i+1),0);
  const back9pts=back9.reduce((a,s,i)=>s!==null&&s>0?a+applyPP(calcPts(s,holePars[BACK9_START+i],activeHcp,BACK9_START+i+1),BACK9_START+i+1):a,0);
  const totalPts=front9pts+back9pts;
  const medals=["🥇","🥈","🥉"];
  // prevRanks comes from confirmedRanksRef — only updates after confirmed scores
  const prevRanks=confirmedRanksRef.current;
  function pick(delta){const base=selected===null?0:selected;const next=Math.max(0,Math.min(12,base+delta));const nb=[...back9];nb[holeIdx]=next===0?null:next;setBack9(nb);}
  function pickPar(){const nb=[...back9];nb[holeIdx]=par;setBack9(nb);}

  function confirm(){
    if(selected===null||selected===0)return;
    const pts=calcPts(selected,par,activeHcp,holeNo);
    const nc=[...confirmed];nc[holeIdx]=true;setConfirmed(nc);
    // Snapshot old ranks, then after state settles the board will rerender with new confirmed
    const oldRanks={...confirmedRanksRef.current};
    confirmedRanksRef.current=Object.fromEntries(buildBoard(back9,holesConfirmed+1,nc).map((p,i)=>[p.id,i]));
    setFlash(true);setFlashPts(applyPP(pts,holeNo));
    const diff=selected-par;
    const label=diff<=-2?"Eagle! 🦅":diff===-1?"Birdie! 🔥":diff===0?"Par ✅":diff===1?"Bogey 👍":diff===2?"Double Bogey":"Triple+";
    setFlashMsg(label);
    if(activeSG&&activeSG.type==="approach"&&metresVal){const d=parseFloat(metresVal);if(!isNaN(d))setScApproach(prev=>[...prev,{playerId:1,name:"Matty",distance:d}]);}
    else if(activeSG&&activeSG.type==="pin"&&metresVal){const d=parseFloat(metresVal);if(!isNaN(d))setScPin(prev=>[...prev,{playerId:1,name:"Matty",distance:d}]);}
    else if(activeSG&&activeSG.type==="drive"&&isLongest===true){setScDrive({name:"Matty"});showToast("Matty takes Longest Drive");}
    setMetresVal("");
    setTimeout(()=>{setFlash(false);setFlashPts(null);setFlashMsg("");},1400);
    if(holeIdx<BACK9_HOLES-1){setTimeout(()=>setHoleIdx(holeIdx+1),580);}
    else{const fs=[...front9User,...back9.map((s,i)=>s!==null&&s>0?s:mockScores[1][BACK9_START+i])];const finalBd=buildBoard(back9,BACK9_HOLES,nc);setTimeout(()=>{trackEvent("round_completed");onNext(fs,finalBd);},700);}
  }

  function tileMeta(i){
    const gh=BACK9_START+i;const hn=gh+1;
    if(!confirmed[i]||back9[i]===null){
      const isPP=ppOn&&hn===ppHole;
      return{bg:isPP?"rgba(201,168,76,.12)":"rgba(255,255,255,.07)",border:isPP?C.gold+"66":"rgba(255,255,255,.11)",label:`${hn}`,sub:isPP?"⚡":"p"+holePars[gh],tc:isPP?C.goldLight:"rgba(255,255,255,.45)",nc:isPP?C.goldLight:"rgba(255,255,255,.68)"};
    }
    const pts=applyPP(calcPts(back9[i],holePars[gh],activeHcp,hn),hn);
    const{bg,tc}=scoreColors(Math.min(pts,isPPHole?pts:pts));
    return{bg,border:tc+"44",label:`${back9[i]}`,sub:`${pts}pt`,tc,nc:C.ink};
  }
  function ptsColor(pts){if(pts>=4)return C.eagleText;if(pts===3)return C.birdieText;if(pts===2)return C.parText;if(pts===1)return C.bogeyText;return C.doubleText;}

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",background:"#0e1912",minHeight:"100vh",position:"relative"}}>
      <div style={{background:`linear-gradient(135deg,${C.greenDeep} 0%,#172d1f 100%)`,padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`2px solid ${C.gold}`,flexShrink:0}}>
        <TIULogo size="header"/>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{textAlign:"right"}}>
            <div style={{...T.body,color:C.white,fontWeight:700,fontSize:12.5}}>{player.name}</div>
            <div style={{...T.body,color:C.goldPale,fontSize:10.5,marginTop:1}}>{mockTrip.name}</div>
          </div>
          <GoldAvatar initials={player.initials} size={36}/>
          <div style={{background:"rgba(201,168,76,.18)",border:`1px solid ${C.gold}`,borderRadius:16,padding:"3px 9px",...T.body,color:C.goldLight,fontSize:10,fontWeight:700}}>PASS</div>
        </div>
      </div>

      <ProgressBar step={4}/>

      <div style={{background:"linear-gradient(90deg,#14532d,#166534)",padding:"7px 16px",display:"flex",alignItems:"center",gap:8,borderBottom:"1px solid rgba(255,255,255,.08)",flexShrink:0}}>
        <span style={{fontSize:13}}>🔴</span>
        <span style={{...T.body,color:"#86efac",fontSize:12,fontWeight:700,letterSpacing:.3}}>
          {ppOn?`🔴 LIVE — Round 1 · ⚡ Powerplay H${ppHole} active`:"🔴 LIVE — Round 1 · Back 9 in play"}
        </span>
        <div style={{marginLeft:"auto",display:"flex",flexDirection:"column",alignItems:"flex-end",gap:1}}>
          <div style={{...T.body,color:"rgba(134,239,172,.6)",fontSize:10}}>8 players active</div>
          <div style={{...T.body,color:"rgba(134,239,172,.4)",fontSize:9}}>Live syncing…</div>
        </div>
      </div>

      {liveToast&&(
        <div style={{position:"fixed",top:72,left:"50%",transform:"translateX(-50%)",zIndex:200,pointerEvents:"none",background:"rgba(10,30,18,.97)",border:`1px solid ${C.gold}66`,borderRadius:22,padding:"8px 18px",whiteSpace:"nowrap",animation:"toastSlide .3s ease-out",boxShadow:"0 4px 24px rgba(0,0,0,.7)",maxWidth:"90vw"}}>
          <span style={{...T.body,fontSize:12,color:C.goldLight,fontWeight:700}}>● {liveToast}</span>
        </div>
      )}

      <div style={{flex:1,display:"flex",flexDirection:"column",overflowY:"auto"}}>
        <div style={{padding:"10px 16px 6px",flexShrink:0}}>
          <div style={{...T.body,fontSize:9,fontWeight:700,letterSpacing:1,color:"rgba(134,239,172,.6)",marginBottom:4}}>✓ FRONT 9 COMPLETE — {front9pts} PTS</div>
          <div style={{display:"flex",gap:3,overflowX:"auto",marginBottom:8}}>
            {front9User.map((s,i)=>{
              const pts=applyPP(calcPts(s,holePars[i],activeHcp,i+1),i+1);
              const{bg,tc}=scoreColors(pts);
              const isPP=ppOn&&(i+1)===ppHole;
              return(
                <div key={i} style={{minWidth:32,height:40,borderRadius:6,flexShrink:0,background:bg,border:`1px solid ${isPP?C.gold:tc+"44"}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",opacity:0.72,boxShadow:isPP?`0 0 6px ${C.gold}44`:undefined}}>
                  <div style={{...T.body,fontSize:11,fontWeight:700,color:C.ink}}>{s}</div>
                  <div style={{...T.body,fontSize:8,fontWeight:600,color:isPP?C.goldDark:tc}}>{isPP?"⚡":""}{pts}pt</div>
                </div>
              );
            })}
          </div>
          <div style={{...T.body,fontSize:9,fontWeight:700,letterSpacing:1,color:"rgba(255,255,255,.35)",marginBottom:4}}>BACK 9 — ENTERING NOW</div>
          <div style={{display:"flex",gap:5,overflowX:"auto",paddingRight:16,WebkitOverflowScrolling:"touch"}}>
            {Array.from({length:9}).map((_,i)=>{
              const on=i===holeIdx;
              const hn=BACK9_START+i+1;
              const isThisPP=ppOn&&hn===ppHole;
              const hasSG=!!getSG(BACK9_START+i);
              const{bg,border,label,sub,tc,nc}=tileMeta(i);
              return(
                <div key={i} className="hole-tap" onClick={()=>{if(confirmed[i]||i<=holeIdx)setHoleIdx(i);}} style={{minWidth:38,height:50,borderRadius:8,flexShrink:0,cursor:"pointer",background:on?`linear-gradient(160deg,${C.greenBright},${C.greenMid})`:bg,border:`1.5px solid ${on?C.goldLight:border}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",transition:"transform .12s",transform:on?"scale(1.1)":"scale(1)",boxShadow:on?`0 4px 14px rgba(45,122,82,.5),0 0 0 1px ${C.gold}44`:isThisPP?`0 0 8px ${C.gold}55`:undefined,position:"relative"}}>
                  <div style={{...T.body,fontSize:13,fontWeight:700,color:on?C.white:nc}}>{label}</div>
                  <div style={{...T.body,fontSize:9.5,fontWeight:600,color:on?C.goldLight:tc}}>{sub}</div>
                  {hasSG&&<div style={{position:"absolute",top:2,right:3,fontSize:8}}>⭐</div>}
                  {isThisPP&&!on&&<div style={{position:"absolute",bottom:2,right:2,fontSize:7}}>⚡</div>}
                </div>
              );
            })}
          </div>
        </div>

        {upcomingSG&&(
          <div style={{margin:"0 16px 8px",borderRadius:9,flexShrink:0,background:"rgba(201,168,76,.10)",border:"1px solid rgba(201,168,76,.28)",padding:"8px 12px",display:"flex",alignItems:"center",gap:9,animation:"fadeIn .3s"}}>
            <span style={{fontSize:15,flexShrink:0}}>{upcomingSG.icon}</span>
            <div>
              <div style={{...T.body,fontSize:11.5,color:C.goldLight,fontWeight:700}}>Coming up: {upcomingSG.name}</div>
              <div style={{...T.body,fontSize:10.5,color:"rgba(245,230,184,.55)"}}>{upcomingSG.label} · Next hole</div>
            </div>
          </div>
        )}
        {activeSG&&(
          <div style={{margin:"0 16px 8px",borderRadius:9,flexShrink:0,background:`linear-gradient(90deg,rgba(201,168,76,.18),rgba(201,168,76,.09))`,border:`1.5px solid ${C.gold}`,padding:"9px 13px",display:"flex",alignItems:"center",gap:10,animation:"fadeIn .3s"}}>
            <span style={{fontSize:20,flexShrink:0}}>{activeSG.icon}</span>
            <div style={{flex:1}}>
              <div style={{...T.body,fontSize:13,color:C.goldLight,fontWeight:800}}>{activeSG.name} — Active</div>
              <div style={{...T.body,fontSize:11,color:"rgba(245,230,184,.65)"}}>{activeSG.label} · Result tracked automatically</div>
            </div>
            <div style={{background:"rgba(201,168,76,.25)",border:`1px solid ${C.gold}`,borderRadius:8,padding:"3px 9px",...T.body,fontSize:10,color:C.goldLight,fontWeight:700}}>COMP</div>
          </div>
        )}
        {isPPHole&&(
          <div style={{margin:"0 16px 8px",borderRadius:9,flexShrink:0,background:`linear-gradient(90deg,rgba(201,168,76,.2),rgba(201,168,76,.08))`,border:`1.5px solid ${C.gold}`,padding:"9px 13px",display:"flex",alignItems:"center",gap:8,animation:"fadeIn .3s"}}>
            <span style={{fontSize:18}}>⚡</span>
            <div style={{...T.body,fontSize:13,color:C.goldLight,fontWeight:800}}>Powerplay Active — 2× Points</div>
          </div>
        )}

        <div style={{margin:"0 16px 8px",borderRadius:10,flexShrink:0,background:"rgba(201,168,76,.07)",border:"1px solid rgba(201,168,76,.2)",padding:"10px 13px"}}>
          <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:5}}>
            <span style={{fontSize:13}}>⛳</span>
            <div style={{...T.body,fontSize:10,fontWeight:800,color:C.goldMid,letterSpacing:1.3,textTransform:"uppercase"}}>Pro Tip</div>
            <div style={{...T.body,fontSize:9.5,color:"rgba(245,230,184,.36)"}}>· Hole {holeNo} · Cape Wickham</div>
          </div>
          <div style={{...T.body,fontSize:12.5,color:"rgba(245,230,184,.76)",lineHeight:1.65,fontStyle:"italic"}}>"{holeData.tip}"</div>
        </div>

        <div style={{margin:"0 16px 8px",borderRadius:14,background:"#161f19",border:"1.5px solid rgba(255,255,255,.07)",boxShadow:"0 6px 28px rgba(0,0,0,.5)",flexShrink:0,overflow:"hidden",position:"relative"}}>
          <div style={{background:`linear-gradient(90deg,${C.greenDeep},#1a3828)`,padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid rgba(255,255,255,.06)"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <GoldAvatar initials={player.initials} size={34}/>
              <div>
                <div style={{...T.body,color:C.white,fontWeight:700,fontSize:14}}>{player.name}</div>
                <div style={{...T.body,color:C.goldPale,fontSize:11,opacity:.7}}>Daily HCP {activeHcp}</div>
              </div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{...T.display,color:isPPHole?C.goldLight:C.goldLight,fontSize:20,fontWeight:800,lineHeight:1}}>H{holeNo}{isPPHole?" ⚡":""}</div>
              <div style={{...T.body,color:"rgba(255,255,255,.45)",fontSize:11}}>Par {par} · Index {holeData.hcpIdx}</div>
            </div>
          </div>

          <div style={{padding:"16px 16px 12px"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
              <button className="btn-press" onClick={()=>pick(-1)} style={{width:64,height:64,borderRadius:14,flexShrink:0,background:"rgba(255,255,255,.06)",border:"1.5px solid rgba(255,255,255,.12)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
                <span style={{color:"rgba(255,255,255,.7)",fontSize:28,fontWeight:300}}>−</span>
              </button>
              <div style={{flex:1,textAlign:"center"}}>
                <div style={{...T.display,color:selected===null?"rgba(255,255,255,.25)":C.white,fontSize:64,fontWeight:800,lineHeight:1}}>{selected===null?"0":selected}</div>
                {displayPts!==null?(
                  <div style={{...T.body,fontSize:13,fontWeight:700,marginTop:2,color:ptsColor(displayPts)}}>
                    {displayPts} {displayPts===1?"Point":"Points"}{isPPHole?" ⚡":""}
                  </div>
                ):(
                  <div style={{...T.body,fontSize:12,color:"rgba(255,255,255,.3)",marginTop:2}}>tap + to add shots · or tap PAR</div>
                )}
              </div>
              <button className="btn-press" onClick={()=>pick(+1)} style={{width:64,height:64,borderRadius:14,flexShrink:0,background:"rgba(255,255,255,.06)",border:"1.5px solid rgba(255,255,255,.12)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
                <span style={{color:"rgba(255,255,255,.7)",fontSize:28,fontWeight:300}}>+</span>
              </button>
            </div>
            <div style={{display:"flex",gap:8,marginTop:12,borderTop:"1px solid rgba(255,255,255,.06)",paddingTop:10}}>
              {/* PAR quick-tap button */}
              <button className="btn-press" onClick={pickPar} style={{flex:1,textAlign:"center",background:selected===par?"rgba(74,158,114,.25)":"rgba(255,255,255,.04)",borderRadius:8,padding:"7px 4px",border:selected===par?"1px solid rgba(74,158,114,.5)":"1px solid rgba(255,255,255,.06)",cursor:"pointer",transition:"all .15s"}}>
                <div style={{...T.body,fontSize:9.5,fontWeight:700,color:selected===par?"#4ade80":"rgba(255,255,255,.4)",letterSpacing:.8,marginBottom:3}}>PAR</div>
                <div style={{...T.display,fontSize:18,fontWeight:800,color:selected===par?"#4ade80":C.white}}>{par}</div>
              </button>
              {/* SHOTS info tile */}
              <div style={{flex:1,textAlign:"center",background:"rgba(255,255,255,.04)",borderRadius:8,padding:"7px 4px",border:"1px solid rgba(255,255,255,.06)"}}>
                <div style={{...T.body,fontSize:9.5,fontWeight:700,color:"rgba(255,255,255,.4)",letterSpacing:.8,marginBottom:3}}>SHOTS</div>
                <div style={{...T.display,fontSize:18,fontWeight:800,color:C.white}}>{(()=>{const si=holeData.hcpIdx;return Math.floor(activeHcp/18)+(si<=activeHcp%18?1:0);})()}</div>
              </div>
              {/* TOTAL info tile — cumulative Stableford running total */}
              <div style={{flex:1,textAlign:"center",background:"rgba(201,168,76,.08)",borderRadius:8,padding:"7px 4px",border:"1px solid rgba(201,168,76,.22)"}}>
                <div style={{...T.body,fontSize:9.5,fontWeight:700,color:C.goldMid,letterSpacing:.8,marginBottom:3}}>TOTAL</div>
                <div style={{...T.display,fontSize:18,fontWeight:800,color:C.goldLight}}>{totalPts}</div>
              </div>
            </div>
          </div>

          {activeSG&&activeSG.unit&&(
            <div style={{borderTop:"1px solid rgba(201,168,76,.18)",padding:"10px 16px 12px",background:"rgba(201,168,76,.05)"}}>
              <div style={{...T.body,fontSize:11,color:C.goldLight,fontWeight:700,marginBottom:6}}>{activeSG.icon} {activeSG.name} — Enter your result</div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <input type="number" inputMode="decimal" placeholder="e.g. 3.2" value={metresVal} onChange={e=>setMetresVal(e.target.value)} style={{flex:1,padding:"10px 12px",background:"rgba(255,255,255,.07)",border:"1px solid rgba(201,168,76,.4)",borderRadius:9,color:C.white,fontSize:16,fontWeight:700,outline:"none",...T.body}}/>
                <div style={{...T.body,fontSize:13,color:"rgba(245,230,184,.6)",fontWeight:600}}>{activeSG.unit}</div>
              </div>
              {metresVal&&(
                <div style={{...T.body,fontSize:12,color:parseFloat(metresVal)<3?"#4ade80":"rgba(245,230,184,.6)",marginTop:6,fontWeight:700,animation:"fadeIn .2s"}}>
                  {parseFloat(metresVal)<3?"🏁 New leader — closest to pin!":"Close — currently 2nd"}
                </div>
              )}
            </div>
          )}

          {activeSG&&activeSG.type==="drive"&&(
            <div style={{borderTop:"1px solid rgba(201,168,76,.18)",padding:"10px 16px 12px",background:"rgba(201,168,76,.05)"}}>
              <div style={{...T.body,fontSize:11,color:C.goldLight,fontWeight:700,marginBottom:8}}>💥 Longest Drive — Are you the longest?</div>
              {scDrive&&<div style={{...T.body,fontSize:11,color:"rgba(255,255,255,.45)",marginBottom:8}}>Current leader: <strong style={{color:"#4ade80"}}>{scDrive.name}</strong></div>}
              <div style={{display:"flex",gap:8}}>
                {[true,false].map(val=>(
                  <button key={String(val)} onClick={()=>{setIsLongest(val);if(val){setDriveFlash(true);setTimeout(()=>setDriveFlash(false),900);}}} style={{flex:1,padding:"9px 0",borderRadius:9,background:isLongest===val?(val?"rgba(22,163,74,.85)":"rgba(80,80,80,.7)"):"rgba(255,255,255,.07)",border:isLongest===val?(val?"1.5px solid #4ade80":"1.5px solid rgba(255,255,255,.3)"):"1.5px solid rgba(255,255,255,.12)",...T.body,fontSize:13,fontWeight:700,color:isLongest===val?"#fff":"rgba(255,255,255,.6)",cursor:"pointer",transition:"all .15s",animation:val&&driveFlash?"drivePulse .7s":undefined}}>{val?"Yes — I am":"No — not me"}</button>
                ))}
              </div>
              {isLongest===true&&<div style={{...T.body,fontSize:12,color:"#4ade80",marginTop:6,fontWeight:700,animation:"fadeIn .3s"}}>🔥 You take the lead!</div>}
            </div>
          )}

          {flash&&flashPts!==null&&(
            <div style={{position:"absolute",top:"36%",left:"50%",transform:"translate(-50%,-50%)",zIndex:20,pointerEvents:"none",background:flashPts>=3?"rgba(14,122,52,.95)":flashPts===2?"rgba(28,90,165,.92)":"rgba(60,60,60,.88)",borderRadius:14,padding:"10px 24px",textAlign:"center",boxShadow:"0 8px 32px rgba(0,0,0,.5)",animation:"fadeIn .12s",minWidth:160}}>
              <div style={{...T.display,color:"#fff",fontSize:20,fontWeight:800,lineHeight:1.2}}>{flashMsg}</div>
              {flashPts>0&&flashPts<=5&&<div style={{...T.body,color:"rgba(255,255,255,.7)",fontSize:12,marginTop:3}}>+{flashPts} Stableford pt{flashPts!==1?"s":""}{isPPHole?" ⚡":""}</div>}
            </div>
          )}

          <div style={{padding:"0 16px 14px"}}>
            <button onClick={function(){
          unlockAudio();
          trackEvent("score_confirmed",{hole:holeIdx+10});
          confirm();
        }} disabled={selected===null} style={{width:"100%",padding:"14px",background:flash?"#16a34a":(selected!==null&&selected>0)?`linear-gradient(135deg,${C.greenBright},#16a34a)`:"rgba(255,255,255,.08)",color:C.white,border:"none",borderRadius:10,fontSize:15,fontWeight:700,...T.body,cursor:(selected!==null&&selected>0)?"pointer":"not-allowed",letterSpacing:.5,transition:"background .2s",boxShadow:selected!==null?"0 4px 16px rgba(22,163,74,.4)":"none"}}>{flash?"✓ Saved!":"✓ Confirm Score"}</button>
          </div>
        </div>

        <div style={{padding:"4px 16px 6px",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div style={{...T.body,fontSize:12,color:"rgba(255,255,255,.38)"}}>F9: <strong style={{color:"rgba(134,239,172,.7)"}}>{front9pts}</strong>{"  +  "}B9: <strong style={{color:"rgba(255,255,255,.6)"}}>{back9pts}</strong></div>
          <div style={{...T.body,fontSize:14,color:C.goldLight,fontWeight:800}}>{totalPts} pts</div>
        </div>

        <div style={{margin:"6px 16px 20px",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
            <div style={{...T.body,fontSize:10.5,fontWeight:700,color:C.goldMid,letterSpacing:.8,textTransform:"uppercase"}}>🏆 Live Leaderboard</div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{...T.body,color:"rgba(134,239,172,.55)",fontSize:9.5}}>3 scoring now</div>
              <div style={{background:"#16a34a",color:C.white,...T.body,fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:10}}>● LIVE</div>
            </div>
          </div>
          <div style={{background:"#111a14",borderRadius:12,border:"1px solid rgba(201,168,76,.2)",overflow:"hidden"}}>
            {/* Compact top-3 preview — hidden when expanded */}
            {!showFullLB&&board.slice(0,3).map((p,rank)=>{
              const isUser=p.id===1;
              const thruHoles=(p.id===1?holesConfirmed:(liveThru[p.id]??0));
              const isRecent=recentUp===p.id&&thruHoles<9;
              const prev=prevRanks[p.id]??null;
              const movedUp=prev!==null&&prev>rank;
              const movedDown=prev!==null&&prev<rank;
              return(
                <div key={p.id} style={{display:"flex",alignItems:"center",padding:"7px 12px",borderBottom:"1px solid rgba(255,255,255,.04)",background:isRecent?"rgba(22,163,74,.18)":isUser?"rgba(201,168,76,.09)":"transparent",transition:"background .4s"}}>
                  <div style={{width:24}}><span style={{fontSize:13}}>{medals[rank]}</span></div>
                  <div style={{flex:1,marginLeft:4,...T.body,fontSize:14,fontWeight:isUser?800:600,color:isUser?C.goldLight:C.white}}>{p.name}</div>
                  <div style={{display:"flex",alignItems:"center",gap:4}}>
                    {holesConfirmed<BACK9_HOLES&&movedUp&&<span style={{fontSize:10,color:"#22c55e",fontWeight:900}}>▲</span>}
                    {holesConfirmed<BACK9_HOLES&&movedDown&&<span style={{fontSize:10,color:"#ef4444",fontWeight:900}}>▼</span>}
                    <div style={{...T.body,fontSize:13,fontWeight:600,color:isUser?C.goldLight:"rgba(255,255,255,.68)"}}>{p.total}<span style={{fontSize:10,opacity:.5}}> pts</span></div>
                  </div>
                </div>
              );
            })}
            {/* Your position — hidden when expanded */}
            {!showFullLB&&board.findIndex(p=>p.id===1)>=3&&board[board.findIndex(p=>p.id===1)]&&(
              <div style={{padding:"5px 12px",borderTop:"1px dashed rgba(255,255,255,.08)"}}>
                <div style={{...T.body,fontSize:9.5,color:"rgba(255,255,255,.3)",marginBottom:3,letterSpacing:.5}}>YOUR POSITION</div>
                <div style={{display:"flex",alignItems:"center",padding:"4px 0"}}>
                  <div style={{width:24,...T.body,fontSize:12,fontWeight:700,color:"rgba(255,255,255,.4)"}}>{board.findIndex(p=>p.id===1)+1}.</div>
                  <div style={{flex:1,marginLeft:4,...T.body,fontSize:12.5,fontWeight:700,color:C.goldLight}}>{board[board.findIndex(p=>p.id===1)].name}</div>
                  <div style={{...T.body,fontSize:13,fontWeight:700,color:C.goldLight}}>{board[board.findIndex(p=>p.id===1)].total}<span style={{fontSize:10,opacity:.55}}> pts</span></div>
                </div>
              </div>
            )}
            {/* Expand toggle */}
            <div onClick={()=>setShowFullLB(v=>!v)} style={{padding:"6px 12px",textAlign:"center",cursor:"pointer",borderTop:"1px solid rgba(255,255,255,.05)",background:"rgba(255,255,255,.03)"}}>
              <span style={{...T.body,fontSize:10.5,fontWeight:700,color:"rgba(201,168,76,.6)",letterSpacing:.3}}>{showFullLB?"Show Less ↑":"View Full Leaderboard ↓"}</span>
            </div>
            {/* Full leaderboard — shown when expanded */}
            {showFullLB&&(
              <div style={{borderTop:"1px solid rgba(255,255,255,.06)"}}>
                <div style={{display:"flex",padding:"6px 12px",background:"rgba(201,168,76,.08)",borderBottom:"1px solid rgba(255,255,255,.05)"}}>
                  <div style={{width:28,...T.body,fontSize:9.5,color:"rgba(255,255,255,.35)",fontWeight:700}}>#</div>
                  <div style={{flex:1,...T.body,fontSize:9.5,color:"rgba(255,255,255,.35)",fontWeight:700}}>PLAYER</div>
                  <div style={{width:44,textAlign:"center",...T.body,fontSize:9.5,color:"rgba(255,255,255,.35)",fontWeight:700}}>THRU</div>
                  <div style={{width:44,textAlign:"right",...T.body,fontSize:9.5,color:"rgba(255,255,255,.35)",fontWeight:700}}>PTS</div>
                </div>
                {board.map((p,rank)=>{
                const isUser=p.id===1,isTop=rank===0;
                const thruHoles=(p.id===1?holesConfirmed:(liveThru[p.id]??0));
                const isRecent=recentUp===p.id&&thruHoles<9;
                const prev=prevRanks[p.id]??null;
                const movedUp=prev!==null&&prev>rank;
                const movedDown=prev!==null&&prev<rank;
                const thruDisp=thruHoles;
                return(
                <div key={p.id} style={{display:"flex",alignItems:"center",padding:"10px 12px",borderBottom:rank<board.length-1?"1px solid rgba(255,255,255,.04)":"none",background:isRecent?"rgba(22,163,74,.18)":isUser?"rgba(201,168,76,.09)":"transparent",transition:"background .4s"}}>
                  <div style={{width:28,display:"flex",flexDirection:"column",alignItems:"center",gap:1}}>
                    {rank<3?<span style={{fontSize:12}}>{medals[rank]}</span>:<span style={{...T.body,fontSize:11.5,color:"rgba(255,255,255,.35)",fontWeight:600}}>{rank+1}</span>}
                  </div>
                  <Avatar player={p} size={26}/>
                  <div style={{flex:1,marginLeft:8}}>
                    <div style={{display:"flex",alignItems:"center",gap:4}}>
                      <span style={{...T.body,fontSize:13.5,fontWeight:isUser?800:600,color:isUser?C.goldLight:isRecent?"#86efac":C.white}}>{p.name.split(" ")[0]}{isUser?" ☆":""}</span>
                      {holesConfirmed<BACK9_HOLES&&movedUp&&<span style={{fontSize:11,color:"#22c55e",fontWeight:900,lineHeight:1}}>▲</span>}
                      {holesConfirmed<BACK9_HOLES&&movedDown&&<span style={{fontSize:11,color:"#ef4444",fontWeight:900,lineHeight:1}}>▼</span>}
                    </div>
                  </div>
                  <div style={{width:44,textAlign:"center"}}>
                    <div style={{...T.body,fontSize:11,color:"rgba(255,255,255,.45)"}}>{thruDisp>0?`Thru ${thruDisp+9}`:"F9 ✓"}</div>
                  </div>
                  <div style={{width:44,textAlign:"right"}}>
                    <span style={{...T.display,fontSize:17,fontWeight:800,color:isTop?"#4ade80":isUser?C.goldLight:isRecent?"#86efac":C.white}}>{p.total}</span>
                    <span style={{...T.body,fontSize:9,color:"rgba(255,255,255,.3)",marginLeft:2}}>pts</span>
                  </div>
                </div>
              );
            })}
              </div>
            )}
          </div>
        </div>

        {/* ── Compact Side Comp Preview ── */}
        {(()=>{
          const appLeader=pinLeader(scApproach);
          const pinLdr=pinLeader(scPin);
          const sideData=[
            {ic:"🎯",name:"Pro's Approach",hole:"H12",holeIdx:11,leader:appLeader?{name:appLeader.name,detail:`${appLeader.distance}m`}:null},
            {ic:"💥",name:"Longest Drive",  hole:"H15",holeIdx:14,leader:scDrive?{name:scDrive.name,detail:"Longest"}:null},
            {ic:"📍",name:"Nearest Pin",    hole:"H17",holeIdx:16,leader:pinLdr?{name:pinLdr.name,detail:`${pinLdr.distance}m`}:null},
          ];
          return(
            <div style={{margin:"0 16px 20px",flexShrink:0}}>
              <div style={{...T.body,fontSize:10.5,fontWeight:700,color:C.goldMid,letterSpacing:.8,textTransform:"uppercase",marginBottom:7}}>Side Competitions</div>
              <div style={{background:"#111a14",borderRadius:12,border:"1px solid rgba(201,168,76,.18)",overflow:"hidden"}}>
                {sideData.map((sc,i)=>{
                  const past=holesConfirmed>sc.holeIdx-9;
                  const active=holeIdx===sc.holeIdx-9;
                  return(
                    <div key={i} style={{display:"flex",alignItems:"center",padding:"8px 12px",borderBottom:i<sideData.length-1?"1px solid rgba(255,255,255,.05)":"none",background:active?"rgba(201,168,76,.1)":"transparent"}}>
                      <span style={{fontSize:14,width:20,flexShrink:0}}>{sc.ic}</span>
                      <div style={{flex:1,marginLeft:8}}>
                        <span style={{...T.body,fontSize:11.5,fontWeight:600,color:past?C.white:"rgba(255,255,255,.4)"}}>{sc.name}</span>
                        {sc.leader?<span style={{...T.body,fontSize:10.5,color:"#4ade80",marginLeft:6}}>— {sc.leader.name} {sc.leader.detail}</span>:<span style={{...T.body,fontSize:10,color:"rgba(255,255,255,.28)",marginLeft:5}}>{past?"pending":"coming up"}</span>}
                      </div>
                      <div style={{...T.body,fontSize:9,fontWeight:700,padding:"2px 6px",borderRadius:7,background:past?"rgba(22,163,74,.22)":"rgba(255,255,255,.05)",color:past?"#4ade80":"rgba(255,255,255,.28)"}}>{past?"DONE":"UP"}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </div>
      <NavBar active="leaderboard"/>
    </div>
  );
}

// ─── SCREEN 5 · LEADERBOARD ───────────────────────────────────────────────────
function LeaderboardScreen({userScores,scRes,cfg,dailyHcps,finalBoard}) {
  const [tab,setTab]=useState("overall");
  const [expanded,setExpanded]=useState(null);
  const [a,setA]=useState(false);
  const [showWinner,setShowWinner]=useState(true);
  const [ctaShareToast,setCtaShareToast]=useState(false);
  const [showCtaPanel,setShowCtaPanel]=useState(false);
  function ctaShareText(msg){var _b=board&&board.length>0?board[0]:null;doShare(msg,function(){setCtaShareToast(true);setShowCtaPanel(false);setTimeout(function(){setCtaShareToast(false);},2800);});setShowCtaPanel(false);}
  const CTA_MSG_ORG="Thought you'd like this — it's a golf trip scoring app that runs live leaderboards, Stableford scoring, side comps and final results automatically. Could be perfect for your next trip.\n\nhttps://app-test-drive-v12.vercel.app/";
  const CTA_MSG_PLY="Here's the scoring app we're looking at for the trip. It gives everyone live scoring, side comps, leaderboards and final results without all the spreadsheet/admin chaos.\n\nhttps://app-test-drive-v12.vercel.app/";
  const prevRanks={1:4,2:1,3:6,4:5,5:2,6:3,7:7,8:8};
  const ppOn=cfg?.powerplayOn===true;
  const ppHole=ppOn?(cfg?.powerplayHole??16):null;
  function applyPP(pts,holeNo){return(ppHole&&holeNo===ppHole&&pts>0)?pts*2:pts;}

  useEffect(()=>{const t=setTimeout(()=>setA(true),120);return()=>clearTimeout(t);},[]);

  // Use dailyHcps if available, fall back to original hcp
  function getHcp(p){return(dailyHcps&&dailyHcps[p.id]!==undefined)?dailyHcps[p.id]:p.hcp;}
  // Use the exact final board snapshot from live scoring if available (single source of truth)
  const board=(()=>{
    if(finalBoard&&finalBoard.length>0){
      // finalBoard is the exact state from buildBoard() at round completion
      return finalBoard.map(p=>({...p,r1:p.total,r2:null})).sort((a,b)=>b.total-a.total);
    }
    // Fallback: reconstruct from scores (used if finalBoard not yet set)
    return mockTrip.players.map(p=>{
      const hcp=getHcp(p);
      let scores18;
      if(p.id===1){
        scores18=(userScores&&userScores.length===18)
          ?userScores.map((v,i)=>v!==null&&v>0?v:mockScores[1][i])
          :mockScores[1];
      } else {
        scores18=[...mockScores[p.id].slice(0,9),...otherBack9[p.id]];
      }
      const pts=scores18.map((sc,i)=>applyPP(calcPts(sc,holePars[i],hcp,i+1),i+1));
      const r1=pts.reduce((a,b)=>a+b,0);
      return{...p,scores:scores18,pts,hcp,r1,r2:null,total:r1};
    }).sort((a,b)=>b.total-a.total);
  })();
  const winner=board[0];

  function pinLeaderLB(entries){if(!entries||!entries.length)return null;return entries.reduce((a,b)=>a.distance<=b.distance?a:b);}
  const appRes=pinLeaderLB(scRes?.approach);
  const pinRes=pinLeaderLB(scRes?.pin);
  const driveRes=scRes?.drive;
  const sideW=[
    {ic:"🎯",name:"Pro's Approach",hole:"H12 · Par 4",winnerName:appRes?appRes.name:"Tom",detail:appRes?`${appRes.name} — ${appRes.distance}m from pin`:"Tom Rafferty — 1.8m from pin",winnerPlayer:appRes?mockTrip.players.find(p=>p.name.includes(appRes.name))||mockTrip.players[4]:mockTrip.players[4]},
    {ic:"💥",name:"Longest Drive",  hole:"H15 · Par 5",winnerName:driveRes?driveRes.name:"Dave",detail:driveRes?`${driveRes.name} — Longest Drive`:"Dave Walsh — Longest Drive",winnerPlayer:driveRes?mockTrip.players.find(p=>p.name.includes(driveRes.name))||mockTrip.players[1]:mockTrip.players[1]},
    {ic:"📍",name:"Nearest the Pin",hole:"H17 · Par 3",winnerName:pinRes?pinRes.name:"Liam",detail:pinRes?`${pinRes.name} — ${pinRes.distance}m from pin`:"Liam O'Brien — 2.2m from pin",winnerPlayer:pinRes?mockTrip.players.find(p=>p.name.includes(pinRes.name))||mockTrip.players[5]:mockTrip.players[5]},
  ];
  const medals=["🥇","🥈","🥉"];

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",background:C.cream,minHeight:"100vh"}}>
      <Header/>
      <ProgressBar step={5}/>
      {showWinner&&<WinnerOverlay winner={winner} sideW={sideW} onClose={()=>setShowWinner(false)} finalBoard={finalBoard}/>}

      <div style={{background:`linear-gradient(135deg,${C.greenDeep} 0%,#1e5c38 100%)`,padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid rgba(201,168,76,.25)",flexShrink:0}}>
        <div>
          <div style={{...T.body,color:C.goldMid,fontSize:10.5,letterSpacing:.8,textTransform:"uppercase"}}>🌏 Live Trip</div>
          <div style={{...T.display,color:C.white,fontSize:15,fontWeight:700}}>{mockTrip.name}</div>
        </div>
        <div style={{background:"#16a34a",color:C.white,...T.body,fontSize:12,fontWeight:700,padding:"4px 11px",borderRadius:20,letterSpacing:.3}}>● LIVE</div>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"12px 16px 0"}}>
        <div style={{...T.display,color:C.green,fontSize:16,fontWeight:700,marginBottom:10,letterSpacing:.2}}>🏆 Final Leaderboard — {mockTrip.name}</div>
        <div style={{display:"flex",background:C.parchment,borderRadius:10,padding:3,marginBottom:12,border:`1px solid ${C.parchmentDark}`}}>
          {[["overall","Overall"],["round1","Round 1"],["round2","Round 2"]].map(([k,l])=>(
            <button key={k} onClick={()=>setTab(k)} style={{flex:1,padding:"9px 0",background:tab===k?C.white:"transparent",border:"none",borderRadius:8,...T.body,fontSize:13,fontWeight:tab===k?700:400,color:tab===k?C.ink:C.inkLight,cursor:"pointer",boxShadow:tab===k?"0 1px 5px rgba(0,0,0,.09)":"none",transition:"all .18s"}}>{l}</button>
          ))}
        </div>

        {tab==="round2"&&(
          <div style={{marginBottom:14,opacity:a?1:0,transition:"opacity .4s .1s"}}>
            <div style={{background:"#fff7ed",border:"1.5px solid #fed7aa",borderRadius:12,padding:"16px 16px",display:"flex",alignItems:"flex-start",gap:12}}>
              <span style={{fontSize:20,flexShrink:0,marginTop:1}}>🔒</span>
              <div>
                <div style={{...T.body,fontSize:14,fontWeight:700,color:"#c2410c",marginBottom:4}}>Round 2 Not Started</div>
                <div style={{...T.body,fontSize:12.5,color:"#9a3412",lineHeight:1.6}}>Scorecards locked until the organiser starts the round.</div>
                <div style={{...T.body,fontSize:11.5,color:"#b45309",marginTop:8,fontWeight:600}}>Round 1 is complete — results above.</div>
              </div>
            </div>
          </div>
        )}
        {tab!=="round2"&&(
        <Card noPad style={{marginBottom:14,opacity:a?1:0,transform:a?"translateY(0)":"translateY(12px)",transition:"opacity .5s .2s,transform .5s .2s"}}>
          <div style={{display:"flex",padding:"8px 14px",background:C.parchment,borderBottom:`1px solid ${C.parchmentDark}`}}>
            <div style={{width:32,...T.body,fontSize:10.5,color:C.inkFaint,fontWeight:700}}>#</div>
            <div style={{flex:1,...T.body,fontSize:10.5,color:C.inkFaint,fontWeight:700,letterSpacing:.6}}>PLAYER</div>
            {tab==="overall"&&<div style={{width:30,...T.body,fontSize:10.5,color:C.inkFaint,fontWeight:700,textAlign:"center"}}>R1</div>}
            {tab==="overall"&&<div style={{width:30,...T.body,fontSize:10.5,color:C.inkFaint,fontWeight:700,textAlign:"center"}}>R2</div>}
            <div style={{width:56,...T.body,fontSize:10.5,color:C.inkFaint,fontWeight:700,textAlign:"right"}}>TOTAL</div>
          </div>
          {board.map((p,rank)=>{
            const isExp=expanded===p.id,isTop=rank===0;
            // Round complete — no arrows shown on final leaderboard
            return(
              <div key={p.id}>
                <div onClick={()=>setExpanded(isExp?null:p.id)} style={{display:"flex",alignItems:"center",padding:"11px 14px",borderBottom:`1px solid ${C.parchment}`,cursor:"pointer",background:isTop?`linear-gradient(90deg,rgba(201,168,76,.065),transparent)`:C.ivory,boxShadow:isTop?"inset 0 0 0 1.5px rgba(201,168,76,.3)":"none",transition:"box-shadow .3s"}}>
                  <div style={{width:32}}>{rank<3?<span style={{fontSize:18}}>{medals[rank]}</span>:<span style={{...T.body,fontSize:14,fontWeight:700,color:C.inkFaint}}>{rank+1}</span>}</div>
                  <Avatar player={p} size={34}/>
                  <div style={{flex:1,marginLeft:10}}>
                    <div style={{display:"flex",alignItems:"center",gap:5}}>
                      <span style={{...T.body,fontSize:14,fontWeight:600,color:C.ink}}>{p.name}</span>

                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginTop:2}}>
                      <span style={{...T.body,fontSize:11,color:C.inkLight}}>HCP {p.hcp}</span>
                      <span style={{background:"#f0faf4",border:"1px solid #86efac",borderRadius:4,padding:"1px 6px",...T.body,fontSize:10,fontWeight:700,color:"#15803d"}}>✓ F</span>
                    </div>
                  </div>
                  {tab==="overall"&&<div style={{width:30,textAlign:"center",...T.body,fontSize:13,color:C.inkMid}}>{p.r1}</div>}
                  {tab==="overall"&&<div style={{width:30,textAlign:"center",...T.body,fontSize:13,color:C.inkFaint}}>{"—"}</div>}
                  <div style={{width:56,textAlign:"right"}}>
                    <span style={{...T.display,fontSize:21,fontWeight:800,color:isTop?C.green:C.ink}}>{p.total}</span>
                    <span style={{...T.body,fontSize:10,color:C.inkFaint,marginLeft:2}}>PTS</span>
                  </div>
                </div>
                {isExp&&(
                  <div style={{background:C.parchment,padding:"10px 14px",borderBottom:`1px solid ${C.parchmentDark}`,animation:"fadeUp .25s"}}>
                    {["Holes 1–9","Holes 10–18"].map((half,hi)=>(
                      <div key={half} style={{marginBottom:hi===0?8:0}}>
                        <div style={{...T.body,fontSize:9.5,fontWeight:700,color:C.inkFaint,letterSpacing:.7,marginBottom:5}}>{half}</div>
                        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                          {Array.from({length:9}).map((_,i)=>{
                            const idx=hi*9+i;const pts=p.pts[idx];const sc=p.scores[idx];
                            const{bg,tc}=scoreColors(pts);
                            const holeNum=idx+1;const isPP=ppHole&&holeNum===ppHole;
                            return(
                              <div key={i} style={{width:30,height:36,borderRadius:6,background:bg,border:`1px solid ${isPP?C.gold:tc+"33"}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",boxShadow:isPP?`0 0 5px ${C.gold}44`:undefined}}>
                                <div style={{...T.body,fontSize:12,fontWeight:700,color:C.ink}}>{sc}</div>
                                <div style={{...T.body,fontSize:9,fontWeight:600,color:isPP?C.goldDark:tc}}>{pts}pt</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                    <div style={{marginTop:8,display:"flex",gap:10,flexWrap:"wrap"}}>
                      {[["Eagle",C.eagleText,C.eagle],["Birdie",C.birdieText,C.birdie],["Par",C.parText,C.par],["Bogey",C.bogeyText,C.bogey]].map(([l,tc,bg])=>(
                        <div key={l} style={{display:"flex",alignItems:"center",gap:4}}>
                          <div style={{width:10,height:10,borderRadius:2,background:bg,border:`1px solid ${tc}44`}}/>
                          <span style={{...T.body,fontSize:10,color:C.inkLight}}>{l}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </Card>
        )}

        {/* Tagline + Share Results button below leaderboard */}
        <div style={{textAlign:"center",margin:"4px 0 14px",opacity:a?1:0,transition:"opacity .4s .35s"}}>
          <div style={{...T.body,color:C.inkLight,fontSize:12,marginBottom:10}}>Live scoring. No cards. No confusion.</div>
          <button className="btn-press" onClick={()=>{var top=board?board.slice(0,3):[];var m="🏆 Teein' It Up Demo Results\n\n";top.forEach(function(p,i){m+=(i+1)+". "+p.name+" — "+p.total+" pts\n";});m+="\nLive leaderboard, side comps and final results all handled automatically.\n\nCould be perfect for your next golf trip.\n\nTry the demo:\nhttps://app-test-drive-v12.vercel.app/";ctaShareText(m);}} style={{padding:"11px 28px",background:`linear-gradient(135deg,${C.greenBright},${C.green})`,border:"none",borderRadius:11,...T.body,fontSize:13,fontWeight:700,color:C.white,cursor:"pointer",letterSpacing:.3,boxShadow:"0 3px 14px rgba(26,71,49,.35)"}}>Share Leaderboard →</button>
        </div>

        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8,opacity:a?1:0,transition:"opacity .4s .4s"}}>
          <SLabel style={{marginBottom:0}}>Side Competition Winners</SLabel>
          <div style={{...T.body,fontSize:10.5,color:C.greenBright,fontWeight:700}}>✦ Auto-tracked</div>
        </div>
        <Card noPad style={{marginBottom:16,opacity:a?1:0,transition:"opacity .5s .5s"}}>
          <div style={{background:`linear-gradient(90deg,${C.greenDeep},#1e5c38)`,padding:"8px 14px",display:"flex",alignItems:"center",gap:8,borderBottom:"1px solid rgba(201,168,76,.25)"}}>
            <span style={{fontSize:14}}>🏅</span>
            <span style={{...T.body,fontSize:11,color:C.goldPale,fontWeight:700,letterSpacing:.5}}>WINNERS · ROUND 1</span>
            <div style={{marginLeft:"auto",background:"rgba(201,168,76,.18)",border:`1px solid ${C.gold}44`,borderRadius:10,padding:"2px 8px",...T.body,fontSize:10,color:C.goldLight,fontWeight:700}}>FINAL</div>
          </div>
          {sideW.map((comp,i)=>(
            <div key={i}>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"13px 14px"}}>
                <div style={{width:42,height:42,borderRadius:11,background:`linear-gradient(135deg,${C.goldPale},#fdf5dc)`,border:`1.5px solid ${C.gold}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:21,flexShrink:0}}>{comp.ic}</div>
                <div style={{flex:1}}>
                  <div style={{...T.body,fontSize:13,fontWeight:700,color:C.ink}}>{comp.name}</div>
                  <div style={{...T.body,fontSize:11,color:C.inkLight,marginTop:1}}>{comp.hole}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{display:"flex",alignItems:"center",gap:7,justifyContent:"flex-end",marginBottom:3}}>
                    <Avatar player={comp.winnerPlayer} size={28}/>
                    <div style={{...T.body,fontSize:11,fontWeight:700,color:C.white,background:C.greenBright,borderRadius:5,padding:"2px 8px",display:"inline-block"}}>{comp.detail}</div>
                  </div>
                </div>
              </div>
              {i<sideW.length-1&&<Divider/>}
            </div>
          ))}
        </Card>

        <div style={{textAlign:"center",marginTop:20,marginBottom:28,opacity:a?1:0,transition:"opacity .4s .55s"}}>
          <button className="btn-press" onClick={function(){setShowWinner(true);}} style={{padding:"13px 32px",background:"rgba(15,50,28,.8)",border:"1px solid rgba(201,168,76,.45)",borderRadius:12,...T.body,fontSize:14,fontWeight:800,color:"rgba(245,230,184,.95)",cursor:"pointer",letterSpacing:.2,boxShadow:"0 4px 18px rgba(0,0,0,.3)"}}>Back to Results &amp; Signup →</button>
        </div>
        {/* Share Leaderboard btn */}
      </div>
      {ctaShareToast&&(
        <div style={{position:"fixed",top:72,left:"50%",transform:"translateX(-50%)",zIndex:300,pointerEvents:"none",background:"rgba(10,30,18,.97)",border:"1px solid rgba(201,168,76,.55)",borderRadius:22,padding:"8px 18px",whiteSpace:"nowrap",animation:"toastSlide .3s ease-out",boxShadow:"0 4px 24px rgba(0,0,0,.7)"}}>
          <span style={{...T.body,fontSize:12,color:"#e8c96a",fontWeight:700}}>Link copied. Send it to your group 👍</span>
        </div>
      )}
      <NavBar active="leaderboard"/>
    </div>
  );
}

// ─── SCREEN 3.5 · PLAYER MOMENT ──────────────────────────────────────────────
// Combined transition screen — used by both organiser (screen 35) and player (screen 36) flows
// ─── SCREEN 35/36 · BACK NINE INTRO (merged) ────────────────────────────────
// ─── SCREEN 35/36 · BACK NINE INTRO (merged) ────────────────────────────────
function PlayerMomentScreen({onNext}) {
  const [a,setA]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setA(true),80);return()=>clearTimeout(t);},[]);
  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:C.greenDeep,minHeight:"100vh",padding:"44px 28px",textAlign:"center"}}>
      <div style={{opacity:a?1:0,transform:a?"translateY(0)":"translateY(16px)",transition:"opacity .55s,transform .55s",maxWidth:340}}>
        <div style={{fontSize:36,marginBottom:14,filter:"drop-shadow(0 4px 16px rgba(201,168,76,.55))"}}>🏌️</div>
        <div style={{...T.display,color:C.goldLight,fontSize:24,fontWeight:900,lineHeight:1.2,marginBottom:14,textShadow:"0 2px 14px rgba(0,0,0,.6)"}}>King Island Classic.<br/>Back Nine.</div>
        <div style={{...T.body,color:"rgba(245,230,184,.78)",fontSize:14.5,lineHeight:1.8,marginBottom:6,maxWidth:290,margin:"0 auto 6px"}}>The leaderboard is tight.</div>
        <div style={{...T.body,color:"rgba(245,230,184,.6)",fontSize:13.5,lineHeight:1.75,marginBottom:6,maxWidth:290,margin:"0 auto 6px"}}>You're stepping onto the 10th tee.</div>
        <div style={{...T.display,color:C.white,fontSize:17,fontWeight:700,marginBottom:6,textShadow:"0 1px 8px rgba(0,0,0,.5)"}}>Every shot counts.</div>
        <div style={{...T.body,color:"rgba(245,230,184,.45)",fontSize:13,marginBottom:30}}>Let's see who takes it out.</div>
        <button className="btn-press" onClick={onNext} style={{padding:"16px 44px",background:"linear-gradient(135deg,#c08a20 0%,#f0d060 38%,#dbb040 68%,#b87e20 100%)",color:"#0a2010",border:"none",borderRadius:14,...T.body,fontWeight:900,fontSize:16,letterSpacing:.4,cursor:"pointer",boxShadow:"0 6px 28px rgba(201,168,76,.55)",transition:"transform .12s"}}>Play the Back 9 →</button>
      </div>
    </div>
  );
}
function ResetButton({onReset,screen}) {
  const [hov,setHov]=useState(false);
  if(screen===1)return null;
  return(
    <button onClick={onReset} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{position:"fixed",bottom:76,right:"max(10px,calc(50% - 210px))",zIndex:1000,height:28,borderRadius:14,background:hov?"rgba(201,168,76,.28)":"rgba(0,0,0,.42)",border:hov?"1px solid rgba(201,168,76,.55)":"1px solid rgba(255,255,255,.15)",color:hov?"#e8c96a":"rgba(255,255,255,.42)",fontSize:10.5,fontWeight:700,letterSpacing:.4,cursor:"pointer",display:"flex",alignItems:"center",gap:5,padding:"0 11px",backdropFilter:"blur(6px)",transition:"all .18s",...T.body}}>
      <span style={{fontSize:13}}>↺</span> Reload Round
    </button>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen,setScreen]=useState(1);
  const [userScores,setUserScores]=useState(null);
  const [demoKey,setDemoKey]=useState(0);
  const scrollRef=useRef(null);
  const [cfg,setCfg]=useState({powerplayOn:true,powerplayHole:16,numRounds:2});
  const initHcps=Object.fromEntries([1,2,3,4,5,6,7,8].map((id,i)=>[id,[14,8,22,18,11,6,24,16][i]]));
  const [dailyHcps,setDailyHcps]=useState(initHcps);
  const [scRes,setScRes]=useState({approach:[],pin:[],drive:null});
  const [finalBoard,setFinalBoard]=useState(null);

  function scrollTop(){
    try{if(scrollRef.current)scrollRef.current.scrollTop=0;}catch(e){}
    try{window.scrollTo({top:0,behavior:"instant"});}catch(e){}
    try{document.documentElement.scrollTop=0;}catch(e){}
    try{document.body.scrollTop=0;}catch(e){}
  }
  function goTo(n){setScreen(n);setTimeout(scrollTop,0);}
  const initDemoHcps=Object.fromEntries([1,2,3,4,5,6,7,8].map((id,i)=>[id,[14,8,22,18,11,6,24,16][i]]));
  function reset(){
    setUserScores(null);
    setFinalBoard(null);
    setScRes({approach:[],pin:[],drive:null});
    setDailyHcps(initDemoHcps);
    setCfg({powerplayOn:true,powerplayHole:16,numRounds:2});
    setDemoKey(k=>k+1);
    setScreen(1);
    setTimeout(scrollTop,0);
  }
  useEffect(()=>{scrollTop();},[screen,demoKey]);

  return(
    <div style={{...T.body,background:C.greenDeep,minHeight:"100vh",display:"flex",justifyContent:"center",alignItems:"flex-start"}}>
      <InjectCSS/>
      <div ref={scrollRef} style={{width:"100%",maxWidth:430,minHeight:"100vh",background:C.cream,display:"flex",flexDirection:"column",boxShadow:"0 0 60px rgba(0,0,0,.6)"}} key={demoKey}>
        {screen===1&&<WelcomeScreen onNext={()=>goTo(15)}/>}
        {/* screen 15: role select — organiser goes to setup (2), player jumps to back9 context (36) */}
        {screen===15&&<TestDriveScreen onOrganiser={()=>{trackEvent("organiser_path_started");goTo(2);}} onPlayer={()=>{trackEvent("player_path_started");goTo(36);}}/>}
        {screen===2&&<CreateTripScreen cfg={cfg} onCfg={setCfg} onNext={()=>goTo(3)}/>}
        {screen===3&&<TripOverviewScreen cfg={cfg} dailyHcps={dailyHcps} onDailyHcps={setDailyHcps} onNext={()=>{trackEvent("setup_completed");goTo(35);}}/>}
        {/* screen 35: player moment (organiser path) — feeds into scoring */}
        {screen===35&&<PlayerMomentScreen onNext={()=>goTo(4)}/>}
        {screen===36&&<PlayerMomentScreen onNext={()=>goTo(4)}/>}
        {screen===4&&<ScoreEntryScreen cfg={cfg} dailyHcps={dailyHcps} scRes={scRes} onScRes={setScRes} onNext={(s,b)=>{setUserScores(s);setFinalBoard(b);goTo(5);}}/>}
        {screen===5&&<LeaderboardScreen userScores={userScores} scRes={scRes} cfg={cfg} dailyHcps={dailyHcps} finalBoard={finalBoard}/>}
      </div>
      <ResetButton onReset={reset} screen={screen}/>
    </div>
  );
}
