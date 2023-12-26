import users from "../models/User.js";
import { encrypt, decrypt } from "../encryptor/encryption.js";
import jwt from "jsonwebtoken";

class UserServices{

    static loggingUser(userLoginData){
        return new Promise(function userLogin(resolve, reject)
        {
            users.findOne({ userName: userLoginData.userName },
                            function getResult(errValue,result){

                                if(errValue){
                                    reject({status: false, msg: "Invalid data"})
                                }else{
                                    if(result != undefined && result != null){

                                        var decryptedPassword = decrypt(result.userPassword);

                                        if(decryptedPassword == userLoginData.userPassword){
                                            resolve({status: true, msg: "User validation was successful", user: result});
                                        }else{
                                            reject({status: false, msg: "User's password was incorrect"});
                                        }
                                    }else{
                                        reject({status: false, msg: "Invalid user's data"});
                                    }
                                }

                            }
            )
        }
        )
    }

    static applyTokenValidation(userRequest){

        return new Promise(function tokenValidation(resolve, reject){

            const cookie = userRequest.cookies['jwt'];
            const secret = process.env.JWT_SECRET || 'secret';
            const claims = jwt.verify(cookie, secret);
        
            if(!claims){
                reject({status: false, msg: "Unauthenticated"});
            }

            const user = users.findOne({_id: claims._id});
            const {userPassword, ...data} = user.toJSON();

            resolve({status: true, data: data});

        })

    }

}


export default UserServices;

