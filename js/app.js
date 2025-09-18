const urlProductos = "./json/productos.json";
const contenedor = document.getElementById("listaProductos");
const cantidadCarrito = document.getElementById("cantidadCarrito");
const buscador = document.getElementById("buscador");
const botonModo = document.getElementById("modo");
function traerLocal(clave) {
  try {
    return JSON.parse(localStorage.getItem(clave)) || null;
  } catch (e) {
    return null;
  }
}
function guardarLocal(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
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
function actualizarCarrito() {
  const c = traerLocal("carrito") || [];
  cantidadCarrito.textContent = c.reduce((s, i) => s + i.cant, 0);
}
async function pedirProductos() {
  try {
    const r = await fetch(urlProductos);
    const data = await r.json();
    return data;
  } catch (e) {
    return [];
  }
}
function mostrarProductos(lista) {
  contenedor.innerHTML = "";
  lista.forEach((p) => {
    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta";
    tarjeta.innerHTML = `<img src="${p.imagen}" alt="${p.nombre}"><h3>${p.nombre}</h3><p>${p.categoria} • $${p.precio}</p><div class="botones"><button class="boton principal" data-id="${p.id}">Agregar</button><a class="boton" href="paginas/producto.html?id=${p.id}">Ver</a></div>`;
    contenedor.appendChild(tarjeta);
  });
}
function agregarCarrito(id) {
  const carrito = traerLocal("carrito") || [];
  const idx = carrito.findIndex((x) => x.id === id);
  if (idx > -1) {
    carrito[idx].cant += 1;
  } else {
    carrito.push({ id, cant: 1 });
  }
  guardarLocal("carrito", carrito);
  actualizarCarrito();
}
contenedor.addEventListener("click", (e) => {
  const b = e.target.closest("button[data-id]");
  if (!b) return;
  const id = Number(b.getAttribute("data-id"));
  agregarCarrito(id);
});
function buscar(lista) {
  buscador.addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase();
    if (!q) {
      mostrarProductos(lista);
      return;
    }
    const res = lista.filter(
      (p) =>
        p.nombre.toLowerCase().includes(q) ||
        p.categoria.toLowerCase().includes(q)
    );
    mostrarProductos(res);
  });
}
function iniciar() {
  cargarTema();
  botonModo.addEventListener("click", cambiarTema);
  pedirProductos().then((productos) => {
    mostrarProductos(productos);
    buscar(productos);
  });
  actualizarCarrito();
}
iniciar();
