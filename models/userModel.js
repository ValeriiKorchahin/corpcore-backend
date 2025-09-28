import Sequelize  from 'sequelize';
import { sequelize } from '../database/database.js';
import Roles from '../utils/enums/roles.js';

const UserModel = sequelize.define('user', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
    },
    role: {
        type: Sequelize.INTEGER,
        defaultValue: Roles.USER,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
}, {
    createdAt: false,
    updatedAt: false,
});

export default UserModel;
