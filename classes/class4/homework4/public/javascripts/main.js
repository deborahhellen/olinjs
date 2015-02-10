/* Handles the ajax requests on the /ingredients, the /kitchen, 
	and the /order pages
*/

$(document).ready(function() { 

	var $orderForm = $("#orderForm");

	var onError = function(data, status) {
	/*Log the status and error to the console
	This will be generic error generator for my ajax requests */
		console.log("Status: ", status);
		console.log("Error: ", data);
	};

	var onSuccessAdd = function(data, status) {
	/* Adds the new item to the end of the ingredients list */

		var newIng = '<li>' + data.name + " : $" + data.price + '<br><form id = "outOfStock-' + data._id + '" action = "outOfStock" method="POST">' + 
		'<input type = "hidden" name = "id" value = ' + data._id + '></br><input type = "hidden" name = "name" value = ' + data.name + '></br>' + 
  		'<input type = "hidden" name = "price" value = ' + data.price + '></br><input type = "submit" value = "Out of Stock">' + 
  		'</form></br><form id="editForm-' + data._id + '" action="edit" method="POST">New Name:<input type="text" name="name"/><br/>New Price:<input type="text" name="price"/><br/>' + 
	  	'<input type = "hidden" name = "id" value = ' + data._id + '></br><input type="submit" value="Edit Item"></form></br>';

		//Add the response from the server to the bottom of the list
		$("ul").append(newIng);
		
		///Bind this new form to a submit handler function
		$("form").submit(function(event) {
			event.preventDefault();

			var $formID = $(this).attr('id');

			var name = $("#" + $formID).find("[name = 'name']").val();
			var price = $("#" + $formID).find("[name = 'price']").val();
			var id = $("#" + $formID).find("[name = 'id']").val();

			// Allow edits or deletions of the newly added thing
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

		});
	};

	var onSuccessDel = function(data, status) {
	/* Removed the deleted item from the view without refreshing */
		console.log("Successfully marked " + data.name + " as " + data.inStock);
		console.log(typeof data.name);

		$("#outOfStock-" + data._id).parent().html(data.name + " is out of stock!");
	};

	var onSuccessEdit = function(data, status) {
	/* Edits the item in the view after a successful edit */

		var editedIng = '<li>' + data.name + " : $" + data.price + '<br><form id = "outOfStock-' + data._id + '" action = "outOfStock" method="POST">' + 
		'<input type = "hidden" name = "id" value = ' + data._id + '></br><input type = "hidden" name = "name" value = ' + data.name + '></br>' + 
  		'<input type = "hidden" name = "price" value = ' + data.price + '></br><input type = "submit" value = "Out of Stock">' + 
  		'</form></br><form id="editForm-' + data._id + '" action="edit" method="POST">New Name:<input type="text" name="name"/><br/>New Price:<input type="text" name="price"/><br/>' + 
	  	'<input type = "hidden" name = "id" value = ' + data._id + '></br><input type="submit" value="Edit Item"></form></br>';

		//Update the view with the new data
		$("#editForm-" + data._id).parent().html(editedIng);

	  	$("form").submit(function(event) {

			event.preventDefault();
			console.log("Got form!");
			var $formID = $(this).attr('id');

			var name = $("#" + $formID).find("[name = 'name']").val();
			var price = $("#" + $formID).find("[name = 'price']").val();
			var id = $("#" + $formID).find("[name = 'id']").val();

			// Allow edits or deletions of the newly added thing
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

		});
	};

	var onSuccessOrder = function(data, status) {
	/* Lets the customer know that they have successfully completed their order */
		
		$("#completeOrder").html('You have successfully placed your order!');
	};

	var onSuccessComp = function(data, status ) {
	/* Lets the kitchen know that they have successfully removed the order */

		//Remove the order when completed and signal that it has been deleted
		$("#completed-" + data._id).parent().html("Completed this order!");
	};

	var getChecked = function() {
	//Updates running total of order as items are checked/unchecked
		var items = $orderForm.children();
		var total = 0;
		for (var i=0; i<items.length; i++) {
			if($(items[i]).prop('checked')) {
				var price = Number(items[i].value);
				if (price) { total += price;};
			};
		};
		$("#total").html(total);
	};

	$("form").submit(function(event) {
	/* When any form is clicked on the page, this function is called 
	The function will then determine which form was submitted and make
	the appropriate post request */

		event.preventDefault();
		console.log("Got form!");
		var $formID = $(this).attr('id');

		var name = $("#" + $formID).find("[name = 'name']").val();
		var price = $("#" + $formID).find("[name = 'price']").val();
		var id = $("#" + $formID).find("[name = 'id']").val();


		//TODO: define edit and out of stock forms as classes and check the class type?
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

			//Get only the checked items and dump them into a list
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

	//Any time a box is checked, get the total cost of checked items
	$( "input[type=checkbox]" ).on( "click", getChecked );

	
}); 



