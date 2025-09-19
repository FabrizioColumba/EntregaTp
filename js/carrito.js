const listaCarrito = document.getElementById("listaCarrito");
const formulario = document.getElementById("formulario");
const botonModo = document.getElementById("modo")
function traerLocal(c) {
  try {
    return JSON.parse(localStorage.getItem(c)) || null;
  } catch (e) {
    return null;
  }
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
function guardarLocal(c, v) {
  localStorage.setItem(c, JSON.stringify(v));
}
async function cargarCarrito() {
  const carrito = traerLocal("carrito") || [];
  if (!carrito.length) {
    listaCarrito.innerHTML = "<p>Carrito vacío</p>";
    return;
  }
  const resp = await fetch("../json/productos.json");
  const productos = await resp.json();
  const items = carrito.map((c) => {
    const p = productos.find((x) => x.id === c.id);
    return { ...p, cant: c.cant };
  });
  listaCarrito.innerHTML = "";
  items.forEach((it) => {
    const el = document.createElement("div");
    el.className = "tarjeta";
    el.innerHTML = `
    <img src="${it.imagen}" alt="${it.nombre}" style="width:100px; height:100px; object-fit:cover; border-radius:6px;">
    <h4>${it.nombre}</h4>
    <p>$${it.precio} x ${it.cant}</p>
    <div class="botones">
    <button data-id="${it.id}" class="boton">-</button>
    <button data-id="${it.id}" class="boton">+</button>
    </div>
    `;
    const total = items.reduce((acc, it) => acc + it.precio * it.cant, 0);

    document.getElementById("totalCarrito").innerHTML = `
    <h3>Total de la compra: $${total}</h3>
    `;
    listaCarrito.appendChild(el);
  });
}
listaCarrito.addEventListener("click", (e) => {
  const b = e.target.closest("button[data-id]");
  if (!b) return;
  const id = Number(b.getAttribute("data-id"));
  const carrito = traerLocal("carrito") || [];
  const idx = carrito.findIndex((x) => x.id === id);
  if (idx === -1) return;
  if (b.textContent === "+") {
    carrito[idx].cant++;
  } else {
    carrito[idx].cant--;
    if (carrito[idx].cant <= 0) carrito.splice(idx, 1);
  }
  guardarLocal("carrito", carrito);
  cargarCarrito();
});
formulario.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    nombre: formulario.nombre.value,
    correo: formulario.correo.value,
    tel: formulario.tel.value,
    pago: formulario.pago.value,
    carrito: traerLocal("carrito") || [],
  };
  try {
    await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    localStorage.removeItem("carrito");
    await cargarCarrito();
    alert("Compra simulada");
  } catch (err) {
    alert("Error al enviar");
  }
});
cargarTema();
botonModo.addEventListener("click", cambiarTema)
cargarCarrito();
