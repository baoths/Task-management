/**
 * Mark Task as Undone Use Case
 */
class MarkTaskUndone {
    constructor(taskRepository) {
        this.taskRepository = taskRepository;
    }

    async execute(taskId) {
        if (!taskId) {
            throw new Error('Task ID là bắt buộc');
        }

        const task = await this.taskRepository.findById(taskId);
        if (!task) {
            throw new Error('Không tìm thấy công việc');
        }

        // Use domain logic
        task.markAsIncomplete();

        // Save changes
        const updatedTask = await this.taskRepository.update(taskId, task.toObject());

        return updatedTask.toObject();
    }
}

module.exports = MarkTaskUndone;
