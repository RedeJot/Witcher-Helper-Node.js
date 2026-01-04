import express from 'express';

export const startApi = () => {
    const app = express();
    const port = process.env.PORT || 3000;

    app.get ('/', (req, res) => {
        res.send('API działa poprawnie!');
    });

    app.listen(port, () => {
        console.log(`Backend działa na porcie: ${port}`);
    });
};