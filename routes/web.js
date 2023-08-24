const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');
const homeController = require('../app/http/controllers/homeController')
const orderController = require('../app/http/controllers/customers/orderController')
const adminOrderController = require('../app/http/controllers/admin/orderController')
const adminMenuController = require('../app/http/controllers/admin/menuController')
const statusController = require('../app/http/controllers/admin/statusController');


//Middlewares
const guest = require('../app/http/middleware/guest')
const auth = require('../app/http/middleware/auth')
const admin = require('../app/http/middleware/admin');



function initRoutes(app) {

    app.get('/', homeController().index);

    app.get('/cart', cartController().index)
    app.post('/update-cart', cartController().update)

    app.get('/register', guest, authController().register)
    app.post('/register', authController().postRegister)


    app.post('/logout', authController().logout)

    app.get('/login', guest, authController().login)
    app.post('/login', authController().postLogin)


    // Customers routes
    app.post('/orders', auth, orderController().store)
    app.get('/customer/orders', auth, orderController().index)


    app.get('/customer/orders/:id', orderController().show)

    // Admin routes
    app.get('/admin/orders', admin, adminOrderController().index)


    // admin/order/routes
    app.post('/admin/order/status', admin, statusController().update)

    //admin/menu/routes
    app.get('/admin/menus', admin, adminMenuController().menu)
    app.post('/admin/menus', admin, adminMenuController().postMenu)

}

module.exports = initRoutes;
