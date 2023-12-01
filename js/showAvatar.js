//Get variables
const imgProfile = document.getElementById('img');
const username = document.getElementById('username');
const divUser = document.getElementById('user');
const email = document.getElementById('email');



//Crear DB
let bd;
let mostrarUser;
let contador = 0;

//Abrir db
function iniciarBaseDatos() {
    mostrarUser = document.getElementById('caja-users');

    // let btnRegistrar = document.getElementById('save');
    // btnRegistrar.addEventListener("click", almacenarUser);
    // console.log('si');

    let req = indexedDB.open("Save-Users-Nerea");

    req.addEventListener("error", mostrarError);
    req.addEventListener("success", comenzar);
    req.addEventListener("upgradeneeded", crearAlmacen);

    req.addEventListener("success", mostrar);
}

// Abrir db --> FUNCIONES
function mostrarError(e) {
    console.log('Error al crear/abrir la bd: ' . e.code);
}

function comenzar(e) {
    bd = e.target.result;
    // console.log('comenzar');

    //Actualizar pantalla users
    // mostrarUsers();
}

function crearAlmacen(e) {
    let basedatos = e.target.result;
    let almacen = basedatos.createObjectStore("Users", {keyPath: "username"}); //('nombre', 'valor principal') --> tiene que ser unica

    almacen.createIndex("SearchUsername", "username", {unique: true});  //('nombre', 'llave del indice', 'unica?')
    console.log("CrearBaseDatos: Succes");
}

function mostrar() {
    //Iniciar transaccion
    let transaccion = bd.transaction(["Users"]);  //Si es en blanco, eld efecto es readonly
    almacen = transaccion.objectStore("Users");

    let puntero = almacen.openCursor();
    contador = 0;
    puntero.addEventListener("success", mostrarUsers);

}

//Mostrar usuarios
function mostrarUsers(e) {
    let puntero = e.target.result;
    console.log('Si pasa');
    //Mostrar si el puntero existe
    if(puntero) {
        if(puntero.value.estate == true || puntero.value.estate == 'true' || puntero.value.estate == "true")  {
            imgProfile.setAttribute('src', puntero.value.profilePicture);
            username.innerText = puntero.value.username;
            divUser.style.display = "block";
            email.innerText = puntero.value.email;
            contador ++;
            console.log('entra');
        }
        puntero.continue();  //Sale todo por pantella gracias a el.
        
        if(contador == 0){
            divUser.style.display = "none";
        }
    }

   
}


window.addEventListener('load', iniciarBaseDatos);