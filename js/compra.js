const botonModo = document.getElementById("modo")
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
cargarTema();
botonModo.addEventListener("click", cambiarTema)