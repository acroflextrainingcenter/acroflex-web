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
    suelta: { slug: "clase-suelta-flexipower", precio: 50 },
    extra: { titulo: "Intensivo de sábado", texto: "4 clases intensivas de 1 h 30 min por S/ 250 · o 1 clase por S/ 60", slug: "flexipower-intensivo-4" },
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

function soles(n) { return "S/ " + (Number.isInteger(n) ? n : n.toFixed(2)); }

function htmlHorario(curso) {
  const h = HORARIOS[curso];
  const dias = DIAS.map((dia, i) => {
    const turnos = h.turnos.filter((t) => t[0] === i);
    const horas = turnos.length
      ? turnos.map((t) => `<span class="hora${t[3] ? " int" : ""}">${t[1]}<small>${t[3] ? "Intensivo · " : ""}hasta ${t[2]}</small></span>`).join("")
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
      <div class="precio"><small>S/</small>${pl.precio}</div>
      <span class="xclase">${soles(Math.round(pl.precio / pl.n * 100) / 100)} por clase</span>
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
    ? `<div class="extra-row"><div class="extra" style="grid-column:1/-1"><div><b>${p.extra.titulo}</b><span>${p.extra.texto}</span></div><span style="display:flex;gap:16px;flex-wrap:wrap"><a href="${COMPRAR + p.extra.slug}">Comprar paquete →</a>${p.extra.slug2 ? `<a href="${COMPRAR + p.extra.slug2}">Comprar 1 clase →</a>` : ""}</span></div></div>`
    : "";
  return `<div class="planes">${planes + suelta}</div>${extra}`;
}

// <div data-bloque="horario|precio" data-curso="adultos" [data-tabs]></div>
function montarBloque(el) {
  const tipo = el.dataset.bloque;
  const pintar = (curso) => { cuerpo.innerHTML = tipo === "horario" ? htmlHorario(curso) : htmlPrecios(curso); };
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
  pintar(el.dataset.curso || "adultos");
}

document.querySelectorAll("[data-bloque]").forEach(montarBloque);

// menú en celular
const botonMenu = document.querySelector(".menu-btn");
if (botonMenu) {
  botonMenu.addEventListener("click", () => {
    const abierto = document.body.classList.toggle("menu-abierto");
    botonMenu.setAttribute("aria-expanded", String(abierto));
  });
}
