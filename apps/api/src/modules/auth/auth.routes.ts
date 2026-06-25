import { Router } from 'express'
import { authController } from './auth.controller.js'
import { authMiddleware } from '../../middleware/auth.js'

const router = Router()

router.post('/login', authController.login)
router.post('/refresh', authController.refresh)
router.post('/logout', authMiddleware, authController.logout)
router.post('/verify-pin', authMiddleware, authController.verifyPin)
router.post('/set-pin', authMiddleware, authController.setPin)
router.post('/check-phone', authController.checkPhone)
router.post('/update-profile', authMiddleware, authController.updateProfile)
router.post('/change-password', authMiddleware, authController.changePassword)
router.post('/upload-image', authMiddleware, authController.uploadImage)

export default router
