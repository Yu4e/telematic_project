const express = require('express');
const { engine } = require('express-handlebars');
const myconecction = require('express-myconnection');
const mysql = require('mysql');
const session =require('express-session');
const bodyParser = require ('body-parser');

const loginRoutes = require('./routes/login')

require('dotenv').config({path:'./.env'});

const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_DATABASE;
const port = process.env.PORT;



const app = express();
app.set('port', 4000);

app.set('views', __dirname + '/views');
app.engine( '.hbs', engine({
    extname:'.hbs',
}));
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(myconecction(mysql,{
    host: host,
    user: user,
    password: password,
    port: port,
    database: database
}));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));


app.listen(app.get('port'),() =>{
    console.log("Listening on port", app.get('port'));
});

app.use('/',loginRoutes);

app.get('/',(req,res) =>{
    if (req.session.loggedin == true){
        res.render('home', {name: req.session.name});

    }else{
        res.redirect('/login');
    }

});