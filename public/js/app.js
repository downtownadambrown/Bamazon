const clearTable = function () {
    $('.admin-table-row').remove();
};

const clearTableHeader = function () {
    $('#admin-table-header-row').remove();
};

const clearTotalRow = function () {
    $('#total-row').remove();
}

const clearStatusBar = function () {
    $('#status-bar').text('');
};

const clearProductModal = function () {
    $('#prod-product-name').val('');
    $('#prod-department-name').val('');
    $('#prod-price').val('');
    $('#prod-stock-quantity').val('');
};

const clearComponents = function () {
    clearTable();
    clearTableHeader();
    clearTotalRow();
    
    //hide submit button
    $('#submitButton').fadeOut();
};

const renderProduct = function () {
    const thisRef = this;
    
    $.ajax({
        url: '/api/product',
        type: 'GET'
    }).then(function (rows) {
        // **Receiving an array of objects **
        //   Schema of object:
        //   - id: integer (primary key)
        //   - product_name: String
        //   - department_name:  String
        //   - price: Real
        //   - stock_quantity:  Integer
        clearComponents();

        if ($(thisRef).attr('id') === 'view-product-button') {
            let newHeader = $(`<tr id="admin-table-header-row">
                                    <th scope="col">PID#</th>
                                    <th scope="col">Product Name</th>
                                    <th scope="col">Dept Name</th>
                                    <th scope="col">Quantity</th>
                                    <th scope="col">Unit Price</th>
                                </tr>`);
            $('#admin-table-header').append(newHeader);

            rows.forEach(function (row) {
                let newRow = $(`<tr class="admin-table-row">
                                    <th scope="row">${row.id}</th>
                                    <td>${row.product_name}</td>
                                    <td>${row.department_name}</td>
                                    <td>${row.stock_quantity}</td>
                                    <td>$${row.price}</td>
                                </tr>`);
            $('#admin-table-body').append(newRow);
            });
        } else if ($(thisRef).attr('id') === 'order-product-button') {
            let newHeader = $(`<tr id="admin-table-header-row">
                                    <th scope="col">Product Name</th>
                                    <th scope="col">Current Qty</th>
                                    <th scope="col">Unit Price</th>
                                    <th scope="col" class="text-center">Add to your order</th>
                                    <th scope="col">Subtotal</th>
                                </tr>`);
            $('#admin-table-header').append(newHeader);

            for (let i = 0; i < rows.length; i++){
                let newRow = $(`<tr class="admin-table-row">
                                    <td id="${rows[i].id}" class="rowID">${rows[i].product_name}</td>
                                    <td id="quantity${i}">${rows[i].stock_quantity}</td>
                                    <td id="price${i}">$${rows[i].price}</td>
                                    <td class="text-center d-flex justify-content-center align-middle">
                                        <div id="miniwrapper" class="align-middle d-flex flex-row align-items-center justify-content-between">
                                            <div class="minButton"><i id="minus${i}" class="fas fa-minus-circle p-1"></i></div>
                                            <div class="addQty" id="addQty${i}">0</div>
                                            <div class="addButton"><i id="plus${i}" class="fas fa-plus-circle p-1"></i></div>
                                        </div>
                                    </td>
                                    <td id="subtotal${i}">$0.00</td>
                                </tr>`);
                $('#admin-table-body').append(newRow);
                $(`#minus${i}`).on('click', function(){ 

                    // Making sure they aren't trying to go below zero first
                    // If they are -- warn them w/ red blinky blinky text
                    let addQuantity = parseInt($(`#addQty${i}`).text());
                    if (addQuantity === 0){
                        $(`#addQty${i}`).css('color', 'red').fadeOut('normal', function() {
                            $(this).fadeIn('normal', function() {
                                $(this).css('color', 'black');
                            });
                        });
                        return;
                    }

                    // Grabbing the Quantity for modification
                    let qty = parseInt($(`#addQty${i}`).text());
                    qty--;                
                    $(`#addQty${i}`).text(qty);

                    // Grabbing HTML data to modify SubTotal per unit price
                    let price = $(`#price${i}`).text().slice(1);
                    const currentSubtotal = $(`#subtotal${i}`).text().slice(1);
                    const newprice = Number(price);                 
                    let newSubtotal = parseFloat(currentSubtotal) - newprice;
                    newSubtotal = newSubtotal.toFixed(2);

                    // Set the new subtotal for this product in the page
                    $(`#subtotal${i}`).text(`$${newSubtotal}`);

                    // Change total row at bottom as well
                    const currentTotal = $(`#order-total`).text().slice(1);
                    let newTotal = parseFloat(currentTotal) - newprice;
                    newTotal = newTotal.toFixed(2);
                    $(`#order-total`).text(`$${newTotal}`);                    
                });
                $(`#plus${i}`).on('click', function(){
                    // Grabbing the Quantity for modification
                    let qty = parseInt($(`#addQty${i}`).text());
                    qty++;                
                    $(`#addQty${i}`).text(qty);
                    
                    // Grabbing HTML data to modify SubTotal per unit price
                    let price = $(`#price${i}`).text().slice(1);
                    const currentSubtotal = $(`#subtotal${i}`).text().slice(1);
                    const newprice = Number(price);                 
                    let newSubtotal = parseFloat(currentSubtotal) + newprice;
                    newSubtotal = newSubtotal.toFixed(2);

                    // Set the new subtotal for this product in the page
                    $(`#subtotal${i}`).text(`$${newSubtotal}`);
                    
                    // Change total row at bottom as well
                    const currentTotal = $(`#order-total`).text().slice(1);
                    let newTotal = parseFloat(currentTotal) + newprice;
                    newTotal = newTotal.toFixed(2);
                    $(`#order-total`).text(`$${newTotal}`);
                });
            }
            
            let newRow = $(`<tr id="total-row">
                                <td></td>
                                <td></td>
                                <td></td>
                                <td><p class="text-right font-weight-bold">Total:</p></td>
                                <td id="order-total">$0.00</td>
                            </tr>`);
            $('#admin-table-body').append(newRow);

            // Show the Submit Order button
            $('#submitButton').fadeIn().on('click', submitOrder);
        } else if ($(thisRef).attr('id') === 'view-low-button') {
            
            // This is the constant you can modify to define what
            // gets marked as 'low inventory'
            // Default is 5 meaning anything with stock 5 or less
            // will be rendered to the screen
            const lowStockQuantity = 5;

            let newHeader = $(`<tr id="admin-table-header-row">
                                    <th scope="col">PID#</th>
                                    <th scope="col">Product Name</th>
                                    <th scope="col">Dept Name</th>
                                    <th scope="col">Quantity</th>
                                    <th scope="col">Unit Price</th>
                                </tr>`);
            $('#admin-table-header').append(newHeader);
       
            rows.forEach(function (row) {
                if (row.stock_quantity <= lowStockQuantity) {
                    let newRow = $(`<tr class="admin-table-row">
                                        <th scope="row">${row.id}</th>
                                        <td>${row.product_name}</td>
                                        <td>${row.department_name}</td>
                                        <td class="text-danger">${row.stock_quantity}</td>
                                        <td>$${row.price}</td>
                                    </tr>`);
                    $('#admin-table-body').append(newRow);
                }
            });            
        } else {
            throw new Error();
        }
    });
};

const submitOrder = function(){

    let putData = { data : []};
    let activeRows = document.querySelectorAll('.rowID');
    
    for (let i = 0; i < activeRows.length; i++){
        const idKey = activeRows[i].id;
        const qtyToAdd = parseInt($(`#addQty${idKey-1}`).text());
        const currentQty = parseInt($(`#quantity${idKey-1}`).text());

        if (qtyToAdd > 0){
            putData.data.push({
                id : idKey,
                qty : qtyToAdd + currentQty
            });
        }
    }

    $.ajax({
        url: '/api/product',
        type: 'PUT',
        data: putData
    });
};

const addProduct = function () {
    
    // Model the postData using values from modal
    const postData = {
        "product_name": $('#prod-product-name').val(),
        "department_name": $('#prod-department-name').val(),
        "price": $('#prod-price').val(),
        "stock_quantity": $('#prod-stock-quantity').val()
    };

    $.ajax({
        url: '/api/product',
        type: 'POST',
        data: postData
    }).then(function (res) {
        $('#modalAddProductForm').modal('hide');
        clearProductModal();
        $('#status-bar').text('Success!  Product added')
            .fadeOut({
                duration: 2500,
                complete: function () { clearStatusBar(); }
            });

        console.log('success! added to DB', res);
    }).catch(function (err) {
        console.log(err);
    });
};

const addInventory = function () {

/*     $.ajax({
        url: '/api/product',
        type: 'POST',
        data: postData
    }).then(function (res) {
        $('#modalAddProductForm').modal('hide');
        clearProductModal();
        $('#status-bar').text('Success!  Product added')
            .fadeOut({
                duration: 2500,
                complete: function () { clearStatusBar(); }
            });

        console.log('success! added to DB', res);
    }).catch(function (err) {
        console.log(err);
    }); */

};

$(document).ready(() => {
    //Event listener for View Products Button
    $("#view-product-button").on("click", renderProduct);

    $('#view-low-button').on('click', renderProduct);

    //Event listener for Add Product Button
    $("#add-new-product-button").on("click", function (e) {
        e.preventDefault();
        
        // Clear components + Submit button if present
        clearComponents();

        $('#modalAddProductForm').modal('show');
    });

    //Event listener for the submit button on the Add Product Modal
    $("#add-product-button").on("click", addProduct);

    //Event listener for order products
    $('#order-product-button').on("click", renderProduct);
});