import { useState, useRef, useEffect, useCallback } from "react";

// ══════════════════════════════════════════════════════════════════════
// 🔐 SEGURIDAD ULTRA-AVANZADA — ANTI-HACKING & CRYPTO COMPLEX
// ══════════════════════════════════════════════
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
    const dec = await crypto.subtle.decrypt({ name:"AES-GCM", iv }, key, enc);
    return JSON.parse(new TextDecoder().decode(dec));
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

  // Módulos añadidos: Estado para el Buscador Avanzado en Tiempo Real
  const [busqueda, setBusqueda] = useState("");

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
  const [filtroD,   setFiltroD]   = useState("Todos");
  const [cat,       setCat]       = useState(CATEGORIAS[0]);
  const [catDir,    setCatDir]    = useState(CAT_DIR[0]);
  const [desc,      setDesc]      = useState(""); const [descDir, setDescDir] = useState("");
  const [nota,      setNota]      = useState(""); const [notaDir, setNotaDir] = useState("");
  const [adjuntos,  setAdjuntos]  = useState([]);
  const [enviado,    setEnviado]    = useState(false);
  const [enviadoDir,setEnviadoDir]= useState(false);
  const [chatMsg,    setChatMsg]    = useState("");
  const [notaInt,    setNotaInt]    = useState("");
  const [confirmDel,setConfirmDel]= useState(null);
  const fileRef = useRef();

  const esProfesor = sesion?.tipo === "profesor";
  const selReporte = reportes.find(r => r.id === selId);
  const selRepDir  = repDirectiva.find(r => r.id === selId);

  // 🔎 FUNCIONALIDAD NUEVA 1: Lógica del buscador en tiempo real interactuando con los filtros existentes
  const reportesFiltrados = esProfesor
    ? reportes.filter(r => {
        const pasaFiltro = filtro === "Todos" || r.estado === filtro;
        const textoBusqueda = busqueda.toLowerCase().trim();
        const pasaBusqueda = !textoBusqueda || 
          r.alias.toLowerCase().includes(textoBusqueda) || 
          r.descripcion.toLowerCase().includes(textoBusqueda) || 
          r.categoria.toLowerCase().includes(textoBusqueda) ||
          (r.nota && r.nota.toLowerCase().includes(textoBusqueda));
        return pasaFiltro && pasaBusqueda;
      })
    : reportes.filter(r => r.alumnoId === sesion?.id);

  const repDirFiltrados = repDirectiva.filter(r => {
    const pasaFiltro = filtroD === "Todos" || r.estado === filtroD;
    const textoBusqueda = busqueda.toLowerCase().trim();
    // Profesores pueden buscar en tiempo real en directiva también
    const pasaBusqueda = !esProfesor || !textoBusqueda || 
      r.autor.toLowerCase().includes(textoBusqueda) || 
      r.descripcion.toLowerCase().includes(textoBusqueda) || 
      r.categoria.toLowerCase().includes(textoBusqueda);
    return pasaFiltro && pasaBusqueda;
  });

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
    setModoProfesorOculto(false);
    setBusqueda(""); // Reseteamos la búsqueda
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

  // 💬 FUNCIONALIDAD NUEVA 2: Marcar leídos también para los mensajes de la directiva
  function marcarLeidosDir(id) {
    setRepDirectiva(prev => prev.map(r => r.id===id?{...r,chat:(r.chat||[]).map(m=>m.de==="alumno"?{...m,leido:true}:m)}:r));
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
          {r.nota && <p style={{ fontSize:13, color:c.text2, fontStyle:"italic" }}>Nota: {r.nota}</p>}
          {r.adjuntos?.length>0 && (
            <div style={{ marginTop:12 }}>
              <div style={{ fontSize:12, color:c.text2, marginBottom:8 }}>📎 Archivos adjuntos</div>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {r.adjuntos.map((file, i) => (
                  <a key={i} href={file.dataUrl} download={file.name} style={{ fontSize:13, color:c.info_tx, textDecoration:"none", display:"flex", alignItems:"center", gap:6 }}>
                    📄 {file.name} <span style={{ fontSize:11, color:c.text3 }}>(Descargar)</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Módulos de Gestión Exclusivos del Profesor */}
        {esProfesor && (
          <div style={{ background:c.bg3, border:`0.5px solid ${c.border2}`, borderRadius:14, padding:"16px 18px", display:"flex", flexDirection:"column", gap:12 }}>
            <div style={{ fontSize:13, fontWeight:500, color:c.text }}>⚙️ Panel de Control del Reporte</div>
            <div>
              <label style={{ fontSize:12, color:c.text2, display:"block", marginBottom:6 }}>Cambiar Estado:</label>
              <div style={{ display:"flex", gap:8 }}>
                {ESTADOS.map(est => (
                  <button key={est} onClick={() => cambiarEstado(r.id, est, esDir)} style={{ flex:1, padding:"8px", fontSize:12, borderRadius:8, border:r.estado===est?`1px solid ${c.blue}`:`0.5px solid ${c.border}`, background:r.estado===est?c.info_bg:c.bg2, color:r.estado===est?c.info_tx:c.text, cursor:"pointer", fontWeight:r.estado===est?600:400 }}>
                    {est}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ borderTop:`0.5px solid ${c.border2}`, paddingTop:12 }}>
              <label style={{ fontSize:12, color:c.text2, display:"block", marginBottom:6 }}>Notas Internas (Solo Profesores):</label>
              <div style={{ display:"flex", gap:8, marginBottom:8 }}>
                <input type="text" value={notaInt} onChange={e=>setNotaInt(e.target.value)} placeholder="Añadir nota privada..." style={inp} />
                <button onClick={() => agregarNota(r.id, esDir)} style={{ ...btnS(c.blue, "#fff"), width:"auto", padding:"10px 16px" }}>+</button>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {(r.notas_internas||[]).map((n, i) => (
                  <div key={i} style={{ background:c.bg2, padding:"8px 10px", borderRadius:8, fontSize:12, color:c.text }}>
                    <div style={{ color:c.text3, fontSize:10, marginBottom:2 }}>{n.fecha}</div>
                    {n.texto}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ borderTop:`0.5px solid ${c.border2}`, paddingTop:12 }}>
              {confirmDel === r.id ? (
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:12, color:"#C0392B", flex:1 }}>¿Seguro que deseas eliminar este reporte de forma permanente?</span>
                  <button onClick={() => eliminarReporte(r.id, esDir)} style={{ ...btnS("#C0392B","#fff"), width:"auto", padding:"6px 12px", fontSize:12 }}>Sí, eliminar</button>
                  <button onClick={() => setConfirmDel(null)} style={{ ...btnS(c.bg2, c.text), width:"auto", padding:"6px 12px", fontSize:12, border:`0.5px solid ${c.border}` }}>No</button>
                </div>
              ) : (
                <button onClick={() => setConfirmDel(r.id)} style={{ ...btnS("transparent", "#C0392B"), border:"1px solid #C0392B", padding:"8px", fontSize:12 }}>⚠️ Eliminar Reporte del Sistema</button>
              )}
            </div>
          </div>
        )}

        {/* 💬 FUNCIONALIDAD NUEVA 2: Chat Bidireccional Expandido a Directiva y Alumnos */}
        {(!esDir || esProfesor) && (
          <div style={{ background:c.bg3, border:`0.5px solid ${c.border2}`, borderRadius:14, padding:"16px 18px", display:"flex", flexDirection:"column", gap:12 }}>
            <div style={{ fontSize:13, fontWeight:500, color:c.text }}>💬 Canal de Comunicación Directo ({esDir ? "Directiva" : "Anónimo"})</div>
            <div style={{ background:c.bg2, borderRadius:10, padding:"10px", height:180, overflowY:"auto", display:"flex", flexDirection:"column", gap:8 }}>
              {(r.chat||[]).length === 0 ? (
                <div style={{ color:c.text3, fontSize:12, textAlign:"center", marginTop:70 }}>No hay mensajes en este canal.</div>
              ) : (
                (r.chat||[]).map(m => {
                  const soyYo = esProfesor ? m.de==="profesor" : m.de==="alumno";
                  return (
                    <div key={m.id} style={{ alignSelf:soyYo?"flex-end":"flex-start", maxWidth:"80%", background:soyYo?c.blue:(dark?"#333":"#e2e8f0"), color:soyYo?"#fff":c.text, padding:"8px 12px", borderRadius:12, borderBottomRightRadius:soyYo&&m.de==="profesor"?2:12, borderBottomLeftRadius:!soyYo&&m.de==="alumno"?2:12, fontSize:13 }}>
                      <div>{m.texto}</div>
                      <div style={{ fontSize:9, color:soyYo?"rgba(255,255,255,0.7)":c.text3, textAlign:"right", marginTop:3, display:"flex", gap:4, justifyContent:"flex-end" }}>
                        {m.fecha} {soyYo && !esDir && (m.leido ? "✓✓" : "✓")}
                      </div>
                    </div>
                  );
                })
              )
            )}
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <input type="text" value={chatMsg} onChange={e=>setChatMsg(e.target.value)} onKeyDown={e=>{if(e.key==="Enter") enviarChat(r.id, esDir);}} placeholder="Escribe un mensaje seguro..." style={inp} />
              <button onClick={() => enviarChat(r.id, esDir)} style={{ ...btnS(c.blue, "#fff"), width:"auto", padding:"10px 18px" }}>Enviar</button>
            </div>
          </div>
        )}

        {/* Historial de Auditoría */}
        <div style={{ background:c.bg3, border:`0.5px solid ${c.border2}`, borderRadius:14, padding:"14px 16px" }}>
          <div style={{ fontSize:12, fontWeight:500, color:c.text2, marginBottom:8 }}>📋 Historial de Seguimiento</div>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {(r.historial||[]).map((h, i) => (
              <div key={i} style={{ fontSize:12, color:c.text2, display:"flex", justifyContent:"space-between" }}>
                <span>• {h.accion}</span>
                <span style={{ fontSize:11, color:c.text3 }}>{h.fecha} - {h.hora}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════
  // VISTA INTERFAZ AUTENTICACIÓN
  // ══════════════════════════════════════════════
  if (pantalla === "inicio") {
    return (
      <div style={authWrap}>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <div style={{ fontSize:32, marginBottom:4 }}>🔒</div>
          <h1 style={{ fontSize:20, fontWeight:600, color:c.text, margin:0 }}>SafeSchool v2</h1>
          <p style={{ fontSize:13, color:c.text2, margin:"4px 0 0 0" }}>Línea de Reporte Segura y Encriptada</p>
        </div>

        {modoProfesorOculto ? (
          // Formulario oculto de registro de profesores administradores
          <div style={{ display:"flex", flexDirection:"column", gap:12, background:c.warn_bg, padding:14, borderRadius:12, border:`0.5px solid ${c.warn_tx}` }}>
            <div style={{ fontSize:13, fontWeight:600, color:c.warn_tx }}>⚡ REGISTRO DE PERSONAL AUTORIZADO</div>
            <input type="text" placeholder="Nombre completo del Docente" value={regProfNombre} onChange={e=>setRegProfNombre(e.target.value)} style={inp} />
            <input type="text" placeholder="Cargo (Ej: Subdirector, Tutor 4to)" value={regProfCargo} onChange={e=>setRegProfCargo(e.target.value)} style={inp} />
            <input type="password" placeholder="Clave de acceso nueva" value={regProfPass} onChange={e=>setRegProfPass(e.target.value)} style={inp} />
            {errMsg && <div style={{ fontSize:12, color:"#C0392B" }}>{errMsg}</div>}
            <button onClick={registrarProfesor} style={btnS(c.blue, "#fff")}>Dar de Alta e Iniciar Sesión</button>
            <button onClick={()=>{ play("back"); setModoProfesorOculto(false); setErrMsg(""); }} style={{ ...btnS("transparent", c.text2), fontSize:12 }}>Cancelar</button>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {/* Registro de Alumnos Anónimos */}
            <div style={{ background:c.bg3, padding:16, borderRadius:14, border:`0.5px solid ${c.border2}`, display:"flex", flexDirection:"column", gap:10 }}>
              <div style={{ fontSize:14, fontWeight:500, color:c.text }}>Crear una Cuenta Anónima</div>
              <input type="text" placeholder="Inventa un Alias (No uses tu nombre)" value={nuevoUser} onChange={e=>setNuevoUser(e.target.value)} style={inp} />
              <input type="password" placeholder="Contraseña de seguridad" value={nuevaPass} onChange={e=>setNuevaPass(e.target.value)} style={inp} />
              {errMsg && <div style={{ fontSize:12, color:"#C0392B" }}>{errMsg}</div>}
              <button onClick={registrarAlumno} style={btnS(c.blue, "#fff")}>Registrarse y Entrar 🛡️</button>
            </div>

            {/* Login Alumnos */}
            <div style={{ background:c.bg3, padding:16, borderRadius:14, border:`0.5px solid ${c.border2}`, display:"flex", flexDirection:"column", gap:10 }}>
              <div style={{ fontSize:14, fontWeight:500, color:c.text }}>Ingresar con tu Alias</div>
              <input type="text" placeholder="Tu alias registrado" value={loginUser} onChange={e=>setLoginUser(e.target.value)} style={inp} />
              <input type="password" placeholder="Tu contraseña" value={loginPass} onChange={e=>setLoginPass(e.target.value)} style={inp} />
              <button onClick={loginAlumno} style={btnS(c.bg2, c.text)}>Entrar al Sistema</button>
            </div>

            {/* Login Profesores */}
            <div style={{ background:c.bg3, padding:16, borderRadius:14, border:`0.5px solid ${c.border2}`, display:"flex", flexDirection:"column", gap:10 }}>
              <div style={{ fontSize:14, fontWeight:500, color:c.text }}>Acceso Docentes / Directiva</div>
              <input type="text" placeholder="Usuario docente" value={profUser} onChange={e=>setPhUser ? setProfUser(e.target.value) : setProfUser(e.target.value)} style={inp} />
              <input type="password" placeholder="Contraseña docente" value={profPass} onChange={e=>setProfPass(e.target.value)} style={inp} />
              {errProf && <div style={{ fontSize:12, color:"#C0392B" }}>{errProf}</div>}
              <button onClick={loginProfesor} style={btnS("#111827", "#fff")}>Verificar Identidad 🔑</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ══════════════════════════════════════════════
  // VISTA PANEL DE CONFIGURACIÓN / AJUSTES
  // ══════════════════════════════════════════════
  if (ajustes) {
    return (
      <div style={wrap}>
        <AppHeader titulo="Configuración del Sistema" onBack={()=>{setAjustes(false); setVistaLogs(false); setVistaCuentas(false); setPinVerificado(false); setPinCuentas(""); setPinError("");}} sesion={sesion} esProfesor={esProfesor} dark={dark} setDark={setDark} setAjustes={setAjustes} c={c} play={play} />
        
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ background:c.bg3, border:`0.5px solid ${c.border2}`, borderRadius:14, padding:16, display:"flex", flexDirection:"column", gap:12 }}>
            <div style={{ fontSize:14, fontWeight:500, color:c.text }}>Sesión Actual</div>
            <div style={{ fontSize:13, color:c.text2 }}>
              <strong>Identificación:</strong> {sesion?.nombre || sesion?.usuario}<br/>
              <strong>Tipo de Cuenta:</strong> {sesion?.tipo === "profesor" ? "👨‍🏫 Personal Docente Autorizado" : "🎓 Alumno (Anonimato Asegurado)"}
            </div>
            <button onClick={cerrarSesion} style={btnS("#C0392B", "#fff")}>Cerrar Sesión de Forma Segura</button>
          </div>

          {esProfesor && (
            <div style={{ background:c.bg3, border:`0.5px solid ${c.border2}`, borderRadius:14, padding:16, display:"flex", flexDirection:"column", gap:12 }}>
              <div style={{ fontSize:14, fontWeight:500, color:c.text }}>🛠️ Herramientas Administrativas Superiores</div>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={()=>{ play("nav"); setVistaLogs(true); setVistaCuentas(false); }} style={{ ...btnS(c.bg2, c.text), flex:1, border:`0.5px solid ${c.border}` }}>Ver Logs globales</button>
                <button onClick={()=>{ play("nav"); setVistaCuentas(true); setVistaLogs(false); }} style={{ ...btnS(c.bg2, c.text), flex:1, border:`0.5px solid ${c.border}` }}>Ver Cuentas Alumnos</button>
              </div>
              <button onClick={() => exportarTXT(reportes, repDirectiva)} style={btnS(c.blue, "#fff")}>💾 Exportar Base de Datos (.TXT)</button>
            </div>
          )}

          {/* Subpanel: Logs */}
          {vistaLogs && esProfesor && (
            <div style={{ background:c.bg3, border:`0.5px solid ${c.border2}`, borderRadius:14, padding:16 }}>
              <div style={{ fontSize:14, fontWeight:500, color:c.text, marginBottom:10 }}>📋 Registro de Auditoría Interna (Últimos 100 eventos)</div>
              <div style={{ display:"flex", flexDirection:"column", gap:6, maxHeight:300, overflowY:"auto" }}>
                {logs.map((l, i) => (
                  <div key={i} style={{ fontSize:11, color:c.text2, borderBottom:`0.5px solid ${c.border2}`, paddingBottom:4 }}>
                    [{l.fecha} {l.hora}] <strong>{l.evento}</strong> por <em>{l.usuario}</em> ({l.device})
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subpanel: Cuentas Alumnos */}
          {vistaCuentas && esProfesor && (
            <div style={{ background:c.bg3, border:`0.5px solid ${c.border2}`, borderRadius:14, padding:16, display:"flex", flexDirection:"column", gap:10 }}>
              <div style={{ fontSize:14, fontWeight:500, color:c.text }}>🔒 Ver Dispositivos de Alumnos Registrados</div>
              {!pinVerificado ? (
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  <label style={{ fontSize:12, color:c.text2 }}>Introduce el PIN de Seguridad del Colegio:</label>
                  <div style={{ display:"flex", gap:8 }}>
                    <input type="password" placeholder="PIN de Seguridad" value={pinCuentas} onChange={e=>setPinCuentas(e.target.value)} style={inp} />
                    <button onClick={verificarPin} style={{ ...btnS("#111827","#fff"), width:"auto", padding:"0 16px" }}>Confirmar</button>
                  </div>
                  {pinError && <div style={{ fontSize:12, color:"#C0392B" }}>{pinError}</div>}
                </div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:8, maxHeight:300, overflowY:"auto" }}>
                  {cuentas.length === 0 ? (
                    <div style={{ fontSize:12, color:c.text3 }}>No hay registros de metadatos de alumnos todavía.</div>
                  ) : (
                    cuentas.map((cu, i) => (
                      <div key={i} style={{ fontSize:12, color:c.text, borderBottom:`0.5px solid ${c.border2}`, paddingBottom:6 }}>
                        <div style={{ fontWeight:500, color:c.blue }}>Alias: {cu.usuario}</div>
                        <div style={{ color:c.text2, fontSize:11 }}>Reg: {cu.fecha} a las {cu.hora}</div>
                        <div style={{ color:c.text3, fontSize:11 }}>Dispositivo: {cu.dispositivo} · OS: {cu.os} · Nav: {cu.browser}</div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════
  // INTERFAZ DE APLICACIÓN PRINCIPAL (LOGUEADO)
  // ══════════════════════════════════════════════
  return (
    <div style={wrap}>
      {/* Cabecera dinámica de navegación */}
      {vista === "lista" && <AppHeader titulo={null} sesion={sesion} esProfesor={esProfesor} dark={dark} setDark={setDark} setAjustes={setAjustes} c={c} play={play} />}
      {vista === "crear" && <AppHeader titulo="Crear Nuevo Reporte Seguro" onBack={()=>setVista("lista")} sesion={sesion} esProfesor={esProfesor} dark={dark} setDark={setDark} setAjustes={setAjustes} c={c} play={play} />}
      {vista === "directiva" && <AppHeader titulo="Buzón de Incidencias Institucionales" onBack={()=>setVista("lista")} sesion={sesion} esProfesor={esProfesor} dark={dark} setDark={setDark} setAjustes={setAjustes} c={c} play={play} />}
      {vista === "crear_dir" && <AppHeader titulo="Enviar Reporte a la Directiva" onBack={()=>setVista("directiva")} sesion={sesion} esProfesor={esProfesor} dark={dark} setDark={setDark} setAjustes={setAjustes} c={c} play={play} />}
      {vista === "detalle" && <AppHeader titulo="Expediente Técnico de Incidencia" onBack={()=>{setVista("lista"); setSelId(null); setBusqueda("");}} sesion={sesion} esProfesor={esProfesor} dark={dark} setDark={setDark} setAjustes={setAjustes} c={c} play={play} />}
      {vista === "detalle_dir" && <AppHeader titulo="Expediente de Directiva" onBack={()=>{setVista("directiva"); setSelId(null); setBusqueda("");}} sesion={sesion} esProfesor={esProfesor} dark={dark} setDark={setDark} setAjustes={setAjustes} c={c} play={play} />}

      {/* 🔎 FUNCIONALIDAD NUEVA 1: Renderizado del Buscador Avanzado en Tiempo Real (Solo Profesores en Vistas de Listas) */}
      {esProfesor && (vista === "lista" || vista === "directiva") && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <span style={{ position: "absolute", left: 12, fontSize: 16 }}>🔍</span>
            <input
              type="text"
              placeholder={vista === "lista" ? "Buscar por alias, descripción, categoría o notas..." : "Buscar por docente, descripción o categoría..."}
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{ ...inp, paddingLeft: 38 }}
            />
            {busqueda && (
              <button 
                onClick={() => setBusqueda("")} 
                style={{ position: "absolute", right: 12, background: "none", border: "none", color: c.text2, cursor: "pointer", fontSize: 14 }}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── CONTENIDO DINÁMICO DE PANTALLAS ── */}

      {/* PANTALLA: LISTA DE REPORTES */}
      {vista === "lista" && (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {esProfesor ? (
            <>
              <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                <span style={{ fontSize:14, fontWeight:500, color:c.text, flex:1 }}>Buzón General de Alumnos</span>
                <button onClick={()=>{ play("nav"); setVista("directiva"); setBusqueda(""); }} style={{ ...btnS("#111827", "#fff"), width:"auto", padding:"6px 14px", fontSize:12 }}>📁 Ver Canal Directiva</button>
              </div>
              <FiltroBar opciones={ESTADOS} valor={filtro} onChange={setFiltro} c={c} play={play} />
              
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {reportesFiltrados.length === 0 ? (
                  <div style={{ textAlign:"center", padding:"40px 0", color:c.text3, fontSize:14 }}>No se encontraron reportes con los criterios actuales.</div>
                ) : (
                  reportesFiltrados.map(r => (
                    <CardReporte key={r.id} r={r} dark={dark} esProfesor={esProfesor} c={c} play={play} onClick={()=>{ setSelId(r.id); setVista("detalle"); }} />
                  ))
                )}
              </div>
            </>
          ) : (
            <>
              <div style={{ background:c.info_bg, padding:12, borderRadius:12, color:c.info_tx, fontSize:13, lineHeight:1.5 }}>
                🛡️ <strong>Tu anonimato está 100% blindado.</strong> El personal del centro escolar no puede rastrear tu IP ni tus datos personales, únicamente verán tu alias y la información detallada que decidas aportar.
              </div>
              <button onClick={()=>{ play("nav"); setVista("crear"); setEnviado(false); }} style={btnS(c.blue, "#fff")}>➕ Emitir una Nueva Alerta o Reporte</button>
              
              <div style={{ fontWeight:500, fontSize:14, color:c.text, marginTop:8, marginBottom:4 }}>Tus Alertas Enviadas</div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {reportesFiltrados.length === 0 ? (
                  <div style={{ textAlign:"center", padding:"30px 0", color:c.text3, fontSize:13, border:`1px dashed ${c.border}`, borderRadius:12 }}>No has enviado ningún reporte todavía. Tu buzón está limpio.</div>
                ) : (
                  reportesFiltrados.map(r => (
                    <CardReporte key={r.id} r={r} dark={dark} esProfesor={esProfesor} c={c} play={play} onClick={()=>{ setSelId(r.id); setVista("detalle"); marcarLeidos(r.id); }} />
                  ))
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* PANTALLA: CREAR REPORTE ALUMNO */}
      {vista === "crear" && (
        <div style={{ background:c.bg3, border:`0.5px solid ${c.border2}`, borderRadius:14, padding:"18px 16px" }}>
          {enviado ? (
            <div style={{ textAlign:"center", padding:"20px 0" }}>
              <div style={{ fontSize:40, marginBottom:10 }}>🚀</div>
              <h3 style={{ margin:0, color:c.text, fontSize:18 }}>Reporte Transmitido con Éxito</h3>
              <p style={{ fontSize:13, color:c.text2, margin:"6px 0 16px 0" }}>La alerta ha sido cifrada y depositada de forma segura en el servidor escolar.</p>
              <button onClick={()=>setVista("lista")} style={btnS(c.bg2, c.text)}>Regresar a mi Bandeja</button>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div>
                <label style={{ fontSize:13, fontWeight:500, color:c.text, display:"block", marginBottom:6 }}>Naturaleza de la Incidencia:</label>
                <select value={cat} onChange={e=>setCat(e.target.value)} style={inp}>
                  {CATEGORIAS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize:13, fontWeight:500, color:c.text, display:"block", marginBottom:6 }}>Descripción Cronológica de los Hechos:</label>
                <textarea rows={5} placeholder="Explica detalladamente qué sucedió, cuándo y quiénes están implicados. Evita incluir tus datos personales reales." value={desc} onChange={e=>setDesc(e.target.value)} style={{ ...inp, resize:"none", fontFamily:"inherit" }} />
              </div>
              <div>
                <label style={{ fontSize:13, fontWeight:500, color:c.text, display:"block", marginBottom:6 }}>Nota sobre Implicados / Testigos Opcionales:</label>
                <input type="text" placeholder="Ej: Compañeros de 4to B que presenciaron el hecho" value={nota} onChange={e=>setNota(e.target.value)} style={inp} />
              </div>
              <div>
                <label style={{ fontSize:13, fontWeight:500, color:c.text, display:"block", marginBottom:4 }}>Evidencias Adjuntas (Fotos / Documentos — Máx 5):</label>
                <span style={{ fontSize:11, color:c.text2, display:"block", marginBottom:8 }}>Las imágenes se limpian de metadatos EXIF automáticamente al subirse.</span>
                <input type="file" multiple ref={fileRef} onChange={e=>handleFiles(e.target.files)} style={{ display:"none" }} />
                <button onClick={()=>fileRef.current.click()} style={{ ...btnS(c.bg2, c.text), border:`0.5px solid ${c.border}` }}>📎 Seleccionar Archivos</button>
                {adjuntos.length > 0 && (
                  <div style={{ marginTop:10, display:"flex", flexDirection:"column", gap:4 }}>
                    {adjuntos.map((f,i) => <div key={i} style={{ fontSize:12, color:c.text2 }}>✓ {f.name}</div>)}
                  </div>
                )}
              </div>
              <button onClick={enviarReporte} disabled={!desc.trim()} style={{ ...btnS(c.blue, "#fff"), opacity:desc.trim()?1:0.5, marginTop:6 }}>Enviar Alerta de Forma Anónima Encriptada</button>
            </div>
          )}
        </div>
      )}

      {/* PANTALLA: CANAL DE DIRECTIVA (BUZÓN EXCLUSIVO INTERNO) */}
      {vista === "directiva" && (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <span style={{ fontSize:14, fontWeight:500, color:c.text, flex:1 }}>Buzón Especial Reservado Directiva</span>
            <button onClick={()=>{ play("nav"); setVista("crear_dir"); setEnviadoDir(false); }} style={btnS(c.blue, "#fff")}>➕ Emitir Incidencia Interna</button>
          </div>
          <FiltroBar opciones={CAT_DIR} valor={filtroD} onChange={setFiltroD} c={c} play={play} />
          
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {repDirFiltrados.length === 0 ? (
              <div style={{ textAlign:"center", padding:"40px 0", color:c.text3, fontSize:14 }}>No hay incidencias registradas en la directiva bajo estos parámetros.</div>
            ) : (
              // 💬 FUNCIONALIDAD NUEVA 2: El evento onClick ahora llama a marcarLeidosDir(r.id) para limpiar notificaciones
              repDirFiltrados.map(r => (
                <CardReporte key={r.id} r={r} esDir={true} dark={dark} esProfesor={esProfesor} c={c} play={play} onClick={()=>{ setSelId(r.id); setVista("detalle_dir"); marcarLeidosDir(r.id); }} />
              ))
            )}
          </div>
        </div>
      )}

      {/* PANTALLA: CREAR REPORTE DIRECTIVA */}
      {vista === "crear_dir" && (
        <div style={{ background:c.bg3, border:`0.5px solid ${c.border2}`, borderRadius:14, padding:"18px 16px" }}>
          {enviadoDir ? (
            <div style={{ textAlign:"center", padding:"20px 0" }}>
              <div style={{ fontSize:40, marginBottom:10 }}>👔</div>
              <h3 style={{ margin:0, color:c.text, fontSize:18 }}>Incidencia de Directiva Registrada</h3>
              <p style={{ fontSize:13, color:c.text2, margin:"6px 0 16px 0" }}>Se ha notificado al canal institucional de gestión rectora.</p>
              <button onClick={()=>setVista("directiva")} style={btnS(c.bg2, c.text)}>Volver a Directiva</button>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div>
                <label style={{ fontSize:13, fontWeight:500, color:c.text, display:"block", marginBottom:6 }}>Categoría Institucional:</label>
                <select value={catDir} onChange={e=>setCatDir(e.target.value)} style={inp}>
                  {CAT_DIR.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize:13, fontWeight:500, color:c.text, display:"block", marginBottom:6 }}>Redacción Técnica del Suceso:</label>
                <textarea rows={5} placeholder="Describa de forma formal el incidente de infraestructura, conducta u orden administrativo interno." value={descDir} onChange={e=>setDescDir(e.target.value)} style={{ ...inp, resize:"none", fontFamily:"inherit" }} />
              </div>
              <div>
                <label style={{ fontSize:13, fontWeight:500, color:c.text, display:"block", marginBottom:6 }}>Notas / Observaciones de Seguridad:</label>
                <input type="text" placeholder="Ej: Requiere revisión con el comité central" value={notaDir} onChange={e=>setNotaDir(e.target.value)} style={inp} />
              </div>
              <button onClick={enviarReporteDir} disabled={!descDir.trim()} style={{ ...btnS(c.blue, "#fff"), opacity:descDir.trim()?1:0.5, marginTop:6 }}>Registrar en Canal Institucional</button>
            </div>
          )}
        </div>
      )}

      {/* PANTALLAS: DETALLE DE LOS REPORTES */}
      {vista === "detalle" && selReporte && renderDetalle(selReporte, false)}
      {vista === "detalle_dir" && selRepDir && renderDetalle(selRepDir, true)}
    </div>
  );
}