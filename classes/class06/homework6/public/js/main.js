$(document).ready(function() { 
	var onError = function(data, status) {
	/*Log the status and error to the console
	This will be generic error generator for my ajax requests */
		console.log("Status: ", status);
		console.log("Error: ", data);
	};

	var onSuccessAdd = function (data, status) {
		var newTwot = '<div class = "twot">' + 
					'<p>' + data.text + '</p>' + 
					'<p>By: ' + data._author + ' </p>' + 
					'<p>Date: ' + data.date + ' </p>' + 
					'<form id="delete-' + data._id + '" action="deleteTwot" method="POST">' + 
						'<input type = "hidden" name = "authId" value = "' + data._author + '">' + 
						'<input type = "hidden" name = "twotId" value = "' + data._id + '">' + 
						'<input type = "submit" value = "Delete">' + 
					'</form></div>';

		$('.twotList').prepend(newTwot);

		$('#delete-' + data._id).submit( function(event) {
			$.post('newTwot', {
				//Figure this out in a minute
			})
			.done(onSuccessAdd)
			.error(onError);
		});
	};

	var onSuccessDel = function (data, status) {
		if (data === "Can't delete someone else's twot!") {
			$('#alert').html(data);
		} else {
			$('#' + data._id).remove();
		};
	};	

	var onSuccessUser = function (data, status) {
		console.log(data);
	};

	var $twotForm = $('#newTwot');
	var $delForm = $('.deleteTwot');
	var $userForm = $('.user');

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

});







