var _db 

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    background: "#715AFF" ,
    timer: 1500,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

function initFirebase(){
//     firebase.auth().signInAnonymously()
//   .then(() => {
//    
//   })
//   .catch((error) => {
//     var errorCode = error.code;
//     var errorMessage = error.message;
//     _db = [];
//   });

_db = firebase.firestore();

    firebase
    .auth()
    .onAuthStateChanged(function(user){
        if(user){
            console.log("user")
            $(".logout").css("display", "block");
            $(".login").css("display", "none");
        }else{
            console.log("no user")
            $(".login").css("display", "block");
            $(".logout").css("display", "none");



        }
    });

 

}
signInWithProvider = (provider)=>{
    firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
        Toast.fire({
            icon: 'success',
            title: 'user signed in'
          })
     /** @type {firebase.auth.OAuthCredential} */
     var credential = result.credential;
 
     // This gives you a Google Access Token. You can use it to access the Google API.
     var token = credential.accessToken;
     // The signed-in user info.
     var user = result.user;
     console.log(user + "user google")
     
   }).catch((error) => {
     // Handle Errors here.
     var errorCode = error.code;
     var errorMessage = error.message;
     // The email of the user's account used.
     var email = error.email;
     // The firebase.auth.AuthCredential type that was used.
     var credential = error.credential;
     // ...
   });
 

}
signInGoogle = () =>{
    //console.log("Gwa")
    var provider = new firebase.auth.GoogleAuthProvider();
    signInWithProvider(provider);
}
login = () =>{
    Swal.fire({
        title: '<h5 style="color:white">Login Form </h5>',
        html: `<input type="text" id="login" class="swal2-input" placeholder="Username">
        <input type="password" id="password" class="swal2-input" placeholder="Password">`,
        confirmButtonText: 'Log in',
        confirmButtonColor: "#102E4A",
        focusConfirm: false,
        background: "#715AFF",
        text: "white",
        preConfirm: () => {
          const login = Swal.getPopup().querySelector('#login').value
          const password = Swal.getPopup().querySelector('#password').value
          if (!login || !password) {
            Swal.showValidationMessage(`Please email and password`)
          }else{
            Toast.fire({
                icon: 'success',
                title: 'user signed in'
              })
              //console.log('login')
        firebase.auth().signInWithEmailAndPassword(login, password)
        .then((userCredential) => {
            console.log("login worked")
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage);
        });
                }
                return { login: login, password: password }
        }
        
    })
    
    //  

}
signOut = () =>{
    // console.log('signOut')
    firebase.auth().signOut().then(() => {
        Toast.fire({
            icon: 'success',
            title: 'user signed out'
          })
        console.log("signed out")
     // Sign-out successful.
   }).catch((error) => {
       console.log("error")
     // An error happened.
   });
 
 }


    initListeners = () =>{
        $(".hiphop").click(function(e){
            $(".albums").html('')
            _db
            .collection("Albums")
            .where("genre" ,"==" ,"Hip hop")
            .get()
            .then(function(querySnapshot){
                querySnapshot.forEach(function(doc){
                    getAlbum(doc);
                   
                });
            });
        })
        $(".rb").click(function(e){
            $(".albums").html('')
            _db
            .collection("Albums")
            .where("genre" ,"==" ,"R&B")
            .get()
            .then(function(querySnapshot){
                querySnapshot.forEach(function(doc){
                    getAlbum(doc);
                   
                });
            });
        })

        $(".soundtrack").click(function(e){
            $(".albums").html('')
            _db
            .collection("Albums")
            .where("genre" ,"==" ,"Soundtrack")
            .get()
            .then(function(querySnapshot){
                querySnapshot.forEach(function(doc){
                    getAlbum(doc);
                   
                });
            });
        })

        $(".all").click(function(e){
            $(".albums").html('')
            _db
            .collection("Albums")
            .get()
            .then(function(querySnapshot){
                querySnapshot.forEach(function(doc){
                    getAlbum(doc);
                   
                });
            });
        })
    }

function loadData(){
    _db
    .collection("Albums")
    .get()
    .then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
           
           $(".albums").append(`
           <div class="album">
              <h1>${doc.data().title}</h1>
              <div class="cover" style="background-image: url(${doc.data().cover});">
            </div>
            <div class="cont">
              <p><span>Genre: </span>${doc.data().genre}</p>
              <p><span>Artist: </span>${doc.data().artist}</p>
            </div>



           </div>
           `)
           //console.log(doc.data()) 
        })

    }, 
    function(error){
        console.log("error", error);
    });

   

}

function getAlbum(doc){
    $(".albums").append(`
    <div class="album">
       <h1>${doc.data().title}</h1>
       <div class="cover" style="background-image: url(${doc.data().cover});">
     </div>
     <div class="cont">
       <p><span>Genre: </span>${doc.data().genre}</p>
       <p><span>Artist: </span>${doc.data().artist}</p>
     </div>
    </div>
    `)


}


$(document).ready(function(){
    try{
        let app = firebase.app();
        initFirebase();
        loadData();
        initListeners();

    } catch{
        console.error(errorCode);
    }

}); 