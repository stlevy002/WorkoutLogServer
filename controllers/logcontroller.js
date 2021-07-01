let Express = require("express");
let router = Express.Router();
let validateJWT = require("../middleware/validate-jwt");

const { WOLModel } = require("../models");

router.get("/practice", validateJWT, (req, res) => {
    res.send('Hey!!  This is a practice route!')
});


router.post("/log", validateJWT, async (req, res) => {
    const { description, definition, result } = req.body.log;
    const { id } = req.user;
    const WOLEntry = {
        description,
        definition,
        result,
        owner_id: id
    }
    try {
       const newWOL = await WOLModel.create(WOLEntry);
       res.status(200).json(newWOL);
    } catch (err) {
      res.status(500).json({ error: err});  
    }
    WOLModel.create(WOLEntry)  

    });

   
   router.get("/", async (req, res) => {
      try {
          const entries = await WOLModel.findAll();
          res.status(200).json(entries);
      } catch (err) {
        res.status(500).json({ error: err });  
      }
   });

  
  router.get("/mine", validateJWT, async (req, res) => {
      const { id } = req.user;
      try {
        const userWOLs = await WOLModel.findAll({
            where: {
                owner_id: id
            }
        });
        res.status(200).json(userWOLs);  
      } catch (err) {
        res.status(500).json({ error: err});
      }
  })

 /* 
 ____________________________
 Update a Log
 ____________________________
 */
router.put("/update/:id", validateJWT, async (req, res) => {
  const { description, definition, result } = req.body.log;
  const WOLId = req.params.entryId;
  const userId = req.user.id;

  const query = {
    where: {
      id: WOLId,
      owner_id: userId
    }
  };

  const updatedWOL = {
    description: description,
    definition: definition,
    result: result
  };

  try {
    const update = await WOLModel.update(updatedWOL, query);
    res.status(200).json(update);  
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

/*
______________________________________
Delete a Log
______________________________________
*/ 
router.delete("/delete/:id", validateJWT, async (req, res) => {
  const ownerId = req.user.id;
  const WOLId = req.params.id;

  try {
    const query = {
      where: {
        id: WOLId,
        owner: ownerId
      }
    };

    await WOLModel.destroy(query);
    res.status(200).json({ message: "Workout Log Removed"});
  } catch (err) {
    res.status(500).json({ error: err });
  }
})
    router.get("/about", (req, res) => {
        res.send("This is an about route!")
    });

module.exports = router;