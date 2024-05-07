import express from 'express';
import {
    getFollowedsFromUser,
    getFollowersFromUser,
    getRequesters,
    getRequesting,
    getRecommendations,
    addFriend,
    addRecommendation,
    addRequest,
    deleteFriend,
    deleteRecommendation,
    deleteRequest,
    addNotification,
    deleteNotification,
    getNotificationsFromUser,
} from '../../db/index.js'

const routes = express.Router();

routes.get('/followers/:userID', async (req, res) => {
    const userID = req.params.userID;

    if (!userID || userID == null) {
        res.status(400).json({ error: 'bad input' });
        return;
    }

    const data = await getFollowers(userID);

    res.status(200).json(data);
});

routes.get('/followeds/:userID', async (req, res) => {
    const userID = req.params.userID;

    if (!userID || userID == null) {
        res.status(400).json({ error: 'bad input' });
        return;
    }

    const data = await getFolloweds(userID);

    res.status(200).json(data);
});

routes.get('/recommendations/:userID', async (req, res) => {
    const userID = req.params.userID;

    if (!userID || userID == null) {
        res.status(400).json({ error: 'bad input' });
        return;
    }

    const data = await getRecommendations(userID);

    res.status(200).json(data);
});

routes.get('/requesters/:userID', async (req, res) => {
    const userID = req.params.userID;

    if (!userID || userID == null) {
        res.status(400).json({ error: 'bad input' });
        return;
    }

    const data = await getRequesters(userID);

    res.status(200).json(data);
});

routes.get('/requesting/:userID', async (req, res) => {
    const userID = req.params.userID;

    if (!userID || userID == null) {
        res.status(400).json({ error: 'bad input' });
        return;
    }

    const data = await getRequesting(userID);

    res.status(200).json(data);
});

routes.post('/acceptRequest/:userID/:requester', async (req, res) => {
    const userID = req.params.userID;
    const requester = req.params.requester;

    if (!userID || userID == null || !requester || requester == null) {
        res.status(400).json({ error: 'bad input' });
        return;
    }

    await removeRequest(requester, userID);
    await addFriend(requester, userID);

    res.status(200).json({message: 'something'});
});

routes.post('/removeRequest/:userID/:requester', async (req, res) => {
    const userID = req.params.userID;
    const requester = req.params.requester;

    if (!userID || userID == null || !requester || requester == null) {
        res.status(400).json({ error: 'bad input' });
        return;
    }

    await deleteRequest(requester, userID);

    res.status(200).json({message: 'something'});
});

routes.post('/addRequest/:userID/:requested', async (req, res) => {
    const userID = req.params.userID;
    const requested = req.params.requested;

    if (!userID || userID == null || !requested || requested == null) {
        res.status(400).json({ error: 'bad input' });
        return;
    }

    await addRequest(userID, requested);

    res.status(200).json({message: 'something'});
});

routes.post('/removeFriend/:userID/:friend', async (req, res) => {
    const userID = req.params.userID;
    const friend = req.params.friend;

    if (!userID || userID == null || !friend || friend == null) {
        res.status(400).json({ error: 'bad input' });
        return;
    }

    await deleteFriend(userID, friend);

    res.status(200).json({message: 'something'});
});

routes.post('/addFriend/:userID/:friend', async (req, res) => {
    const userID = req.params.userID;
    const friend = req.params.friend;

    if (!userID || userID == null || !friend || friend == null) {
        res.status(400).json({ error: 'bad input' });
        return;
    }

    await addFriend(userID, friend);

    res.status(200).json({message: 'something'});
});

routes.post('/retractRequest/:userID/:requested', async (req, res) => {
    const userID = req.params.userID;
    const requested = req.params.requested;

    if (!userID || userID == null || !requested || requested == null) {
        res.status(400).json({ error: 'bad input' });
        return;
    }

    await removeRequest(userID, requested);

    res.status(200).json({message: 'something'});
});

routes.post('/removeRecommendations/:userID/:recommendation', async (req, res) => {
    const userID = req.params.userID;
    const recommendation = req.params.recommendation;

    if (!userID || userID == null || !recommendation || recommendation == null) {
        res.status(400).json({ error: 'bad input' });
        return;
    }

    await deleteRecommendation(userID, recommendation);

    res.status(200).json({message: 'something'});
});

export default routes;