var express=require('express');
var bodyParser=require('body-parser');
var app=express();//Instance 
var mongoose=require('mongoose');
mongoose.connect('mongodb://pranjil:pranjil@ds255588.mlab.com:55588/shit');

//Database Setup
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {         
      // we're connected!
      console.log("Connected To MongoLab Cloud Database :p");
});

//Schema Setup
var urlSchema = mongoose.Schema({
    url: String,
    key: String,
    hits: Number,
    created: String
});

//Model Setup
var Url = mongoose.model('Url', urlSchema);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

console.log("Hello");
app.get('/',function(req, res){
	res.sendfile('./index.html');
})

app.get('/profile/:username',function(req, res){   //get,post,put,delete are verb of http
	res.send("Hi"+req.params.username);
})
var urlArray=[];
var keyArray=[];

app.post('/short',function(req,res){

function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

//Adding url Data
var u = req.body.url;
var k = req.body.key;
if(k==="")
  k=makeid();
var h = 0;
var c = new Date();
var newUrl = new Url({ url: u,key: k});
console.log(newUrl.url+'\n '+newUrl.key+'\n ');

newUrl.save(function (err, testEvent) {
  if (err) return console.error(err);
  console.log("Short Url Created!!");
});
res.send(k);

})

app.get('/:key',function(req,res){
	var user_key=req.params.key;
	Url.findOne({key:user_key},function(err,data){
		if(err)console.error(err);
		res.redirect("https://www."+data.url);
	})
})
/*app.post('/short',function(req,res){
	var user_url=req.body.url;
	var user_key = req.body.key;
	console.log(user_key+" "+user_url);
	urlArray.push(user_url);
	keyArray.push(user_key);
	res.send('URL has been shortened');
})*/

/*app.get('/:key',function(req,res){
	var user_key=req.params.key;
	for (var i = 0; i <keyArray.length; i++) {
		if(keyArray[i]==user_key)
			res.redirect("https://www."+urlArray[i]);
	}
})
//app.get('/aboutus',function(req, res){
//	res.send('My about us page');
//})

//app.get('/contactus',function(req, res){
//	res.send('My Contact us page');
//})

app.get('/*',function(req,res){
	res.send("404 page");
})
*/
app.listen('8080');
