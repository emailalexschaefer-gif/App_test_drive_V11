import { useState, useEffect, useRef } from "react";

// ─── CELEBRATION AUDIO ────────────────────────────────────────────────────────
var _celebAudio = null;
function getAudio() {
  if (!_celebAudio) {
    _celebAudio = new Audio('/sounds/masters-celebration.mp3');
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
    if (typeof window !== 'undefined' && import.meta.env && import.meta.env.DEV) {
      console.log("GA4 Event:", name, params || {});
    }
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
        <div style={{...T.body,color:C.goldPale,fontSize:9,fontWeight:600,letterSpacing:1.5,textTransform:"uppercase",opacity:.65,marginTop:1}}>Golf Event App</div>
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

// ─── SHARE HELPERS ───────────────────────────────────────────────────
function generateLeaderboardShareText(board, sideW, tripName) {
  var url = "https://app-test-drive-v11.vercel.app/";
  var msg = "Final Results -- " + (tripName||"Golf Event") + "\n\nLeaderboard:\n";
  (board||[]).forEach(function(p,i){msg+=(i+1)+". "+p.name+" -- "+p.total+" pts\n";});
  if (sideW && sideW.length > 0) {
    msg += "\nSide Comp Winners:\n";
    sideW.forEach(function(c){
      // detail is "Full Name — measurement" or "Full Name — Comp Name"
      var detail = (c.detail || "").trim();
      // Split on em-dash to get [fullName, suffix]
      var parts = detail.split(" — ");
      var fullName = parts[0] ? parts[0].trim() : (c.winnerName || "");
      var suffix   = parts[1] ? parts[1].trim() : "";
      // Drop suffix if it just repeats the comp name
      if (suffix === c.name) suffix = "";
      if (suffix) {
        msg += c.name + " -- " + fullName + " -- " + suffix + "\n";
      } else {
        msg += c.name + " -- " + fullName + "\n";
      }
    });
  }
  msg += "\nPowered by Teein It Up\n\nBringing people together through golf.\n\n" + url;
  return msg;
}
function generateTripJoinShareText(joinCode) {
  var url = "https://app-test-drive-v11.vercel.app/";
  return "Here's the golf event app we'll be using.\n\n"
    + "Live scoring, leaderboard updates, side comps and final results are all handled automatically.\n\n"
    + "Use the code below to join:\n" + (joinCode||"------") + "\n\n" + url;
}
function shareOrCopyMessage(title, text, onCopied) {
  if (navigator.share) {
    navigator.share({title:title, text:text}).catch(function(){});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
      .then(function(){if(onCopied)onCopied();})
      .catch(function(){try{alert(text);}catch(e){}});
  } else {
    try{alert(text);}catch(e){}
  }
}

// ─── SHARE LOGIC ─────────────────────────────────────────────────────────────────
function buildShareMessage(winnerName, winnerScore, tripName) {
  return [
    "🏆 " + tripName + " Results",
    "",
    winnerName + " wins with " + winnerScore + " points 🏆",
    "",
    "We just ran this entire event on this app — live leaderboard, side comps and all.",
    "",
    "Try it:",
    "",
    "Try it yourself:",
    "https://app-test-drive-v11.vercel.app/"
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
  var [roleType, setRoleType] = useState(window._selectedRoleType||"");
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
          roleType: roleType || "",
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
  const MSG_DEMO="Here's Teein It Up -- the golf event app.\n\nLive scoring, leaderboards, side comps and final results are all handled automatically without the admin chaos.\n\nRun your golf event like a pro.\n\nTry the demo Test Drive here:\nhttps://app-test-drive-v11.vercel.app/";
  const MSG_GROUP="Here's the golf event app we'll be using.\n\nLive scoring, leaderboard updates, side comps and final results are all handled automatically.\n\nCheck out how it works before the event:\n\nhttps://app-test-drive-v11.vercel.app/";
  function buildOrgMsg(){var m="Thought you'd like this -- it's an easy-to-use golf event app called Teein It Up.\n\nLive scoring, automatic leaderboard updates, side comps and final results are all handled automatically.\n\nPerfect for golf trips, social golf, corporate days and charity events.\n\nTry the demo Test Drive here:\nhttps://app-test-drive-v11.vercel.app/";return m;}
  function buildResults(){var top=(finalBoard&&finalBoard.length>0?finalBoard:winner?[winner]:[]).slice(0,3);var m="🏆 Teein' It Up Demo Results\n\n";top.forEach(function(p,i){m+=(i+1)+". "+p.name+" — "+p.total+" pts\n";});m+="\nLive leaderboard, side comps and final results all handled automatically.\n\nCould be perfect for your next golf event.\n\nTry the demo:\nhttps://app-test-drive-v11.vercel.app/";return m;}
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
      var a=new Audio("/sounds/masters-celebration.mp3");
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
          var fb=new Audio("/sounds/masters-celebration.mp3");
          fb.volume=0.55;
          fb.play().then(function(){console.log("Celebration sound played (fallback)");}).catch(function(err){console.log("Celebration sound failed:",err);});
        }catch(e){console.log("Celebration audio exception:",e);}
      }
    }
  },[vis,soundOn]);

  function playCelebrationManual(){
    console.log("Manual celebration triggered");
    try{
      var a=new Audio("/sounds/masters-celebration.mp3");
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
          <div style={{...T.body,color:"rgba(245,230,184,.5)",fontSize:12,marginTop:2}}>You're the winner.</div>
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

        {/* Brand support message */}
        <div style={{textAlign:"center",padding:"12px 4px 4px",opacity:vis?1:0,transition:"opacity .5s .64s"}}>
          <div style={{...T.body,fontSize:12.5,color:"rgba(245,230,184,.42)",lineHeight:1.65}}>
            Teein' It Up -- bringing people together through golf.
          </div>
        </div>

        {/* Hero CTA card */}
        <div style={{background:"rgba(6,22,12,.97)",border:"1px solid rgba(201,168,76,.32)",borderRadius:14,padding:"22px 18px 18px",marginBottom:20,opacity:vis?1:0,transition:"opacity .5s .65s",textAlign:"center",boxShadow:"0 6px 28px rgba(0,0,0,.55)"}}>
          <div style={{...T.display,color:C.goldLight,fontSize:22,fontWeight:900,lineHeight:1.15,marginBottom:10}}>Ready to Run Your Own Golf Event Like a Pro?</div>
          <div style={{...T.body,color:"rgba(245,230,184,.5)",fontSize:12.5,lineHeight:1.7,marginBottom:18}}>No admin chaos. Just great experiences.</div>
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
  "Here's Teein It Up -- the app that helps you run your golf event like a pro.",
  "",
  "Live scoring, leaderboards, side comps and final results all in one place.",
  "",
  "No admin chaos. Just great experiences.",
  "",
  "Try the demo Test Drive here:",
  "https://app-test-drive-v11.vercel.app/"
].join("\n");

function WelcomeScreen({onNext}) {
  const [a,setA]=useState(false);
  const [showLeadModal,setShowLeadModal]=useState(false);
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
        <div style={{...T.display,color:"#fff",fontSize:26,fontWeight:800,lineHeight:1.25,maxWidth:300,margin:"0 auto 16px",textShadow:"0 2px 16px rgba(0,0,0,.65)"}}>Run Your Golf Event Like A Pro.</div>
        <div style={{...T.body,color:"rgba(245,230,184,.72)",fontSize:14.5,lineHeight:1.85,marginBottom:8,textShadow:"0 1px 6px rgba(0,0,0,.35)"}}>
          Live scoring.{" "}Side comps.{" "}Leaderboards.
        </div>
        <div style={{width:40,height:1,background:`linear-gradient(90deg,transparent,${C.gold},transparent)`,margin:"10px auto",opacity:.5}}/>
        <div style={{...T.body,color:"rgba(245,230,184,.55)",fontSize:13.5,lineHeight:1.85,marginBottom:4}}>
          No admin chaos. Just great experiences.
        </div>
        <div style={{...T.body,color:"rgba(245,230,184,.8)",fontSize:14,fontWeight:600,marginTop:6,textShadow:"0 1px 8px rgba(0,0,0,.4)"}}>
        </div>
      </div>
      <div style={{position:"relative",zIndex:2,width:"100%",padding:"18px 24px 44px",display:"flex",flexDirection:"column",alignItems:"center",opacity:a?1:0,transition:"opacity .7s 1.05s"}}>
        <button className="btn-press" onClick={function(){trackEvent("demo_started");onNext();}} style={{width:"100%",maxWidth:340,padding:"17px 24px",background:"linear-gradient(135deg,#c08a20 0%,#f0d060 38%,#dbb040 68%,#b87e20 100%)",color:"#0a2010",border:"none",borderRadius:15,...T.body,fontWeight:900,fontSize:17,letterSpacing:.4,cursor:"pointer",boxShadow:"0 6px 32px rgba(201,168,76,.58),inset 0 1px 0 rgba(255,255,255,.28)",transition:"transform .12s"}}>Start Demo Round →</button>
        <div style={{...T.body,textAlign:"center",color:"rgba(245,230,184,.92)",fontSize:12,marginTop:5,letterSpacing:.3}}>No signup required</div>
        <div style={{...T.body,textAlign:"center",color:"rgba(201,168,76,.5)",fontSize:11,marginTop:5,marginBottom:2,letterSpacing:.3}}>First 20 Founding Organisers receive free lifetime access</div>
        <button className="btn-press" onClick={function(){trackEvent("early_access_opened");setShowLeadModal(true);}} style={{width:"100%",maxWidth:340,padding:"14px 24px",background:"rgba(201,168,76,.12)",color:"rgba(245,230,184,.88)",border:"1px solid rgba(201,168,76,.35)",borderRadius:13,...T.body,fontWeight:700,fontSize:14,letterSpacing:.2,cursor:"pointer",marginTop:10}}>Join Early Access</button>
        <button className="btn-press" onClick={function(){doShare(WELCOME_SHARE_MSG,null);}} style={{width:"100%",maxWidth:340,padding:"13px 24px",background:"rgba(255,255,255,.06)",color:"rgba(245,230,184,.75)",border:"1px solid rgba(201,168,76,.25)",borderRadius:13,...T.body,fontWeight:700,fontSize:14,letterSpacing:.2,cursor:"pointer",marginTop:8}}>Share Demo</button>
        <div style={{...T.body,textAlign:"center",color:"rgba(245,230,184,.32)",fontSize:11,marginTop:4,letterSpacing:.2}}>Players join in seconds. No app download needed.</div>
      </div>
    {showLeadModal&&<LeadModal onClose={function(){setShowLeadModal(false);}}/>}
    </div>
  );
}

// ─── SCREEN 1.5 · TEST DRIVE ───────────────────────────────────────────────────────
function TestDriveScreen({onOrganiser,onEventOrganiser,onSocial,onPlayer}) {
  const [a,setA]=useState(false);
  const [showEventCard,setShowEventCard]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setA(true),100);return()=>clearTimeout(t);},[]);

  // ── Event Organiser info card ──
  if(showEventCard) return(
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",background:"#0a1f10",padding:"20px 20px 32px"}}>
      <div style={{position:"absolute",inset:0,zIndex:0,backgroundImage:'url("https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=900&q=80")',backgroundSize:"cover",backgroundPosition:"center 40%",filter:"brightness(0.3) saturate(1.0)"}}/>
      <div style={{position:"absolute",inset:0,zIndex:1,background:"linear-gradient(180deg,rgba(4,14,8,.75) 0%,rgba(4,14,8,.65) 50%,rgba(4,14,8,.95) 100%)"}}/>
      <div className="pop-in" style={{position:"relative",zIndex:2,width:"100%",maxWidth:420}}>
        {/* Card */}
        <div style={{background:"rgba(6,22,12,.97)",border:"1px solid rgba(201,168,76,.3)",borderRadius:22,padding:"22px 20px 20px",boxShadow:"0 10px 48px rgba(0,0,0,.65)"}}>
          {/* Header */}
          <div style={{textAlign:"center",marginBottom:18}}>
            <div style={{fontSize:32,marginBottom:8}}>🤝</div>
            <div style={{...T.display,color:C.goldLight,fontSize:17,fontWeight:900,lineHeight:1.2,marginBottom:8}}>Bringing People Together Through Golf</div>
            <div style={{...T.body,color:"rgba(245,230,184,.55)",fontSize:13,lineHeight:1.6}}>Create memorable golf experiences that strengthen relationships, build communities and support great causes.</div>
          </div>
          {/* 3 benefit tiles */}
          <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
            {[
              {ic:"🤝",title:"Build Relationships",desc:"Client days, referral partner events and networking golf."},
              {ic:"🏆",title:"Elevate the Experience",desc:"Live scoring, leaderboards, side comps and final results."},
              {ic:"🎗",title:"Support Causes",desc:"Make charity golf days easier to run, share and celebrate."},
            ].map(function(b){return(
              <div key={b.title} style={{display:"flex",gap:12,alignItems:"flex-start",background:"rgba(255,255,255,.05)",border:"1px solid rgba(201,168,76,.12)",borderRadius:14,padding:"12px 14px"}}>
                <span style={{fontSize:22,flexShrink:0,marginTop:1}}>{b.ic}</span>
                <div>
                  <div style={{...T.body,color:C.goldLight,fontWeight:700,fontSize:13.5,marginBottom:3}}>{b.title}</div>
                  <div style={{...T.body,color:"rgba(245,230,184,.6)",fontSize:12.5,lineHeight:1.55}}>{b.desc}</div>
                </div>
              </div>
            );})}
          </div>
          {/* Closing line */}
          <div style={{...T.body,color:"rgba(245,230,184,.45)",fontSize:12,lineHeight:1.65,textAlign:"center",marginBottom:18}}>Teein' It Up handles the scoring and event management, so you can focus on the relationships, the purpose and the experience.</div>
          {/* Buttons */}
          <button className="btn-press" onClick={onEventOrganiser} style={{width:"100%",padding:"15px 0",background:"linear-gradient(135deg,#c08a20 0%,#f0d060 38%,#dbb040 68%,#b87e20 100%)",color:"#0a2010",border:"none",borderRadius:13,...T.body,fontWeight:900,fontSize:16,letterSpacing:.3,cursor:"pointer",boxShadow:"0 5px 24px rgba(201,168,76,.45)",marginBottom:10}}>Continue →</button>
          <button onClick={function(){setShowEventCard(false);}} style={{width:"100%",background:"none",border:"none",color:"rgba(245,230,184,.35)",fontSize:13,...T.body,cursor:"pointer",padding:"6px 0"}}>Back</button>
        </div>
      </div>
    </div>
  );

  // ── Role selection screen ──
  return(
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",background:"#0a1f10"}}>
      <div style={{position:"absolute",inset:0,zIndex:0,backgroundImage:'url("https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=900&q=80")',backgroundSize:"cover",backgroundPosition:"center 40%",filter:"brightness(0.4) saturate(1.1)"}}/>
      <div style={{position:"absolute",inset:0,zIndex:1,background:"linear-gradient(180deg,rgba(4,14,8,.7) 0%,rgba(4,14,8,.5) 45%,rgba(4,14,8,.92) 100%)"}}/>
      <div style={{position:"relative",zIndex:2,padding:"24px 24px 40px",width:"100%",maxWidth:430}}>
        {/* Hero image */}
        <div style={{opacity:a?1:0,transition:"opacity .6s .05s",marginBottom:20,textAlign:"center"}}>
          <img src="https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=700&q=85&auto=format&fit=crop" alt="Golfer" style={{width:"100%",maxWidth:340,height:150,borderRadius:16,objectFit:"cover",objectPosition:"center 35%",boxShadow:"0 8px 36px rgba(0,0,0,.6),0 0 0 1px rgba(201,168,76,.22)",display:"block",margin:"0 auto"}}/>
        </div>
        {/* Headline */}
        <div style={{opacity:a?1:0,transform:a?"translateY(0)":"translateY(14px)",transition:"opacity .6s .15s,transform .6s .15s",textAlign:"center",marginBottom:22}}>
          <div style={{...T.display,color:C.white,fontSize:21,fontWeight:800,lineHeight:1.25,marginBottom:8,textShadow:"0 2px 16px rgba(0,0,0,.7)"}}>Choose your Test Drive</div>
          <div style={{...T.body,color:"rgba(245,230,184,.58)",fontSize:13,lineHeight:1.65}}>See how Teein It Up works for your type of golf experience.</div>
        </div>
        {/* Role cards */}
        <div style={{display:"flex",flexDirection:"column",gap:10,opacity:a?1:0,transition:"opacity .6s .38s"}}>
          {/* Golf Trip Organiser */}
          <button className="btn-press" onClick={onOrganiser} style={{width:"100%",padding:"0",background:"linear-gradient(135deg,rgba(176,130,28,.22),rgba(240,208,96,.1))",border:"1px solid rgba(201,168,76,.55)",borderRadius:16,cursor:"pointer",overflow:"hidden",boxShadow:"0 4px 20px rgba(201,168,76,.2)",textAlign:"left"}}>
            <div style={{padding:"16px 18px",display:"flex",alignItems:"center",gap:14}}>
              <span style={{fontSize:28,flexShrink:0}}>⛳</span>
              <div style={{flex:1}}>
                <div style={{...T.body,color:C.goldLight,fontWeight:800,fontSize:15,marginBottom:3}}>Golf Trip Organiser</div>
                <div style={{...T.body,color:"rgba(245,230,184,.55)",fontSize:12.5}}>Run your mates trip like a pro.</div>
              </div>
              <span style={{color:"rgba(201,168,76,.6)",fontSize:18,flexShrink:0}}>→</span>
            </div>
          </button>
          {/* Event Organiser */}
          <button className="btn-press" onClick={function(){setShowEventCard(true);}} style={{width:"100%",padding:"0",background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.15)",borderRadius:16,cursor:"pointer",overflow:"hidden",textAlign:"left"}}>
            <div style={{padding:"16px 18px",display:"flex",alignItems:"center",gap:14}}>
              <span style={{fontSize:28,flexShrink:0}}>🤝</span>
              <div style={{flex:1}}>
                <div style={{...T.body,color:"rgba(245,230,184,.9)",fontWeight:700,fontSize:15,marginBottom:3}}>Event Organiser</div>
                <div style={{...T.body,color:"rgba(245,230,184,.48)",fontSize:12.5}}>Create memorable experiences for clients, teams and causes.</div>
              </div>
              <span style={{color:"rgba(255,255,255,.3)",fontSize:18,flexShrink:0}}>→</span>
            </div>
          </button>
          {/* Social Golf */}
          <button className="btn-press" onClick={onSocial} style={{width:"100%",padding:"0",background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.13)",borderRadius:16,cursor:"pointer",overflow:"hidden",textAlign:"left"}}>
            <div style={{padding:"15px 18px",display:"flex",alignItems:"center",gap:14}}>
              <span style={{fontSize:28,flexShrink:0}}>👥</span>
              <div style={{flex:1}}>
                <div style={{...T.body,color:"rgba(245,230,184,.82)",fontWeight:600,fontSize:15,marginBottom:3}}>Social Golf</div>
                <div style={{...T.body,color:"rgba(245,230,184,.42)",fontSize:12.5}}>Make your regular round more fun.</div>
              </div>
              <span style={{color:"rgba(255,255,255,.25)",fontSize:18,flexShrink:0}}>→</span>
            </div>
          </button>
          {/* Player */}
          <button className="btn-press" onClick={onPlayer} style={{width:"100%",padding:"0",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.1)",borderRadius:16,cursor:"pointer",overflow:"hidden",textAlign:"left"}}>
            <div style={{padding:"15px 18px",display:"flex",alignItems:"center",gap:14}}>
              <span style={{fontSize:28,flexShrink:0}}>👤</span>
              <div style={{flex:1}}>
                <div style={{...T.body,color:"rgba(245,230,184,.75)",fontWeight:600,fontSize:15,marginBottom:3}}>Player</div>
                <div style={{...T.body,color:"rgba(245,230,184,.38)",fontSize:12.5}}>Skip straight to live scoring.</div>
              </div>
              <span style={{color:"rgba(255,255,255,.22)",fontSize:18,flexShrink:0}}>→</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN 1.7 · SOCIAL GOLF BENEFITS ─────────────────────────────────
function SocialGolfBenefitsScreen({onContinue,onBack}) {
  const [a,setA]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setA(true),80);return()=>clearTimeout(t);},[]);
  return(
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",background:"#0a1f10",padding:"20px 20px 32px"}}>
      <div style={{position:"absolute",inset:0,zIndex:0,backgroundImage:'url("https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=900&q=80")',backgroundSize:"cover",backgroundPosition:"center 40%",filter:"brightness(0.3) saturate(1.0)"}}/>
      <div style={{position:"absolute",inset:0,zIndex:1,background:"linear-gradient(180deg,rgba(4,14,8,.75) 0%,rgba(4,14,8,.65) 50%,rgba(4,14,8,.95) 100%)"}}/>
      <div className="pop-in" style={{position:"relative",zIndex:2,width:"100%",maxWidth:420}}>
        <div style={{background:"rgba(6,22,12,.97)",border:"1px solid rgba(201,168,76,.3)",borderRadius:22,padding:"22px 20px 20px",boxShadow:"0 10px 48px rgba(0,0,0,.65)"}}>
          <div style={{textAlign:"center",marginBottom:18}}>
            <div style={{fontSize:32,marginBottom:8}}>👥</div>
            <div style={{...T.display,color:C.goldLight,fontSize:17,fontWeight:900,lineHeight:1.2,marginBottom:8}}>Make Every Round Feel Like An Event</div>
            <div style={{...T.body,color:"rgba(245,230,184,.55)",fontSize:13,lineHeight:1.6}}>Turn your regular golf game into something everyone looks forward to.</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
            {[
              {ic:"🏆",title:"Bring The Competition Alive",desc:"Live leaderboards, side comps and bragging rights."},
              {ic:"📈",title:"Follow The Action",desc:"Follow scores, momentum and leaderboard changes in real time."},
              {ic:"🤝",title:"More Than Golf",desc:"Create memorable experiences with the people you enjoy playing with."},
            ].map(function(b){return(
              <div key={b.title} style={{display:"flex",gap:12,alignItems:"flex-start",background:"rgba(255,255,255,.05)",border:"1px solid rgba(201,168,76,.12)",borderRadius:14,padding:"12px 14px"}}>
                <span style={{fontSize:22,flexShrink:0,marginTop:1}}>{b.ic}</span>
                <div>
                  <div style={{...T.body,color:C.goldLight,fontWeight:700,fontSize:13.5,marginBottom:3}}>{b.title}</div>
                  <div style={{...T.body,color:"rgba(245,230,184,.6)",fontSize:12.5,lineHeight:1.55}}>{b.desc}</div>
                </div>
              </div>
            );})
            }
          </div>
          <div style={{...T.body,color:"rgba(245,230,184,.45)",fontSize:12,lineHeight:1.65,textAlign:"center",marginBottom:18}}>Teein It Up helps bring people together through golf.</div>
          <button className="btn-press" onClick={onContinue} style={{width:"100%",padding:"15px 0",background:"linear-gradient(135deg,#c08a20 0%,#f0d060 38%,#dbb040 68%,#b87e20 100%)",color:"#0a2010",border:"none",borderRadius:13,...T.body,fontWeight:900,fontSize:16,letterSpacing:.3,cursor:"pointer",boxShadow:"0 5px 24px rgba(201,168,76,.45)",marginBottom:10}}>Continue →</button>
          <button onClick={onBack} style={{width:"100%",background:"none",border:"none",color:"rgba(245,230,184,.35)",fontSize:13,...T.body,cursor:"pointer",padding:"6px 0"}}>Back</button>
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN 1.8 · SOCIAL GOLF CONTEXT ─────────────────────────────────
function SocialGolfContextScreen({onNext}) {
  const [a,setA]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setA(true),80);return()=>clearTimeout(t);},[]);
  var tiles=[
    {ic:"🏌️",label:"8 Players"},
    {ic:"🏆",label:"Side Comps Ready"},
    {ic:"📈",label:"Live Leaderboard"},
    {ic:"✨",label:"One Memorable Golf Experience"},
  ];
  return(
    <div style={{minHeight:"100vh",background:"#060f08",display:"flex",flexDirection:"column"}}>
      <div style={{position:"relative",width:"100%",height:"38vh",minHeight:230,overflow:"hidden",flexShrink:0}}>
        <img src="data:image/jpeg;base64,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AIkRIqoQygAAAQwAQwAQwAQwAQwABkAAAAAAAAAAAAhlQCGACGAAMAAAgAAAAAAAAAYBQMgigAIoEFESAgKBgAgABkSKCQEARAoIYgKh3EFADIAAAqGIiqJAQAh3ABAFAxEAMQAMgRpUTIkUEhEVUMRFVEhGVVAAFQEQqokIiqhiIqhiIogAIBDKAYiKAEADEAEiJFAyIATIEUDAAAAAAABDABDABDABAUAhgAAQACCgYAAAACAAAAAQAAxAAxBQAEAMAAQyoBAFAAQACKAAAIAAKYgAAAAAAhCCgYiKBgAAAAAAAAAAAAAAAAADAgqAQUDAAACKAAgAEADAAAAAYgAYgAYiKCQiAGAAMQAMiAEiJFBIiRQMAAAABDKgEMqARIqCokisopEioikMAAQASEAEhEUDERQIYAAgABgAgAAGAAAAAAACACREAGAAIYABEjQJESKBgQADABAACAKBkSKCQiKBiIoAACAAKAYAIQASIgESERVDERQAEAMQUDERQAgABgAgAAAAAQAAwAQyoAAAIjKgEBQDAAAAgEBRFMQAMQAMAABAADABAAAIAAYAAwAiBRAAAAAAAAAAAAAAAAAwIoAAAAIoAAgAAABgAhgAAAAAAIYAAEUDEQBIQAMQFQAAUABACAKAAIAAqAYBQMIBAUEMCAoGVAAAQAgqgAiiGIgoYgAkRABiACQgAYgAYgAYgAZAKBiIoGMIBCKAkIigZEAJCAAAAAAAAAAAAgACgAAAACAACkMCAAAoEBAAAAAAAwAQFQUABAxAUMACAQVQxEUQhkFAAAABQMiRRDERVEiJFEMRFUMRFEMRFACABiAqGIKBiIqoYEFQhBVQxAUAAEAAAABUAAAAAAAAAAAAAUABADAAAAoEBAwAAAAAAAAIoGBAAAAAAADAAERVQxEUAMIAAqAAAAEBQxAEMQVUMCCoBBQAEVUMRFBIRAEiIAMQAMQFRIQFQxEVQDAIQEVUAAVAAFQABUAAFMCKBAACAAAACGIChiABiCoGIgoYAQIYBSGBAhgVAAFQABUAAAAVFAAEUgKCGBBUAgKGIKgYEFQCAoQyogQyoBAUAAACGADEAAMIBDKgoEURQIAiREChjACIwIAQFQwAKQyogiMqABFAAwAQwAQAAABUIAAQwKhjABAAAAAAAFAAQAwKgAAEAAAAAAADEADAAACChiAgYgooAgAAAgAAGIAGAFQAAAAAAgAYAFAgIGIAGAAAwAQwgACoAEUADIAAAAAAAYAAAAhgAhgACAqGAFQwAqAiRVRIRFUMRFAAACGAAMAEIAgAKqACKqGIgAGVAIYFQhlQCGVAIZUAABQCCoAAAQwAQAAwCAAAAEFAwIoACKAAigQAACABgAAIAGIAGAAMiFVEiBFVEhEFQxAAAADEUAxEUAAAAAAAAAAAIYAIAAQAVAAAMAAAAAAAAYAIYAAAAhgAhgFIAIAAAAABgBUAgKgAAAAAAABgAAAAAAAxEUDERQMRAAAAAAAxAAwAAAAGIAGAAAAAhgAARQAEAMQFQxBQAEUABFADIAAAAAKBiIoAAgEMqAQFAAAAAAAAAAAAxEUDAAEMgBDCgAAAAAEMIAAAACoAEUAARQAEUABAAAAICgAYQABUAAUAAACGACAAAAAQwAAAqEMApDAgQwAQBQIYAAAAAAAAAAAUAAQAAAAAAAAIAAQwAQAAwAAAAAAAYAAAAAIAGIAGIAAAAAAAAAAAAYgAAAKAAgAAAAAAYBQICBgAAMIBAUAAQAwAAAAAACgAIAAAYAAAAAAAAEUABFAxEAMAoEMgBDAAAAEAUABADAAACoAAKBAAAAAMAAAABABUAAAAADAigAIAAAAAqAQygACAAAoEMAEMAEAAAAAAQAAUAAAAAQABQAAAAgAAAAAAAACmICAAAAAABAADAAAAACgEMIBAUAAAAAAAAAAAAMAEAAIYAIAAAAAAAAAAYAAgAAAAAAAAAAAAAYAIAAAAAAAAYAIYAAAAhgAABUAAFAAQMCKBDIopABAwIoAAgAAAAAAACoYAAAAAAAAAAAEADKAQEAMCoqAAKgACoQyoBDCgQwgACoAAqAAKAAABAAAAAMQAAAAAADAAAAAAIAAKgACoKAAgAAAEFVDIgBIQAAEUAAAAAAAAAAAAAAAACAAGIAAAAZEAGICoYAAhgAgABgAABUAAVAAFQCGUACCAAKAAAKAAgAAAEADEADEAAAAAAAwABDABDABDAAEAAAAAAAwABDAKBAQAAFMAIoACKAAAGACAAAZAABURQAEAMqCkMCBDABDAoQwAAAigAIAACgAIoACKAAgYiCoYAAAAAAFQABUAAFABUUAQRQMAhDKgEBQAAAABAAFAIYAIYAIYAIAAYgAYEUAAAAEUAAQCAoBiAKAAgQwAAAAAAAACgAIAAAQwABAAxAFAAQMQBTAAEAEAMAEAFQAAUAAAAEUDAgiSKgEABSGACGACGFEIAABkAICgAYQERlBSGBFIAIAAAYAAAAAAAAAAhgAhgAhgAAAAAFQAAAABQAEUABAwAoQwAACIoAKigAIoAIgAAKYgIAAABgVAAAAAUAAEAAADAKQAAABAAAUDIqAAIAAKAAgAAoAGEAgKKhiAAAAAAgACgACKAAAAAAAAAAAEMAAAgACgAAAQwAQwAQwCkABAMAEAAAwAQwAQwABAAAAAAAAAADAqEAAIYFQABUAAVAAAAAUIYEUgAIBgAABQAAAAEUgCiAAigAKAAgigAIAQUAMAEAAAgAAABgACAAGAAAAAAAUCAgYAAAAAAAAAAAAAAFQABQAADAAAAgAACAAKAYAICoigYBAAFQAAUABFAwCAAAAABDAAAChDAgQAAAAAMCgEBAwAKAAgAAAAIAAoKAAgAIABlQERlAAEAIZQAAAAAAAAAAAAgAYgAYAFAgIGAAAAAAAAAFQCABiAKYgIAAAYgAYAAAAAIApiAgYgKhgBQhgAhgAgAigAIpDAgBgAgAKAAAACAACoBAFAARQAAAFQAAEUDKiBAUAgAAAApABAAAAAAMAAAAAEBQDAgAAKAAigAIGAAAgKGAECACoAAqGBFVABBQAUAAQEMAKAQAMQEUwAigAAAAimAEUABFAAQAAAAAUCAgAAAAAGIigBgAAAAAAAAAAAAMigQAAAAAMIBAUAARQAEUAAAMQAMRFAxEUAAAAwiiIFEAAAMAAAAAAAAAAQAAAADAAEMIKAKIEAAAwAQwAQAAAAAAAMAAAICgQUQABQABAAAAAAMQAAAACAqAAKgACoBlQUgKiKAKIACKKACIpAUEABAICgAACmICBgAAAAAwAQAAABQwAAACAAAAAKgAigAAAAAAAgAYAIYAAAAAAAMChDABDAgQAVAAFQwAqAAioAKKgACgACKAAAACBDCAQyoqACgAAAAAAAAAYAABAAFAAgAYgABhAICgACAACoBDKAAAAGACAAACKqAAAAAAAAAYAIAAQwAQwAAAAAAAAAAAAAAACKqAACgAIAAAACAAKAAAAAAAQAAAADAAAAAAAQwAQAAhgAhgAAAAABSAogAAAAAEMAEAFQgAAGBUAAAAAAAAAwAQwAQwKAACAAKAAggAooAIqAGEAhgAhgAhgADABDAqAAAAAAAApDABDAIQwAAAqAAKgAAoAAAYBCAAAAAAIooAioAAAQwAACAAKAYEAIZUAhlQABUAAAAIoAAigAAAAgAGACGUAAQAAVAIZUAhhQIZFAhgAARQAAAhgAgAAAAAAAAAAGEAhlQCGVAIZUAgKABhAIAAYgABgAgKgACoBDKgACoAAoAEBUMAAQwAQAVAAFQABUAAAhlQCAKqAYAIAKgAIoiMogAAAAAAAKgGBUAEAABRQAAAAEAAFAwiKAAAACKAAigAIoACAAAGAFQAAAAAAAAAAAABQAAAAQAEUCGBUAAUAAQAAFABEABUADABDKAAABDABDCAQwAAAAAAAACgCiBDIoEMIBDKAQEFQxAAwAAAqAYAACAAAAAAAAAAAqAAAAAqAAKgAAAQAAAAAMqAAAAAoAAgAAAAAoAAAAIoACAAAAACgQwgEAUAAQCGUAhgVAAAAwAQAAAAUgAgAAAAAAAAQyoBAUACAoAAgBgUIYEAAAAwgEMqAQAAAUADAKQAQMQQDEUFMCCAAChDAAAAGICKYAAAAQCAKYgIGABQAAAwIAAAAAAAigAIoAAAACABBQMCAAAAAAAAAACoAAAAAABgACABiAqAAAAAAAqKgAAAAKAACAQAMCoBiAKYgIoACKBgQIAKgEAAMAEMqCkMCBAAUABFMACAYAIYBSGBAgAAAAEBQAAAAAAxEAMAAAAAAqAAABDCgQAAAAAAAAAAAAAAAIAAQAAAAUwAgAAAAAEMAEBQAABQAEAAAMCAAAAAAAAAAACgAIoACKAAgAAoAAIBgVCGAAAAAAAAAUgAAACAACoYBFABRFAAQMCKAEADAAACAAAAQwAAAqAAAYAAhgAAAUABAAAAAAAgAAAAGACAAAYAIAAAAAAAEMAAYAIYFAAAAAAAACACAEFVDAgAACoAAAAAAAAAAKYgIAAAAAAAAEBQDAgAAKBDIAACgAIoACAAYAIAAAKCgCCAAqAQFAAAAhgAAEAhlAIYAIYAIYAIYAAAAwACAFAAAADAqACKqARFVDAgAACoQwKgAAGAFQCAqGAAIAABgAAAAAAAAAAAAMAEAFQhgAhhAAyoBAFADIAAAAAAACgACAGAAIYAIYAIACmAEAAAIAAYAAAAAAAIYAIYAIYAAAAAAAAAAAAAAUABFAAQAAFAAQAAFAAEIYAIYARGBUAAAAAAAAAAUAAQMQAAAAxAVAAAAAAAFADIAQAAAAAAAMQAAAAxAAAAAICoAKioACgBgAhgAhgAhgAhgAgAAAAAAAAABiAKiBRADAqACAAAAAAAAAAAAQwABgAAAAAFQABUAAAAAAAAAAAAAAAFQABUABAAyoBABUMAAAAAAKBiIAYgAAAAAAAYAAgAAAqAAKgGACGACAAGAAAAAAAAMAEMAAAAQwKhAAAAAAAAABUAgKhgAAAAAAUAARSAAhgAUABAhgVCGACGBUIAKgAAAAAAAAAAoGAQhgFIAIAYAAAAABUIAAAAqAAAAAqAAAAAAAAAAAAAAAqAAKgAZUAhlQCAoAAgAEUAAACGACGAEQKABhFAAEUCAgYAAAAAAAAAAwAAAAAQAMQFDEBFMQEDEAAAAAwAAAAAAAAgACoBiCgYEUABAABUACKgGAAAAAAAAAAAAAAAAAAMQAMQAAAAAAUABAxAVDACoAABgAAIAAAAAAAAAEAAAAAAAUwAgAAoQwIEMAEMAAQAAAFMAIAAAQAAAAAIAGAAIYAAAADABABUAAAxAAwAKAAgAAKQwIEMAAAABAAAAAAAAAAwAAAAAAAAABAACGVAAFQCAqAQFAAAAAFVABBQABFAARQAEAAFQAAUAADAAAAIoACKQwCEMCoQAADAKQwAAAgAAAGQAABUIZQAAAAEAABQAEFQAAUABAAAAAAMQAAAADAAEADAAAAABAAwAAAAoACAEAAAFQwAqAACgACAAAQAAAADAAEMAEMChAAAAEAMAoAAAACEABTEAQxAVDACoAAoQwIAQFDAAgAAAACgAIEMApABAxAAxAUAAQMAKgEAUABAAADEADACgEBFMAIoAAgACoAAAAAEAAAAAgKCgQEDEAUABAhgVAAFQAAAMAEMAEMChABFAwAQwABhAICggAAAYQCAoAAgAGVAAAAAAAABQAEAAFAABAAAAAAAAAMAAAAAAAAAAAAAABAAAAAAAAxAAwAAAAAAKAAAQwCAAKAACAQBTEAQDAoQAAwAAAAAACAAKgAAAAKgAAAAKhDAKQwAAAikMCKAAgAAoAAAACKAAIBAUAARTEBAAAAMCoQAADAAAApABAxAUAAQAAAxAVDEADAAAAABAAwAAAAEAAAFQCAoqAACkAEAICoYAAhgADAqEMCoQwCkABAMAAAKAAAAAigAIoACKBgQAAAgAKYiKBiIqBiICmAAAARQAEUABAAADAAAAKhDAKQwIpABFAARQMCKQAQAAFMAIEMAAAAAAAAAoAAAAIAACmICKAAgYgKgAAAAAQwKEAEUABFAAQMACgAIoACKAAigAIAAKAAABARTAAAAAAAAAAAQEUxAEMQFQABQAADEBFMQEUwAikMCKAAAACKQAAABAAAAMAEMAoACAEAUABADABAVAAAADAKQFECAAEMApAAQxAUMQBDEAAMAoAAgAAAAAAAAAAoEBAwABgEAAACAoqAACgAgAAIoGBAhgADAKQwAQwAAAIAAoAAAACKQwAQwIoAAgAAEAAAAUMQEUwAikMCBEgAQAVAAFQCAoYAAABFIYEUgAgBgUAARQAAAARQABAAFAMAEAAAAAAAQABQABFAARSGAAAAAAACAgAAqAAAAAoAAIAAoAABgAQhgVCGBQCAIAAKAAAACAAAAYFQABQCAIAAAACgAAAAIAAAAABgAUhBUCAAGIIAAoAACgAAgAAGICoYAVAAAAAAwICgAIEMqCkMCKACoARFAwICgAIAAAQwAQAUMAIGAAAAFAAACAgYAUAAAhgRQAAAAQAAAAACGAUgAgAAAAChgBADAKQAQAAFIYEUABAxAFAARQAEAABQAEAABSGBFAARQAEUABFAAACAimABAMChDAgQAFAAADAiojAgQwCkMCBDAKAAigACAACgAIAAAAAKAAigACAAKgACgACAAAoAAAACEMAEMAEAAAAAAAAMAAACkAECGFAgABDABDABDAqAAAQwAAAKAAigAIpiIqBgRRQBBFABRABAUABAAAUDAikAEUxAQAAFAARQAAMQEUwAigAIAAKEAAMAAAAAAAAAIoACAAAoAAgEAUxAAwAAEFRUhEAMAIoAAhAAUDAAAAEAAAAQAAFAAAAAQAAAAAIAKAYAIYAIYAAARQAAMQAAARTEAAAEUgAgYAAAAUAAAICKkICKAAAAAAAIoAAEMCAEADAApDAigAAAAAAAAAIoACKAAIAABAADAAoACAAApABAAFAhgFIAIAAAAAoAAgAAAGACAAAYRUABVQAEFAAAABFAARQAEUxBUABAAAAMiFVDAgAEFAxEBTACKAAgYgKGICBiABgBQAAAAAAAAAAAAEAABSGBFIYEUgABgAAABAAFAAAAAAxAAAAAAEAABQAAAAAAACGBFAARQMCAEAUwAigAIEAFQABQAAQxAUMQBDERVQABQABFMAAQwAiMCAEBUMQFDACAAAoAAAAIAACgAIAAKgEAUxAEMACgAIAAKgACoAAAAAAAAAAAAAEMApABAhlQCGUAhAVDEBQDAIAAAAAGAFQAQFAAEAgoGBBQhgQIAqoAIAYAVAAAAAFAAQAAVAMCoQFRUAwKhDKioQwKEAAMAAAAAAAAAAAAAAAAQAMQAMACAQFQwAqAAKAACAAKAACAAKgACoAAqAAAAAqAQFDAAGIAgAAoACBiABiABgBQCABiAAAAAAAAAgAAqEMChAAQABUMAKGIAAACEMChAAQwAoAAAAAgAChDAIAAqAAKhDAAACgAAAACEAAMQBQAEDACgAAEAAAgIGBUFAAEAFQCGUBEAAAAoYAEMCKqAZBUIAKgAqKAAAQyogAAqAQBQMAEMqIAAoAZACAAGICgAAGICBiAKAAgBgFIYECAAoGAAAEAAFAAAAgIoAAAYAAgAYgAYgAAAAAAJCAIBAUMAIoACAAAAAAAAoBAAwAAACKAAikMAEMAAQEUwAgAAoAAIAAKYgAAAigAAAAigQEUwABAAEhAAwAikAEUCABgAAAAIYAAAAABFAAAAAAIAhgAUCABgAAICKYgAAAIYgKgAAAAKgAChDAIAAqAAKARUAxAEICgGIAJCABiAKYEVACABgRQAEUABFAARQIYQUCCoAAAYBAMQUDEQAxAFAAQMQAAAAAADEAAMKAAgAEFAxEVUAEBQAEAAAAwKgEBQAAAAAAAQAAAAFAxEAMAAAAKYARSACAAAAAKAQAMQEUABAwAAAAEMApDAigAIpAAQAAUxAEMQAMQAMAKAAAAABDAgQAUMQAMQUEhEAIYEUABFAAQAAAAAUCAgYgAYgKAYAIAIAYBSACKYBUUhkEUhgQAAFIYECAAAAKAACAAKgAKBARQAEUAAAAAAAADERQAAAwAAAAAAgoAqIpDKiKACooAgikMogQyAoAqAAAAAAGAEUAAAAAAARQIAGAEUAAAAAAAAgABiABgAAAEUABFAARSACKAAigAIoAAAZUQIAAYAFAARQAAAAEAAFIYEUhgAgABiAimAEUABFMAAQARQAEUhgRSGBFIAABgAAAAAAAAAAACAAGABCGAAAFAAAAAAwAAACKQAQAAAAAAABQAEUgKgGAEUAAAAAAAACCooGERQICKYAAgKiKAABiKIAAAQwCgAIIgADACgEAQwABgAAIAGIIBgBUAFAAEBQBUAAAAMAEAAAAADAAACAAAEMCoQwKgAAoAAAAIoEAAMAEMAEABAMCoQAAxAVDACgEAAAAAwAAAIQwCkMAAACAAKgGBQgAIAAKAABAAAAEAMAEAAMAAAAoAAigAARIAEAEUAAAAAAAAAAAAAAAAAAAAAAARQAEUhgRQAAAAAAAAIAGAAAAEAAUAARSAAGIAAAAYAAhgAAACGACGBAhgUAARSGACGVEUhgQICoBDKgEMqKIgUQAwAQwCkMAgGBQgAgYEFAABAAAAAVAAFQCACQAUAAAgAimAEUCCiAAgAYAIYBQIAAAAAAAAAgACgAAGIAGAAIYBCACoYAAgAqAAKGAAAAAAAAAEAAFAAAMQEDEAUAAAAAIACAAKAAIoAAAAABgRQAAAAAAAAABAAFAAAAAADABDABAAAAAAgAYgAYgCGAFCGACGAQCABiABgAUAAAAAIYBCACgGACAAAYAAAADAikAEAAFQABQhgAgAgAKigACKAAgQwAQigpgBAAAUABADAKACIoAAACoigYBCGBQgKIoAIgBgAAAAABQICKYAAABFIYAIAAYAACAAAAAAABgAgABgADEBFAAACAgYAFAgAkIAgAAoAAgACoAAoAABgAQhgUIYECGBQgAigAIoEAQxAFAAAABFMAIoAAAAAAAigAAAAAAAAACAQFEhAAAAAAAAAADABAAAAAAAACAAACKYgABgAgABiABgAAIAGAAAARQABAAFQABQCAIYAVDEBUAAUAgIpgAAIAAAABFQQAUVCGEAAUAxAFAAQMCKBDCCgCogAAqAAoGIgqACgAAKhiABgAAIAAZAAAAIYAAAFAgAYgCGICoYAVDEBQAAAABAAFCGAAIAGICKYAEIAKGAAAgCGIAGABTEAAAEAAAMQBTAAAACAAKEAECACoAAqAAKAACGAFAAEAAFCGAQABQAAAAAAAAAAAAAAARQABAAFQABQABFAARQABAABQABAAFQCAoAAAAAGIAGAAAAAhgRQAEUxAQAgKGAEAAAAgKgGAUAAQAACGAAAFQgAKQFEAAAAAAxAAABQxAEMQFQwAqAYQCGVFCAqIACoKYAQAgoGIgqAYAAAFAAAAAAAAIYAIAAYARQAEUABAABQAAAAECGACAApgADEACAAAYAAAAhgQAAAABQAAQDAAEBUMQAMQFAMAEMAEABAABQAAAAEAwCkABAMAEMCgAAEAEUAAQAACGBUIYFQgAoYAQIYFAIAAAAYAAAACACBgBQAACGAQhgAhgFIYEUAVEAAFQABQgAAAAGAEAAAAAAAACGAUhgRQAEAMApABFIYEVEZRBEYAMQAMAAQAVDACgACKAABiICACioAIKgACgGVEUABFAAQIZUAABUAgKGAAMQAAAAAACGAAAAAAACABgBFAAAhgAAACGAAAAIYAAAAABFAAAAAAICBiAoYgAkIAGIAAACAAKGIAgGAERgADAoQAQAAAAAAAFQxAFAAQAAAwAKAABAAAAAAAADABCAIYAVCGBUAAVAAFAAAAAAAAAAAAAAABAAAUABAABQxAAhlRAABQABAAAUAAQDABAAAAAAAAABUAAFAgIAAAQygAAAAAKQAQMAKgACoAAqAZAUAAQAACAChiAAAAAAAYAAgAgBgUIYBCACoAAoYAAhgACABgAQgAqGAFAAAAAEIYFQABUIkBUIAKgACgAAEMCBDAoRIAIjABAAAMAgEBUMAKgEBUMAKhiAoBgQAAAgAAAAAAKAYBCGBUIYFQhgVAAFCAAgACoBgVCGBUIAqoAIoACCoAAqEMAEAFQwAoAAAEAQxAAwAoQAAAADAAAAAAAigAIAAKgACgAAAAAAAgAAAACoAAAACoAABAFVAIiqhiIooACBgAAAQUAUQAwgACioAAKAIABBRABBQDAIQAUMQAAAAxAEAAUAAEAAUMQAMAAAAIBAAxAUMACGICoAAoAAgAAKAAIAAAEBQwAigAAYgCAAABAFSEAAAAAAAAADAioEAAMQFAAEDEAUABAwABDABDAqAAKhDAqAAKgACgEAQxAFAARQAEAMAEBUADAqEABTEAAMAhDABAADAChABAABQCAAGAAABAAFAMAEMAhABQAAAABAAAAAVAAFQxAVABRQAQAAAQAAUgAIQyoBAVBQBRADAAAIAAqKgAAACoKYgIoAqIAYBSAKigZBAhlQCAAAQFDAAAAAAAAGAAAAAAACAigAIAYAIYAAAFIYAAwIpABFAAQAAFIYBAAFAABAAAAAFAAQAAAAAUCAgYgCmICAGAAAFAICBgAAAFQAAUABFAwIpDAgAAKAAgQwCkABCGAAAAAAAAAAABQAAAAAABFAAQAwKEAEUDAikAEUABADABABQABAABUAAUMAIEABQAEAMApABAAAAAFQDAqEAAAAFAARQAECGACGVARGUB//9k=" alt="Social golf" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 15%",display:"block"}}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(6,15,8,.05) 20%,rgba(6,15,8,.65) 65%,rgba(6,15,8,.98) 100%)"}}/>
        <div style={{position:"absolute",top:14,left:14,display:"flex",alignItems:"center",gap:6,background:"rgba(6,15,8,.72)",backdropFilter:"blur(8px)",borderRadius:20,padding:"5px 13px",border:"1px solid rgba(201,168,76,.28)"}}>
          <span style={{fontSize:11}}>📍</span>
          <span style={{...T.body,color:"rgba(245,230,184,.78)",fontSize:11.5,fontWeight:600,letterSpacing:.4}}>King Island Golf Club, Tasmania</span>
        </div>
      </div>
      <div style={{flex:1,padding:"22px 22px 32px",display:"flex",flexDirection:"column"}}>
        <div style={{opacity:a?1:0,transform:a?"translateY(0)":"translateY(10px)",transition:"opacity .5s .08s,transform .5s .08s",flex:1,display:"flex",flexDirection:"column"}}>
          <div style={{...T.display,color:C.goldLight,fontSize:27,fontWeight:900,lineHeight:1.15,marginBottom:16}}>Your Round Starts Here</div>
          <div style={{display:"flex",flexDirection:"column",gap:2,marginBottom:20}}>
            {["The tee time is booked.","The group chat is buzzing.","Bragging rights are on the line."].map(function(line,i){return(
              <p key={i} style={{...T.body,color:"rgba(245,230,184,.7)",fontSize:14.5,lineHeight:1.7,margin:0}}>{line}</p>
            );})
            }
          </div>
          <div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(201,168,76,.3),transparent)",marginBottom:18}}/>
          <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:20}}>
            {tiles.map(function(t,i){return(
              <div key={i} style={{display:"flex",alignItems:"center",gap:14,background:"rgba(255,255,255,.05)",border:"1px solid rgba(201,168,76,.16)",borderRadius:12,padding:"12px 16px",opacity:a?1:0,transform:a?"translateX(0)":"translateX(-8px)",transition:"opacity .4s "+(0.18+i*.07)+"s,transform .4s "+(0.18+i*.07)+"s"}}>
                <span style={{fontSize:20,flexShrink:0}}>{t.ic}</span>
                <span style={{...T.body,color:"rgba(245,230,184,.85)",fontSize:14,fontWeight:600}}>{t.label}</span>
              </div>
            );})
            }
          </div>
          <div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(201,168,76,.22),transparent)",marginBottom:16}}/>
          <p style={{...T.body,color:"rgba(245,230,184,.45)",fontSize:13.5,lineHeight:1.6,textAlign:"center",marginBottom:0}}>Now let's get your round ready.</p>
          <div style={{flex:1}}/>
          <div style={{paddingTop:22,opacity:a?1:0,transition:"opacity .5s .55s"}}>
            <button className="btn-press" onClick={onNext} style={{width:"100%",padding:"16px 0",background:"linear-gradient(135deg,#b8892a 0%,#f0d060 45%,#c9952a 100%)",border:"none",borderRadius:13,...T.body,fontSize:17,fontWeight:900,color:C.greenDeep,cursor:"pointer",letterSpacing:.3,boxShadow:"0 6px 24px rgba(201,168,76,.45)"}}>Continue →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN 1.55 · EVENT ORGANISER IMMERSION ────────────────────────────────────
function EventOrganiserImmersionScreen({onNext}) {
  const [a,setA]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setA(true),80);return()=>clearTimeout(t);},[]);
  var tiles=[
    {ic:"🤝",label:"8 Guests"},
    {ic:"📈",label:"Live Leaderboard"},
    {ic:"🏆",label:"Side Comps Ready"},
    {ic:"✨",label:"One Memorable Business Experience"},
  ];
  return(
    <div style={{minHeight:"100vh",background:"#060f08",display:"flex",flexDirection:"column"}}>
      {/* Hero image */}
      <div style={{position:"relative",width:"100%",height:"38vh",minHeight:230,overflow:"hidden",flexShrink:0}}>
        <img src="data:image/jpeg;base64,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" alt="Corporate golf event" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 30%",display:"block"}}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(6,15,8,.05) 20%,rgba(6,15,8,.65) 65%,rgba(6,15,8,.98) 100%)"}}/>
        {/* Location pill */}
        <div style={{position:"absolute",top:14,left:14,display:"flex",alignItems:"center",gap:6,background:"rgba(6,15,8,.72)",backdropFilter:"blur(8px)",borderRadius:20,padding:"5px 13px",border:"1px solid rgba(201,168,76,.28)"}}>
          <span style={{fontSize:11}}>📍</span>
          <span style={{...T.body,color:"rgba(245,230,184,.78)",fontSize:11.5,fontWeight:600,letterSpacing:.4}}>Cape Wickham, King Island</span>
        </div>
      </div>
      {/* Content */}
      <div style={{flex:1,padding:"22px 22px 32px",display:"flex",flexDirection:"column"}}>
        <div style={{opacity:a?1:0,transform:a?"translateY(0)":"translateY(10px)",transition:"opacity .5s .08s,transform .5s .08s",flex:1,display:"flex",flexDirection:"column"}}>
          <div style={{...T.display,color:C.goldLight,fontSize:27,fontWeight:900,lineHeight:1.15,marginBottom:16}}>Your Event Starts Here</div>
          <div style={{display:"flex",flexDirection:"column",gap:2,marginBottom:20}}>
            {["The sponsors are confirmed.","The guests are arriving.","The conversations have already begun."].map(function(line,i){return(
              <p key={i} style={{...T.body,color:"rgba(245,230,184,.7)",fontSize:14.5,lineHeight:1.7,margin:0}}>{line}</p>
            );})
            }
          </div>
          <div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(201,168,76,.3),transparent)",marginBottom:18}}/>
          <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:20}}>
            {tiles.map(function(t,i){return(
              <div key={i} style={{
                display:"flex",alignItems:"center",gap:14,
                background:"rgba(255,255,255,.05)",
                border:"1px solid rgba(201,168,76,.16)",
                borderRadius:12,padding:"12px 16px",
                opacity:a?1:0,
                transform:a?"translateX(0)":"translateX(-8px)",
                transition:"opacity .4s "+(0.18+i*.07)+"s,transform .4s "+(0.18+i*.07)+"s",
              }}>
                <span style={{fontSize:20,flexShrink:0}}>{t.ic}</span>
                <span style={{...T.body,color:"rgba(245,230,184,.85)",fontSize:14,fontWeight:600}}>{t.label}</span>
              </div>
            );})
            }
          </div>
          <div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(201,168,76,.22),transparent)",marginBottom:16}}/>
          <p style={{...T.body,color:"rgba(245,230,184,.45)",fontSize:13.5,lineHeight:1.6,textAlign:"center",marginBottom:0}}>Now let's get your event ready.</p>
          <div style={{flex:1}}/>
          <div style={{paddingTop:22,opacity:a?1:0,transition:"opacity .5s .55s"}}>
            <button className="btn-press" onClick={onNext} style={{width:"100%",padding:"16px 0",background:"linear-gradient(135deg,#b8892a 0%,#f0d060 45%,#c9952a 100%)",border:"none",borderRadius:13,...T.body,fontSize:17,fontWeight:900,color:C.greenDeep,cursor:"pointer",letterSpacing:.3,boxShadow:"0 6px 24px rgba(201,168,76,.45)"}}>Continue →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN 1.6 · ORGANISER IMMERSION ──────────────────────────────────────────
function OrganiserImmersionScreen({onNext}) {
  const [a,setA]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setA(true),80);return()=>clearTimeout(t);},[]);
  var tiles=[
    {ic:"⛳",label:"8 Players"},
    {ic:"🏌️",label:"2 Rounds"},
    {ic:"🏆",label:"Side Comps Ready"},
    {ic:"✨",label:"One Unforgettable Golf Experience"},
  ];
  return(
    <div style={{minHeight:"100vh",background:"#060f08",display:"flex",flexDirection:"column"}}>
      {/* Hero — coastal cliffs, 38vh */}
      <div style={{position:"relative",width:"100%",height:"38vh",minHeight:230,overflow:"hidden",flexShrink:0}}>
        <img src="data:image/jpeg;base64,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" alt="Cape Wickham King Island" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 40%",display:"block"}}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(6,15,8,.08) 30%,rgba(6,15,8,.97) 100%)"}}/>
        {/* Location pill */}
        <div style={{position:"absolute",top:14,left:14,display:"flex",alignItems:"center",gap:6,background:"rgba(6,15,8,.72)",backdropFilter:"blur(8px)",borderRadius:20,padding:"5px 13px",border:"1px solid rgba(201,168,76,.28)"}}>
          <span style={{fontSize:11}}>📍</span>
          <span style={{...T.body,color:"rgba(245,230,184,.78)",fontSize:11.5,fontWeight:600,letterSpacing:.4}}>Cape Wickham, King Island</span>
        </div>
      </div>

      {/* Content */}
      <div style={{flex:1,padding:"22px 22px 32px",display:"flex",flexDirection:"column"}}>
        <div style={{opacity:a?1:0,transform:a?"translateY(0)":"translateY(10px)",transition:"opacity .5s .08s,transform .5s .08s",flex:1,display:"flex",flexDirection:"column",gap:2}}>

          {/* Headline */}
          <div style={{...T.display,color:C.goldLight,fontSize:27,fontWeight:900,lineHeight:1.15,marginBottom:16}}>Your Weekend Starts Here</div>

          {/* Scene-setting copy */}
          <div style={{display:"flex",flexDirection:"column",gap:2,marginBottom:20}}>
            {["The accommodation is booked.","The tee times are locked in.","The group chat is buzzing."].map(function(line,i){return(
              <p key={i} style={{...T.body,color:"rgba(245,230,184,.7)",fontSize:14.5,lineHeight:1.7,margin:0}}>{line}</p>
            );})}
          </div>

          {/* Gold divider */}
          <div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(201,168,76,.3),transparent)",marginBottom:18}}/>

          {/* Premium info tiles */}
          <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:20}}>
            {tiles.map(function(t,i){return(
              <div key={i} style={{
                display:"flex",alignItems:"center",gap:14,
                background:"rgba(255,255,255,.05)",
                border:"1px solid rgba(201,168,76,.16)",
                borderRadius:12,padding:"12px 16px",
                opacity:a?1:0,
                transform:a?"translateX(0)":"translateX(-8px)",
                transition:"opacity .4s "+(0.18+i*.07)+"s,transform .4s "+(0.18+i*.07)+"s",
              }}>
                <span style={{fontSize:20,flexShrink:0}}>{t.ic}</span>
                <span style={{...T.body,color:"rgba(245,230,184,.85)",fontSize:14,fontWeight:600}}>{t.label}</span>
              </div>
            );})}
          </div>

          {/* Gold divider */}
          <div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(201,168,76,.22),transparent)",marginBottom:16}}/>

          {/* Closing line — centre aligned */}
          <p style={{...T.body,color:"rgba(245,230,184,.45)",fontSize:13.5,lineHeight:1.6,textAlign:"center",marginBottom:0}}>
            Now let's get your trip ready.
          </p>

          <div style={{flex:1}}/>

          {/* CTA */}
          <div style={{paddingTop:22,opacity:a?1:0,transition:"opacity .5s .55s"}}>
            <button className="btn-press" onClick={onNext} style={{width:"100%",padding:"16px 0",background:"linear-gradient(135deg,#b8892a 0%,#f0d060 45%,#c9952a 100%)",border:"none",borderRadius:13,...T.body,fontSize:17,fontWeight:900,color:C.greenDeep,cursor:"pointer",letterSpacing:.3,boxShadow:"0 6px 24px rgba(201,168,76,.45)"}}>Continue →</button>
          </div>
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
        <div style={{background:"rgba(0,0,0,.2)",border:"1px dashed rgba(201,168,76,.45)",borderRadius:8,padding:"8px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
          <div>
            <div style={{...T.body,color:"rgba(245,230,184,.6)",fontSize:10.5,letterSpacing:.7,marginBottom:2}}>EVENT JOIN CODE</div>
            <div style={{...T.display,color:C.goldLight,fontSize:21,fontWeight:700,letterSpacing:3.5}}>{mockTrip.joinCode}</div>
          </div>
          <button className="btn-press" onClick={function(){var msg=generateTripJoinShareText(mockTrip.joinCode);shareOrCopyMessage("Join us on Teein It Up",msg,function(){try{alert("Link copied!");} catch(e){}});}} style={{padding:"7px 13px",background:"rgba(201,168,76,.18)",border:"1px solid rgba(201,168,76,.4)",borderRadius:9,...T.body,fontSize:12,fontWeight:700,color:C.goldLight,cursor:"pointer",flexShrink:0,whiteSpace:"nowrap"}}>Copy &amp; Share</button>
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
  const swipeRef=useRef(null);
  const swipeStartX=useRef(null);
  const swipeStartY=useRef(null);
  const swipeActive=useRef(false);
  function onSwipeStart(e){
    var t=e.touches?e.touches[0]:e;
    swipeStartX.current=t.clientX;
    swipeStartY.current=t.clientY;
    swipeActive.current=true;
  }
  function onSwipeEnd(e){
    if(!swipeActive.current||swipeStartX.current===null) return;
    var t=e.changedTouches?e.changedTouches[0]:e;
    var dx=t.clientX-swipeStartX.current;
    var dy=t.clientY-swipeStartY.current;
    swipeActive.current=false;
    swipeStartX.current=null;
    // Only count horizontal swipes (dx > 50px, not mostly vertical)
    if(Math.abs(dx)<50||Math.abs(dy)>Math.abs(dx)*0.8) return;
    if(dx<0&&holeIdx<BACK9_HOLES-1) setHoleIdx(function(h){return h+1;}); // swipe left = next hole
    if(dx>0&&holeIdx>0) setHoleIdx(function(h){return h-1;});             // swipe right = prev hole
  }

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
      return{bg:isPP?"rgba(201,168,76,.12)":"rgba(255,255,255,.07)",border:isPP?C.gold+"66":"rgba(255,255,255,.11)",label:`${hn}`,sub:"p"+holePars[gh],tc:isPP?C.goldLight:"rgba(255,255,255,.45)",nc:isPP?C.goldLight:"rgba(255,255,255,.68)"};
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

        {/* Swipeable hole card area */}
        <div ref={swipeRef}
          onTouchStart={onSwipeStart} onTouchEnd={onSwipeEnd}
          onMouseDown={onSwipeStart} onMouseUp={onSwipeEnd}
          style={{userSelect:"none",WebkitUserSelect:"none"}}>
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
        <div style={{...T.body,fontSize:10,color:"rgba(245,230,184,.22)",textAlign:"center",paddingTop:4,paddingBottom:2,letterSpacing:.3}}>Swipe left/right to change holes</div>
        </div>{/* end swipe area */}

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
  const CTA_MSG_ORG="Thought you'd like this -- it's an easy-to-use golf event app that runs live leaderboards, scoring, side comps and final results automatically. Could be perfect for your next golf event.\n\nhttps://app-test-drive-v11.vercel.app/";
  const CTA_MSG_PLY="Here's the golf event app we're using. It gives everyone live scoring, side comps, leaderboards and final results without all the spreadsheet/admin chaos.\n\nhttps://app-test-drive-v11.vercel.app/";
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
                              <div key={i} style={{width:30,height:36,borderRadius:6,background:bg,border:`1px solid ${isPP?C.gold:tc+"33"}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",boxShadow:isPP?`0 0 6px ${C.gold}66`:undefined,position:"relative"}}>
                                {isPP&&<span style={{position:"absolute",top:1,right:2,fontSize:7,lineHeight:1}}>⚡</span>}
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
          <button className="btn-press" onClick={()=>{var msg=generateLeaderboardShareText(board,sideW,mockTrip.name);shareOrCopyMessage("Teein It Up Results",msg,function(){setCtaShareToast(true);setTimeout(function(){setCtaShareToast(false);},2800);});}} style={{width:"100%",padding:"15px 0",background:"linear-gradient(135deg,#b8892a 0%,#f0d060 45%,#c9952a 100%)",border:"none",borderRadius:13,...T.body,fontSize:16,fontWeight:900,color:C.greenDeep,cursor:"pointer",letterSpacing:.3,boxShadow:"0 4px 18px rgba(201,168,76,.4)"}}>Share Leaderboard →</button>
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
        {screen===15&&<TestDriveScreen onOrganiser={()=>{window._selectedRoleType="Golf Trip Organiser";trackEvent("trip_organiser_selected");trackEvent("organiser_path_started");goTo(16);}} onEventOrganiser={()=>{window._selectedRoleType="Event Organiser";trackEvent("event_organiser_selected");goTo(17);}} onSocial={()=>{window._selectedRoleType="Social Golf";trackEvent("social_golf_selected");goTo(18);}} onPlayer={()=>{window._selectedRoleType="Player";trackEvent("player_selected");trackEvent("player_path_started");goTo(36);}}/>}
        {screen===18&&<SocialGolfBenefitsScreen onContinue={()=>goTo(19)} onBack={()=>goTo(15)}/>}
        {screen===19&&<SocialGolfContextScreen onNext={()=>goTo(2)}/>}
        {screen===17&&<EventOrganiserImmersionScreen onNext={()=>goTo(2)}/>}
        {screen===16&&<OrganiserImmersionScreen onNext={()=>goTo(2)}/>}
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
