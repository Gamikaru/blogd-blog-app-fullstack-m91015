import React, { createContext, useState, useEffect, useContext } from 'react';
import Cookies from 'universal-cookie';
import ApiClient from './ApiClient'; // Import your Axios client

const cookies = new Cookies();

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = cookies.get('PassBloggs');
            const userID = cookies.get('userID');

            if (!token || !userID) {
                console.log('Token or userID missing in cookies');
                return;
            }

            console.log('PassBloggs cookie:', token);
            console.log('userID cookie:', userID);

            try {
                const response = await ApiClient.get(`/user/${userID}`);
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
