const db = require('../../database');

exports.createTask = (req, res) => {
    const { description, project_id } = req.body;

    if (!description || !project_id) {
        return res.status(400).json({ error: 'All attributes (description, project_id) are mandatory.' });
    }

    const creationDate = new Date();
    const finishDate = new Date();
    finishDate.setDate(finishDate.getDate() + 7);

    db.run('INSERT INTO tbl_task (description, is_done, creation_date, finish_date, project_id) VALUES (?, ?, ?, ?, ?)', [description, 0, creationDate.toISOString(), finishDate.toISOString(), project_id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const taskId = this.lastID;

        db.get('SELECT * FROM tbl_task WHERE id = ?', [taskId], (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json(row);
        });
    });
};

exports.editTask = (req, res) => {
    const { description, is_done } = req.body;
    const { id } = req.params;

    if (!description || !is_done) {
        return res.status(400).json({ error: 'All attributes (description, is_done) are mandatory.' });
    }

    db.run('UPDATE tbl_task SET description = ?, is_done = ? WHERE id = ?', [description, is_done, id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const taskId = this.lastID;

        db.get('SELECT * FROM tbl_task WHERE id = ?', [taskId], (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json(row);
        });
    });
};

exports.deleteTask = (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM tbl_task WHERE id = ?', id, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(204).json({ message: 'Task deleted' });
    });
};
