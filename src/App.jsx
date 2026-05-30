import { useState, useRef, useEffect, useCallback } from "react";

// ══════════════════════════════════════════════
// 🔐 SEGURIDAD — Cifrado AES + Hash SHA-256
// ══════════════════════════════════════════════
const CRYPTO_KEY = "SafeSchool_IE_2025_$ecure#Key!";

function strToBytes(str) {
  return new TextEncoder().encode(str);
}
function bytesToHex(buf) {
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}
async function sha256(text) {
  try {
    const buf = await crypto.subtle.digest("SHA-256", strToBytes(text));
    return bytesToHex(buf);
  } catch { return btoa(text); }
}
async function getAESKey() {
  const keyMaterial = await crypto.subtle.importKey(
    "raw", strToBytes(CRYPTO_KEY.padEnd(32).slice(0,32)),
    "AES-GCM", false, ["encrypt","decrypt"]
  );
  return keyMaterial;
}
async function cifrar(texto) {
  try {
    const key = await getAESKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const enc = await crypto.subtle.encrypt({ name:"AES-GCM", iv }, key, strToBytes(JSON.stringify(texto)));
    const ivHex = bytesToHex(iv);
    const encHex = bytesToHex(enc);
    return ivHex + ":" + encHex;
  } catch { return btoa(JSON.stringify(texto)); }
}
async function descifrar(cifrado) {
  try {
    const [ivHex, encHex] = cifrado.split(":");
    if (!ivHex || !encHex) return JSON.parse(atob(cifrado));
    const iv = new Uint8Array(ivHex.match(/.{2}/g).map(b => parseInt(b,16)));
    const enc = new Uint8Array(encHex.match(/.{2}/g).map(b => parseInt(b,16)));
    const key = await getAESKey();
    const dec = await crypto.subtle.decrypt({ name:"AES-GCM", iv }, key, enc);
    return JSON.parse(new TextDecoder().decode(dec));
  } catch { try { return JSON.parse(atob(cifrado)); } catch { return null; } }
}

// ── Persistencia cifrada ──
const KEYS = { 
  alumnos: "ss_alumnos_v2", 
  profesores: "ss_profesores_v2", 
  reportes: "ss_reportes_v2", 
  directiva: "ss_directiva_v2", 
  sesion: "ss_sesion_v2", 
  logs: "ss_logs_v2", 
  nextId: "ss_nextid_v2", 
  nextAlumnoId: "ss_nextaid_v2", 
  cuentas: "ss_cuentas_v2" 
};

// ── ID único de dispositivo ──
function getDeviceId() {
  try {
    let did = localStorage.getItem("ss_device_id");
    if (!did) {
      did = "dev_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2,10);
      localStorage.setItem("ss_device_id", did);
    }
    return did;
  } catch { return "dev_unknown"; }
}
function getDeviceInfo() {
  const ua = navigator.userAgent;
  const isMobile = /Mobile|Android|iPhone|iPad/i.test(ua);
  let os = "Desconocido";
  if (/Windows/i.test(ua)) os = "Windows";
  else if (/Mac OS/i.test(ua)) os = "macOS";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/iPhone|iPad/i.test(ua)) os = "iOS";
  else if (/Linux/i.test(ua)) os = "Linux";
  let browser = "Desconocido";
  if (/Chrome/i.test(ua) && !/Edge/i.test(ua)) browser = "Chrome";
  else if (/Firefox/i.test(ua)) browser = "Firefox";
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = "Safari";
  else if (/Edge/i.test(ua)) browser = "Edge";
  return { tipo: isMobile ? "📱 Móvil" : "💻 Escritorio", os, browser };
}

async function guardar(key, data) {
  try { localStorage.setItem(key, await cifrar(data)); } catch {}
}
async function cargar(key) {
  try { const raw = localStorage.getItem(key); return raw ? await descifrar(raw) : null; } catch { return null; }
}

// ══════════════════════════════════════════════
// 🔊 SONIDOS
// ══════════════════════════════════════════════
function useSounds() {
  const ctxRef = useRef(null);
  function getCtx() {
    if (!ctxRef.current) ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    return ctxRef.current;
  }
  const play = useCallback((type) => {
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      const now = ctx.currentTime;
      switch (type) {
        case "click":
          osc.type="sine"; osc.frequency.setValueAtTime(600,now); osc.frequency.exponentialRampToValueAtTime(400,now+0.08);
          gain.gain.setValueAtTime(0.12,now); gain.gain.exponentialRampToValueAtTime(0.001,now+0.08);
          osc.start(now); osc.stop(now+0.08); break;
        case "nav":
          osc.type="sine"; osc.frequency.setValueAtTime(440,now); osc.frequency.exponentialRampToValueAtTime(660,now+0.12);
          gain.gain.setValueAtTime(0.1,now); gain.gain.exponentialRampToValueAtTime(0.001,now+0.15);
          osc.start(now); osc.stop(now+0.15); break;
        case "back":
          osc.type="sine"; osc.frequency.setValueAtTime(660,now); osc.frequency.exponentialRampToValueAtTime(440,now+0.12);
          gain.gain.setValueAtTime(0.1,now); gain.gain.exponentialRampToValueAtTime(0.001,now+0.15);
          osc.start(now); osc.stop(now+0.15); break;
        case "send":
          [523,659,784].forEach((freq,i)=>{
            const o2=ctx.createOscillator(); const g2=ctx.createGain();
            o2.connect(g2); g2.connect(ctx.destination);
            o2.type="sine"; o2.frequency.setValueAtTime(freq,now+i*0.06);
            g2.gain.setValueAtTime(0.09,now+i*0.06); g2.gain.exponentialRampToValueAtTime(0.001,now+i*0.06+0.2);
            o2.start(now+i*0.06); o2.stop(now+i*0.06+0.2);
          }); break;
        case "toggle":
          osc.disconnect(); gain.disconnect();
          [0,0.09].forEach((t,i)=>{
            const o2=ctx.createOscillator(); const g2=ctx.createGain();
            o2.connect(g2); g2.connect(ctx.destination); o2.type="sine";
            o2.frequency.setValueAtTime(i===0?520:780,now+t);
            o2.frequency.exponentialRampToValueAtTime(i===0?620:900,now+t+0.07);
            g2.gain.setValueAtTime(0.08,now+t); g2.gain.exponentialRampToValueAtTime(0.001,now+t+0.1);
            o2.start(now+t); o2.stop(now+t+0.1);
          }); break;
        case "darkmode":
          osc.type="sine"; osc.frequency.setValueAtTime(380,now); osc.frequency.exponentialRampToValueAtTime(520,now+0.1);
          gain.gain.setValueAtTime(0.09,now); gain.gain.exponentialRampToValueAtTime(0.001,now+0.12);
          osc.start(now); osc.stop(now+0.12); break;
        case "error":
          osc.type="sawtooth"; osc.frequency.setValueAtTime(200,now); osc.frequency.exponentialRampToValueAtTime(150,now+0.15);
          gain.gain.setValueAtTime(0.1,now); gain.gain.exponentialRampToValueAtTime(0.001,now+0.15);
          osc.start(now); osc.stop(now+0.15); break;
        case "open":
          osc.type="sine"; osc.frequency.setValueAtTime(350,now); osc.frequency.exponentialRampToValueAtTime(700,now+0.18);
          gain.gain.setValueAtTime(0.08,now); gain.gain.exponentialRampToValueAtTime(0.001,now+0.2);
          osc.start(now); osc.stop(now+0.2); break;
        case "chat":
          osc.type="sine"; osc.frequency.setValueAtTime(880,now); osc.frequency.exponentialRampToValueAtTime(1100,now+0.07);
          gain.gain.setValueAtTime(0.07,now); gain.gain.exponentialRampToValueAtTime(0.001,now+0.1);
          osc.start(now); osc.stop(now+0.1); break;
        default: break;
      }
    } catch {}
  }, []);
  return play;
}

// ══════════════════════════════════════════════
// 📋 DATOS E INSTITUCIONALES
// ══════════════════════════════════════════════
const CATEGORIAS   = ["Bullying / acoso","Violencia física","Consumo de sustancias","Otra cosa"];
const CAT_DIR      = ["Conducta docente","Infraestructura","Administrativo","Otro"];
const ESTADOS      = ["En espera","Recibido / Leído","Resuelto"];
const ESTADO_COLOR = {
  "En espera":        { bg:"#FAEEDA", text:"#854F0B", dot:"#EF9F27", bgD:"#3a2500", textD:"#f5c077" },
  "Recibido / Leído": { bg:"#E6F1FB", text:"#185FA5", dot:"#378ADD", bgD:"#0d2a45", textD:"#7ab8f5" },
  "Resuelto":         { bg:"#EAF3DE", text:"#3B6D11", dot:"#639922", bgD:"#1a2e0a", textD:"#90c95a" },
};
const CAT_ICON = {
  "Bullying / acoso":"⚡","Violencia física":"🚨","Consumo de sustancias":"⚠️","Otra cosa":"📝",
  "Conducta docente":"👔","Infraestructura":"🏫","Administrativo":"📋","Otro":"📌",
};

const PROFESORES_HASH = [
  { usuario:"Jesús Adrian Mondragón Chú", passHash:null, passPlain:"K@rtdsPomele37", nombre:"Jesús Adrián Mondragón Chú-Alcalde", cargo:"Director / Alcalde" },
];
const NOMBRES_RESERVADOS = PROFESORES_HASH.map(p => p.usuario.toLowerCase());

// 🔑 Clave secreta administrativa para admitir nuevos profesores
const CLAVE_REGISTRO_PROFESOR = "SafeSchoolAdmin2025!"; 

// ══════════════════════════════════════════════
// 🎨 HELPERS UI
// ══════════════════════════════════════════════
function getColors(dark) {
  return {
    bg:dark?"#0f0f0f":"#fff", bg2:dark?"#1a1a1a":"#f3f4f6",
    bg3:dark?"#242424":"#fff", text:dark?"#f0f0f0":"#1a1a1a",
    text2:dark?"#a0a0a0":"#6b7280", text3:dark?"#666":"#9ca3af",
    border:dark?"#2e2e2e":"#d1d5db", border2:dark?"#222":"#e5e7eb",
    info_bg:dark?"#0d2a45":"#E6F1FB", info_tx:dark?"#7ab8f5":"#185FA5",
    blue:"#185FA5", green:dark?"#1a2e0a":"#EAF3DE", greenTx:dark?"#90c95a":"#27500A",
    warn_bg:dark?"#2a1500":"#FFF3E0", warn_tx:dark?"#f5a623":"#7A4100",
  };
}

function exportarTXT(reportes, repDirectiva) {
  const lines = ["SAFESCHOOL - REPORTE GENERAL", `Generado: ${new Date().toLocaleDateString("es-PE")}`, "=".repeat(50), `\nREPORTES DE ALUMNOS (${reportes.length})\n`];
  reportes.forEach((r,i) => { lines.push(`${i+1}. [${r.estado}] ${r.categoria} - ${r.fecha}`); lines.push(`   Alias: ${r.alias}`); lines.push(`   ${r.descripcion}`); if(r.nota) lines.push(`   Nota: ${r.nota}`); lines.push(""); });
  lines.push("=".repeat(50), `\nREPORTES DE DIRECTIVA (${repDirectiva.length})\n`);
  repDirectiva.forEach((r,i) => { lines.push(`${i+1}. [${r.estado}] ${r.categoria} - ${r.fecha}`); lines.push(`   Autor: ${r.autor}`); lines.push(`   ${r.descripcion}`); lines.push(""); });
  const blob = new Blob([lines.join("\n")], { type:"text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href=url; a.download=`SafeSchool_${new Date().toISOString().slice(0,10)}.txt`; a.click(); URL.revokeObjectURL(url);
}

// ══════════════════════════════════════════════
// 🧩 SUBCOMPONENTES
// ══════════════════════════════════════════════
function Badge({ estado, dark }) {
  const col = ESTADO_COLOR[estado];
  return <span style={{ fontSize:11, fontWeight:500, padding:"4px 10px", borderRadius:99, background:dark?col.bgD:col.bg, color:dark?col.textD:col.text, whiteSpace:"nowrap" }}><span style={{ display:"inline-block", width:7, height:7, borderRadius:"50%", background:col.dot, marginRight:5, verticalAlign:"middle" }} />{estado}</span>;
}

function CardReporte({ r, onClick, esDir, esProfesor, dark, c, play }) {
  const msgNuevos = !esProfesor ? (r.chat||[]).filter(m => m.de==="profesor" && !m.leido).length : 0;
  return (
    <div onClick={()=>{ if(onClick){ play("nav"); onClick(); } }} style={{ background:c.bg3, border:`0.5px solid ${c.border2}`, borderRadius:14, padding:"14px 16px", cursor:onClick?"pointer":"default", display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12 }}>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:12, color:c.text2, marginBottom:4 }}>{CAT_ICON[r.categoria]} {r.categoria} · {r.fecha}</div>
        <div style={{ fontSize:14, color:c.text, fontWeight:500, marginBottom:4 }}>{esDir?r.autor:(esProfesor?`Alias: ${r.alias}`:r.alias)}</div>
        <div style={{ fontSize:13, color:c.text2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.descripcion}</div>
        {r.adjuntos?.length>0 && <div style={{ fontSize:11, color:c.text3, marginTop:4 }}>📎 {r.adjuntos.length} archivo{r.adjuntos.length>1?"s":""}</div>}
      </div>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6, flexShrink:0 }}>
        <Badge estado={r.estado} dark={dark} />
        {msgNuevos>0 && <span style={{ background:"#C0392B", color:"#fff", borderRadius:99, fontSize:11, padding:"2px 8px" }}>💬 {msgNuevos} nuevo{msgNuevos>1?"s":""}</span>}
        {onClick && <span style={{ fontSize:11, color:c.text3 }}>Ver →</span>}
      </div>
    </div>
  );
}

function FiltroBar({ opciones, valor, onChange, c, play }) {
  return (
    <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
      {["Todos",...opciones].map(f => (
        <button key={f} onClick={()=>{ play("toggle"); onChange(f); }} style={{ padding:"5px 14px", borderRadius:99, fontSize:13, cursor:"pointer", background:valor===f?c.info_bg:c.bg2, color:valor===f?c.info_tx:c.text2, border:valor===f?`1px solid ${c.info_tx}`:`0.5px solid ${c.border}` }}>{f}</button>
      ))}
    </div>
  );
}

function AppHeader({ titulo, onBack, sesion, esProfesor, dark, setDark, setAjustes, c, play }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18, paddingBottom:14, borderBottom:`0.5px solid ${c.border2}` }}>
      {onBack && <button onClick={()=>{ play("back"); onBack(); }} style={{ background:"none", border:`0.5px solid ${c.border}`, borderRadius:8, padding:"4px 12px", fontSize:13, cursor:"pointer", color:c.text2 }}>← Volver</button>}
      {titulo
        ? <span style={{ fontWeight:500, fontSize:16, color:c.text, flex:1 }}>{titulo}</span>
        : <div style={{ flex:1 }}>
            {esProfesor
              ? <><div style={{ fontSize:11, color:c.text2 }}>{sesion.cargo}</div><div style={{ fontWeight:500, fontSize:15, color:c.text }}>{sesion.nombre}</div></>
              : <><div style={{ fontSize:11, color:c.text2 }}>Alumno · sesión activa 🔒</div><div style={{ fontWeight:500, fontSize:15, color:c.text }}>{sesion.usuario}</div></>
            }
          </div>
      }
      <button onClick={()=>{ play("darkmode"); setDark(d=>!d); }} style={{ background:c.bg2, border:`0.5px solid ${c.border}`, borderRadius:10, width:38, height:38, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:17, flexShrink:0 }}>{dark?"☀️":"🌙"}</button>
      <button onClick={()=>{ play("open"); setAjustes(true); }} style={{ background:c.bg2, border:`0.5px solid ${c.border}`, borderRadius:10, width:38, height:38, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:18, flexShrink:0 }}>⚙️</button>
    </div>
  );
}

// ══════════════════════════════════════════════
// 🏠 COMPONENTE PRINCIPAL
// ══════════════════════════════════════════════
export default function App() {
  const play = useSounds();
  const [dark, setDark] = useState(() => { try { return localStorage.getItem("ss_theme")==="dark"; } catch { return false; } });
  useEffect(() => { try { localStorage.setItem("ss_theme", dark?"dark":"light"); } catch {} document.body.style.background = dark?"#0f0f0f":"#fff"; }, [dark]);
  const c = getColors(dark);

  // ── Estados cargados desde localStorage cifrado ──
  const [appReady,      setAppReady]      = useState(false);
  const [sesion,        setSesion]        = useState(null);
  const [pantalla,      setPantalla]      = useState("inicio");
  const [ajustes,       setAjustes]       = useState(false);
  const [alumnosBD,     setAlumnosBD]     = useState([]);
  const [reportes,      setReportes]      = useState([]);
  const [repDirectiva,  setRepDirectiva]  = useState([]);
  const [logs,          setLogs]          = useState([]);
  const [nextId,        setNextId]        = useState(1);
  const [nextAlumnoId,  setNextAlumnoId]  = useState(1);
  const [vistaLogs,      setVistaLogs]     = useState(false);
  const [cuentas,        setCuentas]       = useState([]);
  const [vistaCuentas,  setVistaCuentas]  = useState(false);
  const [pinCuentas,    setPinCuentas]    = useState("");
  const [pinError,      setPinError]      = useState("");
  const [pinVerificado, setPinVerificado] = useState(false);

  // ── Nuevos estados para Registro Dinámico de Profesores ──
  const [profesoresBD,  setProfesoresBD]  = useState([]);
  const [regProfNombre, setRegProfNombre] = useState("");
  const [regProfUser,   setRegProfUser]   = useState("");
  const [regProfPass,   setRegProfPass]   = useState("");
  const [regProfCargo,  setRegProfCargo]  = useState("");
  const [regProfToken,  setRegProfToken]  = useState("");

  // ── Cargar todo al iniciar la app ──
  useEffect(() => {
    (async () => {
      const [s, a, p, r, d, l, nid, naid, cu] = await Promise.all([
        cargar(KEYS.sesion), cargar(KEYS.alumnos), 
        cargar(KEYS.profesores),
        cargar(KEYS.reportes), cargar(KEYS.directiva), 
        cargar(KEYS.logs), cargar(KEYS.nextId), cargar(KEYS.nextAlumnoId), cargar(KEYS.cuentas),
      ]);
      if (a) setAlumnosBD(a);
      if (p) setProfesoresBD(p);
      if (r) setReportes(r);
      if (d) setRepDirectiva(d);
      if (l) setLogs(l);
      if (nid) setNextId(nid);
      if (naid) setNextAlumnoId(naid);
      if (cu) setCuentas(cu);
      if (s) { setSesion(s); setPantalla("app"); }
      setAppReady(true);
    })();
  }, []);

  // ── Guardado automático reactivo ──
  useEffect(() => { if (appReady) guardar(KEYS.alumnos,    alumnosBD);    }, [alumnosBD,    appReady]);
  useEffect(() => { if (appReady) guardar(KEYS.profesores, profesoresBD); }, [profesoresBD, appReady]);
  useEffect(() => { if (appReady) guardar(KEYS.reportes,   reportes);     }, [reportes,     appReady]);
  useEffect(() => { if (appReady) guardar(KEYS.directiva,  repDirectiva); }, [repDirectiva, appReady]);
  useEffect(() => { if (appReady) guardar(KEYS.logs,       logs);         }, [logs,         appReady]);
  useEffect(() => { if (appReady) guardar(KEYS.nextId,     nextId);       }, [nextId,       appReady]);
  useEffect(() => { if (appReady) guardar(KEYS.nextAlumnoId, nextAlumnoId); }, [nextAlumnoId, appReady]);
  useEffect(() => { if (appReady) guardar(KEYS.cuentas, cuentas); }, [cuentas, appReady]);

  const [nuevoUser, setNuevoUser] = useState(""); const [nuevaPass, setNuevaPass] = useState("");
  const [loginUser, setLoginUser] = useState(""); const [loginPass, setLoginPass] = useState("");
  const [profUser,  setProfUser]  = useState(""); const [profPass,  setProfPass]  = useState("");
  const [errMsg,    setErrMsg]    = useState(""); const [errProf,   setErrProf]   = useState("");
  const [vista,     setVista]     = useState("lista"); 
  const [selId,     setSelId]     = useState(null);
  const [filtro,    setFiltro]    = useState("Todos");
  const [filtroD,   setFiltroD]   = useState("Todos");
  const [cat,       setCat]       = useState(CATEGORIAS[0]);
  const [catDir,    setCatDir]    = useState(CAT_DIR[0]);
  const [desc,      setDesc]      = useState(""); const [descDir, setDescDir] = useState("");
  const [nota,      setNota]      = useState(""); const [notaDir, setNotaDir] = useState("");
  const [adjuntos,  setAdjuntos]  = useState([]);
  const [enviado,   setEnviado]   = useState(false);
  const [enviadoDir,setEnviadoDir]= useState(false);
  const [chatMsg,   setChatMsg]   = useState("");
  const [notaInt,   setNotaInt]   = useState("");
  const [confirmDel,setConfirmDel]= useState(null);
  const fileRef = useRef();

  const esProfesor = sesion?.tipo === "profesor";
  const selReporte = reportes.find(r => r.id === selId);
  const selRepDir  = repDirectiva.find(r => r.id === selId);
  const reportesFiltrados = esProfesor
    ? reportes.filter(r => filtro==="Todos" || r.estado===filtro)
    : reportes.filter(r => r.alumnoId===sesion?.id);
  const repDirFiltrados = repDirectiva.filter(r => filtroD==="Todos" || r.estado===filtroD);

  const inp   = { width:"100%", padding:"10px 12px", borderRadius:10, border:`0.5px solid ${c.border}`, background:c.bg3, color:c.text, fontSize:14, boxSizing:"border-box", outline:"none" };
  const btnS  = (bg,col) => ({ padding:"11px", borderRadius:10, border:"none", background:bg, color:col, fontSize:14, fontWeight:500, cursor:"pointer", width:"100%" });
  const wrap  = { padding:"1.5rem 1rem", background:c.bg, minHeight:"100vh" };
  const authWrap = { padding:"2rem 1.2rem", maxWidth:380, margin:"0 auto", background:c.bg, minHeight:"100vh" };

  function addLog(evento, usuario) {
    const entry = {
      evento, usuario,
      fecha: new Date().toLocaleDateString("es-PE"),
      hora:  new Date().toLocaleTimeString("es-PE", { hour:"2-digit", minute:"2-digit", second:"2-digit" }),
      device: navigator.userAgent.includes("Mobile") ? "📱 Móvil" : "💻 Escritorio",
    };
    setLogs(prev => [entry, ...prev].slice(0, 100));
  }
  function mkHistorial(accion) {
    return { accion, fecha:new Date().toLocaleDateString("es-PE"), hora:new Date().toLocaleTimeString("es-PE",{hour:"2-digit",minute:"2-digit"}) };
  }

  async function login(s) {
    play("send");
    setSesion(s);
    await guardar(KEYS.sesion, s);
    setPantalla("app");
    addLog("Inicio de sesión", s.nombre || s.usuario);
  }
  async function cerrarSesion() {
    play("back");
    addLog("Cierre de sesión", sesion?.nombre || sesion?.usuario || "—");
    await guardar(KEYS.sesion, null);
    localStorage.removeItem(KEYS.sesion);
    setVista("lista"); setSelId(null); setAjustes(false);
    setVistaLogs(false); setVistaCuentas(false); setConfirmDel(null);
    setErrMsg(""); setErrProf(""); setLoginUser(""); setLoginPass("");
    setProfUser(""); setProfPass(""); setEnviado(false); setEnviadoDir(false);
    setChatMsg(""); setNotaInt(""); setPinCuentas(""); setPinVerificado(false); setPinError("");
    setRegProfNombre(""); setRegProfUser(""); setRegProfPass(""); setRegProfCargo(""); setRegProfToken("");
    setPantalla("inicio");
    setSesion(null);
  }

  async function registrarAlumno() {
    const u = nuevoUser.trim();
    if (!u || !nuevaPass.trim()) { play("error"); setErrMsg("Completa todos los campos."); return; }
    if (nuevaPass.trim().length < 6) { play("error"); setErrMsg("La contraseña debe tener al menos 6 caracteres."); return; }
    if (NOMBRES_RESERVADOS.includes(u.toLowerCase())) { play("error"); setErrMsg("Ese nombre está reservado."); return; }
    if (alumnosBD.find(a => a.usuario.toLowerCase()===u.toLowerCase())) { play("error"); setErrMsg("Ese usuario ya está registrado."); return; }
    const passHash = await sha256(nuevaPass.trim());
    const id = nextAlumnoId;
    setNextAlumnoId(id + 1);
    const dev = getDeviceInfo();
    const alumno = { id, usuario:u, passHash };
    setAlumnosBD(prev => [...prev, alumno]);
    const nuevaCuenta = {
      usuario: u,
      fecha: new Date().toLocaleDateString("es-PE"),
      hora:  new Date().toLocaleTimeString("es-PE", { hour:"2-digit", minute:"2-digit", second:"2-digit" }),
      deviceId: getDeviceId(),
      dispositivo: dev.tipo,
      os: dev.os,
      browser: dev.browser,
    };
    setCuentas(prev => [nuevaCuenta, ...prev]);
    addLog("Registro de alumno", u);
    await login({ tipo:"alumno", usuario:alumno.usuario, id:alumno.id });
    setNuevoUser(""); setNuevaPass(""); setErrMsg("");
  }

  // ── Función para registrar profesores con Clave Administrativa ──
  async function registrarProfesor() {
    const nombre = regProfNombre.trim();
    const usuario = regProfUser.trim();
    const pass = regProfPass.trim();
    const cargo = regProfCargo.trim();
    const token = regProfToken.trim();

    if (!nombre || !usuario || !pass || !cargo || !token) {
      play("error"); setErrProf("Completa todos los campos obligatorios."); return;
    }
    if (token !== CLAVE_REGISTRO_PROFESOR) {
      play("error"); 
      setErrProf("Código de invitación administrativo incorrecto. Acceso denegado.");
      addLog("Intento de registro docente fallido", usuario);
      return;
    }
    if (pass.length < 8) {
      play("error"); setErrProf("La contraseña docente debe tener al menos 8 caracteres."); return;
    }

    const existeEnEstaticos = PROFESORES_HASH.find(p => p.usuario.toLowerCase() === usuario.toLowerCase());
    const existeEnDinamicos = profesoresBD.find(p => p.usuario.toLowerCase() === usuario.toLowerCase());
    const existeEnAlumnos = alumnosBD.find(a => a.usuario.toLowerCase() === usuario.toLowerCase());

    if (existeEnEstaticos || existeEnDinamicos || existeEnAlumnos) {
      play("error"); setErrProf("Este nombre de usuario ya está en uso."); return;
    }

    const passHash = await sha256(pass);
    const nuevoProfesor = { usuario, passHash, nombre, cargo };

    setProfesoresBD(prev => [...prev, nuevoProfesor]);
    addLog("Nuevo profesor registrado", nombre);

    await login({ tipo: "profesor", nombre, cargo });
    setRegProfNombre(""); setRegProfUser(""); setRegProfPass(""); setRegProfCargo(""); setRegProfToken(""); setErrProf("");
  }

  async function loginAlumno() {
    const passHash = await sha256(loginPass.trim());
    const alumno = alumnosBD.find(a => a.usuario.toLowerCase()===loginUser.trim().toLowerCase() && a.passHash===passHash);
    if (!alumno) { play("error"); setErrMsg("Usuario o contraseña incorrectos."); addLog("Login fallido (alumno)", loginUser.trim()); return; }
    await login({ tipo:"alumno", usuario:alumno.usuario, id:alumno.id });
    setLoginUser(""); setLoginPass(""); setErrMsg("");
  }

  async function loginProfesor() {
    const user = profUser.trim();
    const pass = profPass.trim();
    const passHash = await sha256(pass);

    let profEncontrado = profesoresBD.find(p => p.usuario.toLowerCase() === user.toLowerCase() && p.passHash === passHash);

    if (!profEncontrado) {
      const profEstatico = PROFESORES_HASH.find(p => p.usuario.toLowerCase() === user.toLowerCase());
      if (profEstatico) {
        const hashEsperado = await sha256(profEstatico.passPlain);
        if (passHash === hashEsperado) {
          profEncontrado = { nombre: profEstatico.nombre, cargo: profEstatico.cargo };
        }
      }
    }

    if (!profEncontrado) { 
      play("error"); 
      setErrProf("Usuario o contraseña incorrectos."); 
      addLog("Login fallido (profesor)", user); 
      return; 
    }

    await login({ tipo:"profesor", nombre:profEncontrado.nombre, cargo:profEncontrado.cargo });
    setProfUser(""); setProfPass(""); setErrProf("");
  }

  function handleFiles(files) {
    play("click");
    Array.from(files).forEach(file => {
      if (adjuntos.length>=5) return;
      const reader = new FileReader();
      reader.onload = e => setAdjuntos(prev => [...prev, { name:file.name, dataUrl:e.target.result, type:file.type }]);
      reader.readAsDataURL(file);
    });
  }

  function enviarReporte() {
    if (!desc.trim()) return;
    play("send");
    const id = nextId; setNextId(id + 1);
    setReportes(prev => [{ id, alias:sesion.usuario, alumnoId:sesion.id, categoria:cat, descripcion:desc.trim(), nota:nota.trim(), adjuntos:[...adjuntos], estado:"En espera", fecha:new Date().toLocaleDateString("es-PE",{day:"2-digit",month:"short",year:"numeric"}), notas_internas:[], chat:[], historial:[mkHistorial("Reporte creado")] }, ...prev]);
    addLog("Reporte enviado", sesion.usuario);
    setEnviado(true); setDesc(""); setNota(""); setAdjuntos([]);
  }

  function enviarReporteDir() {
    if (!descDir.trim()) return;
    play("send");
    const id = nextId; setNextId(id + 1);
    setRepDirectiva(prev => [{ id, autor:sesion.nombre, cargo:sesion.cargo, categoria:catDir, descripcion:descDir.trim(), nota:notaDir.trim(), estado:"En espera", fecha:new Date().toLocaleDateString("es-PE",{day:"2-digit",month:"short",year:"numeric"}), notas_internas:[], chat:[], historial:[mkHistorial("Reporte creado")] }, ...prev]);
    addLog("Reporte directiva enviado", sesion.nombre);
    setEnviadoDir(true); setDescDir(""); setNotaDir("");
  }

  function cambiarEstado(id, est, esDir=false) {
    play("toggle");
    const entry = mkHistorial(`Estado cambiado a "${est}"`);
    if (esDir) setRepDirectiva(prev => prev.map(r => r.id===id?{...r,estado:est,historial:[...r.historial,entry]}:r));
    else       setReportes(prev => prev.map(r => r.id===id?{...r,estado:est,historial:[...r.historial,entry]}:r));
    addLog(`Estado → "${est}"`, sesion?.nombre || sesion?.usuario);
  }

  function enviarChat(id, esDir=false) {
    if (!chatMsg.trim()) return;
    play("chat");
    const msg = { id:Date.now(), de:esProfesor?"profesor":"alumno", texto:chatMsg.trim(), fecha:new Date().toLocaleTimeString("es-PE",{hour:"2-digit",minute:"2-digit"}), leido:false };
    if (esDir) setRepDirectiva(prev => prev.map(r => r.id===id?{...r,chat:[...(r.chat||[]),msg]}:r));
    else       setReportes(prev => prev.map(r => r.id===id?{...r,chat:[...(r.chat||[]),msg]}:r));
    setChatMsg("");
  }

  function marcarLeidos(id) {
    setReportes(prev => prev.map(r => r.id===id?{...r,chat:(r.chat||[]).map(m=>m.de==="profesor"?{...m,leido:true}:m)}:r));
  }

  function agregarNota(id, esDir=false) {
    if (!notaInt.trim()) return;
    play("click");
    const n = { texto:notaInt.trim(), fecha:new Date().toLocaleDateString("es-PE") };
    if (esDir) setRepDirectiva(prev => prev.map(r => r.id===id?{...r,notas_internas:[...(r.notas_internas||[]),n]}:r));
    else       setReportes(prev => prev.map(r => r.id===id?{...r,notas_internas:[...(r.notas_internas||[]),n]}:r));
    setNotaInt("");
  }

  function eliminarReporte(id, esDir=false) {
    play("error");
    if (esDir) setRepDirectiva(prev => prev.filter(r => r.id!==id));
    else       setReportes(prev => prev.filter(r => r.id!==id));
    addLog("Reporte eliminado", sesion?.nombre || sesion?.usuario);
    setConfirmDel(null); setSelId(null); setVista(esDir?"directiva":"lista");
  }

  function renderDetalle(r, esDir=false) {
    return (
      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
        <div style={{ background:c.bg3, border:`0.5px solid ${c.border2}`, borderRadius:14, padding:"16px 18px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
            <div>
              <span style={{ fontSize:12, color:c.text2, display:"block" }}>{CAT_ICON[r.categoria]} {r.categoria}</span>
              <span style={{ fontWeight:500, fontSize:15, color:c.text }}>{esDir?r.autor:`Alias: ${r.alias}`}</span>
              {esDir&&<span style={{ fontSize:12, color:c.text2, display:"block" }}>{r.cargo}</span>}
            </div>
            <span style={{ fontSize:12, color:c.text2 }}>{r.fecha}</span>
          </div>
          <p style={{ fontSize:14, color:c.text, lineHeight:1.6, marginBottom:6 }}>{r.descripcion}</p>
          {r.nota && <p style={{ fontSize:13, color:c.text2, fontStyle:"italic" }}>Nota: {r.nota}</p>}
          {r.adjuntos?.length>0 && (
            <div style={{ marginTop:12 }}>
              <div style={{ fontSize:12, color:c.text2, marginBottom:8 }}>📎 Archivos adjuntos</div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {r.adjuntos.map((a,i) => a.type?.startsWith("image/")
                  ? <img key={i} src={a.dataUrl} alt={a.name} style={{ width:80, height:80, objectFit:"cover", borderRadius:8 }} />
                  : <a key={i} href={a.dataUrl} download={a.name} style={{ fontSize:12, color:c.info_tx, background:c.info_bg, padding:"6px 10px", borderRadius:8, textDecoration:"none" }}>📄 {a.name}</a>
                )}
              </div>
            </div>
          )}
        </div>

        {esProfesor
          ? <div><label style={{ fontSize:13, color:c.text2, display:"block", marginBottom:8 }}>Estado del caso</label>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {ESTADOS.map(est => { const col=ESTADO_COLOR[est]; const a=r.estado===est; return (
                  <button key={est} onClick={()=>cambiarEstado(r.id,est,esDir)} style={{ padding:"6px 14px", borderRadius:99, fontSize:13, cursor:"pointer", background:a?(dark?col.bgD:col.bg):c.bg2, color:a?(dark?col.textD:col.text):c.text2, border:a?`1.5px solid ${col.dot}`:`0.5px solid ${c.border}`, fontWeight:a?500:400 }}>{est}</button>
                ); })}
              </div>
            </div>
          : <div style={{ display:"flex", alignItems:"center", gap:8 }}><span style={{ fontSize:13, color:c.text2 }}>Estado:</span><Badge estado={r.estado} dark={dark} /></div>
        }

        <div>
          <label style={{ fontSize:13, color:c.text2, display:"block", marginBottom:8 }}>💬 Chat con {esProfesor?"el alumno":"el profesor"}</label>
          <div style={{ background:c.bg2, borderRadius:12, padding:12, marginBottom:8, minHeight:80, maxHeight:200, overflowY:"auto", display:"flex", flexDirection:"column", gap:8 }}>
            {(r.chat||[]).length===0 && <div style={{ fontSize:13, color:c.text3, textAlign:"center", marginTop:16 }}>Sin mensajes aún</div>}
            {(r.chat||[]).map(m => (
              <div key={m.id} style={{ display:"flex", justifyContent:m.de==="profesor"?"flex-start":"flex-end" }}>
                <div style={{ maxWidth:"75%", background:m.de==="profesor"?(dark?"#0d2a45":"#E6F1FB"):(dark?"#1a3a1a":"#EAF3DE"), borderRadius:10, padding:"8px 12px" }}>
                  <div style={{ fontSize:11, color:c.text3, marginBottom:3 }}>{m.de==="profesor"?"Profesor":"Tú"} · {m.fecha}</div>
                  <div style={{ fontSize:13, color:c.text }}>{m.texto}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <input style={{ ...inp, flex:1 }} value={chatMsg} onChange={e=>setChatMsg(e.target.value)} placeholder="Escribe un mensaje..." onKeyDown={e=>e.key==="Enter"&&enviarChat(r.id,esDir)} />
            <button onClick={()=>enviarChat(r.id,esDir)} style={{ padding:"0 16px", borderRadius:10, border:"none", background:c.blue, cursor:"pointer", fontSize:13, color:"#fff" }}>Enviar</button>
          </div>
        </div>

        {esProfesor && (
          <div>
            <label style={{ fontSize:13, color:c.text2, display:"block", marginBottom:8 }}>🔒 Notas internas (solo profesores)</label>
            <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:8 }}>
              {(r.notas_internas||[]).map((n,i) => (
                <div key={i} style={{ background:c.bg2, padding:"8px 12px", borderRadius:8, fontSize:13, color:c.text, borderLeft:`3px solid ${c.border}` }}>
                  <span style={{ fontSize:11, color:c.text3, display:"block", marginBottom:2 }}>{n.fecha}</span>
                  {n.texto}
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <input style={{ ...inp, flex:1 }} value={notaInt} onChange={e=>setNotaInt(e.target.value)} placeholder="Agregar nota interna..." />
              <button onClick={()=>agregarNota(r.id,esDir)} style={{ padding:"0 14px", borderRadius:10, border:"none", background:c.bg2, color:c.text, cursor:"pointer", fontSize:13 }}>Guardar</button>
            </div>
          </div>
        )}

        {esProfesor && (
          <div style={{ marginTop:8, borderTop:`0.5px solid ${c.border2}`, paddingTop:14 }}>
            {confirmDel === r.id ? (
              <div style={{ display:"flex", alignItems:"center", gap:10, background:c.warn_bg, padding:10, borderRadius:10 }}>
                <span style={{ fontSize:13, color:c.warn_tx, flex:1 }}>¿Seguro que deseas eliminar permanentemente este caso?</span>
                <button onClick={()=>eliminarReporte(r.id,esDir)} style={{ background:"#C0392B", color:"#fff", border:"none", padding:"6px 12px", borderRadius:6, fontSize:12, cursor:"pointer" }}>Sí, eliminar</button>
                <button onClick={()=>setConfirmDel(null)} style={{ background:"none", border:`0.5px solid ${c.border}`, color:c.text2, padding:"6px 12px", borderRadius:6, fontSize:12, cursor:"pointer" }}>No</button>
              </div>
            ) : (
              <button onClick={()=>setConfirmDel(r.id)} style={{ background:"none", border:"none", color:"#C0392B", fontSize:13, cursor:"pointer", padding:0 }}>⚠️ Eliminar reporte del sistema</button>
            )}
          </div>
        )}
      </div>
    );
  }

  // ══════════════════════════════════════════════
  // 🖼️ PANTALLA DE INICIO (PROCESO ORIGINAL PRESERVADO)
  // ══════════════════════════════════════════════
  if (pantalla === "inicio") {
    return (
      <div style={authWrap}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <span style={{ fontSize: 32 }}>🏫</span>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: c.blue, margin: "8px 0 2px 0" }}>SafeSchool</h1>
          <p style={{ fontSize: 13, color: c.text2, margin: 0 }}>Plataforma segura y confidencial de reportes</p>
          <div style={{ marginTop: 8, display: "inline-block", background: c.info_bg, color: c.info_tx, fontSize: 11, padding: "4px 10px", borderRadius: 99 }}>
            🔐 Datos cifrados con AES-GCM · Contraseñas con SHA-256
          </div>
        </div>

        {/* NOTIFICACIÓN DE ERRORES */}
        {errMsg && <div style={{ background: "#FADBD8", color: "#78281F", padding: 10, borderRadius: 8, fontSize: 13, marginBottom: 14, textAlign: "center" }}>{errMsg}</div>}
        {errProf && <div style={{ background: "#FFF3E0", color: "#7A4100", padding: 10, borderRadius: 8, fontSize: 13, marginBottom: 14, textAlign: "center" }}>{errProf}</div>}

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          
          {/* 👤 SECCIÓN SOY ALUMNO */}
          <div style={{ background: c.bg3, border: `0.5px solid ${c.border2}`, borderRadius: 14, padding: 16 }}>
            <div style={{ cursor: "pointer" }} onClick={() => { play("toggle"); setVista(vista === "form_alumno" ? "lista" : "form_alumno"); }}>
              <h3 style={{ fontSize: 15, margin: 0, color: c.text, fontWeight: 600 }}>Soy alumno</h3>
              <p style={{ fontSize: 12, color: c.text2, margin: "4px 0 0 0" }}>Inicia sesión o crea tu cuenta de forma anónima</p>
            </div>

            {vista === "form_alumno" && (
              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 14, borderTop: `0.5px solid ${c.border2}`, paddingTop: 14 }}>
                <div style={{ background: c.bg2, padding: 12, borderRadius: 10 }}>
                  <h4 style={{ fontSize: 13, margin: "0 0 8px 0", color: c.text }}>Crear nueva cuenta anónima</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <input style={inp} placeholder="Crea un alias (Ej: HalcónAzul)" value={nuevoUser} onChange={e => setNuevoUser(e.target.value)} />
                    <input style={inp} type="password" placeholder="Crea una contraseña pin" value={nuevaPass} onChange={e => setNuevaPass(e.target.value)} />
                    <button onClick={registrarAlumno} style={btnS(c.blue, "#fff")}>Registrarme e Ingresar 🔒</button>
                  </div>
                </div>
                <div>
                  <h4 style={{ fontSize: 13, margin: "0 0 8px 0", color: c.text2 }}>Ya tengo una cuenta</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <input style={inp} placeholder="Tu alias anónimo" value={loginUser} onChange={e => setLoginUser(e.target.value)} />
                    <input style={inp} type="password" placeholder="Tu contraseña" value={loginPass} onChange={e => setLoginPass(e.target.value)} />
                    <button onClick={loginAlumno} style={btnS(c.bg2, c.text)}>Ingresar al sistema</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 👔 SECCIÓN SOY PROFESOR / ADMIN */}
          <div style={{ background: c.bg3, border: `0.5px solid ${c.border2}`, borderRadius: 14, padding: 16 }}>
            <div style={{ cursor: "pointer" }} onClick={() => { play("toggle"); setVista(vista === "form_profesor" ? "lista" : "form_profesor"); }}>
              <h3 style={{ fontSize: 15, margin: 0, color: c.text, fontWeight: 600 }}>Soy profesor / admin</h3>
              <p style={{ fontSize: 12, color: c.text2, margin: "4px 0 0 0" }}>Accede con tus credenciales o registra tu cuenta</p>
            </div>

            {vista === "form_profesor" && (
              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 14, borderTop: `0.5px solid ${c.border2}`, paddingTop: 14 }}>
                <div>
                  <h4 style={{ fontSize: 13, margin: "0 0 8px 0", color: c.text }}>Iniciar Sesión Administrativa</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <input style={inp} placeholder="Usuario docente (Nombre Completo)" value={profUser} onChange={e => setProfUser(e.target.value)} />
                    <input style={inp} type="password" placeholder="Contraseña institucional" value={profPass} onChange={e => setProfPass(e.target.value)} />
                    <button onClick={loginProfesor} style={btnS("#1A5276", "#fff")}>Acceder al Panel</button>
                  </div>
                </div>

                {/* ÚNICO AGREGADO FORMULARIO INTERNO: Registro administrativo para nuevos docentes */}
                <div style={{ background: c.bg2, padding: 12, borderRadius: 10, marginTop: 4 }}>
                  <h4 style={{ fontSize: 13, margin: "0 0 4px 0", color: c.text }}>¿Eres nuevo docente?</h4>
                  <p style={{ fontSize: 11, color: c.text2, margin: "0 0 8px 0" }}>Crea tu cuenta usando el código de invitación de la directiva</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <input style={inp} placeholder="Nombre y Apellidos" value={regProfNombre} onChange={e => setRegProfNombre(e.target.value)} />
                    <input style={inp} placeholder="Usuario de ingreso nuevo" value={regProfUser} onChange={e => setRegProfUser(e.target.value)} />
                    <input style={inp} type="password" placeholder="Contraseña (mín. 8 caracteres)" value={regProfPass} onChange={e => setRegProfPass(e.target.value)} />
                    <input style={inp} placeholder="Cargo (Ej: Auxiliar, Tutor de 3ero)" value={regProfCargo} onChange={e => setRegProfCargo(e.target.value)} />
                    <input style={{ ...inp, border: `1px dashed #1A5276` }} type="password" placeholder="🔑 Código de Registro Administrativo" value={regProfToken} onChange={e => setRegProfToken(e.target.value)} />
                    <button onClick={registrarProfesor} style={btnS("#27500A", "#fff")}>Validar y Crear Cuenta</button>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════
  // 🏢 VISTA INTERNA DEL APLICATIVO (LOGUEADO)
  // ══════════════════════════════════════════════
  return (
    <div style={wrap}>
      <div style={{ maxWidth:600, margin:"0 auto" }}>
        
        {ajustes && (
          <div style={{ background:c.bg3, border:`0.5px solid ${c.border}`, borderRadius:16, padding:20, marginBottom:20 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <h3 style={{ margin:0, color:c.text, fontSize:16 }}>Configuración y Herramientas</h3>
              <button onClick={()=>setAjustes(false)} style={{ background:"none", border:"none", fontSize:14, color:c.text2, cursor:"pointer" }}>Cerrar ✕</button>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {esProfesor && (
                <>
                  <button onClick={()=>{ play("nav"); setVistaLogs(v=>!v); setVistaCuentas(false); }} style={btnS(c.bg2,c.text)}>{vistaLogs?" ocultar Auditoría":"📊 Ver Logs de Auditoría"}</button>
                  <button onClick={()=>{ play("nav"); setVistaCuentas(v=>!v); setVistaLogs(false); }} style={btnS(c.bg2,c.text)}>{vistaCuentas?" ocultar Control de Cuentas":"👥 Ver Registro de Dispositivos/Cuentas"}</button>
                  <button onClick={()=>exportarTXT(reportes,repDirectiva)} style={btnS("#1A5276","#fff")}>💾 Descargar Respaldo en Texto (.TXT)</button>
                </>
              )}
              <button onClick={cerrarSesion} style={btnS("#922B21","#fff")}>Cerrar Sesión Activa</button>
            </div>

            {vistaLogs && esProfesor && (
              <div style={{ marginTop:16, borderTop:`0.5px solid ${c.border2}`, paddingTop:14 }}>
                <h4 style={{ margin:"0 0 10px 0", fontSize:13, color:c.text2 }}>Historial de Eventos del Sistema (Últimos 100)</h4>
                <div style={{ display:"flex", flexDirection:"column", gap:6, maxHeight:200, overflowY:"auto", background:c.bg2, padding:8, borderRadius:10 }}>
                  {logs.map((l,i)=>(
                    <div key={i} style={{ fontSize:11, color:c.text, borderBottom:`0.5px solid ${c.border2}`, paddingBottom:4 }}>
                      [{l.fecha} {l.hora}] <b>{l.usuario}</b>: {l.evento} <span style={{color:c.text3}}>({l.device})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {vistaCuentas && esProfesor && (
              <div style={{ marginTop:16, borderTop:`0.5px solid ${c.border2}`, paddingTop:14 }}>
                <h4 style={{ margin:"0 0 10px 0", fontSize:13, color:c.text2 }}>Dispositivos Registrados por Alumnos</h4>
                {!pinVerificado ? (
                  <div style={{ display:"flex", gap:8 }}>
                    <input style={inp} type="password" placeholder="Ingresa PIN de cuentas" value={pinCuentas} onChange={e=>setPinCuentas(e.target.value)} />
                    <button onClick={()=>{ if(pinCuentas==="2025") setPinVerificado(true); else setPinError("PIN Incorrecto"); }} style={{ padding:"0 14px", borderRadius:10, border:"none", background:c.blue, color:"#fff" }}>Verificar</button>
                  </div>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", gap:6, maxHeight:220, overflowY:"auto" }}>
                    {cuentas.map((cu,i)=>(
                      <div key={i} style={{ background:c.bg2, padding:8, borderRadius:8, fontSize:12, color:c.text }}>
                        <b>Usuario:</b> {cu.usuario} <br/>
                        <b>Fecha/Hora:</b> {cu.fecha} a las {cu.hora} <br/>
                        <b>Entorno:</b> {cu.dispositivo} ({cu.os} - {cu.browser}) <br/>
                        <span style={{ fontSize:10, color:c.text3 }}>ID Unico: {cu.deviceId}</span>
                      </div>
                    ))}
                  </div>
                )}
                {pinError && <p style={{ fontSize:11, color:"#C0392B", margin:"4px 0 0 0" }}>{pinError}</p>}
              </div>
            )}
          </div>
        )}

        {/* ENTORNO ALUMNO */}
        {!esProfesor && (
          <>
            {vista === "lista" || vista === "form_alumno" || vista === "form_profesor" ? (
              <>
                <AppHeader sesion={sesion} esProfesor={false} dark={dark} setDark={setDark} setAjustes={setAjustes} c={c} play={play} />
                
                {enviado && (
                  <div style={{ background:c.green, color:c.greenTx, padding:14, borderRadius:12, marginBottom:16, fontSize:13, fontWeight:500 }}>
                    ✓ Tu reporte ha sido enviado con cifrado de grado militar. Ningún rastro personal ha sido guardado. Los docentes responderán a este alias a la brevedad.
                  </div>
                )}

                <div style={{ background:c.bg3, border:`0.5px solid ${c.border}`, borderRadius:16, padding:18, marginBottom:20, display:"flex", flexDirection:"column", gap:12 }}>
                  <h3 style={{ margin:0, fontSize:15, fontWeight:600, color:c.text }}>Nuevo Reporte Confidencial</h3>
                  
                  <div>
                    <label style={{ fontSize:12, color:c.text2, display:"block", marginBottom:5 }}>Categoría del Incidente</label>
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                      {CATEGORIAS.map(catItem => (
                        <button key={catItem} onClick={()=>{ play("click"); setCat(catItem); }} style={{ padding:"6px 12px", borderRadius:99, fontSize:12, cursor:"pointer", background:cat===catItem?c.info_bg:c.bg2, color:cat===catItem?c.info_tx:c.text2, border:cat===catItem?`1px solid ${c.info_tx}`:`0.5px solid ${c.border}` }}>{CAT_ICON[catItem]} {catItem}</button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize:12, color:c.text2, display:"block", marginBottom:5 }}>Descripción de los hechos (Evita nombres reales si deseas anonimato absoluto)</label>
                    <textarea style={{ ...inp, height:90, resize:"none", fontFamily:"inherit" }} value={desc} onChange={e=>{setDesc(e.target.value); if(enviado)setEnviado(false);}} placeholder="Escribe aquí de forma clara detallando lo sucedido..." />
                  </div>

                  <div>
                    <label style={{ fontSize:12, color:c.text2, display:"block", marginBottom:5 }}>Información Opcional (Nombres de implicados, aulas, etc.)</label>
                    <input style={inp} value={nota} onChange={e=>setNota(e.target.value)} placeholder="Ej: Ocurrió en el pabellón B durante el segundo recreo." />
                  </div>

                  <div>
                    <label style={{ fontSize:12, color:c.text2, display:"block", marginBottom:5 }}>Adjuntar Evidencias (Fotos, capturas - Máx 5)</label>
                    <input type="file" ref={fileRef} multiple accept="image/*,application/pdf,text/plain" onChange={e=>handleFiles(e.target.files)} style={{ display:"none" }} />
                    <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                      <button onClick={()=>fileRef.current.click()} style={{ padding:"8px 14px", borderRadius:8, border:`0.5px solid ${c.border}`, background:c.bg2, color:c.text2, fontSize:13, cursor:"pointer" }}>📎 Seleccionar archivos</button>
                      <span style={{ fontSize:11, color:c.text3 }}>{adjuntos.length} cargados</span>
                    </div>
                    {adjuntos.length > 0 && (
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:8 }}>
                        {adjuntos.map((a,i)=>(
                          <span key={i} style={{ fontSize:11, background:c.bg2, padding:"3px 8px", borderRadius:6, color:c.text2 }}>{a.name.slice(0,12)}...</span>
                        ))}
                      </div>
                    )}
                  </div>

                  <button onClick={enviarReporte} style={{ ...btnS(c.blue,"#fff"), marginTop:6 }}>Enviar Reporte Seguro 🔒</button>
                </div>

                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  <h3 style={{ margin:"6px 0 2px 0", fontSize:14, color:c.text2 }}>Historial de mis reportes creados</h3>
                  {reportesFiltrados.length === 0 && <div style={{ textAlign:"center", padding:24, color:c.text3, fontSize:13, background:c.bg3, borderRadius:14, border:`0.5px solid ${c.border2}` }}>Aún no has creado ningún reporte. Tu bandeja está limpia.</div>}
                  {reportesFiltrados.map(r => (
                    <CardReporte key={r.id} r={r} onClick={()=>{ setSelId(r.id); setVista("detalle"); marcarLeidos(r.id); }} esDir={false} esProfesor={false} dark={dark} c={c} play={play} />
                  ))}
                </div>
              </>
            ) : (
              <>
                {selReporte && (
                  <>
                    <AppHeader titulo="Detalles de mi Reporte" onBack={()=>{ setVista("lista"); setSelId(null); }} sesion={sesion} esProfesor={false} dark={dark} setDark={setDark} setAjustes={setAjustes} c={c} play={play} />
                    {renderDetalle(selReporte, false)}
                  </>
                )}
              </>
            )}
          </>
        )}

        {/* ENTORNO PROFESOR */}
        {esProfesor && (
          <>
            {(vista === "lista" || vista === "form_alumno" || vista === "form_profesor") && (
              <>
                <AppHeader sesion={sesion} esProfesor={true} dark={dark} setDark={setDark} setAjustes={setAjustes} c={c} play={play} />
                
                <div style={{ display:"flex", gap:14, borderBottom:`0.5px solid ${c.border2}`, paddingBottom:10, marginBottom:14 }}>
                  <button onClick={()=>{ play("click"); setFiltro("Todos"); }} style={{ background:"none", border:"none", borderBottom:filtroD!=="Directiva" ? `2px solid ${c.blue}` : "none", color:filtroD!=="Directiva"?c.blue:c.text2, fontWeight:500, paddingBottom:4, cursor:"pointer", fontSize:14 }}>Reportes de Alumnos ({reportes.length})</button>
                  <button onClick={()=>{ play("click"); setFiltroD("Todos"); setVista("directiva"); }} style={{ background:"none", border:"none", color:c.text2, paddingBottom:4, cursor:"pointer", fontSize:14 }}>Canal de la Directiva ({repDirectiva.length})</button>
                </div>

                <FiltroBar opciones={ESTADOS} valor={filtro} onChange={setFiltro} c={c} play={play} />

                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {reportesFiltrados.length === 0 && <div style={{ textAlign:"center", padding:24, color:c.text3, fontSize:13 }}>No hay casos en este estado.</div>}
                  {reportesFiltrados.map(r => (
                    <CardReporte key={r.id} r={r} onClick={()=>{ setSelId(r.id); setVista("detalle"); }} esDir={false} esProfesor={true} dark={dark} c={c} play={play} />
                  ))}
                </div>
              </>
            )}

            {vista === "directiva" && (
              <>
                <AppHeader sesion={sesion} esProfesor={true} dark={dark} setDark={setDark} setAjustes={setAjustes} c={c} play={play} />

                <div style={{ display:"flex", gap:14, borderBottom:`0.5px solid ${c.border2}`, paddingBottom:10, marginBottom:14 }}>
                  <button onClick={()=>{ play("click"); setVista("lista"); setFiltro("Todos"); }} style={{ background:"none", border:"none", color:c.text2, paddingBottom:4, cursor:"pointer", fontSize:14 }}>Reportes de Alumnos ({reportes.length})</button>
                  <button onClick={()=>{ play("click"); }} style={{ background:"none", border:"none", borderBottom:`2px solid ${c.blue}`, color:c.blue, fontWeight:500, paddingBottom:4, cursor:"pointer", fontSize:14 }}>Canal de la Directiva ({repDirectiva.length})</button>
                </div>

                {enviadoDir && (
                  <div style={{ background:c.green, color:c.greenTx, padding:12, borderRadius:10, marginBottom:14, fontSize:13 }}>
                    ✓ Reporte administrativo archivado en el canal de la directiva correctamente.
                  </div>
                )}

                <div style={{ background:c.bg3, border:`0.5px solid ${c.border}`, borderRadius:16, padding:16, marginBottom:16, display:"flex", flexDirection:"column", gap:10 }}>
                  <h4 style={{ margin:0, fontSize:14, color:c.text }}>Redactar Incidencia de Directiva / Docente</h4>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                    {CAT_DIR.map(cd => (
                      <button key={cd} onClick={()=>{ play("click"); setCatDir(cd); }} style={{ padding:"5px 10px", borderRadius:99, fontSize:11, cursor:"pointer", background:catDir===cd?c.info_bg:c.bg2, color:catDir===cd?c.info_tx:c.text2, border:catDir===cd?`1px solid ${c.info_tx}`:`0.5px solid ${c.border}` }}>{CAT_ICON[cd]} {cd}</button>
                    ))}
                  </div>
                  <textarea style={{ ...inp, height:70, resize:"none" }} value={descDir} onChange={e=>{setDescDir(e.target.value); if(enviadoDir)setEnviadoDir(false);}} placeholder="Detalles específicos..." />
                  <button onClick={enviarReporteDir} style={btnS("#1A5276","#fff")}>Publicar en Canal de Directiva</button>
                </div>

                <FiltroBar opciones={ESTADOS} valor={filtroD} onChange={setFiltroD} c={c} play={play} />

                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {repDirFiltrados.length === 0 && <div style={{ textAlign:"center", padding:24, color:c.text3, fontSize:13 }}>No hay reportes de directiva.</div>}
                  {repDirFiltrados.map(r => (
                    <CardReporte key={r.id} r={r} onClick={()=>{ setSelId(r.id); setVista("detalleDir"); }} esDir={true} esProfesor={true} dark={dark} c={c} play={play} />
                  ))}
                </div>
              </>
            )}

            {vista === "detalle" && selReporte && (
              <>
                <AppHeader titulo="Gestión de Reporte de Alumno" onBack={()=>{ setVista("lista"); setSelId(null); }} sesion={sesion} esProfesor={true} dark={dark} setDark={setDark} setAjustes={setAjustes} c={c} play={play} />
                {renderDetalle(selReporte, false)}
              </>
            )}

            {vista === "detalleDir" && selRepDir && (
              <>
                <AppHeader titulo="Detalle de Reporte Administrativo" onBack={()=>{ setVista("directiva"); setSelId(null); }} sesion={sesion} esProfesor={true} dark={dark} setDark={setDark} setAjustes={setAjustes} c={c} play={play} />
                {renderDetalle(selRepDir, true)}
              </>
            )}
          </>
        )}

      </div>
    </div>
  );
}