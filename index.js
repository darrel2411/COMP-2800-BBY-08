require('dotenv').config();

const express = require('express');
const fs = require(`fs`);

const app = express();

const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

/** Arrays of tutorial articles to be parsed from tutorial.json */
let tutorialArray;

fs.readFile('tutorial.json', 'utf-8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    try {
        tutorialArray = JSON.parse(data);
        console.log(tutorialArray[0]);
    } catch (error) {
        console.error('Error parsing JSON', error);
    }
});

app.get('/tutorial', (req, res) => {
    res.render("tutorial", { tutorialArray: tutorialArray });
});

/** clickable article details. */
app.post('/articles/:articleId', (req, res) => {
    const articleId = req.params.articleId;
   res.render("articles", { tutorialArray: tutorialArray, articleId });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
