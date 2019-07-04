// utils
function zipwith(f, xs, ys) {
    if (xs.length == 0) {
        return [];
    } else {
        let z = f(xs.pop(), ys.pop());
        return zipwith(f, xs, ys).concat([z]);
    }
}

// get url params
var params = new URLSearchParams(window.location.search);
var pName = params.get("p");
var about = params.get("about") != null;
var filters = params.get("filters");

var cmsData = sessionStorage.getItem("cmsData");

if (cmsData == null) {
    // retrieve it, store in session,
    // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyCW6Yml8lX_nWnOY4Zd6o8_RFe3eXGan0s",
        authDomain: "davydov-cms.firebaseapp.com",
        databaseURL: "https://davydov-cms.firebaseio.com",
        projectId: "davydov-cms",
        storageBucket: "",
        messagingSenderId: "97724532136",
        appId: "1:97724532136:web:377a51561c4de231"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    var db = firebase.database();
    var dbData = {};
    db.ref("data").once("value")
        .then((snapshot) => {
            snapshot.val().map((o) => {
                if (dbData[o.category] == undefined) {
                    dbData[o.category] = [];
                }
                dbData[o.category].push(o);
            });
            window.sessionStorage.setItem("cmsData", JSON.stringify(dbData));
            cmsData = dbData;
            // do shit with the data
            draw();
        });
} else {
    // do shit
    cmsData = JSON.parse(cmsData);
    draw();
}

function draw() {
    console.log(cmsData);
    // make sidebar
    drawSidebar();
    // check url params
    // make gallery
    // make postcards
    drawPostcards();
}

function drawSidebar() {
    let sideBar = document.getElementById("sidebar");
    Object.keys(cmsData).map((c) => {
        if (c != "") {
            // make wrapper
            let div = document.createElement("div");
            // make checkbox (?)
            // make name
            let a = document.createElement("a");
            a.setAttribute("name", c);
            a.innerHTML = c;
            div.appendChild(a);
            sideBar.appendChild(div);
        }
    });
}

function drawPostcards() {
    let cont = document.getElementById("postcardsContainer");

    let cards = Object.values(cmsData)
        .reduce( (xs, ys) => {
            return xs.concat(ys);
        })
        .filter((c) => c.category != "")
        .sort((a, b) => b.date - a.date);

    cards.map( c => {
        let div = document.createElement("div");
        let a = document.createElement("a");
        let img = document.createElement("img");
        let label = document.createElement("span");
        div.setAttribute("class", "postCard " + c.category);
        img.setAttribute("src", c.imageLinks[0]);
        label.innerHTML = c.projectName;
        a.setAttribute("name", c.projectName);
        a.setAttribute("href", "?p=" + c.projectName);
        a.appendChild(label);
        div.appendChild(img);
        div.appendChild(a);
        cont.appendChild(div);
    });
}
