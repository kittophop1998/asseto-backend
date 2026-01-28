import { Router } from 'express';
import { UserRepository } from '../../database/UserRepository';
import { AuthService } from '../../../application/services/auth.service';
import { AuthController } from '../controllers/AuthController';

export function createAuthRoutes() {
    const router = Router();

    /**
     * Repository
     */
    const userRepository = new UserRepository();

    /**
     * Service
     */
    const authService = new AuthService(userRepository);

    /**
     * Controller
     */
    const authController = new AuthController(authService);

    /**
     * Routes
     */
    router.post('/login', (req, res) => authController.login(req, res));

    return router;
}