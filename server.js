import express from 'express'
import path from 'path'
import 'dotenv/config'
import cors from 'cors'
import './config/database.js'
import bodyParser from 'body-parser'
import checkToken from './config/checkToken.js'
import { userRouter } from './routes/api/usersRoute.js'

const app = express()

app.use(cors())
app.use(bodyParser.json())

app.use(checkToken)

const port = process.env.PORT || 4000
// USERS API
app.use('/api/users', userRouter)

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
}); 

app.listen(port, () => {
  console.log(`Listening on port: ${port}`)
});


