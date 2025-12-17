const Task = require('../../domain/entities/Task');

/**
 * Update Task Use Case
 * Handles task update business logic
 */
class UpdateTask {
    constructor(taskRepository) {
        this.taskRepository = taskRepository;
    }

    async execute(taskId, title, status) {
        if (!taskId) {
            throw new Error('Task ID là bắt buộc');
        }

        // Find existing task
        const task = await this.taskRepository.findById(taskId);
        if (!task) {
            throw new Error('Không tìm thấy công việc');
        }

        // Use domain logic to update
        task.update(title, status);

        // Save changes
        const updatedTask = await this.taskRepository.update(taskId, task.toObject());

        return updatedTask.toObject();
    }
}

module.exports = UpdateTask;
