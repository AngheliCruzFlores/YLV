const{Router} = require('express')
const router = Router();
const {renderIndex, renderAcerca, renderRegistrarse, renderLogin} = require('../controllers/index.controller')

router.get('/', renderIndex);
router.get('/about', renderAcerca);


module.exports = router;