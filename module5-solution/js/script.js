$(function() {

    $("#navbarToggle").blur(function(event) {
        var screenWidth = window.innerWidth;
        if (screenWidth < 768) {
            $("#collapsable-nav").collapse('hide');
        }
    });
});

(function(global) {

    var dc = {};

    var homeHtmlUrl = "snippets/home-snippet.html";
    var allCategoriesUrl =
        "https://davids-restaurant.herokuapp.com/categories.json";
    var categoriesTitleHtml = "snippets/categories-title-snippet.html";
    var categoryHtml = "snippets/category-snippet.html";
    var menuItemsUrl =
        "https://davids-restaurant.herokuapp.com/menu_items.json?category=";
    var menuItemsTitleHtml = "snippets/menu-items-title.html";
    var menuItemHtml = "snippets/menu-item.html";

    var insertHtml = function(selector, html) {
        var targetElem = document.querySelector(selector);
        targetElem.innerHTML = html;
    };

    var showLoading = function(selector) {
        var html = "<div class='text-center'>";
        html += "<img src='images/ajax-loader.gif'></div>";
        insertHtml(selector, html);
    };

    var insertProperty = function(string, propName, propValue) {
        var propToReplace = "{{" + propName + "}}";
        string = string
            .replace(new RegExp(propToReplace, "g"), propValue);
        return string;
    };

    var switchMenuToActive = function() {
        var classes = document.querySelector("#navHomeButton").className;
        classes = classes.replace(new RegExp("active", "g"), "");
        document.querySelector("#navHomeButton").className = classes;

        classes = document.querySelector("#navMenuButton").className;
        if (classes.indexOf("active") === -1) {
            classes += " active";
            document.querySelector("#navMenuButton").className = classes;
        }
    };

    document.addEventListener("DOMContentLoaded", function(event) {

        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(
            allCategoriesUrl,
            buildAndShowHomeHTML,
            true);
    });


    function buildAndShowHomeHTML(categories) {

        $ajaxUtils.sendGetRequest(
            homeHtmlUrl,
            function(homeHtml) {

                var chosenCategoryShortName = chooseRandomCategory(categories).short_name;
                var homeHtmlToInsertIntoMainPage = insertProperty(homeHtml,
                    "randomCategoryShortName", "'" + chosenCategoryShortName + "'");
                insertHtml("#main-content", homeHtmlToInsertIntoMainPage);
            },
            false);
    }


    function chooseRandomCategory(categories) {
        var randomArrayIndex = Math.floor(Math.random() * categories.length);

        return categories[randomArrayIndex];
    }


    dc.loadMenuCategories = function() {
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(
            allCategoriesUrl,
            buildAndShowCategoriesHTML);
    };


    dc.loadMenuItems = function(categoryShort) {
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(
            menuItemsUrl + categoryShort,
            buildAndShowMenuItemsHTML);
    };


    function buildAndShowCategoriesHTML(categories) {
        $ajaxUtils.sendGetRequest(
            categoriesTitleHtml,
            function(categoriesTitleHtml) {
                $ajaxUtils.sendGetRequest(
                    categoryHtml,
                    function(categoryHtml) {
                        switchMenuToActive();

                        var categoriesViewHtml =
                            buildCategoriesViewHtml(categories,
                                categoriesTitleHtml,
                                categoryHtml);
                        insertHtml("#main-content", categoriesViewHtml);
                    },
                    false);
            },
            false);
    }


    function buildCategoriesViewHtml(categories,
        categoriesTitleHtml,
        categoryHtml) {

        var finalHtml = categoriesTitleHtml;
        finalHtml += "<section class='row'>";

        for (var i = 0; i < categories.length; i++) {
            var html = categoryHtml;
            var name = "" + categories[i].name;
            var short_name = categories[i].short_name;
            html =
                insertProperty(html, "name", name);
            html =
                insertProperty(html,
                    "short_name",
                    short_name);
            finalHtml += html;
        }

        finalHtml += "</section>";
        return finalHtml;
    }



    function buildAndShowMenuItemsHTML(categoryMenuItems) {
        $ajaxUtils.sendGetRequest(
            menuItemsTitleHtml,
            function(menuItemsTitleHtml) {
                $ajaxUtils.sendGetRequest(
                    menuItemHtml,
                    function(menuItemHtml) {
                        switchMenuToActive();

                        var menuItemsViewHtml =
                            buildMenuItemsViewHtml(categoryMenuItems,
                                menuItemsTitleHtml,
                                menuItemHtml);
                        insertHtml("#main-content", menuItemsViewHtml);
                    },
                    false);
            },
            false);
    }


    function buildMenuItemsViewHtml(categoryMenuItems,
        menuItemsTitleHtml,
        menuItemHtml) {

        menuItemsTitleHtml =
            insertProperty(menuItemsTitleHtml,
                "name",
                categoryMenuItems.category.name);
        menuItemsTitleHtml =
            insertProperty(menuItemsTitleHtml,
                "special_instructions",
                categoryMenuItems.category.special_instructions);

        var finalHtml = menuItemsTitleHtml;
        finalHtml += "<section class='row'>";

        var menuItems = categoryMenuItems.menu_items;
        var catShortName = categoryMenuItems.category.short_name;
        for (var i = 0; i < menuItems.length; i++) {
            var html = menuItemHtml;
            html =
                insertProperty(html, "short_name", menuItems[i].short_name);
            html =
                insertProperty(html,
                    "catShortName",
                    catShortName);
            html =
                insertItemPrice(html,
                    "price_small",
                    menuItems[i].price_small);
            html =
                insertItemPortionName(html,
                    "small_portion_name",
                    menuItems[i].small_portion_name);
            html =
                insertItemPrice(html,
                    "price_large",
                    menuItems[i].price_large);
            html =
                insertItemPortionName(html,
                    "large_portion_name",
                    menuItems[i].large_portion_name);
            html =
                insertProperty(html,
                    "name",
                    menuItems[i].name);
            html =
                insertProperty(html,
                    "description",
                    menuItems[i].description);

            if (i % 2 !== 0) {
                html +=
                    "<div class='clearfix visible-lg-block visible-md-block'></div>";
            }

            finalHtml += html;
        }

        finalHtml += "</section>";
        return finalHtml;
    }


    function insertItemPrice(html,
        pricePropName,
        priceValue) {
        if (!priceValue) {
            return insertProperty(html, pricePropName, "");
        }

        priceValue = "$" + priceValue.toFixed(2);
        html = insertProperty(html, pricePropName, priceValue);
        return html;
    }


    function insertItemPortionName(html,
        portionPropName,
        portionValue) {
        if (!portionValue) {
            return insertProperty(html, portionPropName, "");
        }

        portionValue = "(" + portionValue + ")";
        html = insertProperty(html, portionPropName, portionValue);
        return html;
    }


    global.$dc = dc;

})(window);