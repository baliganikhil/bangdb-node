var bangdb = require('./bangdb');

var User = new bangdb.Schema({
    name: String,
    age: {type: Number, required: false, min: 8, max: 15}
});

var mymodel = bangdb.model('User', User);

var user = {
    name: 'Nikhil'
};

console.log((new mymodel(user)).save(function (err, doc) { console.log(err, doc, " <=="); }));


