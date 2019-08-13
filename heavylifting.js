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
        drawSmallSidebar();
    } else if (pname && cname) {
        drawGallery(pname);
        drawSmallSidebar();
    } else {
        drawPostcards();
        drawBigSidebar();
    }
}

function drawBigSidebar() {
    let sideBar = document.getElementById("sidebar");
    let div = document.createElement("div");
    let a = document.createElement("a");
    a.setAttribute("name", "about");
    a.setAttribute("href", "?about");
    a.innerHTML = "about";
    div.appendChild(a);
    let h2 = document.createElement("h2");
    a = document.createElement("a");
    a.setAttribute("id", "indexLink");
    a.setAttribute("href", "/davydov");
    a.innerHTML = "Davydov";
    h2.appendChild(a);
    sidebar.appendChild(h2);
    sidebar.appendChild(div);
    Object.keys(cmsData).map((c) => {
        if (c != "" && c != "about") {
            let div = document.createElement("div");
            let chk = document.createElement("input");
            let a = document.createElement("a");
            a.setAttribute("name", c);
            a.innerHTML = c;
            chk.setAttribute("type", "checkbox");
            chk.setAttribute("checked", true);
            chk.setAttribute("id", c + "Chkbox");
            div.setAttribute("id", c + "Button");
            div.onclick = () => toggleCategory(c);
            div.appendChild(a);
            div.appendChild(chk);
            sideBar.appendChild(div);
        }
    });
}

function drawSmallSidebar() {
    let sideBar = document.getElementById("sidebar");
    let div = document.createElement("div");
    let a = document.createElement("a");
    a.setAttribute("name", "back");
    a.setAttribute("href", "/davydov");
    a.innerHTML = "< back";
    div.appendChild(a);
    sidebar.appendChild(div);
    let h2 = document.createElement("h2");
    a = document.createElement("a");
    a.setAttribute("id", "indexLink");
    a.setAttribute("href", "/davydov");
    a.innerHTML = "Davydov";
    h2.appendChild(a);
    //sidebar.appendChild(h2);
}

function drawPostcards() {
    let cont = document.createElement("div");
    cont.setAttribute("id", "postcardsContainer");
    cont.setAttribute("class", "grid");
    let colorClasses = ["red", "blue", "green"];

    let cards = Object.values(cmsData)
        .reduce( (xs, ys) => {
            return Object.values(xs).concat(Object.values(ys));
        })
        .filter((c) => c.category != "" && c.category != "about")
        .sort((a, b) => b.date - a.date);

    cards.map( c => {
        let colorNumber = getRandomInt(3);
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
    document.getElementById("main").appendChild(cont);
    imagesLoaded(document.querySelector(".grid"), () => {
        var msnry = new Masonry(".grid", {
            itemSelector: "grid-item"
        });
    });
}

function drawGallery(pname) {
    let project = cmsData[cname][pname];
    console.log(project);
    let gallery = document.createElement("div");
    gallery.setAttribute("id", "gallery");
    // description and whatnot
    let slide = document.createElement("div");
    let div = document.createElement("div");
    let h3 = document.createElement("h3");
    let span = document.createElement("span");
    let p = document.createElement("p");
    slide.setAttribute("class", "slide");
    div.setAttribute("class", "description");
    h3.innerHTML = project.projectName;
    span.innerHTML = project.details + "<br>" + project.date;
    p.innerHTML = project.description;
    div.appendChild(h3);
    div.appendChild(span);
    div.appendChild(p);
    slide.appendChild(div);
    gallery.appendChild(slide);

    project.imageLinks.map((src) => {
        let div = document.createElement("div");
        let img = document.createElement("img");
        div.setAttribute("class", "slide");
        img.setAttribute("class", "slideImg");
        img.setAttribute("src", src);
        div.appendChild(img);
        gallery.appendChild(div);
    });
    if (project.videoLinks) {
        project.videoLinks.map((src) => {
            let div = document.createElement("div");
            let video = document.createElement("video");
            let source = document.createElement("source");
            div.setAttribute("class", "slide");
            video.setAttribute("class", "slideImg");
            video.setAttribute("src", src);
            source.setAttribute("src", src);
            video.appendChild(source);
            div.appendChild(video);
            gallery.appendChild(div);
        });
    }
    document.getElementById("main").appendChild(gallery);
}

function drawAbout() {
    console.log(cmsData);
    let aboutDiv = document.createElement("div");
    aboutDiv.setAttribute("id", "about-container");
    Object.entries(cmsData.about).map( (entry) => {
        let sectionName = entry[0];
        let obj = entry[1];
        let div = document.createElement("div");
        let name = document.createElement("h4");
        name.innerHTML = sectionName;
        div.appendChild(name);
        Object.entries(obj).map((section) => {
            let colName = section[0];
            let content = section[1];
            if (colName.indexOf("aboutParagraph") >= 0) {
                let p = document.createElement("p");
                p.innerHTML = content;
                div.appendChild(p);
            }
        });
        aboutDiv.appendChild(div);
    });
    document.getElementById("main").appendChild(aboutDiv);
}

function toggleCategory(cname) {
    let elems = document.getElementsByClassName(cname);
    Array.prototype.map.call(elems, (el) => {
        el.classList.toggle("hidden");
    });
    // toggle display on button
    let button = document.getElementById(cname + "Button");
    button.classList.toggle("toggleButtonInactive");
    let chk = document.getElementById(cname + "Chkbox");
    chk.checked = !button.classList.contains("toggleButtonInactive");
}
