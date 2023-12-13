const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');
const { dashController } = require('../../controllers/dashboard');
// const { user_agentController } = require('../../controllers/');

const router = express.Router();

router.get('/company/:comapnyId', dashController.companyDash);
router.get('/agent/:agentId', dashController.agentDash);




// router.post('/login', authController.signin);


module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Agent
 *   description: Agents management and retrieval
 */

/**
 * @swagger
 * /auth/Register?type=agent:
 *   post:
 *     summary: Create an agent
 *     description: Only admins can create other users (Agents).
 *     tags: [Agent]
 *     
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - middleName
 *               - gender
 *               - email
 *               - companyProfileId
 *               - userRole
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               middleName:
 *                 type: string
 *               gender:
 *                 type: string
 *               email:
 *                 type: string
 *               companyProfileId:
 *                 type: number
 *               userRole:
 *                 type: string
 *             example:
 *               firstName: john
 *               lastName: Doe
 *               middleName: any
 *               gender: Male
 *               email: fake@example.com
 *               companyProfileId: 2
 *               role: agent
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *             
 *
 *   get:
 *     summary: Get all agents
 *     description: Only admins can retrieve all agents.
 *     tags: [Agent]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Agent name
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: User role
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of agents
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
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
 *                     $ref: '#/components/schemas/Agent'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /Agents/{id}:
 *   get:
 *     summary: Get an agent
 *     description: Logged in agents can fetch only their own user information. Only admins can fetch other users.
 *     tags: [Agent]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Agent'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a agent
 *     description: Logged in agents can only update their own information. Only admins can update other agents.
 *     tags: [Agent]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Agent id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *             example:
 *               name: fake name
 *               email: fake@example.com
 *               password: password1
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Agent'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete an agent
 *     description: Logged in agents can delete only themselves. Only admins can delete other agents.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Agent id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

 /**
 * @swagger
 * /agent/login:
 *   post:
 *     summary: Login
 *     tags: [Agent]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *             example:
 *               email: fake@example.com
 *               password: password1
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "401":
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: Invalid email or password
 */

/**
 * @swagger
 * /agent/logout:
 *   post:
 *     summary: Logout
 *     tags: [Agent]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *             example:
 *               refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZWJhYzUzNDk1NGI1NDEzOTgwNmMxMTIiLCJpYXQiOjE1ODkyOTg0ODQsImV4cCI6MTU4OTMwMDI4NH0.m1U63blB0MLej_WfB7yC2FTMnCziif9X8yzwDEfJXAg
 *     responses:
 *       "204":
 *         description: No content
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */



/**
 * @swagger
 * /agent/lead:
 *   post:
 *     summary: Create a new lead
 *     description: Only agents can create leads.
 *     tags: [Lead]
 *     
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - middleName
 *               - gender
 *               - email
 *               - address
 *               - phoneNumber
 *               - status
 *               - policyNumber
 *               - totalAmountPaid
 *               - policyId
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               middleName:
 *                 type: string
 *               gender:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               status:
 *                 type: enum
 *               policyNumber:
 *                 type: string
 *               totalAmountPaid:
 *                 type: number
 *               policyId:
 *                 type: number
 *             example:
 *               firstName: john
 *               lastName: Doe
 *               middleName: any
 *               gender: Male
 *               email: elizabeth_leo@gmail.com
 *               address: 24 Gucci street, Lagos
 *               phoneNumber: 081 46789 2435
 *               status: New
 *               policyNumber: vet46yy2
 *               totalAmountPaid: 480000
 *               policyId: 3
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *             
 *
 *   get:
 *     summary: Get all leads
 *     description: Admins and Agents can retrieve all leads.
 *     tags: [Lead]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: lead name
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: lead email
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *         description: lead's gender
 *       - in: query
 *         name: address
 *         schema:
 *           type: string
 *         description: lead's address
 *       - in: query
 *         name: phoneNumber
 *         schema:
 *           type: integer
 *           minimum: 11
 *           default: 11
 *         description: lead's phoneNumber
 *       - in: query
 *         name: policyNumber
 *         schema:
 *           type: string
 *         description: lead's policyNumber
 *       - in: query
 *         name: totalAmountPaid
 *         schema:
 *           type: integer
 *           minimum: 1000
 *           default: 1
 *         description: total amount paid
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: the status of the lead
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
 *                     $ref: '#/components/schemas/User'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */