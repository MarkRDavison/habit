import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

// Boot express
const app: Application = express();
const port = 40000;

// Application routing
app.use('/', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send({ data: 'Hello', changed: false, ...process.env });
});

// Start server
app.listen(port, () => console.log(`Server is listening on port ${port}!`));