import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Routes, Navigate } from 'react-router';
import {
   HOME_PATH,
   FRIENDS_PATH,
} from './paths';
import {
   FriendsPage
} from '../pages';


const Router: React.FC = () => {
   return (
      <BrowserRouter>
         <Routes>
            <Route path={HOME_PATH} element={/*<HomePage />*/<div /> } />
            <Route path={FRIENDS_PATH} element={ <FriendsPage /> } />
            <Route path="/" element={<Navigate replace to={HOME_PATH} />} />
         </Routes>
      </BrowserRouter>
   );
};

export default Router;