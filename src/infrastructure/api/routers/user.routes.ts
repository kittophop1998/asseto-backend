import { Router } from "express";
import { UserRepository } from "../../database/UserRepository";
import { UserService } from "../../../application/services/user.service";
import { UserController } from "../controllers/UserController";

export function createUserRoutes() {
    const router = Router();

    /**
     * Repository
     */
    const userRepository = new UserRepository();

    /**
     * Service
     */
    const userService = new UserService(userRepository);

    /**
     * Controller
     */
    const userController = new UserController(userService);

    /**
     * Routes
     */
    router.get('/', (req, res) => userController.getAllUsers(req, res));

    return router;
}