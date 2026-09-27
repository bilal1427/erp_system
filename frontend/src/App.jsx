import React from "react";

import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Enquiries from "./pages/Enquiries";

const App = () => {

    return (
        <BrowserRouter>

            <AuthProvider>

                <Routes>

                    {/* Public route */}
                    <Route
                        path="/login"
                        element={<Login />}
                    />


                    {/* Protected routes */}
                    <Route
                        element={<ProtectedRoute />}
                    >

                        <Route
                            path="/"
                            element={
                                <Navigate
                                    to="/enquiries"
                                    replace
                                />
                            }
                        />

                        <Route
                            path="/enquiries"
                            element={
                                <>
                                    <Navbar />
                                    <Enquiries />
                                </>
                            }
                        />

                    </Route>


                    {/* Unknown URL */}
                    <Route
                        path="*"
                        element={
                            <Navigate
                                to="/"
                                replace
                            />
                        }
                    />

                </Routes>

            </AuthProvider>

        </BrowserRouter>
    );
};

export default App;