import express from 'express';
import {
    createCompany,
    getCompanies,
    updateCompany,
    deleteCompany,
    getUserCompanies, getCompany, createCompanyUser, updateUserRole, fetchCompanyUsers,
} from '../controllers/companyController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get All Companies
router.post('/list', authMiddleware, getCompanies);

//Get User Companies
router.get('/user', authMiddleware, getUserCompanies);

// Create User In Company
router.post('/:id/user', authMiddleware, createCompanyUser);

// Get Company Users
router.post('/:id/users', authMiddleware, fetchCompanyUsers);

// Get Company
router.get('/:id', authMiddleware, getCompany);

// Create Company
router.post('/', authMiddleware, createCompany);

//Update Company
router.put('/:id', authMiddleware, updateCompany);

// Delete Company
router.delete('/:id', authMiddleware, deleteCompany);

// Change User Role
router.patch('/:id/user/:userId/role', authMiddleware, updateUserRole);

export default router;
