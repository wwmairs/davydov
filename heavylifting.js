// utils
function zipwith(f, xs, ys) {
    if (xs.length == 0) {
        return [];
    } else {
        let z = f(xs.pop(), ys.pop());
        return zipwith(f, xs, ys).concat([z]);
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}


// get url params
var params = new URLSearchParams(window.location.search);
var cname = params.get("c");
var pname = params.get("p");
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
                    dbData[o.category] = {};
                }
                dbData[o.category][o.projectName] = o;
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
    if (about) {
        drawAbout();
    } else if (pname && cname) {
        drawGallery(pname);
    } else {
        drawPostcards();
    }
    drawSidebar();
}

function drawSidebar() {
    let sideBar = document.getElementById("sidebar");
    Object.keys(cmsData).map((c) => {
        if (c != "") {
            let div = document.createElement("div");
            let a = document.createElement("a");
            a.setAttribute("name", c);
            a.innerHTML = c;
            div.appendChild(a);
            sideBar.appendChild(div);
        }
    });
    let div = document.createElement("div");
    let a = document.createElement("a");
    a.setAttribute("name", "about");
    a.setAttribute("href", "?about");
    a.innerHTML = "about";
    div.appendChild(a);
    sidebar.appendChild(div);
}

function drawPostcards() {
    let cont = document.getElementById("postcardsContainer");
    let colorClasses = ["red", "blue", "yellow"];

    let cards = Object.values(cmsData)
        .reduce( (xs, ys) => {
            console.log(xs, ys);
            return Object.values(xs).concat(Object.values(ys));
        })
        .filter((c) => c.category != "")
        .sort((a, b) => b.date - a.date);

    cards.map( c => {
        let colorNumber = getRandomInt(3);
        console.log(colorNumber, colorClasses[colorNumber]);
        let div = document.createElement("div");
        let a = document.createElement("a");
        let img = document.createElement("img");
        let label = document.createElement("span");
        div.setAttribute("class", "grid-item postCard " + c.category);
        img.setAttribute("src", c.imageLinks[0]);
        label.innerHTML = c.projectName;
        a.setAttribute("class", colorClasses[colorNumber]);
        a.setAttribute("name", c.projectName);
        a.setAttribute("href", "?p=" + c.projectName + "&c=" + c.category);
        a.appendChild(label);
        div.appendChild(img);
        div.appendChild(a);
        cont.appendChild(div);
    });
    imagesLoaded(document.querySelector(".grid"), () => {
        var msnry = new Masonry(".grid", {
            itemSelector: "grid-item"
        });
    });
}

function drawGallery(pname) {
    let project = cmsData[cname][pname];
    let gallery = document.getElementById("gallery");
    project.imageLinks.map((src) => {
        let div = document.createElement("div");
        let img = document.createElement("img");
        div.setAttribute("class", "slide");
        img.setAttribute("class", "slide");
        img.setAttribute("src", src);
        div.appendChild(img);
        gallery.appendChild(div);
    });
}
