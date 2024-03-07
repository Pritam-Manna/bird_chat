require('dotenv').config();

/*-----------------------MongoDB(utils)----------------------*/
const MongoCon = require('../models/mongoCon');


/*-----------------------Mongo Obj----------------------*/
// const MongoConObj = new MongoCon(Mongo_Uri);

module.exports = class Mongodb_Controller {

    Mongo_Database = process.env.db;
    Mongo_Col_Contact = process.env.collection_contact;
    Mongo_Col_UserApiToken = process.env.collection_apiToken;
    Mongo_Uri = process.env.mongodb_uri;

    constructor(){
        this.MongoConObj = new MongoCon(this.Mongo_Uri);
        // console.log(this.Mongo_Database);
    }
    
    async addToContacts (reqObj){
        let MongoRes = await this.MongoConObj.addToContacts(this.Mongo_Database, this.Mongo_Col_Contact, reqObj);
        let response;
        if(MongoRes.error === false){
            let temp_msg;
            let temp_success;
            if(MongoRes.res.modifiedCount === 0 && MongoRes.res.upsertedCount === 0 && MongoRes.res.matchedCount === 1){
                temp_msg = "Already a contact";
                temp_success = false;
            }else {
                temp_msg = "Successfully added as a contact";
                temp_success = true;
            }
            response = {
                success : temp_success,
                res: {
                    message: temp_msg
                }
            }

        }else{
            response = {
                success : false,
                res: {
                    message: "Unable to add as a contact, please after sometime"
                }
            }
        }
        return response;
    }

    async checkIfContact (reqObj){
        let MongoRes = await this.MongoConObj.checkIfContact(this.Mongo_Database, this.Mongo_Col_Contact, reqObj);
        let response;
        if(MongoRes.error === false){
            let temp_msg;
            let temp_success;
            if(MongoRes.res === 0){
                temp_msg = "Not in contact";
                temp_success = false;
            }else {
                temp_msg = "It is a valid contact";
                temp_success = true;
            }
            response = {
                success : temp_success,
                res: {
                    message: temp_msg
                }
            }

        }else{
            response = {
                success : false,
                res: {
                    message: "Unable to check if it is a conatct, please after sometime"
                }
            }
        }
        return response;
    }

    async sendMessage(reqObj){
        /* check if alrady a valid contact */
        let MongoRes_ContactCheck = await this.checkIfContact(reqObj);
        let response;
        if(MongoRes_ContactCheck.success === true){
            let MongoRes = await this.MongoConObj.sendMsg(this.Mongo_Database, reqObj);
            if(MongoRes.error === false){
                response = {
                    success : MongoRes.res.acknowledged,
                    res: {
                        messageId : MongoRes.res.insertedId
                    }
                }
            }else{
                response = {
                    success : false,
                    res: {
                        message : "unable to send message, please try again later"
                    }
                }
            }
            // console.log(MongoRes);
        }else{
            response = {
                success : false,
                res: {
                    message : MongoRes_ContactCheck.res.message
                }
            }
            // console.log(response);
        }
        // console.log(response);
        return response;
        //
    }

    async totalMessageCount(reqObj){
        let MongoRes = await this.MongoConObj.totalMessageCount(this.Mongo_Database, reqObj);
        let res ;
        if(MongoRes.error === false){
            res = {
                success : true,
                res : {
                    totalMsgCount: MongoRes.res
                }
            }
        }else{
            res = {
                success : false,
                res : {
                    message: "unable to count the number of messages"
                }
            }
        }
        // console.log(MongoRes);
         return res;
    }

    async getMessages(reqObj){
        let MongoRes = await this.MongoConObj.getMessages(this.Mongo_Database, reqObj);
        let res;

        if(MongoRes.error === false){
            if(MongoRes.res.length > 0){
                res = {
                    success : true,
                    res: {
                        messages : MongoRes.res
                    }
                }
            }else{
                res = {
                    success : false,
                    res: {
                        messages : "Sorry unable to find any messages with this criteria"
                    }
                }
            }
        }else{
            res = {
                success : false,
                res: {
                    messages : MongoRes.res
                }
            }
        }

        return res;
    }

    async getAllContacts (reqObj){
        let MongoRes = await this.MongoConObj.getAllContacts(this.Mongo_Database, this.Mongo_Col_Contact, reqObj);
        let res;
        if(MongoRes.error === false){
            if(MongoRes.res.contacts.length === 0){
                res = {
                    success : false,
                    res: {
                        messages : "There are no cotacts found"
                    }
                }

            }else{
                res = {
                    success : true,
                    res: {
                        contacts : MongoRes.res.contacts
                    }
                }
            }
            
        }else{
            res = {
                success : false,
                res: {
                    messages : "Unable to get all contacts, please try after sometime"
                }
            }
        }

        return res;
    }

    async getAllContactMessages (reqObj){
        const allContactsRes = await this.getAllContacts(reqObj);
        let response;
        // console.log(allContactsRes);

        if(allContactsRes.success === true){
            let allContactMessages = [];
            const allContactsArray = allContactsRes.res.contacts,
            allContactsArrayLen = allContactsArray.length,
            currentUser = reqObj.user,
            currentSkip = reqObj.skip,
            currentLimit = reqObj.limit;
            let getMessagesRes,
                tempReqObj,
                cotactSpecificRes;
            for(let i=0; i<allContactsArrayLen; i++){
                tempReqObj = {
                    user : currentUser,
                    contact: allContactsArray[i],
                    skip: currentSkip,
                    limit : currentLimit
                }
                getMessagesRes = await this.getMessages(tempReqObj);
                //allContactMessages[currentUser] = getMessagesRes.res.messages;
                if(getMessagesRes.success === false){
                    cotactSpecificRes = {success: false ,contact: allContactsArray[i], errorMsg: getMessagesRes.res.messages};
                }else{
                    cotactSpecificRes = {success: true ,contact: allContactsArray[i], messages: getMessagesRes.res.messages};
                }
                allContactMessages.push(cotactSpecificRes);
            }
            // console.log(allContactMessages);
            response = {
                success : true,
                user: currentUser,
                res: {
                    allContactMessages : allContactMessages
                }
            }
        }else{
            response = {
                success : false,
                res: {
                    messages : allContactsRes.res.messages
                }
            }
        }

        return response;
        
    }

    async createUser (reqObj){
        let res;
        try{
            const createUserRes = await this.MongoConObj.createUser(this.Mongo_Database, this.Mongo_Col_Contact, reqObj);
            if(createUserRes.error === false){
                res = {
                    success : true,
                    res: {
                        errorMsg: "User created successfully"
                    }
                }
            }else if (createUserRes.error === true && createUserRes.res.code === 11000){
                res = {
                    success : false,
                    res: {
                        errorMsg: "Unable to create a new user, as a user is already existing with this number"
                    }
                }
            }else{
                res = {
                    success : false,
                    res: {
                        errorMsg: "Unable to create user, please try after sometime"
                    }
                }
            }
            return res;
        }catch(e){
            res = {
                success : false,
                res: {
                    errorMsg: "Unable to create user, please try after sometime"
                }
            }
            return res;
        }
        
    }

    async updateUser (reqObj){
        let res;
        try{
            const updateUserRes = await this.MongoConObj.updateUser(this.Mongo_Database, this.Mongo_Col_Contact, reqObj);
            if(updateUserRes.error === false){
                if(updateUserRes.res.modifiedCount === 1 && updateUserRes.res.matchedCount === 1){
                    res = {
                        success : true,
                        res: {
                            errorMsg: "User password updated successfully"
                        }
                    }
                }else if(updateUserRes.res.modifiedCount === 0 && updateUserRes.res.matchedCount === 1){
                    res = {
                        success : false,
                        res: {
                            errorMsg: "Password is same as previous password"
                        }
                    }
                }else if(updateUserRes.res.matchedCount === 0){
                    res = {
                        success : false,
                        res: {
                            errorMsg: "Unable to find user, check user number"
                        }
                    }
                }else{
                    res = {
                        success : false,
                        res: {
                            errorMsg: "Unable to update password, please try after sometime"
                        }
                    }
                }
            }else{
                res = {
                    success : false,
                    res: {
                        errorMsg: "Unable to update password, please try after sometime"
                    }
                }
            }
            return res;
        }catch(e){
            res = {
                success : false,
                res: {
                    errorMsg: "Unable to update password, please try after sometime"
                }
            }
            return res;
        }
        
    }

    async signIn (reqObj){
        let res;
        try{
            const signInRes = await this.MongoConObj.signIn(this.Mongo_Database, this.Mongo_Col_Contact, reqObj);
            //console.log (signInRes);
            if(signInRes.error === false){
                res = {
                    success: true,
                    res: {
                        message: signInRes.res.message
                    }
                }
            }else{
                res = {
                    success: false,
                    res: {
                        errorMsg: signInRes.res.message
                    }
                }
            }
            return res;
        }catch(e){
            res = {
                success : false,
                res: {
                    errorMsg: "Unable to authenticate, please try again later"
                }
            }
            //console.log (e);
            return res;
        }
    }

    async saveApiToken(reqObj){
        let res;
        try{
            const saveApiTokenRes = await this.MongoConObj.saveApiToken(this.Mongo_Database, this.Mongo_Col_UserApiToken, reqObj);
            // console.log(saveApiTokenRes);
            if(saveApiTokenRes.error === false && saveApiTokenRes.res.modifiedCount === 1){
                res =  {
                    success: true,
                    res: {
                        message: "token saved successfully"
                    }
                }
            }else{
                res =  {
                    success: false,
                    res: {
                        errorMsg: saveApiTokenRes.res.message
                    }
                }
            }
            return res;
        }catch(e){
            res = {
                success: false,
                res: {
                    errorMsg: "Unable to authenticate token, please try after sometime"
                }
            }
            //console.log(e);
            return res;
        }
    }

    async verifyApiToken(reqObj){
        let res;
        try{
            const verifyApiTokenRes = await this.MongoConObj.verifyApiToken(this.Mongo_Database, this.Mongo_Col_UserApiToken, reqObj);
            // console.log(verifyApiTokenRes)
            if(verifyApiTokenRes.error === false && verifyApiTokenRes.res === 1){
                res = {
                    success: true,
                    res: {
                        message: "Token verified"
                    }
                }
            }else if(verifyApiTokenRes.error === false && verifyApiTokenRes.res === 0){
                res = {
                    success: false,
                    res: {
                        message: "Invalid token"
                    }
                }
            }else{
                res = {
                    success: false,
                    res: {
                        message: "Unable to verify token, please try after sometime."
                    }
                }
            }
            return res;
        }catch(e){
            res = {
                success: false,
                res: {
                    errorMsg: "Unable to authenticate token, please try after sometime"
                }
            }
            return res;
        }
    }

    async signOut(reqObj){
        let res;
        try{
            const signOutRes = await this.MongoConObj.signOut(this.Mongo_Database, this.Mongo_Col_UserApiToken, reqObj)
            if(signOutRes.error === false && signOutRes.res.modifiedCount === 1){
                res = {
                    success: true,
                    res: {
                        message: "Successfully logged out"
                    }
                }
            }else{
                res = {
                    success: false,
                    res: {
                        errorMsg: "Unable to logout, please try after sometime"
                    }
                }
            }
            // console.log(signOutRes);
            return res;
        }catch(e){
            res = {
                success: false,
                res: {
                    errorMsg: "Unable to logout, please try after sometime"
                }
            }
            
            return res;
        }
    }
}