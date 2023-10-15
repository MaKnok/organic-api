import mongoose from "mongoose"

mongoose.connect("mongodb+srv://marinaknok:Mkn2703K94@alura.nfmb9yc.mongodb.net/organic-shop",{useNewUrlParser: true, useUnifiedTopology: true});

let db = mongoose.connection; 

export default db; 