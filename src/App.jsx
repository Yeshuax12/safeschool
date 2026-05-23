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
const KEYS = { alumnos:"ss_alumnos_v2", reportes:"ss_reportes_v2", directiva:"ss_directiva_v2", sesion:"ss_sesion_v2", logs:"ss_logs_v2", nextId:"ss_nextid_v2", nextAlumnoId:"ss_nextaid_v2", cuentas:"ss_cuentas_v2" };

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

// ── Log de accesos ──
async function registrarAcceso(evento, usuario) {
  try {
    const logs = (await cargar(KEYS.logs)) || [];
    logs.unshift({
      evento, usuario,
      fecha: new Date().toLocaleDateString("es-PE"),
      hora:  new Date().toLocaleTimeString("es-PE", { hour:"2-digit", minute:"2-digit", second:"2-digit" }),
      device: navigator.userAgent.includes("Mobile") ? "📱 Móvil" : "💻 Escritorio",
    });
    await guardar(KEYS.logs, logs.slice(0, 100)); // máx 100 registros
  } catch {}
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
// 📋 DATOS
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

// Profesor con contraseña en hash (se calcula al primer login)
const PROFESORES_HASH = [
  { usuario:"Jesús Adrian Mondragón Chú", passHash:null, passPlain:"K@rtdsPomele37", nombre:"Jesús Adrián Mondragón Chú-Alcalde", cargo:"Director / Alcalde" },
];
const NOMBRES_RESERVADOS = PROFESORES_HASH.map(p => p.usuario.toLowerCase());

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

  // ── Estado inicial cargado desde localStorage cifrado ──
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
  const [vistaLogs,     setVistaLogs]     = useState(false);
  const [cuentas,       setCuentas]       = useState([]);
  const [vistaCuentas,  setVistaCuentas]  = useState(false);
  const [pinCuentas,    setPinCuentas]    = useState("");
  const [pinError,      setPinError]      = useState("");
  const [pinVerificado, setPinVerificado] = useState(false);

  // ── Cargar todo al inicio ──
  useEffect(() => {
    (async () => {
      const [s, a, r, d, l, nid, naid, cu] = await Promise.all([
        cargar(KEYS.sesion), cargar(KEYS.alumnos), cargar(KEYS.reportes),
        cargar(KEYS.directiva), cargar(KEYS.logs), cargar(KEYS.nextId), cargar(KEYS.nextAlumnoId), cargar(KEYS.cuentas),
      ]);
      if (a) setAlumnosBD(a);
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

  // ── Persistir datos cada vez que cambian ──
  useEffect(() => { if (appReady) guardar(KEYS.alumnos,    alumnosBD);    }, [alumnosBD,    appReady]);
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

  // ── Helpers internos ──
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
    // Setting sesion=null triggers the guard which renders inicio screen immediately
    // Reset everything in one go
    setVista("lista"); setSelId(null); setAjustes(false);
    setVistaLogs(false); setVistaCuentas(false); setConfirmDel(null);
    setErrMsg(""); setErrProf(""); setLoginUser(""); setLoginPass("");
    setProfUser(""); setProfPass(""); setEnviado(false); setEnviadoDir(false);
    setChatMsg(""); setNotaInt(""); setPinCuentas(""); setPinVerificado(false); setPinError("");
    setPantalla("inicio");
    setSesion(null); // This LAST - triggers guard to show inicio
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

  async function loginAlumno() {
    const passHash = await sha256(loginPass.trim());
    const alumno = alumnosBD.find(a => a.usuario.toLowerCase()===loginUser.trim().toLowerCase() && a.passHash===passHash);
    if (!alumno) { play("error"); setErrMsg("Usuario o contraseña incorrectos."); addLog("Login fallido (alumno)", loginUser.trim()); return; }
    await login({ tipo:"alumno", usuario:alumno.usuario, id:alumno.id });
    setLoginUser(""); setLoginPass(""); setErrMsg("");
  }

  async function loginProfesor() {
    const prof = PROFESORES_HASH.find(p => p.usuario===profUser.trim());
    if (!prof) { play("error"); setErrProf("Usuario o contraseña incorrectos."); addLog("Login fallido (profesor)", profUser.trim()); return; }
    const passHash = await sha256(profPass.trim());
    const hashEsperado = await sha256(prof.passPlain);
    if (passHash !== hashEsperado) { play("error"); setErrProf("Usuario o contraseña incorrectos."); addLog("Login fallido (profesor)", profUser.trim()); return; }
    await login({ tipo:"profesor", nombre:prof.nombre, cargo:prof.cargo });
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

  // ══════════════════════════════════════════
  // 🖼️ RENDERS
  // ══════════════════════════════════════════
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
            {(r.notas_internas||[]).map((n,i) => <div key={i} style={{ background:c.bg2, borderRadius:10, padding:"10px 14px", fontSize:13, marginBottom:8 }}><span style={{ color:c.text }}>{n.texto}</span><span style={{ color:c.text3, fontSize:11, display:"block", marginTop:4 }}>{n.fecha}</span></div>)}
            <div style={{ display:"flex", gap:8 }}>
              <input style={{ ...inp, flex:1 }} value={notaInt} onChange={e=>setNotaInt(e.target.value)} placeholder="Agregar nota interna..." onKeyDown={e=>e.key==="Enter"&&agregarNota(r.id,esDir)} />
              <button onClick={()=>agregarNota(r.id,esDir)} style={{ padding:"0 16px", borderRadius:10, border:`0.5px solid ${c.border}`, background:c.bg2, cursor:"pointer", fontSize:13, color:c.text }}>+</button>
            </div>
          </div>
        )}

        <div>
          <label style={{ fontSize:13, color:c.text2, display:"block", marginBottom:8 }}>🕓 Historial de cambios</label>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {r.historial.map((h,i) => (
              <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:c.blue, marginTop:5, flexShrink:0 }} />
                <div><div style={{ fontSize:13, color:c.text }}>{h.accion}</div><div style={{ fontSize:11, color:c.text3 }}>{h.fecha} · {h.hora}</div></div>
              </div>
            ))}
          </div>
        </div>

        {(esDir
          ? (esProfesor && r.autor===sesion?.nombre)
          : (!esProfesor && r.alumnoId===sesion?.id)
        ) && (
          <button onClick={()=>{ play("click"); setConfirmDel({ id:r.id, esDir }); }} style={{ padding:"10px", borderRadius:10, border:`0.5px solid #C0392B`, background:"transparent", color:"#C0392B", fontSize:13, fontWeight:500, cursor:"pointer", width:"100%", marginTop:4 }}>🗑️ Eliminar este reporte</button>
        )}
      </div>
    );
  }

  function renderConfirmDel() {
    if (!confirmDel) return null;
    return (
      <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 24px" }}>
        <div style={{ background:c.bg3, borderRadius:16, padding:"28px 24px", width:"100%", maxWidth:360, textAlign:"center" }}>
          <div style={{ fontSize:32, marginBottom:12 }}>🗑️</div>
          <div style={{ fontWeight:600, fontSize:16, color:c.text, marginBottom:8 }}>¿Eliminar reporte?</div>
          <div style={{ fontSize:13, color:c.text2, marginBottom:24 }}>Esta acción no se puede deshacer.</div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={()=>{ play("back"); setConfirmDel(null); }} style={{ flex:1, padding:"11px", borderRadius:10, border:`0.5px solid ${c.border}`, background:c.bg2, color:c.text, fontSize:14, cursor:"pointer" }}>Cancelar</button>
            <button onClick={()=>eliminarReporte(confirmDel.id, confirmDel.esDir)} style={{ flex:1, padding:"11px", borderRadius:10, border:"none", background:"#C0392B", color:"#fff", fontSize:14, fontWeight:600, cursor:"pointer" }}>Eliminar</button>
          </div>
        </div>
      </div>
    );
  }

  function renderLogs() {
    return (
      <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:200, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
        <div style={{ background:c.bg3, borderRadius:"16px 16px 0 0", padding:"24px 20px 36px", width:"100%", maxWidth:460, maxHeight:"80vh", display:"flex", flexDirection:"column" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <div style={{ fontWeight:600, fontSize:16, color:c.text }}>🛡️ Registro de accesos</div>
            <button onClick={()=>setVistaLogs(false)} style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:c.text2 }}>✕</button>
          </div>
          <div style={{ overflowY:"auto", flex:1, display:"flex", flexDirection:"column", gap:8 }}>
            {logs.length===0
              ? <div style={{ textAlign:"center", color:c.text2, fontSize:13, padding:24 }}>Sin registros aún</div>
              : logs.map((l,i) => (
                <div key={i} style={{ background:c.bg2, borderRadius:10, padding:"10px 14px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:3 }}>
                    <span style={{ fontSize:13, fontWeight:500, color:c.text }}>{l.evento}</span>
                    <span style={{ fontSize:11, color:c.text3 }}>{l.device}</span>
                  </div>
                  <div style={{ fontSize:12, color:c.text2 }}>👤 {l.usuario}</div>
                  <div style={{ fontSize:11, color:c.text3, marginTop:2 }}>{l.fecha} · {l.hora}</div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    );
  }

  function renderCuentas() {
    // Solo el director puede ver esto, protegido con PIN
    const PIN_CORRECTO = "1437"; // PIN secreto solo del director
    if (!pinVerificado) {
      return (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.65)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 24px" }}>
          <div style={{ background:c.bg3, borderRadius:16, padding:"28px 24px", width:"100%", maxWidth:340, textAlign:"center" }}>
            <div style={{ fontSize:32, marginBottom:10 }}>🔑</div>
            <div style={{ fontWeight:600, fontSize:16, color:c.text, marginBottom:6 }}>Acceso restringido</div>
            <div style={{ fontSize:13, color:c.text2, marginBottom:20 }}>Ingresa el PIN del director para ver el registro de cuentas</div>
            <input
              type="password" maxLength={6}
              value={pinCuentas} onChange={e=>{ setPinCuentas(e.target.value); setPinError(""); }}
              onKeyDown={e=>{ if(e.key==="Enter"){ if(pinCuentas===PIN_CORRECTO){ play("nav"); setPinVerificado(true); setPinError(""); } else { play("error"); setPinError("PIN incorrecto."); } } }}
              placeholder="PIN secreto" style={{ ...inp, textAlign:"center", fontSize:20, letterSpacing:8, marginBottom:8 }}
            />
            {pinError && <div style={{ fontSize:12, color:"#C0392B", marginBottom:8 }}>{pinError}</div>}
            <div style={{ display:"flex", gap:10, marginTop:8 }}>
              <button onClick={()=>{ play("back"); setVistaCuentas(false); setPinCuentas(""); setPinError(""); }} style={{ flex:1, padding:"11px", borderRadius:10, border:`0.5px solid ${c.border}`, background:c.bg2, color:c.text, fontSize:14, cursor:"pointer" }}>Cancelar</button>
              <button onClick={()=>{ if(pinCuentas===PIN_CORRECTO){ play("nav"); setPinVerificado(true); setPinError(""); } else { play("error"); setPinError("PIN incorrecto."); } }} style={{ flex:1, padding:"11px", borderRadius:10, border:"none", background:c.blue, color:"#fff", fontSize:14, fontWeight:600, cursor:"pointer" }}>Entrar</button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.65)", zIndex:300, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
        <div style={{ background:c.bg3, borderRadius:"16px 16px 0 0", padding:"24px 20px 36px", width:"100%", maxWidth:480, maxHeight:"85vh", display:"flex", flexDirection:"column" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
            <div style={{ fontWeight:600, fontSize:16, color:c.text }}>👥 Registro de cuentas</div>
            <button onClick={()=>{ play("back"); setVistaCuentas(false); setPinCuentas(""); setPinVerificado(false); }} style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:c.text2 }}>✕</button>
          </div>
          <div style={{ fontSize:12, color:c.info_tx, background:c.info_bg, borderRadius:8, padding:"5px 12px", marginBottom:14 }}>🔒 Visible solo para ti · {cuentas.length} cuenta{cuentas.length!==1?"s":""} registrada{cuentas.length!==1?"s":""}</div>
          <div style={{ overflowY:"auto", flex:1, display:"flex", flexDirection:"column", gap:10 }}>
            {cuentas.length===0
              ? <div style={{ textAlign:"center", color:c.text2, fontSize:13, padding:32 }}>Ningún alumno se ha registrado aún</div>
              : cuentas.map((cu, i) => (
                <div key={i} style={{ background:c.bg2, borderRadius:12, padding:"12px 14px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                    <span style={{ fontSize:14, fontWeight:600, color:c.text }}>👤 {cu.usuario}</span>
                    <span style={{ fontSize:11, color:c.text3 }}>#{i+1}</span>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
                    <div style={{ fontSize:12, color:c.text2 }}>📅 {cu.fecha} · {cu.hora}</div>
                    <div style={{ fontSize:12, color:c.text2 }}>{cu.dispositivo} · {cu.os} · {cu.browser}</div>
                    <div style={{ fontSize:11, color:c.text3, fontFamily:"monospace", marginTop:2, wordBreak:"break-all" }}>🔑 ID: {cu.deviceId}</div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    );
  }

  function renderAjustes() {
    return (
      <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:100, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
        <div style={{ background:c.bg3, borderRadius:"16px 16px 0 0", padding:"28px 24px 36px", width:"100%", maxWidth:420 }}>
          <div style={{ fontWeight:500, fontSize:17, color:c.text, marginBottom:4 }}>⚙️ Ajustes</div>
          <div style={{ fontSize:12, color:c.info_tx, background:c.info_bg, borderRadius:8, padding:"6px 12px", marginBottom:16 }}>🔐 Sesión cifrada · Datos protegidos con AES-GCM</div>
          <div style={{ fontSize:13, color:c.text2, marginBottom:20 }}>{esProfesor?`${sesion?.nombre} · ${sesion?.cargo}`:`Usuario: ${sesion?.usuario}`}</div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:c.bg2, borderRadius:10, padding:"12px 16px", marginBottom:12 }}>
            <span style={{ fontSize:14, color:c.text }}>{dark?"🌙 Modo oscuro":"☀️ Modo claro"}</span>
            <div onClick={()=>{ play("darkmode"); setDark(d=>!d); }} style={{ width:44, height:24, borderRadius:99, background:dark?c.blue:c.border, cursor:"pointer", position:"relative" }}>
              <div style={{ position:"absolute", top:3, left:dark?22:3, width:18, height:18, borderRadius:"50%", background:"#fff", transition:"left 0.2s" }} />
            </div>
          </div>
          {esProfesor && <>
            <button onClick={()=>{ play("click"); setVistaLogs(true); setAjustes(false); }} style={{ ...btnS(c.bg2,c.text), border:`0.5px solid ${c.border}`, marginBottom:10, borderRadius:10 }}>🛡️ Ver registro de accesos</button>
            <button onClick={()=>{ play("click"); setVistaCuentas(true); setAjustes(false); }} style={{ ...btnS(c.bg2,c.text), border:`0.5px solid ${c.border}`, marginBottom:10, borderRadius:10 }}>👥 Ver registro de cuentas</button>
            <button onClick={()=>{ play("click"); exportarTXT(reportes,repDirectiva); }} style={{ ...btnS(c.bg2,c.text), border:`0.5px solid ${c.border}`, marginBottom:10, borderRadius:10 }}>📄 Exportar todos los reportes</button>
          </>}
          <button onClick={cerrarSesion} style={{ ...btnS("#C0392B","#fff"), borderRadius:10 }}>Cerrar sesión</button>
          <button onClick={()=>{ play("back"); setAjustes(false); }} style={{ ...btnS(c.bg2,c.text), marginTop:10, borderRadius:10 }}>Cancelar</button>
        </div>
      </div>
    );
  }

  // ── Pantalla de carga ──
  if (!appReady) return (
    <div style={{ minHeight:"100vh", background:c.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16 }}>
      <div style={{ fontSize:32 }}>🔐</div>
      <div style={{ fontSize:14, color:c.text2 }}>Cargando datos cifrados…</div>
    </div>
  );

  // ── Estadísticas ──
  if (pantalla === "app" && vista==="estadisticas") {
    const total = reportes.length;
    const porEstado = ESTADOS.map(e => ({ e, n:reportes.filter(r=>r.estado===e).length }));
    const porCat = CATEGORIAS.map(cat => ({ cat, n:reportes.filter(r=>r.categoria===cat).length }));
    const pct = total>0?Math.round((reportes.filter(r=>r.estado==="Resuelto").length/total)*100):0;
    return (
      <div style={wrap}>
        {ajustes&&renderAjustes()}{renderConfirmDel()}{vistaLogs&&renderLogs()}{vistaCuentas&&renderCuentas()}
        <AppHeader titulo="📊 Estadísticas" onBack={()=>setVista("lista")} sesion={sesion} esProfesor={esProfesor} dark={dark} setDark={setDark} setAjustes={setAjustes} c={c} play={play} />
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {[{label:"Total reportes",val:total,color:c.blue},{label:"Resueltos",val:`${pct}%`,color:"#639922"},{label:"En espera",val:porEstado[0].n,color:"#EF9F27"},{label:"Leídos",val:porEstado[1].n,color:"#378ADD"}].map((s,i)=>(
              <div key={i} style={{ background:c.bg3, border:`0.5px solid ${c.border2}`, borderRadius:14, padding:16, textAlign:"center" }}>
                <div style={{ fontSize:28, fontWeight:700, color:s.color }}>{s.val}</div>
                <div style={{ fontSize:12, color:c.text2, marginTop:4 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ background:c.bg3, border:`0.5px solid ${c.border2}`, borderRadius:14, padding:16 }}>
            <div style={{ fontSize:13, fontWeight:500, color:c.text, marginBottom:12 }}>Por categoría</div>
            {porCat.map(({cat,n})=>(
              <div key={cat} style={{ marginBottom:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:c.text2, marginBottom:4 }}><span>{CAT_ICON[cat]} {cat}</span><span style={{ color:c.text, fontWeight:500 }}>{n}</span></div>
                <div style={{ height:6, background:c.bg2, borderRadius:99 }}><div style={{ height:"100%", width:`${total>0?(n/total)*100:0}%`, background:c.blue, borderRadius:99 }} /></div>
              </div>
            ))}
          </div>
          <div style={{ background:c.bg3, border:`0.5px solid ${c.border2}`, borderRadius:14, padding:16 }}>
            <div style={{ fontSize:13, fontWeight:500, color:c.text, marginBottom:12 }}>Por estado</div>
            {porEstado.map(({e,n})=>(
              <div key={e} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                <Badge estado={e} dark={dark} /><span style={{ fontSize:15, fontWeight:600, color:c.text }}>{n}</span>
              </div>
            ))}
          </div>
          <button onClick={()=>{ play("click"); exportarTXT(reportes,repDirectiva); }} style={{ ...btnS(c.bg2,c.text), border:`0.5px solid ${c.border}`, borderRadius:10 }}>📄 Exportar reporte completo</button>
        </div>
      </div>
    );
  }

  // ── AUTH ──
  const errBox = (msg) => msg ? <div style={{ fontSize:13, color:"#C0392B", background:dark?"#2a0a0a":"#FDEDEC", borderRadius:8, padding:"8px 12px" }}>{msg}</div> : null;
  const backTheme = (back) => (
    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:24 }}>
      <button onClick={()=>{ play("back"); back(); }} style={{ background:"none", border:`0.5px solid ${c.border}`, borderRadius:8, padding:"4px 12px", fontSize:13, cursor:"pointer", color:c.text2 }}>← Volver</button>
      <button onClick={()=>{ play("darkmode"); setDark(d=>!d); }} style={{ background:c.bg2, border:`0.5px solid ${c.border}`, borderRadius:10, width:38, height:38, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:17 }}>{dark?"☀️":"🌙"}</button>
    </div>
  );

  if (pantalla==="inicio") return (
    <div style={{ minHeight:"100vh", background:c.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"2rem 1rem" }}>
      <div style={{ position:"absolute", top:16, right:16 }}>
        <button onClick={()=>{ play("darkmode"); setDark(d=>!d); }} style={{ background:c.bg2, border:`0.5px solid ${c.border}`, borderRadius:10, width:38, height:38, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:17 }}>{dark?"☀️":"🌙"}</button>
      </div>
      <div style={{ fontSize:11, letterSpacing:3, color:c.text3, marginBottom:8, textTransform:"uppercase" }}>Bienvenido a</div>
      <div style={{ fontSize:32, fontWeight:700, color:c.text, marginBottom:4 }}>SafeSchool</div>
      <div style={{ fontSize:13, color:c.text2, marginBottom:8, textAlign:"center" }}>Plataforma segura y confidencial de reportes</div>
      <div style={{ fontSize:11, color:c.info_tx, background:c.info_bg, borderRadius:8, padding:"5px 14px", marginBottom:36 }}>🔐 Datos cifrados con AES-GCM · Contraseñas con SHA-256</div>
      <div style={{ display:"flex", flexDirection:"column", gap:12, width:"100%", maxWidth:320 }}>
        {[{id:"loginAlumno",label:"Soy alumno",sub:"Inicia sesión o crea tu cuenta"},{id:"loginProf",label:"Soy profesor / admin",sub:"Accede con tus credenciales"}].map(op=>(
          <button key={op.id} onClick={()=>{ play("nav"); setPantalla(op.id); setErrMsg(""); setErrProf(""); }} style={{ background:c.bg3, border:`0.5px solid ${c.border}`, borderRadius:12, padding:"16px 20px", textAlign:"left", cursor:"pointer" }}>
            <div style={{ fontWeight:500, fontSize:15, color:c.text }}>{op.label}</div>
            <div style={{ fontSize:13, color:c.text2 }}>{op.sub}</div>
          </button>
        ))}
      </div>
    </div>
  );

  if (pantalla==="loginAlumno") return (
    <div style={authWrap}>
      {backTheme(()=>{ setPantalla("inicio"); setErrMsg(""); })}
      <div style={{ fontWeight:500, fontSize:20, color:c.text, marginBottom:4 }}>Iniciar sesión</div>
      <div style={{ fontSize:13, color:c.text2, marginBottom:24 }}>Ingresa con tu cuenta de alumno</div>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        <input style={inp} placeholder="Usuario (tu nombre y apellidos)" value={loginUser} onChange={e=>setLoginUser(e.target.value)} />
        <input style={inp} placeholder="Contraseña" type="password" value={loginPass} onChange={e=>setLoginPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&loginAlumno()} />
        {errBox(errMsg)}
        <button style={btnS(c.blue,"#fff")} onClick={()=>{ play("click"); loginAlumno(); }}>Iniciar sesión</button>
        <div style={{ textAlign:"center", fontSize:13, color:c.text2 }}>¿No tienes cuenta? <span onClick={()=>{ play("nav"); setPantalla("regAlumno"); setErrMsg(""); }} style={{ color:c.blue, cursor:"pointer", fontWeight:500 }}>Regístrate</span></div>
      </div>
    </div>
  );

  if (pantalla==="regAlumno") return (
    <div style={authWrap}>
      {backTheme(()=>{ setPantalla("loginAlumno"); setErrMsg(""); })}
      <div style={{ fontWeight:500, fontSize:20, color:c.text, marginBottom:4 }}>Crear cuenta</div>
      <div style={{ fontSize:13, color:c.text2, marginBottom:24 }}>Tu usuario debe ser tu nombre y apellidos reales</div>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        <input style={inp} placeholder="Ej: Juan Pérez García" value={nuevoUser} onChange={e=>setNuevoUser(e.target.value)} />
        <input style={inp} placeholder="Contraseña (mín. 6 caracteres)" type="password" value={nuevaPass} onChange={e=>setNuevaPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&registrarAlumno()} />
        <div style={{ fontSize:12, color:c.info_tx, background:c.info_bg, borderRadius:8, padding:"8px 12px" }}>🔒 Tu contraseña se guarda como hash SHA-256. Nadie puede verla.</div>
        {errBox(errMsg)}
        <button style={btnS(c.blue,"#fff")} onClick={()=>{ play("click"); registrarAlumno(); }}>Crear cuenta</button>
      </div>
    </div>
  );

  if (pantalla==="loginProf") return (
    <div style={authWrap}>
      {backTheme(()=>{ setPantalla("inicio"); setErrProf(""); })}
      <div style={{ fontWeight:500, fontSize:20, color:c.text, marginBottom:4 }}>Acceso profesores</div>
      <div style={{ fontSize:13, color:c.text2, marginBottom:24 }}>Ingresa con tus credenciales institucionales</div>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        <input style={inp} placeholder="Usuario" value={profUser} onChange={e=>setProfUser(e.target.value)} />
        <input style={inp} placeholder="Contraseña" type="password" value={profPass} onChange={e=>setProfPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&loginProfesor()} />
        {errBox(errProf)}
        <button style={btnS(c.blue,"#fff")} onClick={()=>{ play("click"); loginProfesor(); }}>Iniciar sesión</button>
      </div>
    </div>
  );

  // ── Guard: si no hay sesión, mostrar inicio inmediatamente ──
  if (!sesion) {
    return (
      <div style={{ minHeight:"100vh", background:c.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"2rem 1rem" }}>
        <div style={{ position:"absolute", top:16, right:16 }}>
          <button onClick={()=>{ play("darkmode"); setDark(d=>!d); }} style={{ background:c.bg2, border:`0.5px solid ${c.border}`, borderRadius:10, width:38, height:38, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:17 }}>{dark?"☀️":"🌙"}</button>
        </div>
        <div style={{ fontSize:11, letterSpacing:3, color:c.text3, marginBottom:8, textTransform:"uppercase" }}>Bienvenido a</div>
        <div style={{ fontSize:32, fontWeight:700, color:c.text, marginBottom:4 }}>SafeSchool</div>
        <div style={{ fontSize:13, color:c.text2, marginBottom:8, textAlign:"center" }}>Plataforma segura y confidencial de reportes</div>
        <div style={{ fontSize:11, color:c.info_tx, background:c.info_bg, borderRadius:8, padding:"5px 14px", marginBottom:36 }}>🔐 Datos cifrados con AES-GCM · Contraseñas con SHA-256</div>
        <div style={{ display:"flex", flexDirection:"column", gap:12, width:"100%", maxWidth:320 }}>
          {[{id:"loginAlumno",label:"Soy alumno",sub:"Inicia sesión o crea tu cuenta"},{id:"loginProf",label:"Soy profesor / admin",sub:"Accede con tus credenciales"}].map(op=>(
            <button key={op.id} onClick={()=>{ play("nav"); setPantalla(op.id); setErrMsg(""); setErrProf(""); }} style={{ background:c.bg3, border:`0.5px solid ${c.border}`, borderRadius:12, padding:"16px 20px", textAlign:"left", cursor:"pointer" }}>
              <div style={{ fontWeight:500, fontSize:15, color:c.text }}>{op.label}</div>
              <div style={{ fontSize:13, color:c.text2 }}>{op.sub}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const hProps = { sesion, esProfesor, dark, setDark, setAjustes, c, play };

  if (pantalla==="app" && vista==="detalle" && selReporte) return (
    <div style={wrap}>{ajustes&&renderAjustes()}{renderConfirmDel()}{vistaLogs&&renderLogs()}{vistaCuentas&&renderCuentas()}
      <AppHeader titulo="Detalle del caso" onBack={()=>{ setVista("lista"); setSelId(null); marcarLeidos(selReporte.id); }} {...hProps} />
      {renderDetalle(selReporte)}
    </div>
  );

  if (pantalla==="app" && vista==="detalleDir" && selRepDir) return (
    <div style={wrap}>{ajustes&&renderAjustes()}{renderConfirmDel()}{vistaLogs&&renderLogs()}{vistaCuentas&&renderCuentas()}
      <AppHeader titulo="Reporte de directiva" onBack={()=>{ setVista("directiva"); setSelId(null); }} {...hProps} />
      {renderDetalle(selRepDir, true)}
    </div>
  );

  if (pantalla==="app" && vista==="nuevo") {
    if (enviado) return (
      <div style={wrap}>{ajustes&&renderAjustes()}{renderConfirmDel()}
        <div style={{ background:c.green, borderRadius:14, padding:"28px 20px", textAlign:"center" }}>
          <div style={{ fontSize:36, marginBottom:12 }}>✓</div>
          <div style={{ fontWeight:500, fontSize:17, color:c.greenTx, marginBottom:6 }}>¡Reporte enviado!</div>
          <div style={{ fontSize:13, color:c.greenTx }}>Tu caso fue registrado y cifrado correctamente.</div>
          <button onClick={()=>{ play("nav"); setEnviado(false); setVista("lista"); }} style={{ marginTop:20, background:c.bg3, border:`0.5px solid ${c.border}`, borderRadius:10, padding:"8px 22px", fontSize:14, cursor:"pointer", color:c.text }}>Ver mis reportes</button>
        </div>
      </div>
    );
    return (
      <div style={wrap}>{ajustes&&renderAjustes()}{renderConfirmDel()}
        <AppHeader titulo="Nuevo reporte" onBack={()=>{ play("back"); setVista("lista"); }} {...hProps} />
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div><label style={{ fontSize:13, color:c.text2, display:"block", marginBottom:6 }}>Categoría</label><select value={cat} onChange={e=>{ play("toggle"); setCat(e.target.value); }} style={inp}>{CATEGORIAS.map(x=><option key={x}>{x}</option>)}</select></div>
          <div><label style={{ fontSize:13, color:c.text2, display:"block", marginBottom:6 }}>Descripción</label><textarea value={desc} onChange={e=>setDesc(e.target.value)} rows={4} placeholder="Describe lo que ocurrió..." style={{ ...inp, resize:"vertical", fontFamily:"inherit" }} /></div>
          <div><label style={{ fontSize:13, color:c.text2, display:"block", marginBottom:6 }}>Nota adicional <span style={{ color:c.text3 }}>(opcional)</span></label><input style={inp} value={nota} onChange={e=>setNota(e.target.value)} placeholder="Información extra..." /></div>
          <div>
            <label style={{ fontSize:13, color:c.text2, display:"block", marginBottom:6 }}>Archivos adjuntos <span style={{ color:c.text3 }}>(máx. 5)</span></label>
            <input ref={fileRef} type="file" multiple accept="image/*,.pdf,.doc,.docx" style={{ display:"none" }} onChange={e=>handleFiles(e.target.files)} />
            <button onClick={()=>{ play("click"); fileRef.current.click(); }} style={{ ...btnS(c.bg2,c.text), border:`0.5px dashed ${c.border}`, marginBottom:8 }}>📎 Adjuntar fotos o archivos</button>
            {adjuntos.length>0 && <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>{adjuntos.map((a,i)=>(
              <div key={i} style={{ position:"relative" }}>
                {a.type?.startsWith("image/")?<img src={a.dataUrl} alt={a.name} style={{ width:70, height:70, objectFit:"cover", borderRadius:8 }} />:<div style={{ width:70, height:70, background:c.bg2, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:c.text2, textAlign:"center", padding:4 }}>📄<br/>{a.name.slice(0,10)}</div>}
                <button onClick={()=>{ play("click"); setAdjuntos(prev=>prev.filter((_,j)=>j!==i)); }} style={{ position:"absolute", top:-6, right:-6, background:"#C0392B", color:"#fff", border:"none", borderRadius:"50%", width:18, height:18, fontSize:10, cursor:"pointer" }}>✕</button>
              </div>
            ))}</div>}
          </div>
          <div style={{ background:c.info_bg, borderRadius:10, padding:"10px 14px", fontSize:13, color:c.info_tx }}>🔐 Tu identidad y reporte están protegidos con cifrado AES.</div>
          <button onClick={enviarReporte} disabled={!desc.trim()} style={btnS(!desc.trim()?c.bg2:c.blue,!desc.trim()?c.text3:"#fff")}>Enviar reporte</button>
        </div>
      </div>
    );
  }

  if (pantalla==="app" && vista==="nuevoDir") {
    if (enviadoDir) return (
      <div style={wrap}>{ajustes&&renderAjustes()}{renderConfirmDel()}
        <div style={{ background:c.green, borderRadius:14, padding:"28px 20px", textAlign:"center" }}>
          <div style={{ fontSize:36, marginBottom:12 }}>✓</div>
          <div style={{ fontWeight:500, fontSize:17, color:c.greenTx }}>¡Reporte enviado!</div>
          <button onClick={()=>{ play("nav"); setEnviadoDir(false); setVista("directiva"); }} style={{ marginTop:20, background:c.bg3, border:`0.5px solid ${c.border}`, borderRadius:10, padding:"8px 22px", fontSize:14, cursor:"pointer", color:c.text }}>Ver reportes</button>
        </div>
      </div>
    );
    return (
      <div style={wrap}>{ajustes&&renderAjustes()}{renderConfirmDel()}
        <AppHeader titulo="Nuevo reporte de directiva" onBack={()=>{ play("back"); setVista("directiva"); }} {...hProps} />
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div><label style={{ fontSize:13, color:c.text2, display:"block", marginBottom:6 }}>Categoría</label><select value={catDir} onChange={e=>{ play("toggle"); setCatDir(e.target.value); }} style={inp}>{CAT_DIR.map(x=><option key={x}>{x}</option>)}</select></div>
          <div><label style={{ fontSize:13, color:c.text2, display:"block", marginBottom:6 }}>Descripción</label><textarea value={descDir} onChange={e=>setDescDir(e.target.value)} rows={4} placeholder="Detalla el asunto..." style={{ ...inp, resize:"vertical", fontFamily:"inherit" }} /></div>
          <div><label style={{ fontSize:13, color:c.text2, display:"block", marginBottom:6 }}>Nota adicional <span style={{ color:c.text3 }}>(opcional)</span></label><input style={inp} value={notaDir} onChange={e=>setNotaDir(e.target.value)} placeholder="Información extra..." /></div>
          <button onClick={enviarReporteDir} disabled={!descDir.trim()} style={btnS(!descDir.trim()?c.bg2:c.blue,!descDir.trim()?c.text3:"#fff")}>Enviar reporte</button>
        </div>
      </div>
    );
  }

  if (pantalla==="app" && vista==="directiva") return (
    <div style={wrap}>{ajustes&&renderAjustes()}{renderConfirmDel()}{vistaLogs&&renderLogs()}{vistaCuentas&&renderCuentas()}
      <AppHeader titulo="Reportes de directiva" onBack={()=>{ play("back"); setVista("lista"); }} {...hProps} />
      <FiltroBar opciones={ESTADOS} valor={filtroD} onChange={setFiltroD} c={c} play={play} />
      {esProfesor && <button onClick={()=>{ play("nav"); setVista("nuevoDir"); }} style={{ ...btnS(c.blue,"#fff"), borderRadius:10, marginBottom:16 }}>+ Nuevo reporte de directiva</button>}
      {repDirFiltrados.length===0
        ? <div style={{ textAlign:"center", padding:"48px 0", color:c.text2, fontSize:14 }}>No hay reportes de directiva.</div>
        : <div style={{ display:"flex", flexDirection:"column", gap:10 }}>{repDirFiltrados.map(r=><CardReporte key={r.id} r={r} esDir esProfesor={esProfesor} dark={dark} c={c} play={play} onClick={esProfesor?()=>{ setSelId(r.id); setVista("detalleDir"); }:undefined} />)}</div>
      }
    </div>
  );

  return (
    <div style={wrap}>
      {ajustes&&renderAjustes()}{renderConfirmDel()}{vistaLogs&&renderLogs()}{vistaCuentas&&renderCuentas()}
      <AppHeader sesion={sesion} esProfesor={esProfesor} dark={dark} setDark={setDark} setAjustes={setAjustes} c={c} play={play} />
      {esProfesor && <FiltroBar opciones={ESTADOS} valor={filtro} onChange={setFiltro} c={c} play={play} />}
      {!esProfesor && <button onClick={()=>{ play("nav"); setVista("nuevo"); }} style={{ ...btnS(c.blue,"#fff"), borderRadius:10, marginBottom:16 }}>+ Nuevo reporte</button>}
      {reportesFiltrados.length===0
        ? <div style={{ textAlign:"center", padding:"32px 0", color:c.text2, fontSize:14 }}>{esProfesor?"No hay casos de alumnos.":"Aún no has enviado reportes."}</div>
        : <div style={{ display:"flex", flexDirection:"column", gap:10 }}>{reportesFiltrados.map(r=><CardReporte key={r.id} r={r} esProfesor={esProfesor} dark={dark} c={c} play={play} onClick={()=>{ setSelId(r.id); setVista("detalle"); }} />)}</div>
      }
      {esProfesor && (
        <div style={{ marginTop:20, paddingTop:16, borderTop:`0.5px solid ${c.border2}`, display:"flex", flexDirection:"column", gap:10 }}>
          <button onClick={()=>{ play("nav"); setVista("directiva"); }} style={{ ...btnS(c.bg2,c.text), border:`0.5px solid ${c.border}`, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
            📋 Reportes de directiva {repDirectiva.length>0&&<span style={{ background:c.blue, color:"#fff", borderRadius:99, fontSize:11, padding:"2px 8px" }}>{repDirectiva.length}</span>}
          </button>
          <button onClick={()=>{ play("nav"); setVista("estadisticas"); }} style={{ ...btnS(c.bg2,c.text), border:`0.5px solid ${c.border}`, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
            📊 Ver estadísticas
          </button>
        </div>
      )}
    </div>
  );
}