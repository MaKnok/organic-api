import users from "../models/User.js";
import { encrypt, decrypt } from "../encryptor/encryption.js";

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
                                            resolve({status: true, msg: "User validation was successful"})
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

}

export default UserServices;

