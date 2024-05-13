import React, { useEffect, useState } from 'react';
import Select, { MultiValue, ActionMeta } from 'react-select';
import styled from 'styled-components';
import config from '../../config.json';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

const RegisterPage: React.FC = () => {
    const rootURL = config.serverRootURL;
    const navigate = useNavigate(); 

    interface HashtagOption {
        label: string;
        value: number;
      }

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [affiliation, setAffiliation] = useState('');
    const [visibility, setVisibility] = useState('public');
    const [birthday, setBirthday] = useState('');
    const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
    const [hashtags, setHashtags] = useState<HashtagOption[]>([]);
    const [selectedHashtags, setSelectedHashtags] = useState<HashtagOption[]>([]);
    
    const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setProfilePhoto(e.target.files[0]);
        }
    };


    useEffect(() => {
        // Function to fetch hashtags
        const fetchHashtags = async () => {
            try {
                const response = await axios.get(`${rootURL}/registration/select-hashtags`);
                if (response) {
                    // setHashtags(response.data.popularHashtags);
                    setHashtags(response.data.popularHashtags.map((h: any) => ({
                        label: `#${h.phrase}`,
                        value: h.hashtagID
                    })));
                } else {
                    throw new Error('Failed to fetch hashtags');
                }
            } catch (error) {
                let errorMessage: string;
            
            // Type guard to ensure it's an instance of AxiosError
            if (axios.isAxiosError(error)) {
                // Axios-specific error handling
                errorMessage = error.response?.data.error || 'An error occurred';
                console.error(`Error fetching hashtags: ${errorMessage}`);
                const errorDetails = {
                    message: errorMessage,
                    status: error.response?.status || 'Unknown status'
                };
                return errorDetails;
            } else {
                // Generic error handling
                errorMessage = 'An unexpected error occurred';
                console.error(errorMessage);
                return { message: errorMessage, status: 'Unknown status' };
            }
            }
        };

        fetchHashtags();
    }, []);

    // const handleHashtagChange = (newSelected: MultiValue<HashtagOption>) => {
    //     const newSelectedHashtags = Array.from(newSelected);
    
    //     setSelectedHashtags(newSelectedHashtags);
    
    //     // Create a Set for the selected IDs to filter out from available hashtags
    //     const selectedIds = new Set(newSelectedHashtags.map((h) => h.value));
    
    //     // Filter out selected hashtags from the original list
    //     setHashtags(hashtags.filter((h) => !selectedIds.has(h.value)));
    // };

    const handleHashtagChange = (newSelected: MultiValue<HashtagOption>, actionMeta: ActionMeta<HashtagOption>) => {
        // Convert the readonly MultiValue array to a mutable array before setting state
        const newSelectedHashtags = [...newSelected];
        setSelectedHashtags(newSelectedHashtags);
    
        switch (actionMeta.action) {
            case 'select-option':
                if (actionMeta.option) {
                    setHashtags((prevHashtags) => prevHashtags.filter((option) => option.value !== actionMeta.option!.value));
                }
                break;
    
            case 'remove-value':
            case 'pop-value':
                if (actionMeta.removedValue) {
                    // Add back the removed hashtag to the list of available options
                    setHashtags((prevHashtags) => [...prevHashtags, actionMeta.removedValue].sort((a, b) => a.value - b.value));
                }
                break;
    
            default:
                // Handle other actions if necessary
                break;
        }
    };
    
    
    
    

    // const handleHashtagChange = (selectedOptions: MultiValue<HashtagOption, true>, actionMeta: ActionMeta<HashtagOption>) => {
    //     console.log("Selected Hashtags: ", selectedOptions);
    //     setSelectedHashtags(selectedOptions);
    //   };

    // const hashtagOptions = hashtags.map(hashtag => ({
    //     label: `#${hashtag['phrase']}`, 
    //     value: hashtag['hashtagID'] 
    // }));


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (username && password && confirmPassword && email && affiliation && birthday && hashtags && profilePhoto) {
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            try {
                console.log("profilePHOTO", profilePhoto);
                const formData = new FormData();
                formData.append('file', profilePhoto); 
                formData.append('username', username);
                const response2 = await axios.post(`${rootURL}/registration/uploadImage`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                console.log(response2.status);
                console.log(response2);

                console.log(`${config.serverRootURL}/registration`)
                console.log("DATA: ", {username, password, email, affiliation, birthday, selectedHashtags});
                const response = await axios.post(`${rootURL}/registration`, {
                    username: username,
                    password: password,
                    email: email,
                    affiliation: affiliation,
                    birthday: birthday,
                    hashtags: selectedHashtags,
                    userVisibility: visibility,
                  });
                console.log(response.status);
                console.log(response);

                

                // const response3 = await axios.post(`${rootURL}/registration/select-hashtags`, {
                //     userID: response1,
                //     hashtags: hashtags,
                //   });

                // console.log(response3.status);
                // console.log(response3);
                if (response.status === 201 && response2.status === 200) {
                    navigate('/feed'); 
                } else {
                    alert('Registration'); 
                }
            } catch (error) {
                let errorMessage: string;
            
            // Type guard to ensure it's an instance of AxiosError
            if (axios.isAxiosError(error)) {
                // Axios-specific error handling
                errorMessage = error.response?.data.error || 'An error occurred';
                console.error(`Registration failed: ${errorMessage}`);
                const errorDetails = {
                    message: errorMessage,
                    status: error.response?.status || 'Unknown status'
                };
                return errorDetails;
            } else {
                // Generic error handling
                errorMessage = 'An unexpected error occurred';
                console.error(errorMessage);
                return { message: errorMessage, status: 'Unknown status' };
            }
            }
        } else {
            alert('One or more required fields are missing.');
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
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                <label>Account Visibility</label>
                <SelectField
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value)}
                    >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                </SelectField>
                {/* Hashtag Selection */}
                <label>Hashtags of Interest</label>
                <Select
                    isMulti
                    name="hashtags"
                    options={hashtags}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    value={selectedHashtags}
                    onChange={handleHashtagChange}
                    placeholder="Select hashtags..."
                    />
                <SubmitButton type="submit">Submit</SubmitButton>
            </RegisterForm>

        </RegisterContainer>
    );
};

export default RegisterPage;
