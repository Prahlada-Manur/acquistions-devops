import logger from '#config/logger.js';
import bcrypt from 'bcrypt';
import { db } from '#config/database.js';
import { users } from '#model/user.model.js'
import { eq } from 'drizzle-orm'

export const hashPassword = async (password) => {
    try {
        return await bcrypt.hash(password, 10);
    } catch (error) {
        logger.error('Error hashing the password', error)
        throw new Error('Error hashing the password')
    }
}

export const createUser = async ({ email, password, name, role } ) => {
    try {
        const isUserPresent = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1)
        if (isUserPresent.length > 0) {
            throw new Error('User email already exists');
        }
        const hashedPassword = await hashPassword(password)
        const now = new Date()
        const [User] = await db.insert(users).values({
            name,
            email,
            password: hashedPassword,
            role,
            created_at: now,
            updated_at: now,
        }).returning({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            created_at: users.created_at,
        })
        logger.info(`User successfully created with email: ${User.email}`)
        return User;
    } catch (error) {
        logger.error("Error creating user", error)
        throw error
    }
}
