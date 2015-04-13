/*
 * GET home page.
 */

exports.index = function(req, res) {
	res.render('index',{ title : 'Guida&Cassetti - Arturo Salice S.P.A.', configurazione : 'Guida&Cassetti'})
};
