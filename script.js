
document.addEventListener('DOMContentLoaded', function() {
    var infoModal = document.getElementById('infoModal');
    var closeModalButton = document.getElementById('closeModal');

    closeModalButton.addEventListener('click', function() {
        infoModal.style.display = 'none';
    });
});


let running = false;
let intervalId;
let currentBatch = 0;
let totalProbability = 0;
let successfulWalks = 0;
let numIterations = 100000;
const batchSize = 10000;

document.getElementById('runSimulation').addEventListener('click', startSimulation);
document.getElementById('stopSimulation').addEventListener('click', stopSimulation);
document.getElementById('resetSimulation').addEventListener('click', resetSimulation);

function startSimulation() {
    numIterations = parseInt(document.getElementById('iterations').value);
    running = true;
    processBatch();
    if (!intervalId) {
        intervalId = setInterval(processBatch, 1000);
    }
}

function stopSimulation() {
    running = false;
    clearInterval(intervalId);
    intervalId = null;
}

function resetSimulation() {
    stopSimulation();
    currentBatch = 0;
    totalProbability = 0;
    successfulWalks = 0;
    document.getElementById('result').innerText = '';
    const canvas = document.getElementById('walkCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function processBatch() {
    if (!running) return;

    const numSteps = 10;
    const numBatches = Math.ceil(numIterations / batchSize);
    const canvas = document.getElementById('walkCanvas');
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = 'rgba(0, 0, 255, 0.5)';  // Líneas semitransparentes

    for (let i = 0; i < batchSize && (currentBatch * batchSize + i) < numIterations; i++) {
        const result = simulateWalk(numSteps);
        if (result.success) {
            successfulWalks++;
        }
        if (currentBatch === 0) {  // Dibujar solo el primer lote para visualizar el recorrido
            drawWalk(result.path, ctx);
        }
    }

    currentBatch++;
    if (currentBatch >= numBatches) {
        const probability = (successfulWalks / numIterations) * 100;
        document.getElementById('result').innerText = `Probabilidad de estar a dos calles de distancia después de 10 pasos: ${probability.toFixed(2)}%`;
        currentBatch = 0;  // Reiniciar el lote
        successfulWalks = 0;  // Reiniciar los caminatas exitosas
    }
}

function simulateWalk(numSteps) {
    let x = 0;
    let y = 0;
    const path = [{ x: 250, y: 250 }];  // Ruta para el dibujo

    for (let i = 0; i < numSteps; i++) {
        const direction = Math.floor(Math.random() * 4);

        switch (direction) {
            case 0: y++; break;  // Norte
            case 1: y--; break;  // Sur
            case 2: x++; break;  // Este
            case 3: x--; break;  // Oeste
        }

        if (i < 10) {  // Limitar el número de pasos dibujados
            path.push({ x: 250 + x * 10, y: 250 + y * 10 });
        }
    }

    const distance = Math.abs(x) + Math.abs(y);
    return { success: distance === 2, path: path };
}

function drawWalk(path, ctx) {
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);

    for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
    }

    ctx.stroke();
}
