const express = require('express');
const password = require('./apis/password')
const share = require('./apis/share')
const users = require('./apis/user')
const app = express();
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser');

const mongoDBEndpoint = 'mongodb+srv://RuoyanJiang:JBmly5l4YA1VQ5VF@cluster0.d8rtl2d.mongodb.net/password';
mongoose.connect(mongoDBEndpoint,  { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error connecting to MongoDB:'));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/password/', password);
app.use('/api/share/', share);
app.use('/api/users/', users)

let frontend_dir = path.join(__dirname, '..', 'frontend', 'dist')

app.use(express.static(frontend_dir));
app.get('*', function (req, res) {
    console.log("received request");
    res.sendFile(path.join(frontend_dir, "index.html"));
});

app.listen(process.env.PORT || 8000, function() {
    console.log("Starting server now...")
})
