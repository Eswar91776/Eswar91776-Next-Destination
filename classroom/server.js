const express = require('express');
const app = express();
const user = require('./routes/user');
const post = require('./routes/post');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const ejsMate = require('ejs-mate');


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// ------------------ SESSION CONFIGURATION ------------------

const sessionOptions = {
  secret:'mysupersecretstring' , resave:false, saveUninitialized:true
};
// const cookieParser = require('cookie-parser');

// // app.use(cookieParser("secretcode1234"));


// ------------------ MIDDLEWARE ------------------

// app.use(express.urlencoded({ extended: true }));
// app.use(user);
// app.use("/users", user);
// app.use(post);
// app.use("/posts", post);


// ------------------ ROUTES ------------------

// cookie route
// app.get('/getsignedcookie', (req, res) => {
//   res.cookie('Name', 'Eswar', { signed: true });
//   res.send('Signed Cookie has been set');
// });

// app.get('/verify', (req, res) => {
//   console.log(req.signedCookies);
//   res.send('verified');
  // const { Name } = req.signedCookies;
  // res.send(`Signed cookie has the value: ${Name}`);
// });

// cookie route



// app.get('/getcookies', (req, res) => {
//   res.cookie('greeting', 'HelloWorld');
//   res.cookie('username', 'Eswar');
//   res.send('Cookie has been set');
// });


// Home route
// app.get('/greet', (req, res) => {
//   const { Name = 'Guest' } = req.cookies;
//   res.send(`Welcome back, ${Name}`);
// });
// Root route



// app.get('/', (req, res) => {
//   console.dir(req.cookies);
//   res.send('Hi, im root route');
// });
// ------------------ ROUTES ------------------

app.use((req, res, next) => {
    res.locals.successMsg = req.flash('success');
    res.locals.errorMsg = req.flash('error');
    next();
  });

  app.use(session(sessionOptions));
   app.use(flash());

  app.get('/register', (req, res) => {
    let { name='Guest' } = req.query;
    req.session.name = name;
    if (name === 'Guest'){
      req.flash('error', 'You are registered as Guest!');
    }else{
      req.flash('success', `Welcome, ${name}!`);
    }
    res.redirect('/hello');
  });

  app.get('/hello', (req, res) => {
    // let { name='Shabreen' } = req.session;
    // // console.log(req.session);
    // res.send(`Hello , ${name}`); 
    res.render('page', { name: req.session.name });
  });

  // app.post('/register', (req, res) => {
  //   let { name='Guest' } = req.query;
  //   req.session.name = name;
  //   res.send(`Session set for ${name}`);
  // });

  // app.get('/test', (req, res) => {
  //   res.send("Session Test");
  // });

  // app.get("/reqcount", (req, res) =>{
  //   if (req.session.count) {
  //     req.session.count += 1;
  //     res.send(`You sent a request ${req.session.count} times`);
  //     return;
  //   }else{
  //     req.session.count = 1;
  //   }
  //      res.send(`You sent a request ${req.session.count} times`);
  // });


app.listen(3000, () => {
  console.log('Serving on port 3000');
});