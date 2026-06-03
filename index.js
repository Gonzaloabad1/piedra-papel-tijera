// ==========================================
// 1. SELECCIÓN DE ELEMENTOS DEL HTML
// ==========================================

// Selecciona el párrafo donde se mostrará el texto con la elección del jugador 
const usuarioElegirTxt = document.getElementById('usuario-elegir');

// Selecciona el párrafo donde se mostrará el estado o la elección final de la máquina.
const ordenadorEligeTxt = document.getElementById('ordenador-elige');

// Selecciona el contenedor de texto asignado para ver el veredicto de cada ronda o el ganador final.
const outcomeTxt = document.getElementById('outcome');

// Selecciona el elemento de texto que reflejará los segundos empleados por el usuario.
const tiempoUsuarioTxt = document.getElementById('tiempo-usuario');

// Selecciona el elemento de texto que reflejará el tiempo de reacción simulado de la máquina.
const tiempoOrdenadorTxt = document.getElementById('tiempo-ordenador');

// Almacena en una lista (NodeList) los tres botones interactivos de ataque (.elegir button).
const botones = document.querySelectorAll('.elegir button');

// Selecciona el espacio del HTML donde se renderizan los puntos acumulados por el usuario.
const puntosUsuarioTxt = document.getElementById('puntos-usuario');

// Selecciona el espacio del HTML donde se renderizan los puntos acumulados por el ordenador.
const puntosOrdenadorTxt = document.getElementById('puntos-ordenador');

// Selecciona el botón oculto destinado a resetear la partida por completo.
const btnReiniciar = document.getElementById('btn-reiniciar');

// Array de strings que define los tres movimientos válidos para mapear la jugada aleatoria.
const opciones = ['piedra', 'papel', 'tijera'];

// Guarda la marca de tiempo (en milisegundos) exacta en la que se carga el script o inicia el turno del jugador.
let tiempoInicioJugador = Date.now(); 

// Variable numérica encargada de rastrear y acumular los puntos del usuario.
let puntosUsuario = 0;

// Variable numérica encargada de rastrear y acumular los puntos de la máquina.
let puntosOrdenador = 0;

// Constante fija que determina el límite de puntos necesarios para dar por terminado el juego.
const PUNTOS_MAXIMOS = 5;


// ==========================================
// 2. DETECTOR DE CLICS (FLUJO DEL JUEGO)
// ==========================================

// Bucle que recorre la lista de botones para asociarles de manera individual el evento de juego.
botones.forEach(boton => {
    // Escucha activamente el clic del usuario en cualquiera de los tres botones de cartas.
    boton.addEventListener('click', (e) => {
        
        // Bloquea los tres botones principales poniéndolos en 'disabled' para impedir múltiples clics abusivos.
        botones.forEach(b => b.disabled = true);

        // --- CÁLCULO TIEMPO JUGADOR ---
        // Captura el milisegundo exacto en el que el usuario hace clic eficazmente.
        const tiempoFinJugador = Date.now(); 
        
        // Resta el tiempo final menos el inicial, divide entre 1000 para pasar a segundos y clava 2 decimales.
        const tiempoTotalJugador = ((tiempoFinJugador - tiempoInicioJugador) / 1000).toFixed(2);
        
        // Imprime en pantalla el tiempo final que tardó el jugador en reaccionar.
        tiempoUsuarioTxt.textContent = `Tiempo del jugador: ${tiempoTotalJugador}s`;

        // Extrae el atributo 'id' ('piedra', 'papel' o 'tijera') de la etiqueta del botón pulsado.
        const eleccionUsuario = e.currentTarget.id;
        
        // Escribe la elección formateada estéticamente en la interfaz del usuario.
        usuarioElegirTxt.textContent = `👨🏻Usuario: ${capitalizar(eleccionUsuario)}`;

        // Cambia el texto del ordenador indicando un estado de espera simulado ("Pensando...").
        ordenadorEligeTxt.textContent = `🤖Ordenador: Pensando... 🤔`;
        
        // Informa en el resultado que la resolución de la ronda está momentáneamente en espera.
        outcomeTxt.textContent = `Resultado: Esperando...`;

        // --- INICIO TIEMPO MÁQUINA ---
        // Registra el punto de inicio del cronómetro interno de la máquina justo antes de entrar al retardo.
        const tiempoInicioMaquina = Date.now(); 

        // Crea una pausa asíncrona forzada de 1 segundo (1000ms) para dar realismo a la jugada de la máquina.
        setTimeout(() => {
            // Ejecuta la función aleatoria y guarda la jugada obtenida por el ordenador.
            const eleccionOrdenador = elegirMaquina();
            
            // Muestra en la interfaz visual cuál fue el ataque que seleccionó la máquina de forma aleatoria.
            ordenadorEligeTxt.textContent = `🤖Ordenador: ${capitalizar(eleccionOrdenador)}`;

            // --- CÁLCULO TIEMPO MÁQUINA ---
            // Captura el instante preciso en el que finaliza el bloque setTimeout de un segundo.
            const tiempoFinMaquina = Date.now(); 
            
            // Calcula los segundos netos consumidos por el proceso de la IA y restringe el string a 2 decimales.
            const tiempoTotalMaquina = ((tiempoFinMaquina - tiempoInicioMaquina) / 1000).toFixed(2);
            
            // Muestra en la pantalla del juego el tiempo de respuesta finalizado de la máquina.
            tiempoOrdenadorTxt.textContent = `Tiempo de la máquina: ${tiempoTotalMaquina}s`;

            // Ejecuta las reglas de combate usando las elecciones de ambos y almacena el string del veredicto.
            const resultado = comprobarGanador(eleccionUsuario, eleccionOrdenador);
            
            // Ejecuta la función interna para sumar los puntos en memoria y actualizar los textos del marcador.
            actualizarPuntuacion(resultado);

            // Estructura condicional que evalúa si alguna de las dos puntuaciones ya alcanzó o superó el límite de 5.
            if (puntosUsuario >= PUNTOS_MAXIMOS || puntosOrdenador >= PUNTOS_MAXIMOS) {
                // Al cumplirse el tope de puntos, invoca la rutina que cierra el juego e imprime al ganador final.
                declararGanadorFinal();
            } else {
                // Si nadie llega a los 5 puntos, actualiza el mensaje indicando quién ganó esta ronda específica.
                outcomeTxt.textContent = `Resultado: ${resultado}`;
                
                // Devuelve los botones de juego a su estado normal eliminando el bloqueo.
                botones.forEach(b => b.disabled = false);
                
                // Almacena un nuevo instante de inicio para que el cronómetro del usuario comience limpio en la siguiente ronda.
                tiempoInicioJugador = Date.now();
            }
            
        }, 1000); // Fin del retraso controlado de 1000 milisegundos.
    });
});

// Asigna un escuchador de eventos al botón de reinicio para reconfigurar todo el entorno al hacer clic.
btnReiniciar.addEventListener('click', reiniciarPartida);


// ==========================================
// 3. FUNCIONES LÓGICAS Y AUXILIARES
// ==========================================

// Función encargada de decidir aleatoriamente la jugada que hará el ordenador.
function elegirMaquina() {
    // Genera un decimal aleatorio, lo multiplica por 3 y redondea hacia abajo para obtener un índice (0, 1 o 2).
    const indiceAleatorio = Math.floor(Math.random() * opciones.length);
    
    // Retorna el elemento almacenado en esa posición del array ('piedra', 'papel' o 'tijera').
    return opciones[indiceAleatorio]; 
}

// Función encargada de validar las reglas básicas de enfrentamiento del juego clásico.
function comprobarGanador(usuario, ordenador) {
    // Compara si los dos valores de texto recibidos son exactamente idénticos.
    if (usuario === ordenador) {
        return "¡Empate! 🤝"; // Devuelve el string que activará el doble punto simultáneo.
    }
    
    // Comprueba de forma estricta las 3 combinaciones de éxito posibles donde el usuario derrota al ordenador.
    if (
        (usuario === 'piedra' && ordenador === 'tijera') ||
        (usuario === 'papel' && ordenador === 'piedra') ||
        (usuario === 'tijera' && ordenador === 'papel')
    ) {
        return "¡Ganaste! 🏆"; // Devuelve el string que certifica la victoria del jugador humano.
    } else {
        return "Perdiste... 💀"; // Si no es empate ni victoria del usuario, por descarte absoluto es derrota.
    }
}

// Función encargada de sumar la puntuación en base al veredicto de texto devuelto por la ronda.
function actualizarPuntuacion(resultado) {
    // Si el mensaje equivale a victoria del jugador, añade una unidad a su marcador individual.
    if (resultado === "¡Ganaste! 🏆") {
        puntosUsuario++;
    // Si el mensaje equivale a derrota, añade una unidad al marcador individual de la computadora.
    } else if (resultado === "Perdiste... 💀") {
        puntosOrdenador++;
    // Si el mensaje de la ronda equivale a un empate, añade una unidad a ambos lados de forma simultánea.
    } else if (resultado === "¡Empate! 🤝") {
        puntosUsuario++;
        puntosOrdenador++;
    }
    
    // Sobreescribe el texto del HTML del marcador del usuario reflejando el nuevo número actualizado.
    puntosUsuarioTxt.textContent = `👨🏻 Marcador: ${puntosUsuario}`;
    
    // Sobreescribe el texto del HTML del marcador del ordenador reflejando el nuevo número actualizado.
    puntosOrdenadorTxt.textContent = `${puntosOrdenador} 🤖`;
}

// Función que detiene el flujo regular del juego al alcanzarse la meta crítica de los 5 puntos.
function declararGanadorFinal() {
    // Desactiva definitivamente los botones de ataque para evitar interacciones post-partida.
    botones.forEach(b => b.disabled = true);
    
    // Evalúa si tras la última ronda los puntajes concluyeron idénticos (ej. un empate en la ronda final yendo 4-4).
    if (puntosUsuario === puntosOrdenador) {
        outcomeTxt.innerHTML = `<strong>PARTIDA FINALIZADA: ¡Empate absoluto a ${puntosUsuario} puntos! 🤝💥</strong>`;
    // Comprueba si el marcador del usuario superó la barrera y es estrictamente mayor que el de la máquina.
    } else if (puntosUsuario >= PUNTOS_MAXIMOS && puntosUsuario > puntosOrdenador) {
        outcomeTxt.innerHTML = `<strong>PARTIDA FINALIZADA: ¡El Usuario es el campeón definitivo! 👑🏆</strong>`;
    // Si la máquina tiene mayor puntuación, ejecuta el escenario de derrota absoluta.
    } else {
        outcomeTxt.innerHTML = `<strong>PARTIDA FINALIZADA: ¡La máquina te ha derrotado! 🤖🚨</strong>`;
    }

    // Altera el CSS inline del botón de reinicio cambiando su estado de oculto a bloque visible en pantalla.
    btnReiniciar.style.display = 'block';
}

// Función encargada de purgar todo el estado del script y de la interfaz para iniciar una mesa limpia.
function reiniciarPartida() {
    // Devuelve el contador interno de puntos del usuario a su valor por defecto inicial (0).
    puntosUsuario = 0;
    
    // Devuelve el contador interno de puntos del ordenador a su valor por defecto inicial (0).
    puntosOrdenador = 0;
    
    // Blanquea el texto en pantalla del marcador del jugador.
    puntosUsuarioTxt.textContent = `👨🏻 Marcador: 0`;
    
    // Blanquea el texto en pantalla del marcador del ordenador.
    puntosOrdenadorTxt.textContent = `0 🤖`;
    
    // Restablece el indicador textual de la jugada del usuario a su estado neutro por defecto.
    usuarioElegirTxt.textContent = `👨🏻Usuario: `;
    
    // Restablece el indicador textual de la jugada de la máquina a su estado neutro por defecto.
    ordenadorEligeTxt.textContent = `🤖Ordenador: `;
    
    // Vacía el contenedor del veredicto de resultados de la pantalla.
    outcomeTxt.textContent = `Resultado: `;
    
    // Setea el texto visible del cronómetro del jugador de vuelta a su posición base (0.00s).
    tiempoUsuarioTxt.textContent = `Tiempo del jugador: 0.00s`;
    
    // Setea el texto visible del cronómetro de la máquina de vuelta a su posición base (0.00s).
    tiempoOrdenadorTxt.textContent = `Tiempo de la máquina: 0.00s`;
    
    // Oculta de la vista el botón de reinicio alterando su propiedad display a 'none'.
    btnReiniciar.style.display = 'none';
    
    // Habilita nuevamente los tres botones de interacción principal removiendo el bloqueo del 'disabled'.
    botones.forEach(b => b.disabled = false);
    
    // Guarda el milisegundo base exacto para que el cronómetro de la nueva primera ronda compute de forma limpia.
    tiempoInicioJugador = Date.now();
}

// Función cosmética auxiliar para tomar la primera letra de un string, pasarla a mayúscula y pegarle el resto del texto.
function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}
