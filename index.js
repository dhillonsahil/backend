const connectToMongo = require('./db')
const express = require('express')
connectToMongo();
const app = express();
const port = 5000;
