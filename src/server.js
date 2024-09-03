import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { env } from './utils/env.js';
import { getAllContacts, getContactsById } from './services/contacts.js';

const setupServer = () => {
    const app = express();

    const logger = pino({
        transport: {
            target: 'pino-pretty'
        }
    });

    app.use(logger);
    app.use(cors());
    app.use(express.json());

    app.get('/contacts', async (req, res) => {
        const data = await getAllContacts();

        res.json({
            status: 200,
            message: "Successfully found contacts!",
            data: data,
        });
    });

    app.get('/contacts/:id', async (req, res) => {
        const { id } = req.params;
        const data = await getContactsById(id);

        if (!data) {
            res.status(404).json({
                message: 'Contact not found',
            });
            return;
        }

        res.json({
            status: 200,
            message: `Successfully found contact with id ${id}!`,
            data: data,
        });
    });

    app.use((req, res) => {
        res.status(404).json({
            message: 'Not found',
        });
    });

    const port = Number(env('PORT', 3000));

    app.listen(port, () => console.log(`Server is running on port ${port}`));
};

export default setupServer;