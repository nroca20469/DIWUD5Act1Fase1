//Crear DB
let bd;
// let mostrarUsers;

//Crear db
function iniciarBaseDatos() {
    let btnRegistrar = document.getElementById('save');
    btnRegistrar.addEventListener("click", almacenarUser);
    // console.log('si');

    let req = indexedDB.open("Save-Users-Nerea");

    req.addEventListener("error", mostrarError);
    req.addEventListener("success", comenzar);
    req.addEventListener("upgradeneeded", crearAlmacen);
}


// Crear db --> FUNCIONES
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

//Almacenar  Usuario
function almacenarUser() {
    let user = document.getElementById('username').value;
    let email = document.getElementById('email').value;
    let pass = document.getElementById('password').value;
    let profilePhoto;
    if(document.getElementById('userProfilePhoto1').checked) {
        profilePhoto = document.getElementById('profilePhoto1').getAttribute('src');
        // console.log(profilePhoto);
    } else  if(document.getElementById('userProfilePhoto2').checked) {
        profilePhoto = document.getElementById('profilePhoto2').getAttribute('src');
    } else if(document.getElementById('userProfilePhoto3').checked) {
        profilePhoto = document.getElementById('profilePhoto3').getAttribute('src');
    }
    console.log(profilePhoto);
    let userType;
    if(document.getElementById('admin').checked) {
        userType = document.getElementById('admin').value;
    } else if(document.getElementById('usera')) {   
        userType = document.getElementById('usera').value;
    }
    console.log(userType);
    console.log(bd);

    //Empezar transaccion para guardar
    var transaccion = bd.transaction(["Users"], "readwrite");
    console.log(transaccion);
    // let transaccion = bd.transaction(['Users'], "readwrite"); 
    let almacen = transaccion.objectStore("Users");
    // let transaccion = bd.transaction(["Users"], "readwrite");
    // let almacen = transaccion.objectStore("Users");

    almacen.add({
        username: user,
        email: email,
        password: pass,
        profilePicture: profilePhoto,
        usertype: userType,
        estate: 'true'
    });

    document.getElementById('username').value = "";
    document.getElementById('email').value = "";
    document.getElementById('password').value = "";

    if(userType == 'Admin') {
        location.href = '../form/mostrarUsers.html';
    }else {
        location.href = '../form/profilePage.html';
    }
    

}

window.addEventListener('load', iniciarBaseDatos);