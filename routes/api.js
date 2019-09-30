const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
// const Login = mongoose.model('login');
// const Login = require('./models/login');
var fs = require('fs');
const User = mongoose.model('user');
// const Cart = mongoose.model('Cart');
// const Order = mongoose.model('Order');
// const Orderdetails = mongoose.model('Orderdetails');

const config = require('../config/database');
const messages = require('../config/messages.json');
var async = require('async');

router.post('/register', (req, res) => {
    console.log('reacgefdd211111111111');
    // if (req.headers && req.headers.authorization) {
    // req.body = req.body.data;
    // console.log( req.body.name );
    // var authorization = req.headers.authorization,
    //     decoded;
    // decoded = jwt.verify(authorization, config.secret)
    // console.log('789',decoded) 
    // req.body.name = myTrim(req.body.name);
    // req.body.username = myTrim(req.body.username);
    // req.body.password = myTrim(req.body.password);
    // req.body.gender = myTrim(req.body.gender);
    console.log('req.body', req.body);


    if (!req.body.name && !req.body.email && !req.body.password && !req.body.mobile) {
        res.status(400).json({ msg: 'all fields are required' })
    }
    else {
        User.findOne({ "email": req.body.email }, (err, data) => {
            if (data) {
                res.status(400).json({ msg: 'email already exist' })
            }
            else {
                var user = new User();
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(req.body.password, salt, (err, hash) => {
                        req.body.password = hash;
                        this.saltSecret = salt;

                        user.name = req.body.name;
                        user.email = req.body.email;
                        user.password = req.body.password;
                        user.mobile = req.body.mobile;
                        user.save((err, result) => {
                            if (result) {
                                res.status(200).json({ msg: messages.common.success.acccreated })
                            } else {
                                res.status(400).json({ msg: messages.common.err.somthingwrong })

                            }

                        });
                    })
                })



            }
        })
    }
    // } else {

    //     return res.json({ status: 400, msg: 'Invalid User' });
    // }
});


/* consoleLog functn for console data */
function consoleLog(message, type) {
    if (this.debug) {
        console.log(type + ' - ' + message);
    }
}

function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    var response = {};
    if (matches.length !== 3) {

        return new Error('Invalid input string');
    }

    response.type = matches[1];
    ext = matches[1].split("/");
    response.ext = ext[1];
    response.data = Buffer.from(matches[2], 'base64');
    return response;
}
// ----------------------------------End-------------------------------------------



router.post('/authenticate', (req, res) => {
    const username = req.body.username;
    const password = myTrim(req.body.password);

    Login.findOne({ username: username }, (err, user) => {
        if (err) throw err;
        if (!user) {
            res.status(400).json({ msg: messages.login.err.usernotfound })
        }
        else {
            comparePassword(password, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    if (user) {
                        const token = jwt.sign(user, config.secret, {
                            expiresIn: 1000
                        });
                        res.status(200).json({
                            msg: messages.login.success.loginsuccessfully,
                            token: token,
                            user: {
                                id: user._id,
                                name: user.name,
                                password: user.password
                            }
                        });
                    }

                } else {
                    res.status(400).json({ msg: messages.login.err.wrongpassword })

                }
            })
        }

    }).lean();
})

function myTrim(x) {
    return x.replace(/^\s+|\s+$/gm, '');
}

comparePassword = function (candPass, hash, callback) {
    bcrypt.compare(candPass, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    })
}

router.get('/getAllProduct', (req, res, next) => {
    Product.find({}, (err, products) => {
        if (!products) {
            return res.json({ success: false, msg: 'error' });

        } else {
            return res.json({ success: true, msg: 'Successfull', products: products });
        }

    });
});


router.get('/getProduct/:id', function (req, res) {
    Product.findOne({ "_id": req.params.id }, (err, product) => {
        if (err) throw err;
        else
            return res.json({
                success: true,
                product: product,

            });
    })
})

router.get('/getOrderDetails/:id', function (req, res) {
    // Orderdetails.findOne({"order_id":req.params.id}, (err,order)=>{
    //         if(err) throw err;
    //         else
    //             return res.json({
    //                 success:true, 
    //                 order:order,

    //             });
    //     })
    // })
    if (req.headers && req.headers.authorization) {
        var orderid = req.params.id;
        var authorization = req.headers.authorization,
            decoded;
        try {
            decoded = jwt.verify(authorization, config.secret)
            Orderdetails.aggregate(
                [
                    {
                        $match: {
                            "order_id": mongoose.Types.ObjectId(orderid)
                        }
                    },
                    {
                        $lookup: {
                            from: "orders",
                            localField: "order_id",
                            foreignField: "_id",
                            as: "myorder"
                        }
                    },
                    { $unwind: "$myorder" },
                ]).exec(function (err, myorder) {

                    return res.json(myorder);
                });

        } catch (e) {

            return res.json({ success: false, msg: 'catch  error' });
        }
    } else {

        return res.json({ success: false, msg: 'Invalid' });
    }

})


router.post('/getCartProducts', (req, res, next) => {
    if (req.headers && req.headers.authorization) {
        var authorization = req.headers.authorization,
            decoded;
        try {
            decoded = jwt.verify(authorization, config.secret)
            Cart.aggregate(
                [
                    {
                        $match: {
                            "user_id": mongoose.Types.ObjectId(decoded._id),
                        }
                    },
                    {
                        $lookup: {
                            from: "products",
                            localField: "prod_id",
                            foreignField: "_id",
                            as: "my_cart"
                        }
                    },
                    { $unwind: "$my_cart" },
                ]).exec(function (err, mycart) {

                    return res.json(mycart);
                });

        } catch (e) {

            return res.json({ success: false, msg: 'catch  error' });
        }
    } else {

        return res.json({ success: false, msg: 'Invalid' });
    }

})
router.post('/checkout', (req, res, next) => {

    if (req.headers && req.headers.authorization) {
        var authorization = req.headers.authorization,
            decoded;
        // try {
        decoded = jwt.verify(authorization, config.secret)
        Cart.aggregate(
            [
                {
                    $match: {
                        "user_id": mongoose.Types.ObjectId(decoded._id),

                    }
                },
                {
                    $lookup: {
                        from: "products",
                        localField: "prod_id",
                        foreignField: "_id",
                        as: "myproduct"
                    }
                },
                { $unwind: "$myproduct" },
            ]).exec(function (err, myproduct) {

                var grandTotal = 0;

                stockExists = true;
                notExistsProducts = [];
                myproduct.forEach(element => {
                    grandTotal += element.myproduct.price * element.quantity;
                    if (element.quantity > element.myproduct.quantity) {
                        stockExists = false;
                        notExistsProducts.push(element.myproduct);
                    }

                });

                if (stockExists) {
                    return res.json({ success: true, msg: 'success' });
                } else {
                    reMsg = '';
                    notExistsProducts.forEach(element => {
                        reMsg += 'Only ' + element.quantity + ' ' + element.name + ' Available ';
                    });
                    return res.json({ success: false, msg: 'Out Of Stock:  ' + reMsg });
                }

            });

    } else {

        return res.json({ success: false, msg: 'Invalid' });
    }
})

router.post('/getAllOrders', (req, res, next) => {

    if (req.headers && req.headers.authorization) {
        if (req.body && req.body.address_id) {
            var authorization = req.headers.authorization,
                decoded;
            // try {
            decoded = jwt.verify(authorization, config.secret)

            resp = createNewOrder(decoded._id, req.body.address_id);

            return res.json(resp);

        } else {
            return res.json({ success: false, msg: 'no delivery address' });
        }
    } else {

        return res.json({ success: false, msg: 'Invalid' });
    }
})




function createNewOrder(user_id, address_id) {

    Cart.aggregate(
        [
            {
                $match: {
                    "user_id": mongoose.Types.ObjectId(user_id),

                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "prod_id",
                    foreignField: "_id",
                    as: "myproduct"
                }
            },
            { $unwind: "$myproduct" },
        ]).exec(function (err, myproduct) {

            //  console.log('my order summary',myproduct)
            var grandTotal = 0;

            stockExists = true;
            notExistsProducts = [];
            myproduct.forEach(element => {
                grandTotal += element.myproduct.price * element.quantity;
                if (element.quantity > element.myproduct.quantity) {
                    stockExists = false;
                    notExistsProducts.push(element.myproduct);
                }
                // console.log('nnn'+grandTotal)
            });

            if (stockExists) {
                var order = new Order();

                order.total = grandTotal;
                order.user_id = user_id;
                order.date = new Date();
                order.address_id = address_id;

                order.save((err, ordr) => {
                    // console.log('order reached here',ordr)
                    if (!err) {
                        //res.send(doc);
                        async.eachOfSeries(myproduct, (element, key, callback) => {

                            var orderdetails = new Orderdetails();

                            orderdetails.order_id = ordr._id;
                            orderdetails.orderid = ordr.id;
                            orderdetails.prod_id = element.prod_id;
                            orderdetails.quantity = element.quantity;
                            orderdetails.photo = element.myproduct.photo;
                            orderdetails.name = element.myproduct.name;
                            orderdetails.price = element.myproduct.price;
                            orderdetails.total = element.quantity * element.myproduct.price;
                            orderdetails.user_id = user_id;
                            orderdetails.save((err, ordr) => {

                                Cart.findByIdAndRemove({ _id: element._id }, function (err, Cart) {

                                    Product.findOneAndUpdate({ _id: element.prod_id }, { $inc: { quantity: element.quantity * -1 } }, { new: true }, function (err, response) {
                                        if (!err) {
                                            callback();
                                        } else {
                                            //return res.json({success:false, msg: 'Failed'});
                                        }
                                    })





                                });

                            });

                        }, function (err) {
                            return { success: true, msg: 'order completed' };
                        });



                    } else {

                        return next(err);
                    }
                });

            } else {
                reMsg = '';
                notExistsProducts.forEach(element => {
                    reMsg += 'Only ' + element.quantity + ' ' + element.name + ' Available ';
                });
                return { success: false, msg: 'Out Of Stock:  ' + reMsg };
            }

        });
}

router.post('/removeCart', (req, res, next) => {
    // console.log("deleting a product" ,res);
    Cart.findByIdAndRemove({ _id: req.body.cart_id }, function (err, Cart) {
        if (err) {
            res.send("error deleting product");
        } else {
            return res.json(Cart)
        }
    });

});
router.post('/updateCart', (req, res, next) => {
    const prod_id = req.body.prod_id;
    // const user_id = req.body.user_id;
    const quantity = req.body.qnty;

    if (req.headers && req.headers.authorization) {
        var authorization = req.headers.authorization,
            decoded;

        try {
            decoded = jwt.verify(authorization, config.secret)



            Cart.findOneAndUpdate({ prod_id: prod_id, user_id: decoded._id }, { quantity: quantity }, { new: true }, function (err, response) {
                if (!err) {
                    return res.json({ success: true, msg: 'Product cart quantity updated' });
                } else {
                    return res.json({ success: false, msg: 'Failed' });
                }
            })
        } catch (e) {

            return res.json({ success: false, msg: 'catch  error' });
        }
    } else {

        return res.json({ success: false, msg: 'Invalid User' });
    }


})

router.post('/addToCart', (req, res) => {
    // console.log("reach add to cart")

    //    console.log(req.body);
    const prod_id = req.body.prod_id;
    // const user_id = req.body.user_id;

    if (req.headers && req.headers.authorization) {
        var authorization = req.headers.authorization,
            decoded;

        try {
            decoded = jwt.verify(authorization, config.secret)
            // console.log('yes',decoded);
            // res.json(decoded);
            Cart.findOne({ prod_id: prod_id, user_id: decoded._id }, (err, cart1) => {

                // console.log(cart1);
                if (err) throw err;
                if (!cart1) {
                    var cart = new Cart();
                    cart.prod_id = prod_id;
                    cart.user_id = decoded._id;
                    cart.quantity = 1;

                    cart.save((err, doc) => {
                        // console.log( doc);
                        if (!err)
                            return res.json({ success: true, msg: 'Product added to cart' });

                        else
                            return res.json({ success: false, msg: 'Failed1' });
                    })
                    //   console.log(cart1);
                } else {
                    Cart.findOneAndUpdate({ _id: cart1._id }, { $inc: { quantity: 1 } }, { new: true }, function (err, response) {
                        if (!err) {
                            return res.json({ success: true, msg: 'Product cart quantity updated' });
                        } else {
                            return res.json({ success: false, msg: 'Failed2' });
                        }
                    })

                }

            })

        } catch (e) {

            return res.json({ success: false, msg: 'catch  error' });
        }
    } else {

        return res.json({ success: false, msg: 'Invalid User' });
    }


})

router.get('/get_loggedin_user', (req, res, next) => {
    if (req.headers && req.headers.authorization) {
        var authorization = req.headers.authorization,
            decoded;
        try {
            decoded = jwt.verify(authorization, config.secret);
            // console.log('token decoded',decoded);
            res.json(decoded);
        } catch (e) {
            // return res.status(401).send('unauthorized');
            return res.json('');
        }
    } else {
        // return res.status(401).send('Invalid User');
        return res.json('');
    }

});

router.get('/test', (req, res, next) => {
    Order.findOne({}, null, { sort: { _id: -1 } }, (error, lastRow) => {
        // if(error)
        // console.log(lastRow)
        return res.json(lastRow);
        // return next(error);
        // doc.order_id = lastRow.order_id +1;
        // next();
    });
});

router.get('/ordSummary', (req, res, next) => {

    //  console.log('sonyaaaa');
    const user_id = req.body.user_id;

    if (req.headers && req.headers.authorization) {
        var authorization = req.headers.authorization,
            decoded;
        try {
            decoded = jwt.verify(authorization, config.secret)
            //    console.log('yes',decoded)
            Order.find({ user_id: decoded._id }, function (err, order) {
                console.log('into mongoose findone', order);
                if (err) throw err;
                else
                    return res.json({
                        success: true,
                        order: order,

                    });
            })

        } catch (e) {

            return res.json({ success: false, msg: 'catch  error' });
        }
    } else {

        return res.json({ success: false, msg: 'Invalid' });
    }

})

router.get('/getAddress', (req, res, next) => {

    //  console.log('sonyaaaa');
    const user_id = req.body.user_id;

    if (req.headers && req.headers.authorization) {
        var authorization = req.headers.authorization,
            decoded;
        try {
            decoded = jwt.verify(authorization, config.secret)
            //    console.log('yes',decoded)
            Userdetails.find({ user_id: decoded._id }, function (err, users) {
                //   console.log('into mongoose findone',userdetails);
                if (err) throw err;
                else
                    return res.json({
                        success: true,
                        user: users,

                    });
            })

        } catch (e) {

            return res.json({ success: false, msg: 'catch  error' });
        }
    } else {

        return res.json({ success: false, msg: 'Invalid' });
    }

})

module.exports = router;
