module.exports = function signinPayloadMiddleware (req, res, next){
    let tempErrors = [],
        response,
        authorizationHeader,
        basicAuthCredArr = "",
        user = "",
        password = "";
    
    try{
        authorizationHeader = req.headers.authorization;
        if(authorizationHeader != undefined){
            basicAuthCredArr = atob(authorizationHeader.split(" ")[1]).split(":");
            user = basicAuthCredArr[0];
            password = basicAuthCredArr[1]
        }
        // console.log(user +"    "+password);

        if(user === undefined || isNaN(user) === true){
            tempErrors.push("User field is missing or not a valid number")
        }
        if(password === undefined || password.trim().length === 0){
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
            req.body.user = user;
            req.body.password = password;
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