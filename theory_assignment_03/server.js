const express =  require('express')
const expressLayouts = require('express-ejs-layouts');
let app = express()
app.use(expressLayouts);
app.use(express.static('public'))

app.set('view engine' , "ejs")


 



app.get("/home" , (req , res)=>{
    res.render("index"  , {cssFile : '/css/styles.css'} )
})


app.get("/contact" , (req , res)=>{
    res.render("contact" , {cssFile: "/cv/style.css"})
})

app.listen (5000 , ()=>{
    console.log('server stated at localhost : 5000');
})

 