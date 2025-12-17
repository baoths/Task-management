const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../domain/entities/User');

/**
 * Register User Use Case
 * Handles user registration business logic
 */
class RegisterUser {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute(username, email, password) {
        // Validate input using domain rules
        const validation = User.validateRegistrationData(username, email, password);
        if (!validation.isValid) {
            throw new Error(validation.errors.join(', '));
        }

        // Check if email already exists
        const emailExists = await this.userRepository.emailExists(email);
        if (emailExists) {
            throw new Error('Email đã tồn tại');
        }

        // Hash password
        const salt = bcrypt.genSaltSync(8);
        const hashedPassword = bcrypt.hashSync(password, salt);

        // Create user entity
        const userData = {
            username: username.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            salt: salt
        };

        // Save to repository
        const user = await this.userRepository.create(userData);

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

module.exports = RegisterUser;
