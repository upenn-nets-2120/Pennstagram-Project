import express from 'express';
import searchOperations from '../dbOperations/searchOperations.js';

const search = express.Router();

search.get('/getSearchResults', async (req, res) => {
    const { username, context, query } = req.body;

    // Check if all necessary parameters are provided
    if (!username || !context || !query) {
        return res.status(400).json({
            error: "Missing required parameters. Please include 'username', 'context', and 'query'."
        });
    }

    try {
        // Call the getSearchResult function with the necessary parameters
        const result = await searchOperations.getSearchResult(username, context, query);

        // Send back the results obtained from the getSearchResult function
        res.status(200).json({
            message: "Search results retrieved successfully.",
            data: result
        });
    } catch (error) {
        // Handle any errors that occur during the process
        console.error("Error retrieving search results:", error);
        res.status(500).json({
            error: "An error occurred while retrieving search results."
        });
    }
});

export default search;
