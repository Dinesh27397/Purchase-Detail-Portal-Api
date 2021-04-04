/*******************************
 * Import Required Modules
 ******************************/

var express = require('express');
var bodyParser = require('body-parser');
var layout = require('express-layout');
var path = require("path");
var app = express();
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var compression = require('compression');
var cors = require('cors');
var router = express.Router()


app.use(cors())

/*******************************
 * Require Configuration
 ****************************/
var conf = {};

conf = require('./conf');


app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());


// compress all responses
app.use(compression())


//For Static Files
app.set('views', path.join(__dirname, 'views'));

var options = {
    maxAge: '1d',
    setHeaders: function (res, path, stat) {
        res.set('vary', 'Accept-Encoding');
        res.set('x-timestamp', Date.now());
    }
};

app.use('/css', express.static(__dirname + '/webapps/css', options));
app.use('/images', express.static(__dirname + '/webapps/images', options));
app.use('/plugins', express.static(__dirname + '/webapps/plugins', options));
app.use('/fonts', express.static(__dirname + '/webapps/fonts', options));


var controllerOptions = {
    maxAge: 0,
    setHeaders: function (res, path, stat) {
        res.set('vary', 'Accept-Encoding');
        res.set('x-timestamp', Date.now());
    }
};

app.use('/js', express.static(__dirname + '/webapps/js', controllerOptions));
app.use(express.static(__dirname + '/webapps', controllerOptions));


app.use(layout());

app.use(cookieParser('ee357664-9cfb-482b-9a89-08a55f7fc074'));

var sessionObj = {
    secret: 'ee357664-9cfb-482b-9a89-08a55f7fc074',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 5 * 60 * 60 * 1000 //5 hours
    }
}

app.use(expressSession(sessionObj))


//For Template Engine
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set("view options", { layout: "layout.html" });


app.conf = conf;



const fileupload = require('express-fileupload');
app.use(fileupload())

var server = require('http').Server(app);


console.log('Purchase  application server listening on ' + conf['web']['port']);

server.listen(conf['web']['port']);


//Initializing the web routes
var Routes = require('./routes/http-routes.js');
new Routes(app,router);

process
    .on('uncaughtException', function (err) {
        // handle the error safely
        // logger.error(err)
        console.log(err)
    })
    .on('unhandledRejection', (reason, p) => {
        // logger.error(reason, 'Unhandled Rejection at Promise', p);
})








