-- ============================================
-- ERP SYSTEM DATABASE SCHEMA
-- ============================================

-- ============================================
-- 1. USERS
-- ============================================

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT users_role_check
        CHECK (role IN ('ADMIN', 'SALES_USER'))
);


-- ============================================
-- 2. CUSTOMERS
-- ============================================

CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(150) NOT NULL,
    contact_person VARCHAR(100) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    email VARCHAR(150),
    city VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================
-- 3. PRODUCTS
-- ============================================

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    product_code VARCHAR(50) NOT NULL UNIQUE,
    product_name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    unit VARCHAR(30) NOT NULL,
    base_price NUMERIC(12, 2) NOT NULL,

    CONSTRAINT products_base_price_check
        CHECK (base_price >= 0)
);


-- ============================================
-- 4. INVENTORY
-- ============================================

CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL UNIQUE,
    physical_quantity INTEGER NOT NULL DEFAULT 0,
    reserved_quantity INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT inventory_product_fk
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE RESTRICT,

    CONSTRAINT inventory_physical_check
        CHECK (physical_quantity >= 0),

    CONSTRAINT inventory_reserved_check
        CHECK (reserved_quantity >= 0),

    CONSTRAINT inventory_reserved_limit_check
        CHECK (reserved_quantity <= physical_quantity)
);


-- ============================================
-- 5. ENQUIRIES
-- ============================================

CREATE TABLE enquiries (
    id SERIAL PRIMARY KEY,
    enquiry_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id INTEGER NOT NULL,
    enquiry_date DATE NOT NULL DEFAULT CURRENT_DATE,
    required_date DATE,
    notes TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'NEW',
    created_by INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT enquiries_customer_fk
        FOREIGN KEY (customer_id)
        REFERENCES customers(id)
        ON DELETE RESTRICT,

    CONSTRAINT enquiries_created_by_fk
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT enquiries_status_check
        CHECK (status IN ('NEW', 'QUOTED', 'WON', 'LOST'))
);


-- ============================================
-- 6. ENQUIRY ITEMS
-- ============================================

CREATE TABLE enquiry_items (
    id SERIAL PRIMARY KEY,
    enquiry_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,

    CONSTRAINT enquiry_items_enquiry_fk
        FOREIGN KEY (enquiry_id)
        REFERENCES enquiries(id)
        ON DELETE CASCADE,

    CONSTRAINT enquiry_items_product_fk
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE RESTRICT,

    CONSTRAINT enquiry_items_quantity_check
        CHECK (quantity > 0),

    CONSTRAINT enquiry_items_unique_product
        UNIQUE (enquiry_id, product_id)
);


-- ============================================
-- 7. QUOTATIONS
-- ============================================

CREATE TABLE quotations (
    id SERIAL PRIMARY KEY,
    quotation_number VARCHAR(50) NOT NULL UNIQUE,
    enquiry_id INTEGER NOT NULL UNIQUE,
    customer_id INTEGER NOT NULL,
    valid_until DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    grand_total NUMERIC(14, 2) NOT NULL DEFAULT 0,
    created_by INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT quotations_enquiry_fk
        FOREIGN KEY (enquiry_id)
        REFERENCES enquiries(id)
        ON DELETE RESTRICT,

    CONSTRAINT quotations_customer_fk
        FOREIGN KEY (customer_id)
        REFERENCES customers(id)
        ON DELETE RESTRICT,

    CONSTRAINT quotations_created_by_fk
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT quotations_status_check
        CHECK (status IN ('DRAFT', 'SENT', 'ACCEPTED', 'REJECTED')),

    CONSTRAINT quotations_grand_total_check
        CHECK (grand_total >= 0)
);


-- ============================================
-- 8. QUOTATION ITEMS
-- ============================================

CREATE TABLE quotation_items (
    id SERIAL PRIMARY KEY,
    quotation_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price NUMERIC(12, 2) NOT NULL,
    discount_percent NUMERIC(5, 2) NOT NULL DEFAULT 0,
    gst_percent NUMERIC(5, 2) NOT NULL DEFAULT 0,
    line_amount NUMERIC(14, 2) NOT NULL DEFAULT 0,

    CONSTRAINT quotation_items_quotation_fk
        FOREIGN KEY (quotation_id)
        REFERENCES quotations(id)
        ON DELETE CASCADE,

    CONSTRAINT quotation_items_product_fk
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE RESTRICT,

    CONSTRAINT quotation_items_quantity_check
        CHECK (quantity > 0),

    CONSTRAINT quotation_items_unit_price_check
        CHECK (unit_price >= 0),

    CONSTRAINT quotation_items_discount_check
        CHECK (discount_percent >= 0 AND discount_percent <= 100),

    CONSTRAINT quotation_items_gst_check
        CHECK (gst_percent >= 0),

    CONSTRAINT quotation_items_line_amount_check
        CHECK (line_amount >= 0),

    CONSTRAINT quotation_items_unique_product
        UNIQUE (quotation_id, product_id)
);


-- ============================================
-- 9. SALES ORDERS
-- ============================================

CREATE TABLE sales_orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id INTEGER NOT NULL,
    quotation_id INTEGER NOT NULL UNIQUE,
    order_date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_amount NUMERIC(14, 2) NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_by INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT sales_orders_customer_fk
        FOREIGN KEY (customer_id)
        REFERENCES customers(id)
        ON DELETE RESTRICT,

    CONSTRAINT sales_orders_quotation_fk
        FOREIGN KEY (quotation_id)
        REFERENCES quotations(id)
        ON DELETE RESTRICT,

    CONSTRAINT sales_orders_created_by_fk
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT sales_orders_status_check
        CHECK (
            status IN (
                'PENDING',
                'CONFIRMED',
                'DISPATCHED',
                'CANCELLED'
            )
        ),

    CONSTRAINT sales_orders_total_check
        CHECK (total_amount >= 0)
);


-- ============================================
-- 10. SALES ORDER ITEMS
-- ============================================

CREATE TABLE sales_order_items (
    id SERIAL PRIMARY KEY,
    sales_order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,

    CONSTRAINT sales_order_items_order_fk
        FOREIGN KEY (sales_order_id)
        REFERENCES sales_orders(id)
        ON DELETE CASCADE,

    CONSTRAINT sales_order_items_product_fk
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE RESTRICT,

    CONSTRAINT sales_order_items_quantity_check
        CHECK (quantity > 0),

    CONSTRAINT sales_order_items_unique_product
        UNIQUE (sales_order_id, product_id)
);


-- ============================================
-- 11. DISPATCHES
-- ============================================

CREATE TABLE dispatches (
    id SERIAL PRIMARY KEY,
    dispatch_number VARCHAR(50) NOT NULL UNIQUE,
    sales_order_id INTEGER NOT NULL,
    dispatch_date DATE NOT NULL DEFAULT CURRENT_DATE,
    vehicle_number VARCHAR(50),
    driver_name VARCHAR(100),
    created_by INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT dispatches_sales_order_fk
        FOREIGN KEY (sales_order_id)
        REFERENCES sales_orders(id)
        ON DELETE RESTRICT,

    CONSTRAINT dispatches_created_by_fk
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE RESTRICT
);


-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_enquiries_customer_id
    ON enquiries(customer_id);

CREATE INDEX idx_enquiries_status
    ON enquiries(status);

CREATE INDEX idx_enquiry_items_product_id
    ON enquiry_items(product_id);

CREATE INDEX idx_quotations_customer_id
    ON quotations(customer_id);

CREATE INDEX idx_quotations_status
    ON quotations(status);

CREATE INDEX idx_quotation_items_product_id
    ON quotation_items(product_id);

CREATE INDEX idx_sales_orders_customer_id
    ON sales_orders(customer_id);

CREATE INDEX idx_sales_orders_status
    ON sales_orders(status);

CREATE INDEX idx_sales_order_items_product_id
    ON sales_order_items(product_id);

CREATE INDEX idx_dispatches_sales_order_id
    ON dispatches(sales_order_id);