'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;
var GLOBAL = require('./global.json');

const user = GLOBAL.user;
const password = GLOBAL.password;
const url = GLOBAL.url;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://'+user+':'+password+'@'+url+'/kind_of_spotify', (err, res)=>{
    if(err){
        throw err;
    }else{
        console.log("La conexión a la base de datos está corriendo correctamente..");
        
        app.listen(port, function (){
            console.log("Servidor API rest de musica escuchando en http://localhost:"+port);
         });
    }
 });
// 'use strict'

// var mongoose = require('mongoose');
// var app = require('./app');
// var port = process.env.PORT || 3977;

// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost:27017/curso_main2', (err, res)=>{
//     if(err){
//         throw err;
//     }else{
//         console.log("La conexión a la base de datos está corriendo correctamente..");
        
//         app.listen(port, function (){
//             console.log("Servidor API rest de musica escuchando en http://localhost:"+port);
//          });
//     }
// });