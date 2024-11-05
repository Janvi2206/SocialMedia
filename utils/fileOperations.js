const fs = require('fs');

// Function to read data from a JSON file
const readFromFile = (filePath) => {
    if (fs.existsSync(filePath)) {
        const dataBuffer = fs.readFileSync(filePath);
        try {
            return JSON.parse(dataBuffer.toString());
        } catch (error) {
            console.error('Error parsing JSON:', error.message);
            return []; // Return an empty array or handle the error as needed
        }
    }
    return [];
};

// Function to write data to a JSON file
const writeToFile = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error('Error writing to file:', error.message);
    }
};

module.exports = { readFromFile, writeToFile };