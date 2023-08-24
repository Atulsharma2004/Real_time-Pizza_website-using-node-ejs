const Menu = require('../../../models/menu')
const flash = require('express-flash')
function menuController() {
    return {
        menu(req, res) {
            res.render('admin/menus')
        },
        async postMenu(req, res) {
            try {
                const result = req.body;

                if (result) {
                    const menu = new Menu({
                        name: result.name,
                        image: result.image,
                        price: result.price,
                        size: result.size
                    })

                    const dataSaved = await menu.save();
                    req.flash('success', 'Item Uploaded Successfully')
                    return res.redirect('/admin/menus');
                } else {
                    req.flash('error', "Please fill all the required field")
                    return res.redirect('/admin/menus');
                }
            } catch (error) {
                req.flash('error', "Something went wrong")
                return res.redirect('/admin/menus');

            }

        }

    }
}

module.exports = menuController;