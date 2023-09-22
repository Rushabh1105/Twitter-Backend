import express from 'express';
import bodyParser from 'body-parser';

import userRoutes from './src/routes/userRoutes';
import tweetRoutes from './src/routes/tweetsRoutes';
import PORT from './src/serverConfig/serverConfig';
import authRoutes from './src/routes/authRoutes';


const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}))
app.use( '/user', userRoutes );
app.use( '/tweet', tweetRoutes );
app.use( '/auth', authRoutes );

app.get('/', (req, res) => {
    res.send("Hello World...");
});


app.listen( PORT, () => {
    // console.log(env.PORT)
    console.log( `Server Started on PORT ${PORT}`);
});