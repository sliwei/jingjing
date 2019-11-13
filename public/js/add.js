$('#upload').on('change', function () {
	console.log(this.files[0]);
	var formdata = new FormData();
	formdata.append('file', this.files[0]);

	$.ajax({
		url: '/api/upload',
		type: 'POST',
		data: formdata,
		contentType: false,
		processData: false,
		success: function (res) {
			console.log(res);
			if (res.code) {
				$('#headimg').attr('src', res.data.url);
			} else {
				alert('error code!')
			}
		},
		error: function (e) {
			console.log(e);
			alert('error network!')
		}
	});
});

$('#save').on('click', function () {
	let data = {
		title: $('#title').val(),
		note: $('#note').val(),
		url: $('#url').val(),
		headimg: $('#headimg').attr('src'),
		createtime: $('#createtime').val(),
	};
	console.log(data);
	$.ajax({
		url: '/api/save',
		type: 'POST',
		data: data,
		success: function (res) {
			console.log(res);
			if (res.code) {
				window.location = '/sys'
			} else {
				alert('error code!')
			}
		},
		error: function (e) {
			console.log(e);
			alert('error network!')
		}
	});
});
