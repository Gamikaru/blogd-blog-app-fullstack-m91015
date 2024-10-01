// UserContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import ApiClient from '../services/api/ApiClient';

const cookies = new Cookies();

const UserContext = createContext();

export const UserProvider = ({ children }) => {
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchUser = async () => {
         const token = cookies.get('PassBloggs');
         const userID = cookies.get('userID');

         if (!token || !userID) {
            console.log('No token or userID found.');
            setUser(null);
            setLoading(false);
            return;
         }

         try {
            console.log('Fetching user data for userID:', userID);
            const response = await ApiClient.get(`/user/${userID}`);

            if (response.data) {
               console.log('User data fetched:', response.data);
               setUser(response.data);
            } else {
               console.log('No user data found.');
               setUser(null);
            }
         } catch (error) {
            console.error('Error fetching user data:', error.message);
            setUser(null);
         } finally {
            setLoading(false);
         }
      };

      fetchUser();
   }, []);

   console.log('UserProvider rendered with user:', user);

   return (
      <UserContext.Provider value={{ user, loading, setUser }}>
         {children}
      </UserContext.Provider>
   );
};

export const useUser = () => {
   const context = useContext(UserContext);
   if (!context) {
      throw new Error('useUser must be used within a UserProvider');
   }
   return context;
};

export const useUserUpdate = () => {
   const context = useContext(UserContext);
   if (!context) {
      throw new Error('useUserUpdate must be used within a UserProvider');
   }
   return context.setUser;
};

export default UserContext;
