/**
 * Task Controller - Clean Architecture
 * Controllers only handle HTTP requests/responses
 * Business logic is in Use Cases
 */
class TaskController {
  constructor(
    createTaskUseCase,
    getUserTasksUseCase,
    updateTaskUseCase,
    markTaskDoneUseCase,
    markTaskUndoneUseCase,
    deleteTaskUseCase
  ) {
    this.createTaskUseCase = createTaskUseCase;
    this.getUserTasksUseCase = getUserTasksUseCase;
    this.updateTaskUseCase = updateTaskUseCase;
    this.markTaskDoneUseCase = markTaskDoneUseCase;
    this.markTaskUndoneUseCase = markTaskUndoneUseCase;
    this.deleteTaskUseCase = deleteTaskUseCase;
  }

  getTasks = async (req, res, next) => {
    try {
      const tasks = await this.getUserTasksUseCase.execute(req.userId);
      return res.status(200).json({ data: tasks });
    } catch (err) {
      console.error('getTasks error:', err);
      res.status(400).json({ message: err.message, error: err.message });
    }
  };

  createTask = async (req, res, next) => {
    try {
      const { title, status } = req.body;
      await this.createTaskUseCase.execute(req.userId, title, status);
      
      // Return updated task list
      const tasks = await this.getUserTasksUseCase.execute(req.userId);
      res.status(201).json({ data: tasks, message: 'Task created successfully' });
    } catch (err) {
      console.error('createTask error:', err);
      res.status(400).json({ message: err.message, error: err.message });
    }
  };

  updateTask = async (req, res, next) => {
    try {
      const { _id, title, status } = req.body;

      if (!_id) {
        return res.status(400).json({ message: "Task ID is required", error: "Task ID is required" });
      }

      await this.updateTaskUseCase.execute(_id, title, status);

      // Return updated task list
      const tasks = await this.getUserTasksUseCase.execute(req.userId);
      res.status(200).json({ data: tasks, message: 'Task updated successfully' });
    } catch (err) {
      console.error('updateTask error:', err);
      res.status(400).json({ message: err.message, error: err.message });
    }
  };

  markDone = async (req, res, next) => {
    try {
      const { _id } = req.body;

      if (!_id) {
        return res.status(400).json({ message: "Task ID is required", error: "Task ID is required" });
      }

      await this.markTaskDoneUseCase.execute(_id);

      // Return updated task list
      const tasks = await this.getUserTasksUseCase.execute(req.userId);
      res.status(200).json({ data: tasks, message: 'Task marked as done' });
    } catch (err) {
      console.error('markDone error:', err);
      res.status(400).json({ message: err.message, error: err.message });
    }
  };

  markUnDone = async (req, res, next) => {
    try {
      const { _id } = req.body;

      if (!_id) {
        return res.status(400).json({ message: "Task ID is required", error: "Task ID is required" });
      }

      await this.markTaskUndoneUseCase.execute(_id);

      // Return updated task list
      const tasks = await this.getUserTasksUseCase.execute(req.userId);
      res.status(200).json({ data: tasks, message: 'Task marked as incomplete' });
    } catch (err) {
      console.error('markUnDone error:', err);
      res.status(400).json({ message: err.message, error: err.message });
    }
  };

  deActivateTask = async (req, res, next) => {
    try {
      const { _id } = req.body;

      if (!_id) {
        return res.status(400).json({ message: "Task ID is required", error: "Task ID is required" });
      }

      await this.deleteTaskUseCase.execute(_id);

      // Return updated task list
      const tasks = await this.getUserTasksUseCase.execute(req.userId);
      res.status(200).json({ data: tasks, message: 'Task deleted successfully' });
    } catch (err) {
      console.error('deActivateTask error:', err);
      res.status(400).json({ message: err.message, error: err.message });
    }
  };
}

module.exports = TaskController;
