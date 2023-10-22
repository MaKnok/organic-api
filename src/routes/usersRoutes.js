import express from "express";
import UserController from "../controllers/usersController.js";

const router = express.Router();

router.get("/users", UserController.listUsers);
router.get("/users/search", UserController.listUserByRole);
router.get("/users/:id", UserController.listUsersById);
router.get("/user/", UserController.getUserByToken);
router.post("/users", UserController.registerUser);
router.post("/users/login", UserController.loginUser);
router.put("/users/:id", UserController.updateUser);
router.delete("/users/:id", UserController.deleteUser);

export default router;
