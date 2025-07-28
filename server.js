const express = require("express");
//const fetch = require('node-fetch');
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

const cors = require("cors");
const allowedOrigins = ["http://localhost:5500", "http://127.0.0.1:5500"];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.get("/api/games", async(req, res) => {
    const searchQuery = req.query.search;
    try {
        const rawgResponse = await fetch(`https://api.rawg.io/api/games?key=${process.env.RAWG_API_KEY}&search=${searchQuery}`);
        const data = await rawgResponse.json();
        res.json(data);
    } catch(error) {
        console.error("Error fetching from RAWG: ", error);
        res.status(500).json({error: "Something went wrong."});
    }
});

app.get("/api/games/:slug", async (req, res) => {
    const slug = req.params.slug;

    try {
        const rawgRes = await fetch(`https://api.rawg.io/api/games/${slug}?key=${process.env.RAWG_API_KEY}`);
        const data = await rawgRes.json();
        res.json(data);
    } catch(error) {
        console.error("Error fetching game details: ", error);
        res.status(500).json({error: "Failed to fetch game details"});
    }
});

app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
})