import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Routes, Navigate } from 'react-router';
import {
   HOME_PATH,
   REGISTER_PATH,
   LOGIN_PATH,
   FRIENDS_PATH,
   CHAT_PATH,
   FORGOT_PATH,
   NEWPASS_PATH,
   FEED_PATH
} from './paths';
import {
   FriendsPage,
   ChatPage,
   HomePage,
   RegisterPage,
   LoginPage,
   ForgotPasswordPage,
   NewPasswordPage,
   FeedPage
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
            <Route path={FORGOT_PATH} element={ <ForgotPasswordPage /> } />
            <Route path={NEWPASS_PATH} element={ <NewPasswordPage /> } />
            <Route path={FEED_PATH} element={ <FeedPage /> } />
            <Route path="/" element={<Navigate replace to={HOME_PATH} />} />
         </Routes>
      </BrowserRouter>
   );
};

export default Router;