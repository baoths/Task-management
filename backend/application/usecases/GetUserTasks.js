/**
 * Get User Tasks Use Case
 * Retrieves all active tasks for a user
 */
class GetUserTasks {
    constructor(taskRepository) {
        this.taskRepository = taskRepository;
    }

    async execute(userId) {
        if (!userId) {
            throw new Error('User ID là bắt buộc');
        }

        const tasks = await this.taskRepository.findByUserId(userId);

        return tasks.map(task => task.toObject());
    }
}

module.exports = GetUserTasks;
