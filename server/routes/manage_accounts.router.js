const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const { rejectUnauthorized2 } = require('../modules/authorization2-middleware');
const { rejectUnauthorized3 } = require('../modules/authorization3-middleware');
const pool = require('../modules/pool');
const router = express.Router();

// receives request to get all users from manage_users.saga. Queries the db to get all users with the same institution id (inst_id) as the one attached to the user who made the request (req.user.id)
router.get('/', rejectUnauthenticated, rejectUnauthorized2, (req, res) => {
  console.log('in getUsers', req.user.id);
  const query = `SELECT * FROM "user" WHERE inst_id = $1;`;
  pool.query(query, [req.user.inst_id])
    .then(result => {
      console.log(result.rows);
      res.send(result.rows);
    }).catch(err => {
      console.log(err);
      res.sendStatus(500);
    })
});

// receives request from manage_users.saga. If the click-on user is a research head (user_level 2), the query to demote them to researcher (user_level 1) will run. If the clicked-on user is a researcher (user_level 1), the query to promote them to research head will run.
router.put('/', rejectUnauthenticated, rejectUnauthorized3, (req, res) => {
  console.log('in manage accounts put', req.body);
  let query;
  if (req.body.userLevel == 1) {
    query = `UPDATE "user" SET user_level = '2' WHERE id = $1;`;
  } else if (req.body.userLevel == 2) {
    query = `UPDATE "user" SET user_level = '1' WHERE id = $1;`;
  }
  pool.query(query, [req.body.id])
    .then(response => {
      res.sendStatus(200)
    }).catch(err => {
      console.log(err);
      res.sendStatus(500);
    })
});

module.exports = router;
