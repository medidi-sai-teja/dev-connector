require("dotenv").config();
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50,
        lowercase: true,
        trim: true,
        match: /^[a-zA-Z\s\-']+$/,

    },
    
    email: {
        type: String,
        required: true,
        immutable: true,
        /**
        validator.isEmail(str [, options]):
         
        Core Functionality
            It verifies the standard "username@domain" structure using complex logic that is more comprehensive than a simple regular expression. By default, it: 
                1. Checks if the string is an email.
                2. Checks for the presence of the @ symbol and a valid domain.
                3. Ensures the domain includes a Top-Level Domain (TLD) like .com or .org.
                4. Validates the length of the email against standard limits.
                5. Allows non-English (UTF-8) characters in the local part by default. 
        Common Customization Options
            - You can pass an options object to strictly enforce or relax certain rules: 
            - allow_display_name: true: Allows the format Name <email@address.com>.
            - require_tld: false: Allows emails like user@localhost (useful for internal testing).
            - allow_ip_domain: true: Allows IP addresses instead of domain names (e.g., user@192.168.1.1).
            - domain_specific_validation: true: Enables stricter checks for major providers (e.g., rejecting GMail addresses that GMail itself would reject even if they are syntactically valid).
            - host_blacklist / host_whitelist: Rejects or permits only specific domains (e.g., ['gmail.com']). 

        options is an object which defaults to 
            {
                allow_display_name: false,
                require_display_name: false,
                allow_utf8_local_part: true,
                require_tld: true,
                allow_ip_domain: false,
                allow_underscores: false, 
                domain_specific_validation: false,
                blacklisted_chars: '', 
                host_blacklist: [] 
            }
        */
        validate: val => validator.isEmail(val),
    },

    cleanEmail: {
        type: String,
        required: true,
        unique: true,
        immutable: true,
      
    },

    password:{
        type: String,
        required: true,
        maxLength: 255, // 255 is recommended to "future-proof" the database in case we switch to longer hashing algorithms like Argon2 later.
        validate: val => {
            if(!validator.isStrongPassword(val)){
                throw new Error(`Strong password required!!
                    Constraints:
                    1. Minimun 8 characters 
                    2. Minimum 1 lowercase 
                    3. Minimum 1 uppercase
                    4. Minimum 1 number
                    5. Minimum 1 special character
                    `
                )
            }
        }

    },

    age: {
        type: Number,
        min: [10, 'Your age is less than 10!! You are not allowed to use this application.'],
        max: [120, `Invalid Age!! Please enter a valid age.`]
    },

    gender: {
        type: String,
        immutable: true,
        enum: {
            values: ['male', 'female', 'others'],
            message: `{VALUE} is not a valid gender!`
        },
    },

    profilePictureURL: {
        type: String,
        default: "https://www.google.com/imgres?q=default%20profile%20images&imgurl=https%3A%2F%2Fwww.pngarts.com%2Ffiles%2F10%2FDefault-Profile-Picture-Download-PNG-Image.png&imgrefurl=https%3A%2F%2Fwww.pngarts.com%2Fexplore%2F215270&docid=dh0VhdzIYMDekM&tbnid=v8VUBuf1OXg0TM&vet=12ahUKEwi0s82e8tGTAxWYSmwGHQyyCooQnPAOegQIFxAB..i&w=673&h=673&hcb=2&ved=2ahUKEwi0s82e8tGTAxWYSmwGHQyyCooQnPAOegQIFxAB",
        validate: (url) => validator.isURL(url),
    },

    skills:{
        type: [{
            type: String,
            lowercase: true,
            trim: true,
        }],
        default: [],
        validate: arr =>{
            if(new Set(arr).size !== arr.length)
                throw new Error('Skills must be unique.')   
            if(arr.length >15)
                throw new Error(`Maximum 15 skills allowed.`)
        }
    },
    
    
}, {timestamps: true});


userSchema.methods.getJWT = function (){
    const token = jwt.sign({_id: this._id}, process.env.JWT_SECRET_KEY, {expiresIn: "7d"});
    return token;
}

userSchema.methods.isPasswordCorrect =  function (passwordInputByUser){
    const passwordHash = this.password;
    return bcrypt.compare(passwordInputByUser, passwordHash); 
}


// Pre-save hook/middleware to hash password during signup/password change
userSchema.pre('save', async function() {
    if(!this.isModified('password')) 
        return;
    this.password = await bcrypt.hash(this.password, 10);
})


const User = mongoose.model('user', userSchema);

module.exports = {User};




