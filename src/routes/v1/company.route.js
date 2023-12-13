const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');
const { companyController } = require('../../controllers/company');
// const { user_agentController } = require('../../controllers/');

const router = express.Router();

router.post('/policy/:companyId', companyController.createPolicy);
router.get('/allcompanypolicy/:companyId', companyController.getCompanyPolicies);
router.get('/allcompanyagent/:companyId', companyController.getAllCompanyAgents);
router.get('/singlecompanyagent/:agentId', companyController.getSingleAgentInfo);
router.get('/allcompanyleads/:companyId', companyController.getAllLeads);
router.get('/singlecompanypolicy/:policyId', companyController.getOneCompanyPolicy);
router.put('/updatepolicy/:policyId', companyController.updatePolicy);
router.delete('/deletePolicy/:policyId', companyController.deletePolicy);



// router.post('/login', authController.signin);


module.exports = router;

  /**
 * @swagger
 * tags:
 *   name: Policies
 *   description: Policy creation and type by company admin
 */

 /**
 * @swagger
 * /policy/companyId:
 *  post:
 *     summary: Create Policies
 *     description: Admin and agent can create policies.
 *     tags: [Policies]
 *     
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - policyType
 *               - duration
 *               - amount
 *             properties:
 *               policyType:
 *                 type: string
 *               duration:
 *                 type: string
 *               amount:
 *                 type: number
 *             example:
 *               policyType: Car Insurance
 *               duration: 4yrs
 *               amount: 200000
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/policy'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 * 
 * 
 *  get:
 *     summary: Get all policies
 *     description: admins and agents can retrieve all policies.
 *     tags: [Policies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: policy
 *         schema:
 *           type: string
 *         description: policy type
 *       - in: query
 *         name: duration
 *         schema:
 *           type: string
 *         description: policy duration
 *       - in: query
 *         name: amount
 *         schema:
 *           type: string
 *         description: amount to be paid 
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/policy'
 *       
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
 /**
 * @swagger
 * /policy/{id}:
 *   get:
 *     summary: Get a policy
 *     description: Only authorized users can fetch policy information.
 *     tags: [Policies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: policy
 *         schema:
 *           type: string
 *         description: policy type
 *       - in: query
 *         name: duration
 *         schema:
 *           type: string
 *         description: policy duration
 *       - in: query
 *         name: amount
 *         schema:
 *           type: string
 *         description: amount to be paid 
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Plan'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a policy
 *     description: Only authorized users can update policy information.
 *     tags: [Policies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: policy
 *         schema:
 *           type: string
 *         description: policy type
 *       - in: query
 *         name: duration
 *         schema:
 *           type: string
 *         description: policy duration
 *       - in: query
 *         name: amount
 *         schema:
 *           type: string
 *         description: amount to be paid 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               policyType:
 *                 type: string
 *               duration:
 *                 type: string
 *               amount:
 *                 type: number
 *             example:
 *               policyType: Car Insurance
 *               duration: 4yrs
 *               amount: 200000
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Plan'
 *       "400":
 *         $ref: '#/components/responses/ValidationError'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a policy
 *     description: Only authorized users can delete policies.
 *     tags: [Policies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: policy
 *         schema:
 *           type: string
 *         description: policy type
 *       - in: query
 *         name: duration
 *         schema:
 *           type: string
 *         description: policy duration
 *       - in: query
 *         name: amount
 *         schema:
 *           type: string
 *         description: amount to be paid
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */