const db = require('../../database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fa9a6937e040ad136cc7740fec652b87';

exports.login = (req, res) => {
    const { username, password } = req.body;

    db.get('SELECT * FROM tbl_user WHERE username = ? ', username, async (err, user) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, { expiresIn: '365d' });
            res.status(200).json({ message: "login successful", token });
        } else {
            res.status(401).json({ message: "login invalid" });
        }
    });
};
