var express = require('express'); 
var bodyParser = require('body-parser'); 
var multer = require('multer'); 
var mongoose = require('mongoose'); 


var upload = multer(); 
var app = express(); 
mongoose.connect("mongodb://localhost:27017/my_db" , { useNewUrlParser: true }).then(
  (res) => {
   console.log("Connected to Database Successfully.")
   
  }
).catch(() => {
  console.log("Conntection to database failed.");
});
app.use(bodyParser.json());

express.urlencoded({ extended: true });
app.use(express.urlencoded());


var personSchema = mongoose.Schema({ 
    name: String, email: String, password: String,cpassword:String ,role:String}); 
var Person = mongoose.model("Person", personSchema);

var productSchema = mongoose.Schema({ 
  name: String, price: String, category: String,description:String, productId:String }); 
var Product = mongoose.model("Product", productSchema);
app.use(express.static('public')); 

app.set('view engine', 'pug'); 
app.set('views', './'); // for parsing application/json 

app.get('/product', function(req, res){
 
  res.sendFile( __dirname + "/public/" + "product.html" );
}); 

/***********Login****/
app.get('/', function(req, res){
 
    res.sendFile( __dirname + "/public/" + "login.html" );
  }); 
  app.post('/login', function(req,res){
    const fname=req.body.name;
    const psw=req.body.psw;
   
    Person.findOne({name:fname, password:psw,role:'saler'},function(err,response){ 
     
      if(response==null){ 
        Person.findOne({name:fname, password:psw,role:'buyer'},function(err,result){ //checking if user is a buyer
         
          if(result==null){
          console.log("user doesnot exists"); //user doesnot exists in the database
            }
            else{
              Product.find({},
                function(err, docs) {
                  if (!err){ 
                      res.render('buyer', { title: 'verify', results: docs});
                  }
                  else { throw err;}
                }
              );
               
              
        
            }
        
       
        });
      }
      else{ //if user is a seller
        Product.find({},
          function(err, docs) {
            if (!err){ 
                res.render('pro', { title: 'verify', results: docs});
            }
            else { throw err;}
          }
        );
      }
           
      
    });
    
    
  });
  /********Delete*****/
  app.get('/delete', function(req, res){
    
    res.sendFile( __dirname + "/public/" + "delete.html" );
      
    });
   
  app.post('/delete', function(req,res){
    const name=req.body.name;
    const pid=req.body.pid;
    if(!req.body.pid || !req.body.name )
    {
      console.log("no field should be empty in delete form");
    }
    
     Product.findOneAndRemove({name: name}, function(err, response) { console.log(response); });
     
    // res.sendFile( __dirname + "/public/" + "product.html")
     Product.find({},
      function(err, docs) {
        if (!err){ 
            res.render('pro', { title: 'verify', results: docs});
        }
        else { throw err;}
      }
    );
    
     
    
  });
/************SignUp******/
  app.get('/signup',function(req,res){
    res.sendFile( __dirname + "/public/" + "signup.html")
  });


app.post('/signup', function(req,res){
    const name=req.body.name;
    const email=req.body.email;
    const password=req.body.psw;
    const cpassword=req.body.cpsw;
    const role=req.body.role;
if(!req.body.name || !req.body.email || !req.body.psw || !req.body.cpsw || !req.body.role)
{
  console.log("no field should be empty"); //check signup form

}      
    var newPerson = new Person({
        name: name,
        email:email,
        password: password,
        cpassword: cpassword,
        role:role
     });
    
     newPerson.save(function(err, Person){
         if(err)throw err;
         else
         console.log("done");
     });
   
     
     res.sendFile( __dirname + "/public/" + "login.html")
   
});
/*************Add New Item*****/
app.get('/addnew', function(req, res){
 
  res.sendFile( __dirname + "/public/" + "addnew.html" );
}); 
app.post('/addnew', function(req,res){
  const name=req.body.name;
  const price=req.body.price;
  const category=req.body.category;
  const description=req.body.description;
  const pid=req.body.pid;

  if(!req.body.name || !req.body.price || !req.body.category || !req.body.description || !req.body.pid)
  {
    console.log("no filed should be empty in add new form");
  }
  var newProduct = new Product({
      name: name,
      price:price,
      productId: pid,
      category: category,
      description:description
   });
     
   newProduct.save(function(err, Person){
       if(err)throw err;
       else
       console.log("done");
   });
   console.log("hello");
   Product.find({},
    function(err, docs) {
      if (!err){ 
          res.render('pro', { title: 'verify', results: docs});
      }
      else { throw err;}
    }
  );
  
});
/*******Update*****/
app.get('/update', function(req, res){
 
  res.sendFile( __dirname + "/public/" + "update.html" );
}); 
app.post('/update', function(req,res){
  const name=req.body.name;
  const price=req.body.price;
  const description=req.body.description;
 
if(!req.body.name || !req.body.price || !req.body.description){
  console.log("no field should be empty in update form");
}

  
   Product.findOneAndUpdate({name: name}, {price:price,description:description}, function(err, response) { console.log(response); });
   
  // res.sendFile( __dirname + "/public/" + "product.html")
   Product.find({},
    function(err, docs) {
      if (!err){ 
          res.render('pro', { title: 'verify', results: docs});
      }
      else { throw err;}
    }
  );
  
   
  
});
/********Products***** */
app.get('/pro',(req,res,next) =>{
  //Here fetch data using mongoose query like
 
    Product.find({},
      function(err, docs) {
        if (!err){ 
            res.render('pro', { title: 'verify', results: docs});
        }
        else { throw err;}
      }
    );
  
});

/*app.get('/login',(req,res,next) =>{
  console.log("yesss");
    Product.find({},
      function(err, docs) {
        if (!err){ 
            res.render('pro', { title: 'verify', results: docs});
        }
        else { throw err;}
      }
    );
  
});*/

 app.listen(3000);