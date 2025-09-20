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
const form = document.getElementById("formCompra");

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault(); 

    document.querySelectorAll(".error").forEach(el => el.textContent = "");

    let valido = true;

    const nombre = document.getElementById("nombre").value.trim();
    if (nombre === "") {
      document.getElementById("errorNombre").textContent = "El nombre es obligatorio";
      valido = false;
    }
    const email = document.getElementById("email").value.trim();
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
      document.getElementById("errorEmail").textContent = "Correo no válido";
      valido = false;
    }

    const direccion = document.getElementById("direccion").value.trim();
    if (direccion === "") {
      document.getElementById("errorDireccion").textContent = "La dirección es obligatoria";
      valido = false;
    }

    const tarjeta = document.getElementById("tarjeta").value.trim();
    const regexTarjeta = /^\d{16}$/;
    if (!regexTarjeta.test(tarjeta)) {
      document.getElementById("errorTarjeta").textContent = "La tarjeta debe tener 16 dígitos";
      valido = false;
    }

    if (valido) {
      alert("✅ Compra confirmada. ¡Gracias por su compra!");
      form.reset();
    }
  });
}
botonModo.addEventListener("click", cambiarTema)
cargarTema();