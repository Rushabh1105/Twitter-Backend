import express from 'express';

import userRoutes from './src/routes/userRoutes';
import tweetRoutes from './src/routes/tweetsRoutes';

const app = express();

app.use(express.json());
app.use( '/user', userRoutes );
app.use( '/tweets', tweetRoutes );

app.get('/', (req, res) => {
    res.send("Hello World...");
});


app.listen( 3000, () => {
    console.log("Server started on port 3000");
});