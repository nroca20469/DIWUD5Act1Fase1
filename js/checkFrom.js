//Variables
const form = document.getElementById('form');
const tryFrom = document.getElementById('sub');
const nomusuari = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');
const userProfilePhoto = document.getElementById('userPhoto');
const userType = document.getElementById('userTy'); 


document.getElementById('sub').style.display = "block";
document.getElementById('save').style.display = "none";
let userImg = '';
let type = '';

function esObligartori(inputArray, img, type){
    let correcte = 0;
    inputArray.forEach((input) => {
        if(input.value.trim() === '') {
            mostraError(input,`${prenNomInput(input)} és obligatori.`);
        } else {
            correcte ++;
        }
    });
    
    let missatgeError = document.getElementById('missatgeImg');
    // console.log(img);
    if(img === '') {
        missatgeError.innerText = "La imatge de usuari és obligatoria";
        missatgeError.style.visibility = "visible";
        // console.log(missatgeError);
    } else {
        console.log('4');
        missatgeError.style.visibility = "hidden";
        correcte ++;
    }

    let missatgeErrorTipo = document.getElementById('missatgeType');
    if(type === '') {
        missatgeErrorTipo = document.getElementById('missatgeType');
        missatgeErrorTipo.innerText = "El tipo de usuari és obligatoria";
        missatgeErrorTipo.style.visibility = "visible";
        // console.log(missatgeError);
    } else {
        console.log('3');
        missatgeErrorTipo.style.visibility = "hidden";
        correcte ++;
    }

    return correcte;
}

function comprovaLonguitud(input, min, max){
    if(input.value.length < min) {
        mostraError(input, `${prenNomInput(input)} ha de tenir un minim de ${min} caracters`);
        return false;
    } else if(input.value.length > max) {
        mostraError(input, `${prenNomInput(input)} ha de tenir menys de ${max} caracters`);
        return false;
    } else {
        console.log('2');
        mostraCorrecte(input);
        return true;
    }
}

function esEmailValid(input) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //Exresion --> galimatias--> la simbologia de cont re, comprueba y busca cosas en una cadena. --> es como un filtro

    if(re.test(input.value.trim())) {
        mostraCorrecte(input);
        return true;
    } else {
        let missatge = `${prenNomInput(input)} no te el format correcte.`;
        mostraError(input, missatge);
        return false;
    } 
}

function esPasswordValid(input) {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if(re.test(input.value.trim())) {
        mostraCorrecte(input);
        return true;
    } else {
        let missatge = `${prenNomInput(input)} no te el format correcte.`;
        mostraError(input, missatge);
        return false;
    }   
}

function comprovaContrasenesIguales(input1, input2) {
    // console.log(input1.value);
    if(input1.value !== input2.value) {
        let missatge = `${prenNomInput(input2)} ha de ser igual a ${prenNomInput(input1)}.`;
        mostraError(input2, missatge);
        return false;
    } else {
        console.log('1');
        return true;
    }
}

function mostraError(input, missatge) {
    const formControl = input.parentElement;
    formControl.className = 'mb-3 error';
    const label = formControl.querySelector('label');
    const small = formControl.querySelector('small');
    small.innerText = missatge; 
}

function mostraCorrecte(input) {
    // const formControl = input.parentElement;
    let formControl = input.parentElement;
    formControl.className = 'mb-3 error';
    let label = formControl.querySelector('label');
    let small = formControl.querySelector('small');
    small.style.visibility = "hidden";
    
    // formControl.className = 'form-control correcte';
}

function prenNomInput(input) {
    return input.id.charAt(0).toUpperCase() + input.id.slice(1); 
}

//EVENT

userProfilePhoto.addEventListener("click", (e) => {
    let userProfileimg = e.target.getAttribute('id');
    
    if(userProfileimg == 'userProfilePhoto1') {
        userImg = '../img/perfil/perfil4.png';
    } else if(userProfileimg == 'userProfilePhoto2'){
        userImg = '../img/perfil/perfil5.png';
    } else if (userProfileimg == 'userProfilePhoto3'){
        userImg = '../img/perfil/perfil6.png';
    }     
    
});

userType.addEventListener("click", (e) => {
    
    if(e.target.value == "Admin") {
        type = e.target.value;
    } else if(e.target.value == "User") {
        type = e.target.value;
    }

});

tryFrom.addEventListener('click', (e) => {
    e.preventDefault(); //Evitamos que recarge de manera automatica

    let nCorrectes = esObligartori([nomusuari, email, password, password2], userImg, type);

    let cLongtudNom = comprovaLonguitud(nomusuari, 3, 15);  //True/False
    if(cLongtudNom) {
            let error = nomusuari.parentElement;
            error.className = "mb-3";
            let labl = error.querySelector('label');
            let smll = error.querySelector('small');
            smll.style.visibility = "hidden";
    }
    let cLongitudPass = comprovaLonguitud(password, 6, 25);
    if(cLongitudPass) {
        let error = password.parentElement;
        error.className = "mb-3";
        let labl = error.querySelector('label');
        let smll = error.querySelector('small');
        smll.style.visibility = "hidden";
    }

    let valid = esEmailValid(email);
    let comprovar = comprovaContrasenesIguales(password, password2);
    // console.log('Password: ' . password.value);
    // console.log('Password2: ' . password2.value);
    if(comprovar) {
        let formControl = password2.parentElement;
        formControl.className = 'mb-3 error';
        let label = formControl.querySelector('label');
        let small = formControl.querySelector('small');
        small.style.visibility = "hidden";
    }

    if(nCorrectes == 6) {
        console.log('si entra');
        if(cLongitudPass & cLongtudNom & valid & comprovar) {
            console.log('correcte');
            document.getElementById('sub').style.display = "none";
            document.getElementById('save').style.display = "block";
            // document.getElementById('save').style.visibility = "visible";
        
        
        }
    } 
    
});