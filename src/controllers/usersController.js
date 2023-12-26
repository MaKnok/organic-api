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
                res.status(400).send({message: `${err.message} - Usuário não localizado`})
            } else {
                res.status(200).send(users)
            }
        })
    }

    static listUsersByUserName = (req,res)=>{
        const userName = req.params.userName;

        users.find({'userName': userName}, {}, (err, users) => {
            if (err) {
                res.status(400).send({message: `${err.message} - Username não localizado`})
            } else {
                res.status(200).send(users)
            }
        })
    }

    static listUsersByUserEmail = (req,res)=>{
        const userEmail = req.params.userEmail;

        users.find({'userEmail': userEmail}, {}, (err, users) => {
            if (err) {
                res.status(400).send({message: `${err.message} - Usermail não localizado`})
            } else {
                res.status(200).send(users)
            }
        })
    }

    static getUserByToken = async (req, res)=>{
        try{

            const secret = process.env.JWT_SECRET || 'secret';
            console.log('JWT_SECRET:', secret);

            const cookie = req.cookies['jwt'];
            console.log('Received Cookie:', cookie);
            
            const claims = jwt.verify(cookie,secret);

            if (!claims){
                return res.status(401).send({
                    message: 'unauthorized'
                })
            }

            const user  = await users.findOne({_id: claims._id});
            if (!user) {
                return res.status(401).send({
                    message: 'Unauthorized - User not found',
                });
            }
            
            const { userPassword, ...data } = await user.toJSON();
            res.send({data: data, token: cookie});

        }catch(err){

            console.error('Error in getUserByToken:', err);

            return res.status(401).send({
                message: 'Unauthorized - Invalid or expired token',
                error: err.message,
            });

        }
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
                    return res.status(500).send({message: `${err.message} - user registration failed`});
                }else{
                    res.status(201).send(user.toJSON());
                }
            })

             //create JWT Token
             const { _id } = user.toJSON();
             const secret = process.env.JWT_SECRET || 'secret';
             const token = jwt.sign({_id: _id}, secret);
             res.cookie('jwt', token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
                sameSite: 'None',
                path: '/',
                domain: '3.144.4.177',
                secure: true
              })

        }

    }

    static loginUser = async(req, res)=>{

        var result = null;

        try{

            result = await UserServices.loggingUser(req.body);

            if(result.status){

                const { _id } = result.user.toJSON();
                const secret = process.env.JWT_SECRET || 'secret';
                const token = jwt.sign({_id: _id}, secret);
                res.cookie('jwt', token, {
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000,
                    sameSite: 'None',
                    path: '/',
                    domain: '3.144.4.177',
                    secure: true
                  })

                res.status(200).send({status: true, 
                                      message: `${result.msg} - user login was successful`, 
                                      user: req.body.userName,
                                      password: req.body.userPassword,
                                    });

            }else{
                res.status(400).send({status: false, message: `${result.msg} - there was an error with user or/and password`});
            }

        }catch (err){
            console.log(err);
            res.status(500).send({status: false, message: `${err.msg} - there was an error with the server`});
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
            if (err) {
                res.status(400).send({message: `${err.message} - usuário não localizado`})
            } else {
                res.status(200).send(users)
            }
        })
    }

}

export default UserController