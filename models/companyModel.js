import Sequelize from 'sequelize';
import { sequelize } from '../database/database.js';

const CompanyModel = sequelize.define('company', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    logoUrl : {
        type: Sequelize.STRING,
    },
    createdByUserId: {
        type: Sequelize.UUID,
        allowNull: false,
    },
    organizationId: {
        type: Sequelize.UUID,
        allowNull: false,
    },
});

export default CompanyModel;

