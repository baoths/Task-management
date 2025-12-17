const { tokenBlacklist } = require("../middleware");

/**
 * Auth Controller - Clean Architecture
 * Controllers only handle HTTP requests/responses
 * Business logic is in Use Cases
 */
class AuthController {
  constructor(registerUserUseCase, loginUserUseCase) {
    this.registerUserUseCase = registerUserUseCase;
    this.loginUserUseCase = loginUserUseCase;
  }

  register = async (req, res, next) => {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ message: "Missing required fields", error: "Missing required fields" });
      }

      const result = await this.registerUserUseCase.execute(username, email, password);

      res.status(201).json({
        message: "User registered successfully!",
        accessToken: result.token,
        ...result.user
      });
    } catch (err) {
      console.error('Register error:', err);
      res.status(400).json({ message: err.message, error: err.message });
    }
  };

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required", error: "Email and password are required" });
      }

      const result = await this.loginUserUseCase.execute(email, password);

      res.status(200).json({
        id: result.user.id,
        username: result.user.username,
        email: result.user.email,
        accessToken: result.token,
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(401).json({ 
        accessToken: null,
        message: err.message,
        error: err.message
      });
    }
  };

  logout = async (req, res) => {
    try {
      const token = req.token;
      if (token) {
        tokenBlacklist.addToBlacklist(token);
      }
      res.status(200).json({ message: "Logged out successfully!" });
    } catch (err) {
      console.error('Logout error:', err);
      res.status(500).json({ message: err.message, error: err.message });
    }
  };
}

module.exports = AuthController;
