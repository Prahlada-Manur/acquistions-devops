import logger from '#config/logger.js'
import { registerSchema } from '#validations/auth.validation.js'
import { createUser } from "#services/auth.services.js"
import { generateToken } from '#utils/auth.js'
import { cookies } from '#utils/cookies.js';


export const register = async (req, res, next) => {
    try {
        const validationResult = registerSchema.safeParse(req.body)
        if (!validationResult.success) {
            return res.status(400).json({ error: 'Validation failed', details: validationResult.error })
        }
        const user = await createUser(validationResult.data);
        const token = generateToken().sign({ id: user.id, email: user.email, role: user.role })
        cookies.set(res, 'token', token)
        logger.info(`User registration request received for email: ${req.body.email}`)
        res.status(201).json({
            message: `User registred successfully with email: ${user.email}`,
            user: { id: user.id, email: user.email, role: user.role }
        })
    } catch (error) {
        logger.error('Error in register ', error)
        if (error.message === 'User email already exists') {
            return res.status(409).json({ error: 'User email already exists' })
        }
        next(error)
    }

}