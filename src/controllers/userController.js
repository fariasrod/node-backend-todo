const db = require('../../database');
const bcrypt = require('bcryptjs');

exports.createUser = async (req, res) => {
    const { name, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 8);

    if (!name || !username || !password) {
        return res.status(400).json({ error: 'All attributes (name, username, password) are mandatory.' });
    }

    db.run('INSERT INTO tbl_user (name, username, password) VALUES (?, ?, ?)', [name, username, hashedPassword], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID });
    });
};
