import express from 'express';
import {
    addNotification,
    deleteNotification,
    getNotificationsFromUser,
} from '../../db/index.js'

const routes = express.Router();

routes.post('/notifications/add/:userID', async (req, res) => {
    const userID = req.params.userID;
    const type = req.body.chatName;
    const content = req.body.description;

    if (
        !userID || userID == null ||
        !type || type == null ||
        !content || content == null
    ) {
        res.status(400).json({ error: 'bad input' });
        return;
    }

    const data = await addNotification(userID, type, content);

    res.status(200).json(data);
});

routes.post('/notifications/delete/:notificationsID', async (req, res) => {
    const notificationsID = req.params.notificationsID;

    if (
        !notificationsID || notificationsID == null
    ) {
        res.status(400).json({ error: 'bad input' });
        return;
    }

    const data = await deleteNotification(notificationsID);

    res.status(200).json(data);
});

routes.get('/notifications/get/:userID', async (req, res) => {
    const userID = req.params.userID;

    if (
        !userID || userID == null
    ) {
        res.status(400).json({ error: 'bad input' });
        return;
    }

    const data = await getNotificationsFromUser(userID);

    res.status(200).json(data);
});

export default routes;