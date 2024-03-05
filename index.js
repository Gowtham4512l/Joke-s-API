import express from "express";
import axios from "axios";

import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs", { data: null });
});

app.post("/submit", async (req, res) => {
    try {
        let text = req.body.text;
        const response = await axios.get(`https://v2.jokeapi.dev/joke/Any?contains=${text}`);
        if (!response.data || response.data.error) {
            throw new Error("No joke found with the given keyword");
        }

        const joke = response.data;

        res.render("index.ejs", {
            setup: joke.setup,
            delivery: joke.delivery,
            error: null,
            data: joke // Pass the joke data
        });
    }
    catch (error) {
        console.error("Failed to make request:", error.message);
        res.render("index.ejs", {
            setup: null,
            delivery: null,
            error: error.message,
            data: null
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});