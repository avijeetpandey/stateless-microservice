// importing required node modules
const express=require('express');
const path=require('path');
const logger=require('morgan');
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');
const fs=require('fs');

const users=require('./routes/users');
const api=require('./routes/images');

const app=express();
const PORT=process.env.PORT || 3000;

// writting stream for logs
const logStream=fs.createWriteStream(path.join(__dirname,'server.log'),{flags:'a'});

// using the middlewares
app.use(logger('dev'));
app.use(bodyParser.json());  // for parsing json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('combined', { stream: logStream }));

app.use('/api',api);
app.use('/api/users',users);


// server listening to port 3000
app.listen(PORT,()=>{
    console.log(`Server is up and running on PORT : ${PORT}`);
});
