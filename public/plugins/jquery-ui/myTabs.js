$(document).ready(function()
{
    $("#myTabs").tabs();
    $("a[href=#tab-description]").click(function() {
        $("#myTabs").tabs("option", "active", 1);
    });
    $("a[href=#tab-additional_information]").click(function() {
        $("#myTabs").tabs("option", "active", 0);
    });
    $("a[href=#tab-reviews]").click(function() {
        $("#myTabs").tabs("option", "active", 2);
    });


    $('ul.tabs li').click(function(){
        $('ul.tabs li').each(function()
        {
            $(this).removeClass("active");
        });
        $(this).addClass("active");
    });
});
