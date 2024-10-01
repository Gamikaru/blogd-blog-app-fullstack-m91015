// RedirectIfLoggedIn.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts';
import { useCookies } from 'react-cookie';
import Logger from '../../utils/Logger';

export default function RedirectIfLoggedIn({ children }) {
   const { user, loading } = useUser() || {};
   const [cookies] = useCookies(['PassBloggs']);
   const token = cookies.PassBloggs;
   const navigate = useNavigate();

   useEffect(() => {
      if (!loading && user && token) {
         Logger.info('RedirectIfLoggedIn: User is logged in, redirecting to home.');
         navigate('/');
      }
   }, [user, loading, token, navigate]);

   if (loading) {
      Logger.info('RedirectIfLoggedIn: Loading user data...');
      return <div>Loading...</div>;
   }

   Logger.info('RedirectIfLoggedIn: Rendering children.');
   return children;
}
