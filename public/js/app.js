const clearTable = function () {
    $('.admin-table-row').remove();
};

const clearTableHeader = function () {
    $('#admin-table-header-row').remove();
};

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
    
    //hide submit button
    $('#submitButton').fadeOut();
};

const renderProduct = function () {
    const thisRef = this;
    console.log(this);
    
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
                                    <th scope="col">Price</th>
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
                                    <th scope="col">Price/unit</th>
                                    <th scope="col" class="text-center">Add to your order</th>
                                </tr>`);
            $('#admin-table-header').append(newHeader);
            rows.forEach(function (row) {
                let newRow = $(`<tr class="admin-table-row">
                                    <td>${row.product_name}</td>
                                    <td>${row.stock_quantity}</td>
                                    <td>$${row.price}</td>
                                    <td class="p-0 text-center align-middle"><i class="fas fa-minus-circle p-1"></i>0<i class="fas fa-plus-circle p-1"></i></td>
                                </tr>`);
                $('#admin-table-body').append(newRow);
            });
            
            $('#submitButton').fadeIn();
        } else {
            throw new Error();
        }
    });
};

const addProduct = function () {
    const postData = {
        "product_name": $('#prod-product-name').val(),
        "department_name": $('#prod-department-name').val(),
        "price": $('#prod-price').val(),
        "stock_quantity": $('#prod-stock-quantity').val()
    }

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

    //add submit button


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

    //Event listener for Add Product Button
    $("#add-new-product-button").on("click", function (e) {
        e.preventDefault();
        $('#modalAddProductForm').modal('show');
    });

    //Event listener for the submit button on the Add Product Modal
    $("#add-product-button").on("click", addProduct);

    //Event listener for order products
    $('#order-product-button').on("click", renderProduct);
});