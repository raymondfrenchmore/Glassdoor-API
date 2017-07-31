var endpoint = "http://api.glassdoor.com/api/api.htm?v=1&format=json&t.p=177283&t.k=ffvMT8m8Fem&action=employers&userip=192.168.43.42&useragent=Mozilla/%2F4.0&callback=?";
var currentPage = 1;


$(document).ready(function(){

    $(".do-search").click(searchCompanies);    
});

// Function to kick off AJAX request:
function searchCompanies(event){

    event.preventDefault();
    $("#show-results").hide();
    $("#tbl-results > tbody").empty();
    $("#error-panel").hide();
    
    var itemClicked = event.currentTarget.id;
    var pageToRequest;

    if (itemClicked == "btn-submit") {
        pageToRequest = 1;
    }
    else if (itemClicked == "next") {
        pageToRequest = ++currentPage;
    }
    else if (itemClicked == "previous") {
        pageToRequest = --currentPage;
    }


    // Build the AJAX request:
    $.getJSON(endpoint,	{	
        q: $("#input-search").val(),
        ps: 10,
        pn: pageToRequest
    })
        .done(showResults)
        .fail(showError);
}

function showResults(data){
    
    $.each( data.response.employers, function( i, employer ) {
       
        var ceoName = employer.ceo && employer.ceo.name
            ? employer.ceo.name
            : "";

        var ratings = "Company: " + employer.overallRating
            + "<br>Career Opportunities: " + employer.careerOpportunitiesRating
            + "<br>Compensation & Benefits: " + employer.compensationAndBenefitsRating
            + "<br>Culture and Values: " + employer.cultureAndValuesRating
            + "<br>Senior Leadership: " + employer.seniorLeadershipRating
            + "<br>Recommend to a Friend: " + employer.recommendToFriendRating
            + "<br>Work-life Balance: " + employer.workLifeBalanceRating
            + "<br>Total Number of Ratings: " + employer.numberOfRatings
            + (employer.ceo && employer.ceo.name && employer.ceo.numberOfRatings
                ? "<br>CEO Approval: " + employer.ceo.pctApprove + "% " + "(" + employer.ceo.numberOfRatings + " Ratings)"
                : employer.ceo && employer.ceo.name
                    ? "<br>CEO Approval: No data"
                    : "");					
        
        $("#show-results").show(); 
        $(".table").append("<tr><td>" + employer.id + "</td><td>" + employer.name  + "</td><td>" + ceoName + "</td><td>" + ratings + "</td></tr>");

        $(".page-indicator").text("Page " + data.response.currentPageNumber + " of " + data.response.totalNumberOfPages); 

        // TODO: Disable previous / next button if at first or last page
     
    });    
}

function showError(){
    $("#error-panel").show();
}