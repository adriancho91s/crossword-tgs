/**
 * Crucigrama de Teoría General de Sistemas
 * Interactive crossword puzzle for Systems Theory concepts
 * @author Adrián Gaitán
 * @version 1.0.0
 */

// Configuración de respuestas del crucigrama
const answers = {
    // Horizontales
    1: { word: "SISTEMA", row: 1, col: 1, direction: "across" },
    3: { word: "AMBIENTE", row: 3, col: 2, direction: "across" },
    5: { word: "ENERGIA", row: 5, col: 3, direction: "across" },
    7: { word: "ENTROPIA", row: 7, col: 1, direction: "across" },
    9: { word: "OUTPUT", row: 9, col: 4, direction: "across" },
    11: { word: "RETROALIMENTACION", row: 11, col: 1, direction: "across" },
    13: { word: "SINERGIA", row: 13, col: 2, direction: "across" },
    15: { word: "VIABILIDAD", row: 15, col: 1, direction: "across" },
    17: { word: "CAJANEGRA", row: 2, col: 8, direction: "across" },
    19: { word: "EQUILIBRIO", row: 4, col: 8, direction: "across" },
    
    // Verticales
    2: { word: "INPUT", row: 1, col: 7, direction: "down" },
    4: { word: "FRONTERA", row: 2, col: 3, direction: "down" },
    6: { word: "EMERGENCIA", row: 1, col: 5, direction: "down" },
    8: { word: "HOMEOSTASIS", row: 4, col: 1, direction: "down" },
    10: { word: "ATRIBUTOS", row: 6, col: 6, direction: "down" },
    12: { word: "RELACIONES", row: 8, col: 8, direction: "down" },
    14: { word: "NEGENTROPIA", row: 6, col: 12, direction: "down" },
    16: { word: "PERMEABILIDAD", row: 1, col: 14, direction: "down" },
    18: { word: "MODELO", row: 10, col: 10, direction: "down" },
    20: { word: "ELEMENTOS", row: 12, col: 4, direction: "down" }
};

// Variables globales
let grid = [];
let currentCell = null;

/**
 * Inicializa la grilla del crucigrama
 * Crea la estructura de datos y los elementos DOM
 */
function initializeGrid() {
    const gridElement = document.getElementById('crosswordGrid');
    
    // Inicializar array de la grilla con celdas negras por defecto
    grid = Array(15).fill().map(() => Array(15).fill({ 
        type: 'black', 
        value: '', 
        number: null 
    }));

    // Marcar celdas para las palabras
    Object.values(answers).forEach(answer => {
        for (let i = 0; i < answer.word.length; i++) {
            const row = answer.direction === 'across' ? answer.row : answer.row + i;
            const col = answer.direction === 'across' ? answer.col + i : answer.col;
            
            if (row < 15 && col < 15) {
                grid[row][col] = { 
                    type: 'white', 
                    value: '', 
                    answer: answer.word[i],
                    number: i === 0 ? Object.keys(answers).find(key => answers[key] === answer) : null
                };
            }
        }
    });

    // Crear las celdas en el DOM
    gridElement.innerHTML = '';
    for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = i;
            cell.dataset.col = j;

            if (grid[i][j].type === 'black') {
                cell.classList.add('black');
            } else {
                // Crear input para celdas blancas
                const input = document.createElement('input');
                input.maxLength = 1;
                input.addEventListener('input', handleInput);
                input.addEventListener('focus', handleFocus);
                input.addEventListener('keydown', handleKeyDown);
                cell.appendChild(input);

                // Agregar número si es necesario
                if (grid[i][j].number) {
                    const number = document.createElement('div');
                    number.className = 'number';
                    number.textContent = grid[i][j].number;
                    cell.appendChild(number);
                }
            }

            gridElement.appendChild(cell);
        }
    }
}

/**
 * Maneja el evento de entrada de texto en las celdas
 * @param {Event} event - Evento de input
 */
function handleInput(event) {
    const input = event.target;
    const cell = input.parentElement;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    
    // Convertir a mayúsculas y guardar en la grilla
    const value = input.value.toUpperCase();
    input.value = value;
    grid[row][col].value = value;
    
    // Actualizar progreso y mover a la siguiente celda
    updateProgress();
    
    if (value !== '') {
        moveToNextCell(row, col);
    }
}

/**
 * Maneja el evento de foco en las celdas
 * @param {Event} event - Evento de focus
 */
function handleFocus(event) {
    const cell = event.target.parentElement;
    
    // Remover clase activa de la celda anterior
    if (currentCell) {
        currentCell.classList.remove('active');
    }
    
    // Aplicar clase activa a la celda actual
    currentCell = cell;
    cell.classList.add('active');
}

/**
 * Maneja eventos de teclado para navegación
 * @param {Event} event - Evento de keydown
 */
function handleKeyDown(event) {
    const input = event.target;
    const cell = input.parentElement;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    switch (event.key) {
        case 'Backspace':
            if (input.value === '') {
                moveToPreviousCell(row, col);
            }
            break;
        case 'ArrowUp':
            event.preventDefault();
            moveInDirection(row, col, -1, 0);
            break;
        case 'ArrowDown':
            event.preventDefault();
            moveInDirection(row, col, 1, 0);
            break;
        case 'ArrowLeft':
            event.preventDefault();
            moveInDirection(row, col, 0, -1);
            break;
        case 'ArrowRight':
            event.preventDefault();
            moveInDirection(row, col, 0, 1);
            break;
    }
}

/**
 * Mueve el foco a la siguiente celda blanca
 * @param {number} row - Fila actual
 * @param {number} col - Columna actual
 */
function moveToNextCell(row, col) {
    // Buscar la siguiente celda blanca
    for (let i = row; i < 15; i++) {
        for (let j = (i === row ? col + 1 : 0); j < 15; j++) {
            if (grid[i][j].type === 'white') {
                const nextCell = document.querySelector(`[data-row="${i}"][data-col="${j}"] input`);
                if (nextCell) {
                    nextCell.focus();
                    return;
                }
            }
        }
    }
}

/**
 * Mueve el foco a la celda anterior
 * @param {number} row - Fila actual
 * @param {number} col - Columna actual
 */
function moveToPreviousCell(row, col) {
    // Buscar la celda blanca anterior
    for (let i = row; i >= 0; i--) {
        for (let j = (i === row ? col - 1 : 14); j >= 0; j--) {
            if (grid[i][j].type === 'white') {
                const prevCell = document.querySelector(`[data-row="${i}"][data-col="${j}"] input`);
                if (prevCell) {
                    prevCell.focus();
                    return;
                }
            }
        }
    }
}

/**
 * Mueve el foco en una dirección específica
 * @param {number} row - Fila actual
 * @param {number} col - Columna actual
 * @param {number} deltaRow - Cambio en fila
 * @param {number} deltaCol - Cambio en columna
 */
function moveInDirection(row, col, deltaRow, deltaCol) {
    let newRow = row + deltaRow;
    let newCol = col + deltaCol;

    // Buscar la siguiente celda blanca en la dirección especificada
    while (newRow >= 0 && newRow < 15 && newCol >= 0 && newCol < 15) {
        if (grid[newRow][newCol].type === 'white') {
            const targetCell = document.querySelector(`[data-row="${newRow}"][data-col="${newCol}"] input`);
            if (targetCell) {
                targetCell.focus();
                return;
            }
        }
        newRow += deltaRow;
        newCol += deltaCol;
    }
}

/**
 * Verifica las respuestas del crucigrama
 * Muestra feedback visual y estadísticas
 */
function checkAnswers() {
    let correct = 0;
    let total = 0;

    // Verificar cada celda
    for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
            if (grid[i][j].type === 'white') {
                total++;
                const cell = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
                
                if (grid[i][j].value === grid[i][j].answer) {
                    correct++;
                    cell.classList.add('correct');
                } else {
                    cell.classList.remove('correct');
                }
            }
        }
    }

    // Mostrar resultado
    const percentage = Math.round((correct / total) * 100);
    let message = `¡Has completado ${correct} de ${total} letras correctamente! (${percentage}%)`;
    
    if (percentage === 100) {
        message += '\n\n🎉 ¡Felicitaciones! Has completado el crucigrama perfectamente. 🎉';
    } else if (percentage >= 80) {
        message += '\n\n¡Excelente trabajo! Estás muy cerca de completarlo.';
    } else if (percentage >= 60) {
        message += '\n\n¡Buen progreso! Sigue intentando.';
    } else {
        message += '\n\nSigue esforzándote, ¡puedes hacerlo mejor!';
    }

    alert(message);
}

/**
 * Limpia toda la grilla del crucigrama
 * Remueve todos los valores ingresados y clases de estado
 */
function clearGrid() {
    for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
            if (grid[i][j].type === 'white') {
                const input = document.querySelector(`[data-row="${i}"][data-col="${j}"] input`);
                if (input) {
                    input.value = '';
                    grid[i][j].value = '';
                }
                
                const cell = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
                cell.classList.remove('correct');
            }
        }
    }
    updateProgress();
}

/**
 * Actualiza la barra de progreso del crucigrama
 * Calcula el porcentaje de palabras completas
 */
function updateProgress() {
    let completed = 0;
    let total = 0;

    // Verificar cada palabra completa
    Object.values(answers).forEach(answer => {
        let wordComplete = true;
        
        for (let i = 0; i < answer.word.length; i++) {
            const row = answer.direction === 'across' ? answer.row : answer.row + i;
            const col = answer.direction === 'across' ? answer.col + i : answer.col;
            
            if (row < 15 && col < 15) {
                if (grid[row][col].value !== answer.word[i]) {
                    wordComplete = false;
                    break;
                }
            }
        }
        
        if (wordComplete) completed++;
        total++;
    });

    // Actualizar elementos de progreso
    const percentage = Math.round((completed / total) * 100);
    document.getElementById('progressFill').style.width = percentage + '%';
    document.getElementById('progressText').textContent = `Progreso: ${completed}/${total} palabras completadas`;
}

/**
 * Función para mostrar una pista específica (función adicional)
 * @param {number} clueNumber - Número de la pista
 */
function showHint(clueNumber) {
    if (answers[clueNumber]) {
        const answer = answers[clueNumber];
        const firstLetter = answer.word[0];
        const row = answer.row;
        const col = answer.col;
        
        const input = document.querySelector(`[data-row="${row}"][data-col="${col}"] input`);
        if (input && !input.value) {
            input.value = firstLetter;
            grid[row][col].value = firstLetter;
            updateProgress();
        }
    }
}

/**
 * Inicialización del crucigrama al cargar la página
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeGrid();
});

// Compatibilidad con window.onload (mantenido por retrocompatibilidad)
window.onload = function() {
    if (document.getElementById('crosswordGrid').children.length === 0) {
        initializeGrid();
    }
};
