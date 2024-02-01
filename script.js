var stage = new Konva.Stage({
    container: 'canvas-container',
    width: window.innerWidth,
    height: window.innerHeight,
});

var layer = new Konva.Layer();
stage.add(layer);

// Crear una grilla de fondo
var gridSize = 20;
for (var i = 0; i < stage.width() / gridSize; i++) {
    layer.add(new Konva.Line({
        points: [i * gridSize, 0, i * gridSize, stage.height()],
        stroke: 'lightgray',
        strokeWidth: 1,
    }));
}

for (var j = 0; j < stage.height() / gridSize; j++) {
    layer.add(new Konva.Line({
        points: [0, j * gridSize, stage.width(), j * gridSize],
        stroke: 'lightgray',
        strokeWidth: 1,
    }));
}

var transformer;

// Crear dos cuadros iniciales en el canvas
var cuadroAzul = crearCuadro({ x: 100, y: 100, color: 'rgba(255,0,233,.6)', xsize: 60, ysize: 300 });
var cuadroRojo = crearCuadro({ x: 200, y: 100, color: 'rgba(0,234,0,.6)', xsize: 60, ysize: 100 });

layer.add(cuadroAzul, cuadroRojo);
layer.draw();

// Crear un Transformer y agregarlo a la capa
transformer = new Konva.Transformer({
    keepRatio: true,
    rotateEnabled: true,
});
layer.add(transformer);

// Función para crear un cuadro clonable
function crearCuadro({ x, y, color, xsize = 50, ysize = 50 }) {
    var rect = new Konva.Rect({
        x: x,
        y: y,
        width: xsize,
        height: ysize,
        fill: color,
        cornerRadius: 2,
        draggable: true,
    });

    rect.on('dblclick', function () {
        // Clonar el cuadro al hacer doble clic
        var clone = rect.clone({
            x: rect.x() + 20, // Ajusta la posición para que no se superpongan exactamente
            y: rect.y() + 20,
            draggable: true,  // Hacer clon clonable mediante drag and drop
        });

        // Agregar evento de dragstart al clon
        clone.on('dragstart', function () {
            clone.moveToTop();  // Mover el clon al frente al comenzar el arrastre
            transformer.nodes([clone]);
            layer.draw();
        });

        layer.add(clone);
        layer.draw();
    });

    // Agregar evento click para habilitar tiras de redimensionamiento, rotación y escala
    rect.on('click', function () {
        transformer.nodes([rect]);
        layer.draw();
    });

    layer.add(rect);
    layer.draw();

    return rect;
}

// Agregar evento keydown al documento
document.addEventListener('keydown', function (e) {
    if (e.key === 'Delete') {
        // Verificar si el Transformer está activo y eliminar el elemento
        if (transformer.nodes().length > 0) {
            transformer.nodes().forEach(function (node) {
                node.destroy();
            });
            transformer.detach();
            layer.draw();
        }
    }
});