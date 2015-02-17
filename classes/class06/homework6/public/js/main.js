$(document).ready(function() { 
	var onError = function(data, status) {
	/*Log the status and error to the console
	This will be generic error generator for my ajax requests */
		console.log("Status: ", status);
		console.log("Error: ", data);
	};

	var onSuccessAdd = function (data, status) {
		var newTwot = '<div class = "twot" id = ' + data._id + '>' + 
					'<p>' + data.text + '</p>' + 
					'<p>By: ' + data._author.name + ' </p>' + 
					'<form class = "deleteTwot" id="delete-' + data._id + '" action="deleteTwot" method="POST">' + 
						'<input type = "hidden" name = "authId" value = "' + data._author + '">' + 
						'<input type = "hidden" name = "twotId" value = "' + data._id + '">' + 
						'<input type = "submit" value = "Delete">' + 
					'</form></div>';

		$('.twotList').prepend(newTwot);

		console.log(data._id);
		console.log(data._author._id);

		$('#delete-' + data._id).submit( function(event) {
			event.preventDefault();
			$.post('deleteTwot', {
				_author: data._author._id,
				_id: data._id
			})
			.done(onSuccessDel)
			.error(onError);
		});
	};

	var onSuccessDel = function (data, status) {
		if (data === "Can't delete someone else's twot!") {
			$('#alert').html(data);
			$('#alert').css('color', 'red');
		} else {
			$('#' + data._id).remove();
		};
	};	

	var onSuccessUser = function (data, status) {
		//Reset all other twots to black text
		$('.twot').css('background-color', '#ddd');

		for (var i=0; i<data.length; i++) {
			//highlight the twots of the selected user
			console.log(data[i]._id);
			$('#' + data[i]._id).css('background-color', 'white');
		};
	};

	var onSuccessLogout = function (data, status) {
		$('.userMsg').html('<p>Hello, please log in to add twots!</p>' + 
			'<button id = "login"><a href="/login">Log in</a></button>');
	};

	var $twotForm = $('#newTwot');
	var $delForm = $('.deleteTwot');
	var $userForm = $('.user');
	var $logoutForm = $('#logout');

	$twotForm.submit( function(event) {
		event.preventDefault();

		var text = $twotForm.find("[name = 'twot']").val();

		$.post('newTwot', {
			twot: text,
		})
		.done(onSuccessAdd)
		.error(onError);
	});

	$delForm.submit( function(event) {
		event.preventDefault();
		var $twotId = $(this).attr('id');
		console.log($twotId);
		console.log("submitting form del");

		var author = $("#" + $twotId).find("[name = 'authId']").val();
		var id = $("#" + $twotId).find("[name = 'twotId']").val();
		console.log("author " + author);

		$.post('deleteTwot', {
			_author: author,
			_id: id
		})
		.done(onSuccessDel)
		.error(onError);
	});

	$userForm.submit( function(event) {
		event.preventDefault();
		var $userId = $(this).attr('id');

		var id = $("#" + $userId).find("[name = 'userId']").val();

		$.post('userTwots', {
			userId: id
		})
		.done(onSuccessUser)
		.error(onError);
	});

	$logoutForm.submit( function(event) {
		event.preventDefault();
		$.post('logout')
		.done(onSuccessLogout)
		.error(onError);

	});

});







