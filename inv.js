const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Middleware to serve static files
app.use(express.static('public'));

// Initial balance and timestamp (In a real application, this would be stored in a database)
let balanceData = {
    balance: 100.00,  // Starting balance
    lastUpdated: Date.now()
};

// Load balance data from a file if it exists
if (fs.existsSync('balance.json')) {
    const rawData = fs.readFileSync('balance.json');
    balanceData = JSON.parse(rawData);
}

// Function to update balance
function updateBalance() {
    const now = Date.now();
    const elapsed = now - balanceData.lastUpdated;

    // Check if 24 hours have passed since the last update
    if (elapsed >= 24 * 60 * 60 * 1000) {
        balanceData.balance *= 1.05;  // Increase by 5%
        balanceData.lastUpdated = now;

        // Save the updated balance data to a file
        fs.writeFileSync('balance.json', JSON.stringify(balanceData));
    }
}

// Endpoint to get the current balance
app.get('/balance', (req, res) => {
    updateBalance();
    res.json(balanceData);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at default browser:${port}`);
});
