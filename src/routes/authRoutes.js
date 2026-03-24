import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Đăng ký tài khoản User mới.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       201:
 *         description: Đăng ký thành công, trả về token và role.
 */
router.post('/register', registerUser);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Xác thực Đăng nhập & Lấy mã JWT Token.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Trả về access token và role.
 */
router.post('/login', loginUser);

export default router;
