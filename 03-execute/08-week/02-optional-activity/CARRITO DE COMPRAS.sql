CREATE DATABASE ecommerce_db;
USE ecommerce_db;

CREATE TABLE person ( 
id BIGINT AUTO_INCREMENT PRIMARY KEY,
type_document_id BIGINT,
document_number VARCHAR(50) UNIQUE,
first_name VARCHAR(100),
middle_name VARCHAR(100),
last_name VARCHAR(100),
second_last_name VARCHAR(100),
email VARCHAR(150),
phone VARCHAR(150),
	birth_date DATE
 );
 
 
 CREATE TABLE role (
 id BIGINT AUTO_INCREMENT PRIMARY KEY,
 person_id BIGINT UNIQUE,
 username VARCHAR(100) UNIQUE,
 password_hash VARCHAR(255),
 last_login_at DATETIME,
 FOREIGN KEY (person_id) REFERENCES person(id)
 );
 
 
 CREATE TABLE role (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE,
    name VARCHAR(100),
    description TEXT
);

CREATE TABLE module (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50),
    name VARCHAR(100),
    description TEXT,
    route VARCHAR(200),
    icon VARCHAR(100),
    order_index INT
);

CREATE TABLE app_view (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    module_id BIGINT,
    code VARCHAR(50),
    name VARCHAR(100),
    description TEXT,
    route VARCHAR(200),
    order_index INT,
    FOREIGN KEY (module_id) REFERENCES module(id)
);

CREATE TABLE user_role (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_account_id BIGINT,
    role_id BIGINT,
    start_date DATE,
    end_date DATE,
    UNIQUE(user_account_id, role_id),
    FOREIGN KEY (user_account_id) REFERENCES user_account(id),
    FOREIGN KEY (role_id) REFERENCES role(id)
);

CREATE TABLE role_module (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    role_id BIGINT,
    module_id BIGINT,
    UNIQUE(role_id, module_id),
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (module_id) REFERENCES module(id)
);

CREATE TABLE module_view (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    module_id BIGINT,
    app_view_id BIGINT,
    UNIQUE(module_id, app_view_id),
    FOREIGN KEY (module_id) REFERENCES module(id),
    FOREIGN KEY (app_view_id) REFERENCES app_view(id)
);
 
 
 CREATE TABLE continent (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(10),
    name VARCHAR(100),
    description TEXT
);

CREATE TABLE country (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    continent_id BIGINT,
    code VARCHAR(10),
    name VARCHAR(100),
    iso_code VARCHAR(10),
    phone_code VARCHAR(10),
    FOREIGN KEY (continent_id) REFERENCES continent(id)
);

CREATE TABLE department (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    country_id BIGINT,
    code VARCHAR(10),
    name VARCHAR(100),
    FOREIGN KEY (country_id) REFERENCES country(id)
);

CREATE TABLE city (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    department_id BIGINT,
    code VARCHAR(10),
    name VARCHAR(100),
    postal_code VARCHAR(20),
    FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE address (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    city_id BIGINT,
    line_1 VARCHAR(255),
    line_2 VARCHAR(255),
    reference VARCHAR(255),
    zip_code VARCHAR(20),
    latitude DECIMAL(10,6),
    longitude DECIMAL(10,6),
    FOREIGN KEY (city_id) REFERENCES city(id)
);
 
 
 CREATE TABLE type_document (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20),
    name VARCHAR(100)
);

CREATE TABLE payment_method (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20),
    name VARCHAR(100)
);

CREATE TABLE order_status (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20),
    name VARCHAR(100)
);

CREATE TABLE payment_status (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20),
    name VARCHAR(100)
);

CREATE TABLE shipment_status (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20),
    name VARCHAR(100)
);

CREATE TABLE file (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(255),
    file_path VARCHAR(255),
    mime_type VARCHAR(100),
    size INT
);


CREATE TABLE customer (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    person_id BIGINT UNIQUE,
    customer_code VARCHAR(50),
    loyalty_points INT DEFAULT 0,
    FOREIGN KEY (person_id) REFERENCES person(id)
);

CREATE TABLE customer_address (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT,
    address_id BIGINT,
    is_default BOOLEAN,
    address_type VARCHAR(50),
    FOREIGN KEY (customer_id) REFERENCES customer(id),
    FOREIGN KEY (address_id) REFERENCES address(id)
);


CREATE TABLE supplier (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    person_id BIGINT UNIQUE,
    supplier_code VARCHAR(50),
    contact_name VARCHAR(100),
    contact_email VARCHAR(100),
    contact_phone VARCHAR(50),
    FOREIGN KEY (person_id) REFERENCES person(id)
);

CREATE TABLE supplier_address (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    supplier_id BIGINT,
    address_id BIGINT,
    is_default BOOLEAN,
    address_type VARCHAR(50),
    FOREIGN KEY (supplier_id) REFERENCES supplier(id),
    FOREIGN KEY (address_id) REFERENCES address(id)
);

CREATE TABLE supplier_product (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    supplier_id BIGINT,
    product_id BIGINT,
    purchase_price DECIMAL(10,2),
    lead_time_days INT,
    is_primary BOOLEAN,
    UNIQUE(supplier_id, product_id),
    FOREIGN KEY (supplier_id) REFERENCES supplier(id)
);


CREATE TABLE category (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    parent_category_id BIGINT,
    name VARCHAR(100),
    FOREIGN KEY (parent_category_id) REFERENCES category(id)
);

CREATE TABLE brand (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100)
);

CREATE TABLE product (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT,
    brand_id BIGINT,
    name VARCHAR(100),
    sku VARCHAR(50),
    barcode VARCHAR(50),
    price DECIMAL(10,2),
    cost DECIMAL(10,2),
    weight DECIMAL(10,2),
    FOREIGN KEY (category_id) REFERENCES category(id),
    FOREIGN KEY (brand_id) REFERENCES brand(id)
);

CREATE TABLE product_image (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT,
    file_id BIGINT,
    url VARCHAR(255),
    is_main BOOLEAN,
    FOREIGN KEY (product_id) REFERENCES product(id),
    FOREIGN KEY (file_id) REFERENCES file(id)
);

CREATE TABLE stock (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT UNIQUE,
    quantity_available INT,
    quantity_reserved INT,
    FOREIGN KEY (product_id) REFERENCES product(id)
);

CREATE TABLE inventory_movement (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT,
    movement_type VARCHAR(10),
    quantity INT,
    unit_cost DECIMAL(10,2),
    reference_type VARCHAR(50),
    reference_id BIGINT,
    movement_date DATETIME,
    FOREIGN KEY (product_id) REFERENCES product(id)
);


CREATE TABLE cart (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT,
    opened_at DATETIME,
    closed_at DATETIME,
    total_amount DECIMAL(10,2),
    FOREIGN KEY (customer_id) REFERENCES customer(id)
);

CREATE TABLE cart_item (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cart_id BIGINT,
    product_id BIGINT,
    quantity INT,
    unit_price DECIMAL(10,2),
    subtotal DECIMAL(10,2),
    FOREIGN KEY (cart_id) REFERENCES cart(id),
    FOREIGN KEY (product_id) REFERENCES product(id)
);

CREATE TABLE `order` (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT,
    order_status_id BIGINT,
    billing_address_id BIGINT,
    shipping_address_id BIGINT,
    order_date DATETIME,
    total_amount DECIMAL(10,2),
    FOREIGN KEY (customer_id) REFERENCES customer(id),
    FOREIGN KEY (order_status_id) REFERENCES order_status(id)
);

CREATE TABLE order_item (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT,
    product_id BIGINT,
    quantity INT,
    unit_price DECIMAL(10,2),
    total_amount DECIMAL(10,2),
    FOREIGN KEY (order_id) REFERENCES `order`(id),
    FOREIGN KEY (product_id) REFERENCES product(id)
);

CREATE TABLE payment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT,
    payment_method_id BIGINT,
    payment_status_id BIGINT,
    amount DECIMAL(10,2),
    payment_date DATETIME,
    FOREIGN KEY (order_id) REFERENCES `order`(id),
    FOREIGN KEY (payment_method_id) REFERENCES payment_method(id),
    FOREIGN KEY (payment_status_id) REFERENCES payment_status(id)
);

CREATE TABLE shipment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT,
    shipment_status_id BIGINT,
    address_id BIGINT,
    shipment_date DATETIME,
    FOREIGN KEY (order_id) REFERENCES `order`(id),
    FOREIGN KEY (shipment_status_id) REFERENCES shipment_status(id),
    FOREIGN KEY (address_id) REFERENCES address(id)
);

CREATE TABLE invoice (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNIQUE,
    issue_date DATETIME,
    total_amount DECIMAL(10,2),
    FOREIGN KEY (order_id) REFERENCES `order`(id)
);