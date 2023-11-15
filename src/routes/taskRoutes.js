const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authenticateJWT = require('../middleware/authenticateJWT');

router.post('/', authenticateJWT, taskController.createTask);
router.put('/:id', authenticateJWT, taskController.editTask);
router.delete('/:id', authenticateJWT, taskController.deleteTask);

module.exports = router;
