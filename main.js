const express = require('express'); // Import Express
const fs = require('fs'); // Import the File System module
const path = require('path'); // Import the Path module
const app = express(); // Create an Express application

app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

const PORT = 3000;
const DATA_FILE = 'envelopes.json';

// Global variables to store envelopes and total budget
let envelopes = [];
let totalBudget = 0;

// Load envelopes from the JSON file
const loadEnvelopes = () => {
    if (fs.existsSync(DATA_FILE)) {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        const parsedData = JSON.parse(data);
        envelopes = parsedData.envelopes;
        totalBudget = parsedData.totalBudget;
    }
};

// Save envelopes to the JSON file
const saveEnvelopes = () => {
    const data = JSON.stringify({ envelopes, totalBudget }, null, 2);
    fs.writeFileSync(DATA_FILE, data, 'utf8');
};

// Load envelopes from the data file
loadEnvelopes();

// Define a GET route for "/"
app.get('/', (req, res) => {
    res.send('Hello, World');
});

// Define a POST route for "/envelopes" to create a new envelope
app.post('/envelopes', (req, res) => {
    const { title, budget } = req.body;

    if (!title || !budget) {
        return res.status(400).send('Title and budget are required');
    }

    const newEnvelope = {
        id: envelopes.length + 1,
        title,
        budget,
    };

    envelopes.push(newEnvelope);
    totalBudget += budget;

    saveEnvelopes(); // Save envelopes to the file

    res.status(201).send(newEnvelope);
});

// Define a GET route for "/envelopes" to retrieve all envelopes
app.get('/envelopes', (req, res) => {
    res.status(200).json(envelopes);
});

// Define a GET route for "/envelopes/:id" to retrieve a specific envelope by ID
app.get('/envelopes/:id', (req, res) => {
    const envelopeId = parseInt(req.params.id, 10);
    const envelope = envelopes.find(env => env.id === envelopeId);

    if (!envelope) {
        return res.status(404).send('Envelope not found');
    }

    res.status(200).json(envelope);
});

// Define a PUT route for "/envelopes/:id" to update a specific envelope
app.put('/envelopes/:id', (req, res) => {
    const envelopeId = parseInt(req.params.id, 10);
    const envelope = envelopes.find(env => env.id === envelopeId);

    if (!envelope) {
        return res.status(404).send('Envelope not found');
    }

    const { title, budget, amountToSubtract } = req.body;

    if (title) {
        envelope.title = title;
    }

    if (budget) {
        totalBudget -= envelope.budget;
        envelope.budget = budget;
        totalBudget += budget;
    }

    if (amountToSubtract) {
        if (amountToSubtract > envelope.budget) {
            return res.status(400).send('Amount to subtract exceeds envelope budget');
        }
        envelope.budget -= amountToSubtract;
        totalBudget -= amountToSubtract;
    }

    saveEnvelopes(); // Save envelopes to the file

    res.status(200).json(envelope);
});

// Define a DELETE route for "/envelopes/:id" to delete a specific envelope
app.delete('/envelopes/:id', (req, res) => {
    const envelopeId = parseInt(req.params.id, 10);
    const envelopeIndex = envelopes.findIndex(env => env.id === envelopeId);

    if (envelopeIndex === -1) {
        return res.status(404).send('Envelope not found');
    }

    const [deletedEnvelope] = envelopes.splice(envelopeIndex, 1);
    totalBudget -= deletedEnvelope.budget;

    saveEnvelopes(); // Save envelopes to the file

    res.status(200).send(`Envelope with ID ${envelopeId} deleted`);
});

// Define a POST route for "/envelopes/transfer/:from/:to" to transfer money between envelopes
app.post('/envelopes/transfer/:from/:to', (req, res) => {
    const fromId = parseInt(req.params.from, 10);
    const toId = parseInt(req.params.to, 10);
    const { amount } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).send('Amount to transfer must be a positive number');
    }

    const fromEnvelope = envelopes.find(env => env.id === fromId);
    const toEnvelope = envelopes.find(env => env.id === toId);

    if (!fromEnvelope) {
        return res.status(404).send('Source envelope not found');
    }

    if (!toEnvelope) {
        return res.status(404).send('Destination envelope not found');
    }

    if (amount > fromEnvelope.budget) {
        return res.status(400).send('Amount to transfer exceeds source envelope budget');
    }

    fromEnvelope.budget -= amount;
    toEnvelope.budget += amount;

    saveEnvelopes(); // Save envelopes to the file

    res.status(200).send(`Transferred ${amount} from envelope ${fromId} to envelope ${toId}`);
});

// Define a POST route for "/envelopes/distribute" to distribute a balance to multiple envelopes
app.post('/envelopes/distribute', (req, res) => {
    const { amount, envelopeIds } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).send('Amount to distribute must be a positive number');
    }

    if (!Array.isArray(envelopeIds) || envelopeIds.length === 0) {
        return res.status(400).send('Envelope IDs must be a non-empty array');
    }

    const validEnvelopes = envelopeIds.map(id => envelopes.find(env => env.id === id)).filter(Boolean);

    if (validEnvelopes.length !== envelopeIds.length) {
        return res.status(400).send('One or more envelope IDs are invalid');
    }

    const amountPerEnvelope = amount / validEnvelopes.length;

    validEnvelopes.forEach(envelope => {
        envelope.budget += amountPerEnvelope;
    });

    totalBudget += amount;

    saveEnvelopes(); // Save envelopes to the file

    res.status(200).send(`Distributed ${amount} across envelopes: ${envelopeIds.join(', ')}`);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});