const connectToMongo = require('./db')
const express = require('express')
var cors = require('cors')
connectToMongo();
const app = express();
const port = process.env.PORT || 6501;
app.use(cors())
// CORS configuration
const corsOptions = {
    origin: 'http://takemynote.heavenwear.in/', // Replace with the actual origin of your frontend app
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true, // Enable credentials (cookies, authorization headers, etc.)
  };
  
  app.use(cors(corsOptions));

app.use(express.json()) // to use req.body we have to use this
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.listen(port , ()=>{
    console.log(`TakemyNote app listening at http://localhost:${port}`)
})
