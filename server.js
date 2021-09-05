const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Document = require("./models/Document");

// Middlewares
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Connect to DB
mongoose.connect(
    "mongodb://localhost/wastebin",
    { useUnifiedTopology: true, useNewUrlParser: true },
    console.log(`Connected to DB`)
);

app.get("/", (req, res) => {
    const code = `Welcome to WasteBin!

Use the commands in the top right corner
to create a new file to share with others.`;

    res.render("code-display", {
        code: code,
        language: "plain-text",
    });
});

app.get("/new", (req, res) => {
    res.render("new");
});

app.post("/save", async (req, res) => {
    const value = req.body.value;

    try {
        const document = await Document.create({ value });
        res.redirect(`/${document.id}`);
    } catch (e) {
        res.render("new", { value });
    }

    console.log(value);
});

app.get("/:id/duplicate", async (req, res) => {
    const id = req.params.id;

    try {
        const document = await Document.findById(id);

        res.render("new", { value: document.value });
    } catch (e) {
        res.redirect(`/${id}`);
    }
});

app.get("/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const document = await Document.findById(id);

        res.render("code-display", { code: document.value, id });
    } catch (e) {
        res.redirect("/");
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is up and running on PORT ${PORT}`));
