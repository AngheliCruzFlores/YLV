const indexCtrl=[]

indexCtrl.renderIndex = (req, res) => {
    res.render('index')
};
indexCtrl.renderAcerca = (req, res) => {
    res.render('about')
};


module.exports = indexCtrl