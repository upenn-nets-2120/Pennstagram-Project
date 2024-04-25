import express from 'express';
import {
    getFolloweds,
    getFollowers,
    getRequesters,
    getRequesting,
    getRecommendations
} from '../../db/index.js'

const routes = express.Router();

routes.get('/followers/:userID', async (req, res) => {
    const userID = req.params.userID;

    if (!userID || userID == null) {
        res.status(400).json({ error: 'bad input' });
    }

    const data = await getFollowers(userID);

    res.status(200).json(data);
});



export default routes;