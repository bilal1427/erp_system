import React, { useEffect, useState } from "react";

import Modal from "../components/Modal";

import SalesOrderTable
    from "../components/salesOrder/SalesOrderTable";

import SalesOrderDetails
    from "../components/salesOrder/SalesOrderDetails";

import ConfirmOrderModal
    from "../components/salesOrder/ConfirmOrderModal";

import DispatchModal
    from "../components/salesOrder/DispatchModal";

import InventoryTable
    from "../components/salesOrder/InventoryTable";

import {
    getSalesOrdersApi,
    confirmSalesOrderApi
} from "../services/salesOrderApi";

import {
    getInventoryApi
} from "../services/inventoryApi";

import {
    createDispatchApi
} from "../services/dispatchApi";

import { useAuth } from "../context/AuthContext";

const SalesOrders = () => {

    const { role } = useAuth();

    const [orders, setOrders] = useState([]);
    const [inventory, setInventory] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [selectedOrder, setSelectedOrder] =
        useState(null);

    const [modalType, setModalType] =
        useState(null);


    const loadData = async () => {

        try {

            setLoading(true);
            setError("");

            const [
                ordersResponse,
                inventoryResponse
            ] = await Promise.all([
                getSalesOrdersApi(),
                getInventoryApi()
            ]);

            setOrders(
                ordersResponse?.data ||
                ordersResponse ||
                []
            );

            setInventory(
                inventoryResponse?.data ||
                inventoryResponse ||
                []
            );

        } catch (error) {

            console.error(error);

            setError(
                error?.response?.data?.message ||
                "Failed to load sales order data."
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {
        loadData();
    }, []);


    const closeModal = () => {
        setSelectedOrder(null);
        setModalType(null);
    };


    const handleSelectOrder = (order) => {

        setSelectedOrder(order);
        setModalType("details");
    };


    const handleConfirmClick = (id) => {

        const order = orders.find(
            (item) => item.id === id
        );

        if (!order) {
            return;
        }

        setSelectedOrder(order);
        setModalType("confirm");
    };


    const handleConfirm = async (id) => {

        try {

            await confirmSalesOrderApi(id);

            closeModal();

            await loadData();

        } catch (error) {

            throw error;
        }
    };


    const handleDispatchClick = (order) => {

        setSelectedOrder(order);
        setModalType("dispatch");
    };


    const handleDispatch = async (
        dispatchData
    ) => {

        try {

            await createDispatchApi(
                dispatchData
            );

            closeModal();

            await loadData();

        } catch (error) {

            throw error;
        }
    };


    return (
        <div className="page-container">

            <div className="page-header">

                <div>
                    <h1>Sales Orders</h1>

                    <p>
                        Manage order confirmation,
                        inventory reservation and
                        dispatch.
                    </p>
                </div>

            </div>


            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}


            {/* Inventory */}

            <div className="content-card">

                <h2>Inventory Availability</h2>

                <InventoryTable
                    inventory={inventory}
                    loading={loading}
                />

            </div>


            {/* Sales Orders */}

            <div className="content-card">

                <h2>Sales Orders</h2>

                {loading ? (

                    <p>
                        Loading sales orders...
                    </p>

                ) : (

                    <SalesOrderTable
                        orders={orders}
                        role={role}
                        onConfirm={
                            handleConfirmClick
                        }
                        onDispatch={
                            handleDispatchClick
                        }
                        onView={handleSelectOrder}
                    />

                )}

            </div>


            {/* Order Details Modal */}

            <Modal
                isOpen={
                    modalType === "details"
                }
                onClose={closeModal}
                title="Sales Order Details"
            >

                <SalesOrderDetails
                    order={selectedOrder}
                />

            </Modal>


            {/* Confirm Modal */}

            <Modal
                isOpen={
                    modalType === "confirm"
                }
                onClose={closeModal}
                title="Confirm Sales Order"
            >

                <ConfirmOrderModal
                    order={selectedOrder}
                    onConfirm={handleConfirm}
                    onCancel={closeModal}
                />

            </Modal>


            {/* Dispatch Modal */}

            <Modal
                isOpen={
                    modalType === "dispatch"
                }
                onClose={closeModal}
                title="Process Dispatch"
            >

                <DispatchModal
                    order={selectedOrder}
                    onDispatch={handleDispatch}
                    onCancel={closeModal}
                />

            </Modal>

        </div>
    );
};

export default SalesOrders;