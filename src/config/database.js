require('dotenv').config();
const mongoose = require('mongoose');
/*
    sanitizeFilter:
    
   - When this option is enabled, Mongoose looks for any nested objects in your query that contain keys starting with a dollar sign ($). It then wraps those objects in a $eq (equal to) operator. 
   - Before (Vulnerable): If a user sends { password: { $ne: null } }, MongoDB searches for a user where the password is not equal to null.
   - After (Sanitized): Mongoose changes it to { password: { $eq: { $ne: null } } }.
   - Now, MongoDB looks for a literal password that is exactly the object { $ne: null }.
   - Since no user has an object as a password, the query fails to find a match, and the attack is blocked.

   - Key Benefits
        - Security for Untrusted Data: You can safely pass req.body or req.query directly into your Mongoose functions without manually checking every field.
        - Zero Logic Change: Unlike some sanitisation libraries that simply strip out the $ character, sanitizeFilter preserves the data but treats it strictly as a value, not a command.
        - Explicit Control: If you actually want to use a MongoDB operator in a query while this is enabled, you can mark that specific part of the query as safe by wrapping it in mongoose.trusted()
            - Eg: // Without trusted(), this might be treated as a literal search for an object
                    const nonAdmins = await User.find({
                        role: mongoose.trusted({ $ne: 'admin' })
                    });
*/
mongoose.set('sanitizeFilter', true);

const connectDB = async ()=>{
    await mongoose.connect(process.env.DB_CONNECTION_STRING)
}

module.exports = connectDB;
