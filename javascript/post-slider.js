

// POST SLIDER
(function ($) {
	"use strict";
	$(document).ready(function () {
		$('#eskimo-post-slider').slick({
			autoplay: true,
			autoplaySpeed: 5000,
			slidesToScroll: 1,
			adaptiveHeight: true,
			slidesToShow: 1,
			arrows: true,
			dots: false,
			fade: true
		});
	});
	//$(window).on('load', function() {
	$('#eskimo-post-slider').css('opacity', '1');
	$('#eskimo-post-slider').parent().removeClass('eskimo-bg-loader');
	//});
})(jQuery);
