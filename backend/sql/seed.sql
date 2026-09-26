-- ============================================
-- ERP SYSTEM SEED DATA
-- ============================================


-- ============================================
-- 1. USERS
-- ============================================
-- Password for both users:
-- Admin@123
--
-- The password is stored as a bcrypt hash.
-- We will use these accounts for testing initially.

INSERT INTO users (name, email, password_hash, role)
VALUES
(
    'ERP Admin',
    'admin@erp.com',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC1J1dWmJx3uY0uYJwOe',
    'ADMIN'
),
(
    'Sales User',
    'sales@erp.com',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC1J1dWmJx3uY0uYJwOe',
    'SALES_USER'
);


-- ============================================
-- 2. CUSTOMERS
-- ============================================

INSERT INTO customers
(
    company_name,
    contact_person,
    mobile,
    email,
    city
)
VALUES
(
    'ABC Manufacturing Pvt Ltd',
    'Rajesh Kumar',
    '9876543210',
    'rajesh@abcmfg.com',
    'Mumbai'
);


-- ============================================
-- 3. PRODUCTS
-- ============================================

INSERT INTO products
(
    product_code,
    product_name,
    category,
    unit,
    base_price
)
VALUES
(
    'MTR-001',
    'Industrial Electric Motor',
    'Motors',
    'Piece',
    25000.00
),
(
    'PMP-001',
    'Hydraulic Pump',
    'Hydraulics',
    'Piece',
    18000.00
),
(
    'CTL-001',
    'Industrial Control Panel',
    'Electrical',
    'Piece',
    35000.00
),
(
    'CVB-001',
    'Conveyor Belt',
    'Material Handling',
    'Meter',
    4500.00
),
(
    'GBX-001',
    'Industrial Gearbox',
    'Mechanical',
    'Piece',
    42000.00
),
(
    'VAL-001',
    'Pressure Control Valve',
    'Valves',
    'Piece',
    12000.00
);


-- ============================================
-- 4. INVENTORY
-- ============================================

INSERT INTO inventory
(
    product_id,
    physical_quantity,
    reserved_quantity
)
SELECT
    id,
    CASE product_code
        WHEN 'MTR-001' THEN 100
        WHEN 'PMP-001' THEN 75
        WHEN 'CTL-001' THEN 50
        WHEN 'CVB-001' THEN 500
        WHEN 'GBX-001' THEN 40
        WHEN 'VAL-001' THEN 120
    END,
    0
FROM products
WHERE product_code IN
(
    'MTR-001',
    'PMP-001',
    'CTL-001',
    'CVB-001',
    'GBX-001',
    'VAL-001'
);