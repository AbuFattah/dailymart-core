# NestJS E-Commerce API

## Table of Contents

- [Running The Application using docker compose](#running-the-application-using-docker-compose)
- [Features](#features)
  - [User Management](#user-management)
  - [Product Management](#product-management)
  - [Category Management](#category-management)
  - [Inventory Management](#inventory-management)
  - [Order Management](#order-management)
  - [Payment Processing](#payment-processing)
  - [Shopping Cart](#shopping-cart)
  - [Search and Filtering](#search-and-filtering)
- [Architecture Highlights](#architecture-highlights)

---

## Description

This is a comprehensive and scalable E-Commerce API built with NestJS, following clean code principles and leveraging a modular design for ease of maintenance and extensibility. The system combines PostgreSQL and MongoDB to optimize data storage and management while integrating Redis for caching and BullMQ for asynchronous task processing.

---

## Running The Application using docker compose

`yarn/npm install`

`docker compose up`

---

## Features

### **User Management**

- **User Registration**: Create new user accounts.
- **User Login/Logout**: Secure authentication and session management.
- **User Profile Management**: View and update user details.
- **Password Reset**: Securely reset forgotten passwords.
- **Role Management**: Manage user roles (e.g., Admin, Customer).

### **Product Management**

- **Product Creation**: Add new products to the store.
- **Product Listing**: View a paginated list of products.
- **Product Details**: Fetch detailed product information.
- **Product Update/Delete**: Modify or remove products.

### **Category Management**

- **Category and Subcategory Creation**: Manage hierarchical categories stored in MongoDB.
- **Category Updates**: Asynchronous updates to maintain consistency in product records.

### **Inventory Management**

- **Stock Tracking**: Monitor stock levels for products.
- **Stock History Processing**: Use BullMQ to handle inventory updates asynchronously, optimizing performance.

### **Order Management**

- **Order Placement**: Create new orders.
- **Order History**: View past orders.
- **Order Tracking**: Track the status of current orders.
- **Order Cancellation/Returns**: Handle order modifications and returns.

### **Payment Processing**

- **Integration with Payment Gateways**: Support for Stripe, PayPal, and more.
- **Payment Confirmation**: Verify successful payments.
- **Refund Management**: Process and track refunds.

### **Shopping Cart**

- **Cart Management**: Add, update, or remove items from the cart.
- **Cart Summary**: View current cart details, including total cost.
- **Checkout Process**: Seamless checkout experience.

### **Search and Filtering**

- **Product Search**: Quickly find products by name or description.
- **Product Filtering**: Narrow down products by category, price, rating, and more.

---

## Architecture Highlights

- **Polyglot Persistence**:
  - PostgreSQL for relational data like users, orders, and products.
  - MongoDB for managing hierarchical category data.
- **Caching with Redis**: Enhances performance by reducing redundant API calls for frequently accessed data.
- **Event-Driven Design**: Promotes eventual consistency through asynchronous updates.
- **Task Processing with BullMQ**: Efficiently handles background tasks like stock history updates and category name synchronization.
- **Modular Design**: Each feature is encapsulated in its module, promoting scalability and maintainability.
