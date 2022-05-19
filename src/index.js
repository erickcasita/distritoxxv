const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const session = require('express-session');
const path  = require('path');
const passport = require('passport');
const flash = require('connect-flash');
const MySQLStore = require('express-mysql-session')(session);
const {database} = require('./keys');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const favicon = require('serve-favicon');
require('./lib/passport');

//Initializations
const app  = express();

//Settings
app.set('port',process.env.PORT || 4250);
app.set('views', path.join(__dirname,'views'));
app.engine('.hbs', exphbs.engine({

    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')

}));
//Multer Subida de archivos
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads/'),
    filename: (req, file, cb) => {
        file.originalname = uuidv4() + path.extname(file.originalname);
        console.log(file.originalname);
        cb(null, file.originalname);
    }
});

//Multer subir credencial
const upload = multer({
    storage,
    limits: {fileSize: 1 * 1024 * 1024}, // MB;
    fileFilter:(req, file,cb)=>{
        const filetypes = /pdf|jpg|jpeg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname));
        if(mimetype && extname){
            return cb(null,true);
        }
        cb("Error: Archivo debe ser un documento valido o una imagen valida");
    },
    dest: path.join(__dirname, 'public/uploads/')
});
const uploadMultiple = upload.fields([{ name: 'credencial', maxCount: 1 }, { name: 'foto', maxCount: 10 }])

app.set('view engine', '.hbs');
//Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(favicon(path.join(__dirname, 'public/dist/img', 'favicon.png')))
app.use(session({
    secret: 'S0porteti2022',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(uploadMultiple);
//Global Variables
app.use((req, res, next) => {
    app.locals.message = req.flash('message');
    app.locals.success = req.flash('success');
    app.locals.error = req.flash('error');
    //app.locals.showreport = req.flash('showreport');
    //app.locals.showreportservicesgeneral = req.flash('showreportservicesgeneral');
    //app.locals.showreportserviceschecklist = req.flash('showreportserviceschecklist');
    app.locals.user = req.user;
    next();
});
//Routes
app.use(require('./routes'));
app.use('/dashboard',require('./routes/dashboard'));
//Public
app.use(express.static(path.join(__dirname, 'public')));
//Start the Server
app.listen(app.get('port'), () => {

    console.log('Server on port', app.get('port'));

});
