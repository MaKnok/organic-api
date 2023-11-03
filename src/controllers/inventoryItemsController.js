import inventoryItems from "../models/InventoryItem.js";

class InventoryItemController {
    static listInventoryItems = (req,res) => {
        inventoryItems.find((err, items) => {
            res.status(200).json(items);
        })
    }

    static listInventoryItemsById = (req, res) => {

        const catId = req.params.catId; 
        const itemId = req.params.itemId;

        // Construct the query to find the document and matching item by _id from the dynamic field
        const query = {
            _id: '650345221c17d0e35625fa3d', // Replace with the actual document's _id
            [`${catId}._id`]: itemId,
        };

        // Use projection to include only the matching item
        const projection = {
        [catId]: {
            $elemMatch: { _id: itemId},
            },
        };

        // Find the document and retrieve only the matching item
        inventoryItems.findOne(
        query, 
        projection, 
        (err, item) => {
        if (err) {
            res.status(500).send({message: `${err.message} - item search failed`});
        } else {
            if (item) {
                res.status(200).send(item[catId][0]);
            } else {
                res.status(400).send({message: `${err.message} - item not found`});
            }
        }
        });

    }

    static listInventoryItemsBySearch = (req, res) => {
        const search = req.query.search;

            inventoryItems.aggregate([
                {
                  $match: {
                    $or: [
                      { 'cat-food.itemName': { $regex: search, $options: 'i' } },
                      { 'cat-health.itemName': { $regex: search, $options: 'i' } },
                      { 'cat-sup.itemName': { $regex: search, $options: 'i' } },
                      { 'cat-beauty.itemName': { $regex: search, $options: 'i' } }
                    ]
                  }
                },
                {
                  $project: {
                    matchingItems: {
                      $filter: {
                        input: {
                          $concatArrays: [
                            '$cat-food',
                            '$cat-health',
                            '$cat-sup',
                            '$cat-beauty'
                          ]
                        },
                        as: 'item',
                        cond: {
                          $regexMatch: {
                            input: '$$item.itemName',
                            regex: search,
                            options: 'i'
                          }
                        }
                      }
                    }
                  }
                }
              ]).exec((err, result) => {
                if (err) {
                  res.status(500).send({ message: `${err.message} - There was a server error` });
                } else {
                  
                  if (result[0] !== undefined && 
                      result[0] !== null && 
                      result[0].length !== 0){
                        res.status(200).send(result[0].matchingItems);
                  }else{
                        res.status(400).send({ message: `Item not found` });
                  }
                  
                }
              });

        
        
      }

    static registerNewItem = (req, res) => {
        const catId = req.params.catId;

        const updateQuery = { $push: {} };
        updateQuery.$push[catId] = req.body;

        inventoryItems.findOneAndUpdate(
            { _id: '650345221c17d0e35625fa3d' },
            updateQuery,
            { new: true },
            (err, updatedDoc) => {
                if (err) {
                    res.status(500).send({message: `${err.message} - item registration failed`});
                } else {
                    res.status(201).send(updatedDoc.toJSON());
                }
            }
        )
    }

    static updateItem = (req, res) => {
        const catId = req.params.catId; 
        const itemId = req.params.itemId;
        const updatedFields = req.body;

        const filterQuery = {
            _id: '650345221c17d0e35625fa3d', // Replace with the actual document's _id
            [`${catId}._id`]: itemId, // Identify the item within the dynamically named field using its _id
        };

        const updateQuery = {};
        for (const key in updatedFields) {
            updateQuery[`${catId}.$.${key}`] = updatedFields[key];
        }

        inventoryItems.updateOne(
            filterQuery,
            { $set: updateQuery },
            (err) => {
              if (err) {
                res.status(500).send( { message: err.message } );
              } else {
                res.status(200).send( { message:'Item atualizado' } );
              }
            }
        );

    }

    static deleteItem = (req, res) => {
        const catId = req.params.catId; 
        const itemId = req.params.itemId;

        const query = {
            _id: '650345221c17d0e35625fa3d', // Replace with the actual document's _id
        };

        // Use projection to include only the matching item
        const update = {
            $pull: {
              [catId]: { _id: itemId },
            },
        };

        inventoryItems.findOneAndUpdate(
            query, 
            update, 
            { new: true },
            (err, updatedItem) => {
                if (err) {
                    res.status(500).send({message: `${err.message} - Item delete failed`});
                } else {
                    if (updatedItem) {
                        res.status(200).send({message: `${updatedItem} - Item was deleted` });
                    } else {
                        res.status(400).send({message: `${err.message} - Item not found`});
                    }
                }
            }
        );

    }

}

export default InventoryItemController