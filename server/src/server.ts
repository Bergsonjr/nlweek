import express, { response } from 'express'

const app = express()

app.get('/users', (req, res) => {
    console.log('Listagem de usuários')

    response.send('Hello World')
})

app.listen(3333)