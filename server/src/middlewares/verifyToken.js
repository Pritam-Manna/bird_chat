const MongodbController = require('../controllers/mongodb_controller');

module.exports = async function verifyToken(req, res, next){
    let tempErrors = [],
        response,
        authorizationHeader,
        bearerApiToken;
    try{
        authorizationHeader = req.headers.authorization;
        if(authorizationHeader === undefined){
            bearerApiToken = "";
        }else{
            bearerApiToken = authorizationHeader.split(" ")[1];
        }
        if(req.body.user === undefined || isNaN(req.body.user) === true){
            tempErrors.push("User field is missing or not a valid number")
        }
        // if(req.body.token === undefined || req.body.token.trim().length === 0){
        if(bearerApiToken === undefined || bearerApiToken.trim().length === 0){
            tempErrors.push("Token header is not present or empty")
        }
        if(tempErrors.length > 0){
            response = {
                success : false,
                res: {
                    errors: tempErrors
                }
            }
            res.json(response);
        }else{
            const MongoControllerObj = new MongodbController();
            let paylod = {user: req.body.user, token: bearerApiToken}
            let verifyTokenRes = await MongoControllerObj.verifyApiToken(paylod);
            // console.log(verifyTokenRes);
            if(verifyTokenRes.success === true){
                next();
            }else{
                res.json (verifyTokenRes) 
            }
        }
    }catch(e){
        response = {
            success : false,
            res: {
                errors: "Something went wrong, please try after sometime"
            }
        }
        res.json(response);
    }

}