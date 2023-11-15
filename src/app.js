const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/userRoutes');
const authRoutes  = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');

app.use('/users', userRoutes);
app.use('/login', authRoutes);
app.use('/projects', projectRoutes);
app.use('/tasks', taskRoutes);


module.exports = app;
