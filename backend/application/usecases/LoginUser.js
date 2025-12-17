const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Login User Use Case
 * Handles user authentication business logic
 */
class LoginUser {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute(email, password) {
        // Validate input
        if (!email || !password) {
            throw new Error('Email và mật khẩu là bắt buộc');
        }

        // Find user by email
        const user = await this.userRepository.findByEmail(email.toLowerCase().trim());
        if (!user) {
            throw new Error('Email hoặc mật khẩu không đúng');
        }

        // Verify password
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Email hoặc mật khẩu không đúng');
        }

        // Generate token
        const token = jwt.sign(
            { id: user.id },
            process.env.SECRET_TOKEN || 'secret',
            { expiresIn: '24h' }
        );

        return {
            token,
            user: user.toSafeObject()
        };
    }
}

module.exports = LoginUser;
