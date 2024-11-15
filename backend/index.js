const express = require('express')
const app = express()
const cors = require('cors')
const { ObjectId } = require('mongodb')

const mongoose = require('mongoose')
const { User, Product, Cart, Order } = require('./models')
const DummyProducts = require('./store/Products/ProductsDummy.js')


app.use(express.json())
app.use(cors())

const mongoURL = 'mongodb://localhost:27017/ecommapp'

function RoundNumber(num) {

    return Math.round((num + Number.EPSILON) * 100) / 100
}

function calcNewCartDetails(cartArray, Product, quantity, price) {

    const objID = new ObjectId(Product)

    // const finditem = cart.products.find((product) => product.product.equals(objID))
    // calc cart without Product
    let CartSize = cartArray.reduce((total, item, i, arr) => {
        if (item.product.equals(objID))
            return total

        return total + item.quantity
    }, 0)

    let subtotal = cartArray.reduce((total, item, i, arr) => {
        if (item.product.equals(objID))
            return total

        return total + item.itemSubtotal
    }, 0)


    if (quantity !== 0) {
        CartSize = CartSize + quantity
        subtotal = subtotal + (quantity * price)
    }

    return [CartSize, RoundNumber(subtotal)]
        // add new Product calc 
}

async function checkIfProductCollectionExists() {
    try {
        // Wait for Mongoose to connect to the database
        const ProductsData = await Product.findOne()
        console.log("check if product exist", ProductsData)
        if (!ProductsData) {
            DummyProducts.forEach(async(item) => {
                const NewEntry = new Product(item)
                await NewEntry.save()
            })
        }
    } catch (error) {
        console.error('Error checking for Product collection:', error.message);
    }
}
mongoose.connect(mongoURL)
    .then(() => {
        console.log('Successfully connected to MongoDB');
        console.log(mongoose.modelNames())
        checkIfProductCollectionExists()
    })
    .catch((error) => {
        console.error('Failed to connect to MongoDB:', error.message);
        process.exit(1); // Exit process if DB connection fails
    });


//  SignUp 
app.post('/signup', async(req, res) => {
    const { username, email, password } = req.body;

    console.log('signup called', username, email, password)
    try {
        // Check if the user already exists in the database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Hash the password before saving


        // Create a new user
        const newUser = new User({
            username,
            email,
            password: password
        });

        // Save the new user to the database
        await newUser.save();

        // Return the user object (excluding password) as response
        const { password: _, ...userWithoutPassword } = newUser.toObject();
        res.status(201).json(userWithoutPassword);

    } catch (error) {
        console.error('Error in SignUp:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// SignIn
app.post('/signin', async(req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        // Validate password
        const isPasswordValid = user.password === password
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Return the user object (excluding password) as response
        const { password: _, ...userWithoutPassword } = user.toObject();
        res.status(200).json(userWithoutPassword);

    } catch (error) {
        console.error('Error in SignIn:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


app.get('/getCategories', async(req, res) => {

    const categories = []

    DummyProducts.forEach((item) => {

        const categoryExist = categories.find((category) => category === item.keyword)
        if (!categoryExist) {
            categories.push(item.keyword)
        }
    })

    res.json({ result: categories })
})

// GetProducts
app.get('/getallproducts/', async(req, res) => {

    const PAGE_SIZE = 8;
    const { page, keyword, text, order, id } = req.query

    console.log(page, keyword, text, order, id)


    const AllProducts = await Product.find({})
        // keyword filter
    const filteredData = AllProducts
        .filter((item) => {
            // filter id
            if (id) {
                return item.id !== parseInt(id)

            } else return true

        })
        .filter((item) => {
            // filter keyword
            if (keyword) {
                return item.keyword === keyword

            } else return true

        }).filter((item) => {
            // filter Name
            if (text) {
                return item.name.toLowerCase().includes(text.toLowerCase())

            } else return true

        })


    if (order) {
        filteredData.sort((a, b) => {
            if (order === "rating-") {
                return a.rating - b.rating
            } else if (order === "rating+") {
                return (a.rating - b.rating) * -1
            } else if (order === "price+") {
                return (a.price - b.price) * -1
            } else if (order === "price-") {
                return (a.rating - b.rating)
            }
        })
    }

    res.json({ result: filteredData })

})

//getProductDetails
app.get('/getproductdetails/:id', async(req, res) => {

        const ID = parseInt(req.params['id'])

        const data = await Product.findOne({ id: ID })
        console.log(data)
        if (data) {
            res.json(data)

        } else
            res.status(404).send('No Product with this ID')

    })
    //getSimilarProducts
app.get('/similarproducts/:keyword', (req, res) => {

})

//getProfileData
app.get('/profile/:email', (req, res) => {

})

//UpdateProfile
app.post('/profile/', async(req, res) => {

    const { username, newpassword, email } = req.body


    try {
        // Check if the user exists in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        const updatedUser = await User.findOneAndUpdate({ email: email }, {
            username: username || user.username,
            password: newpassword || user.password
        }, { new: true });


        // Return the user object (excluding password) as response
        const { password: _, ...userWithoutPassword } = updatedUser.toObject();
        res.status(200).json(userWithoutPassword);

    } catch (error) {
        console.error('Error in update profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
})


//getCart

app.get('/getmycart', async(req, res) => {

    const { id } = req.query
    try {
        // Check if the user exists in the database
        const cart = await Cart.findOne({ userId: id }).populate('products.product');


        if (!cart) {
            const newCart = new Cart({
                userId: id, // Reference to the User's _id
                products: [], // No products initially
                cartSize: 0, // Initial cart size is 0
                subtotal: 0, // Initial subtotal is 0

            });


            // Save the newly created cart to the database
            const savedCart = await newCart.save();

            res.json(savedCart)
            return
        }


        // Return the user object (excluding password) as response

        res.status(200).json(cart);

    } catch (error) {
        console.error('Error in get my cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
})

//Update Quantity
app.post('/updatecart', async(req, res) => {

    const { UserID, productID, productQuantity } = req.body

    const thisproduct = await Product.findOne({ _id: productID })

    if (!thisproduct) {
        res.status(400).json({ message: 'Product Doesn\t exist in DB' })
        return
    }

    // 1. find cart by user ID
    try {
        // Check if the user exists in the database
        const cart = await Cart.findOne({ userId: UserID });


        if (!cart) {
            console.log('creating cart')
            const newcart = await Cart.findOneAndUpdate({ userID: UserID }, { userID: UserID, products: [{ product: productID, quantity: productQuantity, itemSubtotal: RoundNumber(thisproduct.price * productQuantity) }], cartSize: productQuantity, subtotal: RoundNumber(productQuantity * thisproduct.price) }, // You can modify the fields here as needed
                { new: true, upsert: true } // `upsert: true` creates a new document if one doesn't exist
            )


            // Save the newly created cart to the database

            res.json(newcart)
            return
        } else {


            const objID = new ObjectId(productID)

            const finditem = cart.products.find((product) => product.product.equals(objID))

            const [newCartSize, newSubtotal] = calcNewCartDetails(cart.products, productID, productQuantity, thisproduct.price)
            console.log("new sizes : ", newCartSize, newSubtotal)
            let updatedcart = ''

            if (finditem) {
                if (productQuantity === 0) {
                    // remove Item 
                    console.log('remove from cart')
                    updatedcart = await Cart.findOneAndUpdate({ userId: UserID }, // Find the cart by userId
                        {
                            $pull: { products: { product: productID } },
                            $set: { cartSize: newCartSize, subtotal: newSubtotal }
                        },
                        // Remove product with matching productId
                        { new: true } // Return the updated document
                    );
                }

                if (productQuantity > 0) {
                    // change quantity Item
                    console.log('update  cart')
                    updatedcart = await Cart
                        .findOneAndUpdate({ userId: UserID, "products.product": productID }, {
                                $set: {
                                    "products.$.quantity": productQuantity,
                                    "products.$.itemSubtotal": RoundNumber(thisproduct.price * productQuantity),
                                    "cartSize": newCartSize,

                                    subtotal: newSubtotal
                                }
                            },
                            // You can modify the fields here as needed
                            { new: true } // `upsert: true` creates a new document if one doesn't exist
                        );

                }
            } else {
                // add Item to cart
                console.log('pushing to  cart')
                updatedcart = await Cart.findOneAndUpdate({ userId: UserID }, // Find cart by userId
                    {
                        $push: { products: { product: productID, quantity: productQuantity, itemSubtotal: RoundNumber(thisproduct.price * productQuantity) } },
                        $set: { cartSize: newCartSize, subtotal: newSubtotal },

                    }, // Add new product
                    { new: true, upsert: true } // Return the updated document, create if it doesn't exist
                );
            }


            res.json(updatedcart)
        }


        // Return the user object (excluding password) as response


    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Server error' });
    }
    // 2. if quanity===0 , remove Item
    // 3. if quanitty is positive , add


})

//Create Order
app.post('/createorder', async(req, res) => {

    const { id } = req.body

    try {

        const cart = await Cart.findOne({ userId: id });

        if (!cart) {
            res.status(400).json({ message: 'Cart Doesn\t exist' })
            return
        } else {


            const NewOrder = new Order({
                userId: id,
                // date: { type: Date, default: Date.now },
                products: [...cart.products],
                orderSize: cart.cartSize, // Total count of items in order
                subtotal: cart.subtotal, // Total before charges
                // charges: { type: Number, default: 100 }, // Additional fees like shipping
                totalPrice: (cart.subtotal + cart.charges), // 
            })

            await NewOrder.save()
            updatedcart = await Cart.findOneAndUpdate({ userId: id }, // Find the cart by userId
                {

                    $set: { cartSize: 0, subtotal: 0, products: [] }
                },

                // Remove product with matching productId
                { new: true } // Return the updated document
            );
            res.json(NewOrder)
        }


    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Couldn\'t place new  order' });
    }
    // 2. if quanity===0 , remove Item
    // 3. if quanitty is positive , add


})

//GetOrderHistory
app.get('/getmyorders', async(req, res) => {

    const { id } = req.query

    try {

        const orders = await Order.find({ userId: id }).populate('products.product');

        console.log(orders)
        if (!orders) {
            res.status(400).json({ message: 'Orders Doesn\t exist' })
            return
        }

        res.json(orders)
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Couldn\'t fetch orders' });
    }
})


app.listen(4000, () => {
    console.log('App is listening to port 4000')
})