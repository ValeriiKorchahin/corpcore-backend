import sequelize from '../database/database.js';
import UserModel from './userModel.js';
import CompanyModel from './companyModel.js';
import OrganizationModel from './organizationModel.js';

UserModel.hasOne(OrganizationModel, {
    foreignKey: 'createdByUserId',
    as: 'organization',
});

OrganizationModel.belongsTo(UserModel, {
    foreignKey: 'createdByUserId',
    as: 'creator',
});

// OrganizationModel.hasMany(CompanyModel, {
//     foreignKey: 'organizationId',
//     as: 'companies',
// });
//
// CompanyModel.belongsTo(OrganizationModel, {
//     foreignKey: 'organizationId',
//     as: 'organization',
// });
//
// UserModel.hasMany(CompanyModel, {
//     foreignKey: 'createdByUserId',
//     as: 'companies',
// });
//
// CompanyModel.belongsTo(UserModel, {
//     foreignKey: 'createdByUserId',
//     as: 'creator',
// });

export {
    sequelize,
    UserModel,
    CompanyModel,
    OrganizationModel,
};


