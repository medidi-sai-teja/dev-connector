const validator = require("validator");

/**
 * 
 * @param {name} name 
 * @returns true if valid name else returns an Error object
 */
function isValidName(name){

    const nameRegex = /^[a-zA-Z\s\-']+$/; // This allows letters, spaces, hyphens, apostrophes
    if(!name) return new Error("No name has been entered! Please enter a name.");
    if(typeof name !== "string") return new Error("Name must a string type only! Please enter a valid name.");
    if(name.trim().length < 3) return new Error("Length of the name is less than 3 characters! Please enter a valid name.");
    if(name.trim().length >50) return new Error("Length of the name is greater than 50 characters! Please enter a valid name.");
    if(!name.match(nameRegex)) return new Error("Name should not contain characters other than letters, spaces, hyphens, apostrophes");
    
    return true;

    
}

const validateSignUpData = (req, res, next)=>{
    let {name, email, password} = req.body;
    const nameValidationResult = isValidName(name);

    if(nameValidationResult instanceof Error){ 
        throw nameValidationResult;
    }
    
    if(!email || !validator.isEmail(email)){
        throw new Error("Invalid email!! Please, enter a valid email.");
    }
    
    if(!password || !validator.isStrongPassword(password)){
        throw new Error(`Strong password is required!!
            Constraints:
            1. Minimun 8 characters 
            2. Minimum 1 lowercase 
            3. Minimum 1 uppercase
            4. Minimum 1 number
            5. Minimum 1 special character
            `
        );
    }
    next();

}



const validateUpdateData = (req, res, next)=>{
    if(!req.body)
        throw Error(`Input is required.`)
    if(req.params){
        if(!req.params.userId){
            throw Error("Valid userId is required.")
        }
    }
    // Verify whether requested is data is updatable
    const ALLOWED_UPDATES = ['name', 'password', 'age', 'profilePictureURL', 'skills'];
        Object.keys(req.body).every(key=> {
            if(ALLOWED_UPDATES.includes(key)){
                return true;
            }
            else{
                throw Error(`You cannot update ${key}!!`)
            }
    
        });
    // Validate new name
    if(req.body.name){
        const nameValidationResult = isValidName(req.body.name);
        if(nameValidationResult instanceof Error){ 
            throw nameValidationResult;
        }
    }
    
    // validate new password
    if(req.body.password){
        if(!validator.isStrongPassword(req.body.password)){
            throw Error(`Strong password is required!!
                Constraints:
                1. Minimun 8 characters 
                2. Minimum 1 lowercase 
                3. Minimum 1 uppercase
                4. Minimum 1 number
                5. Minimum 1 special character
                `
            );
        }
    }

    // Validate new age
    if(req.body.age){
        if(req.body.age < 10 && req.body.age > 120){
            console.log(`Invalid Age!! Please enter a valid age.`)
            throw Error(`Invalid Age!! Please enter a valid age.`)
        }
            
    }

    // Validate new profilePictureURL
    if(req.body.profilePictureURL){
        if(!validator.isURL(req.body.profilePictureURL)){
            console.log(`Invalid photo url! Please upload a valid picture url.`)
            throw Error(`Invalid photo url! Please upload a valid picture url.`)
        }
    }

    // Validate new list of skills
        // TODO
    next();

}

module.exports = {validateSignUpData, validateUpdateData};