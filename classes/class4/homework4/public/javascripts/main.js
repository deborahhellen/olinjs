//Handles the ajax requests on the /ingredients page

$(document).ready(function() { 

	var $addForm = $("#addForm");
	var $outOfStockForm = $("#outOfStockForm");
	var $editForm = $("#editForm");
	var $orderForm = $("#orderForm");

	var onError = function(data, status) {
		//Log the status and error to the console
		//This will be generic error generator for my ajax requests
		console.log("Status: ", status);
		console.log("Error: ", data);
	};

	var onSuccessAdd = function(data, status) {
		//Reloads the section when we've successfully added the item
		console.log("Successfully added " + data);

		//Add the response from the server to the bottom of the list
		$("ul").append('<li>' + data.name + " : $" + data.price + '<br><form id = "outOfStockForm" action = "outOfStock" method="POST">' + 
		'<input type = "hidden" name = "id" value = ' + data.id + '></br><input type = "hidden" name = "name" value = ' + data.name + '></br>' + 
  		'<input type = "hidden" name = "price" value = ' + data.price + '></br><input type = "submit" value = "Out of Stock">' + 
  		'</form></br><form id="editForm" action="edit" method="POST">New Name:<input type="text" name="name"/><br/>New Price:<input type="text" name="price"/><br/>' + 
	  	'<input type = "hidden" name = "id" value = ' + data.id + '></br><input type="submit" value="Edit Item"></form></br>');
	};

	var onSuccessDel = function(data, status) {
		//Reloads the section when we've successfully deleted the item
		console.log("Successfully deleted" + data);
	};

	var onSuccssEdit = function(data, status) {
		//Reloads the window when we've successfully edited the item
		console.log("Successfully edited " + data);
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

	$addForm.submit(function(event) {
		event.preventDefault();
		var name = $addForm.find("[name = 'name']").val();
		var price = $addForm.find("[name = 'price']").val();

		$.post('addIngredient', {
			name: name,
			price: price
		})
		.done(onSuccessAdd)
		.error(onError);

	});

	$outOfStockForm.submit(function(event) {

		//what the fuck is this doing?
		event.preventDefault();
		var id = $outOfStockForm.find("[name = 'id']").val();
		var name = $outOfStockForm.find("[name = 'name']").val();
		var price = $outOfStockForm.find("[name = 'price']").val();


		$.post('outOfStock', {
			id: id,
			name: name,
			price: price
		})
		.done(onSuccessDel)
		.error(onError);
	});

	$editForm.submit(function(event) {
		event.preventDefault();
		var name = $editForm.find("[name = 'name']").val();
		var price = $editForm.find("[name = 'price']").val();
		var id = $editForm.find("[name = 'id']").val();

		$.post('edit', {
			name: name,
			price: price,
			id: id
		})
		.done(onSuccssEdit)
		.error(onError);
	});

	$( "input[type=checkbox]" ).on( "click", getChecked );

});



