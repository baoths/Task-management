/**
 * Dependency Injection Container
 * Wires up all layers following Clean Architecture
 */

// Repositories
const TaskRepository = require('./infrastructure/repositories/TaskRepository');
const UserRepository = require('./infrastructure/repositories/UserRepository');

// Use Cases
const RegisterUser = require('./application/usecases/RegisterUser');
const LoginUser = require('./application/usecases/LoginUser');
const CreateTask = require('./application/usecases/CreateTask');
const GetUserTasks = require('./application/usecases/GetUserTasks');
const UpdateTask = require('./application/usecases/UpdateTask');
const MarkTaskDone = require('./application/usecases/MarkTaskDone');
const MarkTaskUndone = require('./application/usecases/MarkTaskUndone');
const DeleteTask = require('./application/usecases/DeleteTask');

// Controllers
const AuthController = require('./controllers/auth.controller');
const TaskController = require('./controllers/task.controller');

class Container {
  constructor() {
    this._initializeRepositories();
    this._initializeUseCases();
    this._initializeControllers();
  }

  _initializeRepositories() {
    this.taskRepository = new TaskRepository();
    this.userRepository = new UserRepository();
  }

  _initializeUseCases() {
    // Auth Use Cases
    this.registerUserUseCase = new RegisterUser(this.userRepository);
    this.loginUserUseCase = new LoginUser(this.userRepository);

    // Task Use Cases
    this.createTaskUseCase = new CreateTask(this.taskRepository);
    this.getUserTasksUseCase = new GetUserTasks(this.taskRepository);
    this.updateTaskUseCase = new UpdateTask(this.taskRepository);
    this.markTaskDoneUseCase = new MarkTaskDone(this.taskRepository);
    this.markTaskUndoneUseCase = new MarkTaskUndone(this.taskRepository);
    this.deleteTaskUseCase = new DeleteTask(this.taskRepository);
  }

  _initializeControllers() {
    this.authController = new AuthController(
      this.registerUserUseCase,
      this.loginUserUseCase
    );

    this.taskController = new TaskController(
      this.createTaskUseCase,
      this.getUserTasksUseCase,
      this.updateTaskUseCase,
      this.markTaskDoneUseCase,
      this.markTaskUndoneUseCase,
      this.deleteTaskUseCase
    );
  }

  getAuthController() {
    return this.authController;
  }

  getTaskController() {
    return this.taskController;
  }
}

// Export singleton instance
module.exports = new Container();

