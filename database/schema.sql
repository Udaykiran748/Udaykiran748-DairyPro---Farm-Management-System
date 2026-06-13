-- Dairy Farm Management Database Schema
-- Run this script in MySQL Workbench to manually create the tables.
-- Alternatively, the Sequelize ORM handles auto-syncing if `sync({ alter: true })` or `sync({ force: true })` is used.

CREATE DATABASE IF NOT EXISTS dairyfarm;
USE dairyfarm;

-- Users Table
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'farmer', 'worker', 'accountant') DEFAULT 'farmer',
    phone VARCHAR(50),
    avatar VARCHAR(255) DEFAULT '',
    isActive BOOLEAN DEFAULT TRUE,
    lastLogin DATETIME,
    resetPasswordOTP VARCHAR(255),
    resetPasswordOTPExpire DATETIME,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Animals Table
CREATE TABLE IF NOT EXISTS Animals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    animalId VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    type ENUM('Cow', 'Buffalo') DEFAULT 'Cow',
    breed VARCHAR(100) NOT NULL,
    age FLOAT NOT NULL,
    weight FLOAT,
    gender ENUM('Female', 'Male') DEFAULT 'Female',
    isPregnant BOOLEAN DEFAULT FALSE,
    pregnancyDate DATETIME,
    milkCapacity FLOAT DEFAULT 0,
    purchaseDate DATETIME,
    purchasePrice FLOAT,
    healthStatus ENUM('Excellent', 'Good', 'Fair', 'Poor', 'Sick') DEFAULT 'Good',
    image VARCHAR(255) DEFAULT '',
    notes TEXT,
    isActive BOOLEAN DEFAULT TRUE,
    addedBy INT,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (addedBy) REFERENCES Users(id) ON DELETE SET NULL
);

-- MilkRecords Table
CREATE TABLE IF NOT EXISTS MilkRecords (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    morningMilk FLOAT DEFAULT 0,
    eveningMilk FLOAT DEFAULT 0,
    totalMilk FLOAT DEFAULT 0,
    quality ENUM('A+', 'A', 'B', 'C') DEFAULT 'A',
    fatContent FLOAT,
    notes TEXT,
    animalIdRef INT,
    recordedBy INT,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (animalIdRef) REFERENCES Animals(id) ON DELETE SET NULL,
    FOREIGN KEY (recordedBy) REFERENCES Users(id) ON DELETE SET NULL
);

-- HealthRecords Table
CREATE TABLE IF NOT EXISTS HealthRecords (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('Vaccination', 'Treatment', 'Check-up', 'Surgery', 'Deworming') NOT NULL,
    date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    description TEXT NOT NULL,
    doctor VARCHAR(255),
    medicines JSON,
    cost FLOAT DEFAULT 0,
    nextDueDate DATETIME,
    status ENUM('Completed', 'Ongoing', 'Scheduled') DEFAULT 'Completed',
    notes TEXT,
    animalIdRef INT,
    recordedBy INT,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (animalIdRef) REFERENCES Animals(id) ON DELETE SET NULL,
    FOREIGN KEY (recordedBy) REFERENCES Users(id) ON DELETE SET NULL
);

-- FeedRecords Table
CREATE TABLE IF NOT EXISTS FeedRecords (
    id INT AUTO_INCREMENT PRIMARY KEY,
    feedType VARCHAR(255) NOT NULL,
    quantity FLOAT NOT NULL,
    unit ENUM('kg', 'g', 'litre') DEFAULT 'kg',
    time VARCHAR(100) NOT NULL,
    animals JSON,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    recordedBy INT,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (recordedBy) REFERENCES Users(id) ON DELETE SET NULL
);

-- FeedInventories Table
CREATE TABLE IF NOT EXISTS FeedInventories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    feedType VARCHAR(255) NOT NULL,
    currentStock FLOAT NOT NULL DEFAULT 0,
    unit ENUM('kg', 'quintal', 'bag') DEFAULT 'kg',
    minStock FLOAT DEFAULT 50,
    pricePerUnit FLOAT,
    supplier VARCHAR(255),
    lastRestocked DATETIME,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inventories Table
CREATE TABLE IF NOT EXISTS Inventories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    itemName VARCHAR(255) NOT NULL,
    category ENUM('Feed', 'Medicine', 'Equipment', 'Tools', 'Other') NOT NULL,
    quantity FLOAT NOT NULL DEFAULT 0,
    unit VARCHAR(100) NOT NULL,
    minQuantity FLOAT DEFAULT 5,
    pricePerUnit FLOAT,
    supplier VARCHAR(255),
    expiryDate DATETIME,
    location VARCHAR(255),
    lastUpdated DATETIME DEFAULT CURRENT_TIMESTAMP,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Expenses Table
CREATE TABLE IF NOT EXISTS Expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category ENUM('Feed', 'Medicine', 'Salary', 'Electricity', 'Water', 'Maintenance', 'Equipment', 'Other') NOT NULL,
    amount FLOAT NOT NULL,
    date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    description TEXT NOT NULL,
    paidTo VARCHAR(255),
    paymentMode ENUM('Cash', 'Online', 'Cheque') DEFAULT 'Cash',
    receipt VARCHAR(255),
    recordedBy INT,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (recordedBy) REFERENCES Users(id) ON DELETE SET NULL
);

-- Customers Table
CREATE TABLE IF NOT EXISTS Customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customerId VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    type ENUM('Retail', 'Wholesale', 'Cooperative') DEFAULT 'Retail',
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    dailyQuantity FLOAT DEFAULT 0,
    ratePerLitre FLOAT NOT NULL,
    pendingAmount FLOAT DEFAULT 0,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sales Table
CREATE TABLE IF NOT EXISTS Sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    quantity FLOAT NOT NULL,
    ratePerLitre FLOAT NOT NULL,
    totalAmount FLOAT NOT NULL,
    paidAmount FLOAT DEFAULT 0,
    pendingAmount FLOAT DEFAULT 0,
    paymentMode ENUM('Cash', 'Online', 'Credit') DEFAULT 'Cash',
    paymentStatus ENUM('Paid', 'Pending', 'Partial') DEFAULT 'Pending',
    invoiceNo VARCHAR(100),
    notes TEXT,
    customerIdRef INT,
    recordedBy INT,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customerIdRef) REFERENCES Customers(id) ON DELETE SET NULL,
    FOREIGN KEY (recordedBy) REFERENCES Users(id) ON DELETE SET NULL
);

-- Employees Table
CREATE TABLE IF NOT EXISTS Employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employeeId VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    salary FLOAT NOT NULL,
    joinDate DATETIME NOT NULL,
    isActive BOOLEAN DEFAULT TRUE,
    avatar VARCHAR(255) DEFAULT '',
    tasks JSON,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Attendances Table
CREATE TABLE IF NOT EXISTS Attendances (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATETIME NOT NULL,
    status ENUM('Present', 'Absent', 'Half-day', 'Leave') NOT NULL,
    checkIn VARCHAR(50),
    checkOut VARCHAR(50),
    notes TEXT,
    employeeIdRef INT,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employeeIdRef) REFERENCES Employees(id) ON DELETE SET NULL
);
