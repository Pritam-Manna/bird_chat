module.exports = function userPayloadMiddleware (req, res, next){
    let tempErrors = [],
        response;
    
    try{
        if(req.body.user === undefined || isNaN(req.body.user) === true){
            tempErrors.push("User field is missing or not a valid number")
        }
        if(req.body.password === undefined || req.body.password.trim().length === 0){
            tempErrors.push("Password field is not present or empty")
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
            next();
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