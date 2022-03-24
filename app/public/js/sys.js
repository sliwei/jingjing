var changeSta = function (sta, id) {
	$.ajax({
		url: '/api/del',
		type: 'POST',
		data: {
			sta: sta,
			id: id
		},
		success: function (res) {
			console.log(res);
			if (res.code) {
				location.reload()
			} else {
				alert('error code!')
			}
		},
		error: function (e) {
			console.log(e);
			alert('error network!')
		}
	});
};

$('#del').on('click', function () {
	changeSta(1, $(this).attr('data_id'));
});

$('#res').on('click', function () {
	changeSta(0, $(this).attr('data_id'));
});
