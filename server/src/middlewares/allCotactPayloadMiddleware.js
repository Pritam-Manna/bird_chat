module.exports = function allCotactPayloadMiddleware(req, res, next) {
    let tempErrors = [],
        response;
    try{
        if(req.body.user === undefined || isNaN(req.body.user) === true){
            tempErrors.push("User missing or not a valid number")
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