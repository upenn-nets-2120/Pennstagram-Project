import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Column, Main, NavBar, ProfilePic, Row, Scrollable, Page, LinkContainer } from '../../components';

import { UserContext } from '../../providers/UserProvider'; // Assuming you have a UserContext to provide user data
import { getSearchResults } from '../../hooks/search-hooks/get-search-results'; // Adjust the import based on your directory structure

const SearchPage: React.FC = () => {
    const [context, setContext] = useState('');
    const [query, setQuery] = useState('');
    const [result, setResult] = useState<string | null>(null);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (user) {
            const searchResult = await getSearchResults(user, context, query);
            if (searchResult) {
                setResult(searchResult.data);
            } else {
                console.error('Search failed');
            }
        } else {
            console.error('User not found');
        }
    };

    return (
        <Page>
            <NavBar />
            <Main>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', width: '100%' }}>
                    <h1 style={{ textAlign: 'center', marginBottom: '100px', fontSize: '50px' }}>Natural Language Search</h1>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
                        <input
                            type="text"
                            placeholder="context"
                            value={context}
                            onChange={(e) => setContext(e.target.value)}
                            style={{ margin: '10px', padding: '10px', width: '300px' }}
                        />
                        <input
                            type="text"
                            placeholder="query"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            style={{ margin: '10px', padding: '10px', width: '300px' }}
                        />
                        <button type="submit" style={{ padding: '10px 20px', margin: '10px' }}>Search</button>
                    </form>
                    {result && (
                        <div style={{ maxWidth: '600px', textAlign: 'center', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '10px' }}>
                            <h2 style={{ textAlign: 'center', marginBottom: '10px', fontSize: '20px' }}>NLS Response:</h2>
                            <p style={{ fontSize: '18px', lineHeight: '1.6' }}>{result}</p>
                        </div>
                    )}
                </div>
            </Main>
        </Page>
    );
};

export default SearchPage;