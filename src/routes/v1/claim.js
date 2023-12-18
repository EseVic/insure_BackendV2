const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');
const { claimsController } = require('../../controllers/claims');
// const { user_agentController } = require('../../controllers/');

const router = express.Router();

router.post('/:leadId', claimsController.createClaim);
router.get('/all/:agentId', claimsController.getAllClaims);
router.get('/:claimId', claimsController.getSingleAClaim);
router.put('/update/:claimid', claimsController.updateClaim);



// router.post('/login', authController.signin);


module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Claims
 *   description: Claims management and retrieval
 */

/**
 * @swagger
 * /claims:
 *   post:
 *     summary: Create a claim
 *     description: Only clients can create claims.
 *     tags: [Client]
 *     
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *               - claimsAmount
 *               - paymentStatus
 *               - claimsDescription
 *               - submittedDate
 *             properties:
 *               status:
 *                 type: enum
 *               claimsAmount:
 *                 type: integer
 *               paymentStatus:
 *                 type: emun
 *               claimsDescription:
 *                 type: string
 *               submittedDate:
 *                 type: string
 *             example:
 *               status: approved
 *               claimsAmount: N20000
 *               paymentStatus: processing
 *               claimsDescription: Property Damage
 *               submittedDate: 12/12/23
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
 *     summary: Get all claims
 *     description: Only clients can file claims.
 *     tags: [Claims]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Nature of claims
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
 *         description: Maximum number of claims
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
 * /Claims/{id}:
 *   get:
 *     summary: Get a claim
 *     description: Logged in agent can fetch only their own clients information.
 *     tags: [Claims]
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
 *     summary: Update a claim
 *     description: Logged in agent can only update their own clients information.
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Claims id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: enum
 *               claimsAmount:
 *                 type: integer
 *               paymentStatus:
 *                 type: enum
 *               claimsDescription:
 *                 type: string
 *               submittedDate:
 *                 type: string
 *             example:
 *               status: filed
 *               claimsAmount: N20000
 *               claimsDescription: Property Damage
 *               paymentStatus: pending
 *               submittedDate: 14/12/2023
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
 *     summary: Delete a claims
 *     description: Logged in agents can delete only their clients claims.
 *     tags: [Claims]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Claims id
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