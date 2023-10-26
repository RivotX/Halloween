//set up

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');  //canvas context

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height); //fillRect(x: number, y: number, w: number, h: number): pinta


// ------------- lo weno ------------//

const gravedad = 0.2; // literalmente 0.2px de gravedad para añadirla a la velocidad.y
class Sprite {
    constructor({ position, velocidad, height }) { // paso parametros con objetos en vez de con muchas propiedades distintas, mas sencillo
        this.position = position;
        this.velocidad = velocidad;
        this.height = height;
        this.UltimaTeclaHorizontal;
        this.UltimaTeclaVertical;
    }
    pintar() {
        c.fillStyle = "red";
        c.fillRect(this.position.x, this.position.y, 50, this.height);
    }

    update() {
        this.pintar();

        // si el jugador está en el suelo, para de bajar (velocidad.y=0), si no, le afecta la gravedad (+0.2/cada animate)
        if (this.position.y + this.height + this.velocidad.y >= canvas.height) {
            this.velocidad.y = 0;
        } else {
            this.velocidad.y += gravedad;
        }
        this.position.y += this.velocidad.y; //this.position.y = this.position.y + this.velocidad.y;
        this.position.x += this.velocidad.x;

    }
}
const daga = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    velocidad: {
        x: 0,
        y: 0
    },
    height: 90,
});
daga.pintar();

const arquero = new Sprite({
    position: {
        x: 500,
        y: 0
    },
    velocidad: {
        x: 0,
        y: 0
    },
    height: 90,
});

arquero.pintar();

function animate() { //esta funcion se esta llamando a si misma, es infinita hasta que acabe el juego (bastantes fps)
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height); //pinta el fondo negro
    daga.update();
    arquero.update();

    daga.velocidad.x = 0;
    arquero.velocidad.x = 0;

    //Movilidad de daga
    if (keys.d.presionada == true && daga.UltimaTeclaHorizontal === "d") {
        daga.velocidad.x = 1;
    } else if (keys.a.presionada == true && daga.UltimaTeclaHorizontal === "a") {
        daga.velocidad.x = -1
    }

    if (daga.position.y + daga.height + daga.velocidad.y >= canvas.height && keys.w.presionada == true && daga.UltimaTeclaVertical === "w") {
        daga.velocidad.y = -8;

    } else if (daga.velocidad.y > 0 && keys.s.presionada == true && daga.UltimaTeclaVertical === "s") {
        daga.velocidad.y = daga.velocidad.y = 8;
    }

    //Movilidad de arquero
    if (keys.ArrowRight.presionada == true && arquero.UltimaTeclaHorizontal === "ArrowRight") {
        arquero.velocidad.x = 1;
    } else if (keys.ArrowLeft.presionada == true && arquero.UltimaTeclaHorizontal === "ArrowLeft") {
        arquero.velocidad.x = -1
    }

    if (arquero.position.y + arquero.height + arquero.velocidad.y >= canvas.height && keys.ArrowUp.presionada == true && arquero.UltimaTeclaVertical === "ArrowUp") {
        arquero.velocidad.y = -8;

    } else if (arquero.velocidad.y > 0 && keys.ArrowDown.presionada == true && arquero.UltimaTeclaVertical === "ArrowDown") {
        arquero.velocidad.y = arquero.velocidad.y = 8;
    }
}
// ----------------movilidad ---------------//
const keys = {
    a: {
        presionada: false
    },
    d: {
        presionada: false
    },
    w: {
        presionada: false
    },
    s: {
        presionada: false
    },

    ArrowRight: {
        presionada: false
    },
    ArrowLeft: {
        presionada: false
    },
    ArrowUp: {
        presionada: false
    },
    ArrowDown: {
        presionada: false
    }
}

/*var DagaUltimaTeclaHorizontal;
var DagaUltimaTeclaVertical;

var ArqueroUltimaTeclaHorizontal;
var ArqueroUltimaTeclaVertical;*/




window.addEventListener('keydown', function (event) {
    switch (event.key) {
        case "d":
            keys.d.presionada = true;
            daga.UltimaTeclaHorizontal = "d";
            break;
        case "a":
            keys.a.presionada = true;
            daga.UltimaTeclaHorizontal = "a";
            break;
        case "w":
            keys.w.presionada = true;
            daga.UltimaTeclaVertical = "w";
            break;
        case "s":
            keys.s.presionada = true;
            daga.UltimaTeclaVertical = "s";
            break;

        case "ArrowRight":
            keys.ArrowRight.presionada = true;
            arquero.UltimaTeclaHorizontal = "ArrowRight";
            break;
        case "ArrowLeft":
            keys.ArrowLeft.presionada = true;
            arquero.UltimaTeclaHorizontal = "ArrowLeft";
            break;
        case "ArrowUp":
            keys.ArrowUp.presionada = true;
            arquero.UltimaTeclaVertical = "ArrowUp";
            break;
        case "ArrowDown":
            keys.ArrowDown.presionada = true;
            arquero.UltimaTeclaVertical = "ArrowDown";
            break;
    }
})
window.addEventListener('keyup', function (event) {
    switch (event.key) {
        case "d":
            keys.d.presionada = false;
            break;
        case "a":
            keys.a.presionada = false;
            break;
        case "w":
            keys.w.presionada = false;
            break;
        case "s":
            keys.s.presionada = false;
            break;

        case "ArrowRight":
            keys.ArrowRight.presionada = false;
            break;
        case "ArrowLeft":
            keys.ArrowLeft.presionada = false;
            break;
        case "ArrowUp":
            keys.ArrowUp.presionada = false;
            break;
        case "ArrowDown":
            keys.ArrowDown.presionada = false;
            break;
    }
})

animate();
