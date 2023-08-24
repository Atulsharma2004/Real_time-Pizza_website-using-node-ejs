const Order = require('../../../models/order');

function statusController() {
    return {
        async update(req, res) {
            try {
                await Order.updateOne({ _id: req.body.orderId }, { status: req.body.status });

                //emit event
                const eventEmitter = req.app.get('eventEmitter')
                eventEmitter.emit('orderUpdated', { id: req.body.orderId, status: req.body.status })

                return res.redirect('/admin/orders')
            } catch (err) {
                return res.redirect('/admin/orders')
            }

        }
    }
}

module.exports = statusController;