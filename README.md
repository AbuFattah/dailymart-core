# NestJS E-Commerce API

## Description

This is a comprehensive and scalable E-Commerce API built with NestJS, following SOLID and clean code principles and leveraging a modular design for ease of maintenance and extensibility. The system combines PostgreSQL and MongoDB to optimize data storage and management while integrating Redis for caching and BullMQ for asynchronous task processing.

CI/CD pipelines will be implemented in the near future to automate testing, integration, and deployment. Additionally, Kubernetes will be used to manage containerized deployments, ensuring scalability and reliability in production environments.

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

- **Department, Category and Subcategory Creation**: Manage hierarchical categories stored in MongoDB.
- **Category Updates**: Asynchronous updates to maintain consistency in product records.

### **Inventory Management**

- **Stock Tracking**: Monitor stock levels for products.
- **Stock History Processing**: Use BullMQ to handle inventory updates asynchronously, optimizing performance.

### **Order Management**

- **Order Placement**: Create new orders.
- **Order History**: View past orders.
- **Order Tracking**: Track the status of current orders.
- **Order Cancellation/Returns**: Handle order modifications and returns and update inventory accordingly.

### **Shopping Cart**

- **Cart Management**: Add, update, or remove items from the cart. Users can store items in the cart even without logging in, and once logged in, the local cart will automatically merge with the user’s existing cart.
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

---

## Set Up Local Development Environment Using Docker compose

```bash
# Set Up Local development environment
$ docker compose up
```

## Project setup

```bash
$ yarn install
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

---

## Stay in touch

- Author - [Abu Fattah Hossain](https://www.linkedin.com/in/abufattahnahid/)

## License

MIT License
