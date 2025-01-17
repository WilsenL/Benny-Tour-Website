/* globals jQuery, mfn */
/* jshint esversion: 6 */

/**
 * query loop masonry - prevents error with init in iframe
 */

function queryLoopMasonry() {
  jQuery('.mfn-query-loop-masonry').each(function() {

    let $masonry = jQuery(this);

    $masonry.imagesLoaded(function() {

      $masonry.isotope({
        itemSelector: '.mfn-queryloop-item-wrapper',
        layoutMode: 'masonry',
        isOriginLeft: jQuery('body').hasClass('rtl') ? false : true
      });

      $masonry.addClass('mfn-initialized');

    });

  });
}

(function($) {

  "use strict";

  var scrollTicker, lightboxAttr, sidebar,
    rtl = $('body').hasClass('rtl'),
    simple = $('body').hasClass('style-simple'),
    topBarTop = '0',
    headerH = 0,
    currWidth = $(window).width(),
    newWidth = $(window).width(),
    screen = 'desktop',
    mobileInitW = mfn.mobileInit ? mfn.mobileInit : 1240;

  /**
   * Lightbox | Magnific Popup
   */

  if ( ! mfn.lightbox.disable ) {
    if ( ! ( mfn.lightbox.disableMobile && ( window.innerWidth < 768 ) ) ) {
      lightboxAttr = {
        title: mfn.lightbox.title ? mfn.lightbox.title : false,
      };
    }
  }

  /**
   * Admin Bar & WooCommerce Store Notice
   */

  function adminBarH() {

    var height = 0;

    // WP adminbar

    if ($('body').hasClass('admin-bar')) {
      var actionBarH = $('#wpadminbar').innerHeight() || 0;
      height += actionBarH;
    }

    // WC demo store

    if ($('body').hasClass('woocommerce-demo-store')) {
      var demoStoreH = $('body > p.demo_store').innerHeight() || 0;
      height += demoStoreH;
    }

    return height;
  }

  /**
   * Header | Sticky
   */

  function mfnSticky() {

    if( ! $('body').hasClass('sticky-header') ){
      return false;
    }

    if( $('body').hasClass('header-creative') && window.innerWidth >= 768 ){
      return false;
    }

    var startY = headerH;
    var windowY = $(window).scrollTop();
    var topBarH = $('#Top_bar').height() || 0;

    if ( windowY > startY ) {

      if ( ! ( $('#Top_bar').hasClass('is-sticky') ) ) {

        $('.header_placeholder').css('height', topBarH);

        $('#Top_bar')
          .addClass('is-sticky')
          .css('top', -60)
          .animate({
            'top': adminBarH() + 'px'
          }, 300);

        headerWidth();

        $(document).trigger('mfn:header:sticky:on');
      }

    } else {

      if ($('#Top_bar').hasClass('is-sticky')) {

        $('.header_placeholder').css('height', 0);
        $('#Top_bar')
          .removeClass('is-sticky')
          .css('top', topBarTop);

        stickyLogo();
        headerWidth();

        $(document).trigger('mfn:header:sticky:off');

      }

    }

  }

  /**
   * Header | Sticky | Retina Logo - max height
   */

  function stickyLogo() {

    // ! retina display

    if( window.devicePixelRatio <= 1 ){
      return false;
    }

    var parent = $('#Top_bar #logo'),
      el = $('img.logo-main', parent),
      height = el.data('height');

    // ! retina logo set
    if ( ! parent.hasClass('retina')) {
      return false;
    }

    if ( $('body').hasClass('logo-overflow') ) {
      // do nothing
    } else if ( height > parent.data('height') ) {
      height = parent.data('height');
    }

    el.css('max-height', height + 'px');

  }

  /**
   * Header | Sticky | Height
   */

  function mfnStickyH() {

    var topBarH = $('#Top_bar').innerHeight() || 0;

    if ( $('body').hasClass('header-below') ) {

      // header below slider

      var sliderH = $('.mfn-main-slider').innerHeight() || 0;

      headerH = topBarH + sliderH;

    } else {

      // default

      var actionBarH = $('#Action_bar').innerHeight() || 0;

      headerH = topBarH + actionBarH;

    }

  }

  /**
   * Header | Sticky | Mobile
   */

  function mfnMobileSticky() {

    if( ! $('body').hasClass('.mobile-sticky') ){
      return false;
    }

    if( $(window).width() >= 768 ){
      return false;
    }

    var menuH,
      windowH = $(window).height() || 0,
      logoH = $('#Top_bar .logo').height() || 0,
      offset = adminBarH() + logoH;

    if ( ( ! $('#Top_bar').hasClass('is-sticky')) && $('#Action_bar').is(':visible') ) {
      offset += $('#Action_bar').height() || 0;
    }

    menuH = windowH - offset;

    if (menuH < 176) {
      menuH = 176;
    }

    $('#Top_bar #menu').css('max-height', menuH + 'px');

  }

  /**
   * Header | Top bar left | Width
   */

  function headerWidth() {

    var rightW = $('.top_bar_right').outerWidth() || 0;

    rightW = Math.ceil( rightW );

    if( $('body').hasClass('header-modern') ){
      rightW += 10;
    }

    var parentW = $('#Top_bar .one').width() || 0;
    var leftW = parentW - rightW;

  }

  /**
   * FIX | Header | Sticky | Height
   */

  function fixStickyHeaderH() {

    var stickyH = 0;

    // FIX | sticky top bar height

    var topBar = $('.sticky-header #Top_bar');

    if( topBar.length ){

      // default headers

      if (topBar.hasClass('is-sticky')) {
        stickyH = $('.sticky-header #Top_bar').innerHeight() || 0;
      } else {
        topBar.addClass('is-sticky');
        stickyH = $('.sticky-header #Top_bar').innerHeight() || 0;
        topBar.removeClass('is-sticky');
      }

    } else if( $('.mfn-header-tmpl-builder').length ) {

      var height = 15;
      var shift = 0;

      if( $('#mfn-header-template').hasClass('mfn-hasSticky') ){
        height = $('#mfn-header-template').outerHeight();
        shift = parseFloat($('#mfn-header-template').css('top'));
      }else if( $('#mfn-header-template').hasClass('mfn-header-tmpl-fixed') ){
        height = $('#mfn-header-template').outerHeight();
        shift = parseFloat($('#mfn-header-template').css('top'));
      }

      stickyH = height + shift;

    }

    // FIX | responsive

    if ( $(window).width() < mobileInitW ) {

      if ( $(window).width() < 768 ) {

        // mobile
        if (!$('body').hasClass('mobile-sticky')) {
          stickyH = 0;
        }

      } else {

        // tablet
        if (!$('body').hasClass('tablet-sticky')) {
          stickyH = 0;
        }

      }

    } else {

      // desktop

      // FIX | header creative
      if ($('body').hasClass('header-creative')) {
        stickyH = 0;
      }

    }

    return stickyH;
  }

  /**
   * Sidebar | Height
   */

  function mfnSidebar() {
    if ($('.mcb-sidebar').length) {

      var maxH = $('#Content .sections_group').outerHeight();

      $('.mcb-sidebar').each(function() {
        $(this).css('min-height', 0);
        if ($(this).height() > maxH) {
          maxH = $(this).height();
        }
      });

      $('.mcb-sidebar').css('min-height', maxH + 'px');

      if( sidebar ){
        sidebar.stickySidebar('updateSticky');
      }

    }
  }


  /**
   * Into | Full Screen
   */

  function mfnIntroH() {

    var windowH = $(window).height() || 0;
    var headerWrapperH = $('#Header_wrapper').height() || 0;

    windowH = windowH - headerWrapperH - adminBarH();

    $('#Intro.full-screen').each(function() {

      var el = $(this),
        inner = $('.intro-inner', el),
        innerH = inner.height() || 0;

      el.css('padding', 0).css('min-height', windowH);

      var padding = ( windowH - innerH ) / 2;
      inner.css('padding-top', padding).css('padding-bottom', padding);

    });
  }

  /**
   * Footer | Sliding | Height
   */

  function mfnFooter() {

    var footerH = $('#Footer').height() || 0;

    // Fixed, Sliding

    if ($('.footer-fixed #Footer, .footer-sliding #Footer').length) {

      footerH = footerH - 1;
      $('#Content').css('margin-bottom', footerH + 'px');

    }

    // Stick to bottom

    if ($('.footer-stick #Footer').length) {

      var headerWrapperH = $('#Header_wrapper').height() || 0;

      var headerFooterH = headerWrapperH + footerH;

      var documentH = $(document).height() - adminBarH();

      if ( ( documentH <= $(window).height() ) && ( headerFooterH <= $(window).height() ) ) {
        $('#Footer').addClass('is-sticky');
      } else {
        $('#Footer').removeClass('is-sticky');
      }

    }

  }

  /**
   * Back To Top | Sticky / Show on scroll
   */

  function backToTopSticky() {

    if ($('#back_to_top.sticky.scroll').length) {
      var el = $('#back_to_top.sticky.scroll');

      // Clear Timeout if one is pending
      if (scrollTicker) {
        window.clearTimeout(scrollTicker);
        scrollTicker = null;
      }

      el.addClass('focus');

      // Set Timeout
      scrollTicker = window.setTimeout(function() {
        el.removeClass('focus');
      }, 1500); // Timeout in msec

    }

  }

  /**
   * # Hash smooth navigation
   */

  function hashNav() {

    var hash = window.location.hash;

    if (hash) {

      // FIX | Master Slider

      if (hash.indexOf("&") > -1 || hash.indexOf("/") > -1 || hash.indexOf("?") > -1) {
        return false;
      }

      // Contact Form 7 in popup

      if (hash.indexOf("wpcf7") > -1) {
        cf7popup(hash);
      }

      if ($(hash).length) {

        var offset = 0,
          headerH = fixStickyHeaderH(),
          tabH = $(hash).siblings('.ui-tabs-nav').innerHeight() || 0;

        // header builder

        if( $('body').hasClass('mhb') ){

          var currentView = $('.mhb-view').filter(':visible');
          headerH = currentView.height() || 0;

        }

        offset = headerH + adminBarH() + tabH;

        $('html, body').animate({
          scrollTop: $(hash).offset().top - offset
        }, 500);
      }

    }

  }

  /**
   * One Page | Scroll Active
   */

  function onePageActive() {
    if ($('body').hasClass('one-page')) {

      var stickyH = $('.sticky-header #Top_bar').innerHeight() || 0;
      if( $('#mfn-header-template').length ) stickyH = $('#mfn-header-template').innerHeight() || 0;
      var windowT = $(window).scrollTop();
      var start = windowT + stickyH + adminBarH() + 1;
      var first = false;

      $('[data-id]:not(.elementor-element), section[data-id]').each(function() {

        // FIX | elementor adds own data-id for each section

        if( $(this).attr('data-id') && ( -1 == $(this).attr('data-id').indexOf('#') ) ){
          return true;
        }

        if ($(this).visible(true)) {

          if (!first) {
            first = $(this);
          } else if (($(this).offset().top < start) && ($(this).offset().top > first.offset().top)) {
            first = $(this);
          }
        }

        if (first) {

          var newActive = first.attr('data-id');
          var active = '[data-hash="' + newActive + '"]';

          if (newActive) {
            var menu = $('#menu, .mhb-menu');
            if( $('#mfn-header-template').length ) menu = $('#mfn-header-template .mfn-header-menu');
            menu.find('li').removeClass('current-menu-item current-menu-parent current-menu-ancestor current_page_item current_page_parent current_page_ancestor');
            $(active, menu)
              .closest('li').addClass('current-menu-item')
              .closest('.menu > li').addClass('current-menu-item');
          }

        }

      });

    }
  }

  /**
   * Contact Form 7 | Popup
   */

  function cf7popup(hash) {
    if (hash && $(hash).length) {
      var id = $(hash).closest('.popup-content').attr('id');

      $('a.popup-link[href="#' + id + '"]:not(.once)')
        .addClass('once')
        .trigger('click');

    }
  }

  /**
   * Sticky | Wrap
   */

  var stickyWrap = {

    headerH: 0,

    // stickyWrap.init()

    init: function(){

      // calculate

      stickyWrap.headerH = fixStickyHeaderH() + adminBarH();

      // prepare dom

      $('.mcb-wrap.sticky.sticky-'+screen+':not(.stickied)').each(function(){

        var $wrap = $(this);

        if( screen == 'desktop' && $wrap.hasClass('one') ) return;
        if( screen == 'tablet' && $wrap.hasClass('tablet-one') ) return;
        if( screen == 'mobile' && $wrap.hasClass('mobile-one') ) return;

        var size = $wrap.attr('data-'+screen+'-col'),
          padding = {
            top : $wrap.css('padding-top'),
            right : $wrap.css('padding-right'),
            bottom : $wrap.css('padding-bottom'),
            left : $wrap.css('padding-left'),
          };

        padding = Object.values(padding).join(' ');

        $wrap.css('padding', padding);

        $wrap.addClass('stickied').removeClass(size).addClass('one')
        .wrap(function() {
          return '<div class="mcb-wrap wrap-sticky-spacer ' + size + '"><div class="mcb-wrap wrap-sticky-rails"></div></div>';
        });

      });

      // initial scroll

      stickyWrap.scroll();

    },

    // stickyWrap.scroll()

    scroll: function(){

      if( ! $('.mcb-wrap.sticky.sticky-'+screen).length ){
        return;
      }

      var windowY = $(window).scrollTop();

      $('.mcb-wrap.sticky.sticky-'+screen+'.stickied').each(function(){

        var $wrap = $(this),
          $rails = $wrap.closest('.wrap-sticky-rails'),
          $section = $wrap.closest('.mcb-section-inner');

        var width = $rails.width() || 0,
          sectionT = $section.offset().top,
          sectionH = $section.innerHeight(),
          wrapH = $wrap.outerHeight();

        var start = windowY + stickyWrap.headerH - sectionT,
          limit = start + wrapH - sectionH;

        $wrap.css( 'width', width )
          .closest('.wrap-sticky-rails').css('min-height', sectionH + 'px');

        if( limit > 0 ){

          $wrap.removeClass('fixed').addClass('stick-bottom').css({
            'top' : ''
          });

        } else {

          $wrap.removeClass( 'stick-bottom' );

          if( start > 0 ){
            $wrap.addClass('fixed').css({
              'top' : stickyWrap.headerH + 'px'
            });
          } else {
            $wrap.removeClass('fixed').css({
              'top' : ''
            });
          }

        }

      });

    },

    reset: function() {
      // stickyWrap.reset()

      if( $('.wrap-sticky-spacer').length ){
        $('.wrap-sticky-spacer').each(function() {
          $(this).find('.mcb-wrap.sticky').removeClass('stickied one fixed').addClass( $(this).find('.mcb-wrap.sticky').attr('data-'+screen+'-col') ).css({'top': '0', 'width': ''});
          $(this).replaceWith( $(this).find('.mcb-wrap.sticky') );
        });
      }

      if( $('.mcb-wrap.sticky.sticky-'+screen+':not(.stickied)').length ){
        stickyWrap.init();
      }

    }

  };

  /**
   * $(document).mfnPopupInit
   * init js plugins on popup open
   */

  $(document).on('mfnPopupInit', function() {

    // chart

    if( $('.mfn-popup-tmpl.mfn-popup-active .chart:not(.mfn-initialized)').length ){
      $('.mfn-popup-tmpl.mfn-popup-active .chart:not(.mfn-initialized)').each(function() {
          var lineW = simple ? 4 : 8;
          $(this).addClass('mfn-initialized');
          $(this).easyPieChart({
            animate: 1000,
            lineCap: 'circle',
            lineWidth: lineW,
            size: 140,
            scaleColor: false
          });

      });
    }

    // before after

    if( $('.mfn-popup-tmpl.mfn-popup-active .before_after.twentytwenty-container:not(.mfn-initialized)').length ){
      
      $('.mfn-popup-tmpl.mfn-popup-active .before_after.twentytwenty-container:not(.mfn-initialized)').each(function(){

        var el = $(this);
        el.addClass('mfn-initialized');
        el.imagesLoaded().done(function(instance, image){
          queueMicrotask(() => el.twentytwenty());
        });

      });
    }

    // countdown

    if( $('.mfn-popup-tmpl.mfn-popup-active .downcount:not(.mfn-initialized)').length ){
      $('.mfn-popup-tmpl.mfn-popup-active .downcount:not(.mfn-initialized)').each(function() {
        var el = $(this);
        el.addClass('mfn-initialized');
        el.downCount({
          date: el.attr('data-date'),
          offset: el.attr('data-offset')
        });
      });
    }
    
    // counter

    if( $('.mfn-popup-tmpl.mfn-popup-active .animate-math .number:not(.mfn-initialized)').length ){
      $('.mfn-popup-tmpl.mfn-popup-active .animate-math .number:not(.mfn-initialized)').each(function() {

        var el = $(this);
        var duration = Math.floor((Math.random() * 1000) + 1000);
        var to = el.attr('data-to');

        el.addClass('mfn-initialized');

        $({
          property: 0
        }).animate({
          property: to
        }, {
          duration: duration,
          easing: 'linear',
          step: function() {
            el.text(Math.floor(this.property));
          },
          complete: function() {
            el.text(this.property);
          }
        });

      });
    }

  });

  /**
   * $(document).ready
   * Specify a function to execute when the DOM is fully loaded.
   */

  $(document).ready(function() {

    /**
     * Isotope
    */

    class Isotope {
      constructor(){
        this.runIsotopes = this.runIsotopes.bind(this);
        this.itemToModify = {};
        this.ajaxObjects = [];
      }

      get getList() {
        return [
          {
            name: 'Portfolio - Isotope',
            location: '.blog_wrapper .isotope:not( .masonry ), .portfolio_wrapper .isotope:not( .masonry-flat, .masonry-hover, .masonry-minimal )',
            beforeActive: () => null,
            afterActive: () => null,
            settings: {
              itemSelector: '.isotope-item',
              layoutMode: 'fitRows',
              isOriginLeft: rtl ? false : true
            }
          },
          {
            name: 'Portfolio - Masonry Flat',
            location: '.portfolio_wrapper .masonry-flat',
            beforeActive: () => null,
            afterActive: () => null,
            settings: {
              itemSelector: '.isotope-item',
              percentPosition: true,
              masonry: { columnWidth: 1 },
              isOriginLeft: rtl ? false : true
            }
          },
          {
            name: 'Blog & Portfolio & Shop - Masonry',
            location: '.isotope.masonry, .isotope.masonry-hover, .isotope.masonry-minimal',
            beforeActive: () => null,
            afterActive: () => null,
            settings: {
              itemSelector: '.isotope-item',
              layoutMode: 'masonry',
              isOriginLeft: rtl ? false : true
            }
          },
          /*{
            name: 'General - Masonry Isotope',
            location: '.masonry.isotope, .masonry.gallery',
            beforeActive: () => null,
            afterActive: () => null,
            settings: {}
          },
          {
            name: 'General - Isotope',
            location: '.isotope',
            beforeActive: () => null,
            afterActive: () => null,
            settings: {},
          },*/
          {
            name: 'Filters - Isotope Event on Click',
            location: '.isotope-filters .filters_wrapper',
            beforeActive: () => null,
            afterActive: ({location}) => {
              const filterButtons = $(location).find('li:not(.close) a');
              filterButtons.on('click', (e) => {
                e.preventDefault();
                const buttonClicked = $(e.target);

                let isoWrapper = $('.isotope'),
                    filters = buttonClicked.closest('.isotope-filters'),
                    parent = filters.attr('data-parent');

                if (parent) {
                  parent = filters.closest('.' + parent);
                  isoWrapper = parent.find('.isotope').first();
                }

                filters.find('li').removeClass('current-cat');
                buttonClicked.closest('li').addClass('current-cat');

                // $('.isotope-filters .filters_wrapper').find('li').removeClass('current-cat');
                this.isotopeFilter(buttonClicked, isoWrapper);
              })
            },
            settings: 'do-not-run'
          },
          ...this.ajaxObjects //dynamical loaded content, like load more.
        ]
      }

      // One liners, queries to isotope API
      addEventListener(onEvent, doWhat) {
        return $(document).on( `isotope:${onEvent}`, doWhat)
      }
      queryIsotopeAPI(location, apiAction, actionToPass) {
        return $(location).isotope(apiAction, actionToPass);
      };
      triggerIsotopeEvent(doWhat) {
        return $(document).trigger(`isotope:${doWhat}`)
      }

      // Add elements which require isotope and are loaded on the fly
      addIsotopeLocation( payload ) {
        if ( !payload.location ) return console.error('MfnIsotope Error: No Location Provided!');

        // Push it to object
        this.ajaxObjects.push(
          {
            name: payload.name ? payload.name : 'No name applied - Dynamic Isotope Function',
            location: payload.location,
            beforeActive: payload.beforeActive ? payload.beforeActive : () => null,
            afterActive: payload.afterActive ? payload.afterActive : () => null,
            settings: payload.settings ? payload.settings : {}
          }
        );

        // Reload it anyway while using that option
        $( payload.location ).isotope( payload.settings )
      }

      isotopeFilter( domEl, isoWrapper ) {
        if( !domEl || !isoWrapper ) return console.error('MfnIsotope Error: isotopeFilter, missing one of the values!');
        const filter = domEl.attr('data-rel');

        isoWrapper.isotope({ filter });

        queueMicrotask(() => $(window).trigger('resize'));

        setTimeout(function() {
          mfnIsotope.triggerIsotopeEvent('arrange');
        }, 500);
      }

      // Usually for init, turn on all of the isotopes!
      runIsotopes( resize = true ) {
        const isotopeList = this.getList;

        //console.log(isotopeList);

        isotopeList.map(item => {
          //console.log(jQuery(item.location));
          if( $(item.location).length ) {
            // HOOK, before isotope binding
            item.beforeActive(item)

            // Trigger resize to recalculate some plugins stuff
            if( resize ){
                $(window).trigger('resize');
            }

            // Isotope init
            if( 'do-not-run' !== item.settings ){
              queueMicrotask(() => $( item.location ).isotope( item.settings ));
            }

            // HOOK, after isotope binding
            item.afterActive(item);
          }
        });
      }
    }

    const mfnIsotope = new Isotope;
    mfnIsotope.runIsotopes();

    /**
     * Waypoints
    */

    class Waypoints {
      constructor(){
        this.runWaypoints = this.runWaypoints.bind(this);
      }

      get getList() {
        return [
          {
            name: 'Chart',
            location: '.sections_group .chart, .elementor-section .chart',
            beforeActive: () => {},
            afterActive: () => {},
            settings: () => {
              return {
                offset: '100%',
                triggerOnce: true,
                handler: function(){
                  var el = $(this.element).length ? $(this.element) : $(this);
                  var lineW = simple ? 4 : 8;

                  el.easyPieChart({
                    animate: 1000,
                    lineCap: 'circle',
                    lineWidth: lineW,
                    size: 140,
                    scaleColor: false
                  });

                  if (typeof this.destroy !== 'undefined' && $.isFunction(this.destroy)) {
                    this.destroy();
                  }
                }
              }
            }
          },
          {
            name: 'Progress Icons',
            location: '.progress_icons',
            beforeActive: () => {},
            afterActive: () => {},
            settings: () => {
              return {
                offset: '100%',
                triggerOnce: true,
                handler: function() {
                  var el = $(this.element).length ? $(this.element) : $(this);
                  var active = el.attr('data-active');
                  var color = el.attr('data-color');
                  var transparent = el.hasClass('transparent');
                  var icon = el.find('.progress_icon');
                  var timeout = 200; // timeout in milliseconds

                  icon.each(function(i) {
                    if (i < active) {
                      var time = (i + 1) * timeout;
                      setTimeout(function() {

                        $(icon[i]).addClass('themebg');

                        if( transparent ){
                          $(icon[i]).css('color', color);
                        } else {
                          $(icon[i]).css('background-color', color);
                        }

                      }, time);
                    }
                  });

                  if (typeof this.destroy !== 'undefined' && $.isFunction(this.destroy)) {
                    this.destroy();
                  }
                }
              }
            }
          },
          {
            name: 'Animate Math | Counter, Quick Fact, etc.',
            location: '#Wrapper .animate-math .number',
            beforeActive: () => {},
            afterActive: () => {},
            settings: () => {
              return {
                offset: '100%',
                triggerOnce: true,
                handler: function() {
                  var el = $(this.element).length ? $(this.element) : $(this);
                  var duration = Math.floor((Math.random() * 1000) + 1000);
                  var to = el.attr('data-to');

                  $({
                    property: 0
                  }).animate({
                    property: to
                  }, {
                    duration: duration,
                    easing: 'linear',
                    step: function() {
                      el.text(Math.floor(this.property));
                    },
                    complete: function() {
                      el.text(this.property);
                    }
                  });

                  if (typeof this.destroy !== 'undefined' && $.isFunction(this.destroy)) {
                    this.destroy();
                  }
                }
              }
            }
          },
          {
            name: 'Infinite Scroll | Blog & Portfolio',
            location: '.mfn-infinite-load-button',
            infiniteLoadButton: $('.mfn-infinite-load-button a'),
            beforeActive: () => {},
            afterActive: ({infiniteLoadButton}) => {
              // Leave it, probably will be necessary soon.
              // const itemProvided = $('.column_portfolio').length ? '.column_portfolio' : '.column_blog';

              // $(`html, ${itemProvided}`).waypoint({
              //   handler: function(direction) {
              //     infiniteScrollFunction($(location), infiniteLoadButton, direction);
              //   },
              //   offset: 'bottom-in-view'
              // });
            },
            settings: ({infiniteLoadButton, location}) => {
              return {
                handler: function(direction) {
                  infiniteScrollFunction($(location), infiniteLoadButton, direction);
                },
                offset: function(){
                  //after each load, calc the offset of element to know when posts should be loaded
                  var offsetPosition = - ( ($(this)[0].element.scrollHeight) - (window.innerHeight / 1.2) );
                  return offsetPosition;
                }
              }
            }
          },
          {
            name: 'Bars List',
            location: '.bars_list',
            beforeActive: () => {},
            afterActive: ({infiniteLoadButton}) => {},
            settings: () => {
              return {
                offset: '100%',
                triggerOnce: true,
                handler: function() {

                  var el = $(this.element).length ? $(this.element) : $(this);

                  el.addClass('hover');

                  if (typeof this.destroy !== 'undefined' && $.isFunction(this.destroy)) {
                    this.destroy();
                  }
                }
              }
            }
          }
        ]
      }


      runWaypoints(){
        const waypoints = this.getList;

        waypoints.map(item => {
          if( $(item.location).length ) {
            // HOOK, before waypoints binding
            item.beforeActive(item)

            // waypoints init
            queueMicrotask(() => $(item.location).waypoint(item.settings( item )) );

            // HOOK, after waypoints binding
            item.afterActive(item);
          }
        })
      }
    }

    const mfnWaypoints = new Waypoints;
          mfnWaypoints.runWaypoints();

    /**
     * Header template
     */

    if( $('.promo_bar_slider').length ){
      promoBarSlider();
    }

    if( $('.mfn-looped-items-slider').length ){
      queryLoopSlider();
    }

    headerTemplate.init();
    footerTemplate.init();
    mfnPopup.init();

    if( $('.mfn-menu-item-megamenu').length ){
      headerMegamenu.init();
    }

    $('#Top_bar').removeClass('loading');

    // topBarTop = parseInt($('#Top_bar').css('top'), 10);
    // if (topBarTop < 0) topBarTop = 61;
    // topBarTop = topBarTop + 'px';

    /**
     * Sticky | Sidebar
     */

    function sidebarSticky(){

      var spacing = fixStickyHeaderH();

      if( ! mfn.sidebarSticky ){
        return false;
      }

      if( $('.woocommerce-store-notice').length ){
        spacing += $('.woocommerce-store-notice').outerHeight() || 0;
      }

      sidebar = $('.mcb-sidebar .widget-area').stickySidebar({
        topSpacing: spacing
      });

    }

    sidebarSticky();

    if( $('.mfn-off-canvas-sidebar').length ){
      offCanvasSidebar.init();
    }


    if( $(window).width() < 767 && !$('.mfn-off-canvas-sidebar').length ){
      offCanvasSidebar.mobile();
      screen = 'mobile';
    }else if($(window).width() < 959){
      screen = 'tablet';
    }

    $(window).on('debouncedresize', function() {

      if( $(window).width() < 767 ){
        screen = 'mobile';
      }else if($(window).width() < 959){
        screen = 'tablet';
      }else if($(window).width() > 960){
        screen = 'desktop';
      }

      newWidth = $(window).width();

      if( newWidth != currWidth ){
        currWidth = $(window).width();
        headerTemplate.init();
        footerTemplate.init();
      }

      // stickyWrap.reset();

      if( $(window).width() < 767 && !$('.mfn-off-canvas-sidebar').length ){
        offCanvasSidebar.mobile();
      }else{
        $('html').removeClass('mfn-ofcs-opened');
      }

    });

    /**
     * Menu | Overlay
     */

    $('.overlay-menu-toggle').on('click',function(e) {
      e.preventDefault();

      $(this).toggleClass('focus');
      $('#Overlay').stop(true, true).fadeToggle(500);

      var menuH = $('#Overlay nav').height() || 0;
      menuH = menuH / 2;

      $('#Overlay nav').css('margin-top', '-' + menuH + 'px');
    });

    $('#Overlay').on('click', '.menu-item > a', function() {
      $('.overlay-menu-toggle').trigger('click');
    });

    $( '.header-overlay' ).on( 'keydown', function(event) {
      if ( 27 == event.keyCode ) {
        $('.overlay-menu-toggle.focus').trigger('click');
      }
    });

    /**
     * Menu | Responsive | button
     */

    $('.responsive-menu-toggle').on('click', function(e) {
      e.preventDefault();

      var el = $(this);
      var menu = $('#Top_bar #menu');
      var menuWrap = menu.closest('.top_bar_left');

      el.toggleClass('active');

      // sticky menu button
      if (el.hasClass('is-sticky') && el.hasClass('active') && (window.innerWidth < 768)) {

        var top = 0;
        if (menuWrap.length) {
          top = menuWrap.offset().top - adminBarH();
        }
        $('body,html').animate({
          scrollTop: top
        }, 200);

      }

      menu.stop(true, true).slideToggle(200);
    });

    // close menu after link click

    $('#Top_bar #menu').on('click', 'a:not(.menu-toggle)', function(){
      var $menuButton = $('.responsive-menu-toggle.active');

      if( $menuButton.length ){
        setTimeout(function(){
          $menuButton.trigger('click');
        },300);
      }

    });


    /**
     * Menu | Responsive | Side Slide
     */

    function sideSlide() {

      //if( $('body').hasClass('mfn-header-template') ) return;

      var slide = $('#Side_slide');
      var overlay = $('#body_overlay');
      var ssMobileInitW = mobileInitW;
      var pos = 'right';

      var shiftSlide = -slide.data('width');
      var shiftBody = shiftSlide / 2;

      // constructor

      var constructor = function() {
        if (!slide.hasClass('enabled')) {

          $('nav#menu').detach().appendTo('#Side_slide .menu_wrapper');
          slide.addClass('enabled');

        }
      };

      // destructor

      var destructor = function() {
        if (slide.hasClass('enabled')) {

          close();
          $('nav#menu').detach().prependTo('#Top_bar .menu_wrapper');
          slide.removeClass('enabled');

        }
      };

      // reload

      var reload = function() {

        if ( window.innerWidth < ssMobileInitW ) {
          constructor();
        } else if( $('body').hasClass('header-shop') ) {
          if ($('#Top_bar').hasClass('is-sticky')) {
            $(document).trigger('mfn:header:sticky:on');
          } else {
            $(document).trigger('mfn:header:sticky:off');
          }
        } else {
          destructor();
        }

      };

      // init

      var init = function() {

        if (slide.hasClass('left')) {
          pos = 'left';
        }

        // responsive off
        if ($('body').hasClass('responsive-off')) {
          ssMobileInitW = 0;
        }

        // header simple
        if ($('body').hasClass('header-simple')) {
          ssMobileInitW = 9999;
        }

        //  header style: shop | top bar is sticky
        if ($('#Top_bar').hasClass('is-sticky')) {
          $(document).trigger('mfn:header:sticky:on');
        }

        reload();
      };

      // reset to default

      var reset = function(time) {

        $('.lang-active.active', slide).removeClass('active').children('i').attr('class', 'icon-down-open-mini');
        $('.lang-wrapper', slide).fadeOut(0);

        $('.icon.search.active', slide).removeClass('active');
        $('.search-wrapper', slide).fadeOut(0);

        $('.menu_wrapper, .social', slide).fadeIn(time);

      };

      // menu button

      var button = function() {

        // show

        if (pos == 'left') {
          slide.animate({
            'left': 0
          }, 300);
          $('body').animate({
            'right': shiftBody
          }, 300);
        } else {
          slide.animate({
            'right': 0
          }, 300);
          $('body').animate({
            'left': shiftBody
          }, 300);
        }

        overlay.fadeIn(300);

        $('body').addClass('side-slide-is-open');

        // reset

        reset(0);

      };

      // close

      var close = function() {

        if (pos == 'left') {
          slide.animate({
            'left': shiftSlide
          }, 300);
          $('body').animate({
            'right': 0
          }, 300);
        } else {
          slide.animate({
            'right': shiftSlide
          }, 300);
          $('body').animate({
            'left': 0
          }, 300);
        }

        overlay.fadeOut(300);

        $('body').removeClass('side-slide-is-open');

        /* Just to be sure, change aria. */
        if ( $('body').hasClass('keyboard-support') ) {
          $('#Side_slide').attr('aria-expanded', 'false');
        }

        // if page contains revolution slider, trigger resize

        if ($('.rev_slider').length) {
          setTimeout(function() {
            $(window).trigger('resize');
          }, 300);
        }

      };

      // search

      $('.icon.search', slide).on('click', function(e) {

        e.preventDefault();

        var el = $(this);

        if (el.hasClass('active')) {

          $('.search-wrapper', slide).fadeOut(0);
          $('.menu_wrapper, .social', slide).fadeIn(300);

        } else {

          $('.search-wrapper', slide).fadeIn(300);
          $('.menu_wrapper, .social', slide).fadeOut(0);

          $('.lang-active.active', slide).removeClass('active').children('i').attr('class', 'icon-down-open-mini');
          $('.lang-wrapper', slide).fadeOut(0);

        }

        el.toggleClass('active');
      });

      // search form submit

      $('a.submit', slide).on('click', function(e) {
        e.preventDefault();
        $('#side-form').submit();
      });

      // lang menu

      $('.lang-active', slide).on('click', function(e) {
        e.preventDefault();

        var el = $(this);

        if (el.hasClass('active')) {

          $('.lang-wrapper', slide).fadeOut(0);
          $('.menu_wrapper, .social', slide).fadeIn(300);
          el.children('i').attr('class', 'icon-down-open-mini');

        } else {

          $('.lang-wrapper', slide).fadeIn(300);
          $('.menu_wrapper, .social', slide).fadeOut(0);
          el.children('i').attr('class', 'icon-up-open-mini');

          $('.icon.search.active', slide).removeClass('active');
          $('.search-wrapper', slide).fadeOut(0);

        }

        el.toggleClass('active');
      });

      // bind ---

      // click | menu button

      $('.responsive-menu-toggle').off('click');

      $('.responsive-menu-toggle').on('click', function(e) {
        e.preventDefault();
        button();
      });

      // click | close

      overlay.on('click', function(e) {
        close();
      });

      $('.close', slide).on('click', function(e) {
        e.preventDefault();
        close();
      });

      $(slide).on('click', '.menu_wrapper a:not(.menu-toggle), .action_button', function(e) {

        if( $(this).hasClass('mega-menu-link') ){
          return; // FIX: plugin maxmegamenu
        }

        if( '#' == $(this).attr('href') ){
          e.preventDefault();
          return;
        }

        setTimeout(function(){
          close();
        },500);

      });

      // click | below search or languages menu

      $(slide).on('click', function(e) {
        if ($(e.target).is(slide)) {
          reset(300);
        }
      });

      // debouncedresize

      $(window).on('debouncedresize', reload);

      // header style: shop | sticky

      if( $('body').hasClass('header-shop') ){

        $(document).on('mfn:header:sticky:on', function(){
          if( window.innerWidth >= ssMobileInitW ){
            $('#Top_bar .menu_wrapper').css('min-height', '70px');
            constructor();
          }
        });

        $(document).on('mfn:header:sticky:off', function(){
          if( window.innerWidth >= ssMobileInitW ){
            destructor();
          }
        });

      }

      // init

      init();

    }

    if ($('body').hasClass('mobile-side-slide')) {
      sideSlide();
    }

    /**
     * Gallery | WordPress Gallery
     */

    // WordPress <= 4.9 | content

    $('.sections_group .gallery, .mcb-section .gallery, .elementor-section .gallery').each(function() {

      var el = $(this);
      var id = el.attr('id');

      $('> br', el).remove();

      $('.gallery-icon > a', el)
        .wrap('<div class="image_frame scale-with-grid"><div class="image_wrapper"></div></div>')
        .prepend('<div class="mask"></div>')
        .children('img')
        .css('height', 'auto')
        .css('width', '100%');

      // lightbox | link to media file

      if (el.hasClass('file')) {
        $('.gallery-icon a', el)
          .attr('rel', 'prettyphoto[' + id + ']')
          .attr('data-elementor-lightbox-slideshow', id); // FIX: elementor lightbox gallery
      }

      // isotope for masonry layout

      if (el.hasClass('masonry')) {

        mfnIsotope.addIsotopeLocation({
          name: 'Wordpress && Elementor - Masonry gallery',
          location: el,
          settings: {
            itemSelector: '.gallery-item',
            layoutMode: 'masonry',
            isOriginLeft: rtl ? false : true
          }
        })

        mfnIsotope.runIsotopes();
      }

    });

    // WordPress >= 5.0 | content

    $('.sections_group .wp-block-gallery').each(function(index) {

      var el = $(this);
      var link = $('.blocks-gallery-item a, .wp-block-image a', el);

      // lightbox | link to media file

      if ((/\.(gif|jpg|jpeg|png)$/i).test(link.attr('href'))) {
        link.attr('rel', 'prettyphoto[wp5-gallery-' + index + ']');
      }

    });

    // widgets

    $('.widget_media_gallery .gallery').each(function() {

      var el = $(this);
      var id = el.attr('id');

      // lightbox | link to media file

      $('.gallery-icon a', el).attr('rel', 'prettyphoto[widget-' + id + ']');

    });

    /**
     * Lightbox | PrettyPhoto
     */

    $('a[rel^="prettyphoto[portfolio]"]').each(function() {

      var el = $(this);
      var parent = el.closest('.column');
      var index = $('.column').index(parent);

      el.attr('rel', 'prettyphoto[portfolio-' + index + ']');

    });

    /**
     * Lightbox | Magnific Popup
     * with prettyPhoto backward compatibility
     */

    function lightbox() {

      var galleries = [];

      // init

      var init = function() {

        if (lightboxAttr) {
          compatibility();
          setType();
          constructor();
        }

      };

      // backward compatibility for prettyPhoto

      var compatibility = function() {

        $('a[rel^="prettyphoto"], a.prettyphoto, a[rel^="prettyphoto"]').each(function() {

          var el = $(this);
          var rel = el.attr('rel');

          if (rel) {
            rel = rel.replace('prettyphoto', 'lightbox');
          } else {
            rel = 'lightbox';
          }

          el.removeClass('prettyphoto').attr('rel', rel);

        });

      };

      // check if item is a part of gallery

      var isGallery = function(rel) {

        if (!rel) {
          return false;
        }

        var regExp = /\[(?:.*)\]/;
        var gallery = regExp.exec(rel);

        if (gallery) {
          gallery = gallery[0];
          gallery = gallery.replace('[', '').replace(']', '');
          return gallery;
        }

        return false;
      };

      // set array of names of galleries

      var setGallery = function(gallery) {

        if (galleries.indexOf(gallery) == -1) {
          galleries.push(gallery);
          return true;
        }

        return false;
      };

      // get file type by link

      var getType = function(src) {

        if (src.match(/youtube\.com\/watch/i) || src.match(/youtube\.com\/embed/i) || src.match(/youtu\.be/i)) {
          return 'iframe';

        } else if (src.match(/youtube-nocookie\.com/i)) {
          return 'iframe';

        } else if (src.match(/vimeo\.com/i)) {
          return 'iframe';

        } else if (src.match(/\biframe=true\b/i)) {
          return 'ajax';

        } else if (src.match(/\bajax=true\b/i)) {
          return 'ajax';

        } else if (src.substr(0, 1) == '#') {
          return 'inline';

        } else {
          return 'image';

        }
      };

      // set file type

      var setType = function() {

        $('a[rel^="lightbox"]').each(function() {

          var el = $(this);
          var href = el.attr('href');
          var rel = el.attr('rel');

          // FIX: WPBakery Page Builder duplicated lightbox
          if ( el.closest('.wpb_column').length ){
            // return true;
          }

          if (href) {

            // gallery

            var gallery = isGallery(rel);

            if (gallery) {
              el.attr('data-lightbox-type', 'gallery');
              setGallery(gallery);
              return true;
            }

            el.attr('data-lightbox-type', getType(href));

            // iframe paremeters

            if (getType(href) == 'iframe') {
              el.attr('href', href.replace('&rel=0', ''));
            }
          }

        });

      };

      // constructor

      var constructor = function() {

        // Dividing plugins into separate files fix
        if( !galleries.length
          && !$('a[rel^="lightbox"][data-lightbox-type="image"]').length
          && !$('a[rel^="lightbox"][data-lightbox-type="iframe"]').length
          && !$('a[rel^="pdf-lightbox"]').length
          && !$('a[rel^="lightbox"][data-lightbox-type="inline"]').length
        ) return;

        var attr = {
          autoFocusLast: false,
          removalDelay: 160,
          image: {
            titleSrc: function(item) {
              var img = item.el.closest('.image_wrapper, li').find('img').first();
              if (lightboxAttr.title && img.length) {
                return img.attr('alt');
              } else {
                return false;
              }
            }
          }
        };

        // image

        $('a[rel^="lightbox"][data-lightbox-type="image"]').magnificPopup({
          autoFocusLast: attr.autoFocusLast,
          removalDelay: attr.removalDelay,
          type: 'image',
          image: attr.image
        });

        // iframe | video

        $('a[rel^="lightbox"][data-lightbox-type="iframe"]').magnificPopup({
          autoFocusLast: attr.autoFocusLast,
          removalDelay: attr.removalDelay,
          type: 'iframe',
          iframe: {
            patterns: {
              youtube: {
                index: 'youtube.com/',
                id: 'v=',
                src: '//www.youtube.com/embed/%id%?autoplay=1&rel=0'
              },
              youtu_be: {
                index: 'youtu.be/',
                id: '/',
                src: '//www.youtube.com/embed/%id%?autoplay=1&rel=0'
              },
              nocookie: {
                index: 'youtube-nocookie.com/embed/',
                id: '/',
                src: '//www.youtube-nocookie.com/embed/%id%?autoplay=1&rel=0'
              }
            }
          }
        });

        // pdf

        $('a[rel^="pdf-lightbox"]').magnificPopup({
          autoFocusLast: attr.autoFocusLast,
          removalDelay: attr.removalDelay,
          type: 'iframe'
        });

        // inline

        $('a[rel^="lightbox"][data-lightbox-type="inline"]').magnificPopup({
          autoFocusLast: attr.autoFocusLast,
          type: 'inline',
          midClick: true,
          callbacks: {
            open: function() {
              $('.mfp-content').children().addClass('mfp-inline');
            },
            beforeClose: function() {
              $('.mfp-content').children().removeClass('mfp-inline');
            }
          }
        });

        // gallery

        for (var i = 0, len = galleries.length; i < len; i++) {

          var gallery = '[' + galleries[i] + ']';
          gallery = 'a[rel^="lightbox' + gallery + '"]:visible';

          $(gallery).magnificPopup({
            autoFocusLast: attr.autoFocusLast,
            removalDelay: attr.removalDelay,
            type: 'image',
            image: attr.image,
            gallery: {
              enabled: true,
              tCounter: '<span class="mfp-counter">%curr% / %total%</span>' // markup of counter
            }
          });
        }

        // FIX: elementor | disable in Elementor wrapper

        $('.elementor-page a[rel^="lightbox"]:not([data-lightbox-type="gallery"]):not(.popup-link):not(.rs-layer)').off('click');

        // FIX: WPBakery | disable if WPBakery lighbox is active

        setTimeout(function(){

          var $doc = $('body');
          var $events = $._data($doc[0],"events");

          if($events && $events.click){
            for(var i=$events.click.length-1; i>=0; i--){
              var handler = $events.click[i];
              if( handler && handler.selector && handler.selector.indexOf('lightbox') !== -1 ){
                $('.wpb_column a[rel^="lightbox"]:not(.popup-link)').off('click');
              }
            }
          }

        },0);

      };

      // reload

      var reload = function() {

        $('a[rel^="lightbox"]').off('click');
        constructor();

      };

      // init

      init();

      // isotope:arrange

      mfnIsotope.addEventListener('arrange', reload);

      // ajaxComplete

      $(document).ajaxComplete(function() {
        reload();
      });

    }

    lightbox();

    /**
     * Menu | mfnMenu
     */

    function mainMenu() {

      var mmMobileInitW = mobileInitW;

      if ($('body').hasClass('header-simple') || $('#Header_creative.dropdown').length) {
        mmMobileInitW = 9999;
      }

      $('#menu > ul.menu').mfnMenu({
        addLast: true,
        arrows: true,
        mobileInit: mmMobileInitW,
        responsive: mfn.responsive
      });

      $('#secondary-menu > ul.secondary-menu').mfnMenu({
        mobileInit: mmMobileInitW,
        responsive: mfn.responsive
      });

    }

    mainMenu();

    /**
     * Menu | NOT One Page | .scroll item
     * Works with .scroll class
     * Since 4.8 replaced with: Page Options > One Page | function: onePageMenu()
     */

    function onePageScroll() {
      if (!$('body').hasClass('one-page')) {
        var menu = $('#menu');

        if (menu.find('li.scroll').length > 1) {
          menu.find('li.current-menu-item:not(:first)').removeClass('current-menu-item currenet-menu-parent current-menu-ancestor current-page-ancestor current_page_item current_page_parent current_page_ancestor');

          // menu item click
          menu.on('click','a',function() {
            $(this).closest('li').siblings('li').removeClass('current-menu-item currenet-menu-parent current-menu-ancestor current-page-ancestor current_page_item current_page_parent current_page_ancestor');
            $(this).closest('li').addClass('current-menu-item');
          });
        }
      }
    }
    onePageScroll();

    /**
     * Menu | One Page | Active on Scroll & Click
     */

    function onePageMenu() {
      if ($('body').hasClass('one-page')) {

        var menu = $('#menu');
        if( $('#mfn-header-template').length ) menu = $('#mfn-header-template .mfn-header-menu');

        // add attr [data-hash] & [data-id]

        $('a[href]', menu).each(function() {

          var url = $(this).attr('href');
          if (url && url.split('#')[1]) {

            // data-hash
            var hash = '#' + url.split('#')[1];
            if (hash && $(hash).length) {
              // check if element with specified ID exists
              $(this).attr('data-hash', hash);
              $(hash).attr('data-id', hash);
            }

            // Visual Composer
            var vcHash = '#' + url.split('#')[1];
            var vcClass = '.vc_row.' + url.split('#')[1];
            if (vcClass && $(vcClass).length) {
              // check if element with specified Class exists
              $(this).attr('data-hash', vcHash);
              $(vcClass).attr('data-id', vcHash);
            }

          }

        });

        // active

        var hash;
        var activeSelector = 'li.current-menu-item, li.current-menu-parent, li.current-menu-ancestor, li.current-page-ancestor, li.current_page_item, li.current_page_parent, li.current_page_ancestor';
        var activeClasses = 'current-menu-item current-menu-parent current-menu-ancestor current-page-ancestor current_page_item current_page_parent current_page_ancestor';

        if ($(activeSelector, menu).length) {

          // remove duplicated
          $(activeSelector, menu)
            .not(':first').removeClass(activeClasses);

          // remove if 1st link to section & section is not visible
          hash = $(activeSelector, menu).find('a[data-hash]').attr('data-hash');

          if (hash) {
            hash = '[data-id="' + hash + '"]';

            if ($(hash).length && $(hash).visible(true)) {
              // do nothing
            } else {
              $(activeSelector, menu).removeClass('current-menu-item current-menu-parent current-menu-ancestor current-page-ancestor current_page_item current_page_parent current_page_ancestor')
                .closest('li').removeClass('current-menu-item current-menu-parent current-menu-ancestor current-page-ancestor current_page_item current_page_parent current_page_ancestor');
            }
          } else {
            // do nothing
          }

        } else {

          // add to first if none is active
          var first = $('li:first-child', menu);
          var firstA = first.children('a');

          if (firstA.attr('data-hash')) {
            hash = firstA.attr('data-hash');
            hash = '[data-id="' + hash + '"]';

            if ($(hash).length && ($(hash).offset().top == adminBarH())) {
              first.addClass('current-menu-item');
            }
          }

        }

        // click

        var menu_item = $('#menu a[data-hash]');
        if( $('#mfn-header-template').length ) menu_item = $('#mfn-header-template .mfn-header-menu a[data-hash]');

        menu_item.on('click', function(e) {
          e.preventDefault(); // only with: body.one-page

          if( $('html').hasClass('mfn-header-tmpl-burger-sidebar-opened') ){
            $('html').removeClass('mfn-header-tmpl-burger-sidebar-opened scrollbar-hidden');
          }

          // active

          menu.find('li').removeClass('current-menu-item');
          $(this)
            .closest('li').addClass('current-menu-item')
            .closest('.menu > li').addClass('current-menu-item');

          var hash = $(this).attr('data-hash');
          hash = '[data-id="' + hash + '"]';

          // mobile - sticky header - close menu

          if ( window.innerWidth < 768 ) {
            $('.responsive-menu-toggle').removeClass('active');
            $('#Top_bar #menu').hide();
          }

          // offset

          var headerFixedAbH = $('.header-fixed.ab-show #Action_bar').innerHeight() || 0;
          var tabsHeaderH = $(hash).siblings('.ui-tabs-nav').innerHeight() || 0;

          var offset = headerFixedAbH + tabsHeaderH + adminBarH();

          // sticky height

          var stickyH = fixStickyHeaderH();

          // FIX | Header below | 1st section
          if ($('body').hasClass('header-below') && $('#Content').length) {
            if ($(hash).offset().top < ($('#Content').offset().top + 60)) {
              stickyH = -1;
            }
          }

          // animate scroll

          $('html, body').animate({
            scrollTop: $(hash).offset().top - offset - stickyH
          }, 500);

        });

      }
    }
    onePageMenu();

    /**
     * Header | Creative
     */

    var cHeader = 'body:not( .header-open ) #Header_creative',
      cHeaderEl = $(cHeader),
      cHeaderCurrnet;

    function creativeHeader() {

      $('.creative-menu-toggle').on('click', function(e) {
        e.preventDefault();

        cHeaderEl.addClass('active');
        $('.creative-menu-toggle, .creative-social', cHeaderEl).fadeOut(500);
        $('#Action_bar', cHeaderEl).fadeIn(500);

      });

    }
    creativeHeader();

    $(document).on('mouseenter', cHeader, function() {
      cHeaderCurrnet = 1;
    });

    $(document).on('mouseleave', cHeader, function() {
      cHeaderCurrnet = null;
      setTimeout(function() {
        if (!cHeaderCurrnet) {

          cHeaderEl.removeClass('active');
          $('.creative-menu-toggle, .creative-social', cHeaderEl).fadeIn(500);
          $('#Action_bar', cHeaderEl).fadeOut(500);

        }
      }, 1000);
    });

    // Fix: Header Creative & Mobile Sticky | On Resize > 768 px
    function creativeHeaderFix() {
      if ( $('body').hasClass('header-creative') && window.innerWidth >= 768 ) {
        if ($('#Top_bar').hasClass('is-sticky')) {
          $('#Top_bar').removeClass('is-sticky');
        }
      }
    }

    /**
     * Header | Menu Burger
     */

    $(document).on("click", ".mfn-header-tmpl .mfn-header-menu-toggle", function(e) {
      e.preventDefault();

      if( $(this).closest('.mcb-column').hasClass('mfn-header-tmpl-menu-active') ){
        $(document).unbind('click', hideSidebarTmplBurger);
        $(this).closest('.mcb-column').removeClass('mfn-header-tmpl-menu-active');
        removeBringToFront();
        $(this).closest('.mcb-column-inner').find('.mfn-header-tmpl-menu-sidebar').attr('aria-expanded', false);

        $('html').removeClass('mfn-header-tmpl-burger-sidebar-opened scrollbar-hidden');
      }else{
        $(document).bind('click', hideSidebarTmplBurger);
        $(this).closest('.mcb-column').addClass('mfn-header-tmpl-menu-active');
        $(this).closest('.mcb-column').addClass('mfn-bring-to-front');
        $(this).closest('.mcb-wrap').addClass('mfn-bring-to-front');
        $(this).closest('.mcb-section').addClass('mfn-bring-to-front');
        $(this).closest('.mcb-column-inner').find('.mfn-header-tmpl-menu-sidebar').attr('aria-expanded', true);

        var htmlW = $('html').width();

        $('html').addClass('mfn-header-tmpl-burger-sidebar-opened');

        if( $('html').width() != htmlW ){
          $('html').addClass('scrollbar-hidden');
        }
      }

    });

    $(document).on("click", ".one-page .mfn-header-tmpl-menu-sidebar .mfn-header-menu .mfn-menu-li a", function(e) {
      let href = $(this).attr('href');

      if( href.includes('/') ){
        let href_ex = href.split('#');
        href = '#'+href_ex[1].replace('/', '');
      }

      if( $('body').hasClass('one-page') && href.includes('#') && $(href).length ) {
        e.preventDefault();
        let header_h = 0;
        if( $('.mfn-header-tmpl.mfn-header-main').hasClass('mfn-header-tmpl-fixed') || $('.mfn-header-tmpl.mfn-header-main').hasClass('mfn-hasSticky') ){
          header_h = $('.mfn-header-tmpl.mfn-header-main').outerHeight();
        }
        $(this).closest('ul').find('li.current-menu-item').removeClass('current-menu-item');
        $(this).closest('li').addClass('current-menu-item');

        let scroll_offset = $(href).offset().top - header_h;
        $('body, html').animate({ scrollTop: scroll_offset }, 500);
        $(document).unbind('click', hideSidebarTmplBurger);
        $(this).closest('.mcb-column').removeClass('mfn-header-tmpl-menu-active');
        removeBringToFront();
        if( $('html').hasClass('mfn-header-tmpl-burger-sidebar-opened') ){
          $('html').removeClass('mfn-header-tmpl-burger-sidebar-opened scrollbar-hidden');
        }
      }
    });

    function hideSidebarTmplBurger(e){
        var div = $('.mfn-header-tmpl-menu-sidebar');

        if (!div.is(e.target) && div.has(e.target).length === 0){
            $('.mfn-header-tmpl-menu-active').removeClass('mfn-header-tmpl-menu-active');
            $(document).unbind('click', hideSidebarTmplBurger);
            removeBringToFront();
            $('html').removeClass('mfn-header-tmpl-burger-sidebar-opened scrollbar-hidden');
        }
    }

    function removeBringToFront(){
      if( $('.mfn-bring-to-front').length ) {
        $('.mfn-bring-to-front').removeClass('mfn-bring-to-front');
      }
    }

    /**
     * Header | Search
     */

    $(document).on("click", ".mfn-header-tmpl .mfn-searchbar-toggle, .mfn-header-tmpl .search_wrapper .mfn-close-icon", function(e) {
      e.preventDefault();

      if( $(this).closest('.mcb-column-inner').hasClass('mfn-searchbar-active') ){
        $(this).closest('.mcb-column-inner').removeClass('mfn-searchbar-active');
        removeBringToFront();
      }else{
        $(this).closest('.mcb-column-inner').addClass('mfn-searchbar-active');
        $(this).closest('.mcb-column').addClass('mfn-bring-to-front');
        $(this).closest('.mcb-wrap').addClass('mfn-bring-to-front');
        $(this).closest('.mcb-section').addClass('mfn-bring-to-front');

        if( $(this).closest('.mcb-column-inner').find('input.field').length ){
          $(this).closest('.mcb-column-inner').find('input.field').focus();
        }
      }



    });

    $(".search_button:not(.has-input), #Top_bar .icon_close").on('click', function(e) {
      e.preventDefault();

      if( $(this).closest('.mfn-header-tmpl').length ){
        // header template
        $(this).closest('.mcb-column').toggleClass('mfn-searchbar-active');

      }else{
        const search = $('.search_wrapper')
        if( search.css('display') === 'none' ){
          search.fadeIn().find('.field').focus();

          setTimeout(function(){ search.addClass('mfn-loaded') }, 300);
        } else{
          search.fadeOut().removeClass('mfn-loaded');
        }
      }

    });

    /**
     * WPML | Language switcher in the WP Menu
     */

    function mfnWPML() {
      $('#menu .menu-item-language:not(.menu-item-language-current)').each(function() {
        var el = $(this).children('a');

        if (!el.children('span:not(.icl_lang_sel_bracket)').length) {
          el.wrapInner('<span></span>');
        }

      });

      $('#menu span.icl_lang_sel_bracket').each(function() {
        var el = $(this);
        el.replaceWith(el.html());
      });

    }
    mfnWPML();

    /**
     * Breadcrumbs | Remove last item link
     */

    function breadcrumbsRemoveLastLink() {
      var el = $('.breadcrumbs.no-link').find('li').last();
      var text = el.text();
      el.html(text);
    }
    breadcrumbsRemoveLastLink();

    /**
     * Downcount
     */

    $('#Wrapper .downcount:not(.mfn-initialized)').each(function() {
      var el = $(this);
      el.addClass('mfn-initialized');
      el.downCount({
        date: el.attr('data-date'),
        offset: el.attr('data-offset')
      });
    });

    /**
     * Hover | on Touch | .tooltip, .hover_box
     */

    $('.tooltip, .hover_box')
      .on('touchstart', function() {
        $(this).toggleClass('hover');
      })
      .on('touchend', function() {
        $(this).removeClass('hover');
      });

    /**
     * Popup | Contact Form | Button
     */

    $("#popup_contact .footer_button").on('click', function(e) {
      e.preventDefault();
      $(this).parent().toggleClass('focus');
    });

    /**
     * Scroll | niceScroll for Header Creative
     */

    if ( $('#Header_creative.scroll').length && window.innerWidth >= 1240 ) {
      $('#Header_creative.scroll').niceScroll({
        autohidemode: false,
        cursorborder: 0,
        cursorborderradius: 5,
        cursorcolor: '#222222',
        cursorwidth: 0,
        horizrailenabled: false,
        mousescrollstep: 40,
        scrollspeed: 60
      });
    }

    /**
     * Sliding Top
     */

    $('.sliding-top-control').on('click', function(e) {
      e.preventDefault();
      $('#Sliding-top .widgets_wrapper').slideToggle();
      $('#Sliding-top').toggleClass('active');
    });

    /**
     * Alert
     */

    $('body').on('click', '.alert .close', function(e) {
      e.preventDefault();
      $(this).closest('.alert').hide(300);
    });

    /**
     * Navigation Arrows | Sticky
     */

    $('.fixed-nav').appendTo('body');

    /**
     * Feature List
     */

    $('.feature_list').each(function() {
      var col = $(this).attr('data-col') ? $(this).attr('data-col') : 4;
      $(this).find('li:nth-child(' + col + 'n):not(:last-child)').after('<hr />');
    });

    /**
     * IE Fixes
     */

    function checkIE() {
      // IE 9
      var ua = window.navigator.userAgent;
      var msie = ua.indexOf("MSIE ");
      if (msie > 0 && parseInt(ua.substring(msie + 5, ua.indexOf(".", msie))) == 9) {
        $("body").addClass("ie");
      }
    }
    checkIE();

    /**
     * Parallax
     */

    var ua = navigator.userAgent,
      isMobileWebkit = /WebKit/.test(ua) && /Mobile/.test(ua);

    if ( ! isMobileWebkit && window.innerWidth >= 768 ) {

      if (mfn.parallax == 'stellar') {

        // Stellar
        $.stellar({
          horizontalScrolling: false,
          responsive: true
        });

      } else {

        $(window).enllax();

      }

    } else {

      $('div[data-enllax-ratio], div[data-stellar-ratio]').css('background-attachment', 'scroll');

    }

    /**
     * Load More | Ajax
     */

    $('.pager_load_more').on('click', function(e) {
      e.preventDefault();

      var el = $(this);
      var pager = el.closest('.pager_lm');
      var href = el.attr('href');

      // index | for many items on the page
      //var index = $('.lm_wrapper').index(el.closest('.isotope_wrapper').find('.lm_wrapper'));
      var index = $('.lm_wrapper').index( el.closest('.mcb-column-inner').find('.lm_wrapper') );

      el.fadeOut(50);
      pager.addClass('loading');

      $.get( href, function( data ) {

        // content

        var content = $('.lm_wrapper:eq(' + index + ')', data).wrapInner('').html();
        var $content = $(content);

        href = $('.lm_wrapper:eq(' + index + ')', data).next().find('.pager_load_more').attr('href');

        if ($('.lm_wrapper:eq(' + index + ')').hasClass('isotope')) {
          // isotope
          const location = '.lm_wrapper:eq(' + index + ')';
          $(location).append( $content );

          mfnIsotope.queryIsotopeAPI(location, 'appended', $content);
          mfnIsotope.addIsotopeLocation({ name: 'Load More - Ajax', location })

        } else if ($('.lm_wrapper:eq(' + index + ')').hasClass('mfn-woo-products')) {

          $('.lm_wrapper:eq(' + index + ') ul.products').append( $content.html() );
          href = $('.lm_wrapper:eq(' + index + ')', data).find('.pager_load_more').attr('href');

          var $listing = $('.lm_wrapper ul.products.isotope');

          if( $listing.length ){
            $listing.imagesLoaded().progress(function() {
              $listing.isotope('reloadItems');
            });
          }

        } else {
          // default
          $content.hide().appendTo('.lm_wrapper:eq(' + index + ')').fadeIn(1000);
        }

        // next page link

        pager.removeClass('loading');
        if (href) {
          el.fadeIn();
          el.attr('href', href);
        }

        // refresh some staff

        mfnJPlayer();
        lightbox();

        // isotope fix: second resize

        if( $('.lm_wrapper.isotope').length ){
          $('.lm_wrapper.isotope').imagesLoaded().progress(function() {
            mfnIsotope.queryIsotopeAPI( '.lm_wrapper.isotope' );
          });
        }

      });

    });

    /**
     * Filters | Blog & Portfolio
     */

    $('.filters_buttons .open').on('click', function(e) {
      e.preventDefault();
      var type = $(this).closest('li').attr('class');

      $('.filters_wrapper').show(200);
      $('.filters_wrapper ul.' + type).show(200);
      $('.filters_wrapper ul:not(.' + type + ')').hide();
    });

    $('.filters_wrapper .close a').on('click', function(e) {
      e.preventDefault();
      $('.filters_wrapper').hide(200);
    });

    /**
     * Portfolio List | Next v / Prev ^ buttons
     */

    $('.portfolio_next_js').on('click', function(e) {
      e.preventDefault();

      var item = $(this).closest('.portfolio-item').next();

      if (item.length) {
        $('html, body').animate({
          scrollTop: item.offset().top - fixStickyHeaderH()
        }, 500);
      }
    });

    $('.portfolio_prev_js').on('click', function(e) {
      e.preventDefault();

      var item = $(this).closest('.portfolio-item').prev();

      if (item.length) {
        $('html, body').animate({
          scrollTop: item.offset().top - fixStickyHeaderH()
        }, 500);
      }
    });

    /**
     * Link | Smooth Scroll | .scroll
     */

    $('body').on('click', '.scroll > a, a.scroll, .mcb-column.scroll a', function(e) {

      // prevent default if link directs to the current page

      // var urlL = location.href.replace(/\/#.*|#.*/, '');
      // var urlT = this.href.replace(/\/#.*|#.*/, ''); // remove also trailing slash

      var urlL = location.href.replace(/#.*/, '');
      var urlT = this.href.replace(/#.*/, '');

      if (urlL == urlT) {
        e.preventDefault();
      }

      var hash = this.hash;

      // offset

      var headerFixedAbH = $('.header-fixed.ab-show #Action_bar').innerHeight() || 0;
      var tabsHeaderH = $(hash).siblings('.ui-tabs-nav').innerHeight() || 0;

      var offset = headerFixedAbH + tabsHeaderH + adminBarH();

      // table of contents

      if( $(this).parents('.table_of_content').length ){
        offset += 30;
      }

      // animate scroll

      if (hash && $(hash).length) {

        // do scroll

        $('html, body').animate({
          scrollTop: $(hash).offset().top - offset - fixStickyHeaderH()
        }, 500);
      }
    });

    /**
     * Tabs
     */

    $('.jq-tabs').tabs();

    /**
     * Fake tabs
     */

    $('.fake-tabs > ul').on('click', 'a', function(e) {
      e.preventDefault();

      var $li = $(this).closest('li');

      var tab = $li.data('tab');

      if( $li.hasClass('active') ){
        return;
      }

      $li.addClass('active')
        .siblings().removeClass('active');

      $('.tab-'+ tab ).addClass('active').attr('tabindex', 0)
        .siblings('.tab').removeClass('active').attr('tabindex', -1);

      $(window).trigger('resize');
    });

    /**
     * Toggle
     */

    $('body').on('click', '.mfn-toggle .toggle-bar', function() {

      var $parent = $(this).parent(),
        $toggle = $(this).closest('.mfn-toggle');
      var speed = 100;

      if ( $parent.hasClass('active') ) {

        if( $toggle.is('.mfn-toggle-open-all') ){
          return;
        }

        $parent.removeClass('active')
          .children('.toggle-content').slideUp(speed);

      } else {

        $parent.addClass('active')
          .children('.toggle-content').slideDown(speed);

        if( ! $toggle.is('.mfn-toggle-open-more') ){
          $parent.siblings().removeClass('active')
            .children('.toggle-content').slideUp(speed);
        }

      }

      setTimeout(function() {
        $(window).trigger('resize');
      }, speed);

    });

    /**
     * Accordion & FAQ
     */

    $('.mfn-acc').each(function() {
      var el = $(this);

      if (el.hasClass('openAll')) {

        // show all
        el.find('.question')
          .addClass('active')
          .children(".answer")
          .show();

      } else {

        // show one
        var activeTab = el.attr('data-active-tab');
        if (el.hasClass('open1st')) activeTab = 1;

        if (activeTab) {
          el.find('.question').eq(activeTab - 1)
            .addClass('active')
            .children(".answer")
            .show();
        }

      }
    });

    $('.mfn-acc .question > .title').on('click', function() {

      if ($(this).parent().hasClass('active')) {

        $(this).parent().removeClass('active').children(".answer").slideToggle(100);

      } else {

        if (!$(this).closest('.mfn-acc').hasClass('toggle')) {
          $(this).parents(".mfn-acc").children().each(function() {
            if ($(this).hasClass('active')) {
              $(this).removeClass('active').children(".answer").slideToggle(100);
            }
          });
        }
        $(this).parent().addClass('active');
        $(this).next(".answer").slideToggle(100);

      }

      setTimeout(function() {
        $(window).trigger('resize');
      }, 50);

    });

    // Visual Composer | Accordion | Sidebar height
    $('.wpb_wrapper .vc_tta-panel-title').on('click', 'a', function() {

      setTimeout(function() {
        $(window).trigger('resize');
      }, 50);

    });

    /**
     * Helper
     */

    $('.helper .link.toggle').on('click', function(e) {

      e.preventDefault();

      var el = $(this);
      var id = el.attr('data-rel');
      var parent = el.closest('.helper');

      if (el.hasClass('active')) {

        el.removeClass('active');
        parent.find('.helper_content > .item-' + id).slideUp(200);

        setTimeout(function() {
          parent.find('.helper_content > .item-' + id).removeClass('active');
        }, 200);

      } else {

        parent.find('.links > .link.active').removeClass('active');
        parent.find('.helper_content > .item.active').slideUp(200);

        el.addClass('active');
        parent.find('.helper_content > .item-' + id).addClass('active').hide().slideDown(200);

      }

      setTimeout(function() {
        $(window).trigger('resize');
      }, 50);

    });

    /**
     * HTML5 Video | jPlayer
     */

    function mfnJPlayer() {
      $('.mfn-jplayer').each(function() {

        var m4v = $(this).attr('data-m4v'),
          poster = $(this).attr('data-img'),
          swfPath = $(this).attr('data-swf'),
          cssSelectorAncestor = '#' + $(this).closest('.mfn-jcontainer').attr('id');

        $(this).jPlayer({
          ready: function() {
            $(this).jPlayer('setMedia', {
              m4v: m4v,
              poster: poster
            });
          },
          play: function() {
            // To avoid both jPlayers playing together.
            $(this).jPlayer('pauseOthers');
          },
          size: {
            cssClass: 'jp-video-360p',
            width: '100%',
            height: '360px'
          },
          swfPath: swfPath,
          supplied: 'm4v',
          cssSelectorAncestor: cssSelectorAncestor,
          wmode: 'opaque'
        });
      });
    }
    mfnJPlayer();

    /**
     * Love
     */

    $('body').on('click', '.mfn-love', function() {
      var el = $(this);

      if (el.hasClass('loved')) {
        return false;
      }
      el.addClass('loved');

      var post = {
        action: 'mfn_love',
        post_id: el.attr('data-id')
      };

      $.post(mfn.ajax, post, function(data) {
        el.find('.label').html(data);
      });

      return false;
    });

    /**
     * Go to top
     */

    $('#back_to_top').on('click', function() {
      $('body,html').animate({
        scrollTop: 0
      }, 500);
      return false;
    });

    /**
     * Section | Next v / Prev ^ navigation arrows
     */

    $('.section .section-nav').on('click', function() {

      var el = $(this);
      var section = el.closest('.section');

      var offset = fixStickyHeaderH() + adminBarH();

      if (el.hasClass('prev')) {

        // Previous Section
        if (section.prev().length) {
          $('html, body').animate({
            scrollTop: section.prev().offset().top - offset
          }, 500);
        }

      } else {

        // Next Section
        if (section.next().length) {
          $('html, body').animate({
            scrollTop: section.next().offset().top - offset
          }, 500);
        }

      }
    });

    /**
     * Intro | Scroll v arrow
     */

    $('#Intro .intro-next').on('click', function() {
      var intro = $(this).closest('#Intro');

      if (intro.next().length) {
        $('html, body').animate({
          scrollTop: intro.next().offset().top - fixStickyHeaderH() - adminBarH()
        }, 500);
      }
    });

    /**
     * Widget | Muffin Menu | Hover on click
     */

    $('.widget_mfn_menu ul.submenus-click').each(function() {

      var el = $(this);

      $('a', el).on('click', function(e) {
        var li = $(this).closest('li');

        if (li.hasClass('hover') || !li.hasClass('menu-item-has-children')) {
          // link click
        } else {
          e.preventDefault();
          li.siblings('li').removeClass('hover')
            .find('li').removeClass('hover');
          $(this).closest('li').addClass('hover');
        }

      });

    });

    /**
     * WooCommerce | Add to cart
     */

    function addToCart() {

      $('body').on('click', '.add_to_cart_button', function() {
        $(this)
          .closest('.product')
          .addClass('adding-to-cart')
          .removeClass('added-to-cart');
      });

      $('body').on('added_to_cart', function() {
        $('.adding-to-cart')
          .removeClass('adding-to-cart')
          .addClass('added-to-cart');
      });
    }
    addToCart();

    /**
     * WooCommerce | Rating click
     */

    $('.woocommerce-product-rating').on('click', function(){

      var el;

      if( $('.product_tabs_wrapper.fake-tabs').length ){

        el = $('.product_tabs_wrapper.fake-tabs');
        $('li[data-tab="reviews"] a', el).trigger('click');

      } else if( $('.woocommerce-content .jq-tabs').length ){

        el = $('.woocommerce-content .jq-tabs');
        $('.ui-tabs-nav a[href="#tab-reviews"]', el).trigger('click');

      } else {

        el = $('.woocommerce-content .accordion');
        $('#reviews').closest('.question:not(.active)').children('.title').trigger('click');

      }

      // offset

      var actionBarH = $('.header-fixed.ab-show #Action_bar').innerHeight() || 0;
      var offset = actionBarH + adminBarH();

      // animate scroll

      $('html, body').animate({
        scrollTop: el.offset().top - offset - fixStickyHeaderH()
      }, 500);

    });

    /**
     * WooCommerce | Quantity change
     */

    $('body').on('click', '.quantity-change', function(e){

      e.preventDefault();

      var $el = $(this),
        $input = $(this).siblings('input');

      var step = parseFloat($input.attr('step')) || 1,
        minAttr = $input.attr('min'),
        min = typeof minAttr !== typeof undefined && minAttr !== false ? parseFloat(minAttr) : 1,
        max = parseFloat($input.attr('max')) || 9999,
        current = $input.val() ? parseFloat($input.val()) : min,
        val = 0;

      if( $el.hasClass('plus') ){
        val = current + step;
        if( val > max ){
          val = current;
        }
      } else {
        val = current - step;
        if( val < min ){
          val = current;
        }
      }

      val = Math.round(val * 10) / 10;

      $input.val(val).trigger('change');

    });

    /**
     * Ajax | Complete
     */

    $(document).ajaxComplete(function() {

      setTimeout(function() {
        $(window).trigger('resize');
        mfnSidebar();
      }, 100);

    });

    /**
     * $(window).on('debouncedresize')
     * Specify a function to execute on window resize
     */

    $(window).on('debouncedresize', function() {

      // isotope
      mfnIsotope.runIsotopes( false );

      // sliding footer height

      mfnFooter();

      // header width

      headerWidth();

      // sidebar height

      mfnSidebar();

      // intro header

      mfnIntroH();

      // mobile sticky for header creative

      creativeHeaderFix();

    });

    /**
     * document.ready
     * Initialize document ready functions
     */

    mfnSliderBlog();
    mfnSliderClients();
    mfnSliderOffer();
    mfnSliderOfferThumb();
    mfnSliderShop();

    sliderPortfolio();
    sliderTestimonials();

    // sliding footer height

    mfnFooter();

    // header width

    headerWidth();

    // sidebar height

    mfnSidebar();

    // intro header

    mfnIntroH();

    // hash navigation

    hashNav();

    // GDPR container display

    gdpr();

    // table of contents
    tableContentAttachId();

  });

  /**
   * $(window).on('scroll')
   * The scroll event is sent to an element when the user scrolls to a different place in the element.
   */

  $(window).on('scroll', function() {

    // sticky header

    mfnSticky();
    mfnMobileSticky();

    // sticky back to top

    backToTopSticky();

    // one page scroll active

    onePageActive();

    // sticky wrap

    stickyWrap.scroll();

  });

  /**
   * $(window).on('load')
   * window.load
   */

  $(window).on('load', function() {

    //setTimeout(queryLoopMasonry, 100);
    queryLoopMasonry();

    // top bar top position

    setTimeout(function(){

      topBarTop = parseInt($('#Top_bar').css('top'), 10);

      // page has already been scrolled and is refreshed or is opened with #hash

      var scrollPos = $(window).scrollTop();

      if( scrollPos > 0 ){
        window.scrollTo(0, 0);
        $(window).scrollTop(0);
        topBarTop = parseInt($('#Top_bar').css('top'), 10);
        window.scrollTo(0, scrollPos);
      }

      // negative top bar top value

      if (topBarTop < 0){
        topBarTop = 0;
      }

      topBarTop = topBarTop + 'px';

    },1000);

    // align divs heights

    alignHeights();

    /**
     * Elementor plugin
     * Disable built-in one page
     */

    function elementorDisableOnePage(){

      if( ! $('body').hasClass('one-page') ){
        return false;
      }

      setTimeout(function(){
        var doc=$(document),
          $events=$("a[href*='#']").length ? $._data(doc[0],"events") : null;
        if($events && $events.click){
          for(var i=$events.click.length-1; i>=0; i--){
            var handler=$events.click[i];
            if(handler && handler.namespace != "mPS2id" && handler.selector === 'a[href*="#"]' ) doc.off("click",handler.handler);
          }
        }
      }, 300);

    }

    elementorDisableOnePage();

    /**
     * Live search item
     * z-index for live search item parents
     */

    function liveSearchItemZindex(){

      $('.column_livesearch').each(function(){
        $(this).closest('.mcb-wrap').addClass('has-live-search-element')
          .closest('.mcb-section').addClass('has-live-search-element');
      });

    }

    liveSearchItemZindex();

    /**
     * Retina Logo
     */

    function retinaLogo() {

      // ! retina display

      if( window.devicePixelRatio <= 1 ){
        return false;
      }

      var el, src, height,
        parent = $('#Top_bar #logo'),
        parentH = parent.data('height');

      var maxH = {
        sticky: {
          init: 35,
          noPadding: 60,
          overflow: 110
        },
        mobile: {
          mini: 50,
          miniNoPadding: 60
        },
        mobileSticky: {
          init: 50,
          noPadding: 60,
          overflow: 80
        }
      };

      $('#Top_bar #logo img').each(function(index) {

        el = $(this);
        src = el.data('retina');
        height = el.height() || 0;

        // main

        if (el.hasClass('logo-main')) {

          if ($('body').hasClass('logo-overflow')) {

            // do nothing

          } else if (height > parentH) {

            height = parentH;

          }

        }

        // sticky

        if (el.hasClass('logo-sticky')) {

          if ($('body').hasClass('logo-overflow')) {

            if (height > maxH.sticky.overflow) {
              height = maxH.sticky.overflow;
            }

          } else if ($('body').hasClass('logo-no-sticky-padding')) {

            if (height > maxH.sticky.noPadding) {
              height = maxH.sticky.noPadding;
            }

          } else if (height > maxH.sticky.init) {

            height = maxH.sticky.init;

          }

        }

        // mobile

        if (el.hasClass('logo-mobile')) {

          if ($('body').hasClass('mobile-header-mini')) {

            if (parent.data('padding') > 0) {

              if (height > maxH.mobile.mini) {
                height = maxH.mobile.mini;
              }

            } else {

              if (height > maxH.mobile.miniNoPadding) {
                height = maxH.mobile.miniNoPadding;
              }

            }

          }

        }

        // mobile-sticky

        if (el.hasClass('logo-mobile-sticky')) {

          if ($('body').hasClass('logo-no-sticky-padding')) {

            if (height > maxH.mobileSticky.noPadding) {
              height = maxH.mobileSticky.noPadding;
            }

          } else if (height > maxH.mobileSticky.init) {
            height = maxH.mobileSticky.init;
          }

        }

        // SET

        if (src) {
          el.parent().addClass('retina');
          el.attr('src', src).css('max-height', height + 'px');
        }

      });

    }

    setTimeout(function() {
      retinaLogo();
    }, 0); // jQuery 3.5 window.load

    /**
     * Before After | TwentyTwenty
     */

    $('#Wrapper .before_after.twentytwenty-container:not(.mfn-initialized)').each(function(){

      var el = $(this);

      el.addClass('mfn-initialized');
      el.imagesLoaded().done(function(instance, image){

        queueMicrotask(() => el.twentytwenty());

      });

    });

    // Visual Composer prettyPhoto | off

    if ( lightboxAttr ) {
      $('a[data-rel^="prettyPhoto"]:not(.popup-link), a[rel^="lightbox"]:not(.popup-link)').each(function() {
        $(this).off('click.prettyphoto');
      });
    }

    /**
     * Reload some functions on window.load
     */

    // sticky header

    mfnStickyH();
    mfnSticky();
    mfnMobileSticky();

    // intro header

    mfnIntroH();

    // FIX | jQuery 3.5 window.load

    setTimeout(function() {

      // triger resize to recalculate some plugins stuff
      $(window).trigger('resize');

      // sidebar height

      mfnSidebar();

      // sliders

      sliderSlider();

      // hash navigation

      hashNav();

      // sticky wrap
      stickyWrap.init();

    }, 0);

  });

  /**
   * $(document).on('mouseup')
   * Specify a function to execute when the DOM is fully loaded.
   * Close some modals when click outside
   */

  $(document).on('mouseup',function(e) {

    // Widget | Muffin menu | Hover on click

    if ($('.widget_mfn_menu ul.submenus-click').length && ($('.widget_mfn_menu ul.submenus-click').has(e.target).length === 0) ) {
      $('.widget_mfn_menu ul.submenus-click li').removeClass('hover');
    }

    // Mobile menu | Classic

    if ($('.menu_wrapper').length && ( $('.menu_wrapper').has(e.target).length === 0 )) {
      if( $('.responsive-menu-toggle').hasClass('active') ){
        $('.responsive-menu-toggle').trigger('click');
      }
    }

    // Popup contact form

    if ($('#popup_contact').length && ( $('#popup_contact').has(e.target).length === 0 )) {
      if( $('#popup_contact').hasClass('focus') ){
        $('#popup_contact .footer_button').trigger('click');
      }
    }

    // Off canvas sidebar

    if($('html').hasClass('mfn-ofcs-opened') && !$('.mfn-off-canvas-sidebar').is(e.target) && $('.mfn-off-canvas-sidebar').has(e.target).length === 0){
      $('html').removeClass('mfn-ofcs-opened');
    }

  });

  /**
   * Sliders configuration
   */

  // Slick Slider | Auto responsive

  function slickAutoResponsive(slider, max, size, round = false) {

    if (!max){
      max = 5;
    }
    if (!size){
      size = 380;
    }

    var width = slider.width() || 0;
    var count;

    if ( round ) {
      count = Math.floor(width / size);
    } else {
      count = Math.ceil(width / size);
    }

    if (count < 1) count = 1;
    if (count > max) count = max;

    return count;
  }

  // Slider | Offer Thumb

  function mfnSliderOfferThumb() {

    var pager = function(el, i) {
      var img = $(el.$slides[i]).find('.thumbnail:first').html();
      return '<a>' + img + '</a>';
    };

    $('.offer_thumb_ul').each(function() {

      var slider = $(this);

      slider.slick({
        cssEase: 'ease-out',
        arrows: false,
        dots: true,
        infinite: true,
        touchThreshold: 10,
        speed: 300,

        adaptiveHeight: true,
        appendDots: slider.siblings('.slider_pagination'),
        customPaging: pager,

        rtl: rtl ? true : false,
        autoplay: mfn.slider.offer ? true : false,
        autoplaySpeed: mfn.slider.offer ? mfn.slider.offer : 5000,

        slidesToShow: 1,
        slidesToScroll: 1
      });

    });
  }

  // Slider | Offer

  function mfnSliderOffer() {
    $('.offer_ul').each(function() {

      var slider = $(this);

      slider.slick({
        cssEase: 'ease-out',
        dots: false,
        infinite: true,
        touchThreshold: 10,
        speed: 300,

        prevArrow: '<a class="slider_prev" href="#"><span class="button_icon"><i class="icon-up-open-big" aria-label="previous slide"></i></span></a>',
        nextArrow: '<a class="slider_next" href="#"><span class="button_icon"><i class="icon-down-open-big" aria-label="next slide"></i></span></a>',

        adaptiveHeight: true,
        //customPaging 	: pager,

        rtl: rtl ? true : false,
        autoplay: mfn.slider.offer ? true : false,
        autoplaySpeed: mfn.slider.offer ? mfn.slider.offer : 5000,

        slidesToShow: 1,
        slidesToScroll: 1
      });

      // Pagination | Show (css)

      slider.siblings('.slider_pagination').addClass('show');

      // Pager | Set slide number after change

      slider.on('afterChange', function(event, slick, currentSlide, nextSlide) {
        slider.siblings('.slider_pagination').find('.current').text(currentSlide + 1);
      });

    });
  }

  // Slider | Shop

  function mfnSliderShop() {

    var pager = function(el, i) {
      return '<a>' + i + '</a>';
    };

    $('.shop_slider_ul').each(function() {

      var slider = $(this);
      var slidesToShow = 4;

      var count = slider.closest('.shop_slider').data('count');
      if (slidesToShow > count) {
        slidesToShow = count;
        if (slidesToShow < 1) {
          slidesToShow = 1;
        }
      }

      slider.slick({
        cssEase: 'ease-out',
        dots: true,
        infinite: true,
        touchThreshold: 10,
        speed: 300,

        prevArrow: '<a class="button the-icon slider_prev" href="#"><span class="button_icon"><i class="icon-left-open-big" aria-label="previous slide"></i></span></a>',
        nextArrow: '<a class="button the-icon slider_next" href="#"><span class="button_icon"><i class="icon-right-open-big" aria-label="next slide"></i></span></a>',
        appendArrows: slider.siblings('.blog_slider_header').children('.slider_navigation'),

        appendDots: slider.siblings('.slider_pager'),
        customPaging: pager,

        rtl: rtl ? true : false,
        autoplay: mfn.slider.shop ? true : false,
        autoplaySpeed: mfn.slider.shop ? mfn.slider.shop : 5000,

        slidesToShow: slickAutoResponsive(slider, slidesToShow),
        slidesToScroll: slickAutoResponsive(slider, slidesToShow)
      });

      // ON | debouncedresize

      $(window).on('debouncedresize', function() {
        slider.slick('slickSetOption', 'slidesToShow', slickAutoResponsive(slider, slidesToShow), false);
        slider.slick('slickSetOption', 'slidesToScroll', slickAutoResponsive(slider, slidesToShow), true);
      });

    });
  }

  // Slider | Blog

  function mfnSliderBlog() {

    var pager = function(el, i) {
      return '<a>' + i + '</a>';
    };

    $('.blog_slider_ul').each(function() {

      var slider = $(this);
      var slidesToShow = 4;

      var count = slider.closest('.blog_slider').data('count');
      var singlePostMode = slider.closest('.blog_slider').hasClass('single_post_mode');

      if (slidesToShow > count) {
        slidesToShow = count;
        if (slidesToShow < 1) {
          slidesToShow = 1;
        }
      }

      if (singlePostMode) {
        slidesToShow = 1;
      }

      slider.slick({
        cssEase: 'ease-out',
        dots: true,
        infinite: true,
        touchThreshold: 10,
        speed: 300,

        prevArrow: '<a class="button the-icon slider_prev" href="#"><span class="button_icon"><i class="icon-left-open-big" aria-label="previous slide"></i></span></a>',
        nextArrow: '<a class="button the-icon slider_next" href="#"><span class="button_icon"><i class="icon-right-open-big" aria-label="next slide"></i></span></a>',
        appendArrows: slider.siblings('.blog_slider_header').children('.slider_navigation'),

        appendDots: slider.siblings('.slider_pager'),
        customPaging: pager,

        rtl: rtl ? true : false,
        autoplay: mfn.slider.blog ? true : false,
        autoplaySpeed: mfn.slider.blog ? mfn.slider.blog : 5000,

        slidesToShow: slickAutoResponsive(slider, slidesToShow),
        slidesToScroll: slickAutoResponsive(slider, slidesToShow)
      });

      // On | debouncedresize

      $(window).on('debouncedresize', function() {
        slider.slick('slickSetOption', 'slidesToShow', slickAutoResponsive(slider, slidesToShow), false);
        slider.slick('slickSetOption', 'slidesToScroll', slickAutoResponsive(slider, slidesToShow), true);
      });

    });
  }

  // Slider | Clients

  function mfnSliderClients() {
    $('.clients_slider_ul').each(function() {

      var slider = $(this);

      var clientsPerSlide = slider.closest('.clients_slider').attr('data-client-per-slide') ? parseInt(slider.closest('.clients_slider').attr('data-client-per-slide')) : 4;
      var navigationPosition = slider.closest('.clients_slider').attr('data-navigation-position') || false;
      var appendArrows = ( navigationPosition == 'content' ) ? slider : slider.siblings('.blog_slider_header').children('.slider_navigation');
      var size = 400;

      var calc = () => slickAutoResponsive(slider, clientsPerSlide, size - (clientsPerSlide * 40), true);
      var calcScroll = calc;
      var slidesToScroll = slider.closest('.clients_slider').attr('data-slides-to-scroll') ? parseInt(slider.closest('.clients_slider').attr('data-slides-to-scroll')) : calc();

      if( 1 === slidesToScroll ){
        calcScroll = () => slickAutoResponsive(slider, 1, size - (clientsPerSlide * 40), true);
      }

      slider.slick({
        cssEase: 'ease-out',
        dots: false,
        infinite: true,
        touchThreshold: 10,
        speed: 300,

        prevArrow: '<a class="button the-icon slider_prev" href="#"><span class="button_icon"><i class="icon-left-open-big" aria-label="previous slide"></i></span></a>',
        nextArrow: '<a class="button the-icon slider_next" href="#"><span class="button_icon"><i class="icon-right-open-big" aria-label="next slide"></i></span></a>',
        appendArrows: appendArrows,

        rtl: rtl ? true : false,
        autoplay: mfn.slider.clients ? true : false,
        autoplaySpeed: mfn.slider.clients ? mfn.slider.clients : 5000,

        slidesToShow: calc(),
        slidesToScroll: calcScroll()
      });

      // ON | debouncedresize

      $(window).on('debouncedresize', function() {
        slider.slick('slickSetOption', 'slidesToShow', calc(), false);
        slider.slick('slickSetOption', 'slidesToScroll', calcScroll(), true);
      });

    });
  }

  // Slider | Portfolio

  function sliderPortfolio() {

    $('.portfolio_slider_ul').each(function() {

      var slider = $(this);
      var size = 380;
      var scroll = 5;

      if (slider.closest('.portfolio_slider').data('size')) {
        size = slider.closest('.portfolio_slider').data('size');
      }

      if (slider.closest('.portfolio_slider').data('size')) {
        scroll = slider.closest('.portfolio_slider').data('scroll');
      }

      slider.slick({
        cssEase: 'ease-out',
        dots: false,
        infinite: true,
        touchThreshold: 10,
        speed: 300,

        prevArrow: '<a class="slider_nav slider_prev themebg" href="#"><i class="icon-left-open-big" aria-label="previous slide"></i></a>',
        nextArrow: '<a class="slider_nav slider_next themebg" href="#"><i class="icon-right-open-big" aria-label="next slide"></i></a>',

        rtl: rtl ? true : false,
        autoplay: mfn.slider.portfolio ? true : false,
        autoplaySpeed: mfn.slider.portfolio ? mfn.slider.portfolio : 5000,

        slidesToShow: slickAutoResponsive(slider, 5, size),
        slidesToScroll: slickAutoResponsive(slider, scroll, size)
      });

      // ON | debouncedresize
      $(window).on('debouncedresize', function() {
        slider.slick('slickSetOption', 'slidesToShow', slickAutoResponsive(slider, 5, size), false);
        slider.slick('slickSetOption', 'slidesToScroll', slickAutoResponsive(slider, scroll, size), true);
      });

    });
  }

  // header promo bar | Slider

  function promoBarSlider() {
    $('.promo_bar_slider').each(function() {
      var speed = parseInt($(this).attr('data-speed')) * 1000;

      var $slider = $(this);
      $slider.find( '.pbs_one' ).first().addClass('pbs-active');
      $slider.addClass('mfn-initialized');

      function changeSlide() {
        var $current = $slider.find( '.pbs_one.pbs-active' );
        var $next = $slider.find( '.pbs_one.pbs-active' ).next();
        if( !$next.length ) $next = $slider.find( '.pbs_one' ).first();

        $current.addClass('pbs-active-ends');

        setTimeout(function() {
          $current.removeClass('pbs-active pbs-active-ends');
          $next.addClass('pbs-active');
        }, 300);

      }

      if( $slider.find( '.pbs_one' ).length > 1 ){
        setInterval(changeSlide, speed);
      }

    });
  }

  // section slider

  function queryLoopSlider() {
    $('body:not(.mfn-ui) .mfn-looped-items-slider').each(function(i) {

      const swipers = [];

      var $slider = $(this);

      let swiperClass = 'mfn-ql-slider-'+i;

      $slider.addClass(swiperClass);

      var swiperParams = {
        spaceBetween: parseInt($slider.attr('data-space_desktop')),
        slidesPerView: parseInt($slider.attr('data-columns-mobile')),
      };

      if( typeof $slider.attr('data-dots') !== 'undefined' && $slider.attr('data-dots') == '1' ){
        $slider.parent().append('<div class="swiper-pagination mfn-swiper-pagination-'+i+'"></div>');
        swiperParams['pagination'] = {
          el: ".mfn-swiper-pagination-"+i,
          clickable: true,
        };
      }

      /*if( $slider.attr('data-animation') == 'fade' ){
        swiperParams['effect'] = 'fade';
      }*/

      if( $slider.attr('data-infinity') == '1' ){
        swiperParams['loop'] = true;
      }

      if( $slider.attr('data-arrows') == '1' ){
        $slider.parent().append('<div class="swiper-button-next mfn-swiper-arrow mfn-swiper-button-next-'+i+'"><i class="'+$slider.attr('data-arrownext')+'"></i></div><div class="swiper-button-prev mfn-swiper-arrow mfn-swiper-button-prev-'+i+'"><i class="'+$slider.attr('data-arrowprev')+'"></i></div>');
        swiperParams['navigation'] = {
          nextEl: ".mfn-swiper-button-next-"+i,
          prevEl: ".mfn-swiper-button-prev-"+i,
        };
      }

      if( !$('body').hasClass('mfn-ui') && typeof $slider.attr('data-autoplay') !== 'undefined' && parseFloat($slider.attr('data-autoplay')) > 0 ){
        swiperParams['autoplay'] = {
          delay: parseFloat($slider.attr('data-autoplay')),
          disableOnInteraction: true,
        };
      }

      if( !$('body').hasClass('mfn-ui') && typeof $slider.attr('data-mousewheel') !== 'undefined' && $slider.attr('data-mousewheel') > 0 ){
        swiperParams['mousewheel'] = true;
      }

      if( $('body').hasClass('mfn-ui') ){
        swiperParams['allowTouchMove'] = false;
      }
      
      // popup fix
      if( $slider.closest('.mfn-popup-tmpl').length ){
        swiperParams['observer'] = true;
        swiperParams['observeParents'] = true;
      }

      swiperParams['breakpoints'] = {
        768: {
          spaceBetween: parseInt($slider.attr('data-space_desktop')),
          slidesPerView: parseInt($slider.attr('data-columns-tablet'))
        },
        960: {
          spaceBetween: parseInt($slider.attr('data-space_desktop')),
          slidesPerView: parseInt($slider.attr('data-columns'))
        }
      };

      swipers[i] = new Swiper('.'+swiperClass, swiperParams);

      swipers[i].on('slideChange', function () {
        $(window).trigger('scroll');
      });

      /*swipers[i].on('beforeSlideChangeStart', function(swiper) {
        $(swiper.el).find('.mcb-column.animate').each(function() {
          $(this).removeClass( $(this).attr('data-anim-type') );
        });
      })*/

    });
  }

  // Slider | Slider

  function sliderSlider() {

    var pager = function(el, i) {
      return '<a>' + i + '</a>';
    };

    $('.content_slider_ul').each(function() {

      var slider = $(this);
      var count = 1;
      var centerMode = false;

      if (slider.closest('.content_slider').hasClass('carousel')) {
        count = slickAutoResponsive(slider);

        $(window).on('debouncedresize', function() {
          slider.slick('slickSetOption', 'slidesToShow', slickAutoResponsive(slider), false);
          slider.slick('slickSetOption', 'slidesToScroll', slickAutoResponsive(slider), true);
        });
      }

      if (slider.closest('.content_slider').hasClass('center')) {
        centerMode = true;
      }

      slider.slick({
        cssEase: 'cubic-bezier(.4,0,.2,1)',
        dots: true,
        infinite: true,
        touchThreshold: 10,
        speed: 300,

        centerMode: centerMode,
        centerPadding: '20%',

        prevArrow: '<a class="button the-icon slider_prev" href="#"><span class="button_icon"><i class="icon-left-open-big" aria-label="previous slide"></i></span></a>',
        nextArrow: '<a class="button the-icon slider_next" href="#"><span class="button_icon"><i class="icon-right-open-big" aria-label="next slide"></i></span></a>',

        adaptiveHeight: true,
        appendDots: slider.siblings('.slider_pager'),
        customPaging: pager,

        rtl: rtl ? true : false,
        autoplay: mfn.slider.slider ? true : false,
        autoplaySpeed: mfn.slider.slider ? mfn.slider.slider : 5000,

        slidesToShow: count,
        slidesToScroll: count
      });

      // Lightbox | disable on dragstart

      var clickEvent = false;

      slider.on('dragstart', '.slick-slide a[rel="lightbox"]', function(event) {
        if (lightboxAttr) {
          var events = $._data(this,'events');
          if( events && Object.prototype.hasOwnProperty.call(events, 'click') ){
            clickEvent = events.click[0];
            $(this).addClass('off-click').off('click');
          }
        }
      });

      // Lightbox | enable after change

      slider.on('afterChange', function(event, slick, currentSlide, nextSlide) {
        if (lightboxAttr) {
          $('a.off-click[rel="lightbox"]', slider).removeClass('off-click').on('click', clickEvent);
        }
      });

    });
  }

  // Slider | Testimonials

  function sliderTestimonials() {

    var pager = function(el, i) {
      var img = $(el.$slides[i]).find('.single-photo-img').html();
      return '<a>' + img + '</a>';
    };

    $('.testimonials_slider_ul').each(function() {

      var slider = $(this);

      slider.slick({
        cssEase: 'ease-out',
        dots: true,
        infinite: true,
        touchThreshold: 10,
        speed: 300,

        prevArrow: '<a class="button the-icon slider_prev" href="#"><span class="button_icon"><i class="icon-left-open-big" aria-label="previous slide"></i></span></a>',
        nextArrow: '<a class="button the-icon slider_next" href="#"><span class="button_icon"><i class="icon-right-open-big" aria-label="next slide"></i></span></a>',

        adaptiveHeight: true,
        appendDots: slider.siblings('.slider_pager'),
        customPaging: pager,

        rtl: rtl ? true : false,
        autoplay: mfn.slider.testimonials ? true : false,
        autoplaySpeed: mfn.slider.testimonials ? mfn.slider.testimonials : 5000,

        slidesToShow: 1,
        slidesToScroll: 1
      });

    });
  }

  /**
   * GDPR
   */

  // GDPR | Close notice on click | BIND

  $('.mfn-gdpr-button').on('click', function(){
    var closeAnimation = $('.mfn-gdpr-button').attr('data-animation');
    var barAligment = $('#mfn-gdpr').attr('data-aligment');

    switch(true){
      case 'none' === closeAnimation:
        $('#mfn-gdpr').css('display', 'none');
        break;
      case 'fade' === closeAnimation:
        $('#mfn-gdpr').fadeOut(300);
        break;
      case 'slide' === closeAnimation && 'top' === barAligment:
        $('#mfn-gdpr').slideUp(300);
        break;
      default:
        $('#mfn-gdpr').slideToggle(300);
        break;
    }

    // wait for animation end, then remove clasa and set cookies
    setTimeout(function(){
      $('#mfn-gdpr').removeClass('show');
      gdpr_set_cookie();
    }, 300);
  });

  // GDPR | Set the cookie

  function gdpr_set_cookie(){
    if(navigator.cookieEnabled) {
      var cookieDays = $('.mfn-gdpr-button').attr('data-cookiedays') || 365;
      var cookieDate = new Date();
      var cookieText = '';

      cookieDate.setTime(cookieDate.getTime() + (cookieDays * 24 * 60 * 60 * 1000));
      cookieText += "mfn-gdpr=1";
      cookieText += "; expires=" + cookieDate.toUTCString() + ';';
      cookieText += "; path=" + mfn.home_url + '/';

      document.cookie = cookieText;
    }
  }

  // GDPR | Display, if cookie not accepted

  function gdpr(){
    if (document.cookie !== "") {
      var cookies = document.cookie.split(/; */);

      for (var cookie of cookies) {
        var [ cookieName ] = cookie.split("=");

        if (cookieName === 'mfn-gdpr') {
          return; // cookie exists
        }
      }
    }

    $('#mfn-gdpr').addClass('show'); //cookie does NOT exist
  }

  /*
   * Infinite scroll functionality
   */

  function infiniteScrollFunction(infiniteLoadContainer, infiniteLoadButton, scrollDirection){

    // for proper check, if we need to fetch posts again.
    var screenHeight = document.body.clientHeight;

    if ( infiniteLoadContainer.attr('data-attr') === $(infiniteLoadButton).attr('href') ) {
      return; // it means, that maximum length of pages is crossed
    } else if (scrollDirection === 'down') {

      // attach link for check, and click the load more button!
      infiniteLoadContainer.attr('data-attr', $(infiniteLoadButton).attr('href'));
      infiniteLoadButton.click();

      // prevention, when height did not change enought, load again
      setTimeout(function(){
        var heightAfterLoadDifference = (document.body.clientHeight - screenHeight);

        if( heightAfterLoadDifference < 249 ) {
          infiniteScrollFunction(infiniteLoadContainer, infiniteLoadButton, scrollDirection);
        }
      }, 500);

    }
  }

/*  function infiniteScrollPortfolio(){
    var infiniteLoadContainer = $('.mfn-infinite-load-button');
    var infiniteLoadButton = $('.mfn-infinite-load-button a');

    $(infiniteLoadContainer).waypoint({
      handler: function(direction) {
        infiniteScrollFunction(infiniteLoadContainer, infiniteLoadButton, direction);
      },
      offset: function(){
        //after each load, calc the offset of element to know when posts should be loaded
        var offsetPosition = - ( ($(this)[0].element.scrollHeight) - (window.innerHeight / 1.2) );
        return offsetPosition;
      }
    });


  } */

  /*
   * Table of Contents | toc
   */

  $('body').on('click', ".table_of_content .toggle", function(e){

    e.preventDefault();

    if( $('.table_of_content').hasClass('hide') ){

      $('.table_of_content').removeClass('hide');

      $('.table_of_content_wrapper').slideDown( {
        duration: 400,
        always: function(){
          $('.table_of_content').removeClass('hide_on_start');
        }
      });

    } else {

      $('.table_of_content_wrapper').slideUp( {
        duration: 400
      });

      $('.table_of_content').addClass('hide');

    }

  });

  function tableContentAttachId(){
    const container = $('.table_of_content');
    let tags;
    let anchorNumber = 0;
    let anchorDom = $('.table_of_content_wrapper').find('a');

    if(tags = container.attr('data-tags')){
      tags = tags.split(/[ ,]+/).join(','); //remove spaces, add commas

      // muffin builder, gutenberg, elementor
      let columns = $('.mfn-builder-content .column_column, .mfn-builder-content .column_heading, .mfn-builder-content .column_fancy_heading, .the_content_wrapper:not(.is-elementor), .elementor-widget:not(.elementor-widget-mfn_table_of_contents)');

      $(columns).each( ( index, element ) => {
        let headingsNoticed = $(element).find(tags); //look for headings

        $(headingsNoticed).each( ( index, element ) => {

          if( $(element).attr('id') ) { //replace toc_X with user assigned ID

            const idSet = '#'+$(element).attr('id');
            $(anchorDom[anchorNumber]).attr('href', idSet );

          }else{

            let id = $(anchorDom[anchorNumber]).attr('href');
            $(element).attr('id', id.substr(1) );

          }

          anchorNumber++;
        })

      })

    }
  }

  /**
   * Off-canvas sidebar
   */

  var offCanvasSidebar = {
    init: function() {
      $(document).on('click', '.mfn-off-canvas-switcher', function(e) {
        e.preventDefault();
        if( $('html').hasClass('mfn-ofcs-opened') ){
          $('html').removeClass('mfn-ofcs-opened');
        }else{
          $('html').addClass('mfn-ofcs-opened');
        }
      });
    },
    mobile: function() {
      if( $('.sidebar .widget-area').length && $('body').hasClass('ofcs-mobile') ){

        if( !$('.mfn-off-canvas-sidebar').length ){
          $('body').append('<div class="mfn-off-canvas-overlay"></div><div class="mfn-off-canvas-sidebar"><div class="mfn-off-canvas-switcher"><i class="icon-list" aria-label="off-canvas sidebar toggle"></i></div><div class="mfn-off-canvas-content-wrapper"><div class="mfn-off-canvas-content"></div></div></div>');
        }

        if( $('body').hasClass('woocommerce-shop') && !$('.mfn-woo-filters-wrapper .mfn-off-canvas-switcher').length ){
          $('.mfn-woo-filters-wrapper').append('<a class="open-filters mfn-off-canvas-switcher" href="#"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-label="off-canvas sidebar toggle"><defs><style>.path{fill:none;stroke:#000;stroke-miterlimit:10;}</style></defs><g><line x1="8" y1="11" x2="14" y2="11" class="path"></line><line x1="2" y1="11" x2="4" y2="11" class="path"></line><line x1="12" y1="5" x2="14" y2="5" class="path"></line><line x1="2" y1="5" x2="8" y2="5" class="path"></line><circle cx="6" cy="11" r="2" class="path"></circle><circle cx="10" cy="5" r="2" class="path"></circle></g></svg></a>');
        }

        var $ofcs = $('.mfn-off-canvas-sidebar .mfn-off-canvas-content-wrapper .mfn-off-canvas-content');
        $ofcs.empty();

        $('.sidebar .widget-area').each(function() {
          //var $sdbr = $(this).clone(true);
          $ofcs.append( $(this) );
          //$(this).hide();
        });

        offCanvasSidebar.init();

      }
    }
  }

  function alignHeights(){
    var i = 0;
    if( !$('.mfn-align-heights').length ) return;
    $('.mfn-align-heights').each(function() {
      var max=0;
      var newclass = 'mfn-align-cont-'+i;
      $(this).addClass(newclass);
      $("<style type='text/css'> ."+newclass+" .mfn-align-me{ height: auto;} </style>").appendTo("body");
      $("."+newclass+" .mfn-align-me").each(function() {
        if($(this).outerHeight() > max){max = $(this).outerHeight();}
      });
      $("<style type='text/css'> ."+newclass+" .mfn-align-me{ height: "+max+"px;} </style>").appendTo("body");
      i++;
    });
  }

  $(window).on('debouncedresize', alignHeights);

  var headerMegamenu = {
    init: function() {

      if( $('.mfn-megamenu-menu.mfn-mm-submenu-toggled li.menu-item-has-children').length ){
        $('.mfn-megamenu-menu.mfn-mm-submenu-toggled li.menu-item-has-children > a').on('click', function(e) {
          let href = $(this).attr('href');
          if( !$(this).parent('li').hasClass('mfn-li-childrens-show') ){
            e.preventDefault();
            e.stopPropagation();
            $(this).siblings('ul').slideDown(300);
            $(this).parent('li').addClass('mfn-li-childrens-show');
          }else if( href == '' || href == '#' ){
            e.preventDefault();
            e.stopPropagation();
            $(this).siblings('ul').slideUp(300);
            $(this).parent('li').removeClass('mfn-li-childrens-show');
          }
        });
      }

      /**
       * Submenu in mega menu
       * */

      if( $('.column_megamenu_menu ul.mfn-mm-menu-horizontal.mfn-mm-submenu-on-click li').length ){
        $('.column_megamenu_menu ul.mfn-mm-menu-horizontal.mfn-mm-submenu-on-click li > a').on('click', function(e) {
          if( $(this).closest('li').hasClass('menu-item-has-children') && !$(this).closest('li').hasClass('mfn-li-hover') ){
            e.preventDefault();
            e.stopPropagation();
            $(this).closest('li').addClass('mfn-li-hover');
          }
        });
      }

      if( $('ul.mfn-menu-submenu-on-hover li.mfn-menu-item-has-megamenu, li.mfn-theme-options-menu.mfn-menu-item-has-megamenu').length ){
        $('ul.mfn-menu-submenu-on-hover li.mfn-menu-item-has-megamenu, li.mfn-theme-options-menu.mfn-menu-item-has-megamenu').on('mouseenter', function() {
          if( $(this).find('.mfn-megamenu-full-width').length || $(this).find('.mfn-megamenu-grid').length ){
            headerMegamenu.setLeft($(this));
          }
        });
      }

      if( $('ul.mfn-menu-submenu-on-click li.mfn-menu-item-has-megamenu').length ){

        $('ul.mfn-menu-submenu-on-click li.mfn-menu-item-has-megamenu > a.mfn-menu-link').on('click', function(e) {
          let href = $(this).attr('href');

          if( $(this).closest('li').find('.mfn-megamenu-full-width').length || $(this).closest('li').find('.mfn-megamenu-grid').length ){
            headerMegamenu.setLeft($(this).closest('li'));
          }

          if( href == '' || href == '#' ){
            e.preventDefault();
            e.stopPropagation();
            if( $(this).closest('li').hasClass('mfn-li-hover') ) {
              $(this).closest('li').removeClass('mfn-li-hover');
              $(document).unbind('click', headerTemplate.bindUnclick);
              $('body').removeClass('mfn-content-gray mfn-content-blur mfn-content-overlay');
            }else{
              $(this).closest('li').addClass('mfn-li-hover');
              $(document).bind('click', headerTemplate.bindUnclick);
              headerTemplate.animContentAddClass();
            }
          }else if( !$(this).closest('li').hasClass('mfn-li-hover') ){
            e.preventDefault();
            e.stopPropagation();
            $('.mfn-header-tmpl ul li.mfn-li-hover').removeClass('mfn-li-hover');
            if( !$(this).closest('.mfn-megamenu-menu').length && !$(this).closest('li.mfn-li-hover').length ) {
              if( $('.mfn-megamenu-menu.mfn-mm-submenu-toggled li.menu-item-has-children.mfn-li-childrens-show').length ){
                $('.mfn-megamenu-menu.mfn-mm-submenu-toggled li.menu-item-has-children.mfn-li-childrens-show ul').slideUp();
                $('.mfn-megamenu-menu.mfn-mm-submenu-toggled li.menu-item-has-children.mfn-li-childrens-show').removeClass('mfn-li-childrens-show');
              }
            }
            headerTemplate.animContentAddClass();
            $(this).parent('li').addClass('mfn-li-hover');
            $(document).bind('click', headerTemplate.bindUnclick);
          }

        });

      }

    },
    setLeft: function($li) {
      var $mm = $li.find('.mfn-menu-item-megamenu');
      var left = $li.offset().left;
      $mm.css('width', $(window).width()+'px');
      $mm.css('left', '-'+left+'px');

      //$(window).trigger('resize');
    }
  }

  var footerTemplate = {
    init: function() {
      if( $('body').hasClass('mfn-footer-stick') ){
        footerTemplate.isSticky();
      }
      if( $('body').hasClass('mfn-footer-sliding') || $('body').hasClass('mfn-footer-fixed') ){
        footerTemplate.isSliding();
      }
      return;
    },
    isSticky: function() {
      var offsetTop = $('.mfn-footer-tmpl').offset().top + $('.mfn-footer-tmpl').outerHeight();
      if( offsetTop < $(window).height() ){
        $('.mfn-footer-tmpl').addClass('is-sticky');
      }else{
        $('.mfn-footer-tmpl').removeClass('is-sticky');
      }
    },
    isSliding: function() {
      var footer = $('.mfn-footer-tmpl').outerHeight();
      $('#Content').css('margin-bottom', footer);
    }
  }

  var headerTemplate = {
    hasSticky: false,
    isMobile: false,
    offsetScroll: 60,
    hasBodyOffset: false,
    height: 0,
    type: 'default',
    animContentOnHover: function() {

      if( $('.mfn-header-tmpl.mfn-header-main .mfn-header-menu.mfn-header-mainmenu').hasClass('mfn-menu-submenu-on-hover') ){
        $('.mfn-header-tmpl.mfn-header-main .mfn-header-menu.mfn-header-mainmenu.mfn-menu-submenu-on-hover > li.mfn-menu-item-has-megamenu, .mfn-header-tmpl.mfn-header-main .mfn-header-menu.mfn-header-mainmenu.mfn-menu-submenu-on-hover > li.menu-item-has-children').on('mouseenter', function() {
          headerTemplate.animContentAddClass();
        });
      }

      $('.mfn-header-tmpl.mfn-header-main .mfn-header-menu.mfn-header-mainmenu.mfn-menu-submenu-on-hover > li.mfn-menu-item-has-megamenu, .mfn-header-tmpl.mfn-header-main .mfn-header-menu.mfn-header-mainmenu.mfn-menu-submenu-on-hover > li.menu-item-has-children').on('mouseleave', function() {
        $('body').removeClass('mfn-content-gray mfn-content-blur mfn-content-overlay');
      });

    },
    animContentAddClass: function() {
      if( $('.mfn-header-tmpl.mfn-header-main').hasClass('mfn-header-content-blur') ){
        $('body').addClass('mfn-content-blur');
      }else if( $('.mfn-header-tmpl.mfn-header-main').hasClass('mfn-header-content-gray') ){
        $('body').addClass('mfn-content-gray');
      }else if( $('.mfn-header-tmpl.mfn-header-main').hasClass('mfn-header-content-overlay') ){
        $('body').addClass('mfn-content-overlay');
      }
    },
    openOnClick: function() {

      // common
      $('.mfn-header-tmpl .mfn-header-menu.mfn-menu-submenu-on-click li.menu-item-has-children > a.mfn-menu-link').off().on('click', function(e) {
        let href = $(this).attr('href');

        if( $(this).closest('li').find('.mfn-megamenu-full-width').length || $(this).closest('li').find('.mfn-megamenu-grid').length ){
          headerMegamenu.setLeft($(this).closest('li'));
        }

        if( href == '' || href == '#' ){
          e.preventDefault();
          e.stopPropagation();
          if( $(this).closest('li').hasClass('mfn-li-hover') ) {
            $(this).closest('li').removeClass('mfn-li-hover');
            $(document).unbind('click', headerTemplate.bindUnclick);
            $('body').removeClass('mfn-content-gray mfn-content-blur mfn-content-overlay');
          }else{
            $(this).closest('li').addClass('mfn-li-hover');
            $(document).bind('click', headerTemplate.bindUnclick);
            headerTemplate.animContentAddClass();
          }
        }else if( !$(this).closest('li').hasClass('mfn-li-hover') ){
          e.preventDefault();
          e.stopPropagation();
          //$('.mfn-header-tmpl ul li.mfn-li-hover').removeClass('mfn-li-hover');
          headerTemplate.animContentAddClass();
          $(this).parent('li').addClass('mfn-li-hover');
          $(document).bind('click', headerTemplate.bindUnclick);
        }

      });

    },
    bindUnclick: function(e) {
      var $li = $('.mfn-header-tmpl ul li.mfn-li-hover');
      if (!$li.is(e.target)) {
        $li.removeClass('mfn-li-hover');
        $('body').removeClass('mfn-content-gray mfn-content-blur mfn-content-overlay');
        $(document).unbind('click', headerTemplate.bindUnclick);
      }
    },
    closeable: function() {
      // common
      $('.mfn-header-tmpl .close-closeable-section').on('click', function() {
        var $section = $(this).closest('.mcb-section');
        $section.addClass('closeable-hidden').slideUp(300, function() {
          headerTemplate.resetOffset();
          headerTemplate.offset();
        });

        if( typeof $section.attr('data-close-days') !== 'undefined' && $section.attr('data-close-days') != '0' ){
          var days = $section.attr('data-close-days');
          var uid = $section.attr('data-uid');
          var date=new Date();
          date.setTime(date.getTime()+(parseInt(days)*24*60*60*1000));
          var expires="; expires="+date.toGMTString();
          document.cookie="mfn_closed_section="+uid+expires+"; path=/"
        }

      });
    },
    resetOffset: function() {
      if( headerTemplate.type != 'default' && headerTemplate.hasBodyOffset ){
        $('#Wrapper').css({ 'padding-top': $('.mfn-header-tmpl').outerHeight() });
      }
    },
    offset: function() {
      if( headerTemplate.hasSticky && !headerTemplate.isMobile ) return;
      headerTemplate.offsetScroll = 0;
      var _screen = 'default';
      if( $(window).width() < 767 ) _screen = 'header-mobile';
      $('.mfn-header-tmpl .mfn-'+_screen+'-section.hide-on-scroll:not(.closeable-hidden)').each(function() {
          headerTemplate.offsetScroll += $(this).outerHeight();
      });

    },
    init: function() {
      headerTemplate.hasBodyOffset = false;

      if( $(window).width() < 767 && $('.mfn-header-tmpl').hasClass('mfn-hasMobile') ){
        headerTemplate.isMobile = true;
        headerTemplate.type = $('.mfn-header-tmpl').attr('data-mobile-type');
        if( $('.mfn-header-tmpl').hasClass('mfn-mobile-header-body-offset') ) {
          headerTemplate.hasBodyOffset = true;
        }else{
          headerTemplate.hasBodyOffset = false;
        }
      }else{
        headerTemplate.isMobile = false;
        headerTemplate.type = $('.mfn-header-tmpl').attr('data-type');
        if( $('.mfn-header-tmpl').hasClass('mfn-header-body-offset') ) {
          headerTemplate.hasBodyOffset = true;
        }else{
          headerTemplate.hasBodyOffset = false;
        }
      }

      // init submenu show on click
      if( $('.mfn-header-tmpl .mfn-menu-submenu-on-click').length ) {
        headerTemplate.openOnClick();
      }

      if( $('.mfn-header-tmpl').hasClass('mfn-header-content-blur') || $('.mfn-header-tmpl').hasClass('mfn-header-content-gray') || $('.mfn-header-tmpl').hasClass('mfn-header-content-overlay') ){
        headerTemplate.animContentOnHover();
      }

      // sticky header
      /*if( $('.mfn-header-tmpl .mfn-header-sticky-section').length ) {
        if( !headerTemplate.isMobile ){
          headerTemplate.hasSticky = true;
          $('.mfn-header-tmpl').addClass('mfn-hasSticky');
        }else{
          headerTemplate.hasSticky = false;
          $('.mfn-header-tmpl').removeClass('mfn-hasSticky');
        }
      }*/

      if( $('.mfn-header-tmpl').hasClass('mfn-hasSticky') ) {
        headerTemplate.hasSticky = true;
      }else{
        headerTemplate.hasSticky = false;
      }

      if( $('body style.tmp-mfn-header-template').length ) $('body style.tmp-mfn-header-template').remove();

      if( $('.mfn-header-tmpl .close-closeable-section').length ) headerTemplate.closeable();

      if( $('body').hasClass('mfn-header-scrolled') && !$('.mfn-builder-active').length ) $('body').removeClass('mfn-header-scrolled');

      headerTemplate.getHeight();
      headerTemplate.offset();

      headerTemplate.scroll();

      if( $(window).scrollTop() > 10 ){
        $(window).trigger('scroll');
      }
    },
    scroll: function() {

      // relative header prevent skip with sticky
      if( $('.mfn-header-tmpl').hasClass('mfn-header-tmpl-default') && headerTemplate.hasSticky ) {
        $('body').append('<style class="tmp-mfn-header-template">html body.mfn-header-scrolled{padding-top: '+headerTemplate.height+'px;}</style>');
      }

      $(window).scroll(function() {
        var scrolled = $(this).scrollTop();
        var scroll_offset = headerTemplate.offsetScroll;
        if( headerTemplate.hasSticky ) scroll_offset = headerTemplate.height;

        if(scrolled > scroll_offset){
            $('body').addClass('mfn-header-scrolled');

            if( $('.mfn-header-tmpl').hasClass('mfn-header-tmpl-fixed') && $('.mfn-header-tmpl .hide-on-scroll:not(.closeable-hidden)').length ){
              if( headerTemplate.hasSticky ){
                $('.mfn-header-tmpl').css({'top': 0});
              }else{
                $('.mfn-header-tmpl').css({'top': '-'+headerTemplate.offsetScroll+'px'});
              }
            }

          }else{
            $('body').removeClass('mfn-header-scrolled');

            if( $('.mfn-header-tmpl').hasClass('mfn-header-tmpl-fixed') && $('.mfn-header-tmpl .hide-on-scroll:not(.closeable-hidden)').length ){
              $('.mfn-header-tmpl').css({'top': '-'+scrolled+'px'});
            }

          }
      });
    },
    getHeight: function() {
      headerTemplate.height = $('.mfn-header-tmpl').outerHeight();
      if( headerTemplate.type != 'default' && headerTemplate.hasBodyOffset ){
        $('#Wrapper').css({ 'padding-top' : headerTemplate.height });
      }else{
        $('#Wrapper').removeAttr('style');
      }
      $('.mfn-header-tmpl').removeAttr('style');
    },
  }


  /**
   * 
   * Popup template
   * 
   * */

  let mfnPopup = {
    
    init: function() {

      if( $('.button.open-mfn-popup').length ){
        $('.button.open-mfn-popup').on('click', function(e) {
          e.preventDefault();
          let popup_id = $(this).attr('data-mfnpopup');

          if( popup_id == 'popup_id_required' ){
            alert('Popup ID id required');
          }else if( !$(popup_id).length ){
            alert('We cannot find popup with inserted ID');
          }else{
            mfnPopup.showPopup($(popup_id));
          }
        });
      }

      if( $('.mfn-popup-tmpl.mfn-popup-tmpl-display-on-scroll').length ) mfnPopup.showOnScroll();
      if( $('.mfn-popup-tmpl.mfn-popup-tmpl-display-start-delay').length ) mfnPopup.showOnDelay();
      if( $('.mfn-popup-tmpl.mfn-popup-tmpl-display-on-exit').length ) mfnPopup.showOnExit();
      if( $('.mfn-popup-tmpl.mfn-popup-tmpl-display-scroll-to-element').length ) mfnPopup.showOnScrollToElement();
      if( $('.mfn-popup-tmpl.mfn-popup-tmpl-display-on-start').length ) mfnPopup.showOnStart();

      $(document).on('click', '.exit-mfn-popup', function(e) {
        e.preventDefault();
        let $popup = $(this).closest('.mfn-popup-tmpl');
        mfnPopup.hidePopup($popup);
      });

    },

    hidePopup: function( $popup ) {
      $popup.removeClass('mfn-popup-active');

      if( $('style.mfn-popup-tmpl-blur-'+$popup.attr('data-id')).length ){
        $('style.mfn-popup-tmpl-blur-'+$popup.attr('data-id')).remove();
      }

      if( $popup.hasClass('mfn-popup-tmpl-display-cookie-based') || $popup.hasClass('mfn-popup-tmpl-display-one') ){
        let days = 365;

        if( $popup.hasClass('mfn-popup-tmpl-display-cookie-based') ) days = parseInt($popup.attr('data-cookie'));

        let cookie_name = 'mfn_popup_'+$popup.attr('data-id');
        mfnPopup.addCookie(days, cookie_name);
      }

    },

    showPopup: function( $popup ){
      if( !$popup.hasClass('mfn-popup-active') ) $popup.addClass('mfn-popup-active');

      if( $popup.hasClass('mfn-popup-tmpl-hide-automatically-delay') ) mfnPopup.hideAutomatically($popup);
      if( $popup.hasClass('mfn-popup-tmpl-close-button-show-delay') ) mfnPopup.showExitButton($popup);

      if( !$('body').hasClass('mfn-ui') && $popup.hasClass('mfn-popup-close-on-overlay-click') ){
        $popup.bind('click',  mfnPopup.closeOverlayClick);
      }
      
      if( typeof $popup.attr('data-blur') !== 'undefined' ){
        $('body').append('<style class="mfn-popup-tmpl-blur-'+$popup.attr('data-id')+'">#Wrapper{ filter: blur('+$popup.attr('data-blur')+'px) }</style>');
      }

      $(document).trigger('mfnPopupInit');
    },

    closeOverlayClick: function(e) {
      var div = $(e.delegateTarget).find('.mfn-popup-tmpl-content-wrapper');
      if (!div.is(e.target) && div.has(e.target).length === 0){
          mfnPopup.hidePopup($(e.delegateTarget));
          $(e.delegateTarget).unbind('click', mfnPopup.closeOverlayClick);
      }
    },

    hideAutomatically: function($popup) {
        if( $('body').hasClass('mfn-ui') ) return;
        let delay = parseInt( $popup.attr('data-hidedelay') );
        setTimeout(function() { mfnPopup.hidePopup($popup); }, delay);
    },

    showExitButton: function($popup) {
      let delay = parseInt( $popup.attr('data-closebuttondelay') );
      setTimeout(function() { $popup.addClass('mfn-closebutton-active'); }, delay);
    },

    showOnScroll: function() {
      $('.mfn-popup-tmpl.mfn-popup-tmpl-display-on-scroll').each(function() {
        let $popup = $(this);
        let scroll_offset = parseInt( $popup.attr('data-display') );

        $(window).on('scroll', function() {
          if( $(window).scrollTop() > scroll_offset ) mfnPopup.showPopup($popup);
        });

      });
    },

    showOnScrollToElement: function() {
      $('body').imagesLoaded(function() {
        $('.mfn-popup-tmpl.mfn-popup-tmpl-display-scroll-to-element').each(function() {
          let $popup = $(this);
          let scroll_offset = $($popup.attr('data-display')).length ? parseInt( $($popup.attr('data-display')).offset().top ) : 30;

          $(window).on('scroll', function() {
            if( $(window).scrollTop() > scroll_offset ) mfnPopup.showPopup($popup);
          });

        });
      });
    },

    showOnDelay: function() {
      $('.mfn-popup-tmpl.mfn-popup-tmpl-display-start-delay').each(function() {
        let $popup = $(this);
        let delay = parseInt( $popup.attr('data-display') );

        setTimeout(function() {
          mfnPopup.showPopup($popup)
        }, delay);
      });
    },

    showOnExit: function() {
      $('.mfn-popup-tmpl.mfn-popup-tmpl-display-on-exit').each(function() {
        let $popup = $(this);

        $(document).on('mouseleave', function() {
          mfnPopup.showPopup($popup)
        });
      });
    },

    showOnStart: function() {
      $('.mfn-popup-tmpl.mfn-popup-tmpl-display-on-start').each(function() {
        let $popup = $(this);
        mfnPopup.showPopup($popup)
      });
    },

    addCookie(days, cookie_name){

      let date=new Date();
      date.setTime(date.getTime()+(parseInt(days)*24*60*60*1000));
      let expires="; expires="+date.toGMTString();
      document.cookie=cookie_name+"=true"+expires+"; path=/";

    }

  }

  /**
   * Lazy Load images
   */

  document.addEventListener('DOMContentLoaded', () => {

    const images = Array.from(document.querySelectorAll('img.mfn-lazy'));

    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const image = entry.target;
            image.src = image.dataset.src;
            imageObserver.unobserve(image);
            window.dispatchEvent(new Event('resize'));
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    }

  });

})(jQuery);
