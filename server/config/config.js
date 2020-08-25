
//PUERTO
process.env.PORT = process.env.PORT || 3000;

//Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//Vencimiento del token
process.env.CADUCIDAD_TOKEN = 60 * 60 *24 *30;

//SEED de autenticacion
process.env.SEED = process.env.SEED || 'secret';

//Base de Datos
let urlDB;

if (process.env.NODE_ENV === 'dev' ) {
   urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = 'mongodb+srv://cafe-user:cafenode@cafe.5uqjx.mongodb.net/cafe?retryWrites=true&w=majority';
    
}
process.env.URLDB = urlDB;

// Google client ID
process.env.CLIENT_ID = process.env.CLIENT_ID || '689779701177-qc23fb2afeoujehnjror2mopic5jq9d3.apps.googleusercontent.com';  