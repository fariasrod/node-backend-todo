const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authenticateJWT = require('../middleware/authenticateJWT');

router.post('/', authenticateJWT, projectController.createProject);
router.put('/:id', authenticateJWT, projectController.editProject);
router.delete('/:id', authenticateJWT, projectController.deleteProject);
router.get('/user/:user', authenticateJWT, projectController.listProjectsAndTaskByUser);

module.exports = router;
