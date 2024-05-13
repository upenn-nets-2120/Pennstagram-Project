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
} from '../../db-operations/index.js';

const friends = express.Router();

friends.get('/followers/:userID', async (req, res) => {
    try {
        const userID = req.params.userID;

        if (!userID || userID == null) {
            res.status(400).json({ error: 'bad input' });
            return;
        }

        const data = await getFollowersFromUser(userID);

        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching followers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

friends.get('/followeds/:userID', async (req, res) => {
    try {
        const userID = req.params.userID;

        if (!userID || userID == null) {
            res.status(400).json({ error: 'bad input' });
            return;
        }

        const data = await getFollowedsFromUser(userID);

        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching followeds:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

friends.get('/recommendations/:userID', async (req, res) => {
    try {
        const userID = req.params.userID;

        if (!userID || userID == null) {
            res.status(400).json({ error: 'bad input' });
            return;
        }

        const data = await getRecommendations(userID);

        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

friends.get('/requesters/:userID', async (req, res) => {
    try {
        const userID = req.params.userID;

        if (!userID || userID == null) {
            res.status(400).json({ error: 'bad input' });
            return;
        }

        const data = await getRequesters(userID);

        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching requesters:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

friends.get('/requesting/:userID', async (req, res) => {
    try {
        const userID = req.params.userID;

        if (!userID || userID == null) {
            res.status(400).json({ error: 'bad input' });
            return;
        }

        const data = await getRequesting(userID);

        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching requesting:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

friends.post('/acceptRequest/:userID/:requester', async (req, res) => {
    try {
        const userID = req.params.userID;
        const requester = req.params.requester;

        if (!userID || userID == null || !requester || requester == null) {
            res.status(400).json({ error: 'bad input' });
            return;
        }

        await deleteRequest(userID, requester);
        await addFriend(requester, userID);

        addNotification(requester, 'like', `${userID} has accepted your follow request!`);

        res.status(200).json({ message: 'Request accepted successfully' });
    } catch (error) {
        console.error('Error accepting request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

friends.post('/removeRequest/:userID/:requester', async (req, res) => {
    try {
        const userID = req.params.userID;
        const requester = req.params.requester;

        if (!userID || userID == null || !requester || requester == null) {
            res.status(400).json({ error: 'bad input' });
            return;
        }

        await deleteRequest(requester, userID);

        res.status(200).json({ message: 'Request removed successfully' });
    } catch (error) {
        console.error('Error removing request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

friends.post('/addRequest/:userID/:requested', async (req, res) => {
    try {
        const userID = req.params.userID;
        const requested = req.params.requested;

        if (!userID || userID == null || !requested || requested == null) {
            res.status(400).json({ error: 'bad input' });
            return;
        }

        await addRequest(requested, userID);

        addNotification(requested, 'like', `${userID} has requested to follow you!`)

        res.status(200).json({ message: 'Request added successfully' });
    } catch (error) {
        console.error('Error adding request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

friends.post('/removeFriend/:userID/:friend', async (req, res) => {
    try {
        const userID = req.params.userID;
        const friend = req.params.friend;

        if (!userID || userID == null || !friend || friend == null) {
            res.status(400).json({ error: 'bad input' });
            return;
        }

        await deleteFriend(userID, friend);

        addNotification(friend, 'like', `${userID} has stopped following you.`)

        res.status(200).json({ message: 'Friend removed successfully' });
    } catch (error) {
        console.error('Error removing friend:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

friends.post('/addFollower/:userID/:friend', async (req, res) => {
    try {
        const userID = req.params.userID;
        const friend = req.params.friend;

        if (!userID || userID == null || !friend || friend == null) {
            res.status(400).json({ error: 'bad input' });
            return;
        }

        await addFriend(userID, friend);

        addNotification(friend, 'like', `${userID} has started following you.`)

        res.status(200).json({ message: 'Follower added successfully' });
    } catch (error) {
        console.error('Error adding follower:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

friends.post('/retractRequest/:userID/:requested', async (req, res) => {
    try {
        const userID = req.params.userID;
        const requested = req.params.requested;

        if (!userID || userID == null || !requested || requested == null) {
            res.status(400).json({ error: 'bad input' });
            return;
        }

        await deleteRequest(userID, requested);

        res.status(200).json({ message: 'Request retracted successfully' });
    } catch (error) {
        console.error('Error retracting request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

friends.post('/removeRecommendations/:userID/:recommendation', async (req, res) => {
    try {
        const userID = req.params.userID;
        const recommendation = req.params.recommendation;

        if (!userID || userID == null || !recommendation || recommendation == null) {
            res.status(400).json({ error: 'bad input' });
            return;
        }

        await deleteRecommendation(userID, recommendation);

        res.status(200).json({ message: 'Recommendation removed successfully' });
    } catch (error) {
        console.error('Error removing recommendation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default friends;