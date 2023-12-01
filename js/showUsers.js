//Crear DB
let bd;
let mostrarUser;

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
    mostrarUser.innerHTML = "";

    //Iniciar transaccion
    let transaccion = bd.transaction(["Users"]);  //Si es en blanco, eld efecto es readonly
    almacen = transaccion.objectStore("Users");

    let puntero = almacen.openCursor();
    puntero.addEventListener("success", mostrarUsers);

}

//Mostrar usuarios
function mostrarUsers(e) {
    let puntero = e.target.result;
    console.log('Si pasa');
    //Mostrar si el puntero existe
    if(puntero) {
        mostrarUser.innerHTML += "<div class=\"p-2\">" + 
            "Username: " + puntero.value.username + " <br> " + 
            "Email: " +puntero.value.email + " <br> " + 
            "Profile Picture: " + puntero.value.profilePicture + "<br>" +
            "User Type: " + puntero.value.usertype + "<br>" +
            "<input type='button' class='btn-editar' value='Editar' onclick='seleccionarContacto(\""+puntero.value.id+ "\" )'>" +
            "<input type='button' class='btn-editar' value='Borrar' onclick='elimiarContacto(\""+puntero.value.id+ "\" )'>" +
            "</div>";
        puntero.continue();  //Sale todo por pantella gracias a el.
    }
}


window.addEventListener('load', iniciarBaseDatos);