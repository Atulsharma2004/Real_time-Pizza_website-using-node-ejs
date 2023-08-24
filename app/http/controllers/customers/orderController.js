const Order = require('../../../models/order')
const flash = require('express-flash')
const moment = require('moment')

function orderController() {
    return {
        store(req, res) {

            // Check if user is logged in and authenticated
            if (!req.user || !req.user._id) {
                req.flash('error', 'You must be logged in to place an order.');
                return res.redirect('/login');
            }
            const { phone, address } = req.body;
            if (!phone || !address) {
                req.flash('error', 'All fields are required')
                return res.redirect('/cart')
            } else {
                const order = new Order({
                    customerId: req.user._id,
                    items: req.session.cart.items,
                    phone: phone,
                    address: address
                })
                order.save().then(result => {
                    Order.populate(result, { path: 'customerId' }).then(placedOrder => {
                        req.flash('success', 'Order placed successfully');
                        delete req.session.cart;
                        const eventEmitter = req.app.get('eventEmitter')
                        eventEmitter.emit('orderPlaced', placedOrder)
                        return res.redirect('/customer/orders');
                    }).catch(err => {
                        req.flash('error', 'Something went wrong');
                        return res.redirect('/cart')
                    });
                }).catch(err => {
                    req.flash('error', 'Something went wrong')
                    return res.redirect('/cart');
                })
            }
        },

        async index(req, res) {
            const orders = await Order.find({ customerId: req.user._id }, null, { sort: { 'createdAt': -1 } })

            //Header for escape from alternate alert of message for placed orders after moving back and forth on browser... 
            res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0')
            res.render('customers/orders', { orders: orders, moment: moment })
        },

        async show(req, res) {
            const order = await Order.findById(req.params.id);

            // Authorize user
            if (req.user._id.toString() === order.customerId.toString()) {
                return res.render('customers/singleOrder', { order: order })
            }
            return res.redirect('/');

        }
    }
}
module.exports = orderController;