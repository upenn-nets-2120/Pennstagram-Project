import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Routes, Navigate } from 'react-router';
import {
   HOME_PATH,
   REGISTER_PATH,
   LOGIN_PATH,
   FRIENDS_PATH,
   CHAT_PATH,
} from './paths';
import {
   FriendsPage,
   ChatPage,
   HomePage,
   RegisterPage,
   LoginPage,
} from '../pages';


const Router: React.FC = () => {
   return (
      <BrowserRouter>
         <Routes>
            <Route path={HOME_PATH} element={ <HomePage /> } />
            <Route path={REGISTER_PATH} element={ <RegisterPage /> } />
            <Route path={LOGIN_PATH} element={ <LoginPage /> } />
            <Route path={FRIENDS_PATH} element={ <FriendsPage /> } />
            <Route path={CHAT_PATH} element={ <ChatPage /> } />
            <Route path="/" element={<Navigate replace to={HOME_PATH} />} />
         </Routes>
      </BrowserRouter>
   );
};

export default Router;