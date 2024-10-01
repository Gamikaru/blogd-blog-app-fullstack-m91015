import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout, PrivateRoute, PublicRoute } from './components/layout'; // Import PublicRoute
import { Providers } from './Providers'; // Modularized providers
import { ModalManager } from './components/modals/ModalManager'; // Modularized ModalManager
import { RedirectIfLoggedIn, LoginPage } from './components/auth'; // Auth pages barrel import
import { HomePage, Bloggs, Admin, Network } from './components/pages'; // Pages barrel import
import Logger from './utils/Logger';

const App = () => {
   Logger.info('App component rendered');

   return (
      <Providers>
         <BrowserRouter>
            <Routes>
               {/* Public Routes */}
               <Route
                  path="/login"
                  element={
                     <PublicRoute> {/* PublicRoute ensures center toast positioning */}
                        <RedirectIfLoggedIn>
                           <LoginPage />
                        </RedirectIfLoggedIn>
                     </PublicRoute>
                  }
               />

               {/* Private Routes */}
               <Route
                  path="/"
                  element={
                     <PrivateRoute> {/* PrivateRoute ensures top-right toast positioning */}
                        <AppLayout />
                     </PrivateRoute>
                  }
               >
                  <Route path="/" element={<HomePage />} />
                  <Route path="/bloggs" element={<Bloggs />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/network" element={<Network />} />
                  <Route path="*" element={<h1>Page Not Found</h1>} /> {/* Simple fallback */}
               </Route>
            </Routes>

            {/* Handle modals with the ModalManager */}
            <ModalManager />
         </BrowserRouter>
      </Providers>
   );
};

export default App;
