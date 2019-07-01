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
            makeGalleries(cmsData);
            
            console.log("fetching...");
            console.log(dbData);
        });
} else {
    // do shit
    cmsData = JSON.parse(cmsData);
}

function makeGalleries(cmsData) {
    console.log(cmsData);
    for (key in cmsData) {
        // if it's a gallery
        // if you can find a gallery el defined
        //if (! cmsData[key]["is_gallery"] || ! document.getElementById(key)) {
        //    console.log("skipping", key);
        //    continue;
        //}
        let gallery = document.getElementById(key);
        cmsData[key]["links"].map((src) => {
            let div = document.createElement("div");
            let img = document.createElement("img");
            img.setAttribute("class", "gallery-img");
            img.setAttribute("src", src);
            div.setAttribute("class", "gallery-img-container");
            div.appendChild(img);
            gallery.appendChild(div);
        });

    }
}
