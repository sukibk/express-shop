# Shop App with Node.js and MongoDB

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/language-JavaScript-blue.svg)]((https://developer.mozilla.org/))
[![CSS](https://img.shields.io/badge/style-CSS-blueviolet.svg)]((https://www.w3schools.com/css/))
[![Node.js](https://img.shields.io/badge/environment-Node.js-orange.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/framework-Express.js-orange.svg)](https://expressjs.com/)
[![Mongodb](https://img.shields.io/badge/database-Mongodb-green.svg)](https://mongodb.com/)

Welcome to the Shop App, a versatile e-commerce application built using Node.js and MongoDB. This app allows users to create accounts, log in, add new products, manage their shopping carts, and create orders. This README file will provide you with an overview of the app's features and instructions on how to set it up.

## Features

### User Authentication
- **User Registration**: Users can create accounts by providing their email address and password.
- **User Login**: Registered users can log in using their credentials to access the app's features.

### Product Management
- **Add New Products**: Admin users can add new products to the store by providing product details such as name, description, price, and an optional image.
- **Edit and Delete Products**: Admins can also edit or remove products from the catalog.

### Shopping Cart
- **Add to Cart**: Users can add products to their shopping cart, specifying the quantity they wish to purchase.
- **Remove from Cart**: Items can be removed from the cart if the user changes their mind.
- **View Cart**: Users can view the contents of their cart, including the total price of the items.
- **Adjust Quantities**: Users can modify the quantity of products in their cart.

### Order Creation
- **Create Orders**: Once users are satisfied with their cart, they can proceed to create an order, specifying their shipping address and payment details.
- **View Order History**: Users can view their order history and the status of their previous orders.

## Getting Started

Follow these steps to set up the Shop App on your local machine:

1. **Prerequisites**
    - Node.js: Make sure you have Node.js installed. You can download it from [https://nodejs.org/](https://nodejs.org/).
    - MongoDB: Install and run a MongoDB server. You can get MongoDB from [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community).

2. **Clone the Repository**

   git clone https://github.com/your-username/shop-app.git
   cd shop-app



3. **Install Dependencies**

   npm install


4. **Set Environment Variables**
- Create a `.env` file in the project root and set the following environment variables:
    - `MONGODB_URI`: MongoDB connection URI.
    - `SESSION_SECRET`: A secret key for user authentication.


5. **Start the Application**

   npm start



6. **Access the App**
- Open your web browser and navigate to `http://localhost:3000` to access the Shop App.

## Usage

1. **User Registration**
- Create a new user account by registering with your email and password.

2. **Product Management**
- If you're an admin user, log in and go to the admin panel to add, edit, or delete products.

3. **Shopping**
- Browse the catalog and add products to your cart.
- View and manage your cart.
- Proceed to checkout and create orders.

4. **Order History**
- View your order history and check the status of your orders.

## Contributors

- [Marko Sudar](https://github.com/sukibk)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

We would like to acknowledge the following open-source libraries and tools used to build this app:

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose.js](https://mongoosejs.com/)

App should not be as a commercial purpose, as it is not production ready.

Happy shopping!
