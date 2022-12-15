const express = require('express');
const router = express.Router();
const xss = require('xss');
const index = require('../data/index');

router.route('/')
.get(async (req, res) => {
  try {
    let search = xss(req.query['search-input']);
    let searchPropresults = await index.properties.searchProp(search);
    res.render('./search', {searchPropresults: searchPropresults,searchQuery:search});
  } catch (err) {
    //console.log(err);
    res.status(404).render('./error_page', {
      error: err
    })
  }
});

module.exports = router;