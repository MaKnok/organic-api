import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    id: {type:String},
    userName: {type:String, required:true},
    userEmail: {type:String, required:true},
    userPassword: {type:String, required:true},
    userFullName: {type:String, required:true},
    userBirthday: {type:Date, required:true},
    userSegment: {type:String, required:true},
    userRole: {type:String, required:true}
});

const users = mongoose.model('users', userSchema);

export default users;