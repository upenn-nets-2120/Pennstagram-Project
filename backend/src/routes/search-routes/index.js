import express from 'express';
import { getSearchResult } from '../../db-operations/index.js'; // Ensure correct import path

const search = express.Router();

search.post('/getSearchResults', async (req, res) => {
    const { username, context, query } = req.body;

    if (!username || !context || !query) {
        return res.status(400).json({
            error: "Missing required parameters. Please include 'username', 'context', and 'query'."
        });
    }

    try {
        const result = await getSearchResult(username, context, query);
        res.status(200).json({
            message: "Search results retrieved successfully.",
            data: result
        });
    } catch (error) {
        console.error("Error retrieving search results:", error);
        res.status(500).json({
            error: "An error occurred while retrieving search results."
        });
    }
});

export default search;
