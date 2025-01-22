const toggleButton = document.getElementById("toggle");
const navBar = document.querySelector(".responshiv_nav");
const layer = document.querySelector(".layer");
const closeButton = document.querySelector(".fa-xmark");

// Toggle navbar visibility and layer when the toggle button is clicked
toggleButton.addEventListener("click", () => {
  navBar.style.left = navBar.style.left === "0px" ? "-100%" : "0"; // Toggle left position
  layer.style.display =
    layer.style.display === "none" || layer.style.display === ""
      ? "block"
      : "none"; // Toggle layer visibility
});

// Close navbar and layer when the close button is clicked
closeButton.addEventListener("click", () => {
  navBar.style.left = "-100%"; // Hide navbar
  layer.style.display = "none"; // Hide layer
});

// Close navbar when the layer is clicked
layer.addEventListener("click", () => {
  navBar.style.left = "-100%"; // Hide navbar
  layer.style.display = "none"; // Hide layer
});


$(document).ready(function () {
  $(".you_may_slider").slick({
    draggable: true,
    infinite: true,
    slidesToShow: 6,
    slidesToScroll: 1,
    arrows: false,
    dots: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 400,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  });
});
$(document).ready(function () {
  $(".more_yono_slider").slick({
    draggable: true,
    infinite: true,
    slidesToShow: 6,
    slidesToScroll: 1,
    arrows: false,
    dots: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 400,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  });
});

jQuery(document).ready(function () {
  jQuery(".titleWrapper").click(function () {
    var toggle = jQuery(this).next("div#descwrapper");
    jQuery(toggle).slideToggle("slow");
  });
  jQuery(".inactive").click(function () {
    jQuery(this).toggleClass("inactive active");
  });
});
