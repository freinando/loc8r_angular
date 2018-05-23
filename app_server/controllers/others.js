/* GET home page */
/*module.exports = {
	index : function(req, res){
		res.render('index', { title: 'Express' });
	}
};*/

module.exports.about = function(req, res){
	res.render('generic-text', { 
		title: 'About',
		 content: 'Loc8r was created to help people find places to sit down and get a bit of work done.\n\n\n\n'+
				'Lorem ipsum dolor sit amet, eum solum ullamcorper eu. '+
				'Ne facer appellantur qui. Eum stet velit at. Mea mundi inermis in, '+
				'quo in partiendo gubergren. In sed elitr disputando, sit mutat interesset eu.\n\n'+
				'Sea at dictas vocibus fuisset, nec ea iusto sanctus philosophia, '+
				'te nemore propriae eleifend vis. An duis periculis eos. Posse aperiri '+
				'intellegebat vix et, vix id nobis disputando. Dicit tincidunt no vix, '+
				'omnis sadipscing pri eu, qui at dicat scripta consulatu. Utamur placerat no sed.\n\n'+
				'Ea quem nostrud eripuit mei. Ei suas aperiam consulatu pro, eum an saperet '+
				'nominavi interesset. Unum tation laboramus cu pri, est no omnes diceret definiebas. '+
				'Qui ad vivendo corpora. Vel ex utroque corpora maiestatis, sit audiam intellegat cu.\n\n'+
				'Dicit aliquip duo ei, an sint choro eos, labore pericula sea at. Decore labores '+
				'suscipit eu vel. Mei te ornatus invidunt quaerendum. An minim doming nostro per. '+
				'Sed an sonet philosophia, cu interesset contentiones eam. Homero dolorem cum at.\n\n'+
				'Eam malis facilis eu. Vel id dicat interpretaris. An usu tota harum. Mucius '+
				'facilis posidonium no eum, ea duo detraxit incorrupte. Iusto bonorum recteque '+
				'nam no, invidunt perpetua argumentum te vel.\n\n'
							  	}
		  		);
};