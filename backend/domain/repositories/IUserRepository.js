/**
 * User Repository Interface
 * Defines contract for user data operations
 * Implementation will be in infrastructure layer
 */
class IUserRepository {
    /**
     * Create a new user
     * @param {Object} userData - User data
     * @returns {Promise<User>}
     */
    async create(userData) {
        throw new Error('Method not implemented');
    }

    /**
     * Find user by ID
     * @param {string} userId - User ID
     * @returns {Promise<User|null>}
     */
    async findById(userId) {
        throw new Error('Method not implemented');
    }

    /**
     * Find user by email
     * @param {string} email - User email
     * @returns {Promise<User|null>}
     */
    async findByEmail(email) {
        throw new Error('Method not implemented');
    }

    /**
     * Find user by username
     * @param {string} username - Username
     * @returns {Promise<User|null>}
     */
    async findByUsername(username) {
        throw new Error('Method not implemented');
    }

    /**
     * Check if email exists
     * @param {string} email - Email to check
     * @returns {Promise<boolean>}
     */
    async emailExists(email) {
        throw new Error('Method not implemented');
    }

    /**
     * Update user
     * @param {string} userId - User ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<User>}
     */
    async update(userId, updateData) {
        throw new Error('Method not implemented');
    }
}

module.exports = IUserRepository;
