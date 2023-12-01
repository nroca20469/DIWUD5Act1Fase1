const username = document.getElementById('username');
const password = document.getElementById('password');
const sub = document.getElementById('submit');
const cerrarSession = document.getElementById('cerrar-session');
const home = document.getElementById('home');
const botones = document.getElementById('mostrar-botones');
const formulario = document.getElementById('form-login');

let comprovara = 0;

//Crear db
function iniciarBaseDatos() {
    let req = indexedDB.open("Save-Users-Nerea");

    req.addEventListener("error", mostrarError);
    req.addEventListener("success", comenzar);
    req.addEventListener("upgradeneeded", crearAlmacen);

    req.addEventListener('success', comprovar)
}

function mostrarError(e) {
    console.log("Error al iniciar la base de datos: " + e.code);
}

function comenzar(e) {
    bd = e.target.result;
}

function crearAlmacen(e) {
    let basedatos = e.target.result;
    let almacen = basedatos.createObjectStore("Users", {keyPath: "username"}); //('nombre', 'valor principal') --> tiene que ser unica

    almacen.createIndex("SearchUsername", "username", {unique: true});  //('nombre', 'llave del indice', 'unica?')
    console.log("CrearBaseDatos: Succes");
}

function comprovar() {
     //Iniciar transaccion
     let transaccion = bd.transaction(["Users"]);  //Si es en blanco, eld efecto es readonly
     almacen = transaccion.objectStore("Users");
        comprovara = 0;
     let puntero = almacen.openCursor();
     puntero.addEventListener("success", comprovarUserLogIn);
}

function comprovarUserLogIn(e) {
    //leer datos al clicar
    
    let puntero = e.target.result;
    //Mostrar si el puntero existe
    if(puntero) {
        if(puntero.value.estate == "true" || puntero.value.estate == true) {
            formulario.style.display = "none";
            console.log('si hay users conectados');
            console.log(puntero.value.username);
            comprovara += 1;
        }
        puntero.continue();  //Sale todo por pantella gracias a el.
    }

    console.log(comprovara);
    if(comprovara >= 1) {
        botones.style.display = "block";
        formulario.style.display = "none";
        console.log('si botto');
        console.log(formulario.style.display);
        console.log(botones.style.display);
    } else if(comprovara == 0){
        formulario.style.display = "block";
        botones.style.display = "none";
        console.log('form' + formulario.style.display);
        console.log('botones' + botones.style.display);
    }
}


function comprovarIniciar(){
   //Iniciar transaccion
   let transaccion = bd.transaction(["Users"], 'readwrite');  //Si es en blanco, eld efecto es readonly
   almacen = transaccion.objectStore("Users");

   let puntero = almacen.openCursor();
   comprovara = 0;
   puntero.addEventListener("success", comprovarUserExists);
}

function comprovarUserExists(e) {
    let puntero = e.target.result;
    console.log('Comprovar User Incio');
    console.log(username.value);
    let contraseña = null;
    if(puntero) {
        console.log(puntero.value.username);
        if(puntero.value.username == username.value) {
            console.log('It exists');
            comprovara ++;
            contraseña = puntero.value.password;
            comprovarContraseña(contraseña,puntero ,puntero.value);
        }
        puntero.continue();
    }
    if(comprovara == 0) {
        location.href="../form/register.html";
    }
    
}

function comprovarContraseña(contra,puntero, value) {
    if(contra === password.value) {
        console.log(value);
        console.log('si pasa por comprovarEIniciarSession');
        
        let user = {};
        user.username = value.username;
        user.email = value.email;
        user.password = value.password;
        user.profilePicture = value.profilePicture;
        user.usertype = value.usertype;
        user.estate = 'true';

        let resultadoUp = puntero.update(user);
        
        resultadoUp.onsucces = () => {
            console.log('Update user correcto');
        };
        resultadoUp.onerror = ()=> {
            console.log('Update user no correcto');
        };


        location.href = '../index.html';
    }
}



function cerrarSessiones() {
    //Iniciar transaccion
    let transaccion = bd.transaction(["Users"], 'readwrite');  //Si es en blanco, eld efecto es readonly
    almacen = transaccion.objectStore("Users");

    let puntero = almacen.openCursor();
    puntero.addEventListener('success', cerrarSessions);
}

function cerrarSessions(e) {
    let puntero = e.target.result;

    if(puntero) {
        if(puntero.value.estate == "true" || puntero.value.estate == true) {
            console.log('si pasa por cerrarSessiones');
            let user = {};
            user.username = puntero.value.username;
            user.email = puntero.value.email;
            user.password = puntero.value.password;
            user.profilePicture = puntero.value.profilePicture;
            user.usertype = puntero.value.usertype;
            user.estate = 'false';

            console.log(user);
            let resultadoUp = puntero.update(user);
            
            resultadoUp.onsucces = () => {
                console.log('Update correcto');
            };
            resultadoUp.onerror = ()=> {
                console.log('Update no correcto');
            };

            console.log(puntero.value);
        }
        puntero.continue();
    } 
    comprovara = 0;
    comprovar();
}

//EVENTOS
sub.addEventListener('click', comprovarIniciar);
cerrarSession.addEventListener('click', cerrarSessiones);
home.addEventListener('click', () => {
    location.href = '../index.html';
});
window.addEventListener('load', iniciarBaseDatos);