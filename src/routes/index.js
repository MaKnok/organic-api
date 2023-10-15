import express from 'express';
import users from "./usersRoutes.js";
import categories from "./categoriesRoutes.js";
import inventoryItems from "./inventoryItemsRoutes.js";

const routes = (app) =>  {

    app.route('/').get((req,res)=>{
        res.status(200).send({title: "Organic Shop"})
    })

    app.use(
        express.json(),
        users,
        categories,
        inventoryItems,

    )
}

export default routes; 