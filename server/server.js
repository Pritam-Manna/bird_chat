const cors = require('cors');
const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken')
require('dotenv').config();


const app = express()
app.listen(8000);
app.use(cors({
    origin: "http://localhost:3000"
}))

app.use(express.json())

/*-----------------------API Middlewares----------------------*/
const contactPayloadMiddleware = require ('./src/middlewares/contactPayloadMiddleware');
const sendMsgPayloadMiddleware = require ('./src/middlewares/sendMsgPayloadMiddleware');
const getMsgPayloadMiddleware = require ('./src/middlewares/getMsgPayloadMiddleware');
const getMsgAllContactPayloadMiddleware = require ('./src/middlewares/getMsgAllContactPayloadMiddleware');
const allCotactPayloadMiddleware = require ('./src/middlewares/allCotactPayloadMiddleware');
const userPayloadMiddleware = require ('./src/middlewares/userPayloadMiddleware');
const verifyToken = require('./src/middlewares/verifyToken');
const signinPayloadMiddleware = require('./src/middlewares/signinPayloadMiddleware')

/*-----------------------MongoDB(controller)----------------------*/
const MongodbController = require('./src/controllers/mongodb_controller');
const MongoControllerObj = new MongodbController();




/*-----------------------Socket io----------------------*/
// const SocketCon = require('./components/socket/socketCon')
const { Server } = require("socket.io");
const http = require("http");
const exp = require('constants');
const socket_port = process.env.socket_port;
const frontend_uri = process.env.frontend_uri;
// console.log(socket_port);
// const SocketConObj = new SocketCon(app, socket_port, frontend_uri)
// console.log(SocketConObj)
const server = http.createServer(app).listen(socket_port);
const io = new Server(server, {
  cors: {
    origin: frontend_uri
  }
});
io.on("connection", (socket) => {

    socket.on("registerCon", (args) => {
        let temo_obj = {
            "ph" : args,
            "socket_id" : socket.id
        }
        // current_users.push(temo_obj);
        console.log(temo_obj);
        
    })
    socket.on("sendMsg", (msg)=>{
        // console.log(socket.id);
        // MongoConObj.sendMsg(Mongo_Database, msg)
        // MongoConObj.addToContacts(Mongo_Database, Mongo_Col_Contact, msg)
        // MongoConObj.addToContacts(Mongo_Database, Mongo_Col_Contact, msg)
        // MongodbController.
        // MongoControllerObj
        // console.log(arg);
    })
})

/*-----------------------test APIs----------------------*/
app.get("/test", async (req, res, next) => {
    //console.log(req.body);
    // let response = await MongoControllerObj.addToContacts(req.body);
    // let response = await MongoControllerObj.checkIfContact(req.body);
    // let response = await MongoControllerObj.sendMessage(req.body);
    // let response = await MongoControllerObj.totalMessageCount(req.body);
    // let response = await MongoControllerObj.getMessages(req.body);
    // let response = await MongoControllerObj.getAllContactMessages(req.body);
    //let response = await MongoControllerObj.getAllContactMessages(req.body);
    // let response = await MongoControllerObj.createUser(req.body);
    // let response = await MongoControllerObj.updateUser(req.body);
    // let response = await MongoControllerObj.verifyApiToken(req.body);
    // console.log(response);

    // //console.log(req.body);
    // res.send(response);
    console.log(req.headers.authorization)
    basicCredToken = req.headers.authorization.split(" ")[1]
    // console.log(atob(basicCredToken));
    console.log(basicCredToken);
    res.send("yes");
    
    // res.json(response);
    //
})


/*-----------------------All APIs----------------------*/

app.post('/add-to-contact', contactPayloadMiddleware, verifyToken, async (req, res, next) => {
    // res.send("this is 'add-to-contact'");
    let response = await MongoControllerObj.addToContacts(req.body);
    res.json(response);
});

app.get('/check-contact', contactPayloadMiddleware, verifyToken, async (req, res, next) => {
    // res.send("this is 'check-contact'")
    let response = await MongoControllerObj.checkIfContact(req.body);
    res.json(response);
});

app.post('/send-message', sendMsgPayloadMiddleware, verifyToken, async (req, res, next) => {
    // res.send("this is 'send-message'")
    let response = await MongoControllerObj.sendMessage(req.body);
    res.json(response);
});

app.get('/get-messages', getMsgPayloadMiddleware, verifyToken, async (req, res, next) => {
    // res.send("this is 'send-message'")
    let response = await MongoControllerObj.getMessages(req.body);
    res.json(response);
});

app.get('/get-message-all-contacts', getMsgAllContactPayloadMiddleware, verifyToken, async (req, res, next) => {
    // res.send("this is 'get-message-all-contacts'")
    let response = await MongoControllerObj.getAllContactMessages(req.body);
    res.json(response);
});

app.get('/get-all-contacts', allCotactPayloadMiddleware, verifyToken, async (req, res, next) => {
    // res.send("this is 'get-all-contacts'")
    let response = await MongoControllerObj.getAllContacts(req.body);
    res.json(response);
});

app.get('/total-message-count', contactPayloadMiddleware, verifyToken, async (req, res, next) => {
    // res.send("this is 'total-message-count'")
    let response = await MongoControllerObj.totalMessageCount(req.body);
    res.json(response);
});

app.get('/create-user', userPayloadMiddleware, verifyToken, async (req, res, next) => {
    // res.send("this is 'create-user'")
    let response = await MongoControllerObj.createUser(req.body);
    res.json(response);
});

app.get('/update-user', userPayloadMiddleware, verifyToken, async (req, res, next) => {
    // res.send("this is 'update-user'")
    let response = await MongoControllerObj.updateUser(req.body);
    res.json(response);
});

app.get('/signin', signinPayloadMiddleware, async (req, res, next) => {
    // console.log(req.socket.remoteAddress);
    let signInRes,
        response,
        token,
        jwtSecretKey = process.env.jwtSecretKey;
        // console.log(jwtSecretKey);
    try{
        signInRes = await MongoControllerObj.signIn(req.body);
        if(signInRes.success === true){
            let userCred = {
                user: req.body.user,
                password: req.body.password
            }
            token = jwt.sign(userCred, jwtSecretKey);
            saveTokenRes = await MongoControllerObj.saveApiToken({user: req.body.user, token: token})
            if(saveTokenRes.success === false){
                response = {
                    success: false,
                    res: {
                        errorMsg: saveTokenRes.res.errorMsg
                    }
                }
            }else{
                response = {
                    success: true,
                    res: {
                        message: signInRes.res.message,
                        token: token
                    }
                }
            }
            res.json(response)
        }else{
            res.json(signInRes);
        }        
    }catch(e){
        response = {
            success : false,
            res: {
                errorMsg: "Unable to autheticate, please try after sometime"
            }
        }
        res.json(response);
    }
    
    
});

app.get('/signout', verifyToken, async(req, res, next) => {
    let response,
    payload,
    authorizationHeader;
    try{
        authorizationHeader = req.headers.authorization;
        if(authorizationHeader === undefined){
            bearerApiToken = "";
        }else{
            bearerApiToken = authorizationHeader.split(" ")[1];
        }
        payload = {user: req.body.user, token: bearerApiToken}
        response =  await MongoControllerObj.signOut(payload);
        res.json(response)
    }catch(e){
        response = {
            success: false,
            res: {
                errorMsg: "Unable to logout, please try after sometime"
            }
        }
        res.json(response)
    }
})

app.use((req, res, next) => {
    let response = {
        success: false,
        res: {
            error: "Sorry unable to find any such API, please check once."
        }
    }
    
    res.json(response);
})






const current_users = [];




// app.use(session({
//     secret: 'privateKey',
//     resave: true,
//     saveUninitialized: true
//   }))

//   session.count = "123";
//   console.log(session);

// io.on("connection", (socket) => {

//     socket.on("registerCon", (args) => {
//         let temo_obj = {
//             "ph" : args,
//             "socket_id" : socket.id
//         }
//         current_users.push(temo_obj);
//         console.log(current_users);
        
//     })

//     socket.on("resFromclient", (arg)=>{
//         console.log(socket.id);
//         console.log(arg);

//     })
// })

// app.post('/', function(req, res, next){
//     console.log(req.body);
//     res.json({hi: 1});
// })

