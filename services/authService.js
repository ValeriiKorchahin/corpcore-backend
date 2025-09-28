import bcrypt from 'bcrypt';
import UserModel  from '../models/userModel.js';
import  OrganizationModel  from '../models/organizationModel.js';
import { sequelize } from '../database/database.js';
import Role from '../utils/enums/roles.js';
import { UnauthorizedError } from '../utils/errors/UnauthorizedError.js';
import { ConflictError } from '../utils/errors/ConflictError.js';


export const registerUser = async(value) => {
    const transaction = await sequelize.transaction();
    const { email, password, name, organizationName } = value;

    try {
        const existingUser = await UserModel.findOne({ where: { email }, transaction });
        if (existingUser) {
            throw new ConflictError('User already exists.');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await UserModel.create({
            name: name,
            email: email,
            password: hashedPassword,
            role: Role.MANAGER,
        }, {
            transaction,
        });
        const organization = await OrganizationModel.create({
            name: organizationName,
            createdByUserId: user.id,
        }, {
            transaction,
        });
        await transaction.commit();
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            organizationId: organization.id,
        };
    } catch (err) {
        await transaction.rollback();
        throw new Error(`An error occurred: ${err.message}`);
    }
};

export const loginUser = async(value) => {
    const { email, password } = value;
    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
        throw new UnauthorizedError('Invalid email or password');
    }
    const passwordMatch = await bcrypt.compare(password, user.dataValues.password);
    if (!passwordMatch) {
        throw new UnauthorizedError('Invalid password or email');
    }
    delete user.dataValues.password;
    return user.dataValues;
};
