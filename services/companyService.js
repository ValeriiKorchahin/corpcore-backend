import { sequelize } from '../database/database.js';
import { CompanyModel, UserCompanyModel, UserModel } from '../models/index.js';
import { Op } from 'sequelize';
import { CompanyRoles } from '../utils/enums/company-roles.js';
import { NotFoundError } from '../utils/errors/NotFoundError.js';
import { ConflictError } from '../utils/errors/ConflictError.js';
import bcrypt from 'bcrypt';
import UserOrganizations from '../models/userOrganizationsModel.js';
import { OrganizationRoles } from '../utils/enums/organization-roles.js';

export const getCompanyList = async(payload) => {
    const { organizationId, search, limit, page } = payload;

    const isPaginationIncluded =
        Number.isInteger(limit) && Number.isInteger(page);

    const where= {
        organizationId: organizationId,
        ...(search && {
            name: { [Op.like]: `%${search}%` },
        }),
    };

    const offset = isPaginationIncluded ?
        (page - 1) * limit
        : undefined;

    const { rows: companies, count: total } = await CompanyModel.findAndCountAll({
        where,
        limit: isPaginationIncluded ? limit: undefined,
        offset,
        order: [['createdAt', 'DESC']], 
    });
    return {
        data: companies,
        total: total,
        page: isPaginationIncluded ? page : 1,
        limit: isPaginationIncluded ? limit : total,
    };
};

export const fetchUserCompanies = async(user) => {
    const { organizationId , userId } = user;
    const companies = await UserCompanyModel.findAll({
        where: {
            userId: userId,
        },
        include: [
            {
                model: CompanyModel,
                attributes: [
                    ['id', 'id'],
                    ['name', 'name'],
                ],
                where: { organizationId: organizationId },
            },
        ],
        attributes: ['role'],
    });

    const flatCompanies = companies.map(c => ({
        id: c.company.id,
        name: c.company.name,
        role: c.role,
    }));

    return flatCompanies;
};

export const getCompanyById = async(companyId) => {
    if (!companyId) {
        throw new NotFoundError('Company not found');
    }
    const company = await CompanyModel.findByPk(companyId);

    return company;
};

export const create = async(value, user) => {
    const transaction = await sequelize.transaction();
    const { organizationId, userId } = user;
    try {
        const company = await CompanyModel.create({
            ...value,
            organizationId: organizationId,
        }, {
            transaction,
        });
        await UserCompanyModel.create({
            userId: userId,
            companyId: company.id,
            role: CompanyRoles.ADMIN, 
        }, {
            transaction,
        });
        await transaction.commit();
        return company;
    } catch (err) {
        await transaction.rollback();
        throw err;
    }
};

export const createUser = async(companyId, organizationId, body) => {
    const transaction = await sequelize.transaction();
    const { email, password, name, role } = body;

    try {
        const existingUser = await UserModel.findOne({ where: { email }, transaction });
        if (existingUser) {
            throw new ConflictError('User with this email already exists.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await UserModel.create({
            email,
            name,
            password: hashedPassword,
        }, { transaction });

        await UserOrganizations.create({
            userId: user.id,
            organizationId: organizationId,
            role: OrganizationRoles.USER,
        }, { transaction });

        await UserCompanyModel.create({
            userId: user.id,
            companyId: companyId,
            role: role,
        }, { transaction });

        await transaction.commit();

        const userData = user.toJSON();
        delete userData.password;
        userData.role = role;

        return userData;

    } catch (err) {
        await transaction.rollback();
        throw err;
    }
};

export const update = async(value, companyId) => {
    try {
        const company = await CompanyModel.findByPk(companyId);
        if (!company) {
            throw new NotFoundError('Company not found');
        }
        await company.update(value);
        return company;
    } catch (err) {
        throw err;
    }
};

export const remove = async(companyId) => {
    try {
        const company = await CompanyModel.findByPk(companyId);
        if (!company) {
            throw new NotFoundError('Company not found');
        }
        await company.destroy();
        return company;
    } catch (err) {
        throw err;
    }
};

export const changeUserRole = async(companyId, userId, role) => {
    try {
        const userCompany = await UserCompanyModel.findOne({
            where: {
                companyId: companyId,
                userId: userId,
            },
        });
        if (!userCompany) {
            throw new NotFoundError('Company or user is not found');
        }
        userCompany.update({
            role: role,
        });
        return role;
    } catch(err) {
        throw err;
    }
};

export const getCompanyUsers = async(payload) => {
    const { search, limit, page, companyId } = payload;
    debugger;
    try {
        const isPaginationIncluded = 
            Number.isInteger(limit) && Number.isInteger(page);
        const querySearch = search
            ? {
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },
                    { email: { [Op.like]: `%${search}%` } },
                ],
            }
            : {};

        const offset = isPaginationIncluded
            ? (page - 1) * limit
            : undefined;

        const { rows: companyUsers, total: total } = await UserCompanyModel.findAndCountAll({
            where: {
                companyId: companyId,
            },
            attributes: ['role'],
            include: [
                {
                    model: UserModel,
                    where: querySearch,
                    required: !!search,
                    attributes: {
                        exclude: ['password'],
                    },
                },
            ],
            limit: isPaginationIncluded ? limit : undefined,
            offset,
            order: [['createdAt', 'DESC']],
        });

        const mappedUsers = companyUsers.map(u => ({
            ...u.user.toJSON(),
            role: u.role,
        }));

        return {
            data: mappedUsers,
            total: total,
            page: isPaginationIncluded ? page : 1,
            limit: isPaginationIncluded ? limit : total,
        };
    } catch (err) {
        throw err;
    }
};
