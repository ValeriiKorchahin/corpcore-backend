import Sequelize from 'sequelize';
import { sequelize } from '../database/database.js';

const OrganizationModel = sequelize.define('organization', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    createdByUserId: {
        type: Sequelize.UUID,
        allowNull: false,
    },
}, {
    createdAt: false,
    updatedAt: false,
});

export default OrganizationModel;
