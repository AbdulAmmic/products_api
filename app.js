const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Product = require('./models/products.models'); 
const bcrypt = require('bcryptjs');
const User = require('./models/user.models');
const jwt = require('jsonwebtoken');

app.use(express.json());

const secretKey = "7ue!5S63%63HS";
const blacklistedTokens = new Set();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    if (blacklistedTokens.has(token)) {
        return res.status(401).json({ message: 'Token is blacklisted. Access denied.' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'You can’t access this endpoint, you are not logged in!' });
    }
};

// Signup
app.post('/api/signup', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = await User.create({ username: req.body.username, password: hashedPassword });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password!' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password!' });
        }

        const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '24h' });
        res.status(201).json({ message: 'Logged in successfully!', token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Logout
app.post('/api/logout', authenticateToken, (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(400).json({ message: 'No token provided.' });
    }

    blacklistedTokens.add(token);
    res.status(200).json({ message: 'Logged out successfully.' });
});

app.use(authenticateToken);

// Protected routes
app.get('/api/products',  async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: `Product with id ${id} not found` });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/products', async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(200).json(product);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});

app.put('/api/products/:id',  async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
        if (!product) {
            return res.status(404).json({ message: `Cannot find product with id ${id}` });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete('/api/products/:id',  async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ message: `The Product with id ${id} is not found!` });
        }
        res.status(200).json({ product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const port = process.env.PORT || 4000;

mongoose.connect('mongodb+srv://ammuhammad7535:ammic123@ammic.md1f4nt.mongodb.net/NodeApi?retryWrites=true&w=majority&appName=ammic')
    .then(() => {
        app.listen(port, () => {
            console.log(`Running on ${port}`);
        });
        console.log('db connected');
    })
    .catch((error) => {
        console.log(error);
    });
