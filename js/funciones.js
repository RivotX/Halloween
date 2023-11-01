function recetasmostrar(){
    const contenido= document.getElementsByClassName("contenido")[0];
    const recetas=  document.getElementsByClassName("recetashalloween")[0];
    contenido.style.display="none";
    recetas.style.display="block";
}

function entrar(){
    const audio= document.getElementById("audio");
    const elemento= document.getElementsByClassName("calavera")[0]
elemento.style.animation="desvanecido 8s"
audio.play();
setTimeout(() => {
    window.location.href="../Halloween/html/index.html";
    
}, 3000);

}