
;(function(win, doc){
  'use strict';

  var global = '$plugins';
  var namespace = 'netiveUI.plugins';
  var IS_PLAY_AUDIO = false

  //global namespace
  if (!!win[global]) {
    throw new Error("already exists global!> " + global);
  } else {
    win[global] = createNameSpace(namespace, {
      uiNameSpace: function (identifier, module) { 
        return createNameSpace(identifier, module); 
      }
    });
  }
  function createNameSpace(identifier, module) {
    var name = identifier.split('.'),
              w = win,
              p;

    if (!!identifier) {
      for (var i = 0, len = name.length; i < len; i += 1) {
        (!w[name[i]]) ? (i === 0) ? w[name[i]] = {} : w[name[i]] = {} : '';
        w = w[name[i]];
      }
    }

    if (!!module) {
      for (p in module) {
        if (!w[p]) {
          w[p] = module[p];
        } else {
          throw new Error("module already exists! >> " + p);
        }
      }
    }
    return w;
  }

  $plugins.device = {
    deviceClass: function() {
      var devsize = [1920, 1600, 1440, 1280, 1024, 960, 840, 720, 600, 480, 400, 360];
      var html5tags = ['article', 'aside', 'details', 'figcaption', 'figure', 'footer', 'header', 'hgroup', 'nav', 'main', 'section', 'summary'];
      var width = document.documentElement.offsetWidth,
          colClass = width >= devsize[5] ? 'col12' : width > devsize[8] ? 'col8' : 'col4',
          size_len = devsize.length,
          max = html5tags.length,
          sizeMode,
          timer;

      win[global].breakpoint = width >= devsize[5] ? true : false;

      var deviceSizeClassName = function(w) {
        for (var i = 0; i < size_len; i++) {
          if (w >= devsize[i]) {
            sizeMode = devsize[i];
            win[global].breakpoint = width >= devsize[5] ? true : false;
            break;
          } else {
            w < devsize[size_len - 1] ? sizeMode = 300 : '';
          }
        }
      };

      for (var i = 0; i < max; i++) {
        doc.createElement(html5tags[i]);
      }

      deviceSizeClassName(width);
      var sizeCls = 's' + sizeMode;

      doc.documentElement.classList.add(sizeCls);
      doc.documentElement.classList.add(colClass);
      win.addEventListener('resize', function() {
          clearTimeout(timer);			
          timer = setTimeout(function () {
            var dcHtml = doc.querySelector('html');
              
            width = win.innerWidth;
            deviceSizeClassName(width);

            colClass = width >= devsize[5] ? 'col12' : width > devsize[8] ? 'col8' : 'col4';
            dcHtml.classList.remove('s1920', 's1600', 's1440', 's1280', 's1024', 's940', 's840', 's720', 's600', 's480', 's400', 's360', 's300', 'col12', 'col8', 'col4');
            win[global].breakpoint = width >= devsize[5] ? true : false;

            deviceSizeClassName(width);
            sizeCls = 's' + sizeMode;
            dcHtml.classList.add(sizeCls);
            dcHtml.classList.add(colClass);
          }, 100);
      });
    },
    osClass: function() {
      var ua = navigator.userAgent,
          ie = ua.match(/(?:msie ([0-9]+)|rv:([0-9\.]+)\) like gecko)/i),
          deviceInfo = ['android', 'iphone', 'ipod', 'ipad', 'blackberry', 'windows ce', 'samsung', 'lg', 'mot', 'sonyericsson', 'nokia', 'opeara mini', 'opera mobi', 'webos', 'iemobile', 'kfapwi', 'rim', 'bb10'],
          filter = "win16|win32|win64|mac|macintel",
          uAgent = ua.toLowerCase(),
          deviceInfo_len = deviceInfo.length;
    
      var browser = win[global].browser = {},
          support = win[global].support = {},
          version,
          device;
    
      for (var i = 0; i < deviceInfo_len; i++) {
        if (uAgent.match(deviceInfo[i]) != null) {
          device = deviceInfo[i];
          break;
        }
      }
        
      browser.local = (/^http:\/\//).test(location.href);
      browser.firefox = (/firefox/i).test(ua);
      browser.webkit = (/applewebkit/i).test(ua);
      browser.chrome = (/chrome/i).test(ua);
      browser.opera = (/opera/i).test(ua);
      browser.ios = (/ip(ad|hone|od)/i).test(ua);
      browser.android = (/android/i).test(ua);
      browser.safari = browser.webkit && !browser.chrome;
      browser.app = ua.indexOf('appname') > -1 ? true : false;
    
      //touch, mobile
      support.touch = browser.ios || browser.android || (doc.ontouchstart !== undefined && doc.ontouchstart !== null);
      browser.mobile = support.touch && ( browser.ios || browser.android);
      
      //os
      browser.os = (navigator.appVersion).match(/(mac|win|linux)/i);
      browser.os = browser.os ? browser.os[1].toLowerCase() : '';
  
      //version 
      if (browser.ios || browser.android) {
        version = ua.match(/applewebkit\/([0-9.]+)/i);
        version && version.length > 1 ? browser.webkitversion = version[1] : '';
        if (browser.ios) {
          version = ua.match(/version\/([0-9.]+)/i);
          version && version.length > 1 ? browser.ios = version[1] : '';
        } else if (browser.android) {
          version = ua.match(/android ([0-9.]+)/i);
          version && version.length > 1 ? browser.android = parseInt(version[1].replace(/\./g, '')) : '';
        }
      }
  
      if (ie) {
        browser.ie = ie = parseInt( ie[1] || ie[2] );
        ( 11 > ie ) ? support.pointerevents = false : '';
        ( 9 > ie ) ? support.svgimage = false : '';
      } else {
        browser.ie = false;
      }
  
      var clsBrowser = browser.chrome ? 'chrome' : browser.firefox ? 'firefox' : browser.opera ? 'opera' : browser.safari ? 'safari' : browser.ie ? 'ie ie' + browser.ie : 'other';
      var clsMobileSystem = browser.ios ? "ios" : browser.android ? "android" : 'etc';
      var clsMobile = browser.mobile ? browser.app ? 'ui-a ui-m' : 'ui-m' : 'ui-d';

      $('html').addClass(browser.os);
      $('html').addClass(clsBrowser);
      $('html').addClass(clsMobileSystem);
      $('html').addClass(clsMobile);
    }
  };

  netiveUI.plugins = {
    //accodian
    accodian: function() {
      $('.acco_list_wrap').each(function() {
        var $target = $(this),
            $lists = $target.find('.item_detail'),
            $item = $target.find('.btn_acco_more');
        $item.on('click',function() {
          var $this = $(this),
              $itemView = $this.parent().next();
          $lists.each(function(i) {
            if($item.index($this) !== i) { // ????????? ?????? ???????????? ?????? ??????, ????????? ?????????
              $item.eq(i).removeClass('on');
              $lists.eq(i).slideUp(300);
            }
          });
          if($this.hasClass('on')) {
            $this.removeClass('on');
            $itemView.slideUp(300);
            $this.find('span').text('???????????? ????????? ??????');
          } else {
            $this.addClass('on');
            $itemView.slideDown(300);
            $this.find('span').text('???????????? ????????? ??????');
          }
        });
      });
      // ?????? ????????????
      $('.acco_list_wrap').each(function() {
        var $target = $(this),
        $item = $target.find('.acco_btn');

        $item.on('click',function() {
          var $this = $(this),
              $itemView = $this.parents(".acco_item_head").next(),
              $accoLine = $this.parents(".acco_item_head"); //20210826

          if($this.hasClass('on')) {
              $this.removeClass('on');
              setTimeout(function() { 
                $this.parents('.acco_list_wrap.type_coupon .acco_item_head').css("background-color","#fff");
                $this.parents('.acco_list_wrap.type_check .acco_item_head').css("background-color","#fff");
              }, 300);
              $accoLine.removeClass('border'); //20210826
              $itemView.slideUp(300);
              $this.find('span').text('????????? ??????');
              
          } else {
              $this.addClass('on');
              $this.parents('.acco_list_wrap.type_coupon .acco_item_head').css("background-color","#f6f7f8");
              $this.parents('.acco_list_wrap.type_check .acco_item_head').css("background-color","#f6f7f8");
              $accoLine.addClass('border'); //20210826
              $itemView.slideDown(300);
              $this.find('span').text('????????? ??????');
          }
        });   
      });
      //20210715 ???????????? ??? ???????????? ?????????
      $('.acco_list_slide').each(function () {
        var $item = $(this).find('.acco_btn');

        $item.on('click', function () {          
          var swiper = new Swiper(".type_check_slide", {
            slidesPerView: "auto",
            spaceBetween: 11,
            observer: true,
            observeParents: true
          });
        });
      });

      // ????????? ?????? ????????????
      $('.acco_list_wrap').each(function() {
        var $target = $(this),
            $item = $target.find('.btn_txt');
          
            $item.on('click',function() {
              var $this = $(this),
                  $itemView = $this.parents(".acco_item_head").next();
              if($this.hasClass('on')) {
                $this.removeClass('on');
                $itemView.slideUp(300);
              } else {
                $this.addClass('on');
                $itemView.slideDown(300);
              }
            });          
      });
    },
    termAgree: function() {
      //????????????
      $(".check_box.term").on("change", "#termCheckAll", function () {
        var $target = $(this),
            checked = $target.is(':checked'),
            $inputItem = $target.parents('.check_box.term').find('input');

        if(checked) {
          $inputItem.prop('checked', true);
        } else {
          $inputItem.prop('checked', false);
        }
      });
      //?????? ??????
      $('.item_cont').on('change', '.chkItem', function() {
        var isChecked = true;
        $('.item_cont .chkItem').each(function() {
          isChecked = isChecked && $(this).is(":checked");
        });
        $('#termCheckAll').prop('checked', isChecked);
      });
    },
    //tabmenu
    tabMenu: function() {
      $('.tab_menulist').each(function(){                 
        var $this = $(this),                         
            $tab = $this.find('li.active'),           
            $link = $tab.find('a'),                    
            $panel = $($link.attr('href'));             
    
        $this.on('click', '.tab_control', function(e) { 
          e.preventDefault();                          
          var $link = $(this),                          
              id = this.hash;                       
    
          if (id && !$link.is('.active')) {   
            $panel.removeClass('active');              
            $tab.removeClass('active');              
    
            $panel = $(id).addClass('active');          
            $tab = $link.parent().addClass('active');   
          }
        });
      });
    },
    // selectBox
    selectBox: function() {
      var selectBox = $('.select_wrap.sel_type01'),
      // selectBox_a = selectBox.children('a'),
      selectBox_ul = selectBox.find('ul');

      selectBox.click(function() {
          if (selectBox_ul.css('display') === 'none') {
              selectBox_ul.show();
              selectBox.addClass('on');
          } else {
              selectBox_ul.hide();
              selectBox.removeClass('on');
          }
      });

      $('.selectBox > li').click(function() {
        var value = $(this).text();
        $('.select_wrap.sel_type01 > a').text(value);
      });
    },
    // ???????????? ?????? ??????
    topMove: function() {
      var srollTop = $('.scroll_nav_item .btn_top'), //20210804
          docHeight = $(document).height(),
          winHeight = $(window).height();
      $(window).scroll(function () {
        //????????? ???????????? ???????????? ???
        if ($(window).scrollTop() + winHeight >= docHeight) {
          srollTop.fadeIn(); //???????????? ??????
          srollTop.addClass('bottom') //20210819 addClass ??????
          
          // navItem.fadeOut() //20210819 ?????? ???????????? ?????? ??????
          // footerTxtbox.fadeOut() //20210819 ?????? ???????????? ?????? ??????
        }
        else {        
          //20210819 srollTop.fadeOut(); ??????
          srollTop.removeClass('bottom') //20210819 removeClass ??????
          
          // navItem.fadeIn(); //20210819 ?????? ???????????? ?????? ??????
          // footerTxtbox.fadeIn() //20210819 ?????? ???????????? ?????? ??????
        }        

        
      });
      //scrolltop btn
      $(".scroll_nav_item .btn_top").click(function (){ //20210804
          $('html, body').stop().animate({
              scrollTop : 0
          }, 400);
          $('.health_footer').removeClass('scroll');
          return false;
      });
    },
    bookMark: function() {
      $(".btn_ico_bookmark_b, .btn_ico.bookmark").click(function() {
        if($(this).hasClass("on")) {
          $(this).removeClass("on");
        } else {
          $(this).addClass("on");
        }
      });
    },
    //pop alert
    popAlert: function(v) {
      /*
        ????????? ????????? ?????? ????????? ?????? ?????????
        - ??????????????? ?????? ????????? ?????????
        - ????????? ???????????? ????????? ????????? ????????? ?????? ??? ??????
          : ????????? ?????? ????????? ?????? ????????? 90%??? ??????
      */
      var $t = $(v),                        // ??????
          $btnClose = $t.find('.ui-close'), // ?????? ??? ?????? ??????
          $tC = $t.children('.inner'),
          wH = window.innerHeight,          // ?????? ?????????
          $body = $('body');

      $body.height(wH).css('overflow','hidden');
      $tC.css({'top': '50%'});
      $t.show();

      var $tH = $tC.innerHeight(),           // ?????? ?????????
          $half = $tH/2;

      if($tH >= wH * 0.9) {
        $tC.css({'height': wH * 0.9, 'overflow-y': 'auto'});
        $tH = $tC.innerHeight();
        $half = $tH/2;
      }

      $tC.css({'margin-top': '-' + $half + 'px'});
      setTimeout(function() {
        $t.addClass('actived');
      }, 150);

      $btnClose.off().on('click', function() {
        $t.removeClass('actived');
        $body.height('auto').css('overflow','visible');
        setTimeout(function() {
          $t.hide(300);
          $tC.removeAttr('style');
        }, 300);
      });
    },
    //pop toast
    popToast: function(v) {
      var $t = $(v),
          $btnClose = $t.find('.ui-close');

      $t.show().addClass('actived');

      $btnClose.off().on('click', function() {
        $t.removeClass('actived');
        setTimeout(function() {
          $t.hide(300);
        }, 300);
      });
    },
    popFull: function(v) {
      var $t = $(v),
      $btnClose = $t.find('.ui-close');
      var offset = $(window).scrollTop();
      console.log($t);
      if((typeof $t === 'object' || $t !== null)) {
        $(window).scrollTop(0);
        $t.show().addClass('actived');
        $("body").addClass('ov_hidden');
      }

      $btnClose.off().on('click', function() {
        $t.removeClass('actived');
        $(window).scrollTop(offset);
        $("body").removeClass("ov_hidden");
        console.log($t);
        setTimeout(function() {
          $t.hide(300);
        }, 300);
      });
    },
    popFully: function (v) {
      var $t = $(v),
      $btnClose = $t.find('.aui-close');
      var offset = $(window).scrollTop();
      if ((typeof $t === 'object' || $t !== null)) {
        console.log($t);
        $(window).scrollTop(0);
        $t.show().addClass('actived2');
        $("body").addClass('ov_hidden');
      }

      $btnClose.off().on('click', function () {
        var aa = netiveUI.plugins['popFull'];
        $t.removeClass('actived2');
        $(window).scrollTop(offset);
        console.log($t);
        if (aa.$t !== null) {
          $("body").addClass("ov_hidden");
        }
        setTimeout(function () {
          $t.hide(300);
        }, 300);
      });
    },
    audio: function (v) {
      var newaudio = new Array();
      // var IS_PLAY = false;
      var $t = $(v);
      var $a = $t.index('button');
      if ((typeof $t === 'object' || $t !== null)) {
        fnInitAudio();
        fnInitEvent();
      }
      function fnInitAudio() {
        newaudio[$a] = new Audio("../../resources/audio/sample_" + $a + ".wav");

        newaudio[$a].onended = function () {
          IS_PLAY_AUDIO = false;
        };
      }
      function fnInitEvent() {
        if ($t !== null) {
          fnPlayAudio($a)
        }

      }

      function fnPlayAudio(index) {
        if (IS_PLAY_AUDIO == false) {
          newaudio[index].play();

          IS_PLAY_AUDIO = true;
          
        }
      }

    },
    //header
    //20210818 header scroll ??????
    headerScroll: function() {
      var sc = $(window).scrollTop();

      if (sc > 100) {
        $(".health_header").addClass("scroll")
      } else {
        $(".health_header").removeClass("scroll")
      }
    },
    //footer
    footer_nav: {
      $scrollElement: $('body, html'),
      $scrollTopPrev: [],
      $navi: null,
      className: 'scroll',
      classNameCaseHidden: 'case_hideen', //20210819
      classNameCaseBottom: 'case_bottom', //20210819
      $bubbleBox: null, //20210819
      scrollDirection: function() {
        // ????????? ??????, ?????? scrollTop, ??????(??????) scrollTop??? ?????? ???????????? scroll UP, DOWN ??? ??????
        var o = this;
        // console.log(o.className);

        o.$scrollTopPrev.push(o.$scrollElement.scrollTop());
        if(o.$scrollTopPrev[0] >= o.$scrollElement.scrollTop()) {
          // console.log('UP');
          o.$navi.removeClass(o.className);
          o.$bubbleBox.removeClass(o.classNameCaseHidden); //20210819
        } else {
          // console.log('DOWN');
          o.$navi.addClass(o.className);
          o.$bubbleBox.addClass(o.classNameCaseHidden); //20210819
        }
      },
      scrollEffect: function() {
        var o = this;
        $(window).on('touchmove', function() {
          o.scrollDirection();
        });
        $(window).on('touchend', function() {
          o.$scrollTopPrev = [];
        });
        //20210819 ????????? ????????? case ??????
        $(window).on('scroll', function() {
          // ???????????? ????????? ??? ?????? ??????
          if(window.innerHeight + o.$scrollElement.scrollTop() === o.$scrollElement.height()) {
            o.$navi.addClass(o.classNameCaseBottom);
          } else {
            o.$navi.removeClass(o.classNameCaseBottom);
          }
        });

      },
      //20210819
      footerNone: function() {
        var o = this;
        o.$bubbleBox.on('click', function () {
          $(this).addClass('none');
        });
      },
      init: function() {
        var o = this;
        o.$navi = $('.health_footer');
        o.$bubbleBox = $('.footer_bubbleBox'); //20210819

        o.scrollEffect();
        o.footerNone();
      }
    },
    jqRange:function(){
      if($('.range_slider').length){
        $('.range_slider').each(function(){
          var $slider = $(this).find('.slider'),
            $list = $(this).find('.list'),
            $min = parseInt($slider.data('min')),
            $max = parseInt($slider.data('max')),
            $val = parseInt($slider.data('value')),
            $step = parseInt($slider.data('step')),
            $currentNum = $(this).find('.value');
  
          if(!$min)$min = 0;
          if(!$max)$max = 5;
          if(!$step)$step = 1;
          if(!$val)$val = $min;
            
          var range = $slider.slider({
            min:$min,
            max:$max,
            value:$val,
            step:$step,
            range:'min',
            create:function(e){
              $list.find('li').eq(($val-$min)/$step).addClass('on').find('a').attr('title','????????????');
              $currentNum.text($currentNum.data('value'));
            },
            stop:function(event,ui){
              $slider.data('value',ui.value);
              $currentNum.data('value',ui.value);
              $currentNum.text($currentNum.data('value'));
              $list.find('li').eq((ui.value-$min)/$step).siblings().removeClass('on').removeAttr('title');
              $list.find('li').eq((ui.value-$min)/$step).addClass('on').find('a').attr('title','????????????');
            },
            slide: function(event,ui) {
              $slider.data('value',ui.value);
              $currentNum.data('value',ui.value);
              $currentNum.text($currentNum.data('value'));
            }
          });
  
          $list.find('a').click(function(e){
            e.preventDefault();
            var $txt = parseInt($(this).data('number'));
            range.slider('value',$txt);

            $currentNum.data('value',$txt);
            $currentNum.text($currentNum.data('value'));
            
            $(this).parent().addClass('on').find('a').attr('title','????????????');
            $(this).parent().siblings().removeClass('on').find('a').removeAttr('title');
          });
  
        });
      }
    },
    //20210817 app ??????????????? (100vh)
    setScreenSize: function() {
      let vh = window.innerHeight * 0.01;   

      document.documentElement.style.setProperty('--vh', `${vh}px`);
    },
  };
  

  $.fn.uiCheckAll = function() {
    return this.each(function() {
      $plugins.uiCheckAll = {
        gTarget: null,
        gAllObj: null,
        gItemObj: null,
        gLength: null,
        gCheckedLength: 0,
        checkAllFn: function(v) {
          var o = this,
              $t = $(v),
              $boolean = $t.is(':checked'),
              $parent = $t.parent();

          o.gItemObj.prop('checked', $boolean);
          if($boolean) {
            o.gCheckedLength = o.gLength;
          } else {
            o.gCheckedLength = 0;
          }
        },
        checkItemFn: function(v) {
          var o = this,
              $t = $(v),
              $boolean = $t.is(':checked'),
              $parent = $t.parent();
          
          if($boolean) {
            o.gCheckedLength = o.gCheckedLength + 1;
          } else {
            o.gCheckedLength = o.gCheckedLength - 1;
          }

          if(o.gCheckedLength === o.gLength) {
            o.gAllObj.prop('checked', true);
          } else {
            o.gAllObj.prop('checked', false);
          }
        },
        init: function(v) {
          var o = this;
          o.gTarget = $(v);
          o.gAllObjParent = o.gTarget.find('.ui-allBtn');
          o.gAllObj = o.gAllObjParent.find('input[type=checkbox]');
          o.gItemObjParent = o.gTarget.find('.ui-checkList');
          o.gItemObj = o.gItemObjParent.find('input[type=checkbox]');
          o.gLength = o.gItemObj.length;

          // ?????? ??????, ?????? ??????
          o.gAllObj.on('click.allChk', function() {
            o.checkAllFn(this);
          });
            
            // ?????? ??????
          o.gItemObj.on('click.itemChk', function() {
            o.checkItemFn(this);
          });
        }
      }
      $plugins.uiCheckAll.init(this);
    });
  }
  // tooltip
  $.fn.uiToolTip = function () {
    return this.each(function () {
      var $t = $(this),
        _parent = '.ui-tooltip-wrap',
        _tooltip = '.toolTip',
        _edge = '.toolTip > i',
        _closeBtn = '.typeModalClose',
        $parent = $t.closest(_parent),
        $tootip = $t.closest(_parent).find(_tooltip),
        $edge = $t.closest(_parent).find(_edge),
        $closeBtn = $tootip.find(_closeBtn),
        $mob = $('html').hasClass('ui-m'),
        edgePos = '30px',
        $winW = $(window).width(),
        whiteSpace = 32; // ??????????????? ????????? ?????? ??????

      $t.on('click', function () {

        if ($tootip.is(':visible')) return;

        $tootip.show();
        if ($tootip.offset().left + $tootip.innerWidth() > $(window).width()) { // ????????? offset left ??? + ???????????? ???????????? ??????????????? ?????????, ??? ????????? ????????? ??????
          $tootip.css('right', '-' + edgePos);
          $edge.css('right', edgePos);
        } else {
          if ($mob) {
            // $tootip ?????? ??????
            console.log($winW, $tootip.offset().left, Math.floor($tootip.offset().left) + whiteSpace);
            $tootip.css({
              'width': $winW - (whiteSpace * 2),
              'left': Math.floor(whiteSpace - $tootip.offset().left) + 'px',
            });
            $edge.css('left', $t.offset().left - $tootip.offset().left);
          } else {
            $tootip.css('left', '-' + edgePos);
            $edge.css('left', edgePos);
          }
        }
        setTimeout(function () {
          $parent.addClass('active');
          
        }, 100);

        $closeBtn.off().on('click', function () {
          $parent.removeClass('active');
          setTimeout(function () {
            $tootip.removeAttr('style');
            $edge.removeAttr('style');
            $t.focus();
          }, 100);
        });
      });
    });
  }
  
  // ?????? ?????? ????????????
  $.fn.uiCheckSubAll = function() {
    return this.each(function() {
      $plugins.uiCheckSubAll = {
        gTarget: null,
        gAllObj: null,
        gItemObj: null,
        gLength: null,
        gCheckedLength: 0,
        checkAllConditionFn: function() {
          var o = this;
          if(o.gCheckedLength === o.gLength) {
            o.gAllObj.prop('checked', true);
          } else {
            o.gAllObj.prop('checked', false);
          }
        },
        checkAllFn: function(v) { // ?????? ??????
          var o = this,
            $t = $(v),
            $boolean = $t.is(':checked'),
            $parent = $t.parent();

          o.gItemSubObjParent = o.gTarget.find('.item_detail .item');
          o.gItemSubObj = o.gItemSubObjParent.find('input[type=checkbox]');

          o.gItemObj.prop('checked', $boolean);
          o.gItemSubObj.prop('checked', $boolean);

          if($boolean) {
            o.gCheckedLength = o.gLength;
          } else {
            o.gCheckedLength = 0;
          }
        },
        checkItemFn: function(v) { // ?????? ??????
          var o = this,
            $t = $(v),
            $boolean = $t.is(':checked'),
            $parent = $t.parent();

          // ?????? ??????
          o.gItemSubObjParent = $t.parent('.item').next('.item_detail').find('.item');
          o.gItemSubObj = o.gItemSubObjParent.find('input[type=checkbox]');

          o.gItemSubObj.prop('checked', $boolean);

          if($boolean) {
            o.gCheckedLength = o.gCheckedLength + o.gItemSubObj.length + 1;
          } else {
            o.gCheckedLength = o.gCheckedLength - o.gItemSubObj.length - 1;
          }
          
          o.checkAllConditionFn();
        },
        checkItemSubFn: function(v) { // ?????? ?????? ??????
          var o = this,
            $t = $(v),
            $boolean = $t.is(':checked'),
            $parent = $t.closest('.item_detail').find('.item'),
            $obj = $parent.find('input[type=checkbox]'),
            $objLength = $obj.length,
            $objCheckedLength = $parent.find('input[type=checkbox]:checked').length,
            $allObj = $t.closest('.item_detail').prev('.item').find('input[type=checkbox]');
          
          if($boolean) {
            o.gCheckedLength = o.gCheckedLength + 1;
          } else {
            o.gCheckedLength = o.gCheckedLength - 1;
          }

          if($objLength === $objCheckedLength) {
            o.gCheckedLength = o.gCheckedLength + 1;
            $allObj.prop('checked', true);
          } else {
            if($allObj.prop('checked')) {
              o.gCheckedLength = o.gCheckedLength - 1;
            }
            $allObj.prop('checked', false);
          }
          
          o.checkAllConditionFn();
        },
        init: function(v) {
          var o = this;
          o.gTarget = $(v);

          // ??????
          o.gAllObjParent = o.gTarget.find('.item_head');
          o.gAllObj = o.gAllObjParent.find('input[type=checkbox]');

          // ??????
          o.gItemObjParent = o.gTarget.find('.item_cont > .item');
          o.gItemObj = o.gItemObjParent.find('input[type=checkbox]');

          // ?????? ??????
          o.gItemSubObjParent = o.gTarget.find('.item_detail .item');
          o.gItemSubObj = o.gItemSubObjParent.find('input[type=checkbox]');

          o.gLength = o.gItemObj.length + o.gItemSubObj.length;

          // ?????? ??????, ?????? ??????
          o.gAllObj.on('click.allChk', function() {
            o.checkAllFn(this);
          });
          
          // ?????? ??????
          o.gItemObj.on('click.itemChk', function() {
            o.checkItemFn(this);
          });
          
          // ?????? ?????? ??????
          o.gItemSubObj.on('click.itemSubChk', function() {
            o.checkItemSubFn(this);
          });
        }
      }
      $plugins.uiCheckSubAll.init(this);
    });
  }
  //20210824 textEffect(????????? ??????)
  $.fn.textEffect = function(opts) {
    var defaults = $.extend({
      type : 'default',
      delay: 0.5,
      callback: null,
    }, opts);
    return this.each(function() {
      var $t = $(this),
          $child = $t.children(),
          childLength = $child.length,
          checkType = childLength === 1 && defaults.type === 'typing';

      var startFn = function(n) {
        var delay;
        (Array.isArray(defaults.delay) && defaults.delay.length === childLength)  // delay ?????? ????????? ??????, ??? ???????????? item??? ?????? ?????? ???????????? ????????? ??? ??????
          ? delay = defaults.delay[n] * 1000
          : delay = defaults.delay * 1000;

        checkType ? $child.eq(n).delay(delay).show() : $child.eq(n).delay(delay).fadeIn();

        if(n < childLength) {
          n = n + 1;
          setTimeout(function() {
            startFn(n);
          }, delay);
        } else {
          if(typeof defaults.callback === 'function') {
            defaults.callback();
          }
        }
      }

      // typing ????????? ???????????? ??????
      if(checkType) {
        var childText = $child.html();

        if(childText.split('<br>').length > 1) {
          childText = childText.replace(/<br>/gi,'^'); // <br> ??? ^ ??? ??????
        }

        var childTextLength = childText.length,
            childTextArray = [];

        for(var i=0; i < childTextLength; i++) {
          if(childText.substr(i,1) === '^') {
            childTextArray.push('<span><br></span>');
          } else {
            childTextArray.push('<span>' + childText.substr(i,1) + '</span>');
          }
          $t.append(childTextArray[i]);
        }
        
        $child = $t.children(),
        childLength = $child.length;
          
        setTimeout(function() {
          startFn(1); // ?????? ??????
        }, 1000);
      }
      // default ????????? ???????????? ??????
      else {
        startFn(0); // ?????? ??????
      }
      
    });
  }

  $plugins.pageReload = {
    $touchTarget: null,
    $scrollTarget: $('body, html'),
    startX: null,
    startY: null,
    endX: null,
    endY: null,
    activeCondition: 200,
    touchStart: function () {
      var o = this;
      o.$touchTarget.on('touchstart.reload', function (event) { //20210818 reload ??????
        if (!o.$scrollTarget.scrollTop()) {
          o.startX = event.originalEvent.changedTouches[0].pageX;
          o.startY = event.originalEvent.changedTouches[0].pageY;
        }
      });
    },
    touchMove: function () {
      var o = this;

      o.$touchTarget.on('touchmove.reload', function (event) { //20210818 reload ??????
        if (!o.$scrollTarget.scrollTop()) { // ????????? ??????
          o.endX = event.originalEvent.changedTouches[0].pageX;
          o.endY = event.originalEvent.changedTouches[0].pageY;

          if (o.endY - o.startY > o.activeCondition) {
            $('.ui-reload').addClass('active');
          } else {
            $('.ui-reload').removeClass('active');
          }
        }
      });

    },
    touchEnd: function (callback) {
      var o = this;

      o.$touchTarget.on('touchend.reload', function (event) { //20210818 reload ??????
        if ($('.ui-reload').hasClass('active')) {
          o.endX = event.originalEvent.changedTouches[0].pageX;
          o.endY = event.originalEvent.changedTouches[0].pageY;

          if (o.endY - o.startY > o.activeCondition) {
            if (typeof callback === 'function') {
              callback();
            }
          }
        }
      });
    },
    // 20210818 destroy case ??????
    destroy: function () {
      var o = this;

      o.$touchTarget.off('touchstart.reload');
      o.$touchTarget.off('touchmove.reload');
      o.$touchTarget.off('touchend.reload');


    },
    init: function (callback) {
      var o = this;
      o.$touchTarget = $('.health_wrap');

      if (!$('.ui-reload').length) $('.health_container').before('<div class="ui-reload"></div>');

      // ???????????? ?????? ?????? ??????
      if (o.$touchTarget.hasClass('type_bg_purple') || o.$touchTarget.hasClass('type_bg_gray')) {
        $('.ui-reload').addClass('bgColor');
      }

      o.touchStart();
      o.touchMove();
      o.touchEnd(callback);
    }
  }

  //run
  $(doc).ready(function() {
    $plugins.device.deviceClass();
    $plugins.device.osClass();

    netiveUI.plugins.accodian(); //????????????
    netiveUI.plugins.tabMenu(); //tabmenu
    netiveUI.plugins.jqRange();//range
    netiveUI.plugins.topMove();
    netiveUI.plugins.bookMark();
    netiveUI.plugins.selectBox();
    netiveUI.plugins.footer_nav.init();
    netiveUI.plugins.setScreenSize(); //20210817 100vh
    //20211019 ??????
    $('.typeInfo').uiToolTip();
    
    $plugins.pageReload.init(function() { //touch end ?????? ????????? ?????? ??????
      location.reload();
    });

    //20210818 ?????? close btn
      $('.banner_area .close_btn').click(function () {
        $('.banner_area_wrap').fadeOut();
      });


    //header scroll
    $(window).scroll(function () {
      netiveUI.plugins.headerScroll();

      //20210818 bannerFn
      if ($('.health_header').hasClass('scroll')) {
        $('.banner_area').addClass('fixed');        
      } else {
        $('.banner_area').removeClass("fixed") 
      } 
    });

    $(window).resize(function () {
      netiveUI.plugins.setScreenSize(); //20210817 100vh
    });
  });

})(window, document);
