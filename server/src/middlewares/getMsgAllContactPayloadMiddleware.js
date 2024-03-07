module.exports = function getMsgAllContactPayloadMiddleware (req, res, next){
    let tempErrors = [],
        response;
    
    try{
        if(req.body.user === undefined || isNaN(req.body.user) === true){
            tempErrors.push("User field is missing or not a valid number")
        }
        if(req.body.skip === undefined || isNaN(req.body.skip) === true){
            tempErrors.push("Skip field is missing or not a valid number")
        }
        if(req.body.limit === undefined || isNaN(req.body.limit) === true){
            tempErrors.push("Limit field is missing or not a valid number")
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