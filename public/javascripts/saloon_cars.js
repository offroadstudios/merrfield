$(document).ready(function () {
    var url = window.location.href;
    console.log(url);
    var curr = url.split("/")[3];
    if (curr == "saloon") {
        $("#Saloon").addClass('active');
    }
});

// Price Filtering
price_filter_saloon = $(".form-check-input.saloon");
price_filter_saloon.click((clicked) => {

    var query_param = clicked.target.id;
    request_url = '/saloon/filter/?priceBy=' + query_param;

    console.log(request_url);
    window.location.href = request_url;

})

price_filter_range_saloon = $("#formControlRangePriceSaloon");
price_filter_range_saloon.change(() => {

    var query_param = "under" + price_filter_range_saloon.val();
    request_url = '/saloon/filter/?priceBy=' + query_param;

    console.log(request_url);
    window.location.href = request_url;
});



// Year Filtering
year_filter_saloon = $('.custom-control-input.saloon');
year_filter_saloon.change((changed) => {

    var query_param = changed.target.id;
    request_url = '/saloon/filter/?year=' + query_param;

    console.log(request_url);
    window.location.href = request_url;
});

year_filter_range_saloon = $('#formControlRangeYearSaloon');
year_filter_range_saloon.change(() => {

    var query_param = "year" + year_filter_range_saloon.val();
    request_url = '/saloon/filter/?yearLt=' + query_param;

    console.log(request_url);
    window.location.href = request_url;
});


// Range Filtering
range_filter_mileage_saloon = $('#formControlRangeSaloon');
range_filter_mileage_saloon.change((changed) => {

    var query_param = range_filter_mileage_saloon.val();
    request_url = '/saloon/filter/?mileageLt=' + query_param;

    console.log(request_url);
    window.location.href = request_url;
});