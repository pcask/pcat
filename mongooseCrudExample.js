const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// IIFE
(async () => {

    // Db Connection
    // Eğer varsa "pcat-test-db" isimli db'ye bağlanacak, yoksa db'yi oluşturacaktır.
    await mongoose.connect("mongodb://127.0.0.1:27017/pcat-test-db");

    // Create Schema
    const PhotoSchema = new Schema({
        title: String,
        description: String,
        image: String,
        createdDate: {
            type: Date,
            default: Date.now
        }
    });

    // Create a model
    const PhotoModel = mongoose.model("Photo", PhotoSchema);

    // Create a document
    // const photoDoc = new PhotoModel({
    //     title: "Photo 4 title",
    //     description: "Photo 4 description lorem ipsum"
    // });

    // await photoDoc.save();


    // Read all documents
    // Basit sorgularda exec() kullanmasakta, await ile beklediğimiz için mongoose arka planda exec()'i çalıştıracaktır.
    const allDocuments = await PhotoModel.find({});
    console.log(allDocuments);

    // Read filtered document
    // Filter documents that it's title LIKE 'Photo 2' and only selecting 'description' field;
    const filteredDocs = await PhotoModel.find({ title: /photo 2/i }, 'description').exec(); // Karmaşık sorgularda exec()'in kullanımı tavsiye edilir.
    console.log(filteredDocs);


    // Update a document way 1;
    const beUpdatedDoc = await PhotoModel.findOne({ title: /3/i }).exec();
    beUpdatedDoc.title = "Photo 3 title";
    beUpdatedDoc.description = "Photo 3 description";
    const res = await beUpdatedDoc.save();

    console.log(res);

    // Update a document way 2;
    const beUpdatedDoc2 = await PhotoModel.findOneAndUpdate(
        { title: /44/i },
        { title: "Photo 444 title", description: "Photo 444 description" },
        { new: true }).exec(); // Through the "new: true" option , we'll get the doc. updated.

    console.log(beUpdatedDoc2);


    // Delete a document;
    const beDeletedDoc = await PhotoModel.findOneAndDelete({ title: /444/ });
    console.log(beDeletedDoc);

})().finally(() => {
    mongoose.connection.close();
});

