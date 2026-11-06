// Datos y piezas compartidas de la web de Acroflex: horarios, mensualidades, pestañas y menú.
// Para cambiar un horario o un precio, se cambia aquí y se actualiza en todas las páginas.

const COMPRAR = "https://acroflex-reservas.vercel.app/comprar/";
const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const NOMBRES = { adultos: "Jóvenes y Adultos", flexipower: "FlexiPower", teens: "Teens" };

// Horarios vigentes (oct/nov 2026). Cada turno: [día 0=lunes, "inicio", "fin", intensivo?]
const HORARIOS = {
  adultos: {
    info: "<span><b>Acroflex Jóvenes y Adultos</b> · desde 14 años</span><span>Clases de <b>1 h 25 min</b> · intensivos de <b>2 h</b></span>",
    turnos: [
      [0, "6:30 pm", "7:55 pm"],
      [1, "6:30 am", "7:55 am"], [1, "10:00 am", "11:25 am"], [1, "11:30 am", "12:55 pm"], [1, "7:00 pm", "8:25 pm"], [1, "8:30 pm", "9:55 pm"],
      [2, "11:30 am", "12:55 pm"], [2, "6:30 pm", "7:55 pm"],
      [3, "6:30 am", "7:55 am"], [3, "10:00 am", "11:25 am"], [3, "11:30 am", "12:55 pm"], [3, "7:00 pm", "8:25 pm"], [3, "8:30 pm", "9:55 pm"],
      [4, "11:30 am", "12:55 pm"],
      [5, "7:30 am", "8:55 am"], [5, "10:30 am", "11:55 am"], [5, "3:00 pm", "4:25 pm"],
      [6, "9:30 am", "11:30 am", true], [6, "11:30 am", "1:30 pm", true],
    ],
  },
  flexipower: {
    info: "<span><b>FlexiPower</b> · desde 15 años</span><span>Clases de <b>55 min</b> · intensivo los sábados</span>",
    turnos: [
      [0, "8:00 pm", "8:55 pm"],
      [1, "6:00 pm", "6:55 pm"],
      [2, "9:00 am", "9:55 am"], [2, "8:00 pm", "8:55 pm"],
      [3, "6:00 pm", "6:55 pm"],
      [4, "9:00 am", "9:55 am"],
      [5, "12:00 pm", "1:25 pm", true],
    ],
  },
  teens: {
    info: "<span><b>Acroflex Teens</b> · de 7 a 13 años</span><span>Clases de <b>1 h 25 min</b></span>",
    turnos: [
      [0, "5:00 pm", "6:25 pm"],
      [1, "4:30 pm", "5:55 pm"],
      [2, "5:00 pm", "6:25 pm"],
      [3, "4:30 pm", "5:55 pm"],
      [5, "9:00 am", "10:25 am"], [5, "4:30 pm", "5:55 pm"],
    ],
  },
};

const PRECIOS = {
  adultos: {
    planes: [
      { slug: "acroflex-4", n: 4, precio: 190, freq: "1 vez por semana" },
      { slug: "acroflex-8", n: 8, precio: 330, freq: "2 veces por semana", top: true },
      { slug: "acroflex-12", n: 12, precio: 470, freq: "3 veces por semana" },
    ],
    suelta: { slug: "clase-suelta-acroflex", precio: 55 },
    extra: { titulo: "Intensivo de domingo", texto: "4 clases de 2 horas por S/ 260 · o 1 clase por S/ 70", slug: "acroflex-intensivo-4", slug2: "clase-suelta-acroflex-intensivo" },
  },
  flexipower: {
    planes: [
      { slug: "flexipower-4", n: 4, precio: 170, freq: "1 vez por semana" },
      { slug: "flexipower-8", n: 8, precio: 290, freq: "2 veces por semana", top: true },
      { slug: "flexipower-12", n: 12, precio: 420, freq: "3 veces por semana" },
    ],
    suelta: { slug: "clase-suelta-flexipower", precio: 45 },
    extra: { titulo: "Intensivo de sábado", texto: "4 clases intensivas de 1 h 25 min por S/ 250 · o 1 clase por S/ 65", slug: "flexipower-intensivo-4", slug2: "clase-suelta-flexipower-intensivo" },
  },
  teens: {
    planes: [
      { slug: "teens-4", n: 4, precio: 190, freq: "1 vez por semana" },
      { slug: "teens-8", n: 8, precio: 330, freq: "2 veces por semana", top: true },
      { slug: "teens-12", n: 12, precio: 470, freq: "3 veces por semana" },
    ],
    suelta: { slug: "clase-suelta-teens", precio: 55 },
  },
};

const hoy = (new Date().getDay() + 6) % 7; // 0 = lunes

// Cyber Wow (nov 2026): se prende y se apaga sola por fecha, hora Lima. Para verla antes: ?cyber=1 o #cyber=1
const CYBER = { inicio: "2026-11-03T20:00:00-05:00", fin: "2026-11-06T23:59:59-05:00", finTexto: "viernes 6 de noviembre" };
const enCyber = (() => {
  if (/cyber=1/.test(location.search + location.hash)) return true;
  const ahora = Date.now();
  return ahora >= Date.parse(CYBER.inicio) && ahora <= Date.parse(CYBER.fin);
})();
// descuento para estudiantes antiguos: 4 clases → S/ 15; 8 o 12 → S/ 25
const dctoCyber = (n) => (n >= 8 ? 25 : n >= 4 ? 15 : 0);

// Precios según quién mira: "nuevo" (paga matrícula la 1.ª vez) o "estudiante". Por defecto, nuevo.
let modo = "nuevo";
const MATRICULA = 50;
try { if (localStorage.getItem("af-modo") === "estudiante") modo = "estudiante"; } catch (e) {}
function htmlModo() {
  const b = (m, txt) => `<button type="button" data-modo="${m}" aria-pressed="${modo === m}">${txt}</button>`;
  return `<div class="modo" role="group" aria-label="¿Ya entrenas en Acroflex?">${b("nuevo", "Es mi primera vez")}${b("estudiante", "Ya soy estudiante")}</div>`;
}

function soles(n) { return "S/ " + (Number.isInteger(n) ? n : n.toFixed(2)); }

function htmlHorario(curso) {
  const h = HORARIOS[curso];
  const dias = DIAS.map((dia, i) => {
    const turnos = h.turnos.filter((t) => t[0] === i);
    const horas = turnos.length
      ? turnos.map((t) => `<button type="button" class="hora${t[3] ? " int" : ""}" data-curso="${curso}" data-dia="${dia}" data-hora="${t[1]}" data-fin="${t[2]}"${t[3] ? " data-int" : ""}>${t[1]}<small>${t[3] ? "Intensivo · " : ""}hasta ${t[2]}</small></button>`).join("")
      : `<span class="vacio">Sin clases</span>`;
    return `<div class="dia${i === hoy ? " hoy" : ""}"><h4>${dia}${i === hoy ? "<small>Hoy</small>" : ""}</h4><div class="horas">${horas}</div></div>`;
  }).join("");
  return `<p class="horario-info">${h.info}</p><div class="semana">${dias}</div>`;
}

function htmlPrecios(curso) {
  const p = PRECIOS[curso];
  const planes = p.planes.map((pl) => `
    <div class="plan${pl.top ? " top-pick" : ""}">
      ${pl.top ? '<span class="tag">El más elegido</span>' : ""}
      <h3>${pl.n} clases</h3>
      <div class="freq">${pl.freq}</div>
      ${enCyber && modo === "estudiante"
        ? `<div class="precio"><small>S/</small>${pl.precio - dctoCyber(pl.n)}<s class="cy-tach">S/ ${pl.precio}</s></div>
      <span class="cy-eti">🔥 Precio Cyber para estudiantes</span>`
        : modo === "nuevo"
        ? (enCyber
          ? `<div class="precio"><small>S/</small>${pl.precio}<s class="cy-tach">S/ ${pl.precio + MATRICULA}</s></div>
      <span class="cy-eti">🔥 Matrícula gratis (antes S/ ${MATRICULA})</span>`
          : `<div class="precio"><small>S/</small>${pl.precio + MATRICULA}</div>
      <p class="cy-nuevo">S/ ${pl.precio} + matrícula S/ ${MATRICULA} (solo la primera vez)</p>`)
        : `<div class="precio"><small>S/</small>${pl.precio}</div>
      <span class="xclase">${soles(Math.round(pl.precio / pl.n * 100) / 100)} por clase</span>`}
      <ul><li>Eliges tus horarios</li><li>1 mes desde tu 1.ª clase</li></ul>
      <a class="btn btn-orange" href="${COMPRAR + pl.slug}">Comprar</a>
    </div>`).join("");
  const suelta = `
    <div class="plan suelta">
      <h3>Clase suelta</h3>
      <div class="freq">Para empezar o venir cuando puedas</div>
      <div class="precio"><small>S/</small>${p.suelta.precio}</div>
      <span class="xclase" style="background:rgba(255,255,255,.12);color:#fff">Sin matrícula</span>
      <ul><li>1 clase grupal</li><li>15 días desde tu compra</li></ul>
      <a class="btn" href="${COMPRAR + p.suelta.slug}">Comprar</a>
    </div>`;
  const extra = p.extra
    ? `<div class="extra-row"><div class="extra" style="grid-column:1/-1"><div><b>${p.extra.titulo}</b><span>${p.extra.texto}${enCyber && modo === "estudiante" ? " · 🔥 estudiantes: −S/ 15 en el paquete" : ""}</span></div><span style="display:flex;gap:16px;flex-wrap:wrap"><a href="${COMPRAR + p.extra.slug}">Comprar paquete →</a>${p.extra.slug2 ? `<a href="${COMPRAR + p.extra.slug2}">Comprar 1 clase →</a>` : ""}</span></div></div>`
    : "";
  const cyber = enCyber
    ? `<div class="cy-aviso"><b>🔥 Cyber Wow · hasta el ${CYBER.finTexto}</b><span>${modo === "nuevo"
      ? "Tu matrícula <s>S/ 50</s> <b>S/ 0</b> en cualquier paquete."
      : "−S/ 15 en 4 clases y −S/ 25 en 8 o 12."} Se aplica solo al pagar.</span></div>`
    : "";
  return `${htmlModo()}${cyber}<div class="planes">${planes + suelta}</div>${extra}`;
}

// minutos desde las 0:00 de "8:30 pm"
function minutos(hora) {
  const [, h, m, ap] = hora.match(/(\d+):(\d+) (am|pm)/);
  return (Number(h) % 12 + (ap === "pm" ? 12 : 0)) * 60 + Number(m);
}

// Turnos que empiezan desde las 6 pm, para destacar que se puede entrenar después del trabajo.
function htmlNoche(cursos) {
  const abrev = DIAS.map((d) => d.slice(0, 3));
  let ultima = 0;
  const filas = cursos.map((curso) => {
    const porHora = {};
    HORARIOS[curso].turnos.filter((t) => minutos(t[1]) >= 18 * 60).forEach((t) => {
      ultima = Math.max(ultima, minutos(t[2]));
      (porHora[t[1]] = porHora[t[1]] || []).push(abrev[t[0]]);
    });
    const horas = Object.keys(porHora).sort((a, b) => minutos(a) - minutos(b))
      .map((h) => `<span><b>${h}</b> ${porHora[h].join(" · ")}</span>`).join("");
    return `<div class="noche-curso"><small>${NOMBRES[curso]}</small><div class="noche-horas">${horas}</div></div>`;
  }).join("");
  const fin = `${Math.floor(ultima / 60) % 12}:${String(ultima % 60).padStart(2, "0")} pm`;
  return `<p class="noche-titulo">🌙 Clases de noche hasta las <b>${fin}</b></p>${filas}<a class="noche-link" href="horarios.html">Ver todos los horarios →</a>`;
}

// <div data-bloque="horario|precio" data-curso="adultos" [data-tabs]></div>
// <div data-bloque="noche" data-curso="adultos,flexipower"></div>
function montarBloque(el) {
  const tipo = el.dataset.bloque;
  if (tipo === "noche") { el.innerHTML = htmlNoche(el.dataset.curso.split(",")); return; }
  let actual = el.dataset.curso || "adultos";
  const pintar = (curso) => { actual = curso; cuerpo.innerHTML = tipo === "horario" ? htmlHorario(curso) : htmlPrecios(curso); };
  const cuerpo = document.createElement("div");
  if (el.hasAttribute("data-tabs")) {
    const tabs = document.createElement("div");
    tabs.className = "tabs";
    tabs.setAttribute("role", "tablist");
    tabs.innerHTML = Object.keys(NOMBRES).map((c) =>
      `<button class="tab" role="tab" data-curso="${c}" aria-selected="${c === el.dataset.curso}">${NOMBRES[c]}</button>`).join("");
    tabs.addEventListener("click", (e) => {
      const b = e.target.closest(".tab");
      if (!b) return;
      tabs.querySelectorAll(".tab").forEach((x) => x.setAttribute("aria-selected", String(x === b)));
      pintar(b.dataset.curso);
    });
    el.appendChild(tabs);
  }
  el.appendChild(cuerpo);
  el.repintar = () => pintar(actual);
  pintar(actual);
}

document.querySelectorAll("[data-bloque]").forEach(montarBloque);

function cuentaRegresiva(el) {
  const pintar = () => {
    const ms = Math.max(0, Date.parse(CYBER.fin) - Date.now());
    const d = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5) % 24, m = Math.floor(ms / 6e4) % 60;
    el.textContent = ms ? `${d ? d + " d " : ""}${h} h ${String(m).padStart(2, "0")} min` : "¡Último momento!";
  };
  pintar();
  setInterval(pintar, 30000);
}

if (enCyber) {
  document.body.classList.add("cyber");
  const barra = document.createElement("a");
  barra.className = "cy-barra";
  barra.href = "paquetes.html";
  barra.innerHTML = `🔥 <b>CYBER WOW</b> · Nuevos: matrícula S/ 0 · Estudiantes: hasta −S/ 25 · Termina en <span data-cuenta></span> <u>Ver precios</u>`;
  document.body.prepend(barra);
  const portada = document.getElementById("cyber-portada");
  if (portada) portada.hidden = false;
  document.querySelectorAll("[data-cuenta]").forEach(cuentaRegresiva);
  // reloj grande de la portada: segundo a segundo
  document.querySelectorAll("[data-reloj]").forEach((reloj) => {
    const u = (k) => reloj.querySelector(`[data-u="${k}"]`);
    const dos = (n) => String(n).padStart(2, "0");
    const tic = () => {
      const ms = Math.max(0, Date.parse(CYBER.fin) - Date.now());
      const t = { d: Math.floor(ms / 864e5), h: Math.floor(ms / 36e5) % 24, m: Math.floor(ms / 6e4) % 60, s: Math.floor(ms / 1e3) % 60 };
      for (const k in t) {
        const el = u(k), v = dos(t[k]);
        if (el.textContent !== v) { el.textContent = v; el.classList.remove("cambia"); void el.offsetWidth; el.classList.add("cambia"); }
      }
      reloj.classList.toggle("ultimo-dia", ms < 864e5);
    };
    tic();
    setInterval(tic, 1000);
  });
}

// Tienda (Precios y horarios): cada paquete grupal muestra el precio según "nuevo" o "estudiante".
const tarjetas = [...document.querySelectorAll(".af-card")].map((card) => {
  const a = card.querySelector('a[href*="/comprar/"]');
  const slug = a ? a.href.split("/comprar/")[1] : "";
  const m = slug.match(/-(\d+)$/);
  const precio = card.querySelector(".af-precio");
  if (!m || !precio || /^(clase-suelta|1a1|particular|matricula)/.test(slug)) return null;
  return { card, precio, original: precio.innerHTML, monto: Number(precio.textContent.replace(/[^0-9]/g, "")), dcto: dctoCyber(Number(m[1])) };
}).filter(Boolean);
function pintarTienda() {
  tarjetas.forEach((x) => {
    x.card.querySelector(".cy-tienda")?.remove();
    x.precio.innerHTML = x.original;
    if (modo === "estudiante") {
      if (!enCyber || !x.dcto) return;
      x.precio.innerHTML = `S/ ${x.monto - x.dcto}<s class="cy-tach">S/ ${x.monto}</s>`;
      x.precio.insertAdjacentHTML("afterend", `<p class="cy-tienda">🔥 <b>Precio Cyber para estudiantes</b></p>`);
    } else if (enCyber) {
      x.precio.innerHTML = `S/ ${x.monto}<s class="cy-tach">S/ ${x.monto + MATRICULA}</s>`;
      x.precio.insertAdjacentHTML("afterend", `<p class="cy-tienda">🔥 <b>Matrícula gratis</b> (antes S/ ${MATRICULA})</p>`);
    } else {
      x.precio.innerHTML = `S/ ${x.monto + MATRICULA}<small>soles</small>`;
      x.precio.insertAdjacentHTML("afterend", `<p class="cy-tienda">S/ ${x.monto} + matrícula S/ ${MATRICULA} (solo la primera vez)</p>`);
    }
  });
}
if (tarjetas.length) {
  const primero = document.querySelector(".af-grupo");
  primero.insertAdjacentHTML("beforebegin", htmlModo());
  pintarTienda();
}

document.addEventListener("click", (e) => {
  const b = e.target.closest(".modo [data-modo]");
  if (!b || b.dataset.modo === modo) return;
  modo = b.dataset.modo;
  try { localStorage.setItem("af-modo", modo); } catch (err) {}
  document.querySelectorAll('[data-bloque="precio"]').forEach((el) => el.repintar && el.repintar());
  document.querySelectorAll(".modo [data-modo]").forEach((x) => x.setAttribute("aria-pressed", String(x.dataset.modo === modo)));
  pintarTienda();
});

// Al tocar un horario: comprar o escribir por WhatsApp con ese horario ya escrito.
const PAGINA_CURSO = { adultos: "curso-jovenes-adultos.html", flexipower: "curso-flexipower.html", teens: "curso-teens.html" };
const NOMBRE_LARGO = { adultos: "Acroflex Jóvenes y Adultos", flexipower: "FlexiPower", teens: "Acroflex Teens" };

function urlComprar(curso) {
  if (document.querySelector(`.af-grupo#${curso}`)) return `#${curso}`; // en Precios y horarios: los paquetes están en la misma sección
  const aqui = document.querySelector(`[data-bloque="precio"][data-curso="${curso}"]`);
  return aqui && !aqui.hasAttribute("data-tabs") ? "#precios" : PAGINA_CURSO[curso] + "#precios";
}

function abrirHorario(b) {
  const curso = b.dataset.curso;
  const texto = `${NOMBRE_LARGO[curso]} · ${b.dataset.dia} ${b.dataset.hora}${b.hasAttribute("data-int") ? " (intensivo)" : ""}`;
  const wa = "https://wa.me/51993813336?text=" + encodeURIComponent(`Hola Acroflex 🤸 Me interesa el horario de ${texto}. ¿Hay cupo?`);
  let hoja = document.getElementById("hoja-horario");
  if (!hoja) {
    hoja = document.createElement("div");
    hoja.id = "hoja-horario";
    hoja.className = "hoja";
    hoja.setAttribute("role", "dialog");
    hoja.setAttribute("aria-modal", "true");
    document.body.appendChild(hoja);
    hoja.addEventListener("click", (e) => { if (e.target === hoja || e.target.closest("[data-cerrar]")) cerrarHoja(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") cerrarHoja(); });
  }
  hoja.innerHTML = `<div class="hoja-in">
      <button type="button" class="hoja-x" data-cerrar aria-label="Cerrar">×</button>
      <span class="kicker">Te interesa este horario</span>
      <h3>${NOMBRE_LARGO[curso]}</h3>
      <p class="hoja-hora">${b.dataset.dia} · ${b.dataset.hora} a ${b.dataset.fin}${b.hasAttribute("data-int") ? " · Intensivo" : ""}</p>
      <a class="btn btn-orange" href="${urlComprar(curso)}" data-cerrar>Ver precios y comprar</a>
      <a class="btn btn-wa" href="${wa}" target="_blank" rel="noopener">Escribir por WhatsApp</a>
      <p class="hoja-nota">Al comprar tu paquete, eliges este horario al agendar tus clases.</p>
    </div>`;
  hoja.classList.add("abierta");
  hoja.querySelector(".btn-orange").focus();
}

function cerrarHoja() {
  const hoja = document.getElementById("hoja-horario");
  if (hoja) hoja.classList.remove("abierta");
}

document.addEventListener("click", (e) => {
  const b = e.target.closest("button.hora");
  if (b) abrirHorario(b);
});

// tienda: mostrar solo los cursos para la edad elegida
const filtroEdad = document.querySelector("[data-edad]");
if (filtroEdad) {
  const grupos = { teens: ["teens", "suelta", "1a1", "matricula"], adultos: ["adultos", "flexipower", "suelta", "1a1", "matricula"] };
  const nota = filtroEdad.querySelector(".edad-nota");
  const ver = (edad) => {
    document.querySelectorAll(".af-grupo").forEach((g) => { g.hidden = edad !== "todo" && !grupos[edad].includes(g.id); });
    document.querySelectorAll("[data-solo]").forEach((c) => { c.hidden = edad !== "todo" && c.dataset.solo !== edad; });
    filtroEdad.querySelectorAll("button[data-ver]").forEach((b) => b.classList.toggle("activo", b.dataset.ver === edad));
    nota.hidden = edad === "todo";
    if (edad !== "todo") document.getElementById(grupos[edad][0]).scrollIntoView({ behavior: "smooth", block: "start" });
  };
  filtroEdad.addEventListener("click", (e) => {
    const b = e.target.closest("[data-ver]");
    if (!b) return;
    e.preventDefault();
    ver(b.dataset.ver);
  });
}

// links con ancla a un curso (paquetes.html#teens, #horario-teens): los horarios se arman con JS y mueven la página,
// así que se vuelve a ubicar la sección sin animación (al cargar y otra vez cuando terminan de cargar las fotos)
const idAncla = location.hash && CSS.escape(decodeURIComponent(location.hash.slice(1)));
const ancla = idAncla && document.querySelector(`.af-grupo#${idAncla}, .af-horario#${idAncla}`);
if (ancla) {
  const ir = () => {
    document.documentElement.style.scrollBehavior = "auto";
    ancla.scrollIntoView({ block: "start" });
    document.documentElement.style.scrollBehavior = "";
  };
  ir();
  addEventListener("load", ir);
  setTimeout(ir, 800);
}

// menú en celular
const botonMenu = document.querySelector(".menu-btn");
if (botonMenu) {
  botonMenu.addEventListener("click", () => {
    const abierto = document.body.classList.toggle("menu-abierto");
    botonMenu.setAttribute("aria-expanded", String(abierto));
  });
}
