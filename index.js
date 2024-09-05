require("./utils.js");
const dotenv = require('dotenv').config()
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const ObjectId = require('mongodb').ObjectId;

const bcrypt = require('bcrypt');

const cron = require('node-cron');

const {Readable} = require('stream');
const crypto = require('crypto');
const { pipeline } = require('stream/promises');

const fs = require('fs');
const path = require('path');

const multer = require("multer");
const stream = require("stream");
// const cloudinary = require('cloudinary').v2;

// const Swal = require('sweetalert2');
const Queue = require('bull');
const saltRounds = 10;

const app = express();
const port = process.env.PORT || 3000;
const Joi = require('joi');
const ejs = require('ejs');

const mongodb_host = process.env.MONGODB_HOST;
const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_appdb = process.env.MONGODB_APPDATABASE;
const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;

const node_session_secret = process.env.NODE_SESSION_SECRET;

//Creating a MongoClient and using it to connect to a specified database
const MongoClient = require("mongodb").MongoClient;
const appdb = new MongoClient(`mongodb+srv://${mongodb_user}:${mongodb_password}@${mongodb_host}/${mongodb_appdb}?retryWrites=true`);

// ----- Collections -----
const trainersdb = appdb.db(mongodb_appdb).collection('trainers');
const classesdb = appdb.db(mongodb_appdb).collection('classes');

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// This is for storing active sessions
var mongoStore = MongoStore.create({
	mongoUrl: `mongodb+srv://${mongodb_user}:${mongodb_password}@${mongodb_host}/sessions`,
	crypto: {
		secret: mongodb_session_secret
	}
});

app.use(session({
	secret: node_session_secret,
	store: mongoStore, //default is memory store 
	saveUninitialized: false,
	resave: true
}));

app.get('/', async (req, res) => {
    res.render('home');
});