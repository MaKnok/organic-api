import users from "../models/User.js";
import UserServices from "../services/usersServices.js";
import { encrypt, decrypt } from "../encryptor/encryption.js";
import jwt from "jsonwebtoken";

class UserController {

    static listUsers = (req, res)=>{
        users.find((err, users) => {
            res.status(200).json(users);
        })
    }

    static listUsersById = (req,res)=>{
        const id = req.params.id;

        users.findById(id, (err, users) => {
            if (err) {
                res.status(400).send({message: `${err.message} - usuário não localizado`})
            } else {
                res.status(200).send(users)
            }
        })
    }

    static registerUser = async(req, res)=>{

        let user = new users(req.body);

        const encryptedPassword = await encrypt(user.userPassword);
        console.log('Encrypted:', encryptedPassword);
        user.userPassword = encryptedPassword;

        const recordedUser = await users.findOne({userEmail: user.userEmail})

        if (recordedUser) {
            return res.status(400).send({message: "Email already registered"})
        }else{

            await user.save((err)=>{
                if(err){
                    res.status(500).send({message: `${err.message} - user registration failed`});
                    return;
                }else{
                    res.status(201).send(user.toJSON());
                }
            })

             //create JWT Token
             const { _id } = user.toJSON();
             const token = jwt.sign({_id: _id}, "secret");
             res.cookie('jwt', token, {
                 httpOnly: true,
                 maxAge: 24*60*60*1000
             })

        }

        

    }

    static loginUser = async(req, res)=>{

        var result = null;

        try{

            result = await UserServices.loggingUser(req.body);
            if(result.status){
                res.status(200).send({status: true, 
                                      message: `${result.msg} - user login was successful`, 
                                      user: req.body.userName, 
                                      password: req.body.userPassword});
            }else{
                res.status(400).send({status: false, message: `${result.msg} - there was an error with user or/and password`});
            }

        }catch (err){

            console.log(err);
            res.status(500).send({status: false, message: `${err.msg} - there was an error with server`});

        }

    }

    static updateUser = (req, res)=>{
        const id = req.params.id;
        users.findByIdAndUpdate(id, {$set:req.body}, (err) => {
            if (!err){
                res.status(200).send( { message:'Usuário atualizado' } );
            } else {
                res.status(500).send({ message: err.message });
            }
        })
    }

    static deleteUser = (req, res)=>{
        const id = req.params.id;
        
        users.findByIdAndDelete(id, (err)=>{
            if (err) {
                res.status(500).send({message:err.message})
            } else {
                res.status(200).send(`Usuário ${id} removido com sucesso!`);
            }
        })
    }

    static listUserByRole = (req, res)=>{
        const role = req.query.role;

        users.find({'userRole': role}, {}, (err, users) => {
            res.status(200).send(users);
        })
    }

}

export default UserController