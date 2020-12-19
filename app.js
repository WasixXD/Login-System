const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')

const app = express()

//setando conexão
var connection  =  mysql.createConnection({
    //nome do local
    host: "localhost",
    //nome no user
    user: "Myuser",
    //senha
    password: "Mypassword",
    //nome da db
    database: "cadastrocliente"
})



//criando conexão
//connection.connect()


// connection.query("SELECT * FROM dados;", (err, results, fields) => {
//    if(err) throw err

//    //resultados da query


   
   
// })

//fechando conexão => importante, pois garante que as querys serão executadas
// connection.end()


//Setando a porta
const PORT = process.env.PORT || 5000

//usando bodyparser para pegar as informações do form
app.use(bodyParser.urlencoded({extended: true}))
//colocando que vamos usar o ejs
app.set("view engine", "ejs")

connection.connect()

class Cliente {
    constructor(nome, email, senha, msg) {
        this.nome = nome
        this.email = email
        this.senha = senha
        this.msg = msg
    }

    MonstraNome() {
        console.log(this.nome)
    }

}

//roteando a entrada principal

app.get('/', (req,res) => {
    res.render("index.ejs")
})

//pegando os dados do form e jogando no banco de dados
app.post('/show', (req, res) => {
    let cliente = new Cliente(req.body.Nome, req.body.email, req.body.senha, req.body.msg)
   
    connection.query(`INSERT INTO dados VALUES(null, '${cliente.nome}', '${cliente.email}', '${cliente.senha}', '${cliente.msg}');`, (err, results, fields) => {
        if(err) throw err
    })
    //redirecionando a pessoa pra pagina de log in
    res.redirect("/table")
})


//roteando o log in 
app.get("/table", (req, res)=> {
    
    res.render("table.ejs")
})

//pegando os dados do login 
app.post('/get', (req, res) => {
    
    //vendo se a pessoa já esta cadastrada no banco 
    connection.query(`SELECT id,email,senha FROM dados WHERE senha="${req.body.senha}" AND email="${req.body.email}";`, (err, results, fields) => {
        if(err) {
            throw err

        }
        //pegando o id dela

        if(results[0].hasOwnProperty("id")) {
            var id = results[0].id
        } else {
            var id = 2
        }

        

        if(results.length == 0) {
            //se a pessoa errar traze-lá dnv
            res.redirect('/table')


        } else {
            var msgAntiga

            //pegando a msg da ultima pessoa
            connection.query(`SELECT msg FROM dados WHERE id="${id -1 == 0? 1 : id - 1}"`, (err, results) => {
                if(results[0].hasOwnProperty("msg")) {
                    msgAntiga = results[0].msg
                } else {
                    msgAntiga = "Nada :("
                }
            })

            //selecionando os dados e levando pra pagina principal
            connection.query(`SELECT id,nome, msg FROM dados  WHERE senha="${req.body.senha}" and email="${req.body.email}";`, (err, results, fields) => {
                var dados  = results
                dados[0]["msgAntiga"] = msgAntiga
                res.render("home.ejs", {dados: dados})

            })
        }
    })
})





app.listen(PORT, () => {
    console.log(`Server rodando na porta => ${PORT}`)
})