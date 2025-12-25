import bcrypt from 'bcrypt';
import UserModel  from '../models/userModel.js';
import  OrganizationModel  from '../models/organizationModel.js';
import { sequelize } from '../database/database.js';
import { UnauthorizedError } from '../utils/errors/UnauthorizedError.js';
import { ConflictError } from '../utils/errors/ConflictError.js';
import UserOrganizations from '../models/userOrganizationsModel.js';
import { OrganizationRoles } from '../utils/enums/organization-roles.js';
import { generateToken } from '../utils/jwt/jwt.js';


export const registerUser = async(value) => {
    const transaction = await sequelize.transaction();
    const { email, password, name, organizationName } = value;
    try {
        // Check if user exists
        const existingUser = await UserModel.findOne({ where: { email }, transaction });
        if (existingUser) {
            throw new ConflictError('User already exists.');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await UserModel.create({
            name,
            email,
            password: hashedPassword,
        }, { transaction });

        // Create organization
        const organization = await OrganizationModel.create({
            name: organizationName,
        }, { transaction });

        // Add user to UserOrganizations as owner
        await UserOrganizations.create({
            userId: user.id,
            organizationId: organization.id,
            role: OrganizationRoles.MANAGER,
        }, { transaction });

        // Generate JWT token
        const token = generateToken({
            userId: user.id,
            organizationId: organization.id,
            role: OrganizationRoles.MANAGER,
        });
        
        await transaction.commit();

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            organization: [{
                id: organization.id,
                name: organization.name,
                role: OrganizationRoles.MANAGER,
            }],
            token: token,
        };

    } catch (err) {
        await transaction.rollback();
        throw err;
    }
};

export const loginUser = async(value) => {
    const { email, password } = value;

    const user = await UserModel.findOne({
        where: { email },
        include: [
            {
                model: OrganizationModel,
                as: 'organizations',
                attributes: ['id', 'name'],
                through: {
                    attributes: ['role'],
                },
            },
        ],
    });

    if (!user) {
        throw new UnauthorizedError('Invalid email or password');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        throw new UnauthorizedError('Invalid email or password');
    }
    
    const token = generateToken({
        userId: user.id,
        organizationId: user.organizations[0].id,
        role: user.organizations[0].UserOrganizations.role,
    });

    // Remove password from response
    const userData = user.toJSON();
    delete userData.password;
    userData.organizations = userData.organizations.map(org => ({
        id: org.id,
        name: org.name,
        role: org.UserOrganizations.role,
    }));
    userData.token = token;

    return userData;
};
