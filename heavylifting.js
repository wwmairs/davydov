var cmsData = sessionStorage.getItem("cmsData");

if (cmsData == null) {
    // retrieve it, store in session,
    // Your web app's Firebase configuration
    var firebaseConfig = {
      apiKey: "AIzaSyAf6ZlVwUAhrc1pUMHC3dsKHi03pXf6lCY",
      authDomain: "wwmairs-cms.firebaseapp.com",
      databaseURL: "https://wwmairs-cms.firebaseio.com",
      projectId: "wwmairs-cms",
      storageBucket: "wwmairs-cms.appspot.com",
      messagingSenderId: "1069213946397",
      appId: "1:1069213946397:web:9b0d59d93dd81b5c"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    var db = firebase.database();
    var dbData = {};
    db.ref("data").once("value")
        .then((snapshot) => {
            snapshot.val().map((o) => {
                dbData[o.key] = o;
                window.sessionStorage.setItem("cmsData", JSON.stringify(dbData));
                cmsData = dbData;
                // do shit with the data
                makeGalleries(cmsData);
            });
        });
} else {
    // do shit
    cmsData = JSON.parse(cmsData);
    makeGalleries(cmsData);
}

function makeGalleries(cmsData) {
    for (key in cmsData) {
        // if it's a gallery
        // if you can find a gallery el defined
        if (! cmsData[key]["is_gallery"] || ! document.getElementById(key)) {
            console.log("skipping", key);
            continue;
        }
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
