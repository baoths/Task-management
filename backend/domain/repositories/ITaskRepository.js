/**
 * Task Repository Interface
 * Defines contract for task data operations
 * Implementation will be in infrastructure layer
 */
class ITaskRepository {
    /**
     * Create a new task
     * @param {Object} taskData - Task data
     * @returns {Promise<Task>}
     */
    async create(taskData) {
        throw new Error('Method not implemented');
    }

    /**
     * Find task by ID
     * @param {string} taskId - Task ID
     * @returns {Promise<Task|null>}
     */
    async findById(taskId) {
        throw new Error('Method not implemented');
    }

    /**
     * Find all active tasks for a user
     * @param {string} userId - User ID
     * @returns {Promise<Task[]>}
     */
    async findByUserId(userId) {
        throw new Error('Method not implemented');
    }

    /**
     * Update task
     * @param {string} taskId - Task ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<Task>}
     */
    async update(taskId, updateData) {
        throw new Error('Method not implemented');
    }

    /**
     * Delete task (soft delete)
     * @param {string} taskId - Task ID
     * @returns {Promise<boolean>}
     */
    async delete(taskId) {
        throw new Error('Method not implemented');
    }

    /**
     * Check if task exists
     * @param {string} taskId - Task ID
     * @returns {Promise<boolean>}
     */
    async exists(taskId) {
        throw new Error('Method not implemented');
    }
}

module.exports = ITaskRepository;
