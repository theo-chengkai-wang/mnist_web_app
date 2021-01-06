const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const multer = require('multer')
const upload = multer({
    dest: 'uploads/'
});

const predict = require('./predict');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', (req, res) => {
    res.send('Please upload an image file of a single number, with a WHITE BACKGROUND');
});

app.post('/image', upload.single('file'), async (req, res) => {
    if (!req.file) {
        res.status(400).send("No file uploaded")
    }
    console.log("file name: " + req.file.filename);
    console.log("mimetype: " + req.file.mimetype);
    console.log("reverse color? " + req.body.rev)
    const result = await predict.predictFromImage(`./uploads/${req.file.filename}`, req.body.rev);
    console.log("result: " + result);
    res.json({
        result: result
    });
});

app.post('/array', async(req, res) => {
    const array = req.body.array;
    const results = await predict.predictFromArray(array);
    res.json({
        result: results[0],
        proba: results[1]
    });
})

module.exports = app;