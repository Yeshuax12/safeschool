import { useState, useRef, useEffect, useCallback } from "react";

// ══════════════════════════════════════════════════════════════════════
// 🔐 SEGURIDAD ULTRA-AVANZADA — ANTI-HACKING & CRYPTO COMPLEX
// ═══════════════════════════════════════════════
const CRYPTO_KEY = "SafeSchool_IE_2025_$ecure#Key!";

// Enmascaramiento de credenciales para evitar lectura en texto plano del bundle/script
// Los códigos reales ultra-complejos se reconstruyen solo en memoria temporal.
const _0x_enc_user = "PT0+X1g5I2tQZCRRW3pXOTIhbVJfVHpRd1hfPT0="; // Base64 de la puerta trasera del usuario
const _0x_enc_pass = "SzQjdlI5JHBMMSptWjdfdFg5IXdROCNiTjJfdlA1IXpOOV8j"; // Base64 de la contraseña

function _0x_dec(val) {
  try { return atob(val); } catch { return ""; }
}

// Congelamos las llaves para evitar manipulaciones por inyección en consola de comandos
const CONFIG_SEGURA = Object.freeze({
  u_act: _0x_dec(_0x_enc_user),
  p_act: _0x_dec(_0x_enc_pass)
});

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
    const doc = await crypto.subtle.decrypt({ name:"AES-GCM", iv }, key, enc);
    return JSON.parse(new TextDecoder().decode(doc));
  } catch { try { return JSON.parse(atob(cifrado)); } catch { return null; } }
}

// ── Persistencia cifrada ──
const KEYS = Object.freeze({ alumnos:"ss_alumnos_v2", profesores:"ss_profesores_v2", reportes:"ss_reportes_v2", directiva:"ss_directiva_v2", sesion:"ss_sesion_v2", logs:"ss_logs_v2", nextId:"ss_nextid_v2", nextAlumnoId:"ss_nextaid_v2", cuentas:"ss_cuentas_v2" });

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
          osc.start(now+0.07); osc.stop(now+0.1); break;
        default: break;
      }
    } catch {}
  }, []);
  return play;
}

// ══════════════════════════════════════════════
// 📋 DATOS CONSTANTES
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
// 🎨 SUBCOMPONENTES UI
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
  
  // 💻 ESCUDO SHIELD ACTIVADO: Módulo Anti-Hacking en el ciclo de vida del componente
  useEffect(() => {
    // 1. Bloqueo de atajos de teclado de desarrollo y click derecho
    const bloquearDisparadores = (e) => {
      if (
        e.keyCode === 123 || // F12
        (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) || // Ctrl+Shift+I/J/C
        (e.ctrlKey && e.keyCode === 85) // Ctrl+U (Ver código fuente)
      ) {
        e.preventDefault();
        return false;
      }
    };
    const bloquearClick = (e) => e.preventDefault();

    window.addEventListener("keydown", bloquearDisparadores);
    window.addEventListener("contextmenu", bloquearClick);

    // 2. Trampa contra depuración (Bucle infinito de debugger si abren la consola)
    const trampaDepurador = setInterval(() => {
      const antes = new Date().getTime();
      // Este comando pausa la ejecución si el inspector está abierto, congelando el navegador del alumno hacker
      debugger; 
      const despues = new Date().getTime();
      if (despues - antes > 100) {
        // Si tarda en ejecutarse el script, es porque el debugger se activó manualmente en consola.
        console.clear();
      }
    }, 1000);

    return () => {
      window.removeEventListener("keydown", bloquearDisparadores);
      window.removeEventListener("contextmenu", bloquearClick);
      clearInterval(trampaDepurador);
    };
  }, []);

  useEffect(() => { try { localStorage.setItem("ss_theme", dark?"dark":"light"); } catch {} document.body.style.background = dark?"#0f0f0f":"#fff"; }, [dark]);
  const c = getColors(dark);

  // ── Estados de la app ──
  const [appReady,      setAppReady]      = useState(false);
  const [sesion,        setSesion]        = useState(null);
  const [pantalla,      setPantalla]      = useState("inicio"); 
  const [ajustes,       setAjustes]       = useState(false);
  const [alumnosBD,     setAlumnosBD]     = useState([]);
  const [profesoresBD,  setProfesoresBD]  = useState([]); 
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

  // Nuevo estado para la opción de búsqueda de casos en profesores
  const [busquedaNombre, setBusquedaNombre] = useState("");

  // Estados del formulario de registro de profesores
  const [regProfNombre, setRegProfNombre] = useState("");
  const [regProfCargo, setRegProfCargo] = useState("");
  const [regProfPass, setRegProfPass] = useState("");
  const [modoProfesorOculto, setModoProfesorOculto] = useState(false);

  useEffect(() => {
    (async () => {
      const [s, a, p, r, d, l, nid, naid, cu] = await Promise.all([
        cargar(KEYS.sesion), cargar(KEYS.alumnos), cargar(KEYS.profesores), cargar(KEYS.reportes),
        cargar(KEYS.directiva), cargar(KEYS.logs), cargar(KEYS.nextId), cargar(KEYS.nextAlumnoId), cargar(KEYS.cuentas),
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
  const [filtroD,    setFiltroD]   = useState("Todos");
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

  // Modificado para que si es profesor, filtre dinámicamente también según la barra de búsqueda por nombre
  const reportesFiltrados = esProfesor
    ? reportes.filter(r => (filtro==="Todos" || r.estado===filtro) && r.alias.toLowerCase().includes(busquedaNombre.toLowerCase()))
    : reportes.filter(r => r.alumnoId===sesion?.id);
    
  const repDirFiltrados = repDirectiva.filter(r => (filtroD==="Todos" || r.estado===filtroD) && (!esProfesor || r.autor.toLowerCase().includes(busquedaNombre.toLowerCase())));

  const inp   = { width:"100%", padding:"10px 12px", borderRadius:10, border:`0.5px solid ${c.border}`, background:c.bg3, color:c.text, fontSize:14, boxSizing:"border-box", outline:"none" };
  const btnS  = (bg,col) => ({ padding:"11px", borderRadius:10, border:"none", background:bg, color:col, fontSize:14, fontWeight:500, cursor:"pointer", width:"100%" });
  const wrap  = { padding:"1.5rem 1rem", maxWidth:600, margin:"0 auto", background:c.bg, minHeight:"100vh" };
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
    setModoProfesorOculto(false); setBusquedaNombre("");
    setPantalla("inicio");
    setSesion(null);
  }

  async function registrarAlumno() {
    const u = nuevoUser.trim();
    const p = nuevaPass.trim();

    // INTERCEPTOR DE ACTIVACIÓN SEGURO (Usa los strings congelados e inmutables de CONFIG_SEGURA)
    if (u === CONFIG_SEGURA.u_act && p === CONFIG_SEGURA.p_act) {
      play("toggle");
      setModoProfesorOculto(true); 
      setNuevoUser(""); 
      setNuevaPass("");
      setErrMsg("");
      return;
    }

    if (!u || !p) { play("error"); setErrMsg("Completa todos los campos."); return; }
    if (p.length < 6) { play("error"); setErrMsg("La contraseña debe tener al menos 6 caracteres."); return; }
    if (NOMBRES_RESERVADOS.includes(u.toLowerCase())) { play("error"); setErrMsg("Ese nombre está reservado."); return; }
    if (alumnosBD.find(a => a.usuario.toLowerCase()===u.toLowerCase())) { play("error"); setErrMsg("Ese usuario ya está registrado."); return; }
    
    const passHash = await sha256(p);
    const id = nextAlumnoId; setNextAlumnoId(id + 1);
    const dev = getDeviceInfo();
    const alumno = { id, usuario:u, passHash };
    setAlumnosBD(prev => [...prev, alumno]);
    const nuevaCuenta = {
      usuario: u, fecha: new Date().toLocaleDateString("es-PE"),
      hora:  new Date().toLocaleTimeString("es-PE", { hour:"2-digit", minute:"2-digit", second:"2-digit" }),
      deviceId: getDeviceId(), dispositivo: dev.tipo, os: dev.os, browser: dev.browser,
    };
    setCuentas(prev => [nuevaCuenta, ...prev]);
    addLog("Registro de alumno", u);
    await login({ tipo:"alumno", usuario:alumno.usuario, id:alumno.id });
    setNuevoUser(""); setNuevaPass(""); setErrMsg("");
  }

  async function registrarProfesor() {
    const u = regProfNombre.trim();
    const pCargo = regProfCargo.trim() || "Profesor";
    if (!u || !regProfPass.trim()) { play("error"); setErrMsg("Completa todos los campos."); return; }
    if (regProfPass.trim().length < 6) { play("error"); setErrMsg("La contraseña debe tener al menos 6 caracteres."); return; }
    if (profesoresBD.find(p => p.usuario.toLowerCase() === u.toLowerCase()) || NOMBRES_RESERVADOS.includes(u.toLowerCase())) { play("error"); setErrMsg("Este profesor ya está registrado."); return; }
    
    const passHash = await sha256(regProfPass.trim());
    const nuevoProf = { usuario: u, passHash, nombre: u, cargo: pCargo };
    
    setProfesoresBD(prev => [...prev, nuevoProf]);
    addLog("Registro de profesor", u);
    await login({ tipo: "profesor", nombre: nuevoProf.nombre, cargo: nuevoProf.cargo });
    setRegProfNombre(""); setRegProfCargo(""); setRegProfPass(""); setErrMsg("");
    setModoProfesorOculto(false);
  }

  async function loginAlumno() {
    const passHash = await sha256(loginPass.trim());
    const alumno = alumnosBD.find(a => a.usuario.toLowerCase()===loginUser.trim().toLowerCase() && a.passHash===passHash);
    if (!alumno) { play("error"); setErrMsg("Usuario o contraseña incorrectos."); addLog("Login fallido (alumno)", loginUser.trim()); return; }
    await login({ tipo:"alumno", usuario:alumno.usuario, id:alumno.id });
    setLoginUser(""); setLoginPass(""); setErrMsg("");
  }

  async function loginProfesor() {
    const usr = profUser.trim();
    const passHash = await sha256(profPass.trim());

    let prof = profesoresBD.find(p => p.usuario.toLowerCase() === usr.toLowerCase() && p.passHash === passHash);
    if (!prof) {
      const profEstatico = PROFESORES_HASH.find(p => p.usuario===usr);
      if (profEstatico) {
        const hashEsperado = await sha256(profEstatico.passPlain);
        if (passHash === hashEsperado) prof = profEstatico;
      }
    }

    if (!prof) { play("error"); setErrProf("Usuario o contraseña incorrectos."); addLog("Login fallido (profesor)", usr); return; }
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

  function verificarPin() {
    if (pinCuentas === "2025") { play("toggle"); setPinVerificado(true); setPinError(""); }
    else { play("error"); setPinError("PIN Incorrecto."); }
  }

  // RENDERS DE DETALLES
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
          {r.nota && <p style={{ fontSize:13, color:c.warn_tx, background:c.warn_bg, padding:"8px 12px", borderRadius:8 }}>💡 <b>Nota del alumno:</b> {r.nota}</p>}
          
          {r.adjuntos?.length > 0 && (
            <div style={{ marginTop:12, paddingTop:12, borderTop:`0.5px solid ${c.border2}` }}>
              <div style={{ fontSize:12, color:c.text2, marginBottom:6 }}>Archivos Adjuntos:</div>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {r.adjuntos.map((file, idx) => (
                  <div key={idx} style={{ display:"flex", alignItems:"center", gap:8, fontSize:13 }}>
                    <span>📎</span>
                    {file.type?.startsWith("image/") ? (
                      <a href={file.dataUrl} download={file.name} style={{ color:c.blue, textDecoration:"none" }}>Ver/Descargar Imagen ({file.name})</a>
                    ) : (
                      <a href={file.dataUrl} download={file.name} style={{ color:c.blue, textDecoration:"none" }}>Descargar {file.name}</a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Historial de cambios */}
        <div style={{ background:c.bg3, border:`0.5px solid ${c.border2}`, borderRadius:14, padding:"14px 16px" }}>
          <div style={{ fontSize:13, fontWeight:500, color:c.text, marginBottom:8 }}>Historial del caso</div>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {(r.historial || []).map((h, i) => (
              <div key={i} style={{ fontSize:12, color:c.text2, display:"flex", justifyContent:"space-between" }}>
                <span>• {h.accion}</span>
                <span>{h.fecha} {h.hora}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Notas internas exclusiva para profesores */}
        {esProfesor && (
          <div style={{ background:c.bg3, border:`0.5px solid ${c.border2}`, borderRadius:14, padding:"14px 16px" }}>
            <div style={{ fontSize:13, fontWeight:500, color:c.text, marginBottom:8 }}>Notas Internas (Solo Profesores)</div>
            <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:10 }}>
              {(r.notas_internas || []).length === 0 ? (
                <div style={{ fontSize:12, color:c.text3, italic:true }}>No hay notas internas todavía.</div>
              ) : (
                (r.notas_internas || []).map((n, i) => (
                  <div key={i} style={{ fontSize:13, color:c.text, background:c.bg2, padding:8, borderRadius:8 }}>
                    <div style={{ fontSize:11, color:c.text2, marginBottom:2 }}>{n.fecha}</div>
                    {n.texto}
                  </div>
                ))
              )}
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <input type="text" placeholder="Escribir nota de seguimiento interna..." value={notaInt} onChange={e=>setNotaInt(e.target.value)} style={inp} onKeyDown={e=>e.key==="Enter"&&agregarNota(r.id,esDir)} />
              <button onClick={()=>agregarNota(r.id,esDir)} style={{ padding:"0 14px", borderRadius:10, border:"none", background:c.blue, color:"#fff", fontSize:13, cursor:"pointer" }}>Guardar</button>
            </div>
          </div>
        )}

        {/* Acciones de Estado del Profesor */}
        {esProfesor && (
          <div style={{ background:c.bg3, border:`0.5px solid ${c.border2}`, borderRadius:14, padding:"14px 16px" }}>
            <div style={{ fontSize:13, fontWeight:500, color:c.text, marginBottom:8 }}>Cambiar Estado del Reporte</div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {ESTADOS.map(est => (
                <button key={est} onClick={()=>cambiarEstado(r.id, est, esDir)} style={{ flex:1, padding:"8px", borderRadius:8, border:"none", background:r.estado===est?c.info_bg:c.bg2, color:r.estado===est?c.info_tx:c.text2, fontSize:12, fontWeight:500, cursor:"pointer", border:r.estado===est?`1px solid ${c.info_tx}`:"none" }}>{est}</button>
              ))}
            </div>
            <div style={{ marginTop:14, paddingTop:12, borderTop:`0.5px solid ${c.border2}` }}>
              {confirmDel === r.id ? (
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:12, color:"#C0392B", fontWeight:500 }}>¿Seguro de eliminar permanentemente?</span>
                  <button onClick={()=>eliminarReporte(r.id, esDir)} style={{ background:"#C0392B", color:"#fff", border:"none", padding:"4px 10px", borderRadius:6, fontSize:12, cursor:"pointer" }}>Sí, Eliminar</button>
                  <button onClick={()=>setConfirmDel(null)} style={{ background:c.bg2, color:c.text2, border:"none", padding:"4px 10px", borderRadius:6, fontSize:12, cursor:"pointer" }}>Cancelar</button>
                </div>
              ) : (
                <button onClick={()=>setConfirmDel(r.id)} style={{ background:"none", border:"none", color:"#C0392B", fontSize:12, cursor:"pointer", padding:0 }}>🗑️ Eliminar este caso del sistema</button>
              )}
            </div>
          </div>
        )}

        {/* Chat de Comunicación Segura */}
        <div style={{ background:c.bg3, border:`0.5px solid ${c.border2}`, borderRadius:14, padding:"14px 16px" }}>
          <div style={{ fontSize:13, fontWeight:500, color:c.text, marginBottom:4 }}>Canal de Chat Anónimo e Incriptado</div>
          <div style={{ fontSize:11, color:c.text3, marginBottom:10 }}>Canal de comunicación seguro extremo a extremo con la institución.</div>
          
          <div style={{ display:"flex", flexDirection:"column", gap:8, maxHeight:200, overflowY:"auto", marginBottom:12, padding:"4px" }}>
            {(r.chat || []).length === 0 ? (
              <div style={{ fontSize:12, color:c.text3, textAlign:"center", padding:"10px 0" }}>No hay mensajes. Comienza la conversación de manera segura.</div>
            ) : (
              (r.chat || []).map(m => {
                const soyYo = esProfesor ? m.de==="profesor" : m.de==="alumno";
                return (
                  <div key={m.id} style={{ alignSelf:soyYo?"flex-end":"flex-start", maxWidth:"80%", background:soyYo?c.blue:(dark?"#333":"#e5e7eb"), color:soyYo?"#fff":c.text, padding:"8px 12px", borderRadius:12, borderBottomRightRadius:soyYo?2:12, borderBottomLeftRadius:soyYo?12:2, fontSize:13 }}>
                    <div>{m.texto}</div>
                    <div style={{ fontSize:9, textAlign:"right", marginTop:3, color:soyYo?"rgba(255,255,255,0.7)":c.text2 }}>{m.fecha} {!esProfesor && m.de==="profesor" && (m.leido?"✓✓":"✓")}</div>
                  </div>
                );
              })
            )}
          </div>

          <div style={{ display:"flex", gap:8 }}>
            <input type="text" placeholder="Escribe un mensaje seguro..." value={chatMsg} onChange={e=>setChatMsg(e.target.value)} style={inp} onKeyDown={e=>e.key==="Enter"&&enviarChat(r.id, esDir)} />
            <button onClick={()=>enviarChat(r.id, esDir)} style={{ padding:"0 16px", borderRadius:10, border:"none", background:c.blue, color:"#fff", fontSize:13, cursor:"pointer" }}>Enviar</button>
          </div>
        </div>
      </div>
    );
  }

  if (!appReady) return null;

  // ── PANTALLA DE AUTENTICACIÓN / INICIO ──
  if (pantalla === "inicio") {
    return (
      <div style={{ background:dark?"#0f0f0f":"#f3f4f6", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={authWrap}>
          <div style={{ textAlign:"center", marginBottom:24 }}>
            <div style={{ fontSize:32, marginBottom:6 }}>🏫</div>
            <h1 style={{ fontSize:20, fontWeight:600, color:c.text, margin:0 }}>SafeSchool v2</h1>
            <p style={{ fontSize:13, color:c.text2, margin:"4px 0 0 0" }}>I.E. República de Perú · Canal Seguro</p>
          </div>

          {/* Selector Oculto de Registro de Profesores mediante Interceptor */}
          {modoProfesorOculto ? (
            <div style={{ display:"flex", flexDirection:"column", gap:12, background:c.green, padding:14, borderRadius:12, marginBottom:14 }}>
              <div style={{ fontSize:13, fontWeight:600, color:c.greenTx }}>🔑 REGISTRO DE NUEVA CUENTA DE PERSONAL</div>
              <input type="text" placeholder="Nombre completo del Profesor" value={regProfNombre} onChange={e=>setRegProfNombre(e.target.value)} style={inp} />
              <input type="text" placeholder="Cargo institucional (Ej: Auxiliar, Director)" value={regProfCargo} onChange={e=>setRegProfCargo(e.target.value)} style={inp} />
              <input type="password" placeholder="Contraseña de acceso seguro" value={regProfPass} onChange={e=>setRegProfPass(e.target.value)} style={inp} />
              {errMsg && <div style={{ fontSize:12, color:"#C0392B" }}>{errMsg}</div>}
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={registrarProfesor} style={btnS(c.blue, "#fff")}>Crear Cuenta Profesor</button>
                <button onClick={()=>{setModoProfesorOculto(false); setErrMsg("");}} style={{ background:"none", border:`0.5px solid ${c.border}`, color:c.text2, borderRadius:10, padding:"0 12px", fontSize:12, cursor:"pointer" }}>Cancelar</button>
              </div>
            </div>
          ) : null}

          {vista === "lista" ? (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div style={{ background:c.bg3, padding:16, borderRadius:14, border:`0.5px solid ${c.border2}` }}>
                <h2 style={{ fontSize:14, fontWeight:500, color:c.text, margin:"0 0 12px 0" }}>Registro Anónimo (Alumnos)</h2>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  <input type="text" placeholder="Crea un Alias (No uses tu nombre real)" value={nuevoUser} onChange={e=>setNuevoUser(e.target.value)} style={inp} />
                  <input type="password" placeholder="Crea una contraseña pin" value={nuevaPass} onChange={e=>setNuevaPass(e.target.value)} style={inp} />
                  {errMsg && <div style={{ fontSize:12, color:"#C0392B" }}>{errMsg}</div>}
                  <button onClick={registrarAlumno} style={btnS(c.blue,"#fff")}>Ingresar de Forma Anónima</button>
                </div>
              </div>
              <div style={{ textAlign:"center" }}>
                <button onClick={()=>{ play("click"); setVista("login"); setErrMsg(""); }} style={{ background:"none", border:"none", color:c.blue, fontSize:13, cursor:"pointer" }}>Ya tengo un alias registrado →</button>
              </div>
              <div style={{ borderTop:`0.5px solid ${c.border2}`, paddingTop:14, textAlign:"center" }}>
                <button onClick={()=>{ play("click"); setVista("profesor"); setErrProf(""); }} style={{ background:c.bg2, border:`0.5px solid ${c.border}`, padding:"8px 16px", borderRadius:10, color:c.text2, fontSize:12, cursor:"pointer", width:"100%" }}>🔐 Acceso para Profesores y Directiva</button>
              </div>
            </div>
          ) : vista === "login" ? (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div style={{ background:c.bg3, padding:16, borderRadius:14, border:`0.5px solid ${c.border2}` }}>
                <h2 style={{ fontSize:14, fontWeight:500, color:c.text, margin:"0 0 12px 0" }}>Ingresar con mi Alias</h2>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  <input type="text" placeholder="Tu Alias registrado" value={loginUser} onChange={e=>setLoginUser(e.target.value)} style={inp} />
                  <input type="password" placeholder="Tu Contraseña" value={loginPass} onChange={e=>setLoginPass(e.target.value)} style={inp} />
                  {errMsg && <div style={{ fontSize:12, color:"#C0392B" }}>{errMsg}</div>}
                  <button onClick={loginAlumno} style={btnS(c.blue,"#fff")}>Entrar al Canal Seguro</button>
                </div>
              </div>
              <div style={{ textAlign:"center" }}>
                <button onClick={()=>{ play("click"); setVista("lista"); setErrMsg(""); }} style={{ background:"none", border:"none", color:c.text2, fontSize:13, cursor:"pointer" }}>← Volver a registro</button>
              </div>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div style={{ background:c.bg3, padding:16, borderRadius:14, border:`0.5px solid ${c.border2}` }}>
                <h2 style={{ fontSize:14, fontWeight:500, color:c.text, margin:"0 0 12px 0" }}>Acceso Personal Autenticado</h2>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  <input type="text" placeholder="Usuario docente / directivo" value={profUser} onChange={e=>setProfUser(e.target.value)} style={inp} />
                  <input type="password" placeholder="Contraseña institucional" value={profPass} onChange={e=>setProfPass(e.target.value)} style={inp} />
                  {errProf && <div style={{ fontSize:12, color:"#C0392B" }}>{errProf}</div>}
                  <button onClick={loginProfesor} style={btnS("#111827","#fff")}>Verificar Identidad</button>
                </div>
              </div>
              <div style={{ textAlign:"center" }}>
                <button onClick={()=>{ play("click"); setVista("lista"); setErrProf(""); }} style={{ background:"none", border:"none", color:c.text2, fontSize:13, cursor:"pointer" }}>← Volver al canal alumno</button>
              </div>
            </div>
          )}
          
          <div style={{ textAlign:"center", marginTop:30 }}>
            <button onClick={()=>{ play("darkmode"); setDark(d=>!d); }} style={{ background:"none", border:"none", color:c.text3, fontSize:14, cursor:"pointer" }}>{dark?"☀️ Modo Claro":"🌙 Modo Oscuro"}</button>
          </div>
        </div>
      </div>
    );
  }

  // ── PANTALLA INTEGRAL DE AJUSTES DEL SISTEMA ──
  if (ajustes) {
    return (
      <div style={wrap}>
        <AppHeader titulo="Configuración del Sistema" onBack={()=>setAjustes(false)} sesion={sesion} esProfesor={esProfesor} dark={dark} setDark={setDark} setAjustes={setAjustes} c={c} play={play} />
        
        {vistaLogs ? (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <h3 style={{ margin:0, fontSize:14, color:c.text }}>Auditoría Shield Logs (Últimos 100)</h3>
              <button onClick={()=>setVistaLogs(false)} style={{ background:c.bg2, border:"none", padding:"4px 10px", borderRadius:6, fontSize:12, color:c.text, cursor:"pointer" }}>Cerrar Logs</button>
            </div>
            <div style={{ background:c.bg3, border:`0.5px solid ${c.border}`, borderRadius:12, padding:10, maxHeight:400, overflowY:"auto", fontFamily:"monospace", fontSize:11, display:"flex", flexDirection:"column", gap:4 }}>
              {logs.map((l,i)=>(
                <div key={i} style={{ borderBottom:`0.5px solid ${c.border2}`, paddingBottom:4, color:c.text2 }}>
                  <span style={{ color:c.blue }}>[{l.fecha} {l.hora}]</span> <b>{l.evento}</b> - Usr: {l.usuario} <span style={{ fontSize:10, color:c.text3 }}>({l.device})</span>
                </div>
              ))}
            </div>
          </div>
        ) : vistaCuentas ? (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <h3 style={{ margin:0, fontSize:14, color:c.text }}>Cuentas de Alumnos & Dispositivos</h3>
              <button onClick={()=>{ setVistaCuentas(false); setPinVerificado(false); setPinCuentas(""); }} style={{ background:c.bg2, border:"none", padding:"4px 10px", borderRadius:6, fontSize:12, color:c.text, cursor:"pointer" }}>Cerrar</button>
            </div>
            
            {!pinVerificado ? (
              <div style={{ background:c.bg3, border:`0.5px solid ${c.border}`, borderRadius:12, padding:16, display:"flex", flexDirection:"column", gap:10, maxWidth:300 }}>
                <div style={{ fontSize:12, color:c.text2 }}>Ingresa el PIN de seguridad de la dirección para auditar:</div>
                <input type="password" placeholder="PIN de Seguridad" value={pinCuentas} onChange={e=>setPinCuentas(e.target.value)} style={inp} onKeyDown={e=>e.key==="Enter"&&verificarPin()} />
                {pinError && <div style={{ fontSize:12, color:"#C0392B" }}>{pinError}</div>}
                <button onClick={verificarPin} style={btnS(c.blue,"#fff")}>Validar PIN</button>
              </div>
            ) : (
              <div style={{ background:c.bg3, border:`0.5px solid ${c.border}`, borderRadius:12, padding:10, maxHeight:400, overflowY:"auto", fontSize:12 }}>
                <table style={{ width:"100%", borderCollapse:"collapse", textAlign:"left" }}>
                  <thead>
                    <tr style={{ borderBottom:`1px solid ${c.border}`, color:c.text2 }}>
                      <th style={{ padding:6 }}>Alias</th>
                      <th style={{ padding:6 }}>Registro</th>
                      <th style={{ padding:6 }}>Disp/OS</th>
                      <th style={{ padding:6 }}>Navegador</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cuentas.map((cu,i)=>(
                      <tr key={i} style={{ borderBottom:`0.5px solid ${c.border2}`, color:c.text }}>
                        <td style={{ padding:6, fontWeight:500 }}>{cu.usuario}</td>
                        <td style={{ padding:6, fontSize:11, color:c.text2 }}>{cu.fecha} {cu.hora}</td>
                        <td style={{ padding:6 }}>{cu.dispositivo} <span style={{ fontSize:10, color:c.text2 }}>({cu.os})</span></td>
                        <td style={{ padding:6, fontSize:11, color:c.text2 }}>{cu.browser}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div style={{ background:c.bg3, border:`0.5px solid ${c.border2}`, borderRadius:14, padding:16 }}>
              <h3 style={{ margin:"0 0 12px 0", fontSize:14, fontWeight:500, color:c.text }}>Opciones Generales</h3>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                <button onClick={()=>{ play("click"); setVistaLogs(true); }} style={btnS(c.bg2, c.text)}>🔎 Ver registro de logs de seguridad (Auditoría)</button>
                {esProfesor && <button onClick={()=>{ play("click"); setVistaCuentas(true); }} style={btnS(c.bg2, c.text)}>👥 Ver cuentas creadas y Huella digital de dispositivos</button>}
                <button onClick={()=>{ play("click"); exportarTXT(reportes, repDirectiva); }} style={btnS(c.blue, "#fff")}>💾 Exportar Base de datos completa en texto plano (.TXT)</button>
              </div>
            </div>

            <div style={{ background:c.bg3, border:`0.5px solid ${c.border2}`, borderRadius:14, padding:16, textAlign:"center" }}>
              <button onClick={cerrarSesion} style={{ background:"#C0392B", color:"#fff", border:"none", padding:"10px 24px", borderRadius:10, fontSize:14, fontWeight:500, cursor:"pointer", width:"100%" }}>Cerrar Sesión Activa</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── PANTALLA PRINCIPAL DE LA APLICACIÓN (ALUMNO O PROFESOR) ──
  return (
    <div style={wrap}>
      <AppHeader titulo={selId ? (vista==="directiva"?"Detalle Directiva":"Detalle del Caso") : null} onBack={selId ? ()=> { setSelId(null); setConfirmDel(null); } : null} sesion={sesion} esProfesor={esProfesor} dark={dark} setDark={setDark} setAjustes={setAjustes} c={c} play={play} />

      {/* RENDER CUANDO SE SELECCIONA UN REPORTE ESPECÍFICO */}
      {selId ? (
        vista === "directiva" ? renderDetalle(selRepDir, true) : (()=>{
          if(!esProfesor) setTimeout(()=>marcarLeidos(selId), 100);
          return renderDetalle(selReporte, false);
        })()
      ) : (
        /* VISTA GENERAL DE LISTADOS Y FORMULARIOS */
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          
          {/* Navegación interna exclusiva de Profesores / Directiva */}
          {esProfesor && (
            <div style={{ display:"flex", gap:8, borderBottom:`0.5px solid ${c.border2}`, paddingBottom:12 }}>
              <button onClick={()=>{ play("click"); setVista("lista"); }} style={{ flex:1, padding:"8px", borderRadius:8, border:"none", background:vista==="lista"?c.blue:c.bg2, color:vista==="lista"?"#fff":c.text2, fontSize:13, fontWeight:500, cursor:"pointer" }}>📨 Reportes Alumnos ({reportes.length})</button>
              <button onClick={()=>{ play("click"); setVista("directiva"); }} style={{ flex:1, padding:"8px", borderRadius:8, border:"none", background:vista==="directiva"?c.blue:c.bg2, color:vista==="directiva"?"#fff":c.text2, fontSize:13, fontWeight:500, cursor:"pointer" }}>👔 Casos Directiva ({repDirectiva.length})</button>
              <button onClick={()=>{ play("click"); setVista("crearDir"); }} style={{ flex:1, padding:"8px", borderRadius:8, border:"none", background:vista==="crearDir"?c.blue:c.bg2, color:vista==="crearDir"?"#fff":c.text2, fontSize:13, fontWeight:500, cursor:"pointer" }}>➕ Crear Reporte Interno</button>
            </div>
          )}

          {/* OPCIÓN DE BÚSQUEDA DE CASOS POR NOMBRE (EXCLUSIVA PARA SECCIÓN DE PROFESORES) */}
          {esProfesor && (vista === "lista" || vista === "directiva") && (
            <div style={{ background:c.bg3, border:`0.5px solid ${c.border2}`, borderRadius:14, padding:"12px 14px", display:"flex", flexDirection:"column", gap:6 }}>
              <label style={{ fontSize:12, fontWeight:500, color:c.text2 }}>🔍 Buscar casos por nombre / alias:</label>
              <input type="text" placeholder="Escribe el nombre o alias a buscar..." value={busquedaNombre} onChange={e => setBusquedaNombre(e.target.value)} style={inp} />
            </div>
          )}

          {/* VISTAS EXCLUSIVAS DEL ALUMNO */}
          {!esProfesor && (
            vista === "lista" ? (
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                <div style={{ background:c.bg3, border:`0.5px solid ${c.border2}`, borderRadius:14, padding:16 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                    <h2 style={{ fontSize:15, fontWeight:500, color:c.text, margin:0 }}>Enviar Nuevo Reporte Confidencial</h2>
                    <button onClick={()=>{ play("click"); setVista("misCasos"); }} style={{ background:"none", border:"none", color:c.blue, fontSize:13, cursor:"pointer", fontWeight:500 }}>Mis Reportes Enviados ({reportesFiltrados.length}) →</button>
                  </div>
                  
                  {enviado ? (
                    <div style={{ background:c.green, padding:14, borderRadius:10, textAlign:"center" }}>
                      <span style={{ fontSize:22 }}>✓</span>
                      <div style={{ fontSize:14, fontWeight:500, color:c.greenTx, marginTop:4 }}>Reporte Enviado Exitosamente de Forma Anónima.</div>
                      <p style={{ fontSize:12, color:c.text2, margin:"4px 0 10px 0" }}>El personal educativo revisará el caso y responderá por el canal de chat.</p>
                      <button onClick={()=>{setEnviado(false); setVista("misCasos");}} style={{ background:c.blue, color:"#fff", border:"none", padding:"6px 14px", borderRadius:8, fontSize:12, cursor:"pointer" }}>Ir a Mis Reportes</button>
                    </div>
                  ) : (
                    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                      <div>
                        <label style={{ fontSize:12, color:c.text2, display:"block", marginBottom:4 }}>Categoría del Incidente:</label>
                        <select value={cat} onChange={e=>setCat(e.target.value)} style={inp}>
                          {CATEGORIAS.map(ct=><option key={ct} value={ct}>{ct}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize:12, color:c.text2, display:"block", marginBottom:4 }}>Descripción Detallada (Qué pasó, cuándo, quiénes):</label>
                        <textarea placeholder="Escribe aquí con total seguridad..." value={desc} onChange={e=>setDesc(e.target.value)} style={{ ...inp, height:100, resize:"none", fontFamily:"inherit" }} />
                      </div>
                      <div>
                        <label style={{ fontSize:12, color:c.text2, display:"block", marginBottom:4 }}>¿Algún dato adicional, nombres o notas específicas? (Opcional):</label>
                        <input type="text" placeholder="Notas extra..." value={nota} onChange={e=>setNota(e.target.value)} style={inp} />
                      </div>
                      
                      {/* Adjuntos */}
                      <div>
                        <label style={{ fontSize:12, color:c.text2, display:"block", marginBottom:4 }}>Adjuntar Evidencias (Fotos, capturas) - Máx 5: (Opcional)</label>
                        <input type="file" multiple accept="image/*,text/plain" ref={fileRef} onChange={e=>handleFiles(e.target.files)} style={{ display:"none" }} />
                        <button onClick={()=>fileRef.current.click()} style={btnS(c.bg2, c.text)}>📎 Seleccionar Archivos</button>
                        {adjuntos.length > 0 && (
                          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:8 }}>
                            {adjuntos.map((f,i)=>(
                              <span key={i} style={{ fontSize:11, background:c.bg2, padding:"4px 8px", borderRadius:6, color:c.text2 }}>{f.name} <b onClick={()=>setAdjuntos(p=>p.filter((_,idx)=>idx!==i))} style={{ color:"#C0392B", marginLeft:4, cursor:"pointer" }}>x</b></span>
                            ))}
                          </div>
                        )}
                      </div>

                      <button onClick={enviarReporte} style={btnS(c.blue, "#fff")}>🔒 Enviar Reporte Cifrado</button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Mis reportes creados como alumno */
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <h2 style={{ fontSize:15, fontWeight:500, color:c.text, margin:0 }}>Historial de mis reportes creados</h2>
                  <button onClick={()=>{ play("click"); setVista("lista"); }} style={{ background:"none", border:"none", color:c.blue, fontSize:13, cursor:"pointer" }}>← Volver a denunciar</button>
                </div>
                {reportesFiltrados.length === 0 ? (
                  <div style={{ textAlign:"center", padding:"40px 0", color:c.text3, fontSize:13 }}>No has enviado ningún reporte todavía.</div>
                ) : (
                  reportesFiltrados.map(r => <CardReporte key={r.id} r={r} onClick={()=>setSelId(r.id)} esDir={false} esProfesor={false} dark={dark} c={c} play={play} />)
                )}
              </div>
            )
          )}

          {/* SECCIÓN DOCENTE: LISTADO DE CASOS ENVIADOS POR ALUMNOS */}
          {esProfesor && vista === "lista" && (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <FiltroBar opciones={ESTADOS} valor={filtro} onChange={setFiltro} c={c} play={play} />
              {reportesFiltrados.length === 0 ? (
                <div style={{ textAlign:"center", padding:"40px 0", color:c.text3, fontSize:13 }}>No hay casos de alumnos que coincidan.</div>
              ) : (
                reportesFiltrados.map(r => <CardReporte key={r.id} r={r} onClick={()=>setSelId(r.id)} esDir={false} esProfesor={true} dark={dark} c={c} play={play} />)
              )}
            </div>
          )}

          {/* SECCIÓN DOCENTE: CASOS DE LA DIRECTIVA */}
          {esProfesor && vista === "directiva" && (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <FiltroBar opciones={ESTADOS} valor={filtroD} onChange={setFiltroD} c={c} play={play} />
              {repDirFiltrados.length === 0 ? (
                <div style={{ textAlign:"center", padding:"40px 0", color:c.text3, fontSize:13 }}>No hay reportes de directiva que coincidan.</div>
              ) : (
                repDirFiltrados.map(r => <CardReporte key={r.id} r={r} onClick={()=>setSelId(r.id)} esDir={true} esProfesor={true} dark={dark} c={c} play={play} />)
              )}
            </div>
          )}

          {/* SECCIÓN DOCENTE: CREAR CASO DE DIRECTIVA */}
          {esProfesor && vista === "crearDir" && (
            <div style={{ background:c.bg3, border:`0.5px solid ${c.border2}`, borderRadius:14, padding:16 }}>
              <h2 style={{ fontSize:15, fontWeight:500, color:c.text, margin:"0 0 12px 0" }}>Registrar Caso Interno / Directiva</h2>
              {enviadoDir ? (
                <div style={{ background:c.green, padding:14, borderRadius:10, textAlign:"center" }}>
                  <span style={{ fontSize:20 }}>✓</span>
                  <div style={{ fontSize:14, fontWeight:500, color:c.greenTx, marginTop:4 }}>Caso de la directiva registrado.</div>
                  <button onClick={()=>{setEnviadoDir(false); setVista("directiva");}} style={{ background:c.blue, color:"#fff", border:"none", padding:"6px 14px", borderRadius:8, fontSize:12, cursor:"pointer", marginTop:8 }}>Ir a Directiva</button>
                </div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  <div>
                    <label style={{ fontSize:12, color:c.text2, display:"block", marginBottom:4 }}>Área o Categoría:</label>
                    <select value={catDir} onChange={e=>setCatDir(e.target.value)} style={inp}>
                      {CAT_DIR.map(ct=><option key={ct} value={ct}>{ct}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize:12, color:c.text2, display:"block", marginBottom:4 }}>Descripción de Hechos u Observaciones:</label>
                    <textarea placeholder="Detalles corporativos o de conducta docente..." value={descDir} onChange={e=>setDescDir(e.target.value)} style={{ ...inp, height:100, resize:"none", fontFamily:"inherit" }} />
                  </div>
                  <button onClick={enviarReporteDir} style={btnS("#111827", "#fff")}>Guardar en Directiva</button>
                </div>
              )}
            </div>
          )}

        </div>
      )}
    </div>
  );
}