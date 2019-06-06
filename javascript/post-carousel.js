// POST CAROUSEL
(function ($) {
  "use strict";
  $(document).ready(function () {
    $('#eskimo-post-carousel').slick({
      infinite: false,
      slidesToScroll: 1,
      arrows: true,
      dots: false,
      slidesToShow: 3,
      responsive: [{
        breakpoint: 992,
        settings: {
          slidesToShow: 2
        }
      }, {
        breakpoint: 576,
        settings: {
          slidesToShow: 1
        }
      }]
    });
    //$(window).on('load', function() {
    $('#eskimo-post-carousel').css('opacity', '1');
    //}):
  });
})(jQuery);
