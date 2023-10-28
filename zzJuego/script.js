//set up 
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');  //canvas context

canvas.width = 1400;
canvas.height = 800;

c.fillRect(0, 0, canvas.width, canvas.height); //fillRect(x: number, y: number, w: number, h: number): pinta


// ------------- lo weno ------------//

const gravedad = 1; // literalmente 1px de gravedad para añadirla a la velocidad.y

//clase Sprite 
class Sprite {
    constructor({ position, imagenSrc, scale = 1, framesMax = 1, offset = { x: 0, y: 0 } }) { // paso parametros con objetos en vez de con muchas propiedades distintas, mas sencillo
        this.position = position;
        this.imagen = new Image();
        this.imagen.src = imagenSrc;
        this.scale = scale;
        this.framesMax = framesMax;
        this.framesCurrent = 0;
        this.framesTranscurridos = 0;
        this.framesHold = 5;
        this.offset = offset;
    }
    pintar() {
        c.drawImage(
            this.imagen,
            this.framesCurrent * (this.imagen.width / this.framesMax),
            0,
            this.imagen.width / this.framesMax,
            this.imagen.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.imagen.width / this.framesMax) * this.scale,
            this.imagen.height * this.scale
        )
    }

    update() {
        this.pintar();
        this.framesTranscurridos++;

        if (this.framesTranscurridos % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++;
            } else {
                this.framesCurrent = 0;
            }

        }
    }
}
class Luchador extends Sprite {
    constructor({ position, velocidad, height, width, color, hp, imagenSrc, scale = 1, framesMax = 1, offset = { x: 0, y: 0 } }) {
        super({ position, imagenSrc, scale, framesMax, offset });
        this.position = position;
        this.velocidad = velocidad;
        this.width = width;
        this.height = height;
        this.UltimaTeclaHorizontal;
        this.UltimaTeclaVertical;
        this.ataqueHitbox = {
            position: {
                x: this.position.x - this.width / 2,
                y: this.position.y
            },
            width: 150,
            height: 30
        }
        this.empuje = false;
        this.color = color;
        this.isAttacking;
        this.hp = hp;
        this.siendoEmpujado = false;
        this.habilidadUsada = false;

        this.framesCurrent = 0;
        this.framesTranscurridos = 0;
        this.framesHold = 5;

        // Cargar la imagen y esperar a que esté completamente cargada
        this.imagen.onload = () => {
            this.loaded = true;
        };
        this.imagen.src = imagenSrc;
    }

    update() {
        this.pintar();
        this.framesTranscurridos++;

        if (this.framesTranscurridos % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++;
            } else {
                this.framesCurrent = 0;
            }
        }

        // si el jugador está en el suelo, para de bajar (velocidad.y=0), si no, le afecta la gravedad (+0.7/cada animate)
        if (this.position.y + this.height + this.velocidad.y >= canvas.height - 150) {
            this.velocidad.y = 0;
        } else {
            this.velocidad.y += gravedad;
        }
        this.position.y += this.velocidad.y; // Actualiza la posición y
        this.position.x += this.velocidad.x; // Actualiza la posición x

        // Actualiza la posición de la hitbox junto con la posición del jugador
        this.ataqueHitbox.position.x = this.position.x - this.width; //(width hitbox = 150, width daga = 50, empieza en la posición 50 asi que sobresalen 50 por cada lado (150/3))
        this.ataqueHitbox.position.y = this.position.y;
    }

    ataque() {
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 100);
    }

}

//clase flecha
class Flecha {
    constructor({ position, velocidad, height, width, color }) {
        this.position = position;
        this.velocidad = velocidad;
        this.width = width;
        this.height = height;
        this.color = color;
        this.isAttacking = false; // Indica si la flecha está en vuelo
        this.flechaDisparada = false;
    }

    pintar() {
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update() {
        if (this.isAttacking) {
            this.position.x += this.velocidad.x;
            this.pintar();
        }
    }

    disparar(x, y) {
        // Inicia el disparo de la flecha desde la posición x, y
        this.position.x = x;
        this.position.y = y;
        this.isAttacking = true;
    }
    resetFlechaDisparada() {
        this.flechaDisparada = false;
        console.log("flechaDisparada = ", this.flechaDisparada);
    }
}

const daga = new Luchador({
    position: {
        x: 0,
        y: 100
    },
    velocidad: {
        x: 0,
        y: 0
    },
    height: 150,
    width: 50,
    color: 'red',
    hp: 3,
    imagenSrc: "../zzJuego/img/dagaQuieto.png",
    framesMax: 10,
    scale: 3.2,
    offset: {
        x: 240,
        y: 100
    }

});
daga.pintar();

const mago = new Luchador({
    position: {
        x: 1350,
        y: 0
    },
    velocidad: {
        x: 0,
        y: 0
    },
    height: 150,
    width: 50,
    color: 'blue',
    hp: 1,
    imagenSrc: "../zzJuego/img/MagoQuieto.png",
    framesMax: 8,
    scale: 3.2,
    offset: {
        x: 380,
        y: 310
    }
});
mago.pintar();

const flecha = new Flecha({
    position: {
        x: mago.position.x,
        y: mago.position.y + mago.height,
    },
    velocidad: {
        x: -6,
        y: 0,
    },
    height: 10,
    width: 30,
    color: 'yellow',
});
flecha.pintar();
const flechas = [];

const fondo = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imagenSrc: "../zzJuego/img/fondo.gif"
});

function animateLuchador(luchador) {
    // Actualiza y pinta el luchador dado
    luchador.update();
}
function animate() { //esta funcion se esta llamando a si misma, es infinita hasta que acabe el juego (bastantes fps)
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height); //pinta el fondo negro
    fondo.update();
    animateLuchador(daga);
    animateLuchador(mago);

    daga.velocidad.x = 0;
    mago.velocidad.x = 0;

    if (daga.position.x < mago.position.x) {
        if (daga.siendoEmpujado && !mago.habilidadUsada && daga.position.x > 0) {
            daga.velocidad.x = -18
        }
    }
    else {
        if (daga.siendoEmpujado && !mago.habilidadUsada && daga.position.x + daga.width < canvas.width) {
            daga.velocidad.x = 18
        }
    }
    // Movilidad de daga
    if (!daga.siendoEmpujado) {
        if (keys.d.presionada && daga.UltimaTeclaHorizontal === "d" && daga.position.x + daga.width < canvas.width) {
            daga.velocidad.x = 5;
        } else if (keys.a.presionada && daga.UltimaTeclaHorizontal === "a" && daga.position.x > 0) {
            daga.velocidad.x = -5;
        }
    }


    if (daga.position.y + daga.height + daga.velocidad.y >= canvas.height - 150 && keys.w.presionada == true && daga.UltimaTeclaVertical === "w") {
        daga.velocidad.y = -20;

    } else if (daga.velocidad.y > 0 && keys.s.presionada == true && daga.UltimaTeclaVertical === "s") {
        daga.velocidad.y = daga.velocidad.y = 20;
    }

    // Movilidad de arquero
    if ((keys.ArrowRight.presionada && mago.UltimaTeclaHorizontal === "ArrowRight" && mago.position.x + mago.width < canvas.width)) {
        mago.velocidad.x = 3;
    } else if (keys.ArrowLeft.presionada && mago.UltimaTeclaHorizontal === "ArrowLeft" && mago.position.x > 0) {
        mago.velocidad.x = -3
    }
    if (mago.position.y + mago.height + mago.velocidad.y >= canvas.height - 150 && keys.ArrowUp.presionada == true && mago.UltimaTeclaVertical === "ArrowUp") {
        mago.velocidad.y = -20;

    } else if (mago.velocidad.y > 0 && keys.ArrowDown.presionada == true && mago.UltimaTeclaVertical === "ArrowDown") {
        mago.velocidad.y = mago.velocidad.y = 20;
    }
    //chatgpt (no lo sacaba) -- UPDATE DE LAS FLECHAS
    // Actualiza y muestra todas las flechas
    for (let i = 0; i < flechas.length; i++) {
        flechas[i].update();
        if (flechas[i].position.x < 0) {
            // Elimina las flechas que han salido del lienzo
            flechas.splice(i, 1);
            i--;
        }
    }
    // detectar colision
    if (daga.ataqueHitbox.position.x + daga.ataqueHitbox.width >= mago.position.x
        && daga.ataqueHitbox.position.x <= mago.position.x + mago.width
        && daga.ataqueHitbox.position.y + daga.ataqueHitbox.height >= mago.position.y
        && daga.ataqueHitbox.position.y <= mago.position.y + mago.height
        && daga.isAttacking) {

        daga.isAttacking = false;
        mago.hp -= 1;
        if (mago.hp <= 0) {
            //alert("gana daga")
        }
        console.log(mago.hp);
    }

    if (mago.hp == 0) {
        mago.hp = -1;
        console.log('mago.hp :>> ', mago.hp);
    }

    //colision flechas
    for (let i = 0; i < flechas.length; i++) {
        const flecha = flechas[i];

        if (
            flecha.position.x + flecha.width >= daga.position.x &&
            flecha.position.x <= daga.position.x + daga.width &&
            flecha.position.y + flecha.height >= daga.position.y &&
            flecha.position.y <= daga.position.y + daga.height &&
            flecha.isAttacking
        ) {
            daga.hp -= 1;
            console.log("daga hp = ", daga.hp);
            flechas.splice(i, 1); // Elimina la flecha al impactar
            i--;

            if (daga.hp <= 0) {
                //alert("gana mago");
            }
        }
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
    l: {
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
    },
    k: {
        presionada: false
    },
    f: {
        presionada: false
    }
}


let ultimaVezDisparoFlecha = 0;

contador = 0;

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
        case "g":
            daga.ataque();
            break;
        case "l":
            var tiempoActual = Date.now(); // Obtiene el tiempo actual
            if (mago.position.x >= daga.position.x) {
                if (tiempoActual - ultimaVezDisparoFlecha >= 700) {
                    ultimaVezDisparoFlecha = tiempoActual;  // Actualiza el tiempo del último disparo
                    console.log("disparo");
                    keys.l.presionada = true;
                    flecha.flechaDisparada = true; // Establece flechaDisparada en true
                    console.log('l');
                    const nuevaFlecha = new Flecha({
                        position: {
                            x: mago.position.x + mago.width,
                            y: mago.position.y + mago.height / 2,
                        },
                        velocidad: {
                            x: -18,
                            y: 0,
                        },
                        height: 10,
                        width: 30,
                        color: 'yellow',
                    });
                    nuevaFlecha.disparar(mago.position.x + mago.width, mago.position.y + mago.height / 2);
                    flechas.push(nuevaFlecha);
                    // Agrega la nueva flecha al array
                }
            } else {
                if (tiempoActual - ultimaVezDisparoFlecha >= 800) {
                    ultimaVezDisparoFlecha = tiempoActual;  // Actualiza el tiempo del último disparo
                    console.log("disparo");
                    keys.l.presionada = true;
                    flecha.flechaDisparada = true; // Establece flechaDisparada en true
                    console.log('l');
                    const nuevaFlecha = new Flecha({
                        position: {
                            x: mago.position.x + mago.width,
                            y: mago.position.y + mago.height / 2,
                        },
                        velocidad: {
                            x: 18,
                            y: 0,
                        },
                        height: 10,
                        width: 30,
                        color: 'yellow',
                    });
                    nuevaFlecha.disparar(mago.position.x + mago.width, mago.position.y + mago.height / 2);
                    flechas.push(nuevaFlecha);
                    // Agrega la nueva flecha al array
                }
            }
            break;

        case "ArrowRight":
            keys.ArrowRight.presionada = true;
            mago.UltimaTeclaHorizontal = "ArrowRight";
            break;
        case "ArrowLeft":
            keys.ArrowLeft.presionada = true;
            mago.UltimaTeclaHorizontal = "ArrowLeft";
            break;
        case "ArrowUp":
            keys.ArrowUp.presionada = true;
            mago.UltimaTeclaVertical = "ArrowUp";
            break;
        case "ArrowDown":
            keys.ArrowDown.presionada = true;
            mago.UltimaTeclaVertical = "ArrowDown";
            break;

        case "k":
            keys.k.presionada = true;
            console.log('contador :>> ', contador);
            if (contador < 1) {
                contador++
                daga.siendoEmpujado = true;
                this.setTimeout(function () {
                    daga.siendoEmpujado = false;
                    mago.habilidadUsada = true;
                }, 400);
            }

        // if (!arquero.empuje) {
        //     arquero.empuje = true;
        //     console.log("empuje");
        //     keys.a.presionada = true;
        //     daga.velocidad.x = -10;
        // }
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
        case "l":
            keys.l.presionada = false;
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
        case "k":
            keys.k.presionada = false;
            break;
    }
})


function cambiarPosiciones(jugador1, jugador2) {
    var tempX = daga.position.x;
    var tempY = daga.position.y;
    daga.position.x = mago.position.x;
    daga.position.y = mago.position.y;
    mago.position.x = tempX;
    mago.position.y = tempY;
}



// setTimeout(function () {
//     cambiarPosiciones(daga, mago);
//     console.log('cambio');
// }, 5500);


// setTimeout(function () {
//     cambiarPosiciones(daga, mago);
//     console.log('cambio');
// }, 10000);


animate();
