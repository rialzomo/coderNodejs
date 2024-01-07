import { Router } from "express";

const router = Router();

router.get('/', async(req, res) => {
    req.logger.debug('DEBUG');
    req.logger.http('HTTP');
    req.logger.info('INFO');
    req.logger.warning('WARNING');
    req.logger.error('ERROR');
    req.logger.fatal('FATAL');
    
    res.send({message: 'Logger'});
});

export default router;