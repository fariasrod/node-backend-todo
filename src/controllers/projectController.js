const db = require('../../database');


exports.createProject = (req, res) => {
    const { name, user } = req.body;

    if (!name || !user) {
        return res.status(400).json({ error: 'All attributes (name, user) are mandatory.' });
    }

    db.run('INSERT INTO tbl_project (name, user) VALUES (?, ?)', [name, user], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const projectId = this.lastID;

        db.get('SELECT * FROM tbl_project WHERE id = ?', [projectId], (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json(row);
        });
    });
};

exports.editProject = (req, res) => {
    const { name } = req.body;
    const { id } = req.params;

    if (!name) {
        return res.status(400).json({ error: 'All attributes (name) are mandatory.' });
    }

    db.run('UPDATE tbl_project SET name = ? WHERE id = ?', [name, id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const projectId = this.lastID;

        db.get('SELECT * FROM tbl_project WHERE id = ?', [projectId], (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json(row);
        });
    });
};

exports.deleteProject = (req, res) => {

    const { id } = req.params;

    db.run('DELETE FROM tbl_project WHERE id = ?', id, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(204).json({ message: 'Project deleted' });
    });
};

exports.listProjectsAndTaskByUser = (req, res) => {
    const { user } = req.params;

    db.all('SELECT * FROM tbl_project WHERE user = ?', user, (err, projects) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const projectsWithTasks = [];
        let projectsProcessed = 0;

        if (projects.length === 0) {
            res.status(200).json([]);
        } else {
            projects.forEach(project => {
                db.all('SELECT * FROM tbl_task WHERE project_id = ?', project.id, (err, tasks) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }

                    projectsWithTasks.push({ ...project, tasks });

                    projectsProcessed++;
                    if (projectsProcessed === projects.length) {
                        res.status(200).json(projectsWithTasks);
                    }
                });
            });
        }
    });
};

