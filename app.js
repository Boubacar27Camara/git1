const express = require('express')
const mysql = require('mysql');
const myConnection = require('express-myconnection');
const connection = require('express-myconnection');
// const connection = require('express-myconnection');

const optionBd = {
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database : 'notes_bd'
};
// const { status } = require('express/lib/response');
const app = express();

//Extration des donnees du formulaire
app.use(express.urlencoded({ extended: false }))

// Definition du middleware pour connexion avec le bd
app.use(myConnection(mysql, optionBd, 'pool'));

// app.get('/', (req, res) =>{
//     res.status(200).sendFile('./IHM/index.html', {root : __dirname});
// });

//Definition du moteur d'affichage
app.set('view engine', 'ejs')
app.set('views', 'IHM')

app.get('/', (req, res) =>{
 
 req.getConnection((erreur, connection) => {
    if(erreur){
        console.log(erreur);
    }else{
        connection.query('SELECT * FROM notes', [], (erreur, resultat) =>{
            if(erreur){
                console.log(erreur);
            }else{
                res.status(200).render("index", { resultat });
            }
        });
    }
 });  
});

app.post('/notes', (req, res) => {
   let id = req.body.id === "" ? null : req.body.id;
   let titre = req.body.titre;
   let description = req.body.description;

   let reqSql = id === null ? 'INSERT INTO notes(id, titre, description) VALUES(?, ?, ?)'
   : "UPDATE notes SET titre = ?, description = ? WHERE id = ?";
   
   let donnees = id === null ? [null, titre, description] : [titre, description, id];
   
   req.getConnection((erreur, connection) => {
    if(erreur){
        console.log(erreur);
    }else{
        connection.query( reqSql, donnees,
         (erreur, resultat) =>{
            if(erreur){
                console.log(erreur);
            }else{
                res.status(300).redirect("/");
            }
        });
    }
 });
  
});

app.delete("/notes/:id", (req, res)=>{
    let = req.params.id;
    req.getConnection((erreur, connection)=>{
        if(erreur){
            console.log(erreur);
        }else{
            connection.query("DELETE FROM notes WHERE id = ?", [id], (erreur, resultat)=>{
                if(erreur){
                    console.log(erreur);
                }else{
                    res.status(200).json({ routeRacine: "/" });
                }
            })
        }
    })

})



app.get('/apropos', (req, res) =>{
    res.status(200).render('apropos');

});

app.use((req, res) =>{
    res.status(404).render('pageIntrouvable');
});

app.listen(3001)
console.log('Attente des requete du port 3001');