$(document).ready(function () {
    var url = window.location.href;
    console.log(url);
    var curr = url.split("/")[3];
    if (curr == "suv") {
        $("#SUV").addClass('active');
    }
});

// Price Filtering
price_filter_suv = $(".form-check-input.suv");
price_filter_suv.click((clicked) => {

    var query_param = clicked.target.id;
    request_url = '/suv/filter/?priceBy=' + query_param;

    console.log(request_url);
    window.location.href = request_url;

})

price_filter_range_suv = $("#formControlRangePriceSUV");
price_filter_range_suv.change(() => {

    var query_param = "under" + price_filter_range_suv.val();
    request_url = '/suv/filter/?priceBy=' + query_param;

    console.log(request_url);
    window.location.href = request_url;
});



// Year Filtering
year_filter_suv = $('.custom-control-input.suv');
year_filter_suv.change((changed) => {

    var query_param = changed.target.id;
    request_url = '/suv/filter/?year=' + query_param;

    console.log(request_url);
    window.location.href = request_url;
});

year_filter_range_suv = $('#formControlRangeYearSUV');
year_filter_range_suv.change(() => {

    var query_param = "year" + year_filter_range_suv.val();
    request_url = '/suv/filter/?yearLt=' + query_param;

    console.log(request_url);
    window.location.href = request_url;
});


// Range Filtering
range_filter_mileage_suv = $('#formControlRangeSUV');
range_filter_mileage_suv.change((changed) => {

    var query_param = range_filter_mileage_suv.val();
    request_url = '/suv/filter/?mileageLt=' + query_param;

    console.log(request_url);
    window.location.href = request_url;
});