import { companySchema } from '../validators/companyValidator.js';
import { BadRequestError } from '../utils/errors/BadRequestError.js';
import {
    getCompanyList,
    create,
    update,
    remove,
    fetchUserCompanies,
    getCompanyById, createUser, changeUserRole, getCompanyUsers,
} from '../services/companyService.js';
import { userSchema } from '../validators/userValidator.js';
import { roleSchema } from '../validators/roleValidator.js';

export const getCompanies = async(req, res, next) => {
    try {
        const companies = await getCompanyList({
            organizationId: req?.user?.organizationId,
            search: req.query.search || '',
            limit: req.body.limit,
            page: req.body.page,
        });
        return res.status(200).json(companies);
    } catch(err) {
        next(err);
    }
};

export const getCompany = async(req, res, next) => {
    try {
        const companyId = req.params.id;
        const company = await getCompanyById(companyId);
        return res.status(200).json(company);
    } catch (err) {
        next(err);
    }
};

export const getUserCompanies = async(req, res, next) => {
    try {
        const user = req.user;
        const companies = await fetchUserCompanies(user);
        return res.status(200).json(companies);
    } catch (err) {
        next(err);
    }
};

export const createCompany = async(req, res, next) => {
    try {
        const user = req?.user;
        const { error, value } = companySchema.validate(req.body);
        if (error) {
            throw new BadRequestError(error.details[0].message);
        }
        const company = await create(value, user);
        return res.status(200).send({ company });
    } catch(err) {
        next(err);
    }
};

export const createCompanyUser = async(req, res, next) => {
    try {
        const companyId = req.params.id;
        const organizationId = req?.user?.organizationId;
        const body = req.body;
        const { error, value } = userSchema.validate(body);
        if (error) {
            throw new BadRequestError(error.details[0].message);
        }
        const user = await createUser(companyId, organizationId, body);
        return res.status(200).send({ user });
    } catch(err) {
        next(err);
    }
};

export const updateCompany = async(req, res, next) => {
    try {
        const companyId = req.params.id;
        const { error, value } = companySchema.validate(req.body);
        if (error) {
            throw new BadRequestError(error.details[0].message);
        }
        const company = await update(value, companyId);
        return res.status(200).send({ company });
    } catch (err) {
        next(err);
    }
};

export const deleteCompany = async(req, res, next) => {
    try {
        const companyId = req.params.id;
        await remove(companyId);
        return res.status(204).send();
    } catch (err) {
        next(err);
    }
};

export const updateUserRole = async(req, res, next) => {
    try {
        const companyId = req.params.id;
        const userID = req.params.userId;
        const role = req.body?.role;
        
        const { error, value } = roleSchema.validate(req.body);
        
        if (error) {
            throw new BadRequestError(error.details[0].message);
        }
        const updatedRole = await changeUserRole(companyId, userID, role);
        return res.status(200).send({ updatedRole });
    } catch (err) {
        next(err);
    }
};

export const fetchCompanyUsers = async(req, res, next) => {
    try {
        const users = await getCompanyUsers({
            companyId: req.params.id,
            limit: req.body.limit,
            page: req.body.page,
            search: req.query.search,
        });
        return res.status(200).json(users);
    }  catch (err) {
        next(err);
    }
};
