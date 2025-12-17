const TaskModel = require('../../models/task.model');
const Task = require('../../domain/entities/Task');
const ITaskRepository = require('../../domain/repositories/ITaskRepository');

/**
 * Task Repository Implementation using Mongoose
 * Implements ITaskRepository interface
 */
class TaskRepository extends ITaskRepository {
    /**
     * Convert Mongoose document to Task entity
     */
    _toEntity(doc) {
        if (!doc) return null;
        return new Task({
            id: doc._id.toString(),
            userId: doc.userId,
            title: doc.title,
            status: doc.status,
            completed: doc.completed,
            active: doc.active,
            createDate: doc.createDate,
            modifyDate: doc.modifyDate
        });
    }

    async create(taskData) {
        const doc = await TaskModel.create(taskData);
        return this._toEntity(doc);
    }

    async findById(taskId) {
        const doc = await TaskModel.findById(taskId);
        return this._toEntity(doc);
    }

    async findByUserId(userId) {
        const docs = await TaskModel.find({ userId, active: true });
        return docs.map(doc => this._toEntity(doc));
    }

    async update(taskId, updateData) {
        const doc = await TaskModel.findByIdAndUpdate(
            taskId,
            updateData,
            { new: true, runValidators: true }
        );
        return this._toEntity(doc);
    }

    async delete(taskId) {
        await TaskModel.findByIdAndUpdate(taskId, { active: false });
        return true;
    }

    async exists(taskId) {
        const count = await TaskModel.countDocuments({ _id: taskId });
        return count > 0;
    }
}

module.exports = TaskRepository;
