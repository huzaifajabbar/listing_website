const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

const geocodingClient = mbxGeocoding({ accessToken: "pk.eyJ1IjoibWFsaWtodXo5IiwiYSI6ImNtN3VlaHM0ZDAyd3IyanMybmk4eW00MTQifQ._vYZ3dlEvJ5smz6oEl8ixg" });


main()
.then(()=> {
    console.log("Database connected");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

console.log(initData)





const initDB = async () => {
    await Listing.deleteMany({});
   initData.data = initData.data.map((obj) => ({...obj, owner:"67c1ccc668c230bb979d9ebb"}))
    await Listing.insertMany(initData.data);
    console.log("data Initialized");
}
initDB();