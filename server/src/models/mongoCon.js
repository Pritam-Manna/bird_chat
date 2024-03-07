
const { MongoClient } = require("mongodb");
module.exports = class MongoCon {
    constructor(mongoUri){
        try{
            this.mongo_client = new MongoClient(mongoUri);
        }catch(e){
            //console.log("Unable to connect to MongoDB");
            //console.log(e);
        }
    }

    async test(db, collection){
        let queryRes = await this.mongo_client.db(db).collection(collection).findOne({ _id: "841" });
        //console.log(queryRes);
    }

    async sendMsg(db,msgObj){

        let query = {_id: new Date(), sender: Number(msgObj.user), receiver: Number(msgObj.contact), msg: msgObj.message, read: false};
        // console.log(query)
        let colName;
        let res;
        if(Number(msgObj.user)>Number(msgObj.contact)){
            colName = "msg_" + msgObj.user + "_" + msgObj.contact;
        }else if(Number(msgObj.user)<Number(msgObj.contact)){
            colName = "msg_" + msgObj.contact + "_" + msgObj.user;
        }
        // console.log(colName);
        try{
            let queryRes =  await this.mongo_client.db(db).collection(colName).insertOne(query);
            res = {
                error: false,
                res: queryRes
            }
            return res;
        }catch(e){
            res = {
                error: true,
                res: e
            }
            return res;
        }
    }

    async addToContacts (db, coll, reqObj){
        let query1 = {_id: reqObj.user},
            add = {$addToSet : {contacts: reqObj.contact}},
            option = { upsert: true};
        
        let res;
        try{
            let queryRes =  await this.mongo_client.db(db).collection(coll).updateOne(query1, add, option);
            res = {
                error: false,
                res: queryRes
            }
            return res;
        }catch(e){
            res = {
                error: true,
                res: e
            }
            return res;
        }
    }

    async checkIfContact(db, coll, reqObj){
        let query = {_id: reqObj.user , contacts: {$in: [reqObj.contact]}}
        let res;
        try{
            let queryRes = await this.mongo_client.db(db).collection(coll).countDocuments(query);
            res = {
                error: false,
                res: queryRes
            }
            return res;
        }catch(e){
            res = {
                error: true,
                res: e
            }
            return res;
            //console.log("Unable to check if it is a contact");
            // console.log(e);
        }
    }

    async getAllContacts(db, coll, reqObj){
        let query = {_id: reqObj.user },
            onlyReturn =  {projection: {_id: 0, contacts: 1}},
            res;

        try{
            let queryRes = await this.mongo_client.db(db).collection(coll).findOne(query, onlyReturn);
            res = {
                error: false,
                res: queryRes
            }
            return res;
        }catch(e){
            res = {
                error: true,
                res: e
            }
            return res;
        }
    }

    async totalMessageCount(db,reqObj){
        let colName;
        let res;
        if(Number(reqObj.user)>Number(reqObj.contact)){
            colName = "msg_" + reqObj.user + "_" + reqObj.contact;
        }else if(Number(reqObj.user)<Number(reqObj.contact)){
            colName = "msg_" + reqObj.contact + "_" + reqObj.user;
        }

        try{
            let queryRes = await this.mongo_client.db(db).collection(colName).countDocuments({});
            res = {
                error : false,
                res : queryRes
            }
            return res;
        }catch(e){
            res = {
                error : true,
                res : e
            }
            return res;
        }
    }

    async getMessages(db,reqObj){
        let colName;
        let res;
        try{
            if(Number(reqObj.user)>Number(reqObj.contact)){
                colName = "msg_" + reqObj.user + "_" + reqObj.contact;
            }else if(Number(reqObj.user)<Number(reqObj.contact)){
                colName = "msg_" + reqObj.contact + "_" + reqObj.user;
            }
    
            let queryRes = this.mongo_client.db(db).collection(colName).find({}).sort( { _id: -1} ).skip(Number(reqObj.skip)).limit(Number(reqObj.limit));
            let messages = await queryRes.toArray();
            
            res = {
                error : false,
                res: messages

            }    
            return res;
        }catch(e){
            res = {
                error : true,
                res:  "Sorry unable to find any messages, please try again"
            }
            return res;
        }
        
    }

    async createUser(db, coll, reqObj){
        // console.log(reqObj);
        let query = {_id: reqObj.user, password: reqObj.password};
        
        let res;
        try{
            let queryRes =  await this.mongo_client.db(db).collection(coll).insertOne(query);
            res = {
                error: false,
                res: queryRes
            }
            return res;
        }catch(e){
            res = {
                error: true,
                res: e
            }
            return res;
        }

    }

    async updateUser(db, coll, reqObj){
        //console.log(reqObj);
        let searchQuery = {_id: reqObj.user},
            updateQuery = {$set: {password: reqObj.password}}
        
        let res;
        try{
            let queryRes =  await this.mongo_client.db(db).collection(coll).updateOne(searchQuery, updateQuery);
            res = {
                error: false,
                res: queryRes
            }
            return res;
        }catch(e){
            res = {
                error: true,
                res: e
            }
            return res;
        }

    }

    async signIn(db, coll, reqObj){
        let query = {_id: reqObj.user, password: reqObj.password};
        let res;
        try{
            let queryRes =  await this.mongo_client.db(db).collection(coll).findOne({_id: reqObj.user})
            if(queryRes != null){
                if(queryRes.password === reqObj.password){
                    res = {
                        error: false,
                        res: {
                            message: "Successfully autheticated" 
                        }
                    }
                }else{
                    res = {
                        error: true,
                        res: {
                            message: "Incorrect password" 
                        }
                    }
                }
            }else{
                res = {
                    error: true,
                    res: {
                        message: "Unable to find the user" 
                    }
                }
            }
            return res;
        }catch(e){
            res = {
                error : true,
                res: {
                    message: "Unable to authenticate, please try again later"
                }
            }
            return res;
        }

    }

    async saveApiToken(db, coll, reqObj){
        let query = {_id: reqObj.user},
            add = {$addToSet : {tokens: reqObj.token}},
            option = { upsert: true},
            res;

        try{
            let queryRes =  await this.mongo_client.db(db).collection(coll).updateOne(query, add, option);
            res = {
                error: false,
                res: queryRes
            }
            return res;
        }catch(e){
            res = {
                error: true,
                res: {
                    message: "unable to save token, please try after sometime"
                }
            }
            return res;
        }
    }

    async verifyApiToken(db, coll, reqObj){
        let query = {_id: reqObj.user, tokens:{$elemMatch: {$eq: reqObj.token}}},
            res;
        try{
            let queryRes = await this.mongo_client.db(db).collection(coll).countDocuments(query); 
            res = {
                error: false,
                res: queryRes
            }
            return res;
        }catch(e){
            res = {
                error: true,
                res: {
                    message: "Unable to authenticate token, please try after sometime"
                }
            }
            // console.log(e)
            return res;
        }
    }

    async signOut(db, coll, reqObj){
        let query = {_id: reqObj.user},
            removeQuery =  {$pull: {tokens: {$eq: reqObj.token}}},
            res;
        try{
            let queryRes = await this.mongo_client.db(db).collection(coll).updateOne(query, removeQuery);
            res = {
                error: false,
                res: queryRes
            }
            return res;
        }catch(e){
            res = {
                error: true,
                res: {
                    errorMsg: "Unable to logout, please try after sometime"
                }
            }
            // console.log(e)
            return res;
        }
    }
}


