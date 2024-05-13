import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Column, Main, NavBar, ProfilePic, Row, Scrollable, Page, LinkContainer } from '../../components';
import { UserContext } from '../../providers/UserProvider';

const EditProfilePage: React.FC = () => {
    return (
        <Page>
            <NavBar />
            <Main>
                hi alain
            </Main>
        </Page>
    );
};

export default EditProfilePage;