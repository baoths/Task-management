const UserModel = require('../../models/user.model');
const User = require('../../domain/entities/User');
const IUserRepository = require('../../domain/repositories/IUserRepository');

/**
 * User Repository Implementation using Mongoose
 * Implements IUserRepository interface
 */
class UserRepository extends IUserRepository {
    /**
     * Convert Mongoose document to User entity
     */
    _toEntity(doc) {
        if (!doc) return null;
        return new User({
            id: doc._id.toString(),
            username: doc.username,
            email: doc.email,
            password: doc.password,
            salt: doc.salt,
            createDate: doc.createDate
        });
    }

    async create(userData) {
        const doc = await UserModel.create(userData);
        return this._toEntity(doc);
    }

    async findById(userId) {
        const doc = await UserModel.findById(userId);
        return this._toEntity(doc);
    }

    async findByEmail(email) {
        const doc = await UserModel.findOne({ email: email.toLowerCase() });
        return this._toEntity(doc);
    }

    async findByUsername(username) {
        const doc = await UserModel.findOne({ username });
        return this._toEntity(doc);
    }

    async emailExists(email) {
        const count = await UserModel.countDocuments({ email: email.toLowerCase() });
        return count > 0;
    }

    async update(userId, updateData) {
        const doc = await UserModel.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        );
        return this._toEntity(doc);
    }
}

module.exports = UserRepository;
