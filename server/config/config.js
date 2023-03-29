<<<<<<< HEAD
process.env.PORT = process.env.PORT || 3000

//Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// front-end page
process.env.URL = process.env.URL || "http://localhost:4200"

//Vencimiento del token para sesiones
//60 segundos * 60 minutos * 24 horas * 30 dias
process.env.END_TOKEN = 1000 * 60 * 60 * 24 * 30;

// Token para recuperación de contraseñas
process.env.RECOVER_PASSWORD_TIME = '1h'

//Seed de autenticación 
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//Seed de recuperar contraseña
process.env.RECOVER_PASSWORD_SEED = process.env.RECOVER_PASSWORD_SEED || 'seed-para-recuperar-contraseña';

//Google ID
process.env.CLIENT_ID = '817997186963-ifufs7fs14r32cggh1q7360g0hnmav0a.apps.googleusercontent.com'

//Base de datos
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://127.0.0.1:27017/madnolia';
} else {
    urlDB = process.env.MONGO_URI;
}

=======
process.env.PORT = process.env.PORT || 3000

//Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//Vencimiento del token para sesiones
//60 segundos * 60 minutos * 24 horas * 30 dias
process.env.END_TOKEN = 1000 * 60 * 60 * 24 * 30;

// Token para recuperación de contraseñas
process.env.RECOVER_PASSWORD_TIME = '1h'

//Seed de autenticación 
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//Seed de recuperar contraseña
process.env.RECOVER_PASSWORD_SEED = process.env.RECOVER_PASSWORD_SEED || 'seed-para-recuperar-contraseña';

//Google ID
process.env.CLIENT_ID = '817997186963-ifufs7fs14r32cggh1q7360g0hnmav0a.apps.googleusercontent.com'

//Base de datos
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://127.0.0.1:27017/madnolia';
} else {
    urlDB = process.env.MONGO_URI;
}

>>>>>>> 3f575ba2f65495761cb8fbe59ed74702355a3a32
process.env.urlDB = urlDB;