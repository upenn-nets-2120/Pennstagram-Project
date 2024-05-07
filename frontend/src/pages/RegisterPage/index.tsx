import React, { useState } from 'react';
import styled from 'styled-components';

const RegisterContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
`;

const RegisterForm = styled.form`
    display: flex;
    flex-direction: column;
    width: 300px;
    gap: 15px;
    background-color: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const InputField = styled.input`
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
`;

const SelectField = styled.select`
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
`;

const SubmitButton = styled.button`
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: #0056b3;
    }
`;

const FeedbackMessage = styled.div`
    margin-top: 15px;
    color: green;
`;

const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [affiliation, setAffiliation] = useState('');
    const [birthday, setBirthday] = useState('');
    const [profilePic, setProfilePic] = useState<File | null>(null);
    const [hashtags, setHashtags] = useState<string[]>([]);
    const [showFeedback, setShowFeedback] = useState(false);

    const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setProfilePic(e.target.files[0]);
        }
    };

    const handleHashtagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = Array.from(e.target.selectedOptions, (option) => option.value);
        setHashtags(selected);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username && password && profilePic) {
            setShowFeedback(true);
        } else {
            alert('Please enter both a username, a password, and upload a profile picture.');
        }
    };

    return (
        <RegisterContainer>
            <RegisterForm onSubmit={handleSubmit}>
                <h2>Register</h2>
                <InputField
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <InputField
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <InputField
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <InputField
                    type="text"
                    placeholder="Affiliation"
                    value={affiliation}
                    onChange={(e) => setAffiliation(e.target.value)}
                />
                <InputField
                    type="date"
                    placeholder="Birthday"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                />
                {/* Profile Picture Upload */}
                <label>Profile Picture</label>
                <InputField
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                />
                {/* Hashtag Selection */}
                <label>Hashtags of Interest</label>
                <SelectField multiple onChange={handleHashtagChange}>
                    <option value="technology">Technology</option>
                    <option value="music">Music</option>
                    <option value="travel">Travel</option>
                    <option value="fitness">Fitness</option>
                    <option value="gaming">Gaming</option>
                    <option value="food">Food</option>
                </SelectField>
                <SubmitButton type="submit">Submit</SubmitButton>
            </RegisterForm>

            {showFeedback && (
                <FeedbackMessage>
                    Registration successful!
                </FeedbackMessage>
            )}
        </RegisterContainer>
    );
};

export default RegisterPage;
