'use strict';

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { 
    title: 'Owl Carousel Example w/ Speech Navigation'
  });
};