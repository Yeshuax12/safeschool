import { useState, useRef } from "react";

const CATEGORIAS = ["Bullying / acoso", "Violencia física", "Consumo de sustancias"];
const CAT_DIR    = ["Conducta docente", "Infraestructura", "Administrativo", "Otro"];
const ESTADOS    = ["En espera", "Recibido / Leído", "Resuelto"];
const ESTADO_COLOR = {
  "En espera":        { bg: "#FAEEDA", text: "#854F0B", dot: "#EF9F27" },
  "Recibido / Leído": { bg: "#E6F1FB", text: "#185FA5", dot: "#378ADD" },
  "Resuelto":         { bg: "#EAF3DE", text: "#3B6D11", dot: "#639922" },
};
const CAT_ICON = {
  "Bullying / acoso": "⚡", "Violencia física": "🚨", "Consumo de sustancias": "⚠️",
  "Conducta docente": "👔", "Infraestructura": "🏫", "Administrativo": "📋", "Otro": "📌",
};

const PROFESORES_BD = [
  { usuario: "Jesús Adrian Mondragón Chú", contraseña: "K@rtdsPomele37", nombre: "Jesús Adrián Mondragón Chú-Alcalde", cargo: "Director / Alcalde" },
];
const NOMBRES_RESERVADOS = PROFESORES_BD.map(p => p.usuario.toLowerCase());

let nextId = 1, nextAlumnoId = 1;
const alumnosBD = [];

const inp = { width: "100%", padding: "10px 12px", borderRadius: 10, border: "0.5px solid var(--color-border-secondary)", background: "var(--color-background-primary)", color: "var(--color-text-primary)", fontSize: 14, boxSizing: "border-box" };
const btn = (bg, color) => ({ padding: "11px", borderRadius: 10, border: "none", background: bg, color, fontSize: 14, fontWeight: 500, cursor: "pointer", width: "100%" });

export default function App() {
  const [sesion, setSesion]     = useState(null);
  const [pantalla, setPantalla] = useState("inicio");
  const [ajustes, setAjustes]   = useState(false);

  const [nuevoUser, setNuevoUser] = useState(""); const [nuevaPass, setNuevaPass] = useState("");
  const [loginUser, setLoginUser] = useState(""); const [loginPass, setLoginPass] = useState("");
  const [profUser,  setProfUser]  = useState(""); const [profPass,  setProfPass]  = useState("");
  const [errMsg, setErrMsg] = useState(""); const [errProf, setErrProf] = useState("");

  const [reportes,    setReportes]    = useState([]);
  const [repDirectiva, setRepDirectiva] = useState([]);
  const [vista,   setVista]   = useState("lista"); // lista | nuevo | detalle | directiva | nuevoDir | detalleDir
  const [selId,   setSelId]   = useState(null);
  const [filtro,  setFiltro]  = useState("Todos");
  const [filtroD, setFiltroD] = useState("Todos");

  const [cat,      setCat]      = useState(CATEGORIAS[0]);
  const [catDir,   setCatDir]   = useState(CAT_DIR[0]);
  const [desc,     setDesc]     = useState("");
  const [descDir,  setDescDir]  = useState("");
  const [nota,     setNota]     = useState("");
  const [notaDir,  setNotaDir]  = useState("");
  const [adjuntos, setAdjuntos] = useState([]); // { name, dataUrl, type }
  const [enviado,  setEnviado]  = useState(false);
  const [enviadoDir, setEnviadoDir] = useState(false);
  const [notaInterna, setNotaInterna] = useState("");
  const fileRef = useRef();

  const esProfesor = sesion?.tipo === "profesor";
  const selReporte  = reportes.find(r => r.id === selId);
  const selRepDir   = repDirectiva.find(r => r.id === selId);
  const reportesFiltrados = esProfesor
    ? reportes.filter(r => filtro === "Todos" || r.estado === filtro)
    : reportes.filter(r => r.alumnoId === sesion?.id);
  const repDirFiltrados = repDirectiva.filter(r => filtroD === "Todos" || r.estado === filtroD);

  function cerrarSesion() {
    setSesion(null); setPantalla("inicio"); setAjustes(false); setVista("lista");
    setSelId(null); setFiltro("Todos"); setFiltroD("Todos");
    setErrMsg(""); setErrProf(""); setLoginUser(""); setLoginPass(""); setProfUser(""); setProfPass("");
  }

  function registrarAlumno() {
    const u = nuevoUser.trim();
    if (!u || !nuevaPass.trim()) { setErrMsg("Completa todos los campos."); return; }
    if (NOMBRES_RESERVADOS.includes(u.toLowerCase())) { setErrMsg("Ese nombre está reservado."); return; }
    if (alumnosBD.find(a => a.usuario.toLowerCase() === u.toLowerCase())) { setErrMsg("Ese usuario ya está registrado."); return; }
    const alumno = { id: nextAlumnoId++, usuario: u, contraseña: nuevaPass.trim() };
    alumnosBD.push(alumno);
    setSesion({ tipo: "alumno", usuario: alumno.usuario, id: alumno.id });
    setPantalla("app"); setNuevoUser(""); setNuevaPass(""); setErrMsg("");
  }

  function loginAlumno() {
    const alumno = alumnosBD.find(a => a.usuario.toLowerCase() === loginUser.trim().toLowerCase() && a.contraseña === loginPass.trim());
    if (!alumno) { setErrMsg("Usuario o contraseña incorrectos."); return; }
    setSesion({ tipo: "alumno", usuario: alumno.usuario, id: alumno.id });
    setPantalla("app"); setLoginUser(""); setLoginPass(""); setErrMsg("");
  }

  function loginProfesor() {
    const prof = PROFESORES_BD.find(p => p.usuario === profUser.trim() && p.contraseña === profPass.trim());
    if (!prof) { setErrProf("Usuario o contraseña incorrectos."); return; }
    setSesion({ tipo: "profesor", nombre: prof.nombre, cargo: prof.cargo });
    setPantalla("app"); setProfUser(""); setProfPass(""); setErrProf("");
  }

  function handleFiles(files) {
    Array.from(files).forEach(file => {
      if (adjuntos.length >= 5) return;
      const reader = new FileReader();
      reader.onload = e => setAdjuntos(prev => [...prev, { name: file.name, dataUrl: e.target.result, type: file.type }]);
      reader.readAsDataURL(file);
    });
  }

  function enviarReporte() {
    if (!desc.trim()) return;
    const nuevo = {
      id: nextId++, alias: sesion.usuario, alumnoId: sesion.id,
      categoria: cat, descripcion: desc.trim(), nota: nota.trim(),
      adjuntos: [...adjuntos],
      estado: "En espera",
      fecha: new Date().toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" }),
      notas_internas: [],
    };
    setReportes(prev => [nuevo, ...prev]);
    setEnviado(true); setDesc(""); setNota(""); setAdjuntos([]);
  }

  function enviarReporteDir() {
    if (!descDir.trim()) return;
    const nuevo = {
      id: nextId++, autor: sesion.nombre, cargo: sesion.cargo,
      categoria: catDir, descripcion: descDir.trim(), nota: notaDir.trim(),
      estado: "En espera",
      fecha: new Date().toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" }),
      notas_internas: [],
    };
    setRepDirectiva(prev => [nuevo, ...prev]);
    setEnviadoDir(true); setDescDir(""); setNotaDir("");
  }

  function cambiarEstado(id, est, esDir = false) {
    if (esDir) setRepDirectiva(prev => prev.map(r => r.id === id ? { ...r, estado: est } : r));
    else setReportes(prev => prev.map(r => r.id === id ? { ...r, estado: est } : r));
  }

  function agregarNota(id, esDir = false) {
    if (!notaInterna.trim()) return;
    const nota = { texto: notaInterna.trim(), fecha: new Date().toLocaleDateString("es-PE") };
    if (esDir) setRepDirectiva(prev => prev.map(r => r.id === id ? { ...r, notas_internas: [...r.notas_internas, nota] } : r));
    else setReportes(prev => prev.map(r => r.id === id ? { ...r, notas_internas: [...r.notas_internas, nota] } : r));
    setNotaInterna("");
  }

  // ── COMPONENTES ──
  const GearBtn = () => (
    <button onClick={() => setAjustes(true)} style={{ background: "var(--color-background-secondary)", border: "0.5px solid var(--color-border-secondary)", borderRadius: 10, width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 18, flexShrink: 0 }}>⚙️</button>
  );

  const BackBtn = ({ label = "← Volver", onClick }) => (
    <button onClick={onClick} style={{ background: "none", border: "0.5px solid var(--color-border-secondary)", borderRadius: 8, padding: "4px 12px", fontSize: 13, cursor: "pointer", color: "var(--color-text-secondary)" }}>{label}</button>
  );

  const Badge = ({ estado }) => {
    const c = ESTADO_COLOR[estado];
    return (
      <span style={{ fontSize: 11, fontWeight: 500, padding: "4px 10px", borderRadius: 99, background: c.bg, color: c.text, whiteSpace: "nowrap" }}>
        <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: c.dot, marginRight: 5, verticalAlign: "middle" }}></span>
        {estado}
      </span>
    );
  };

  const ModalAjustes = () => (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ background: "var(--color-background-primary)", borderRadius: "16px 16px 0 0", padding: "28px 24px 36px", width: "100%", maxWidth: 420 }}>
        <div style={{ fontWeight: 500, fontSize: 17, color: "var(--color-text-primary)", marginBottom: 6 }}>⚙️ Ajustes</div>
        <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 24 }}>
          {esProfesor ? `${sesion.nombre} · ${sesion.cargo}` : `Usuario: ${sesion.usuario}`}
        </div>
        <button onClick={cerrarSesion} style={{ ...btn("#C0392B", "#fff"), borderRadius: 10 }}>Cerrar sesión</button>
        <button onClick={() => setAjustes(false)} style={{ ...btn("var(--color-background-secondary)", "var(--color-text-primary)"), marginTop: 10, borderRadius: 10 }}>Cancelar</button>
      </div>
    </div>
  );

  const FiltroBar = ({ opciones, valor, onChange }) => (
    <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
      {["Todos", ...opciones].map(f => (
        <button key={f} onClick={() => onChange(f)} style={{
          padding: "5px 14px", borderRadius: 99, fontSize: 13, cursor: "pointer",
          background: valor === f ? "#E6F1FB" : "var(--color-background-secondary)",
          color: valor === f ? "#185FA5" : "var(--color-text-secondary)",
          border: valor === f ? "1px solid #378ADD" : "0.5px solid var(--color-border-secondary)",
        }}>{f}</button>
      ))}
    </div>
  );

  // ── PANTALLAS DE AUTENTICACIÓN ──
  if (pantalla === "inicio") return (
    <div style={{ minHeight: 520, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>
      <div style={{ fontSize: 11, letterSpacing: 3, color: "var(--color-text-tertiary)", marginBottom: 8, textTransform: "uppercase" }}>Bienvenido a</div>
      <div style={{ fontSize: 32, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 4 }}>SafeSchool</div>
      <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 44, textAlign: "center" }}>Plataforma segura y confidencial de reportes</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 320 }}>
        {[{ id: "loginAlumno", label: "Soy alumno", sub: "Inicia sesión o crea tu cuenta" }, { id: "loginProf", label: "Soy profesor / admin", sub: "Accede con tus credenciales" }].map(op => (
          <button key={op.id} onClick={() => { setPantalla(op.id); setErrMsg(""); setErrProf(""); }} style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-secondary)", borderRadius: 12, padding: "16px 20px", textAlign: "left", cursor: "pointer" }}>
            <div style={{ fontWeight: 500, fontSize: 15, color: "var(--color-text-primary)" }}>{op.label}</div>
            <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{op.sub}</div>
          </button>
        ))}
      </div>
    </div>
  );

  if (pantalla === "loginAlumno") return (
    <div style={{ padding: "2rem 1.2rem", maxWidth: 380, margin: "0 auto" }}>
      <BackBtn onClick={() => { setPantalla("inicio"); setErrMsg(""); }} />
      <div style={{ fontWeight: 500, fontSize: 20, color: "var(--color-text-primary)", margin: "20px 0 4px" }}>Iniciar sesión</div>
      <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 24 }}>Ingresa con tu cuenta de alumno</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input style={inp} placeholder="Usuario (tu nombre y apellidos)" value={loginUser} onChange={e => setLoginUser(e.target.value)} />
        <input style={inp} placeholder="Contraseña" type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)} onKeyDown={e => e.key === "Enter" && loginAlumno()} />
        {errMsg && <div style={{ fontSize: 13, color: "#C0392B", background: "#FDEDEC", borderRadius: 8, padding: "8px 12px" }}>{errMsg}</div>}
        <button style={btn("#185FA5", "#fff")} onClick={loginAlumno}>Iniciar sesión</button>
        <div style={{ textAlign: "center", fontSize: 13, color: "var(--color-text-secondary)" }}>¿No tienes cuenta?{" "}
          <span onClick={() => { setPantalla("regAlumno"); setErrMsg(""); }} style={{ color: "#185FA5", cursor: "pointer", fontWeight: 500 }}>Regístrate</span>
        </div>
      </div>
    </div>
  );

  if (pantalla === "regAlumno") return (
    <div style={{ padding: "2rem 1.2rem", maxWidth: 380, margin: "0 auto" }}>
      <BackBtn onClick={() => { setPantalla("loginAlumno"); setErrMsg(""); }} />
      <div style={{ fontWeight: 500, fontSize: 20, color: "var(--color-text-primary)", margin: "20px 0 4px" }}>Crear cuenta</div>
      <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 24 }}>Tu usuario debe ser tu nombre y apellidos reales</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input style={inp} placeholder="Ej: Juan Pérez García" value={nuevoUser} onChange={e => setNuevoUser(e.target.value)} />
        <input style={inp} placeholder="Contraseña" type="password" value={nuevaPass} onChange={e => setNuevaPass(e.target.value)} onKeyDown={e => e.key === "Enter" && registrarAlumno()} />
        <div style={{ fontSize: 12, color: "#185FA5", background: "#E6F1FB", borderRadius: 8, padding: "8px 12px" }}>
          Tu nombre quedará registrado únicamente para ti. Nadie más podrá usarlo.
        </div>
        {errMsg && <div style={{ fontSize: 13, color: "#C0392B", background: "#FDEDEC", borderRadius: 8, padding: "8px 12px" }}>{errMsg}</div>}
        <button style={btn("#185FA5", "#fff")} onClick={registrarAlumno}>Crear cuenta</button>
      </div>
    </div>
  );

  if (pantalla === "loginProf") return (
    <div style={{ padding: "2rem 1.2rem", maxWidth: 380, margin: "0 auto" }}>
      <BackBtn onClick={() => { setPantalla("inicio"); setErrProf(""); }} />
      <div style={{ fontWeight: 500, fontSize: 20, color: "var(--color-text-primary)", margin: "20px 0 4px" }}>Acceso profesores</div>
      <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 24 }}>Ingresa con tus credenciales institucionales</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input style={inp} placeholder="Usuario" value={profUser} onChange={e => setProfUser(e.target.value)} />
        <input style={inp} placeholder="Contraseña" type="password" value={profPass} onChange={e => setProfPass(e.target.value)} onKeyDown={e => e.key === "Enter" && loginProfesor()} />
        {errProf && <div style={{ fontSize: 13, color: "#C0392B", background: "#FDEDEC", borderRadius: 8, padding: "8px 12px" }}>{errProf}</div>}
        <button style={btn("#185FA5", "#fff")} onClick={loginProfesor}>Iniciar sesión</button>
      </div>
    </div>
  );

  // ── APP PRINCIPAL ──
  const AppHeader = ({ titulo, onBack }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, paddingBottom: 14, borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
      {onBack && <BackBtn onClick={onBack} />}
      {titulo
        ? <span style={{ fontWeight: 500, fontSize: 16, color: "var(--color-text-primary)", flex: 1 }}>{titulo}</span>
        : (
          <div style={{ flex: 1 }}>
            {esProfesor
              ? <><div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{sesion.cargo}</div><div style={{ fontWeight: 500, fontSize: 15, color: "var(--color-text-primary)" }}>{sesion.nombre}</div></>
              : <><div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>Alumno</div><div style={{ fontWeight: 500, fontSize: 15, color: "var(--color-text-primary)" }}>{sesion.usuario}</div></>
            }
          </div>
        )
      }
      <GearBtn />
    </div>
  );

  const CardReporte = ({ r, onClick, esDir = false }) => (
    <div onClick={onClick} style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 14, padding: "14px 16px", cursor: onClick ? "pointer" : "default", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 4 }}>{CAT_ICON[r.categoria]} {r.categoria} · {r.fecha}</div>
        <div style={{ fontSize: 14, color: "var(--color-text-primary)", fontWeight: 500, marginBottom: 4 }}>
          {esDir ? r.autor : (esProfesor ? `Alias: ${r.alias}` : r.alias)}
        </div>
        <div style={{ fontSize: 13, color: "var(--color-text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.descripcion}</div>
        {r.adjuntos?.length > 0 && <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 4 }}>📎 {r.adjuntos.length} archivo{r.adjuntos.length > 1 ? "s" : ""}</div>}
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
        <Badge estado={r.estado} />
        {onClick && <span style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>Ver →</span>}
      </div>
    </div>
  );

  // DETALLE REPORTE ALUMNO
  if (vista === "detalle" && selReporte) return (
    <div style={{ padding: "1.5rem 1rem" }}>
      {ajustes && <ModalAjustes />}
      <AppHeader titulo="Detalle del caso" onBack={() => { setVista("lista"); setSelId(null); }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 14, padding: "16px 18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <div><span style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "block" }}>{CAT_ICON[selReporte.categoria]} {selReporte.categoria}</span><span style={{ fontWeight: 500, fontSize: 15, color: "var(--color-text-primary)" }}>Alias: {selReporte.alias}</span></div>
            <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{selReporte.fecha}</span>
          </div>
          <p style={{ fontSize: 14, color: "var(--color-text-primary)", lineHeight: 1.6, marginBottom: 6 }}>{selReporte.descripcion}</p>
          {selReporte.nota && <p style={{ fontSize: 13, color: "var(--color-text-secondary)", fontStyle: "italic" }}>Nota: {selReporte.nota}</p>}
          {selReporte.adjuntos?.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 8 }}>📎 Archivos adjuntos</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {selReporte.adjuntos.map((a, i) => (
                  a.type.startsWith("image/")
                    ? <img key={i} src={a.dataUrl} alt={a.name} style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: "0.5px solid var(--color-border-tertiary)" }} />
                    : <a key={i} href={a.dataUrl} download={a.name} style={{ fontSize: 12, color: "#185FA5", background: "#E6F1FB", padding: "6px 10px", borderRadius: 8, textDecoration: "none" }}>📄 {a.name}</a>
                ))}
              </div>
            </div>
          )}
        </div>
        <div>
          <label style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "block", marginBottom: 8 }}>Estado del caso</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {ESTADOS.map(est => { const c = ESTADO_COLOR[est]; const a = selReporte.estado === est; return <button key={est} onClick={() => cambiarEstado(selReporte.id, est)} style={{ padding: "6px 14px", borderRadius: 99, fontSize: 13, cursor: "pointer", background: a ? c.bg : "var(--color-background-secondary)", color: a ? c.text : "var(--color-text-secondary)", border: a ? `1.5px solid ${c.dot}` : "0.5px solid var(--color-border-secondary)", fontWeight: a ? 500 : 400 }}>{est}</button>; })}
          </div>
        </div>
        <div>
          <label style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "block", marginBottom: 8 }}>Notas internas</label>
          {selReporte.notas_internas.map((n, i) => <div key={i} style={{ background: "var(--color-background-secondary)", borderRadius: 10, padding: "10px 14px", fontSize: 13, marginBottom: 8 }}><span style={{ color: "var(--color-text-primary)" }}>{n.texto}</span><span style={{ color: "var(--color-text-tertiary)", fontSize: 11, display: "block", marginTop: 4 }}>{n.fecha}</span></div>)}
          <div style={{ display: "flex", gap: 8 }}><input style={{ ...inp, flex: 1 }} value={notaInterna} onChange={e => setNotaInterna(e.target.value)} placeholder="Agregar nota interna..." onKeyDown={e => e.key === "Enter" && agregarNota(selReporte.id)} /><button onClick={() => agregarNota(selReporte.id)} style={{ padding: "0 16px", borderRadius: 10, border: "0.5px solid var(--color-border-secondary)", background: "var(--color-background-secondary)", cursor: "pointer", fontSize: 13, color: "var(--color-text-primary)" }}>+</button></div>
        </div>
      </div>
    </div>
  );

  // DETALLE REPORTE DIRECTIVA
  if (vista === "detalleDir" && selRepDir) return (
    <div style={{ padding: "1.5rem 1rem" }}>
      {ajustes && <ModalAjustes />}
      <AppHeader titulo="Reporte de directiva" onBack={() => { setVista("directiva"); setSelId(null); }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 14, padding: "16px 18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <div><span style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "block" }}>{CAT_ICON[selRepDir.categoria]} {selRepDir.categoria}</span><span style={{ fontWeight: 500, fontSize: 15, color: "var(--color-text-primary)" }}>{selRepDir.autor}</span><span style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "block" }}>{selRepDir.cargo}</span></div>
            <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{selRepDir.fecha}</span>
          </div>
          <p style={{ fontSize: 14, color: "var(--color-text-primary)", lineHeight: 1.6, marginBottom: 6 }}>{selRepDir.descripcion}</p>
          {selRepDir.nota && <p style={{ fontSize: 13, color: "var(--color-text-secondary)", fontStyle: "italic" }}>Nota: {selRepDir.nota}</p>}
        </div>
        <div>
          <label style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "block", marginBottom: 8 }}>Estado</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {ESTADOS.map(est => { const c = ESTADO_COLOR[est]; const a = selRepDir.estado === est; return <button key={est} onClick={() => cambiarEstado(selRepDir.id, est, true)} style={{ padding: "6px 14px", borderRadius: 99, fontSize: 13, cursor: "pointer", background: a ? c.bg : "var(--color-background-secondary)", color: a ? c.text : "var(--color-text-secondary)", border: a ? `1.5px solid ${c.dot}` : "0.5px solid var(--color-border-secondary)", fontWeight: a ? 500 : 400 }}>{est}</button>; })}
          </div>
        </div>
        <div>
          <label style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "block", marginBottom: 8 }}>Notas internas</label>
          {selRepDir.notas_internas.map((n, i) => <div key={i} style={{ background: "var(--color-background-secondary)", borderRadius: 10, padding: "10px 14px", fontSize: 13, marginBottom: 8 }}><span style={{ color: "var(--color-text-primary)" }}>{n.texto}</span><span style={{ color: "var(--color-text-tertiary)", fontSize: 11, display: "block", marginTop: 4 }}>{n.fecha}</span></div>)}
          <div style={{ display: "flex", gap: 8 }}><input style={{ ...inp, flex: 1 }} value={notaInterna} onChange={e => setNotaInterna(e.target.value)} placeholder="Agregar nota interna..." onKeyDown={e => e.key === "Enter" && agregarNota(selRepDir.id, true)} /><button onClick={() => agregarNota(selRepDir.id, true)} style={{ padding: "0 16px", borderRadius: 10, border: "0.5px solid var(--color-border-secondary)", background: "var(--color-background-secondary)", cursor: "pointer", fontSize: 13, color: "var(--color-text-primary)" }}>+</button></div>
        </div>
      </div>
    </div>
  );

  // NUEVO REPORTE ALUMNO
  if (vista === "nuevo") {
    if (enviado) return (
      <div style={{ padding: "2rem 1rem" }}>
        {ajustes && <ModalAjustes />}
        <div style={{ background: "#EAF3DE", borderRadius: 14, padding: "28px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>✓</div>
          <div style={{ fontWeight: 500, fontSize: 17, color: "#27500A", marginBottom: 6 }}>¡Reporte enviado!</div>
          <div style={{ fontSize: 13, color: "#3B6D11" }}>Tu caso fue registrado correctamente.</div>
          <button onClick={() => { setEnviado(false); setVista("lista"); }} style={{ marginTop: 20, background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-secondary)", borderRadius: 10, padding: "8px 22px", fontSize: 14, cursor: "pointer", color: "var(--color-text-primary)" }}>Ver mis reportes</button>
        </div>
      </div>
    );
    return (
      <div style={{ padding: "1.5rem 1rem" }}>
        {ajustes && <ModalAjustes />}
        <AppHeader titulo="Nuevo reporte" onBack={() => setVista("lista")} />
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div><label style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "block", marginBottom: 6 }}>Categoría</label><select value={cat} onChange={e => setCat(e.target.value)} style={{ ...inp }}>{CATEGORIAS.map(c => <option key={c}>{c}</option>)}</select></div>
          <div><label style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "block", marginBottom: 6 }}>Descripción del caso</label><textarea value={desc} onChange={e => setDesc(e.target.value)} rows={4} placeholder="Describe lo que ocurrió, cuándo y dónde..." style={{ ...inp, resize: "vertical", fontFamily: "inherit" }} /></div>
          <div><label style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "block", marginBottom: 6 }}>Nota adicional <span style={{ color: "var(--color-text-tertiary)" }}>(opcional)</span></label><input style={inp} value={nota} onChange={e => setNota(e.target.value)} placeholder="Información extra..." /></div>

          {/* ADJUNTOS */}
          <div>
            <label style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "block", marginBottom: 6 }}>Archivos adjuntos <span style={{ color: "var(--color-text-tertiary)" }}>(máx. 5)</span></label>
            <input ref={fileRef} type="file" multiple accept="image/*,.pdf,.doc,.docx" style={{ display: "none" }} onChange={e => handleFiles(e.target.files)} />
            <button onClick={() => fileRef.current.click()} style={{ ...btn("var(--color-background-secondary)", "var(--color-text-primary)"), border: "0.5px dashed var(--color-border-secondary)", marginBottom: 8 }}>
              📎 Adjuntar fotos o archivos
            </button>
            {adjuntos.length > 0 && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {adjuntos.map((a, i) => (
                  <div key={i} style={{ position: "relative" }}>
                    {a.type.startsWith("image/")
                      ? <img src={a.dataUrl} alt={a.name} style={{ width: 70, height: 70, objectFit: "cover", borderRadius: 8, border: "0.5px solid var(--color-border-tertiary)" }} />
                      : <div style={{ width: 70, height: 70, background: "var(--color-background-secondary)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "var(--color-text-secondary)", textAlign: "center", padding: 4 }}>📄<br />{a.name.slice(0, 10)}</div>
                    }
                    <button onClick={() => setAdjuntos(prev => prev.filter((_, j) => j !== i))} style={{ position: "absolute", top: -6, right: -6, background: "#C0392B", color: "#fff", border: "none", borderRadius: "50%", width: 18, height: 18, fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ background: "#E6F1FB", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#185FA5" }}>Tu identidad está protegida. Solo verán tu usuario.</div>
          <button onClick={enviarReporte} disabled={!desc.trim()} style={btn(!desc.trim() ? "var(--color-background-secondary)" : "#185FA5", !desc.trim() ? "var(--color-text-tertiary)" : "#fff")}>Enviar reporte</button>
        </div>
      </div>
    );
  }

  // NUEVO REPORTE DIRECTIVA
  if (vista === "nuevoDir") {
    if (enviadoDir) return (
      <div style={{ padding: "2rem 1rem" }}>
        {ajustes && <ModalAjustes />}
        <div style={{ background: "#EAF3DE", borderRadius: 14, padding: "28px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>✓</div>
          <div style={{ fontWeight: 500, fontSize: 17, color: "#27500A", marginBottom: 6 }}>¡Reporte de directiva enviado!</div>
          <button onClick={() => { setEnviadoDir(false); setVista("directiva"); }} style={{ marginTop: 20, background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-secondary)", borderRadius: 10, padding: "8px 22px", fontSize: 14, cursor: "pointer", color: "var(--color-text-primary)" }}>Ver reportes</button>
        </div>
      </div>
    );
    return (
      <div style={{ padding: "1.5rem 1rem" }}>
        {ajustes && <ModalAjustes />}
        <AppHeader titulo="Nuevo reporte de directiva" onBack={() => setVista("directiva")} />
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div><label style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "block", marginBottom: 6 }}>Categoría</label><select value={catDir} onChange={e => setCatDir(e.target.value)} style={{ ...inp }}>{CAT_DIR.map(c => <option key={c}>{c}</option>)}</select></div>
          <div><label style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "block", marginBottom: 6 }}>Descripción</label><textarea value={descDir} onChange={e => setDescDir(e.target.value)} rows={4} placeholder="Detalla el asunto..." style={{ ...inp, resize: "vertical", fontFamily: "inherit" }} /></div>
          <div><label style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "block", marginBottom: 6 }}>Nota adicional <span style={{ color: "var(--color-text-tertiary)" }}>(opcional)</span></label><input style={inp} value={notaDir} onChange={e => setNotaDir(e.target.value)} placeholder="Información extra..." /></div>
          <button onClick={enviarReporteDir} disabled={!descDir.trim()} style={btn(!descDir.trim() ? "var(--color-background-secondary)" : "#185FA5", !descDir.trim() ? "var(--color-text-tertiary)" : "#fff")}>Enviar reporte</button>
        </div>
      </div>
    );
  }

  // SECCIÓN DIRECTIVA
  if (vista === "directiva") return (
    <div style={{ padding: "1.5rem 1rem" }}>
      {ajustes && <ModalAjustes />}
      <AppHeader titulo="Reportes de directiva" onBack={() => setVista("lista")} />
      <FiltroBar opciones={ESTADOS} valor={filtroD} onChange={setFiltroD} />
      {esProfesor && <button onClick={() => setVista("nuevoDir")} style={{ ...btn("#185FA5", "#fff"), borderRadius: 10, marginBottom: 16 }}>+ Nuevo reporte de directiva</button>}
      {repDirFiltrados.length === 0
        ? <div style={{ textAlign: "center", padding: "48px 0", color: "var(--color-text-secondary)", fontSize: 14 }}>No hay reportes de directiva.</div>
        : <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {repDirFiltrados.map(r => <CardReporte key={r.id} r={r} esDir onClick={esProfesor ? () => { setSelId(r.id); setVista("detalleDir"); } : undefined} />)}
          </div>
      }
    </div>
  );

  // LISTA PRINCIPAL
  return (
    <div style={{ padding: "1.5rem 1rem" }}>
      {ajustes && <ModalAjustes />}
      <AppHeader />
      {esProfesor && (
        <FiltroBar opciones={ESTADOS} valor={filtro} onChange={setFiltro} />
      )}
      {!esProfesor && <button onClick={() => setVista("nuevo")} style={{ ...btn("#185FA5", "#fff"), borderRadius: 10, marginBottom: 16 }}>+ Nuevo reporte</button>}

      {reportesFiltrados.length === 0
        ? <div style={{ textAlign: "center", padding: "32px 0", color: "var(--color-text-secondary)", fontSize: 14 }}>{esProfesor ? "No hay casos de alumnos." : "Aún no has enviado reportes."}</div>
        : <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {reportesFiltrados.map(r => <CardReporte key={r.id} r={r} onClick={esProfesor ? () => { setSelId(r.id); setVista("detalle"); } : undefined} />)}
          </div>
      }

      {/* BOTÓN DIRECTIVA */}
      {esProfesor && (
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: "0.5px solid var(--color-border-tertiary)" }}>
          <button onClick={() => setVista("directiva")} style={{ ...btn("var(--color-background-secondary)", "var(--color-text-primary)"), border: "0.5px solid var(--color-border-secondary)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            📋 Reportes de directiva {repDirectiva.length > 0 && <span style={{ background: "#185FA5", color: "#fff", borderRadius: 99, fontSize: 11, padding: "2px 8px" }}>{repDirectiva.length}</span>}
          </button>
        </div>
      )}
    </div>
  );
}
