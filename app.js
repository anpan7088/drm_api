// app.js
const express = require("express");
const jwt = require('jsonwebtoken');
const cors = require('cors');

const authRoutes = require('./auth/routes'); // Import the auth routes module
const userProfileRoutes = require('./userProfiles/routes'); // Import the user routes module

const PORT = process.env.PORT || 8086;

const app = express();

// Define allowed origins based on environment
// const allowedOrigins = ['https://drm-front.sman.cloud', 'http://localhost:5173', 'http://localhost:5173/', 'http://localhost/'];

const corsOptions = {
    origin: ['https://drm-front.sman.cloud', 'http://localhost:5173'], // Allow only this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send({ "message": "Welcome to Rate Dorms API!" });
});

// Serve static files from the 'uploads' directory
// #mkd ova e samo za lokalen razvoj za deployment na server treba da se izmisle neshto so tamu so web serverot
app.use('/public', express.static('public'));

// Use the auth routes
app.use("/auth", authRoutes);

// Use user profile routes
app.use("/user", userProfileRoutes);

// Use dorms routes
app.use("/dorms", require('./dorms/routes'));

// Use dorms images routes
app.use("/dorm-img", require('./dorms_images/routes'))

// Use dorms review images routes
app.use("/review-img", require('./dorms_review_images/routes'))

// Use dorms reviews routes
app.use("/reviews", require('./dorms_review/routes'));

// Use cities routes
app.use("/cities", require('./cities/routes'));

// port
app.listen(PORT, () => {
    console.log("App is running on port " + PORT);
});
