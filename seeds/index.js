const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers')
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('MONGOOSE connection open!!!');
    })
    .catch(err => {
        console.log("MONGOOSE CONNECTION FAILED!!!!");
        console.log(err);
    });
const db = mongoose.connection;

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 500; i++) {
        let random1000 = Math.floor(Math.random() * 1000 + 1);
        let price = Math.floor(Math.random() * 10 + 1) + 10;
        const camp = new Campground({
            author: '61e339761f60eee159cee12b',
            location: `${cities[random1000].city},${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: '    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iste odio explicabo, quibusdam consequuntur atque enim praesentium expedita voluptatum illo mollitia commodi, dolorem esse. Recusandae explicabo asperiores sunt maxime, velit illo?',
            price: price,
            geometry: {
                type: "Point",
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/shubhams-34/image/upload/v1642612509/YelpCamp/crdjtdfbchupvmn7qcxn.jpg',
                    filename: 'YelpCamp/crdjtdfbchupvmn7qcxn',

                },
                {
                    url: 'https://res.cloudinary.com/shubhams-34/image/upload/v1642612510/YelpCamp/utj1fvel1aux5ywosz4d.jpg',
                    filename: 'YelpCamp/utj1fvel1aux5ywosz4d',

                },
                {
                    url: 'https://res.cloudinary.com/shubhams-34/image/upload/v1642612509/YelpCamp/fptubldziqjjpo2zl96a.jpg',
                    filename: 'YelpCamp/fptubldziqjjpo2zl96a',

                }
            ]
        })
        await camp.save();
    }
}
seedDB()
    .then(() => {
        mongoose.connection.close();
    })
