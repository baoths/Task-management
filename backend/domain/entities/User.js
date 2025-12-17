/**
 * User Entity - Pure domain model with business logic
 * No framework dependencies
 */
class User {
    constructor(data) {
        this.id = data.id || data._id;
        this.username = data.username;
        this.email = data.email;
        this.password = data.password; // hashed
        this.salt = data.salt;
        this.createDate = data.createDate || new Date();
    }

    /**
     * Business rule: Validate email format
     */
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Business rule: Validate password strength
     */
    static isValidPassword(password) {
        return password && password.length >= 6;
    }

    /**
     * Business rule: Validate username
     */
    static isValidUsername(username) {
        return username && username.trim().length >= 2;
    }

    /**
     * Business rule: Check if user credentials are valid for registration
     */
    static validateRegistrationData(username, email, password) {
        const errors = [];

        if (!User.isValidUsername(username)) {
            errors.push('Username must be at least 2 characters');
        }

        if (!User.isValidEmail(email)) {
            errors.push('Invalid email format');
        }

        if (!User.isValidPassword(password)) {
            errors.push('Password must be at least 6 characters');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Convert to safe object (without password)
     */
    toSafeObject() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            createDate: this.createDate
        };
    }

    /**
     * Convert to plain object (with password - for internal use only)
     */
    toObject() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            password: this.password,
            salt: this.salt,
            createDate: this.createDate
        };
    }
}

module.exports = User;
