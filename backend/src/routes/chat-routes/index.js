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
} from  '../../db-operations/index.js';

const chats = express.Router();

chats.post('/create/:userID', async (req, res) => {
    const userID = req.params.userID;
    const { chatName, description, profilePic, onlyAdmins, users } = req.body;

    if (!userID || !chatName || !description || !profilePic || !users || onlyAdmins == null) {
        res.status(400).json({ error: 'Bad input' });
        return;
    }

    try {
        const result = await addChat(chatName, description, profilePic, onlyAdmins);
        console.log(result);
        const chatID = result.insertId;

        await addUsers2chat(userID, chatID, true);
        for (const user of users) {
            await addUsers2chat(user, chatID, false);
        }

        res.status(200).json({ chatID: chatID });
    } catch (error) {
        console.error('Error creating chat:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

chats.post('/delete', async (req, res) => {
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

chats.post('/add-user/:userID', async (req, res) => {
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

chats.post('/delete-user/:userID', async (req, res) => {
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

chats.post('/edit-name', async (req, res) => {
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

chats.post('/edit-description', async (req, res) => {
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

chats.post('/edit-profile-pic', async (req, res) => {
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

chats.post('/edit-only-admin', async (req, res) => {
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

chats.post('/edit-only-admin', async (req, res) => {
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

chats.post('/send-message/:userID', async (req, res) => {
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

    await addMessage(userID, chatID, content);

    res.status(200).json({message: 'success'});
});

chats.post('/delete-message/:messageID', async (req, res) => {
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

chats.get('/:chatID', async (req, res) => {
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

chats.get('/get/:userID', async (req, res) => {
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

export default chats;