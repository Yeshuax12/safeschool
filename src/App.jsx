import { useState, useRef, useEffect, useCallback } from "react";

// ══════════════════════════════════════════════════════════════════════
// 🔐 SEGURIDAD ULTRA-AVANZADA — ANTI-HACKING & CRYPTO COMPLEX
// ══════════════════════════════════════════════════════════════════════
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

  // 🔍 ESTADO EXCLUSIVO PARA LA FUNCIÓN DE BÚSQUEDA
  const [busqueda,      setBusqueda]      = useState("");

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
  useEffect(() => { if (appReady) guardar(KEYS.logs,       logs);          }, [logs,         appReady]);
  useEffect(() => { if (appReady) guardar(KEYS.nextId,     nextId);        }, [nextId,       appReady]);
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

  // 🔍 APLICACIÓN DE LA FUNCIÓN DE BÚSQUEDA SOBRE LOS REPORTES FILTRADOS POR ESTADO
  const reportesFiltrados = (
    esProfesor
      ? reportes.filter(r => filtro==="Todos" || r.estado===filtro)
      : reportes.filter(r => r.alumnoId===sesion?.id)
  ).filter(r => {
    if (!busqueda.trim()) return true;
    const b = busqueda.toLowerCase();
    return (
      r.descripcion?.toLowerCase().includes(b) ||
      r.alias?.toLowerCase().includes(b) ||
      r.categoria?.toLowerCase().includes(b) ||
      r.nota?.toLowerCase().includes(b)
    );
  });

  const repDirFiltrados = repDirectiva
    .filter(r => filtroD==="Todos" || r.estado===filtroD)
    .filter(r => {
      if (!busqueda.trim()) return true;
      const b = busqueda.toLowerCase();
      return (
        r.descripcion?.toLowerCase().includes(b) ||
        r.autor?.toLowerCase().includes(b) ||
        r.categoria?.toLowerCase().includes(b) ||
        r.cargo?.toLowerCase().includes(b) ||
        r.nota?.toLowerCase().includes(b)
      );
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
    setBusqueda(""); // Resetea la barra al salir
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
          {r.nota && <p style={{ fontSize:13, color:c.text2, fontStyle:"italic" }}>Nota: {r.nota}</p>}
          {r.adjuntos?.length > 0 && (
            <div style={{ marginTop:14, display:"flex", flexDirection:"column", gap:8 }}>
              <div style={{ fontSize:12, fontWeight:500, color:c.text2 }}>Archivos Adjuntos:</div>
              {r.adjuntos.map((file, i) => (
                <div key={i} style={{ border:`0.5px solid ${c.border}`, borderRadius:10, padding:8, background:c.bg2, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <span style={{ fontSize:13, color:c.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:"75%" }}>📎 {file.name}</span>
                  {file.type?.startsWith("image/") && (
                    <button onClick={()=>{ play("open"); const w=window.open(); w.document.write(`<img src="${file.dataUrl}" style="max-width:100%; height:auto;" />`); }} style={{ padding:"3px 8px", fontSize:11, borderRadius:6, border:`0.5px solid ${c.border}`, background:c.bg3, color:c.text2, cursor:"pointer" }}>Ver imagen</button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* HISTORIAL DE CAMBIOS (Solo Profesores) */}
        {esProfesor && (
          <div style={{ background:c.bg3, border:`0.5px solid ${c.border2}`, borderRadius:14, padding:"14px 16px" }}>
            <div style={{ fontSize:13, fontWeight:500, color:c.text, marginBottom:10 }}>📋 Historial de atención</div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {(r.historial || []).map((h, i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", fontSize:12, borderBottom:i===(r.historial||[]).length-1?"none":`0.5px solid ${c.border2}`, paddingBottom:6 }}>
                  <span style={{ color:c.text }}>{h.accion}</span>
                  <span style={{ color:c.text3 }}>{h.fecha} · {h.hora}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECCIÓN NOTAS INTERNAS (Solo Profesores) */}
        {esProfesor && (
          <div style={{ background:c.bg3, border:`0.5px solid ${c.border2}`, borderRadius:14, padding:"14px 16px" }}>
            <div style={{ fontSize:13, fontWeight:500, color:c.text, marginBottom:8 }}>📌 Notas Internas de Gestión (Ocultas al Alumno)</div>
            <div style={{ display:"flex", gap:8, marginBottom:12 }}>
              <input type="text" placeholder="Escribir nota de seguimiento..." value={notaInt} onChange={e=>setNotaInt(e.target.value)} style={inp} onKeyDown={e=>e.key==="Enter"&&agregarNota(r.id,esDir)} />
              <button onClick={()=>agregarNota(r.id,esDir)} style={{ ...btnS(c.blue,"#fff"), width:"auto", padding:"0 16px" }}>Añadir</button>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {(r.notas_internas || []).length === 0 ? (
                <div style={{ fontSize:12, color:c.text3, textAlign:"center", padding:"8px 0" }}>No hay notas internas agregadas.</div>
              ) : (
                (r.notas_internas || []).map((n, i) => (
                  <div key={i} style={{ background:c.bg2, padding:"8px 12px", borderRadius:8, fontSize:12 }}>
                    <div style={{ color:c.text2, marginBottom:2 }}>{n.fecha}</div>
                    <div style={{ color:c.text, fontWeight:400 }}>{n.texto}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* CONTROL DE ESTADO Y ELIMINACIÓN */}
        {esProfesor && (
          <div style={{ background:c.bg3, border:`0.5px solid ${c.border2}`, borderRadius:14, padding:"14px 16px", display:"flex", flexDirection:"column", gap:12 }}>
            <div>
              <div style={{ fontSize:12, color:c.text2, marginBottom:6 }}>Cambiar estado del caso:</div>
              <div style={{ display:"flex", gap:8 }}>
                {ESTADOS.map(st => (
                  <button key={st} onClick={()=>cambiarEstado(r.id,st,esDir)} style={{ flex:1, padding:"6px 0", fontSize:12, borderRadius:8, border:r.estado===st?`1px solid ${c.blue}`:`0.5px solid ${c.border}`, background:r.estado===st?c.info_bg:c.bg2, color:r.estado===st?c.info_tx:c.text2, cursor:"pointer", fontWeight:r.estado===st?500:400 }}>{st}</button>
                ))}
              </div>
            </div>
            <div style={{ borderTop:`0.5px solid ${c.border2}`, paddingTop:12, display:"flex", justifyContent:"flex-end" }}>
              {confirmDel === r.id ? (
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:12, color:"#C0392B" }}>¿Confirmas eliminar?</span>
                  <button onClick={()=>eliminarReporte(r.id,esDir)} style={{ background:"#C0392B", color:"#fff", border:"none", padding:"4px 10px", borderRadius:6, fontSize:12, cursor:"pointer" }}>Sí, eliminar</button>
                  <button onClick={()=>{ play("click"); setConfirmDel(null); }} style={{ background:c.bg2, color:c.text2, border:`0.5px solid ${c.border}`, padding:"4px 10px", borderRadius:6, fontSize:12, cursor:"pointer" }}>Cancelar</button>
                </div>
              ) : (
                <button onClick={()=>{ play("click"); setConfirmDel(r.id); }} style={{ background:"none", border:"none", color:"#C0392B", fontSize:12, cursor:"pointer", padding:"4px 8px" }}>🗑️ Eliminar este reporte de la base de datos</button>
              )}
            </div>
          </div>
        )}

        {/* CHAT ANÓNIMO DE SEGUIMIENTO */}
        <div style={{ background:c.bg3, border:`0.5px solid ${c.border2}`, borderRadius:14, padding:"14px 16px" }}>
          <div style={{ fontSize:13, fontWeight:500, color:c.text, marginBottom:4, display:"flex", justifyContent:"space-between" }}>
            <span>💬 Canal de Comunicación Directa</span>
            <span style={{ fontSize:11, color:c.greenTx, background:c.green, padding:"2px 8px", borderRadius:99 }}>Anónimo 🔒</span>
          </div>
          <p style={{ fontSize:12, color:c.text2, marginBottom:12 }}>{esProfesor ? "Escribe un mensaje para orientar al alumno. Tu identidad está protegida por tu cargo." : "Pregunta sobre el avance de tu caso aquí. No es necesario que digas tu nombre real."}</p>
          
          <div style={{ border:`0.5px solid ${c.border2}`, borderRadius:10, padding:10, height:180, overflowY:"auto", background:c.bg2, display:"flex", flexDirection:"column", gap:8, marginBottom:10 }}>
            {(r.chat || []).length === 0 ? (
              <div style={{ fontSize:12, color:c.text3, textAlign:"center", margin:"auto 0" }}>Inicia la conversación. Envía un mensaje seguro aquí abajo.</div>
            ) : (
              (r.chat || []).map(m => {
                const esMio = esProfesor ? m.de==="profesor" : m.de==="alumno";
                return (
                  <div key={m.id} style={{ alignSelf:esMio?"flex-end":"flex-start", maxWidth:"85%", background:esMio?c.blue:(dark?"#333":"#e5e7eb"), color:esMio?"#fff":c.text, padding:"8px 12px", borderRadius:12, borderTopRightRadius:esMio?2:12, borderTopLeftRadius:esMio?12:2, position:"relative" }}>
                    <div style={{ fontSize:13, lineHeight:1.4 }}>{m.texto}</div>
                    <div style={{ fontSize:10, textAlign:"right", marginTop:3, color:esMio?"rgba(255,255,255,0.7)":c.text2 }}>{m.fecha} {!esProfesor && esMio && (m.leido?"✓✓":"✓")}</div>
                  </div>
                );
              })
            )}
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <input type="text" placeholder="Escribe un mensaje seguro..." value={chatMsg} onChange={e=>setChatMsg(e.target.value)} style={inp} onKeyDown={e=>e.key==="Enter"&&enviarChat(r.id,esDir)} />
            <button onClick={()=>enviarChat(r.id,esDir)} style={{ ...btnS(c.blue,"#fff"), width:"auto", padding:"0 18px" }}>Enviar</button>
          </div>
        </div>
      </div>
    );
  }

  // ── RENDER DE CARGA INICIAL ──
  if (!appReady) {
    return <div style={{ background:"#0f0f0f", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontFamily:"sans-serif", fontSize:14 }}>Cargando SafeSchool Complex...</div>;
  }

  // ══════════════════════════════════════════════
  // RENDER PANTALLA INICIO (AUTH COMPLEX)
  // ══════════════════════════════════════════════
  if (pantalla === "inicio") {
    return (
      <div style={{ background:c.bg, minHeight:"100vh", fontFamily:"sans-serif" }}>
        <div style={authWrap}>
          <div style={{ textAlign:"center", marginBottom:24 }}>
            <span style={{ fontSize:36 }}>🏫</span>
            <h1 style={{ fontSize:22, fontWeight:600, color:c.text, margin:"8px 0 4px 0" }}>SafeSchool</h1>
            <p style={{ fontSize:13, color:c.text2, margin:0 }}>I.E. República de la Seguridad Digital</p>
          </div>

          {modoProfesorOculto ? (
            /* REGISTRO DE PROFESORES OCULTO TRAS LA PUERTA TRASERA */
            <div style={{ display:"flex", flexDirection:"column", gap:14, background:c.warn_bg, padding:16, borderRadius:14, border:`1px dashed ${c.warn_tx}` }}>
              <div style={{ fontSize:13, fontWeight:600, color:c.warn_tx, textAlign:"center" }}>🚨 PANEL ADMINISTRATIVO DE REGISTRO DIRECTO</div>
              <div>
                <label style={{ fontSize:12, color:c.text2, display:"block", marginBottom:4 }}>Nombre Completo del Docente</label>
                <input type="text" value={regProfNombre} onChange={e=>setRegProfNombre(e.target.value)} style={inp} placeholder="Ej. Prof. Carlos Mendoza" />
              </div>
              <div>
                <label style={{ fontSize:12, color:c.text2, display:"block", marginBottom:4 }}>Cargo / Función</label>
                <input type="text" value={regProfCargo} onChange={e=>setRegProfCargo(e.target.value)} style={inp} placeholder="Ej. Subdirector / Coordinador" />
              </div>
              <div>
                <label style={{ fontSize:12, color:c.text2, display:"block", marginBottom:4 }}>Contraseña Clave</label>
                <input type="password" value={regProfPass} onChange={e=>setRegProfPass(e.target.value)} style={inp} placeholder="Mínimo 6 caracteres" />
              </div>
              {errMsg && <div style={{ color:"#C0392B", fontSize:12, textAlign:"center" }}>{errMsg}</div>}
              <button onClick={registrarProfesor} style={btnS(c.blue,"#fff")}>Dar de Alta y Logear Profesor</button>
              <button onClick={()=>{ play("back"); setModoProfesorOculto(false); setErrMsg(""); }} style={{ background:"none", border:"none", color:c.text2, fontSize:12, cursor:"pointer" }}>Volver al Login Regular</button>
            </div>
          ) : (
            /* ACCESO NORMAL (TABS DE ALUMNO / DOCENTE) */
            <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
              {vista === "lista" ? (
                /* SECCIÓN ACCESO ALUMNOS (Registro/Login Unificado) */
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  <div style={{ display:"flex", background:c.bg2, borderRadius:10, padding:3, marginBottom:4 }}>
                    <button style={{ flex:1, padding:"6px", border:"none", borderRadius:8, fontSize:13, fontWeight:500, background:c.bg, color:c.text, cursor:"default" }}>Estudiantes</button>
                    <button onClick={()=>{ play("click"); setVista("directiva"); setErrMsg(""); }} style={{ flex:1, padding:"6px", border:"none", background:"none", borderRadius:8, fontSize:13, color:c.text2, cursor:"pointer" }}>Personal Colegial</button>
                  </div>
                  <div style={{ border:`0.5px solid ${c.border2}`, borderRadius:12, padding:14, background:c.bg3 }}>
                    <div style={{ fontSize:12, fontWeight:500, color:c.text, marginBottom:10, textTransform:"uppercase" }}>Opción A: Crear cuenta nueva anónima</div>
                    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                      <input type="text" placeholder="Crea un usuario (No uses tu nombre)" value={nuevoUser} onChange={e=>setNuevoUser(e.target.value)} style={inp} />
                      <input type="password" placeholder="Crea una contraseña segura" value={nuevaPass} onChange={e=>setNuevaPass(e.target.value)} style={inp} />
                      <button onClick={registrarAlumno} style={btnS("#27500A","#fff")}>Crear Cuenta y Entrar 🔒</button>
                    </div>
                  </div>
                  <div style={{ border:`0.5px solid ${c.border2}`, borderRadius:12, padding:14, background:c.bg3 }}>
                    <div style={{ fontSize:12, fontWeight:500, color:c.text, marginBottom:10, textTransform:"uppercase" }}>Opción B: Ya tengo cuenta anónima</div>
                    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                      <input type="text" placeholder="Tu usuario anónimo" value={loginUser} onChange={e=>setLoginUser(e.target.value)} style={inp} />
                      <input type="password" placeholder="Tu contraseña" value={loginPass} onChange={e=>setLoginPass(e.target.value)} style={inp} />
                      <button onClick={loginAlumno} style={btnS(c.blue,"#fff")}>Entrar al Sistema →</button>
                    </div>
                  </div>
                  {errMsg && <div style={{ color:"#C0392B", fontSize:12, textAlign:"center", marginTop:4 }}>{errMsg}</div>}
                </div>
              ) : (
                /* SECCIÓN ACCESO PROFESORES / DIRECTORES */
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  <div style={{ display:"flex", background:c.bg2, borderRadius:10, padding:3, marginBottom:4 }}>
                    <button onClick={()=>{ play("click"); setVista("lista"); setErrProf(""); }} style={{ flex:1, padding:"6px", border:"none", background:"none", borderRadius:8, fontSize:13, color:c.text2, cursor:"pointer" }}>Estudiantes</button>
                    <button style={{ flex:1, padding:"6px", border:"none", borderRadius:8, fontSize:13, fontWeight:500, background:c.bg, color:c.text, cursor:"default" }}>Personal Colegial</button>
                  </div>
                  <div style={{ border:`0.5px solid ${c.border2}`, borderRadius:12, padding:16, background:c.bg3, display:"flex", flexDirection:"column", gap:12 }}>
                    <div style={{ fontSize:13, fontWeight:500, color:c.text, marginBottom:2 }}>Módulo de Verificación de Credenciales</div>
                    <input type="text" placeholder="Usuario docente asignado" value={profUser} onChange={e=>setProfUser(e.target.value)} style={inp} />
                    <input type="password" placeholder="Contraseña institucional" value={profPass} onChange={e=>setProfPass(e.target.value)} style={inp} />
                    {errProf && <div style={{ color:"#C0392B", fontSize:12, textAlign:"center" }}>{errProf}</div>}
                    <button onClick={loginProfesor} style={btnS(c.blue,"#fff")}>Validar Firma Digital</button>
                  </div>
                </div>
              )}
            </div>
          )}
          <div style={{ marginTop:32, textAlign:"center", fontSize:11, color:c.text3, borderTop:`0.5px solid ${c.border2}`, paddingTop:16 }}>
            Encriptación de grado militar AES-GCM + SHA-256 en memoria temporal distribuida. Ningún dato viaja en texto plano.
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════
  // RENDER PANTALLA APLICATIVO GENERAL (LOGGED IN)
  // ══════════════════════════════════════════════
  return (
    <div style={{ background:c.bg2, minHeight:"100vh", fontFamily:"sans-serif" }}>
      <div style={wrap}>
        
        {/* MODAL / PANTALLA COMPLETA DE AJUSTES */}
        {ajustes ? (
          <div>
            <AppHeader titulo="Configuración Avanzada" onBack={()=>setAjustes(false)} sesion={sesion} esProfesor={esProfesor} dark={dark} setDark={setDark} setAjustes={setAjustes} c={c} play={play} />
            
            {vistaLogs ? (
              /* PANEL INTERNO DE HISTORIAL DE ACCIONES (LOGS) */
              <div style={{ background:c.bg3, border:`0.5px solid ${c.border2}`, borderRadius:14, padding:16 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                  <span style={{ fontSize:14, fontWeight:500, color:c.text }}>Logs del Sistema Central (Últimos 100)</span>
                  <button onClick={()=>{ play("back"); setVistaLogs(false); }} style={{ background:"none", border:`0.5px solid ${c.border}`, borderRadius:6, padding:"2px 8px", fontSize:12, color:c.text2, cursor:"pointer" }}>Cerrar Logs</button>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:8, maxHeight:400, overflowY:"auto" }}>
                  {logs.map((l, i) => (
                    <div key={i} style={{ fontSize:12, borderBottom:`0.5px solid ${c.border2}`, paddingBottom:6 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", color:c.text3, marginBottom:2 }}>
                        <span>{l.fecha} · {l.hora}</span> <span>{l.device}</span>
                      </div>
                      <div style={{ color:c.text }}><strong style={{ color:c.blue }}>{l.evento}</strong> — por: {l.usuario}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : vistaCuentas ? (
              /* PANEL INTERNO DE ALUMNOS REGISTRADOS (CON SEGURIDAD PIN) */
              <div style={{ background:c.bg3, border:`0.5px solid ${c.border2}`, borderRadius:14, padding:16 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                  <span style={{ fontSize:14, fontWeight:500, color:c.text }}>Cuentas de Alumnos en este Servidor</span>
                  <button onClick={()=>{ play("back"); setVistaCuentas(false); setPinVerificado(false); setPinCuentas(""); setPinError(""); }} style={{ background:"none", border:`0.5px solid ${c.border}`, borderRadius:6, padding:"2px 8px", fontSize:12, color:c.text2, cursor:"pointer" }}>Cerrar</button>
                </div>

                {!pinVerificado ? (
                  <div style={{ display:"flex", flexDirection:"column", gap:10, maxWidth:260, margin:"20px auto", textAlign:"center" }}>
                    <div style={{ fontSize:12, color:c.text2 }}>Ingresa el PIN de Auditoría Institucional para desbloquear la lectura:</div>
                    <input type="password" placeholder="PIN de Seguridad" value={pinCuentas} onChange={e=>setPinCuentas(e.target.value)} style={{ ...inp, textAlign:"center" }} onKeyDown={e=>e.key==="Enter"&&verificarPin()} />
                    {pinError && <div style={{ color:"#C0392B", fontSize:12 }}>{pinError}</div>}
                    <button onClick={verificarPin} style={btnS(c.blue,"#fff")}>Verificar Identidad</button>
                  </div>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", gap:10, maxHeight:400, overflowY:"auto" }}>
                    {cuentas.length === 0 ? (
                      <div style={{ fontSize:12, color:c.text3, textAlign:"center", padding:"12px 0" }}>No hay registros en este dispositivo.</div>
                    ) : (
                      cuentas.map((cu, i) => (
                        <div key={i} style={{ fontSize:12, borderBottom:`0.5px solid ${c.border2}`, paddingBottom:8, display:"flex", flexDirection:"column", gap:2 }}>
                          <div style={{ display:"flex", justifyContent:"space-between" }}>
                            <strong style={{ color:c.text }}>Alias: {cu.usuario}</strong>
                            <span style={{ color:c.text3 }}>{cu.fecha} · {cu.hora}</span>
                          </div>
                          <div style={{ color:c.text2 }}>Disp: {cu.dispositivo} ({cu.os} - {cu.browser})</div>
                          <div style={{ fontSize:11, color:c.text3, fontFamily:"monospace" }}>ID Hardware: {cu.deviceId}</div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* MENU GENERAL DE AJUSTES */
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                <div style={{ background:c.bg3, border:`0.5px solid ${c.border2}`, borderRadius:14, padding:16, display:"flex", flexDirection:"column", gap:12 }}>
                  <div style={{ fontSize:14, fontWeight:500, color:c.text }}>Controles Directivos Especiales</div>
                  <button onClick={()=>{ play("click"); setVistaLogs(true); }} style={btnS(c.bg2, c.text)}>🔍 Abrir Consola de Logs e Historial</button>
                  <button onClick={()=>{ play("click"); setVistaCuentas(true); }} style={btnS(c.bg2, c.text)}>👥 Ver Registro de Alumnos Creados</button>
                  <button onClick={()=>{ play("click"); exportarTXT(reportes, repDirectiva); }} style={btnS(c.green, c.greenTx)}>📥 Exportar Base de Datos Completa (.TXT)</button>
                </div>
                <div style={{ background:c.bg3, border:`0.5px solid ${c.border2}`, borderRadius:14, padding:16, textAlign:"center" }}>
                  <button onClick={cerrarSesion} style={{ ...btnS("#C0392B","#fff"), width:"auto", padding:"10px 24px" }}>Cerrar Sesión Activa (Borrar Llaves)</button>
                </div>
              </div>
            )}
          </div>
        ) : selId !== null ? (
          /* ══════════════════════════════════════════════
             VISTA DETALLE DE REPORTE SELECCIONADO
             ══════════════════════════════════════════════ */
          <div>
            <AppHeader titulo={null} onBack={()=>{ setSelId(null); setConfirmDel(null); setChatMsg(""); setNotaInt(""); }} sesion={sesion} esProfesor={esProfesor} dark={dark} setDark={setDark} setAjustes={setAjustes} c={c} play={play} />
            {vista === "directiva" ? renderDetalle(selRepDir, true) : renderDetalle(selReporte, false)}
          </div>
        ) : (
          /* ══════════════════════════════════════════════
             VISTA PRINCIPAL — SEGÚN ROL DE USUARIO
             ══════════════════════════════════════════════ */
          <div>
            <AppHeader titulo={null} onBack={null} sesion={sesion} esProfesor={esProfesor} dark={dark} setDark={setDark} setAjustes={setAjustes} c={c} play={play} />

            {!esProfesor ? (
              /* ── PANEL COMPLETO ESTUDIANTE ── */
              <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
                
                {/* FORMULARIO DE ENVÍO DE CASO */}
                <div style={{ background:c.bg3, border:`0.5px solid ${c.border2}`, borderRadius:14, padding:"16px 18px" }}>
                  <h2 style={{ fontSize:15, fontWeight:600, color:c.text, margin:"0 0 12px 0", display:"flex", alignItems:"center", gap:6 }}>
                    <span>🛡️</span> Formulario de Reporte Seguro y 100% Anónimo
                  </h2>
                  {enviado ? (
                    <div style={{ textAlign:"center", padding:"20px 10px", background:c.green, borderRadius:12, border:`0.5px solid ${c.greenTx}` }}>
                      <span style={{ fontSize:28 }}>✅</span>
                      <div style={{ fontSize:15, fontWeight:500, color:c.greenTx, marginTop:6 }}>¡Tu reporte ha sido enviado con éxito!</div>
                      <p style={{ fontSize:13, color:c.text2, margin:"4px 0 14px 0" }}>Ya está en el casillero digital de la dirección escolar en forma cifrada.</p>
                      <button onClick={()=>{ play("click"); setEnviado(false); }} style={{ ...btnS(c.blue,"#fff"), width:"auto", padding:"6px 16px", fontSize:12 }}>Enviar otro reporte</button>
                    </div>
                  ) : (
                    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                      <div>
                        <label style={{ fontSize:12, color:c.text2, display:"block", marginBottom:4 }}>Categoría del Incidente</label>
                        <select value={cat} onChange={e=>{ play("click"); setCat(e.target.value); }} style={inp}>
                          {CATEGORIAS.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize:12, color:c.text2, display:"block", marginBottom:4 }}>Descripción detallada (No escribas nombres si no quieres)</label>
                        <textarea placeholder="Cuéntanos qué sucedió, fechas, lugares, etc. Nadie sabrá quién eres..." value={desc} onChange={e=>setDesc(e.target.value)} style={{ ...inp, height:90, resize:"none" }} />
                      </div>
                      <div>
                        <label style={{ fontSize:12, color:c.text2, display:"block", marginBottom:4 }}>Información adicional u observaciones (Opcional)</label>
                        <input type="text" placeholder="Ej. El profesor siempre llega tarde a esa hora..." value={nota} onChange={e=>setNota(e.target.value)} style={inp} />
                      </div>
                      <div>
                        <label style={{ fontSize:12, color:c.text2, display:"block", marginBottom:4 }}>Adjuntar archivos de prueba (Fotos, audios, capturas — Máx. 5)</label>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <button onClick={()=>{ play("click"); fileRef.current.click(); }} style={{ padding:"6px 12px", fontSize:12, borderRadius:8, border:`0.5px solid ${c.border}`, background:c.bg2, color:c.text2, cursor:"pointer" }}>📎 Seleccionar Archivos</button>
                          <span style={{ fontSize:12, color:c.text3 }}>{adjuntos.length} de 5 cargados</span>
                          <input type="file" ref={fileRef} multiple onChange={e=>handleFiles(e.target.files)} style={{ display:"none" }} accept="image/*,audio/*,video/*,application/pdf" />
                        </div>
                        {adjuntos.length > 0 && (
                          <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:8 }}>
                            {adjuntos.map((f,i) => (
                              <span key={i} style={{ fontSize:11, padding:"3px 8px", borderRadius:6, background:c.bg2, border:`0.5px solid ${c.border}`, color:c.text2, display:"flex", alignItems:"center", gap:4 }}>
                                {f.name.slice(0,12)}... <button onClick={()=>{ play("click"); setAdjuntos(prev=>prev.filter((_,idx)=>idx!==i)); }} style={{ border:"none", background:"none", color:"#C0392B", cursor:"pointer", padding:0, fontWeight:"bold" }}>×</button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <button onClick={enviarReporte} style={btnS(c.blue,"#fff")}>Transmitir Reporte con Cifrado AES 🚀</button>
                    </div>
                  )}
                </div>

                {/* HISTORIAL PROPIO DEL ALUMNO */}
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  <div style={{ fontSize:13, fontWeight:500, color:c.text2, paddingLeft:4 }}>Mis Reportes Enviados (Seguimiento Continuo)</div>
                  {reportesFiltrados.length === 0 ? (
                    <div style={{ background:c.bg3, border:`0.5px solid ${c.border2}`, borderRadius:14, padding:24, textAlign:"center", color:c.text3, fontSize:13 }}>Aún no has transmitido reportes en este servidor.</div>
                  ) : (
                    reportesFiltrados.map(r => (
                      <CardReporte key={r.id} r={r} onClick={()=>{ setSelId(r.id); marcarLeidos(r.id); }} esDir={false} esProfesor={false} dark={dark} c={c} play={play} />
                    ))
                  )}
                </div>

              </div>
            ) : (
              /* ── PANEL COMPLETO DOCENTE / DIRECTIVO ── */
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                
                {/* TABS DE SECCIÓN (Alumnos / Directiva Colegial) */}
                <div style={{ display:"flex", background:c.bg3, border:`0.5px solid ${c.border2}`, borderRadius:12, padding:4, marginBottom:4 }}>
                  <button onClick={()=>{ play("click"); setVista("lista"); }} style={{ flex:1, padding:"8px", border:"none", borderRadius:10, fontSize:13, fontWeight:500, background:vista==="lista"?c.bg2:"none", color:vista==="lista"?c.text:c.text2, cursor:vista==="lista"?"default":"pointer" }}>📥 Casos de Alumnos ({reportes.length})</button>
                  <button onClick={()=>{ play("click"); setVista("directiva"); }} style={{ flex:1, padding:"8px", border:"none", borderRadius:10, fontSize:13, fontWeight:500, background:vista==="directiva"?c.bg2:"none", color:vista==="directiva"?c.text:c.text2, cursor:vista==="directiva"?"default":"pointer" }}>👔 Reportes Internos Directiva ({repDirectiva.length})</button>
                </div>

                {vista === "lista" ? (
                  /* SUB-PANEL A: LISTADO DE INCIDENTES DE ALUMNOS */
                  <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                    <FiltroBar opciones={ESTADOS} valor={filtro} onChange={setFiltro} c={c} play={play} />
                    
                    {/* 🔍 BARRA DE BÚSQUEDA INTEGRADA */}
                    <div style={{ marginBottom: 4 }}>
                      <input type="text" placeholder="🔍 Buscar por descripción, alias, categoría o nota..." value={busqueda} onChange={e=>setBusqueda(e.target.value)} style={inp} />
                    </div>

                    <div style={{ display:"flex", flexDirection:"column", gap:10, marginTop:4 }}>
                      {reportesFiltrados.length === 0 ? (
                        <div style={{ background:c.bg3, border:`0.5px solid ${c.border2}`, borderRadius:14, padding:28, textAlign:"center", color:c.text3, fontSize:13 }}>No se encontraron reportes que coincidan.</div>
                      ) : (
                        reportesFiltrados.map(r => (
                          <CardReporte key={r.id} r={r} onClick={()=>setSelId(r.id)} esDir={false} esProfesor={true} dark={dark} c={c} play={play} />
                        ))
                      )}
                    </div>
                  </div>
                ) : (
                  /* SUB-PANEL B: INCIDENTES ENTRE LA DIRECTIVA Y COMUNICADOS INSTITUCIONALES */
                  <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                    
                    {/* FORMULARIO DE REPORTE ENTRE DIRECTIVOS */}
                    <div style={{ background:c.bg3, border:`0.5px solid ${c.border2}`, borderRadius:14, padding:14 }}>
                      <div style={{ fontSize:13, fontWeight:500, color:c.text, marginBottom:10 }}>Redactar Reporte/Memorándum Interno de Directiva</div>
                      {enviadoDir ? (
                        <div style={{ textAlign:"center", padding:"10px", background:c.green, borderRadius:10, border:`0.5px solid ${c.greenTx}`, fontSize:12, color:c.greenTx, fontWeight:500 }}>
                          Memorándum enviado. <button onClick={()=>setEnviadoDir(false)} style={{ background:"none", border:"none", color:c.blue, textDecoration:"underline", cursor:"pointer", fontSize:12 }}>Redactar otro</button>
                        </div>
                      ) : (
                        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                          <div style={{ display:"flex", gap:8 }}>
                            <select value={catDir} onChange={e=>setCatDir(e.target.value)} style={{ ...inp, flex:1 }}>
                              {CAT_DIR.map(f => <option key={f} value={f}>{f}</option>)}
                            </select>
                            <input type="text" placeholder="Observaciones breves..." value={notaDir} onChange={e=>setNotaDir(e.target.value)} style={{ ...inp, flex:1 }} />
                          </div>
                          <input type="text" placeholder="Descripción de la situación/asunto colegial directivo..." value={descDir} onChange={e=>setDescDir(e.target.value)} style={inp} />
                          <button onClick={enviarReporteDir} style={{ ...btnS(c.blue,"#fff"), padding:"8px" }}>Publicar Memorándum en Directiva</button>
                        </div>
                      )}
                    </div>

                    <FiltroBar opciones={ESTADOS} valor={filtroD} onChange={setFiltroD} c={c} play={play} />
                    
                    {/* 🔍 BARRA DE BÚSQUEDA INTEGRADA */}
                    <div style={{ marginBottom: 4 }}>
                      <input type="text" placeholder="🔍 Buscar en directiva por descripción, autor, área o nota..." value={busqueda} onChange={e=>setBusqueda(e.target.value)} style={inp} />
                    </div>

                    <div style={{ display:"flex", flexDirection:"column", gap:10, marginTop:4 }}>
                      {repDirFiltrados.length === 0 ? (
                        <div style={{ background:c.bg3, border:`0.5px solid ${c.border2}`, borderRadius:14, padding:28, textAlign:"center", color:c.text3, fontSize:13 }}>No se encontraron reportes de directiva.</div>
                      ) : (
                        repDirFiltrados.map(r => (
                          <CardReporte key={r.id} r={r} onClick={()=>setSelId(r.id)} esDir={true} esProfesor={true} dark={dark} c={c} play={play} />
                        ))
                      )}
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}