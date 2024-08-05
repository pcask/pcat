const express = require("express");
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override');

const ejs = require("ejs");

const photoController = require('./controllers/photoController');
const pageController = require('./controllers/pageController');


const port = 3000;
const app = express();


mongoose.connect('mongodb://127.0.0.1:27017/pcat-test-db');

// Template engine
app.set("view engine", "ejs");

// Middlewares
app.use(express.static("public")); // Gelen HTTP isteği, "public" dizinindeki bir dosyaya karşılık geliyorsa, dosya doğrudan sunucudan istemciye gönderilir.


app.use(express.urlencoded({ extended: true }));
// HTML formları varsayılan olarak application/x-www-form-urlencoded formatında veri gönderir. Bu nedenle, Express uygulamanızda bu tür veriyi parse etmek için express.urlencoded() middleware'ini kullanmanız gerekmektedir.

// extended: true: Bu seçenek, URL-encoded veriyi parse etmek için qs kütüphanesini kullanır. qs kütüphanesi, iç içe nesneleri ve daha karmaşık veri yapılarının parse edilmesini sağlar.
// extended: false: Bu seçenek, URL-encoded veriyi parse etmek için querystring kütüphanesini kullanır. Bu kütüphane daha basit bir yapıya sahiptir ve iç içe nesneleri desteklemez.

app.use(express.json()); // Gelen HTTP isteklerinin gövdesini JSON formatında parse eder ve bu veriyi req.body nesnesi içinde erişilebilir hale getirir.

app.use(fileUpload());

// Html form ile desteklenmeyen put veya delete method'larını simule etmek için
app.use(methodOverride('_method', {
    methods: ['POST', 'GET'] // Post ve get method'larını override edeceğimizi bildiriyoruz. Default olarak sadece Post method'u override ediliyordu.
}));

// Routes
app.get('/', photoController.getAllPhotos);
app.get('/photos/:id', photoController.getPhotoById);
app.post('/photos', photoController.createPhoto);
app.put('/photos/:id', photoController.updatePhoto);
app.delete('/photos/:id', photoController.deletePhoto);


app.get('/about', pageController.getAboutPage);
app.get('/add', pageController.getAddPage);
app.get('/edit/:id', pageController.getEditPage);


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});