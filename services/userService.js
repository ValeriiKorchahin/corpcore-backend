import { UserModel } from '../models/index.js';
import UserOrganizationModel from '../models/userOrganizationsModel.js';
import { Op } from 'sequelize';
import { NotFoundError } from '../utils/errors/NotFoundError.js';

export const getOrganizationUsers = async(payload) => {
    const { organizationId, search, limit, page } = payload;

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

    const { rows: users, count: total } =
        await UserOrganizationModel.findAndCountAll({
            where: {
                organizationId,
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

    const mappedUsers = users.map(u => ({
        ...u.user.toJSON(),
        role: u.role,
    }));

    return {
        data: mappedUsers,
        total: total,
        page: isPaginationIncluded ? page : 1,
        limit: isPaginationIncluded ? limit : total,
    };
};

export const getCurrentUserData = async(userId) => {
    const user = await UserModel.findByPk(userId, {
        attributes: {
            exclude: ['password'],
        },
    });

    if (!user) {
        throw new NotFoundError('User not found.');
    }

    return user;
};
