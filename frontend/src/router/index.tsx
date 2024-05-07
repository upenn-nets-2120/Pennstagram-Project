import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Routes, Navigate } from 'react-router';
import {
   HOME_PATH,
   FRIENDS_PATH,
   USER_CHATS_PATH,
   CHAT_PATH,
} from './paths';
import {
   FriendsPage,
   ChatsPage,
   ChatPage,
} from '../pages';


const Router: React.FC = () => {
   return (
      <BrowserRouter>
         <Routes>
            <Route path={HOME_PATH} element={/*<HomePage />*/<div /> } />
            <Route path={FRIENDS_PATH} element={ <FriendsPage /> } />
            <Route path={USER_CHATS_PATH} element={ <ChatsPage /> } />
            <Route path={CHAT_PATH} element={ <ChatPage /> } />
            <Route path="/" element={<Navigate replace to={HOME_PATH} />} />
         </Routes>
      </BrowserRouter>
   );
};

export default Router;