"use strict";
(function () {
	// Global variables
var userAgent = navigator.userAgent.toLowerCase(),
		initialDate = new Date(),

		$document = $(document),
		$window = $(window),
		$html = $("html"),
		$body = $("body"),

		isDesktop = $html.hasClass("desktop"),
		isIE = userAgent.indexOf("msie") != -1 ? parseInt(userAgent.split("msie")[1]) : userAgent.indexOf("trident") != -1 ? 11 : userAgent.indexOf("edge") != -1 ? 12 : false,
		isSafari = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1,
		isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
		isTouch = "ontouchstart" in window,
		onloadCaptchaCallback,
		detailsBlock = document.getElementsByClassName('block-with-details'),
		plugins = {
			bootstrapDateTimePicker: $("[data-time-picker]"),
			bootstrapModalDialog: $('.modal'),
			bootstrapModalNotification: $('.notification'),
			bootstrapTabs: $(".tabs-custom-init"),
			bootstrapTooltip: $("[data-toggle='tooltip']"),
			buttonNina: $('.button-nina'),
			campaignMonitor: $('.campaign-mailform'),
			captcha: $('.recaptcha'),
			checkbox: $("input[type='checkbox']"),
			circleJPlayer: $('.jp-player-circle-init'),
			circleProgress: $(".progress-bar-circle"),
			countDown: $(".countdown"),
			counter: $(".counter"),
			customToggle: $("[data-custom-toggle]"),
			customWaypoints: $('[data-custom-scroll-to]'),
			d3Charts: $('.d3-chart'),
			dateCountdown: $('.DateCountdown'),
			flickrfeed: $(".flickr"),
			gradientMove: $('.gradient-move'),
			isotope: $(".isotope-wrap"),
			jPlayer: $('.jp-jplayer'),
			jPlayerInit: $('.jp-player-init'),
			jPlayerVideo: $('.jp-video-init'),
			lightGallery: $("[data-lightgallery='group']"),
			lightGalleryItem: $("[data-lightgallery='item']"),
			lightDynamicGalleryItem: $("[data-lightgallery='dynamic']"),
			mailchimp: $('.mailchimp-mailform'),
			mfp: $('[data-lightbox]').not('[data-lightbox="gallery"] [data-lightbox]'),
			mfpGallery: $('[data-lightbox^="gallery"]'),
			materialParallax: $(".material-parallax"),
			owl: $(".owl-carousel"),
			pageLoader: $(".page-loader"),
			parallaxText: $('.parallax-text'),
			pointerEvents: isIE < 11 ? "js/pointer-events.min.js" : false,
			popover: $('[data-toggle="popover"]'),
			productThumb: $(".product-thumbnails"),
			progressLinear: $(".progress-linear"),
			radio: $("input[type='radio']"),
			rdInputLabel: $(".form-label"),
			rdMailForm: $(".rd-mailform"),
			rdNavbar: $(".rd-navbar"),
			regula: $("[data-constraints]"),
			scroller: $(".scroll-wrap"),
			search: $(".rd-search"),
			searchResults: $('.rd-search-results'),
			selectFilter: $(".select-filter"),
			slick: $('.slick-slider'),
			statefulButton: $('.btn-stateful'),
			stepper: $("input[type='number']"),
			styleSwitcher: $('.style-switcher'),
			swiper: $(".swiper-slider"),
			typedjs: $('.typed-text-wrap'),
			videBG: $('.bg-vide'),
			videoGallery: $('#video-gallery'),
			viewAnimate: $('.view-animate'),
			maps: $(".google-map-container"),
			twitterfeed: $(".twitter"),
		};

	// Initialize scripts that require a loaded page
	$window.on('load', function () {

		// Isotope
		if ( plugins.isotope.length ) {
			for ( var i = 0; i < plugins.isotope.length; i++ ) {
				var
						wrap = plugins.isotope[ i ],
						filterHandler = function ( event ) {
							event.preventDefault();
							for ( var n = 0; n < this.isoGroup.filters.length; n++ ) this.isoGroup.filters[ n ].classList.remove( 'active' );
							this.classList.add( 'active' );
							this.isoGroup.isotope.arrange( { filter: this.getAttribute( "data-isotope-filter" ) !== '*' ? '[data-filter*="' + this.getAttribute( "data-isotope-filter" ) + '"]' : '*' } );
						},
						resizeHandler = function () {
							this.isoGroup.isotope.layout();
						};

				wrap.isoGroup = {};
				wrap.isoGroup.filters = wrap.querySelectorAll( '[data-isotope-filter]' );
				wrap.isoGroup.node = wrap.querySelector( '.isotope' );
				wrap.isoGroup.layout = wrap.isoGroup.node.getAttribute( 'data-isotope-layout' ) ? wrap.isoGroup.node.getAttribute( 'data-isotope-layout' ) : 'masonry';
				wrap.isoGroup.isotope = new Isotope( wrap.isoGroup.node, {
					itemSelector: '.isotope-item',
					layoutMode: wrap.isoGroup.layout,
					filter: '*',
				} );

				for ( var n = 0; n < wrap.isoGroup.filters.length; n++ ) {
					var filter = wrap.isoGroup.filters[ n ];
					filter.isoGroup = wrap.isoGroup;
					filter.addEventListener( 'click', filterHandler );
				}

				window.addEventListener( 'resize', resizeHandler.bind( wrap ) );
			}
		}

	});

/**
 * Initialize All Scripts
 */
$(function () {
	var isNoviBuilder = window.xMode;

	/**
	 * getSwiperHeight
	 * @description  calculate the height of swiper slider basing on data attr
	 */
	function getSwiperHeight(object, attr) {
		var val = object.attr("data-" + attr),
				dim;

		if (!val) {
			return undefined;
		}

		dim = val.match(/(px)|(%)|(vh)$/i);

		if (dim.length) {
			switch (dim[0]) {
				case "px":
					return parseFloat(val);
				case "vh":
					return $(window).height() * (parseFloat(val) / 100);
				case "%":
					return object.width() * (parseFloat(val) / 100);
			}
		} else {
			return undefined;
		}
	}

	/**
	 * toggleSwiperInnerVideos
	 * @description  toggle swiper videos on active slides
	 */
	function toggleSwiperInnerVideos(swiper) {
		var prevSlide = $(swiper.slides[swiper.previousIndex]),
				nextSlide = $(swiper.slides[swiper.activeIndex]),
				videos;

		prevSlide.find("video").each(function () {
			this.pause();
		});

		videos = nextSlide.find("video");
		if (videos.length) {
			videos.get(0).play();
		}
	}

	/**
	 * toggleSwiperCaptionAnimation
	 * @description  toggle swiper animations on active slides
	 */
	function toggleSwiperCaptionAnimation(swiper) {
		var prevSlide = $(swiper.container),
				nextSlide = $(swiper.slides[swiper.activeIndex]);

		prevSlide
		.find("[data-caption-animate]")
		.each(function () {
			var $this = $(this);
			$this
			.removeClass("animated")
			.removeClass($this.attr("data-caption-animate"))
			.addClass("not-animated");
		});

		nextSlide
		.find("[data-caption-animate]")
		.each(function () {
			var $this = $(this),
					delay = $this.attr("data-caption-delay");


			if (!isNoviBuilder) {
				setTimeout(function () {
					$this
					.removeClass("not-animated")
					.addClass($this.attr("data-caption-animate"))
					.addClass("animated");
				}, delay ? parseInt(delay) : 0);
			} else {
				$this
				.removeClass("not-animated")
			}
		});
	}

	/**
	 * initSwiperWaypoints
	 * @description  init waypoints on new slides
	 */
	function initSwiperWaypoints(swiper) {
		var prevSlide = $(swiper.container),
				nextSlide = $(swiper.slides[swiper.activeIndex]);

		prevSlide
		.find('[data-custom-scroll-to]')
		.each(function () {
			var $this = $(this);
			initCustomScrollTo($this);
		});

		nextSlide
		.find('[data-custom-scroll-to]')
		.each(function () {
			var $this = $(this);
			initCustomScrollTo($this);
		});
	}

	/**
	 * initSwiperButtonsNina
	 * @description  toggle waypoints on active slides
	 */
	function initSwiperButtonsNina(swiper) {
		var prevSlide = $(swiper.container),
				nextSlide = $(swiper.slides[swiper.activeIndex]);

		prevSlide
		.find('.button-nina')
		.each(function () {
			initNinaButtons(this);
		});

		nextSlide
		.find('.button-nina')
		.each(function () {
			initNinaButtons(this);
		});
	}

	/**
	 * makeParallax
	 * @description  create swiper parallax scrolling effect
	 */
	function makeParallax(el, speed, wrapper, prevScroll) {
		var scrollY = window.scrollY || window.pageYOffset;

		if (prevScroll != scrollY) {
			prevScroll = scrollY;
			el.addClass('no-transition');
			el[0].style['transform'] = 'translate3d(0,' + -scrollY * (1 - speed) + 'px,0)';
			el.height();
			el.removeClass('no-transition');

			if (el.attr('data-fade') === 'true') {
				var bound = el[0].getBoundingClientRect(),
						offsetTop = bound.top * 2 + scrollY,
						sceneHeight = wrapper.outerHeight(),
						sceneDevider = wrapper.offset().top + sceneHeight / 2.0,
						layerDevider = offsetTop + el.outerHeight() / 2.0,
						pos = sceneHeight / 6.0,
						opacity;
				if (sceneDevider + pos > layerDevider && sceneDevider - pos < layerDevider) {
					el[0].style["opacity"] = 1;
				} else {
					if (sceneDevider - pos < layerDevider) {
						opacity = 1 + ((sceneDevider + pos - layerDevider) / sceneHeight / 3.0 * 5);
					} else {
						opacity = 1 - ((sceneDevider - pos - layerDevider) / sceneHeight / 3.0 * 5);
					}
					el[0].style["opacity"] = opacity < 0 ? 0 : opacity > 1 ? 1 : opacity.toFixed(2);
				}
			}
		}

		requestAnimationFrame(function () {
			makeParallax(el, speed, wrapper, prevScroll);
		});
	}

	/**
	 * initCustomScrollTo
	 * @description  init smooth anchor animations
	 */
	function initCustomScrollTo(obj) {
		var $this = $(obj);
		if (!isNoviBuilder) {
			$this.on('click', function (e) {
				e.preventDefault();
				$("body, html").stop().animate({
					scrollTop: $($(this).attr('data-custom-scroll-to')).offset().top
				}, 1000, function () {
					$window.trigger("resize");
				});
			});
		}
	}

	/**
	 * initOwlCarousel
	 * @description  Init owl carousel plugin
	 */
	function initOwlCarousel(c) {
		var aliaces = ["-", "-xs-", "-sm-", "-md-", "-lg-", "-xl-"],
				values = [0, 480, 768, 992, 1200, 1600],
				responsive = {};

		for (var j = 0; j < values.length; j++) {
			responsive[values[j]] = {};
			for (var k = j; k >= -1; k--) {
				if (!responsive[values[j]]["items"] && c.attr("data" + aliaces[k] + "items")) {
					responsive[values[j]]["items"] = k < 0 ? 1 : parseInt(c.attr("data" + aliaces[k] + "items"), 10);
				}
				if (!responsive[values[j]]["stagePadding"] && responsive[values[j]]["stagePadding"] !== 0 && c.attr("data" + aliaces[k] + "stage-padding")) {
					responsive[values[j]]["stagePadding"] = k < 0 ? 0 : parseInt(c.attr("data" + aliaces[k] + "stage-padding"), 10);
				}
				if (!responsive[values[j]]["margin"] && responsive[values[j]]["margin"] !== 0 && c.attr("data" + aliaces[k] + "margin")) {
					responsive[values[j]]["margin"] = k < 0 ? 30 : parseInt(c.attr("data" + aliaces[k] + "margin"), 10);
				}
			}
		}

		// Enable custom pagination
		if (c.attr('data-dots-custom')) {
			c.on("initialized.owl.carousel", function (event) {
				var carousel = $(event.currentTarget),
						customPag = $(carousel.attr("data-dots-custom")),
						active = 0;

				if (carousel.attr('data-active')) {
					active = parseInt(carousel.attr('data-active'), 10);
				}

				carousel.trigger('to.owl.carousel', [active, 300, true]);
				customPag.find("[data-owl-item='" + active + "']").addClass("active");

				customPag.find("[data-owl-item]").on('click', function (e) {
					e.preventDefault();
					carousel.trigger('to.owl.carousel', [parseInt(this.getAttribute("data-owl-item"), 10), 300, true]);
				});

				carousel.on("translate.owl.carousel", function (event) {
					customPag.find(".active").removeClass("active");
					customPag.find("[data-owl-item='" + event.item.index + "']").addClass("active")
				});
			});
		}

		c.on("initialized.owl.carousel", function () {
			initLightGalleryItem(c.find('[data-lightgallery="item"]'), 'lightGallery-in-carousel');
		});

		if (c.attr('data-nav-custom')) {
			c.on("initialized.owl.carousel", function (event) {
				var carousel = $(event.currentTarget),
						customNav = $(carousel.attr("data-nav-custom"));

				// Custom Navigation Events
				customNav.find(".owl-arrow-next").click(function (e) {
					e.preventDefault();
					carousel.trigger('next.owl.carousel');
				});
				customNav.find(".owl-arrow-prev").click(function (e) {
					e.preventDefault();
					carousel.trigger('prev.owl.carousel');
				});
			});
		}

		if (c.attr('data-custom-nav')) {
			c.on("initialized.owl.carousel", function (event) {
				var carousel = $(event.currentTarget),
						customNav = carousel.parent().find('.owl-carousel-widget-nav');

				// Custom Navigation Events
				customNav.find(".slick-next").click(function (e) {
					e.preventDefault();
					carousel.trigger('next.owl.carousel');
				});
				customNav.find(".slick-prev").click(function (e) {
					e.preventDefault();
					carousel.trigger('prev.owl.carousel');
				});
			});
		}

		c.owlCarousel({
			autoplay: isNoviBuilder ? false : c.attr("data-autoplay") === "true",
			loop: isNoviBuilder ? false : c.attr("data-loop") !== "false",
			items: 1,
			center: c.attr("data-center") === "true",
			dotsContainer: c.attr("data-pagination-class") || false,
			navContainer: c.attr("data-navigation-class") || false,
			mouseDrag: isNoviBuilder ? false : c.attr("data-mouse-drag") !== "false",
			nav: c.attr("data-nav") === "true",
			dots: ( isNoviBuilder && c.attr("data-nav") !== "true" ) ? true : c.attr("data-dots") === "true",
			dotsEach: c.attr("data-dots-each") ? parseInt(c.attr("data-dots-each"), 10) : false,
			animateIn: c.attr('data-animation-in') ? c.attr('data-animation-in') : false,
			animateOut: c.attr('data-animation-out') ? c.attr('data-animation-out') : false,
			responsive: responsive,
			navText: c.attr("data-nav-text") ? $.parseJSON(c.attr("data-nav-text")) : [],
			navClass: c.attr("data-nav-class") ? $.parseJSON(c.attr("data-nav-class")) : ['owl-prev', 'owl-next']
		});
	}

	/**
	 * isScrolledIntoView
	 * @description  check the element whas been scrolled into the view
	 */
	function isScrolledIntoView(elem) {
		if (!isNoviBuilder) {
			return elem.offset().top + elem.outerHeight() >= $window.scrollTop() && elem.offset().top <= $window.scrollTop() + $window.height();
		}
		else {
			return true;
		}
	}

	/**
	 * Parallax text
	 * @description  function for parallax text
	 */
	function scrollText($this) {
		var translate = (scrollTop - $($this).data('orig-offset')) / $window.height() * 35;
		$($this).css({transform: 'translate3d(0,' + translate + '%' + ', 0)'});
	}

	/**
	 * @desc Calls a function when element has been scrolled into the view
	 * @param {object} element - jQuery object
	 * @param {function} func - init function
	 */
	function lazyInit(element, func) {
		var scrollHandler = function () {
			if (( !element.hasClass('lazy-loaded') && ( isScrolledIntoView(element) ) )) {
				func.call();
				element.addClass('lazy-loaded');
			}
		};

		scrollHandler();
		$window.on('scroll', scrollHandler);
	}

	/**
	 * initNinaButtons
	 * @description  Make hover effect for nina buttons
	 */
	function initNinaButtons(ninaButtons) {
		for (var i = 0; i < ninaButtons.length; i++) {
			var btn = ninaButtons[i],
					origContent = btn.innerHTML.trim();

			if (!origContent) {
				continue;
			}

			var textNode = Array.prototype.slice.call(ninaButtons[i].childNodes).filter(function (node) {
				return node.nodeType === 3;
			}).pop();
			if (textNode == null) {
				continue;
			}

			var dummy = document.createElement('div');
			btn.replaceChild(dummy, textNode);
			dummy.outerHTML = textNode.textContent.split('').map(function (letter) {
				return "<span>" + letter.trim() + "</span>";
			}).join('');

			Array.prototype.slice.call(btn.childNodes).forEach(function (el, count) {
				el.style.transition = 'opacity .22s ' + 0.03 * count + 's,' + ' transform .22s ' + 0.03 * count + 's' + ', color .22s';
			});

			btn.innerHTML += "<span class='button-original-content'>" + origContent + "</span>";

			var delay = 0.03 * (btn.childElementCount - 1);
			// btn.getElementsByClassName('button-original-content')[0].style.transitionDelay = delay + 's';
			btn.getElementsByClassName('button-original-content')[0].style.transition = 'background .22s, color .22s, transform .22s ' + delay + 's';

			btn.addEventListener('mouseenter', function (e) {
				e.stopPropagation();
			});

			btn.addEventListener('mouseleave', function (e) {
				e.stopPropagation();
			});
		}
	}

	/**
	 * Live Search
	 * @description  create live search results
	 */
	function liveSearch(options) {
		$('#' + options.live).removeClass('cleared').html();
		options.current++;
		options.spin.addClass('loading');
		$.get(handler, {
			s: decodeURI(options.term),
			liveSearch: options.live,
			dataType: "html",
			liveCount: options.liveCount,
			filter: options.filter,
			template: options.template
		}, function (data) {
			options.processed++;
			var live = $('#' + options.live);
			if ((options.processed === options.current) && !live.hasClass('cleared')) {
				live.find('> #search-results').removeClass('active');
				live.html(data);
				setTimeout(function () {
					live.find('> #search-results').addClass('active');
				}, 50);
			}
			options.spin.parents('.rd-search').find('.input-group-addon').removeClass('loading');
		})
	}

	/**
	 * attachFormValidator
	 * @description  attach form validation to elements
	 */
	function attachFormValidator(elements) {
		for (var i = 0; i < elements.length; i++) {
			var o = $(elements[i]), v;
			o.addClass("form-control-has-validation").after("<span class='form-validation'></span>");
			v = o.parent().find(".form-validation");
			if (v.is(":last-child")) {
				o.addClass("form-control-last-child");
			}
		}

		elements
		.on('input change propertychange blur', function (e) {
			var $this = $(this), results;

			if (e.type != "blur") {
				if (!$this.parent().hasClass("has-error")) {
					return;
				}
			}

			if ($this.parents('.rd-mailform').hasClass('success')) {
				return;
			}

			if ((results = $this.regula('validate')).length) {
				for (i = 0; i < results.length; i++) {
					$this.siblings(".form-validation").text(results[i].message).parent().addClass("has-error")
				}
			} else {
				$this.siblings(".form-validation").text("").parent().removeClass("has-error")
			}
		})
		.regula('bind');

		var regularConstraintsMessages = [
			{
				type: regula.Constraint.Required,
				newMessage: "The text field is required."
			},
			{
				type: regula.Constraint.Email,
				newMessage: "The email is not a valid email."
			},
			{
				type: regula.Constraint.Numeric,
				newMessage: "Only numbers are required"
			},
			{
				type: regula.Constraint.Selected,
				newMessage: "Please choose an option."
			}
		];


		for (var i = 0; i < regularConstraintsMessages.length; i++) {
			var regularConstraint = regularConstraintsMessages[i];

			regula.override({
				constraintType: regularConstraint.type,
				defaultMessage: regularConstraint.newMessage
			});
		}
	}

	/**
	 * @desc Check if all elements pass validation
	 * @param {object} elements - object of items for validation
	 * @param {object} captcha - captcha object for validation
	 * @return {boolean}
	 */
	function isValidated(elements, captcha) {
		var results, errors = 0;

		if (elements.length) {
			for (var j = 0; j < elements.length; j++) {

				var $input = $(elements[j]);
				if ((results = $input.regula('validate')).length) {
					for (k = 0; k < results.length; k++) {
						errors++;
						$input.siblings(".form-validation").text(results[k].message).parent().addClass("has-error");
					}
				} else {
					$input.siblings(".form-validation").text("").parent().removeClass("has-error")
				}
			}

			if (captcha) {
				if (captcha.length) {
					return validateReCaptcha(captcha) && errors === 0
				}
			}

			return errors === 0;
		}
		return true;
	}

	/**
	 * @desc Validate google reCaptcha
	 * @param {object} captcha - captcha object for validation
	 * @return {boolean}
	 */
	function validateReCaptcha(captcha) {
		var captchaToken = captcha.find('.g-recaptcha-response').val();

		if (captchaToken.length === 0) {
			captcha
			.siblings('.form-validation')
			.html('Please, prove that you are not robot.')
			.addClass('active');
			captcha
			.closest('.form-wrap')
			.addClass('has-error');

			captcha.on('propertychange', function () {
				var $this = $(this),
						captchaToken = $this.find('.g-recaptcha-response').val();

				if (captchaToken.length > 0) {
					$this
					.closest('.form-wrap')
					.removeClass('has-error');
					$this
					.siblings('.form-validation')
					.removeClass('active')
					.html('');
					$this.off('propertychange');
				}
			});

			return false;
		}

		return true;
	}

	/**
	 * @desc Initialize Google reCaptcha
	 */
	window.onloadCaptchaCallback = function () {
		for (var i = 0; i < plugins.captcha.length; i++) {
			var $capthcaItem = $(plugins.captcha[i]);

			grecaptcha.render(
					$capthcaItem.attr('id'),
					{
						sitekey: $capthcaItem.attr('data-sitekey'),
						size: $capthcaItem.attr('data-size') ? $capthcaItem.attr('data-size') : 'normal',
						theme: $capthcaItem.attr('data-theme') ? $capthcaItem.attr('data-theme') : 'light',
						callback: function (e) {
							$('.recaptcha').trigger('propertychange');
						}
					}
			);
			$capthcaItem.after("<span class='form-validation'></span>");
		}
	};

	/**
	 * Init Bootstrap tooltip
	 * @description  calls a function when need to init bootstrap tooltips
	 */
	function initBootstrapTooltip(tooltipPlacement) {
		plugins.bootstrapTooltip.tooltip('dispose');

		if (window.innerWidth < 576) {
			plugins.bootstrapTooltip.tooltip({placement: 'bottom'});
		} else {
			plugins.bootstrapTooltip.tooltip({placement: tooltipPlacement});
		}
	}

	/**
	 * lightGallery
	 * @description Enables lightGallery plugin
	 */
	function initLightGallery(itemsToInit, addClass) {
		if (!isNoviBuilder) {
			$(itemsToInit).lightGallery({
				thumbnail: $(itemsToInit).attr("data-lg-thumbnail") !== "false",
				selector: "[data-lightgallery='item']",
				autoplay: $(itemsToInit).attr("data-lg-autoplay") === "true",
				pause: parseInt($(itemsToInit).attr("data-lg-autoplay-delay")) || 5000,
				addClass: addClass,
				mode: $(itemsToInit).attr("data-lg-animation") || "lg-slide",
				loop: $(itemsToInit).attr("data-lg-loop") !== "false"
			});
		}
	}

	function initDynamicLightGallery(itemsToInit, addClass) {
		if (!isNoviBuilder) {
			$(itemsToInit).on("click", function () {
				$(itemsToInit).lightGallery({
					thumbnail: $(itemsToInit).attr("data-lg-thumbnail") !== "false",
					selector: "[data-lightgallery='item']",
					autoplay: $(itemsToInit).attr("data-lg-autoplay") === "true",
					pause: parseInt($(itemsToInit).attr("data-lg-autoplay-delay")) || 5000,
					addClass: addClass,
					mode: $(itemsToInit).attr("data-lg-animation") || "lg-slide",
					loop: $(itemsToInit).attr("data-lg-loop") !== "false",
					dynamic: true,
					dynamicEl:
					JSON.parse($(itemsToInit).attr("data-lg-dynamic-elements")) || []
				});
			});
		}
	}

	function initLightGalleryItem(itemToInit, addClass) {
		if (!isNoviBuilder) {
			$(itemToInit).lightGallery({
				selector: "this",
				addClass: addClass,
				counter: false,
				youtubePlayerParams: {
					modestbranding: 1,
					showinfo: 0,
					rel: 0,
					controls: 0
				},
				vimeoPlayerParams: {
					byline: 0,
					portrait: 0
				}
			});
		}
	}

	if (plugins.lightGallery.length) {
		for (var i = 0; i < plugins.lightGallery.length; i++) {
			initLightGallery(plugins.lightGallery[i]);
		}
	}

	if (plugins.lightGalleryItem.length) {
		for (var i = 0; i < plugins.lightGalleryItem.length; i++) {
			initLightGalleryItem(plugins.lightGalleryItem[i]);
		}
	}

	if (plugins.lightDynamicGalleryItem.length) {
		for (var i = 0; i < plugins.lightDynamicGalleryItem.length; i++) {
			initDynamicLightGallery(plugins.lightDynamicGalleryItem[i]);
		}
	}


	/**
	 * Copyright Year
	 * @description  Evaluates correct copyright year
	 */
	var o = $(".copyright-year");
	if (o.length) {
		o.text(initialDate.getFullYear());
	}

	/**
	 * Page loader
	 * @description Enables Page loader
	 */
	if (plugins.pageLoader.length > 0) {
		var loader = setTimeout(function () {
			plugins.pageLoader.addClass("loaded");
			plugins.pageLoader.fadeOut(100, function () {
				$(this).remove();
			});

			$window.trigger("resize");
		}, 1000);
	}

	// Google ReCaptcha
	if (plugins.captcha.length) {
		$.getScript("//www.google.com/recaptcha/api.js?onload=onloadCaptchaCallback&render=explicit&hl=en");
	}

	/**
	 * Is Mac os
	 * @description  add additional class on html if mac os.
	 */
	if (navigator.platform.match(/(Mac)/i)) $html.addClass("mac-os");

	/**
	 * Is Safari
	 * @description  add additional class on html if safari.
	 */
	if (isSafari) $html.addClass("safari");

	/**
	 * IE Polyfills
	 * @description  Adds some loosing functionality to IE browsers
	 */
	if (isIE) {
		if (isIE < 10) {
			$html.addClass("lt-ie-10");
		}

		if (isIE < 11) {
			if (plugins.pointerEvents) {
				$.getScript(plugins.pointerEvents)
				.done(function () {
					$html.addClass("ie-10");
					PointerEventsPolyfill.initialize({});
				});
			}
		}

		if (isIE === 11) {
			$("html").addClass("ie-11");
		}

		if (isIE === 12) {
			$("html").addClass("ie-edge");
		}
	}

	/**
	 * Bootstrap Tooltips
	 * @description Activate Bootstrap Tooltips
	 */
	if (plugins.bootstrapTooltip.length && !isNoviBuilder) {
		var tooltipPlacement = plugins.bootstrapTooltip.attr('data-placement');
		initBootstrapTooltip(tooltipPlacement);
		$(window).on('resize orientationchange', function () {
			initBootstrapTooltip(tooltipPlacement);
		})
	}

	/**
	 * bootstrapModalDialog
	 * @description Stop video in bootstrapModalDialog
	 */
	if (plugins.bootstrapModalDialog.length > 0) {
		var i = 0;

		for (i = 0; i < plugins.bootstrapModalDialog.length; i++) {
			var modalItem = $(plugins.bootstrapModalDialog[i]);

			modalItem.on('hidden.bs.modal', $.proxy(function () {
				var activeModal = $(this),
						rdVideoInside = activeModal.find('video'),
						youTubeVideoInside = activeModal.find('iframe');

				if (rdVideoInside.length) {
					rdVideoInside[0].pause();
				}

				if (youTubeVideoInside.length) {
					var videoUrl = youTubeVideoInside.attr('src');

					youTubeVideoInside
					.attr('src', '')
					.attr('src', videoUrl);
				}
			}, modalItem))
		}
	}

	/**
	 * JQuery mousewheel plugin
	 * @description  Enables jquery mousewheel plugin
	 */
	if (plugins.scroller.length) {
		var i;
		for (i = 0; i < plugins.scroller.length; i++) {
			var scrollerItem = $(plugins.scroller[i]);

			scrollerItem.mCustomScrollbar({
				theme: scrollerItem.attr('data-theme') ? scrollerItem.attr('data-theme') : 'minimal',
				scrollInertia: 100,
				scrollButtons: {enable: false}
			});
		}
	}


	/**
	 * Google map function for getting latitude and longitude
	 */
	function getLatLngObject(str, marker, map, callback) {
		var coordinates = {};
		try {
			coordinates = JSON.parse(str);
			callback(new google.maps.LatLng(
					coordinates.lat,
					coordinates.lng
			), marker, map)
		} catch (e) {
			map.geocoder.geocode({'address': str}, function (results, status) {
				if (status === google.maps.GeocoderStatus.OK) {
					var latitude = results[0].geometry.location.lat();
					var longitude = results[0].geometry.location.lng();

					callback(new google.maps.LatLng(
							parseFloat(latitude),
							parseFloat(longitude)
					), marker, map)
				}
			})
		}
	}

	/**
	 * @desc Initialize Google maps
	 */
	function initMaps() {
		var key;

		for (var i = 0; i < plugins.maps.length; i++) {
			if (plugins.maps[i].hasAttribute("data-key")) {
				key = plugins.maps[i].getAttribute("data-key");
				break;
			}
		}

		$.getScript('//maps.google.com/maps/api/js?' + ( key ? 'key=' + key + '&' : '' ) + 'sensor=false&libraries=geometry,places&v=quarterly', function () {
			var head = document.getElementsByTagName('head')[0],
					insertBefore = head.insertBefore;

			head.insertBefore = function (newElement, referenceElement) {
				if (newElement.href && newElement.href.indexOf('//fonts.googleapis.com/css?family=Roboto') !== -1 || newElement.innerHTML.indexOf('gm-style') !== -1) {
					return;
				}
				insertBefore.call(head, newElement, referenceElement);
			};

			var geocoder = new google.maps.Geocoder;
			for (var i = 0; i < plugins.maps.length; i++) {
				var zoom = parseInt(plugins.maps[i].getAttribute("data-zoom")) || 11;
				var styles;
				if (plugins.maps[i].hasAttribute('data-styles')) {
					try {
						styles = JSON.parse(plugins.maps[i].getAttribute("data-styles"));
					}
					catch (error) {
						styles = [];
					}
				}
				var center = plugins.maps[i].getAttribute("data-center");

				// Initialize map
				var map = new google.maps.Map(plugins.maps[i].querySelectorAll(".google-map")[0], {
					zoom: zoom,
					styles: styles,
					scrollwheel: false,
					center: {lat: 0, lng: 0}
				});
				// Add map object to map node
				plugins.maps[i].map = map;
				plugins.maps[i].geocoder = geocoder;
				plugins.maps[i].keySupported = true;
				plugins.maps[i].google = google;

				// Get Center coordinates from attribute
				getLatLngObject(center, null, plugins.maps[i], function (location, markerElement, mapElement) {
					mapElement.map.setCenter(location);
				})

				// Add markers from google-map-markers array
				var markerItems = plugins.maps[i].querySelectorAll(".google-map-markers li");
				if (markerItems.length) {
					var markers = [];
					for (var j = 0; j < markerItems.length; j++) {
						var markerElement = markerItems[j];
						getLatLngObject(markerElement.getAttribute("data-location"), markerElement, plugins.maps[i], function (location, markerElement, mapElement) {
							var icon = markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon");
							var activeIcon = markerElement.getAttribute("data-icon-active") || mapElement.getAttribute("data-icon-active");
							var info = markerElement.getAttribute("data-description") || "";
							var infoWindow = new google.maps.InfoWindow({
								content: info
							});
							markerElement.infoWindow = infoWindow;
							var markerData = {
								position: location,
								map: mapElement.map
							}
							if (icon) {
								markerData.icon = icon;
							}
							var marker = new google.maps.Marker(markerData);
							markerElement.gmarker = marker;
							markers.push({markerElement: markerElement, infoWindow: infoWindow});
							marker.isActive = false;
							// Handle infoWindow close click
							google.maps.event.addListener(infoWindow, 'closeclick', (function (markerElement, mapElement) {
								var markerIcon;
								markerElement.gmarker.isActive = false
								if (markerIcon = markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon")) {
									markerElement.gmarker.setIcon(markerIcon);
								}
							}).bind(this, markerElement, mapElement));


							// Set marker active on Click and open infoWindow
							google.maps.event.addListener(marker, 'click', (function (markerElement, mapElement) {
								if (markerElement.infoWindow.getContent().length === 0) return;
								var gMarker, currentMarker = markerElement.gmarker, currentInfoWindow;
								for (var k = 0; k < markers.length; k++) {
									var markerIcon;
									if (markers[k].markerElement === markerElement) {
										currentInfoWindow = markers[k].infoWindow;
									}
									gMarker = markers[k].markerElement.gmarker;
									if (gMarker.isActive && markers[k].markerElement !== markerElement) {
										gMarker.isActive = false;
										if (markerIcon = markers[k].markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon")) {
											gMarker.setIcon(markerIcon);
										}
										markers[k].infoWindow.close();
									}
								}

								currentMarker.isActive = !currentMarker.isActive;
								if (currentMarker.isActive) {
									if (markerIcon = markerElement.getAttribute("data-icon-active") || mapElement.getAttribute("data-icon-active")) {
										currentMarker.setIcon(markerIcon);
									}

									currentInfoWindow.open(map, marker);
								} else {
									if (markerIcon = markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon")) {
										currentMarker.setIcon(markerIcon);
									}
									currentInfoWindow.close();
								}
							}).bind(this, markerElement, mapElement))
						})
					}
				}
			}
		});
	}

	// Google maps
	if (plugins.maps.length) {
		lazyInit(plugins.maps, initMaps);
	}

	/**
	 * Radio
	 * @description Add custom styling options for input[type="radio"]
	 */
	if (plugins.radio.length) {
		var i;
		for (i = 0; i < plugins.radio.length; i++) {
			var $this = $(plugins.radio[i]);
			$this.addClass("radio-custom").after("<span class='radio-custom-dummy'></span>")
		}
	}

	/**
	 * Checkbox
	 * @description Add custom styling options for input[type="checkbox"]
	 */
	if (plugins.checkbox.length) {
		var i;
		for (i = 0; i < plugins.checkbox.length; i++) {
			var $this = $(plugins.checkbox[i]);
			$this.addClass("checkbox-custom").after("<span class='checkbox-custom-dummy'></span>")
		}
	}

	/**
	 * Popovers
	 * @description Enables Popovers plugin
	 */
	if (plugins.popover.length) {
		if (window.innerWidth < 767) {
			plugins.popover.attr('data-placement', 'bottom');
			plugins.popover.popover();
		}
		else {
			plugins.popover.popover();
		}
	}

	/**
	 * Bootstrap Buttons
	 * @description  Enable Bootstrap Buttons plugin
	 */
	if (plugins.statefulButton.length) {
		$(plugins.statefulButton).on('click', function () {
			var statefulButtonLoading = $(this).button('loading');

			setTimeout(function () {
				statefulButtonLoading.button('reset')
			}, 2000);
		})
	}

	/**
	 * UI To Top
	 * @description Enables ToTop Button
	 */
	if (isDesktop && !isNoviBuilder) {
		$().UItoTop({
			easingType: 'easeOutQuart',
			containerClass: 'ui-to-top'
		});
	}

	/**
	 * RD Navbar
	 * @description Enables RD Navbar plugin
	 */
	if (plugins.rdNavbar.length) {
		var aliaces, i, j, len, value, values, responsiveNavbar;

		aliaces = ["-", "-sm-", "-md-", "-lg-", "-xl-", "-xxl-"];
		values = [0, 576, 768, 992, 1200, 1600];
		responsiveNavbar = {};

		for (i = j = 0, len = values.length; j < len; i = ++j) {
			value = values[i];
			if (!responsiveNavbar[values[i]]) {
				responsiveNavbar[values[i]] = {};
			}
			if (plugins.rdNavbar.attr('data' + aliaces[i] + 'layout')) {
				responsiveNavbar[values[i]].layout = plugins.rdNavbar.attr('data' + aliaces[i] + 'layout');
			}
			if (plugins.rdNavbar.attr('data' + aliaces[i] + 'device-layout')) {
				responsiveNavbar[values[i]]['deviceLayout'] = plugins.rdNavbar.attr('data' + aliaces[i] + 'device-layout');
			}
			if (plugins.rdNavbar.attr('data' + aliaces[i] + 'hover-on')) {
				responsiveNavbar[values[i]]['focusOnHover'] = plugins.rdNavbar.attr('data' + aliaces[i] + 'hover-on') === 'true';
			}
			if (plugins.rdNavbar.attr('data' + aliaces[i] + 'auto-height')) {
				responsiveNavbar[values[i]]['autoHeight'] = plugins.rdNavbar.attr('data' + aliaces[i] + 'auto-height') === 'true';
			}

			if (isNoviBuilder) {
				responsiveNavbar[values[i]]['stickUp'] = false;
			} else if (plugins.rdNavbar.attr('data' + aliaces[i] + 'stick-up')) {
				responsiveNavbar[values[i]]['stickUp'] = plugins.rdNavbar.attr('data' + aliaces[i] + 'stick-up') === 'true';
			}

			if (plugins.rdNavbar.attr('data' + aliaces[i] + 'stick-up-offset')) {
				responsiveNavbar[values[i]]['stickUpOffset'] = plugins.rdNavbar.attr('data' + aliaces[i] + 'stick-up-offset');
			}
		}


		plugins.rdNavbar.RDNavbar({
			anchorNav: !isNoviBuilder,
			stickUpClone: (plugins.rdNavbar.attr("data-stick-up-clone") && !isNoviBuilder) ? plugins.rdNavbar.attr("data-stick-up-clone") === 'true' : false,
			responsive: responsiveNavbar,
			callbacks: {
				onStuck: function () {
					var navbarSearch = this.$element.find('.rd-search input');

					if (navbarSearch) {
						navbarSearch.val('').trigger('propertychange');
					}
				},
				onDropdownOver: function () {
					return !isNoviBuilder;
				},
				onUnstuck: function () {
					if (this.$clone === null)
						return;

					var navbarSearch = this.$clone.find('.rd-search input');

					if (navbarSearch) {
						navbarSearch.val('').trigger('propertychange');
						navbarSearch.trigger('blur');
					}

				}
			}
		});


		if (plugins.rdNavbar.attr("data-body-class")) {
			document.body.className += ' ' + plugins.rdNavbar.attr("data-body-class");
		}
	}

	/**
	 * RD Search
	 * @description Enables search
	 */
	if (plugins.search.length || plugins.searchResults) {
		var handler = "bat/rd-search.php";
		var defaultTemplate = '<h5 class="search-title"><a target="_top" href="#{href}" class="search-link">#{title}</a></h5>' +
				'<p>...#{token}...</p>' +
				'<p class="match"><em>Terms matched: #{count} - URL: #{href}</em></p>';
		var defaultFilter = '*.html';

		if (plugins.search.length) {
			for (var i = 0; i < plugins.search.length; i++) {
				var searchItem = $(plugins.search[i]),
						options = {
							element: searchItem,
							filter: (searchItem.attr('data-search-filter')) ? searchItem.attr('data-search-filter') : defaultFilter,
							template: (searchItem.attr('data-search-template')) ? searchItem.attr('data-search-template') : defaultTemplate,
							live: (searchItem.attr('data-search-live')) ? searchItem.attr('data-search-live') : false,
							liveCount: (searchItem.attr('data-search-live-count')) ? parseInt(searchItem.attr('data-search-live'), 10) : 4,
							current: 0, processed: 0, timer: {}
						};

				var $toggle = $('.rd-navbar-search-toggle');
				if ($toggle.length) {
					$toggle.on('click', (function (searchItem) {
						return function () {
							if (!($(this).hasClass('active'))) {
								searchItem.find('input').val('').trigger('propertychange');
							}
						}
					})(searchItem));
				}

				if (options.live) {
					var clearHandler = false;

					searchItem.find('input').on("input propertychange", $.proxy(function () {
						this.term = this.element.find('input').val().trim();
						this.spin = this.element.find('.input-group-addon');

						clearTimeout(this.timer);

						if (this.term.length > 2) {
							this.timer = setTimeout(liveSearch(this), 200);

							if (clearHandler === false) {
								clearHandler = true;

								$body.on("click", function (e) {
									if ($(e.toElement).parents('.rd-search').length === 0) {
										$('#rd-search-results-live').addClass('cleared').html('');
									}
								})
							}

						} else if (this.term.length === 0) {
							$('#' + this.live).addClass('cleared').html('');
						}
					}, options, this));
				}

				searchItem.submit($.proxy(function () {
					$('<input />').attr('type', 'hidden')
					.attr('name', "filter")
					.attr('value', this.filter)
					.appendTo(this.element);
					return true;
				}, options, this))
			}
		}

		if (plugins.searchResults.length) {
			var regExp = /\?.*s=([^&]+)\&filter=([^&]+)/g;
			var match = regExp.exec(location.search);

			if (match !== null) {
				$.get(handler, {
					s: decodeURI(match[1]),
					dataType: "html",
					filter: match[2],
					template: defaultTemplate,
					live: ''
				}, function (data) {
					plugins.searchResults.html(data);
				})
			}
		}
	}

	/**
	 * ViewPort Universal
	 * @description Add class in viewport
	 */
	if (plugins.viewAnimate.length) {
		var i;
		for (i = 0; i < plugins.viewAnimate.length; i++) {
			var $view = $(plugins.viewAnimate[i]).not('.active');
			$document.on("scroll", $.proxy(function () {
				if (isScrolledIntoView(this)) {
					this.addClass("active");
				}
			}, $view))
			.trigger("scroll");
		}
	}

	/**
	 * Swiper 3.1.7
	 * @description  Enable Swiper Slider
	 */
	if (plugins.swiper.length) {
		for (var i = 0; i < plugins.swiper.length; i++) {
			var s = $(plugins.swiper[i]);
			var pag = s.find(".swiper-pagination"),
					next = s.find(".swiper-button-next"),
					prev = s.find(".swiper-button-prev"),
					bar = s.find(".swiper-scrollbar"),
					swiperSlide = s.find(".swiper-slide"),
					autoplay = false;

			for (var j = 0; j < swiperSlide.length; j++) {
				var $this = $(swiperSlide[j]),
						url;

				if (url = $this.attr("data-slide-bg")) {
					$this.css({
						"background-image": "url(" + url + ")",
						"background-size": "cover"
					})
				}
			}

			swiperSlide.end()
			.find("[data-caption-animate]")
			.addClass("not-animated")
			.end();

			var swiperOptions = {
				autoplay: !isNoviBuilder && $.isNumeric(s.attr('data-autoplay')) ? s.attr('data-autoplay') : false,
				direction: s.attr('data-direction') ? s.attr('data-direction') : "horizontal",
				effect: s.attr('data-slide-effect') ? s.attr('data-slide-effect') : "slide",
				speed: s.attr('data-slide-speed') ? s.attr('data-slide-speed') : 600,
				keyboardControl: s.attr('data-keyboard') === "true",
				mousewheelControl: s.attr('data-mousewheel') === "true",
				mousewheelReleaseOnEdges: s.attr('data-mousewheel-release') === "true",
				nextButton: next.length ? next.get(0) : null,
				prevButton: prev.length ? prev.get(0) : null,
				pagination: pag.length ? pag.get(0) : null,
				paginationClickable: pag.length ? pag.attr("data-clickable") !== "false" : false,
				paginationBulletRender: pag.length ? pag.attr("data-index-bullet") === "true" ? function (swiper, index, className) {
					return '<span class="' + className + '">' + (index + 1) + '</span>';
				} : null : null,
				scrollbar: bar.length ? bar.get(0) : null,
				scrollbarDraggable: bar.length ? bar.attr("data-draggable") !== "false" : true,
				scrollbarHide: bar.length ? bar.attr("data-draggable") === "false" : false,
				loop: isNoviBuilder ? false : s.attr('data-loop') !== "false",
				simulateTouch: s.attr('data-simulate-touch') && !isNoviBuilder ? s.attr('data-simulate-touch') === "true" : false,
				onTransitionStart: function (swiper) {
					toggleSwiperInnerVideos(swiper);
				},
				onTransitionEnd: function (swiper) {
					toggleSwiperCaptionAnimation(swiper);
				},
				onInit: function (swiper) {
					toggleSwiperInnerVideos(swiper);
					toggleSwiperCaptionAnimation(swiper);
					initSwiperButtonsNina(swiper);
					initSwiperWaypoints(swiper);

					var slideButtons = swiper.slides.find('.button');

					slideButtons.hover(function () {
						swiper.stopAutoplay();
					}, function () {
						swiper.startAutoplay();
					});

					var swiperParalax = s.find(".swiper-parallax");

					for (var k = 0; k < swiperParalax.length; k++) {
						var $this = $(swiperParalax[k]),
								speed;

						if (parallax && !isIE && !isMobile) {
							if (speed = $this.attr("data-speed")) {
								makeParallax($this, speed, s, false);
							}
						}
					}
					$(window).on('resize', function () {
						swiper.update(true);
					})
				}
			};

			plugins.swiper[i] = s.swiper(swiperOptions);

			$window.on("resize", (function (s) {
				return function () {
					var mh = getSwiperHeight(s, "min-height"),
							h = getSwiperHeight(s, "height");
					if (h) {
						s.css("height", mh ? mh > h ? mh : h : h);
					}
				}
			})(s)).trigger("resize");
		}
	}

	/**
	 * Owl carousel
	 * @description Enables Owl carousel plugin
	 */
	if (plugins.owl.length) {
		for (var i = 0; i < plugins.owl.length; i++) {
			var c = $(plugins.owl[i]);
			plugins.owl[i].owl = c;

			initOwlCarousel(c);
		}
	}

	/**
	 * RD Flickr Feed
	 * @description Enables RD Flickr Feed plugin
	 */
	if (plugins.flickrfeed.length > 0) {
		var i;
		for (i = 0; i < plugins.flickrfeed.length; i++) {
			var flickrfeedItem = $(plugins.flickrfeed[i]);
			flickrfeedItem.RDFlickr({
				callback: function () {
					var items = flickrfeedItem.find("[data-lightgallery]");

					if (items.length) {
						for (var j = 0; j < items.length; j++) {
							var image = new Image();
							image.setAttribute('data-index', j);
							image.onload = function () {
								items[this.getAttribute('data-index')].setAttribute('data-size', this.naturalWidth + 'x' + this.naturalHeight);
							};
							image.src = items[j].getAttribute('href');
						}
					}
				}
			});
		}
	}


	/**
	 * Bootstrap tabs
	 * @description Activate Bootstrap Tabs
	 */
	if (plugins.bootstrapTabs.length) {
		var i;
		for (i = 0; i < plugins.bootstrapTabs.length; i++) {
			var bootstrapTabsItem = $(plugins.bootstrapTabs[i]);

			//If have owl carousel inside tab - resize owl carousel on click
			if (bootstrapTabsItem.find('.owl-carousel').length) {
				// init first open tab

				var carouselObj = bootstrapTabsItem.find('.tab-content .tab-pane.show .owl-carousel');

				initOwlCarousel(carouselObj);

				//init owl carousel on tab change
				bootstrapTabsItem.find('.nav-custom a').on('click', $.proxy(function () {
					var $this = $(this);

					$this.find('.owl-carousel').trigger('destroy.owl.carousel').removeClass('owl-loaded');
					$this.find('.owl-carousel').find('.owl-stage-outer').children().unwrap();

					setTimeout(function () {
						var carouselObj = $this.find('.tab-content .tab-pane.active .owl-carousel');

						if (carouselObj.length) {
							for (var j = 0; j < carouselObj.length; j++) {
								var carouselItem = $(carouselObj[j]);
								initOwlCarousel(carouselItem);
							}
						}

					}, isNoviBuilder ? 1500 : 300);

				}, bootstrapTabsItem));
			}

			//If have slick carousel inside tab - resize slick carousel on click
			if (bootstrapTabsItem.find('.slick-slider').length) {
				bootstrapTabsItem.find('.tabs-custom-list > li > a').on('click', $.proxy(function () {
					var $this = $(this);
					var setTimeOutTime = isNoviBuilder ? 1500 : 300;

					setTimeout(function () {
						$this.find('.tab-content .tab-pane.active .slick-slider').slick('setPosition');
					}, setTimeOutTime);
				}, bootstrapTabsItem));
			}
		}
	}

	/**
	 * RD Input Label
	 * @description Enables RD Input Label Plugin
	 */
	if (plugins.rdInputLabel.length) {
		plugins.rdInputLabel.RDInputLabel();
	}

	/**
	 * Regula
	 * @description Enables Regula plugin
	 */
	if (plugins.regula.length) {
		attachFormValidator(plugins.regula);
	}

	/**
	 * MailChimp Ajax subscription
	 */
	if (plugins.mailchimp.length) {
		$.each(plugins.mailchimp, function (index, form) {
			var $form = $(form),
					$email = $form.find('input[type=email]'),
					$output = $("#" + plugins.mailchimp.attr("data-form-output"));

			// Required by MailChimp
			$form.attr('novalidate', 'true');
			$email.attr('name', 'EMAIL');

			$form.submit(function (e) {
				var data = {},
						url = $form.attr('action').replace('/post?', '/post-json?').concat('&c=?'),
						dataArray = $form.serializeArray();

				$.each(dataArray, function (index, item) {
					data[item.name] = item.value;
				});

				$.ajax({
					data: data,
					url: url,
					dataType: 'jsonp',
					error: function (resp, text) {
						$output.html('Server error: ' + text);

						setTimeout(function () {
							$output.removeClass("active");
						}, 4000);
					},
					success: function (resp) {
						$output.html(resp.msg).addClass('active');

						setTimeout(function () {
							$output.removeClass("active");
						}, 6000);
					},
					beforeSend: function (data) {
						// Stop request if builder or inputs are invalide
						if (isNoviBuilder || !isValidated($form.find('[data-constraints]')))
							return false;

						$output.html('Submitting...').addClass('active');
					}
				});

				return false;
			});
		});
	}

	/**
	 * Campaign Monitor ajax subscription
	 */
	if (plugins.campaignMonitor.length) {
		$.each(plugins.campaignMonitor, function (index, form) {
			var $form = $(form),
					$output = $("#" + plugins.campaignMonitor.attr("data-form-output"));

			$form.submit(function (e) {
				var data = {},
						url = $form.attr('action'),
						dataArray = $form.serializeArray();

				$.each(dataArray, function (index, item) {
					data[item.name] = item.value;
				});

				$.ajax({
					data: data,
					url: url,
					dataType: 'jsonp',
					error: function (resp, text) {
						$output.html('Server error: ' + text);

						setTimeout(function () {
							$output.removeClass("active");
						}, 4000);
					},
					success: function (resp) {
						console.log(resp);

						$output.html(resp.Message).addClass('active');

						setTimeout(function () {
							$output.removeClass("active");
						}, 6000);
					},
					beforeSend: function (data) {
						// Stop request if builder or inputs are invalide
						if (isNoviBuilder || !isValidated($form.find('[data-constraints]')))
							return false;

						$output.html('Submitting...').addClass('active');
					}
				});

				return false;
			});
		});
	}

	/**
	 * RD Mailform
	 * @version      3.2.0
	 */
	if (plugins.rdMailForm.length) {
		var i, j, k,
				msg = {
					'MF000': 'Successfully sent!',
					'MF001': 'Recipients are not set!',
					'MF002': 'Form will not work locally!',
					'MF003': 'Please, define email field in your form!',
					'MF004': 'Please, define type of your form!',
					'MF254': 'Something went wrong with PHPMailer!',
					'MF255': 'Aw, snap! Something went wrong.'
				};

		for (i = 0; i < plugins.rdMailForm.length; i++) {
			var $form = $(plugins.rdMailForm[i]),
					formHasCaptcha = false;

			$form.attr('novalidate', 'novalidate').ajaxForm({
				data: {
					"form-type": $form.attr("data-form-type") || "contact",
					"counter": i
				},
				beforeSubmit: function (arr, $form, options) {
					if (isNoviBuilder)
						return;

					var form = $(plugins.rdMailForm[this.extraData.counter]),
							inputs = form.find("[data-constraints]"),
							output = $("#" + form.attr("data-form-output")),
							captcha = form.find('.recaptcha'),
							captchaFlag = true;

					output.removeClass("active error success");

					if (isValidated(inputs, captcha)) {

						// veify reCaptcha
						if (captcha.length) {
							var captchaToken = captcha.find('.g-recaptcha-response').val(),
									captchaMsg = {
										'CPT001': 'Please, setup you "site key" and "secret key" of reCaptcha',
										'CPT002': 'Something wrong with google reCaptcha'
									};

							formHasCaptcha = true;

							$.ajax({
								method: "POST",
								url: "bat/reCaptcha.php",
								data: {'g-recaptcha-response': captchaToken},
								async: false
							})
							.done(function (responceCode) {
								if (responceCode !== 'CPT000') {
									if (output.hasClass("snackbars")) {
										output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + captchaMsg[responceCode] + '</span></p>')

										setTimeout(function () {
											output.removeClass("active");
										}, 3500);

										captchaFlag = false;
									} else {
										output.html(captchaMsg[responceCode]);
									}

									output.addClass("active");
								}
							});
						}

						if (!captchaFlag) {
							return false;
						}

						form.addClass('form-in-process');

						if (output.hasClass("snackbars")) {
							output.html('<p><span class="icon text-middle fa fa-circle-o-notch fa-spin icon-xxs"></span><span>Sending</span></p>');
							output.addClass("active");
						}
					} else {
						return false;
					}
				},
				error: function (result) {
					if (isNoviBuilder)
						return;

					var output = $("#" + $(plugins.rdMailForm[this.extraData.counter]).attr("data-form-output")),
							form = $(plugins.rdMailForm[this.extraData.counter]);

					output.text(msg[result]);
					form.removeClass('form-in-process');

					if (formHasCaptcha) {
						grecaptcha.reset();
					}
				},
				success: function (result) {
					if (isNoviBuilder)
						return;

					var form = $(plugins.rdMailForm[this.extraData.counter]),
							output = $("#" + form.attr("data-form-output")),
							select = form.find('select');

					form
					.addClass('success')
					.removeClass('form-in-process');

					if (formHasCaptcha) {
						grecaptcha.reset();
					}

					result = result.length === 5 ? result : 'MF255';
					output.text(msg[result]);

					if (result === "MF000") {
						if (output.hasClass("snackbars")) {
							output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + msg[result] + '</span></p>');
						} else {
							output.addClass("active success");
						}
					} else {
						if (output.hasClass("snackbars")) {
							output.html(' <p class="snackbars-left"><span class="icon icon-xxs mdi mdi-alert-outline text-middle"></span><span>' + msg[result] + '</span></p>');
						} else {
							output.addClass("active error");
						}
					}

					form.clearForm();

					if (select.length) {
						select.select2("val", "");
					}

					form.find('input, textarea').trigger('blur');

					setTimeout(function () {
						output.removeClass("active error success");
						form.removeClass('success');
					}, 3500);
				}
			});
		}
	}

	/**
	 * Custom Toggles
	 */
	if (plugins.customToggle.length) {
		for (var i = 0; i < plugins.customToggle.length; i++) {
			var $this = $(plugins.customToggle[i]);
			var $body = $("body");

			$this.on('click', $.proxy(function (event) {
				event.preventDefault();

				var $ctx = $(this);
				$($ctx.attr('data-custom-toggle')).add(this).toggleClass('active');
			}, $this));

			if ($this.attr("data-custom-toggle-hide-on-blur") === "true") {
				$body.on("click", $this, function (e) {
					if (e.target !== e.data[0]
							&& $(e.data.attr('data-custom-toggle')).find($(e.target)).length
							&& e.data.find($(e.target)).length === 0) {
						$(e.data.attr('data-custom-toggle')).add(e.data[0]).removeClass('active');
					}
				})
			}

			if ($this.attr("data-custom-toggle-disable-on-blur") === "true") {
				$body.on("click", $this, function (e) {
					if (e.target !== e.data[0] && $(e.data.attr('data-custom-toggle')).find($(e.target)).length === 0 && e.data.find($(e.target)).length === 0) {
						$(e.data.attr('data-custom-toggle')).add(e.data[0]).removeClass('active');
					}
				})
			}
		}
	}

	/**
	 * jQuery Count To
	 * @description Enables Count To plugin
	 */
	if (plugins.counter.length) {
		var i;

		for (i = 0; i < plugins.counter.length; i++) {
			var $counterNotAnimated = $(plugins.counter[i]).not('.animated');
			$document
			.on("scroll", $.proxy(function () {
				var $this = this;

				if ((!$this.hasClass("animated")) && (isScrolledIntoView($this))) {
					$this.countTo({
						refreshInterval: 40,
						from: 0,
						to: parseInt($this.text(), 10),
						speed: $this.attr("data-speed") || 1000,
						formatter: function (value, options) {
							value = value.toFixed(options.decimals);
							if (value > 10000) {
								var newValue = "",
										stringValue = value.toString();

								for (var k = stringValue.length; k >= 0; k -= 3) {
									if (k <= 3) {
										newValue = ' ' + stringValue.slice(0, k) + newValue;
									} else {
										newValue = ' ' + stringValue.slice(k - 3, k) + newValue;
									}
								}

								return newValue;
							} else {

								return value;
							}
						}
					});
					$this.addClass('animated');
				}
			}, $counterNotAnimated))
			.trigger("scroll");
		}
	}

	/**
	 * TimeCircles
	 * @description  Enable TimeCircles plugin
	 */
	if (plugins.dateCountdown.length) {
		var i;
		for (i = 0; i < plugins.dateCountdown.length; i++) {
			var dateCountdownItem = $(plugins.dateCountdown[i]),
					time = {
						"Days": {
							"text": "Days",
							"show": true,
							color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
						},
						"Hours": {
							"text": "Hours",
							"show": true,
							color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
						},
						"Minutes": {
							"text": "Minutes",
							"show": true,
							color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
						},
						"Seconds": {
							"text": "Seconds",
							"show": true,
							color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
						}
					};

			dateCountdownItem.TimeCircles({
				color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "rgba(247, 247, 247, 1)",
				animation: "smooth",
				bg_width: dateCountdownItem.attr("data-bg-width") ? dateCountdownItem.attr("data-bg-width") : 0.6,
				circle_bg_color: dateCountdownItem.attr("data-bg") ? dateCountdownItem.attr("data-bg") : "rgba(0, 0, 0, 1)",
				fg_width: dateCountdownItem.attr("data-width") ? dateCountdownItem.attr("data-width") : 0.03
			});

			$(window).on('load resize orientationchange', function () {
				if (window.innerWidth < 479) {
					this.dateCountdownItem.TimeCircles({
						time: {
							"Days": {
								"text": "Days",
								"show": true,
								color: this.dateCountdownItem.attr("data-color") ? this.dateCountdownItem.attr("data-color") : "#f9f9f9"
							},
							"Hours": {
								"text": "Hours",
								"show": true,
								color: this.dateCountdownItem.attr("data-color") ? this.dateCountdownItem.attr("data-color") : "#f9f9f9"
							},
							"Minutes": {
								"text": "Minutes",
								"show": true,
								color: this.dateCountdownItem.attr("data-color") ? this.dateCountdownItem.attr("data-color") : "#f9f9f9"
							},
							Seconds: {
								"text": "Seconds",
								show: false,
								color: this.dateCountdownItem.attr("data-color") ? this.dateCountdownItem.attr("data-color") : "#f9f9f9"
							}
						}
					}).rebuild();
				} else if (window.innerWidth < 767) {
					this.dateCountdownItem.TimeCircles({
						time: {
							"Days": {
								"text": "Days",
								"show": true,
								color: this.dateCountdownItem.attr("data-color") ? this.dateCountdownItem.attr("data-color") : "#f9f9f9"
							},
							"Hours": {
								"text": "Hours",
								"show": true,
								color: this.dateCountdownItem.attr("data-color") ? this.dateCountdownItem.attr("data-color") : "#f9f9f9"
							},
							"Minutes": {
								"text": "Minutes",
								"show": true,
								color: this.dateCountdownItem.attr("data-color") ? this.dateCountdownItem.attr("data-color") : "#f9f9f9"
							},
							Seconds: {
								text: '',
								show: false,
								color: this.dateCountdownItem.attr("data-color") ? this.dateCountdownItem.attr("data-color") : "#f9f9f9"
							}
						}
					}).rebuild();
				} else {
					this.dateCountdownItem.TimeCircles({time: this.time}).rebuild();
				}
			}.bind({dateCountdownItem: dateCountdownItem, time: time}));
		}
	}

	/**
	 * Circle Progress
	 * @description Enable Circle Progress plugin
	 */
	if (plugins.circleProgress.length) {
		for (var i = 0; i < plugins.circleProgress.length; i++) {
			var circleProgressItem = $(plugins.circleProgress[i]);
			$document.on("scroll", $.proxy(function () {
				var $this = $(this);

				if (!$this.hasClass('animated') && isScrolledIntoView($this)) {

					var arrayGradients = $this.attr('data-gradient').split(",");

					$this.circleProgress({
						value: $this.attr('data-value'),
						size: $this.attr('data-size') ? $this.attr('data-size') : 175,
						fill: {gradient: arrayGradients, gradientAngle: Math.PI / 4},
						startAngle: -Math.PI / 4 * 2,
						emptyFill: $this.attr('data-empty-fill') ? $this.attr('data-empty-fill') : "rgb(245,245,245)",
						thickness: $this.attr('data-thickness') ? parseInt($this.attr('data-thickness'), 10) : 10

					}).on('circle-animation-progress', function (event, progress, stepValue) {
						$(this).find('span').text(String(stepValue.toFixed(2)).replace('0.', '').replace('1.', '1'));
					});
					$this.addClass('animated');
				}
			}, circleProgressItem))
			.trigger("scroll");
		}
	}

	/**
	 * Linear Progress bar
	 * @description  Enable progress bar
	 */
	if (plugins.progressLinear.length) {
		for (i = 0; i < plugins.progressLinear.length; i++) {
			var progressBar = $(plugins.progressLinear[i]);
			$window
			.on("scroll load", $.proxy(function () {
				var bar = $(this);
				if (!bar.hasClass('animated-first') && isScrolledIntoView(bar)) {
					var end = parseInt($(this).find('.progress-value').text(), 10);
					bar.find('.progress-bar-linear').css({width: end + '%'});
					bar.find('.progress-value').countTo({
						refreshInterval: 40,
						from: 0,
						to: end,
						speed: 500
					});
					bar.addClass('animated-first');
				}
			}, progressBar));
		}
	}


	/**
	 * Enable parallax by mouse
	 */
	var parallaxJs = document.getElementsByClassName('parallax-scene-js');
	if (parallaxJs && !isNoviBuilder) {
		for (var i = 0; i < parallaxJs.length; i++) {
			var scene = parallaxJs[i];
			new Parallax(scene);
		}
	}

	/**
	 * jpFormatePlaylistObj
	 * @description  format dynamic playlist object for jPlayer init
	 */
	function jpFormatePlaylistObj(playlistHtml) {
		var playlistObj = [];

		// Format object with audio
		for (var i = 0; i < playlistHtml.length; i++) {
			var playlistItem = playlistHtml[i],
					itemData = $(playlistItem).data();
			playlistObj[i] = {};

			for (var key in itemData) {
				playlistObj[i][key.replace('jp', '').toLowerCase()] = itemData[key];
			}
		}

		return playlistObj;
	}

	/**
	 * initJplayerBase
	 * @description Base jPlayer init
	 */
	function initJplayerBase(index, item, mediaObj) {
		return new jPlayerPlaylist({
			jPlayer: item.getElementsByClassName("jp-jplayer")[0],
			cssSelectorAncestor: ".jp-audio-" + index // Need too bee a selector not HTMLElement or Jq object, so we make it unique
		}, mediaObj, {
			playlistOptions: {
				enableRemoveControls: false
			},
			supplied: "ogv, m4v, oga, mp3",
			useStateClassSkin: true,
			volume: 0.4
		});
	}

	/**
	 * Jp Audio player
	 * @description  Custom jPlayer script
	 */
	if (plugins.jPlayerInit.length) {
		$html.addClass('ontouchstart' in window || 'onmsgesturechange' in window ? 'touch' : 'no-touch');

		$.each(plugins.jPlayerInit, function (index, item) {
			$(item).addClass('jp-audio-' + index);

			var mediaObj = jpFormatePlaylistObj($(item).find('.jp-player-list .jp-player-list-item')),
					playerInstance = initJplayerBase(index, item, mediaObj);

			if ($(item).data('jp-player-name')) {
				var customJpPlaylists = $('[data-jp-playlist-relative-to="' + $(item).data('jp-player-name') + '"]'),
						playlistItems = customJpPlaylists.find("[data-jp-playlist-item]");

				// Toggle audio play on custom playlist play button click
				playlistItems.on('click', customJpPlaylists.data('jp-playlist-play-on'), function (e) {
					var mediaObj = jpFormatePlaylistObj(playlistItems),
							$clickedItem = $(e.delegateTarget);

					if (!JSON.stringify(playerInstance.playlist) === JSON.stringify(mediaObj) || !playerInstance.playlist.length) {
						playerInstance.setPlaylist(mediaObj);
					}

					if (!$clickedItem.hasClass('playing')) {
						playerInstance.pause();

						if ($clickedItem.hasClass('last-played')) {
							playerInstance.play();
						} else {
							playerInstance.play(playlistItems.index($clickedItem));
						}

						playlistItems.removeClass('playing last-played');
						$clickedItem.addClass('playing');
					} else {
						playlistItems.removeClass('playing last-played');
						$clickedItem.addClass('last-played');
						playerInstance.pause();
					}

				});


				// Callback for custom playlist
				$(playerInstance.cssSelector.jPlayer).bind($.jPlayer.event.play, function (e) {

					var toggleState = function (elemClass, index) {
						var activeIndex = playlistItems.index(playlistItems.filter(elemClass));

						if (activeIndex !== -1) {
							if (playlistItems.eq(activeIndex + index).length !== 0) {
								playlistItems.eq(activeIndex)
								.removeClass('play-next play-prev playing last-played')
								.end()
								.eq(activeIndex + index)
								.addClass('playing');
							}
						}
					};

					// Check if home select next or prev track
					toggleState('.play-next', +1);
					toggleState('.play-prev', -1);

					var lastPlayed = playlistItems.filter('.last-played');

					// If home just press pause and than play on same track
					if (lastPlayed.length) {
						lastPlayed.addClass('playing').removeClass('last-played play-next');
					}
				});


				// Add temp marker of last played audio
				$(playerInstance.cssSelector.jPlayer).bind($.jPlayer.event.pause, function (e) {
					playlistItems.filter('.playing').addClass('last-played').removeClass('playing');

					$(playerInstance.cssSelector.cssSelectorAncestor).addClass('jp-state-visible');
				});

				// Add temp marker that home want to play next audio
				$(item).find('.jp-next')
				.on('click', function (e) {
					playlistItems.filter('.playing, .last-played').addClass('play-next');
				});

				// Add temp marker that home want to play prev audio
				$(item).find('.jp-previous')
				.on('click', function (e) {
					playlistItems.filter('.playing, .last-played').addClass('play-prev');
				});
			}
		});

	}

	/**
	 * Instance CirclePlayer
	 *
	 * CirclePlayer(jPlayerSelector, media, options)
	 *   jPlayerSelector: String - The css selector of the jPlayer div.
	 *   media: Object - The media object used in jPlayer("setMedia",media).
	 *   options: Object - The jPlayer options.
	 *
	 * @description  Multiple instances must set the cssSelectorAncestor in the jPlayer options.
	 */
	if (plugins.circleJPlayer.length) {
		$.each(plugins.circleJPlayer, function (index, item) {
			$(item).find('.cp-jplayer').addClass('cp-jplayer-' + index);
			$(item).find('.cp-container').addClass('cp-container-' + index);

			new CirclePlayer(".cp-jplayer-" + index,
					{
						oga: $(item).data('jp-oga'),
						m4a: $(item).data('jp-m4a'),
						mp3: $(item).data('jp-mp3')
					}, {
						cssSelectorAncestor: ".cp-container-" + index,
						supplied: "mp3, m4a",
						volume: 0.4
					});
		});
	}

	/**
	 * Jp Video player
	 * @description  Custom jPlayer video initialization
	 */
	if (plugins.jPlayerVideo.length) {
		$.each(plugins.jPlayerVideo, function (index, item) {
			var $item = $(item);

			$item.find('.jp-video').addClass('jp-video-' + index);

			new jPlayerPlaylist({
				jPlayer: item.getElementsByClassName("jp-jplayer")[0],
				cssSelectorAncestor: ".jp-video-" + index // Need too bee a selector not HTMLElement or Jq object, so we make it unique
			}, jpFormatePlaylistObj($(item).find('.jp-player-list .jp-player-list-item')), {
				playlistOptions: {
					enableRemoveControls: false
				},
				size: {
					width: "100%",
					height: "auto",
				},
				supplied: "webmv, ogv, m4v",
				useStateClassSkin: true,
				volume: 0.4
			});

			$(item).find(".jp-jplayer").on('click', function (e) {
				var $this = $(this);
				if ($('.jp-video-' + index).hasClass('jp-state-playing')) {
					$this.jPlayer("pause");
				} else {
					$this.jPlayer("play");
				}
			});

			var initialContainerWidth = $item.width();
			// this is the overall page container, so whatever is relevant to your page

			$window.resize(function () {
				if ($item.width() !== initialContainerWidth) {
					// checks current container size against it's rendered size on every resize.
					initialContainerWidth = $item.width();
					$item.trigger('resize', $item);
					//pass off to resize listener for performance
				}
			});
		});

		$window.on('resize', function (e) {
			$('.jp-video').each(function (index) {
				// find every instance of jplayer using a class in their default markup
				var $parentContainer = $(this).closest('.jp-video-init'),
						// finds jplayers closest parent element from the ones you give it (can chain as many as you want)
						containerWidth = $parentContainer.width(),
						//takes the closest elements width
						ARWidth = 1280,
						ARHeight = 720;

				// Width and height figures used to calculate the aspect ratio (will not restrict your players to this size)

				var aspectRatio = ARHeight / ARWidth;

				var videoHeight = Math.round(aspectRatio * containerWidth);
				// calculates the appropriate height in rounded pixels using the aspect ratio
				$(this).find('.jp-jplayer').width(containerWidth).height(videoHeight);
				// and then apply the width and height!
			});
		})
		.trigger('resize');
	}

	/**
	 * Select2
	 * @description Enables select2 plugin
	 */
	if (plugins.selectFilter.length) {
		var i;
		for (i = 0; i < plugins.selectFilter.length; i++) {
			var select = $(plugins.selectFilter[i]);

			select.select2({
				theme: "bootstrap",
				val: null
			}).next().addClass(select.attr("class").match(/(input-sm)|(input-lg)|($)/i).toString().replace(new RegExp(",", 'g'), " "));
		}
	}

	/**
	 * Button Nina
	 * @description Handle button Nina animation effect
	 */
	if (plugins.buttonNina.length && !isNoviBuilder) {
		initNinaButtons(plugins.buttonNina);
	}

	/**
	 * Bootstrap Date time picker
	 */
	if (plugins.bootstrapDateTimePicker.length) {
		var i;
		for (i = 0; i < plugins.bootstrapDateTimePicker.length; i++) {
			var $dateTimePicker = $(plugins.bootstrapDateTimePicker[i]);
			var options = {};

			options['format'] = 'dddd DD MMMM YYYY - HH:mm';
			if ($dateTimePicker.attr("data-time-picker") == "date") {
				options['format'] = 'MM-DD-YYYY';
				options['minDate'] = new Date();
			} else if ($dateTimePicker.attr("data-time-picker") == "time") {
				options['format'] = 'HH:mm';
			}

			options["time"] = ($dateTimePicker.attr("data-time-picker") != "date");
			options["date"] = ($dateTimePicker.attr("data-time-picker") != "time");
			options["shortTime"] = true;

			$dateTimePicker.bootstrapMaterialDatePicker(options);
		}
	}

	/**
	 * Stepper
	 * @description Enables Stepper Plugin
	 */
	if (plugins.stepper.length) {
		plugins.stepper.stepper({
			labels: {
				up: "",
				down: ""
			}
		});
	}

	/**
	 * typedjs
	 * @description Enables Stepper Plugin
	 */
	if (plugins.typedjs.length && !isNoviBuilder) {
		// var e = ["tech", "cooking", "gardening", "personal", "design", "travel", "adventure", "crafts", "family", "team"];
		var e = ["auction", "taxi", "private airlines", "it", "maritime", "theatre", "movie", "trucking", "environmental", "SEO"];
		$('.typed-text').typed({
			strings: e,
			typeSpeed: 150,
			loop: !0,
			backDelay: 1500
		});
	}

	/**
	 *  Autoshow modal
	 * */
	if (plugins.bootstrapModalDialog.length) {
		plugins.bootstrapModalDialog.each(function (index) {
			var $this = $(plugins.bootstrapModalDialog[index]);
			if ($this.attr('data-autoshow') === 'true') $this.modal('show');
		});
	}

	/**
	 *  Notification modal
	 * */
	if (plugins.bootstrapModalNotification.length) {
		$('body').css('overflow', 'visible');
		plugins.bootstrapModalNotification.on('shown.bs.modal', function () {
			$(this).addClass('notification-open');
		});
	}

	/**
	 * Parallax text
	 * */
	if (plugins.parallaxText.length && !isNoviBuilder) {
		var scrollTop = $window.scrollTop();

		plugins.parallaxText.each(function () {
			$(this).data('orig-offset', $(this).offset().top);
			scrollText($(this));
		});

		$window.scroll(function () {
			scrollTop = $window.scrollTop();
			plugins.parallaxText.each(function () {
				scrollText($(this));
			});
		});

		$window.on('resize', function () {
			scrollTop = $window.scrollTop();
			plugins.parallaxText.each(function () {
				$(this).data('orig-offset', $(this).offset().top);
				scrollText($(this));
			});
		});
	}

	/**
	 * Custom Waypoints
	 */
	if (plugins.customWaypoints.length && !isNoviBuilder) {
		initCustomScrollTo(plugins.customWaypoints);
	}

	/**
	 * jQuery Countdown
	 * @description  Enable countdown plugin
	 */
	if (plugins.countDown.length) {
		var i;
		for (i = 0; i < plugins.countDown.length; i++) {

			var countDownItem = plugins.countDown[i],
					d = new Date(),
					time = countDownItem.getAttribute('data-time'),
					type = countDownItem.getAttribute('data-type'), // {until | since}
					format = countDownItem.getAttribute('data-format') ? countDownItem.getAttribute('data-format') : 'YYYY/MM/DD hh:mm:ss',
					expiryText = countDownItem.getAttribute('data-expiry-text') ? countDownItem.getAttribute('data-expiry-text') : 'Countdown finished',
					labels = countDownItem.getAttribute('data-labels') ? countDownItem.getAttribute('data-labels') : '',
					layout = countDownItem.getAttribute('data-layout') ? countDownItem.getAttribute('data-layout') : '{yn} {yl} {on} {ol} {dn} {dl} {hnn}{sep}{mnn}{sep}{snn}',
					settings = [];


			if (labels.length > 0) {
				settings['labels'] = JSON.parse(labels);
			}

			d.setTime(Date.parse(time)).toLocaleString();
			settings[type] = d;
			settings['expiryText'] = expiryText;
			settings['format'] = format;
			settings['alwaysExpire'] = true;
			settings['padZeroes'] = true;
			settings['layout'] = layout;
			settings['onExpiry'] = function () {
				this.classList += ' countdown-expired';
				this.innerHtml = expiryText;
			};

			$(countDownItem).countdown(settings);
		}
	}

	/**
	 * Style Switcher
	 * @description  Enable style switcher
	 */
	if (plugins.styleSwitcher.length) {
		for (i = 0; i < plugins.styleSwitcher.length; i++) {
			var $currentSwitcher = $(plugins.styleSwitcher[i]),
					$switcherContainer,
					$switcherSection = $($currentSwitcher.find('> .style-switcher-container > .section')[0]),
					$switcherPanel = $($currentSwitcher.find('> .style-switcher-panel-wrap .style-switcher-panel')[0]),
					$switcherToggle = $($currentSwitcher.find('.style-switcher-toggle')[0]);


			// Init section-reverse toggle
			if ($switcherToggle) {
				$switcherToggle.click((function ($switcherSection) {
					return function () {
						$switcherSection.toggleClass('section-reverse');
					}
				})($switcherSection));
			}

			// If switchable container is custom element (not .section)
			if ($currentSwitcher.attr('data-container')) {
				$switcherContainer = $($currentSwitcher.find($currentSwitcher.attr('data-container')));
			} else {
				$switcherContainer = $switcherSection;
			}

			// Find active switcher panel item
			var $activeButton = $($switcherPanel.find('li.active > .button')[0]);
			if (!$activeButton.length) {
				$activeButton = $($switcherPanel.find('li > .button')[0]);
			}

			if (!$activeButton.length) continue;

			// Add handler to style switcher controls
			$switcherPanel.find('li > .button').click((function ($switcherContainer, $activeButton) {
				var currentClassSet = '',
						currentButton = $activeButton,
						prevButton = $activeButton;

				return function () {
					currentButton.parent().removeClass('active');
					prevButton = currentButton;
					currentButton = $(this);
					var newClassSet = currentButton.attr('data-customize-class');
					currentButton.parent().addClass('active');

					$switcherContainer.removeClass(currentClassSet);
					$switcherContainer.addClass(newClassSet);
					currentClassSet = newClassSet;

					if (prevButton != currentButton) {
						// $switcherSection.removeClass('section-reverse');
					}
				}
			})($switcherContainer, $activeButton));

			$activeButton.click();
		}
	}

	/**
	 * Background Video
	 * @description  Enable Video plugin
	 */
	if (plugins.videBG.length) {
		for (var i = 0; i < plugins.videBG.length; i++) {
			var $element = $(plugins.videBG[i]),
					options = $element.data('vide-options'),
					path = $element.data('vide-bg');

			$element.vide(path, options);

			var videObj = $element.data('vide').getVideoObject();

			if (isNoviBuilder) {
				videObj.pause();
			} else {
				document.addEventListener('scroll', function ($element, videObj) {
					return function () {
						if (isScrolledIntoView($element)) videObj.play();
						else videObj.pause();
					}
				}($element, videObj));
			}
		}
	}

	/**
	 * Material Parallax
	 * @description Enables Material Parallax plugin
	 */
	if (plugins.materialParallax.length) {
		var i;

		if (!isNoviBuilder && !isIE && !isMobile) {
			plugins.materialParallax.parallax();
		} else {
			for (i = 0; i < plugins.materialParallax.length; i++) {
				var parallax = $(plugins.materialParallax[i]),
						imgPath = parallax.find("img").attr("src");

				parallax.css({
					"background-image": 'url(' + imgPath + ')',
					"background-attachment": "fixed",
					"background-size": "cover"
				});
			}
		}
	}

	/**
	 * Slick carousel
	 * @description  Enable Slick carousel plugin
	 */
	if (plugins.slick.length) {
		var i;
		for (i = 0; i < plugins.slick.length; i++) {
			var $slickItem = $(plugins.slick[i]);

			$slickItem.slick({
				slidesToScroll: parseInt($slickItem.attr('data-slide-to-scroll')) || 1,
				asNavFor: $slickItem.attr('data-for') || false,
				dots: $slickItem.attr("data-dots") == "true",
				infinite: isNoviBuilder ? false : $slickItem.attr("data-loop") == "true",
				focusOnSelect: true,
				arrows: $slickItem.attr("data-arrows") == "true",
				prevArrow: $slickItem.attr('data-custom-arrows') == 'true' ? $('.slick-prev[data-slick="' + $slickItem.attr('id') + '"]') : '',
				nextArrow: $slickItem.attr('data-custom-arrows') == 'true' ? $('.slick-next[data-slick="' + $slickItem.attr('id') + '"]') : '',
				swipe: $slickItem.attr("data-swipe") == "true",
				autoplay: $slickItem.attr("data-autoplay") == "true",
				vertical: $slickItem.attr("data-vertical") == "true",
				centerMode: $slickItem.attr("data-center-mode") == "true",
				centerPadding: $slickItem.attr("data-center-padding") ? $slickItem.attr("data-center-padding") : '0.50',
				mobileFirst: true,
				responsive: [
					{
						breakpoint: 0,
						settings: {
							slidesToShow: parseInt($slickItem.attr('data-items')) || 1,
						}
					},
					{
						breakpoint: 479,
						settings: {
							slidesToShow: parseInt($slickItem.attr('data-xs-items')) || 1,
						}
					},
					{
						breakpoint: 767,
						settings: {
							slidesToShow: parseInt($slickItem.attr('data-sm-items')) || 1,
						}
					},
					{
						breakpoint: 991,
						settings: {
							slidesToShow: parseInt($slickItem.attr('data-md-items')) || 1,
						}
					},
					{
						breakpoint: 1199,
						settings: {
							slidesToShow: parseInt($slickItem.attr('data-lg-items')) || 1,
						}
					}
				]
			})
			.on('afterChange', function (event, slick, currentSlide, nextSlide) {
				var $this = $(this),
						childCarousel = $this.attr('data-child');

				if (childCarousel) {
					$(childCarousel + ' .slick-slide').removeClass('slick-current');
					$(childCarousel + ' .slick-slide').eq(currentSlide).addClass('slick-current');
				}
			});
		}
	}

	if (plugins.productThumb.length) {
		var i;
		for (i = 0; i < plugins.productThumb.length; i++) {
			var thumbnails = $(plugins.productThumb[i]);
			thumbnails.find("li").on('click', function () {
				var item = $(this);
				item.parent().find('.active').removeClass('active');
				var image = item.parents(".product-single").find(".product-image-area");
				image.removeClass('animateImageIn');
				image.addClass('animateImageOut');
				item.addClass('active');
				setTimeout(function () {
					var src = item.find("img").attr("src");
					if (item.attr('data-large-image')) {
						src = item.attr('data-large-image');
					}
					image.attr("src", src);
					image.removeClass('animateImageOut');
					image.addClass('animateImageIn');
				}, 300);
			})
		}
	}

	var $body = $('body'),
			$pagination = $('.slick-books-wrap .slick-dots li'),
			$toggle = $('.block-with-details');

	/*
  * Booking products
  * */
	$toggle.each(function (index) {
		var $this = $($toggle[index]);

		$body.on('click', $this, function (event) {
			$this.removeClass('details-open');
			console.log('body click');
		});

		$this.on('click', function (event) {
			event.stopPropagation();
			$toggle.not($this).removeClass('details-open');
			$this.toggleClass('details-open');
			console.log('toggle click: ' + index);
		});

		$pagination.on('click', function (event) {
			$toggle.removeClass('details-open');
			console.log('pagination click');
		});

		$(this).children('.show-details').on('click', function (event) {
			event.preventDefault();
		});
	});

	/**
	 * D3 Charts
	 * @description Enables D3 Charts plugin
	 */
	if (plugins.d3Charts.length) {
		// for (i = 0; i < plugins.d3Charts.length; i++) {
		//   var d3ChartsItem = $(plugins.d3Charts[i]),
		//     d3ChartItemObject = parseJSONObject(d3ChartsItem, 'data-graph-object');
		//   c3ChartsArray.push(c3.generate(d3ChartItemObject));
		// }
	}

	function fillNumbers(n) {
		return Array.apply(null, {length: n}).map(Function.call, Number);
	}

	var lineChart,
			lineChartObject = {
				bindto: '#line-chart',
				color: {
					pattern: ['#a820d3', '#ed1c94']
				},
				point: {
					show: false,
					r: 4
				},
				padding: {
					left: 30,
					right: 30,
					top: 0,
					bottom: 0
				},
				data: {
					x: 'x',
					columns: [
						['x', '2016-03-01', '2016-04-01', '2016-05-01', '2016-06-01', '2016-07-01', '2016-08-01', '2016-09-01', '2016-10-01', '2016-11-01'],
						['data1', 24600, 27900, 29200, 32200, 37300, 41500, 42950, 43100, 42900, 43000],
						['data2', 22900, 25600, 26800, 28200, 32700, 36200, 37500, 36700, 35100, 33700]
					],
					axes: {
						data1: 'y'
					},
					type: 'spline',
					names: {
						data1: 'Profit',
						data2: 'Expenses'
					}
				},
				legend: {
					show: true,
					position: 'bottom'
				},
				grid: {
					x: {
						show: true
					},
					y: {
						show: false
					}
				},
				labels: true,
				axis: {
					x: {
						type: 'timeseries',
						min: '2016-02-01',
						tick: {
							format: '%b %Y',
							outer: false
						},
						padding: {
							left: 0,
							right: 10
						}
					},
					y: {
						min: 16000,
						max: 49000,
						label: {
							text: '$',
							position: 'inner-top'
						},
						tick: {
							format: function (x) {
								if (x > 1000) {
									return Math.round(x / 1000) + 'K';
								} else {
									return x;
								}
							},
							outer: false
						},
						padding: {
							top: 0,
							bottom: 0
						}
					}
				},
				line: {
					connectNull: true
				},
				oninit: wrapLabels(),
				onrendered: wrapLabels(),
				onresized: wrapLabels(),
				onmouseout: wrapLabels()
			};

	function wrap(text, width) {
		text.each(function () {
			var text = d3.select(this);
			if (text.selectAll('tspan').size() > 1) return;

			var words = text.text().split(/\s+/).reverse(),
					word,
					line = [],
					lineNumber = 0,
					lineHeight = 1.2, // ems
					y = text.attr("y"),
					dy = parseFloat(text.attr("dy")),
					tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");

			while (word = words.pop()) {
				line.push(word);
				tspan.text(line.join(" "));
				if (tspan.node().getComputedTextLength() > width) {
					line.pop();
					tspan.text(line.join(" "));
					line = [word];
					tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
				}
			}
		});
	}

	lineChart = c3.generate(lineChartObject);
	wrapLabels();

	$window.on('resize orientationchange', function () {
		wrapLabels();
	});

	function wrapLabels() {
		d3.select('#line-chart').selectAll(".c3-axis-x .tick text")
		.attr('dy', '0.5em')
		.call(wrap, 30);
	}

	d3.select('.d3-chart-wrap').insert('div', '.d3-chart + *').attr('class', 'd3-chart-legend').selectAll('span')
	.data(['data1', 'data2'])
	.enter().append('span')
	.attr('data-id', function (id) {
		return id;
	})
	.html(function (id) {
		return lineChartObject.data.names[id] ? lineChartObject.data.names[id] : id;
	})
	.on('mouseover', function (id) {
		lineChart.focus(id);
	})
	.on('mouseout', function (id) {
		lineChart.revert();
	});


	/**
	 * WOW
	 * @description Enables Wow animation plugin
	 */
	if (isDesktop && !isNoviBuilder && $html.hasClass("wow-animation") && $(".wow").length) {
		new WOW().init();
	}

	/**
	 * @module       Magnific Popup
	 * @author       Dmitry Semenov
	 * @see          https://dimsemenov.com/plugins/magnific-popup/
	 * @version      v1.0.0
	 */
	if (!isNoviBuilder && (plugins.mfp.length > 0 || plugins.mfpGallery.length > 0)) {
		if (plugins.mfp.length) {
			for (i = 0; i < plugins.mfp.length; i++) {
				var mfpItem = plugins.mfp[i];

				$(mfpItem).magnificPopup({
					type: mfpItem.getAttribute("data-lightbox")
				});
			}
		}
		if (plugins.mfpGallery.length) {
			for (i = 0; i < plugins.mfpGallery.length; i++) {
				var mfpGalleryItem = $(plugins.mfpGallery[i]).find('[data-lightbox]');

				for (var c = 0; c < mfpGalleryItem.length; c++) {
					$(mfpGalleryItem).addClass("mfp-" + $(mfpGalleryItem).attr("data-lightbox"));
				}

				mfpGalleryItem.end()
				.magnificPopup({
					delegate: '[data-lightbox]',
					type: "image",
					gallery: {
						enabled: true
					}
				});
			}
		}
	}

	/**
	 * RD Twitter Feed
	 * @description Enables RD Twitter Feed plugin
	 */
	if (plugins.twitterfeed.length > 0) {
		var i;
		for (i = 0; i < plugins.twitterfeed.length; i++) {
			var twitterfeedItem = plugins.twitterfeed[i];
			$(twitterfeedItem).RDTwitter({
				hideReplies: false,
				localTemplate: {
					avatar: "images/features/rd-twitter-post-avatar-48x48.jpg"
				},
				callback: function () {
					$window.trigger("resize");
				}
			});
		}
	}

});

}());
