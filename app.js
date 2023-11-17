require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const port = process.env.PORT;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//라우터 가져오기.
const ProductRouter = require('./routers/product.router.js');
const UserRouter = require('./routers/user.router.js');
app.use('/api', [UserRouter, ProductRouter]);

app.get('/', (req, res) => {
	console.log(';slkfjsd;a');
	res.send('dkhfsdlkjsfd');
});

app.listen(port, () => {
	console.log(port, '번 포트가 열렸어요');
});
