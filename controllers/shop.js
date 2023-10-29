exports.getIndex = (req, res, next) => {
    res.render('shop/index',{
        pageTitle: 'Online Store',
        path: '/',
        prods: []
    })
}