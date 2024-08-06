const express = require('express');
const app = express();
const mongoose = require('mongoose');
const products = require('./models/products.models');  
app.use(express.json());

app.get('/api/home', (req, res) => {
    res.send('Hello');
});

app.get('/api/products', async (req, res) => {
    try {
        const product = await products.find({});
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await products.findById(id);
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
        const product = await products.create(req.body);
        res.status(200).json(product);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});

app.put('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await products.findByIdAndUpdate(id, req.body, { new: true });
        if (!product) {
            return res.status(404).json({ message: `Cannot find product with id ${id}` });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await products.findByIdAndDelete(id);
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
