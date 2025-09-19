const botonModo = document.getElementById("modo")
function traerLocal(c) {
  try {
    return JSON.parse(localStorage.getItem(c)) || null;
  } catch (e) {
    return null;
  }
}
function guardarLocal(c, v) {
  localStorage.setItem(c, JSON.stringify(v));
}
function cargarTema() {
  const t = localStorage.getItem("tema");
  if (t) document.documentElement.setAttribute("data-tema", t);
}
function cambiarTema() {
  const actual = document.documentElement.getAttribute("data-tema");
  const nuevo = actual === "oscuro" ? "" : "oscuro";
  if (nuevo) document.documentElement.setAttribute("data-tema", nuevo);
  else document.documentElement.removeAttribute("data-tema");
  localStorage.setItem("tema", nuevo);
}
async function mostrar() {
  const params = new URLSearchParams(location.search);
  const id = Number(params.get("id"));
  const r = await fetch("../json/productos.json");
  const productos = await r.json();
  const p = productos.find((x) => x.id === id);
  const cont = document.getElementById("detalle");
  if (!p) {
    cont.innerHTML = "<p>No encontrado</p>";
    return;
  }
  cont.innerHTML = `<article class="tarjeta"><img src="${p.imagen}" alt="${p.nombre}"><h2>${p.nombre}</h2><p>${p.descripcion}</p><p>Precio: $${p.precio}</p><div class="botones"><button id="agregar">Agregar</button></div></article>`;
  document.getElementById("agregar").addEventListener("click", () => {
    const carrito = traerLocal("carrito") || [];
    const idx = carrito.findIndex((x) => x.id === p.id);
    if (idx > -1) carrito[idx].cant += 1;
    else carrito.push({ id: p.id, cant: 1 });
    guardarLocal("carrito", carrito);
    alert("Agregado");
  });
}
cargarTema();
botonModo.addEventListener("click", cambiarTema)
mostrar();
