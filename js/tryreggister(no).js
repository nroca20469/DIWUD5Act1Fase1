//Vars
var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
var database = "userRegisterDB";
const DB_STORE_NAME = 'userRegister';
const DB_VERSION = 1;
var db;
var opened = false;
const REGISTER = "Register";

//Create/aopen an IndexDB
function openCreateDb(onDbCompleted) { //Al completar un ... (?)
    if(opened) {
        db.close();
        opened = false;
    } 

    var req = indexedDB.open(database, DB_VERSION);  //Abrir una version u otra(se podria cambiar)

    req.onsuccess = function(e) {
        db = this.result;  // Or e.target.result
        console.log("openCreateDB: DB opened/created " + db);
        opened = true;

        onDbCompleted(db);
    };

    /* Event fired when
        1.- ObjectStore first time creation
        2.- Change the version
    */
    req.onupgradeneeded = function() {
        // Other values losts
        db = req.result; //o this.result

        console.log("openCreateDB: upgrade needed " + db);
        var store = db.createObjectStore(DB_STORE_NAME, { keyPath: "username" } );
        console.log("openCreateDB: Object store created: " + store);
        
        store.createIndex('username', 'username', { unique: true });
        console.log("openCreateDB: Index created on username");
        store.createIndex('email', 'email', { unique: true });
        console.log("openCreateDB: Index created on email");
        store.createIndex('password', 'password', { unique: false });
        console.log("openCreateDB: Index created on password");
        store.createIndex('userProfilePhoto', 'userProfilePhoto', { unique: false });
        console.log("openCreateDB: Index created on userProfilePhoto");
    };

    req.onerror = function(e) {
        console.log('openCreateDB: error opening or creating db: ' + e.target.errorCode);
    }; 
}

function sendRegister() {
    openCreateDb(function(db) {
        var username = document.getElementById('username').value;
        console.log(username);

        if(username != null) {
            register(db);
        } else {
            console.log('change user values');
            editRegistered(db);
        }
    });
}

function register(db){
    //Capture variables
    var username = document.getElementById('username');
    console.log(username.value);

    var email = document.getElementById('email');
    console.log(email.value);

    var password = document.getElementById('password');
    console.log(password.value);

    var userProfilePhoto = document.getElementById('userProfilePhoto');
    console.log(userProfilePhoto);

    var comanda = {username: username.value, email: email.value, password: password.value, userProfilePhoto: userProfilePhoto.value};

    //Start transaction in readwrite mode
    var tx = db.transaction(DB_STORE_NAME, 'readwrite');
    var store = tx.objectStore(DB_STORE_NAME);

    try {
       req = store.add(comanda); 
    } catch (e) {
        console.log('rregister req catch');
    }

    req.onsucces = function(e) {
        console.log('register: Data insertion succesfully done. Username: ' + e.target.result);

        readData();
        //clearFormInputts();
    };

    req.onerror = function(e) {
        console.error('register: Data insertion error ' + this.error);
    }

    tx.oncomplete = function() {
        console.log('register: Transaction completed');
        db.close();
        opened = false;
    };
}

function readData() {
    openCreateDb(function(db) {
        readRegisters(db);
    });
}

//Leer registros
function readRegisters(db) {
    console.log('readRegisters');
    var tx = db.transaction(DB_STORE_NAME, "readonly");
    var store = tx.objectStore(DB_STORE_NAME);

    var result = [];
    var req = store.openCursor(); //Para iterar a traves de un almacen de objetos
    
    req.onsucces = function(e) {
        var cursor = e.taget.result;

        if(cursor) {
            result.push(cursor.value);  //Guardar valor de cursor en result
            console.log(cursor.value);
            cursor.continue;
        } else {
            console.log('EOF');
            console.log(result);
            //To do agter reading all the records
            addRegistersToHTML(result);
        }
    };

    req.onerror = function(e){
        console.log('Error reading users');
    };

    tx.oncomplete = function(e) {
        console.log('RearRegiste: tx completed');
        db.close();
        opened = false;
    };

}

function addRegistersToHTML(users) {
    var ul = document.getElementById('users');
        ul.style.display = "block";
    ul.innerHTML = "";
    console.log(users);

    for(let i = 0; i < users.length; i++) {
        ul.innerHTML += "<li><span>" + "Username: " + users[i].username + "  Email: " + users[i].email + "  Password: " + users[i].password + "</span><button username='" + users[i].username + "' id='edit_" + users[i].username + "'>Edit user</button><button username='" + users[i].username + "' id='delete_" + users[i].username + "'>Delete user</button>";
        document.getElementById("edit_"+users[i].username).addEventListener("click", readUser, false);
        document.getElementById("delete_"+users[i].username).addEventListener("click", deleteUser, false);
    }

    for(let i = 0; i < users.length; i++) {
        document.getElementById("edit_"+users[i].username).addEventListener("click", readRegister, false);
        document.getElementById("delete_"+users[i].username).addEventListener("click", deleteRegister, false);
    }

    
}

function readRegister(e) {
    console.log('readRegister');

    var username = document.getAttribute('username');

    openCreateDb(function(e) {
        console.log(db);
        console.log('Username: ' + username);

        var tx = db.transaction(DB_STORE_NAME, 'readonly');
        var store = tx.objectStore(DB_STORE_NAME);

        var req = store.get(username);

        req.onsucces = function(e) {
            var record = e.target.result;
            console.log(record);

            //Update input forms to edit
            updateFormInputsToEdit(record);
        };

        req.onerror = function(e) {
            console.log('readUser: error reading data: ' , e.target.errorCode);
        };

        tx.oncomplete = function() {
            console.log('readUser: tx completed');
            db.close();
            opened = false;
        };
    });
}

function deleteRegister(e) {
    console.log('deleteRegister');
    var button_id = e. taget.id;
    var username = document.getElementById(button_id).getAttribute('username');

    openCreateDb(function(e) {
        console.log('Username: ' + username);

        var tx = db.transaction(DB_STORE_NAME, 'readwrite');
        var store = tx.objectStore(DB_STORE_NAME);

        var req = store.delete(username);

        req.onsucces = function(e) {
            var record = e.target.result;
            console.log("deleteRegister: data removed succesfullu: " + username);

            //Update input forms to edit
            readData();
        };

        req.onerror = function(e) {
            console.log('deleteRegister: error reading data: ' , e.target.errorCode);
        };

        tx.oncomplete = function() {
            console.log('deleteRegister: tx completed');
            db.close();
            opened = false;
        };
    });
}

function editRegistered(db) {

}

//EVENT
window.addEventListener('load', (event) => {
    readData();
  });