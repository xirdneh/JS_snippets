$(document).ready(function () {
    //var container = document.getElementById("tab_container");
    var navitem = $(".tablis");
    var ident = navitem[0].id.split("_")[1];
    navitem[0].parentNode.setAttribute("data-current", ident);
    navitem[0].setAttribute("class", "tabActiveHeader"); 
    var pages = document.querySelectorAll(".tabpage");
    console.log(pages.length);
    for (var i = 1; i < pages.length; i++) {
        pages[i].style.display = "none";
        console.log("ini" + i);
    }
    var tabs = $("ul > li");
    console.log(tabs.length);
    for (var j = 0; j < tabs.length; j++) {
        tabs[j].onclick = displayPage;
        console.log("inj" + j);
    }
});

function displayPage() {
    var current = this.parentNode.getAttribute("data-current");
    var tabs = document.querySelectorAll(".tabpage");
    document.getElementById("tabH_" + current).removeAttribute("class");
    for (var i = 0; i < tabs.length; i++){
        if (tabs[i].id.split("_")[1] == current){
            tabs[i].style.display = "none";
        }
    }
    //document.getElementById("tabC_" + current).style.display = "none";
    var ident = this.id.split("_")[1];
    this.setAttribute("class", "tabActiveHeader");
    for (var i =0; i < tabs.length; i++){
        if (tabs[i].id.split("_")[1] == ident){
            tabs[i].style.display = "block";
        }
    }
    //document.getElementById("tabC_" + ident).style.display = "block";
    this.parentNode.setAttribute("data-current", ident);
}
