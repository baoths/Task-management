/**
 * Task Entity - Pure domain model with business logic
 * No framework dependencies
 */
class Task {
    constructor(data) {
        this.id = data.id || data._id;
        this.userId = data.userId;
        this.title = data.title;
        this.status = data.status || 'Pending';
        this.completed = data.completed || false;
        this.active = data.active !== undefined ? data.active : true;
        this.createDate = data.createDate || new Date();
        this.modifyDate = data.modifyDate || new Date();
    }

    /**
     * Business rule: Validate status values
     */
    static isValidStatus(status) {
        const validStatuses = ['Pending', 'In Progress', 'Completed'];
        return validStatuses.includes(status);
    }

    /**
     * Business rule: Check if task can be marked as complete
     */
    canBeCompleted() {
        return this.active && this.status !== 'Completed';
    }

    /**
     * Business rule: Check if task can be edited
     */
    canBeEdited() {
        return this.active;
    }

    /**
     * Business rule: Mark task as completed
     */
    markAsCompleted() {
        if (!this.canBeCompleted()) {
            throw new Error('Task cannot be completed');
        }
        this.status = 'Completed';
        this.completed = true;
        this.modifyDate = new Date();
    }

    /**
     * Business rule: Mark task as incomplete
     */
    markAsIncomplete() {
        if (!this.active) {
            throw new Error('Cannot modify inactive task');
        }
        this.status = 'Pending';
        this.completed = false;
        this.modifyDate = new Date();
    }

    /**
     * Business rule: Update task details
     */
    update(title, status) {
        if (!this.canBeEdited()) {
            throw new Error('Cannot edit inactive task');
        }

        if (title) {
            this.title = title.trim();
        }

        if (status) {
            if (!Task.isValidStatus(status)) {
                throw new Error('Invalid status value');
            }
            this.status = status;
            this.completed = status === 'Completed';
        }

        this.modifyDate = new Date();
    }

    /**
     * Business rule: Deactivate task (soft delete)
     */
    deactivate() {
        this.active = false;
        this.modifyDate = new Date();
    }

    /**
     * Convert to plain object
     */
    toObject() {
        return {
            _id: this.id,
            userId: this.userId,
            title: this.title,
            status: this.status,
            completed: this.completed,
            active: this.active,
            createDate: this.createDate,
            modifyDate: this.modifyDate
        };
    }
}

module.exports = Task;
