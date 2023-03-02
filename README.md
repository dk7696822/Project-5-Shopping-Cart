# Project-5-Shopping-Cart

# Products-Management

Running <br />
npm install<br />
npm start<br />
open browser at http://localhost:3000 <br />

Libraries used in this project:<br />
   Express (for starting the server)<br />
   Mongoose (ODM)<br />
   bcyrpt (for encrypting password)<br />
   JWT (for authentication and authorization)<br />

Database used: MongoDB for storing, organizing and retrieval of data<br />

AWS S3 for storing images<br />

This project is divided into 4 features namely User, Product, Cart and Order. <br />

User model looks like this<br />

{
fname: {string, mandatory},<br />
lname: {string, mandatory},<br />
email: {string, mandatory, valid email, unique},<br />
profileImage: {string, mandatory}, // s3 link<br />
phone: {string, mandatory, unique, valid Indian mobile number},<br />
password: {string, mandatory, minLen 8, maxLen 15}, // encrypted password<br />
address: {<br />
shipping: {<br />
street: {string, mandatory},<br />
city: {string, mandatory},<br />
pincode: {number, mandatory}<br />
},<br />
billing: {<br />
street: {string, mandatory},<br />
city: {string, mandatory},<br />
pincode: {number, mandatory}<br />
}<br />
},<br />

The image will be uploaded to S3, and it's URL will be stored in user document <br />

The password is encrypted and saved in the database, the library used for encryption is bcrypt library.<br />

Once registered, user can login using /login route by providing email and password in the request body.<br />

Authentication and authorization is managed using JWT token <br />

Following response is sent once the user is successfully logged in<br />

{
"status": true,<br />
"message": "User login successfull",<br />
"data": {<br />
"userId": "6165f29cfe83625cf2c10a5c"<br />,
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTYyODc2YWJkY2I3MGFmZWVhZjljZjUiLCJpYXQiOjE2MzM4NDczNzYsImV4cCI6MTYzMzg4MzM3Nn0.PgcBPLLg4J01Hyin-<br />zR6BCk7JHBY-RpuWMG_oIK7aV8"<br />
}<br />
}<br />

User can fetch details of his/her profile from the following route GET /user/:userId/profile<br />
The user has to be authenticated to see the profile<br />

On success, the response looks like this<br />
{
"status": true,<br />
"message": "User profile details",<br />
"data": {<br />
"address": {<br />
"shipping": {<br />
"street": "MG Road",<br />
"city": "Indore",<br />
"pincode": 452001<br />
},
"billing": {<br />
"street": "MG Road",<br />
"city": "Indore",<br />
"pincode": 452001<br />
}<br />
},<br />
"\_id": "6162876abdcb70afeeaf9cf5",<br />
"fname": "John",<br />
"lname": "Doe",<br />
"email": "johndoe@mailinator.com",<br />
"profileImage": "https://classroom-training-bucket.s3.ap-south-1.amazonaws.com/user/copernico-p_kICQCOM4s-unsplash.jpg",<br />
"phone": 9876543210,<br />
"createdAt": "2021-10-10T06:25:46.051Z",<br />
"updatedAt": "2021-10-10T06:25:46.051Z",<br />
"**v": 0
}
}

User can update his profile from the following route PUT /user/:userId/profile<br />
<br />
User needs to be authenticated and authorized to perform this action<br />


FEATURE 2: <br />
Product Model looks like this
{<br />
title: {string, mandatory, unique},<br />
description: {string, mandatory},<br />
price: {number, mandatory, valid number/decimal},<br />
currencyId: {string, mandatory, INR},<br />
currencyFormat: {string, mandatory, Rupee symbol}<br />,<br />
isFreeShipping: {boolean, default: false},<br />
productImage: {string, mandatory}, // s3 link<br />
style: {string},
availableSizes: {array of string, at least one size, enum["S", "XS","M","X", "L","XXL", "XL"]},<br />
installments: {number},<br />
deletedAt: {Date, when the document is deleted},<br />
isDeleted: {boolean, default: false},<br />
createdAt: {timestamp},<br />
updatedAt: {timestamp},<br />
}

To add the products, user has to pass data in request body to POST /products<br />

To check the available products, GET /products<br />
Returns all products in the collection that aren't deleted.<br />
Filters
Size (The key for this filter will be 'size')<br />
Product name (The key for this filter will be 'name'). You should return all the products with name containing the substring recieved in this filter<br />
Price : greater than or less than a specific value. The keys are 'priceGreaterThan' and 'priceLessThan'.<br />
NOTE: For price filter request could contain both or any one of the keys. For example the query in the request could look like { priceGreaterThan: 500, priceLessThan: 2000 } or just { priceLessThan: 1000 } )<br />

Sort
Sorted by product price in ascending or descending. The key value pair will look like {priceSort : 1} or {priceSort : -1} eg /products?size=XL&name=Nit%20grit<br />

To get details of particular product by product ID GET /products/:productId<br />
Returns product details by product id<br />

To update the product PUT /products/:productId<br />
Updates a product by changing at least one or all fields<br />
Check if the productId exists (must have isDeleted false and is present in collection).<br />
To delete a product DELETE /products/:productId<br />
Deletes a product by product id if it's not already deleted<br />

FEATURE 3<br />

Cart Model looks like this<br />
{
userId: {ObjectId, refs to User, mandatory, unique},<br />
items: [{
productId: {ObjectId, refs to Product model, mandatory},<br />
quantity: {number, mandatory, min 1}<br />
}],
totalPrice: {number, mandatory, comment: "Holds total price of all the items in the cart"},<br />
totalItems: {number, mandatory, comment: "Holds total number of items in the cart"},<br />
createdAt: {timestamp},<br />
updatedAt: {timestamp},<br />
}
Cart APIs (authentication required as authorization header - bearer token)<br />
To add the product to the cart POST /users/:userId/cart (Add to cart)<br />
If the user doesn't have a cart, a new cart will be created, else the products will be added to the pre-existing cart<br />

Get cart id in request body.<br />
Get productId in request body.<br />
Make sure that cart exist.<br />
Add a product(s) for a user in the cart.<br />
Make sure the userId in params and in JWT token match.<br />
Make sure the user exist<br />
Make sure the product(s) are valid and not deleted.<br />
Get product(s) details in response body.<br />
Response format<br />
On success - Return HTTP status 201. Also return the cart document. The response should be a JSON object like this<br />
On error - Return a suitable error message with a valid HTTP status code. The response should be a JSON object like this<br />

PUT /users/:userId/cart (Remove product / Reduce a product's quantity from the cart)<br />
Updates a cart by either decrementing the quantity of a product by 1 or deleting a product from the cart.<br />
Get cart id in request body.<br />
Get productId in request body.<br />
Get key 'removeProduct' in request body.<br />
Make sure that cart exist.<br />
Key 'removeProduct' denotes whether a product is to be removed({removeProduct: 0}) or its quantity has to be decremented by 1({removeProduct: 1}).<br />
Make sure the userId in params and in JWT token match.<br />
Make sure the user exist<br />
Get product(s) details in response body.<br />
Check if the productId exists and is not deleted before updating the cart.<br />
Response format<br />
On success - Return HTTP status 200. Also return the updated cart document. The response should be a JSON object like this<br />
On error - Return a suitable error message with a valid HTTP status code. The response should be a JSON object like this<br />
<br />
GET /users/:userId/cart<br />
Returns cart summary of the user.<br />
Make sure that cart exist.<br />
Make sure the userId in params and in JWT token match.<br />
Make sure the user exist<br />
Get product(s) details in response body.<br />
Response format<br />
On success - Return HTTP status 200. Return the cart document. The response should be a JSON object like this<br />
On error - Return a suitable error message with a valid HTTP status code. The response should be a JSON object like this<br />
DELETE /users/:userId/cart<br />
Deletes the cart for the user.<br />
Make sure that cart exist.<br />
Make sure the userId in params and in JWT token match.<br />
Make sure the user exist<br />
cart deleting means array of items is empty, totalItems is 0, totalPrice is 0.<br />
Response format
On success - Return HTTP status 204. Return a suitable message. The response should be a JSON object like this
On error - Return a suitable error message with a valid HTTP status code. The response should be a JSON object like this
FEATURE IV - Order
Models
Order Model
{
userId: {ObjectId, refs to User, mandatory},
items: [{
productId: {ObjectId, refs to Product model, mandatory},
quantity: {number, mandatory, min 1}
}],
totalPrice: {number, mandatory, comment: "Holds total price of all the items in the cart"},
totalItems: {number, mandatory, comment: "Holds total number of items in the cart"},
totalQuantity: {number, mandatory, comment: "Holds total number of quantity in the cart"},
cancellable: {boolean, default: true},
status: {string, default: 'pending', enum[pending, completed, cancled]},
deletedAt: {Date, when the document is deleted},
isDeleted: {boolean, default: false},
createdAt: {timestamp},
updatedAt: {timestamp},
}
Checkout/Order APIs (Authentication and authorization required)
POST /users/:userId/orders
Create an order for the user
Make sure the userId in params and in JWT token match.
Make sure the user exist
Get cart details in the request body
Response format
On success - Return HTTP status 200. Also return the order document. The response should be a JSON object like this
On error - Return a suitable error message with a valid HTTP status code. The response should be a JSON object like this
PUT /users/:userId/orders
Updates an order status
Make sure the userId in params and in JWT token match.
Make sure the user exist
Get order id in request body
Make sure the order belongs to the user
Make sure that only a cancellable order could be canceled. Else send an appropriate error message and response.
Response format
On success - Return HTTP status 200. Also return the updated order document. The response should be a JSON object like this
On error - Return a suitable error message with a valid HTTP status code. The response should be a JSON object like this
Testing
To test these apis create a new collection in Postman named Project 5 Shopping Cart
Each api should have a new request in this collection
Each request in the collection should be rightly named. Eg Create user, Create product, Get products etc
Each member of each team should have their tests in running state
Refer below sample A Postman collection and request sample

Response
Successful Response structure
{
status: true,
message: 'Success',
data: {

}
}
Error Response structure
{
status: false,
message: ""
}
Collections
users
{
\_id: ObjectId("88abc190ef0288abc190ef02"),
fname: 'John',
lname: 'Doe',
email: 'johndoe@mailinator.com',
profileImage: 'http://function-up-test.s3.amazonaws.com/users/user/johndoe.jpg', // s3 link
phone: 9876543210,
password: '$2b$10$O.hrbBPCioVm237nAHYQ5OZy6k15TOoQSFhTT.recHBfQpZhM55Ty', // encrypted password
address: {
shipping: {
street: "110, Ridhi Sidhi Tower",
city: "Jaipur",
pincode: 400001
}, {mandatory}
billing: {
street: "110, Ridhi Sidhi Tower",
city: "Jaipur",
pincode: 400001
}
},
createdAt: "2021-09-17T04:25:07.803Z",
updatedAt: "2021-09-17T04:25:07.803Z",
}
products
{
\_id: ObjectId("88abc190ef0288abc190ef55"),
title: 'Nit Grit',
description: 'Dummy description',
price: 23.0,
currencyId: 'INR',
currencyFormat: '₹',
isFreeShipping: false,
productImage: 'http://function-up-test.s3.amazonaws.com/products/product/nitgrit.jpg', // s3 link
style: 'Colloar',
availableSizes: ["S", "XS","M","X", "L","XXL", "XL"],
installments: 5,
deletedAt: null,
isDeleted: false,
createdAt: "2021-09-17T04:25:07.803Z",
updatedAt: "2021-09-17T04:25:07.803Z",
}
carts
{
"\_id": ObjectId("88abc190ef0288abc190ef88"),
userId: ObjectId("88abc190ef0288abc190ef02"),
items: [{
productId: ObjectId("88abc190ef0288abc190ef55"),
quantity: 2
}, {
productId: ObjectId("88abc190ef0288abc190ef60"),
quantity: 1
}],
totalPrice: 50.99,
totalItems: 2,
createdAt: "2021-09-17T04:25:07.803Z",
updatedAt: "2021-09-17T04:25:07.803Z",
}
orders
{
"\_id": ObjectId("88abc190ef0288abc190ef88"),
userId: ObjectId("88abc190ef0288abc190ef02"),
items: [{
productId: ObjectId("88abc190ef0288abc190ef55"),
quantity: 2
}, {
productId: ObjectId("88abc190ef0288abc190ef60"),
quantity: 1
}],
totalPrice: 50.99,
totalItems: 2,
totalQuantity: 3,
cancellable: true,
status: 'pending'
createdAt: "2021-09-17T04:25:07.803Z",
updatedAt: "2021-09-17T04:25:07.803Z",
}
