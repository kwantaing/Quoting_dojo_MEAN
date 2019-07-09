var express = require('express');
var mongoose = require('mongoose');
var session = require('express-session');
var app = express();

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

var path = require('path');

app.use(express.static(path.join(__dirname, './static')));
const flash = require('express-flash');
app.use(flash());

app.use(session({
    secret: 'keyboardkitteh',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))

app.set('views', path.join(__dirname, './views'));

app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost/quoting_dojo');


var QuoteSchema = new mongoose.Schema({
    author: {type: String, required: [true,"Name is required"], minlength:[3,"Name needs to be at least 3 characters."]},
    quote:{type: String, required: [true, "Quote is required"], minlength:[10, "Quote needs to be at least 10 characters."]}
},{timestamps:true});
mongoose.model('Quote',QuoteSchema);
var Quote = mongoose.model('Quote');


app.get('/', function(req, res) {
    res.render('index');
})

app.post('/quotes', function(req, res) {
    console.log("POST DATA", req.body);
    var quote = new Quote({author: req.body.author, quote: req.body.quote});
    quote.save(function(err) {
        if(err) {
            console.log('something went wrong');
            for(var key in err.errors){
                req.flash('registration', err.errors[key].message);
            }
            res.redirect('/')
        } else { 
            console.log('successfully added a user!');
            res.redirect('/quotes');
        }
    })
})
app.get('/quotes', function(req,res){
    Quote.find({}, function(err,quotes){
        if(err){
            console.log('something went wrong')
        }
        res.render('quotes',{quotes: quotes})
    })})

    app.listen(8000, function() {
    console.log("listening on port 8000");
})