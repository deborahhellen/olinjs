//Handles the ajax requests on the /ingredients page

$(document).ready(function() { 

	var $orderForm = $("#orderForm");

	var onError = function(data, status) {
	/*Log the status and error to the console
	This will be generic error generator for my ajax requests*/
		console.log("Status: ", status);
		console.log("Error: ", data);
	};

	var onSuccessAdd = function(data, status) {
	/* Adds the new item to the end of the ingredients list */
		console.log("Successfully added " + data.name);

		//Add the response from the server to the bottom of the list
		$("ul").append('<li>' + data.name + " : $" + data.price + '<br><form id = "outOfStock-' + data.name + ' action = "outOfStock" method="POST">' + 
		'<input type = "hidden" name = "id" value = ' + data.id + '></br><input type = "hidden" name = "name" value = ' + data.name + '></br>' + 
  		'<input type = "hidden" name = "price" value = ' + data.price + '></br><input type = "submit" value = "Out of Stock">' + 
  		'</form></br><form id="editForm-' + data.name + ' action="edit" method="POST">New Name:<input type="text" name="name"/><br/>New Price:<input type="text" name="price"/><br/>' + 
	  	'<input type = "hidden" name = "id" value = ' + data.id + '></br><input type="submit" value="Edit Item"></form></br>');
	};

	var onSuccessDel = function(data, status) {
	/* Removed the deleted item from the view without refreshing */
		console.log("Successfully deleted" + data.name);
		console.log(typeof data.name);

		$("#outOfStock-" + data.name).parent().html("");
	};

	var onSuccessEdit = function(data, status) {
	/* Edits the item in the view after a successful edit */
		console.log("Successfully edited " + data.name);
		console.log(data.name);

		//Update the view with the new data
		//$("#editForm-" + ).html("<p>Editing this shit</p>");

		//Fuck this shit, I'm reloading the page and I don't care
		window.location.reload();

	};

	var onSuccessOrder = function(data, status) {
		console.log("submitted order of " + data);
		$("#completeOrder").html('You have successfully placed your order!');
	};

	var onSuccessComp = function(data, status ) {
		console.log("deleted " + data._id);

		//Remove and replace the order when completed
		$("#completed-" + data._id).parent().html("Completed this order!");
	};

	var getChecked = function() {
	//Updates running total of order as items are checked/unchecked
		var items = $orderForm.children();
		var total = 0;
		for (var i=0; i<items.length; i++) {
			if($(items[i]).prop('checked')) {
				var price = Number(items[i].value);
				total += price;
			};
		};
		$("#total").html(total);
	};

	$("form").submit(function(event) {
	/*When any form is clicked on the page, this function is called 
	The function will then determine which form was submitted and make
	the appropriate post request*/

	//TODO: make this not freak out about spaces in item names
	//TODO: make this not crash when you try to edit one you just added
	//TODO: only allow alphabetical characters in name

		event.preventDefault();
		var $formID = $(this).attr('id');

		var name = $("#" + $formID).find("[name = 'name']").val();
		var price = $("#" + $formID).find("[name = 'price']").val();
		var id = $("#" + $formID).find("[name = 'id']").val();


		//Sketchy sketchy
		//TODO: define edit and out of stock forms as classes and check the class type
		if ($formID.substring(0, 10) === 'outOfStock') {
			$.post('outOfStock', {
			id: id,
			name: name,
			price: price
			})
			.done(onSuccessDel)
			.error(onError);
		};
		if ($formID.substring(0, 8) === 'editForm') {
			$.post('edit', {
			id: id,
			name: name,
			price: price
			})
			.done(onSuccessEdit)
			.error(onError);			
		};
		if ($formID.substring(0, 8) === 'addForm') {
			$.post('addIngredient', {
			name: name,
			price: price
			})
			.done(onSuccessAdd)
			.error(onError);
		};

		if ($formID === "orderForm") {
			var items = $orderForm.children();
			var ings = [];

			for (var i=0; i < items.length; i++) {
				if($(items[i]).prop('checked')) {
					var price = items[i].name;
					console.log(price);
					ings.push(price);
				};
			};
			console.log(ings);

			$.post('submitOrder', {
				ingredients: JSON.stringify(ings)
			})
			.done(onSuccessOrder)
			.error(onError);
		};

		if ($formID.substring(0,9) === "completed") {
			console.log("Deleting this shit" + id);
			$.post('completed', {
				id: id
			})
			.done(onSuccessComp)
			.error(onError);
		};

	});

	$( "input[type=checkbox]" ).on( "click", getChecked );

});



