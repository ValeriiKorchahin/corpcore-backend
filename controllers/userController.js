import { getOrganizationUsers, getCurrentUserData } from '../services/userService.js';

export const getUsers = async(req, res, next) => {
    try {
        const users = await getOrganizationUsers({
            organizationId: req?.user?.organizationId,
            search: req.query.search,
            limit: req.body.limit,
            page: req.body.page, 
        });
        return res.status(200).json(users);
    } catch(err) {
        next(err);
    }
};

export const getCurrentUser = async(req, res, next) => {
    const userId = req?.user?.userId;
    try {
        const user = await getCurrentUserData(userId);
        return res.status(200).json(user);
    } catch(err) {
        next(err);
    }
};
