// 1. Capturamos los elementos de texto de tu HTML
//Declara una constante y guarda la referencia al elemento HTML cuyo id es "usuario-elegir", para poder cambiar su contenido luego.
const usuarioElegirTxt = document.getElementById('usuario-elegir');
//Apunta al elemento con id "ordenador-elige" para mostrar la elección del ordenador.
const ordenadorEligeTxt = document.getElementById('ordenador-elige');
//Guarda la referencia al elemento con id "outcome", donde se mostrará el resultado del juego.
const outcomeTxt = document.getElementById('outcome');

// 2. Capturamos tus tres botones
// Selecciona todos los elementos del DOM con la clase "choice" y devuelve una NodeList con esos botones.
const botones = document.querySelectorAll('.choice');

// Array con las opciones en minúsculas (coincidiendo con los IDs de tu HTML)
//Declara un array con las tres opciones válidas del juego, en minúsculas; se usa para lógica y para elección aleatoria.
const opciones = ['piedra', 'papel', 'tijera'];

// 3. Añadimos el evento 'click'
//— Inicia un bucle que itera sobre cada botón en la NodeList para añadirles un listener.
botones.forEach(boton => {
    boton.addEventListener('click', (e) => {
        // LEEMOS EL ID DEL BOTÓN (piedra, papel o tijera) en vez del texto visible
        const eleccionUsuario = e.target.id;

        // Generamos la elección del ordenador (también en minúsculas)
        const eleccionOrdenador = generarEleccionOrdenador();

        // Mostramos las elecciones en el HTML (usamos formato bonito para la pantalla)
        usuarioElegirTxt.textContent = `Tu elección: ${capitalizar(eleccionUsuario)}`;
        ordenadorEligeTxt.textContent = `Elección de la computadora: ${capitalizar(eleccionOrdenador)}`;

        // Calculamos quién gana
        const resultadoFinal = determinarGanador(eleccionUsuario, eleccionOrdenador);
        outcomeTxt.textContent = `Resultado: ${resultadoFinal}`;
    });
});

// Función para elegir al azar
function generarEleccionOrdenador() {
    const indiceAleatorio = Math.floor(Math.random() * opciones.length);
    return opciones[indiceAleatorio];
}

// Función con las reglas del juego 
//Comprueba si ambas elecciones son iguales.Si son iguales, devuelve la cadena que indica empate.
function determinarGanador(usuario, ordenador) {
    if (usuario === ordenador) {
        return "¡Empate! 🤝";
    }
    //Inicio de la condición que cubre los casos en que el usuario gana.
    if (
        (usuario === 'piedra' && ordenador === 'tijera') ||//Caso: piedra vence a tijera
        (usuario === 'papel' && ordenador === 'piedra') ||//Caso: papel vence a piedra
        (usuario === 'tijera' && ordenador === 'papel') 
    ) {
        return "¡Ganaste! 🏆";
    } else {
        return "Perdiste... 💀";
    }
}

// Función extra solo para poner la primera letra en mayúscula al pintar el texto
function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}
