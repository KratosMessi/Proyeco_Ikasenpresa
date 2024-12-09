let todosLosNumeros = Array.from({ length: 99 }, (_, i) => i + 1); // Números del 1 al 99
let numerosExtraidos = [];
let cartulinas = [];
let idIntervalo;
let operacionActual = '';
let resultadoActual = 0;

// Iniciar el juego
function iniciarJuego() {
    if (idIntervalo) clearInterval(idIntervalo);
    todosLosNumeros = Array.from({ length: 99 }, (_, i) => i + 1); // Reiniciar los números
    numerosExtraidos = [];
    document.getElementById('operacionActual').innerHTML = '';
    let cantidadCartulinas = parseInt(prompt('¿Cuántas cartulinas deseas?'));
    crearCartulinas(cantidadCartulinas);
    idIntervalo = setInterval(extraerOperacion, 10000);
}

// Crear cartulinas de 3 filas
function crearCartulinas(cantidad) {
    let contenedorCartulinas = document.getElementById('cartulinas');
    contenedorCartulinas.innerHTML = '';
    cartulinas = [];

    for (let c = 0; c < cantidad; c++) {
        let cartulina = document.createElement('table');
        cartulina.className = 'cartulina';
        let numeros = [];

        // Mezclar todos los números y seleccionar 15 para la cartulina
        let numerosSeleccionados = [];
        while (numerosSeleccionados.length < 15) {
            let numAleatorio = Math.floor(Math.random() * todosLosNumeros.length);
            numerosSeleccionados.push(todosLosNumeros[numAleatorio]);
            todosLosNumeros.splice(numAleatorio, 1); // Eliminar el número seleccionado para evitar repeticiones
        }

        // Ordenar los números seleccionados antes de agregarlos al cartón
        numerosSeleccionados.sort((a, b) => a - b);

        let bloqueadasPorFila = [4, 4, 4]; // 4 celdas bloqueadas por fila
        let numeroActual = 0; // Índice para el número seleccionado

        for (let i = 0; i < 3; i++) { // 3 filas
            let fila = document.createElement('tr');
            let bloqueadas = [];

            // Generar posiciones de celdas bloqueadas
            while (bloqueadas.length < bloqueadasPorFila[i]) {
                let indice = Math.floor(Math.random() * 9); // Cambiado a 9 columnas
                if (!bloqueadas.includes(indice)) {
                    bloqueadas.push(indice);
                }
            }

            for (let j = 0; j < 9; j++) { // 9 columnas
                let celda = document.createElement('td');
                if (bloqueadas.includes(j)) {
                    celda.style.backgroundColor = '#ddd'; // Color para indicar bloqueada
                    celda.innerHTML = ''; // Sin número
                } else {
                    // Asignar un número ordenado
                    celda.innerHTML = numerosSeleccionados[numeroActual++];
                    numeros.push(numerosSeleccionados[numeroActual - 1]);
                    celda.onclick = function () {
                        marcarNumero(celda, celda.innerHTML, c);
                    };
                }
                fila.appendChild(celda);
            }
            cartulina.appendChild(fila);
        }
        cartulinas.push(numeros);
        contenedorCartulinas.appendChild(cartulina);
    }
}

// Extraer y mostrar una operación matemática cada 10 segundos
function extraerOperacion() {
    if (numerosExtraidos.length >= 99) {
        clearInterval(idIntervalo);
        alert('¡Se han extraído todos los números!');
        return;
    }

    let operacion = generarOperacion();
    resultadoActual = operacion.resultado; // El resultado de la operación
    operacionActual = operacion.textoOperacion; // La operación a mostrar

    // Asegurarse de que el resultado no se haya extraído anteriormente
    if (!numerosExtraidos.includes(resultadoActual) && resultadoActual >= 1 && resultadoActual <= 99) {
        numerosExtraidos.push(resultadoActual);
        mostrarOperacionActual(operacionActual);
    } else {
        extraerOperacion(); // Volver a extraer si ya fue extraído
    }
}

// Generar una operación aleatoria (suma, resta, multiplicación o división)
function generarOperacion() {
    let num1, num2, resultado, textoOperacion;
    let tipoOperacion = Math.floor(Math.random() * 4); // 0: suma, 1: resta, 2: multiplicación, 3: división

    switch (tipoOperacion) {
        case 0: // Suma
            num1 = Math.floor(Math.random() * 50) + 1;
            num2 = Math.floor(Math.random() * 50) + 1;
            resultado = num1 + num2;
            textoOperacion = `${num1} + ${num2}`;
            break;
        case 1: // Resta
            num1 = Math.floor(Math.random() * 50) + 1;
            num2 = Math.floor(Math.random() * 50) + 1;
            resultado = num1 - num2;
            textoOperacion = `${num1} - ${num2}`;
            break;
        case 2: // Multiplicación
            num1 = Math.floor(Math.random() * 12) + 1;
            num2 = Math.floor(Math.random() * 12) + 1;
            resultado = num1 * num2;
            textoOperacion = `${num1} * ${num2}`;
            break;
        case 3: // División
            do {
                num1 = Math.floor(Math.random() * 100) + 1;
                num2 = Math.floor(Math.random() * 10) + 1;
            } while (num1 % num2 !== 0); // Asegurarse de que el resultado es un entero
            resultado = num1 / num2;
            textoOperacion = `${num1} / ${num2}`;
            break;
    }

    return { textoOperacion, resultado };
}

// Mostrar operación actual y ocultarla después de 4 segundos
function mostrarOperacionActual(textoOperacion) {
    let mostrar = document.getElementById('operacionActual');
    mostrar.innerHTML = textoOperacion;
    setTimeout(() => {
        mostrar.innerHTML = '';
    }, 4000);
}

// Marcar un número en la cartulina
function marcarNumero(celda, numero, indiceCartulina) {
    if (numero == resultadoActual) {
        celda.style.backgroundColor = 'green';
        verificarLineaOBingo(indiceCartulina);
    }
}

// Comprobar si hay una línea o bingo
function verificarLineaOBingo(indiceCartulina) {
    let cartulina = document.getElementsByClassName('cartulina')[indiceCartulina];
    let filas = cartulina.getElementsByTagName('tr');

    let linea = false, bingo = true;

    for (let i = 0; i < 3; i++) {
        let filaCompleta = true;
        let columnaCompleta = true;

        for (let j = 0; j < 9; j++) {
            if (filas[i].children[j].style.backgroundColor !== 'green') {
                filaCompleta = false;
            }
            if (filas[j].children[i].style.backgroundColor !== 'green') {
                columnaCompleta = false;
            }
        }

        if (filaCompleta || columnaCompleta) {
            linea = true;
            break;
        }
    }

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 9; j++) {
            if (filas[i].children[j].style.backgroundColor !== 'green') {
                bingo = false;
            }
        }
    }

    if (linea) {
        alert('¡Línea! Felicidades, has marcado una línea.');
    }
    if (bingo) {
        clearInterval(idIntervalo);
        alert('¡Bingo! Felicidades, has ganado.');
    }
}