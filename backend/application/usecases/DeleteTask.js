/**
 * Delete Task Use Case (Soft Delete)
 */
class DeleteTask {
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

        // Use domain logic to deactivate
        task.deactivate();

        // Save changes
        await this.taskRepository.update(taskId, task.toObject());

        return { success: true, message: 'Đã xóa công việc' };
    }
}

module.exports = DeleteTask;
