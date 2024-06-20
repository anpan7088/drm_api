// server.js

const express = require("express");
const mysql2 = require("mysql2");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config(); // importing the ".env" file

const secretKey = process.env.JWT_SECRET_KEY || 'defaultSecretKey-eohfufiufrei';
const expiration = Number(process.env.JWT_EXPIRATION) || 3600 ;
const PORT = process.env.PORT || 8086;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const responseTokenGenerator = ( userID, username ) => {
    const payload = { userId: userID, username: username };
    const token = jwt.sign(payload, secretKey, { expiresIn: expiration });
    return { message: 'JWT Token Generated Successfully', token: token };
}

const db = mysql2.createConnection({
	host: "localhost",
	user: "root",
	password: "root90877", //replace with your password
	database: "jwt_db",
});

db.connect((err) => {
	if (err) {
		console.error("Error connecting to MySQL:", err);
		return;
	}
	console.log("Connected to MySQL");
});

app.get("/", (req, res) => {
	res.send({ "message": "Welcome to the JWT Authentication API" });
});

app.post("/register", (req, res) => {
	const { username, email, password } = req.body;
	var sql = `INSERT INTO user (username, email, password) 
			VALUES('${username}','${email}','${password}')`;
	db.query(sql, (err) => {
		if (err) {
			console.error("Error in SQL query:", err);
			return res.status(500)
					.json({ error: "Internal Server Error" });
		} else {
			res.status(200)
			.json({ message: "Registered Successfully" });
		}
	});
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    var sql = 'SELECT * FROM user WHERE username = ? AND password = ?';
    db.query(sql, [username, password], (err, result) => {
        if (err) {
            console.error("Error in SQL query:", err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (result.length > 0) {
            console.log("User found:", result);
            res.json(responseTokenGenerator( username, password ));
        } else {
            console.log("User not found");
            res.status(401).json({ error: 'Invalid credentials' });
        }
    });
});

const authenticateJWT = (req, res, next) => {
	const token = req.header('Authorization');

	if (!token) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	jwt.verify(token.split(' ')[1], secretKey, (err, user) => {
		if (err) {
			return res.status(403).json({ error: 'Forbidden' });
		}

		req.user = user;
		next();
	});
};

// Example of using the middleware for a protected route
app.get('/protected', authenticateJWT, (req, res) => {
	res.json({ message: 'Access granted' });
});


app.listen(PORT, () => {
	console.log("App is running on port " + PORT);
});
