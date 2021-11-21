import dotenv from 'dotenv';
import { logger } from '@mark.davison/zeno-common'
import { createApp } from './app';

dotenv.config();

const port = 40000;

createApp()
.then(app => {
    app.listen(port, () => logger.info(`Listening on Port ${port}`))
})
.catch(e => {
    logger.error(e)
});