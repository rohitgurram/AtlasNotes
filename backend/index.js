 const connectToMongo=require('./db');
 const express= require('express');
 console.log("rohit");
connectToMongo();
const app = express();
const port = 5000;
app.use(express.json());//to use req.body in get or post requests
//available routes
app.use('/api/auth',require('./routes/auth'));
app.use('/api/notes',require('./routes/notes'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
