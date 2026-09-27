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
import Quotations from "./pages/Quotations";
import SalesOrders from "./pages/SalesOrders";

const App = () => {

    return (
        <BrowserRouter>

            <AuthProvider>

                <Routes>

                    {/* Public */}
                    <Route
                        path="/login"
                        element={<Login />}
                    />


                    {/* Protected */}
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

                        <Route
                            path="/quotations"
                            element={
                                <>
                                    <Navbar />
                                    <Quotations />
                                </>
                            }
                        />

                        <Route
                            path="/sales-orders"
                            element={
                                <>
                                    <Navbar />
                                    <SalesOrders />
                                </>
                            }
                        />

                    </Route>


                    {/* Unknown routes */}
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