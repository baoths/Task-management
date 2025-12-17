const Task = require('../../domain/entities/Task');

/**
 * Create Task Use Case
 * Handles task creation business logic
 */
class CreateTask {
    constructor(taskRepository) {
        this.taskRepository = taskRepository;
    }

    async execute(userId, title, status = 'Pending') {
        // Validate input
        if (!title || title.trim().length === 0) {
            throw new Error('Tiêu đề công việc không được để trống');
        }

        if (!Task.isValidStatus(status)) {
            throw new Error('Trạng thái không hợp lệ');
        }

        // Create task entity
        const taskData = {
            userId,
            title: title.trim(),
            status,
            completed: status === 'Completed'
        };

        // Save to repository
        const task = await this.taskRepository.create(taskData);

        return task.toObject();
    }
}

module.exports = CreateTask;
