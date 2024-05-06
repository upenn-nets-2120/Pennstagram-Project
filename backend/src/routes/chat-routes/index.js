import express from 'express';
import {
    addChat,
    deleteChat,
    editChatDescription,
    editChatName,
    editChatOnlyAdmin,
    editChatProfilePic,
    getChats,
    addMessage,
    deleteMessage,
    getMessagesFromChat,
    addUsers2chat,
    deleteUsers2chat,
    addNotification,
    deleteNotification,
    getNotificationsFromUser,
} from '../../db/index.js'

const routes = express.Router();

routes.post('/chat/create', async (req, res) => {
    const chatName = req.body.chatName;
    const description = req.body.description;
    const profilePic = req.body.profilePic;
    const onlyAdmins = req.body.onlyAdmins;

    if (
        !chatName || chatName == null ||
        !description || description == null ||
        !profilePic || profilePic == null ||
        !onlyAdmins || onlyAdmins == null
    ) {
        res.status(400).json({ error: 'bad input' });
        return;
    }

    const data = await addChat(chatName, description, profilePic, onlyAdmins);

    res.status(200).json(data);
});

routes.post('/chat/delete', async (req, res) => {
    const chatName = req.body.chatName;
    const description = req.body.description;
    const profilePic = req.body.profilePic;
    const onlyAdmins = req.body.onlyAdmins;

    if (
        !chatName || chatName == null ||
        !description || description == null ||
        !profilePic || profilePic == null ||
        !onlyAdmins || onlyAdmins == null
    ) {
        res.status(400).json({ error: 'bad input' });
        return;
    }

    const data = await deleteChat(chatName, description, profilePic, onlyAdmins);

    res.status(200).json(data);
});

routes.post('/chat/add-user/:userID', async (req, res) => {
    const userID = req.params.userID;
    const chatID = req.body.chatID;
    const isAdmin = req.body.isAdmin;

    if (
        !userID || userID == null ||
        !chatID || chatID == null ||
        !isAdmin || isAdmin == null
    ) {
        res.status(400).json({ error: 'bad input' });
        return;
    }

    const data = await addUsers2chat(userID, chatID, isAdmin);

    res.status(200).json(data);
});

routes.post('/chat/delete-user/:userID', async (req, res) => {
    const userID = req.params.userID;
    const chatID = req.body.chatID;

    if (
        !userID || userID == null ||
        !chatID || chatID == null
    ) {
        res.status(400).json({ error: 'bad input' });
        return;
    }

    const data = await deleteUsers2chat(userID, chatID);

    res.status(200).json(data);
});

routes.post('/chat/edit-name', async (req, res) => {
    const chatID = req.body.chatID;
    const name = req.body.name;

    if (
        !chatID || chatID == null ||
        !name || name == null
    ) {
        res.status(400).json({ error: 'bad input' });
        return;
    }

    const data = await editChatName(chatID, name);

    res.status(200).json(data);
});

routes.post('/chat/edit-description', async (req, res) => {
    const chatID = req.body.chatID;
    const description = req.body.description;

    if (
        !chatID || chatID == null ||
        !description || description == null
    ) {
        res.status(400).json({ error: 'bad input' });
        return;
    }

    const data = await editChatDescription(chatID, description);

    res.status(200).json(data);
});

routes.post('/chat/edit-profile-pic', async (req, res) => {
    const chatID = req.body.chatID;
    const profilePic = req.body.profilePic;

    if (
        !chatID || chatID == null ||
        !profilePic || profilePic == null
    ) {
        res.status(400).json({ error: 'bad input' });
        return;
    }

    const data = await editChatProfilePic(chatID, profilePic);

    res.status(200).json(data);
});

routes.post('/chat/edit-only-admin', async (req, res) => {
    const chatID = req.body.chatID;
    const onlyAdmin = req.body.onlyAdmin;

    if (
        !chatID || chatID == null ||
        !onlyAdmin || onlyAdmin == null
    ) {
        res.status(400).json({ error: 'bad input' });
        return;
    }

    const data = await editChatOnlyAdmin(chatID, onlyAdmin);

    res.status(200).json(data);
});

routes.post('/chat/edit-only-admin', async (req, res) => {
    const chatID = req.body.chatID;
    const onlyAdmin = req.body.onlyAdmin;

    if (
        !chatID || chatID == null ||
        !onlyAdmin || onlyAdmin == null
    ) {
        res.status(400).json({ error: 'bad input' });
        return;
    }

    const data = await editChatOnlyAdmin(chatID, onlyAdmin);

    res.status(200).json(data);
});

routes.post('/chat/send-message/:userID', async (req, res) => {
    const userID = req.params.userID;
    const chatID = req.body.chatID;
    const content = req.body.content;

    if (
        !userID || userID == null ||
        !chatID || chatID == null ||
        !content || content == null
    ) {
        res.status(400).json({ error: 'bad input' });
        return;
    }

    const data = await addMessage(userID, chatID, content);

    res.status(200).json(data);
});

routes.post('/chat/delete-message/:messageID', async (req, res) => {
    const messageID = req.params.messageID;

    if (
        !userID || userID == null ||
        !chatID || chatID == null ||
        !content || content == null
    ) {
        res.status(400).json({ error: 'bad input' });
        return;
    }

    const data = await deleteMessage(messageID);

    res.status(200).json(data);
});

routes.get('/chat/:chatID', async (req, res) => {
    const chatID = req.params.chatID;

    if (
        !chatID || chatID == null
    ) {
        res.status(400).json({ error: 'bad input' });
        return;
    }

    const data = await getMessagesFromChat(chatID);

    res.status(200).json(data);
});

routes.get('/chat/get/:userID', async (req, res) => {
    const userID = req.params.userID;

    if (
        !userID || userID == null
    ) {
        res.status(400).json({ error: 'bad input' });
        return;
    }

    const data = await getChats(userID);

    res.status(200).json(data);
});

export default routes;