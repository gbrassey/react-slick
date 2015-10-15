'use strict';

var checkSpecKeys = function (spec, keysArray) {
  return keysArray.reduce((value, key) => {
    return value && spec.hasOwnProperty(key);
  }, true) ? null : console.error('Keys Missing', spec);
};

export var getTrackCSS = function(spec) {
  checkSpecKeys(spec, [
    'left', 'variableWidth', 'slideCount', 'slidesToShow', 'slideWidth'
  ]);

  var trackWidth;

  if (spec.variableWidth) {
    trackWidth = (spec.slideCount + 2 * Math.ceil(spec.slidesToShow)) * spec.slideWidth;
  } else if (spec.centerMode) {
    trackWidth = (spec.slideCount + 2 * (Math.ceil(spec.slidesToShow) + 1)) * spec.slideWidth;
  } else {
    trackWidth = (spec.slideCount + 2 * Math.ceil(spec.slidesToShow)) * spec.slideWidth;
  }

  var style = {
    opacity: 1,
    width: trackWidth,
    WebkitTransform: 'translate3d(' + spec.left + 'px, 0px, 0px)',
    transform: 'translate3d(' + spec.left + 'px, 0px, 0px)',
    transition: '',
    WebkitTransition: '',
    msTransform: 'translateX(' + spec.left + 'px)'
  };

  // Fallback for IE8
  if (!window.addEventListener && window.attachEvent) {
    style.marginLeft = spec.left + 'px';
  }

  return style;
};

export var getTrackAnimateCSS = function (spec) {
  checkSpecKeys(spec, [
    'left', 'variableWidth', 'slideCount', 'slidesToShow', 'slideWidth', 'speed', 'cssEase'
  ]);

  var style = getTrackCSS(spec);
  // useCSS is true by default so it can be undefined
  style.WebkitTransition = '-webkit-transform ' + spec.speed + 'ms ' + spec.cssEase;
  style.transition = 'transform ' + spec.speed + 'ms ' + spec.cssEase;
  return style;
};

export var getTrackLeft = function (spec) {

  checkSpecKeys(spec, [
   'slideIndex', 'trackRef', 'infinite', 'centerMode', 'slideCount', 'slidesToShow',
   'slidesToScroll', 'slideWidth', 'listWidth', 'variableWidth']);

  var slideOffset = 0;
  var targetLeft;
  var targetSlide;
  var slidesToShowCeil = Math.ceil(spec.slidesToShow);

  if (spec.fade) {
    return 0;
  }

  if (spec.infinite) {
    if (spec.slideCount > slidesToShowCeil) {
     slideOffset = (spec.slideWidth * slidesToShowCeil) * -1;
    }
    if (spec.slideCount % spec.slidesToScroll !== 0) {
      if (spec.slideIndex + spec.slidesToScroll > spec.slideCount && spec.slideCount > slidesToShowCeil) {
          if(spec.slideIndex > spec.slideCount) {
            slideOffset = ((slidesToShowCeil - (spec.slideIndex - spec.slideCount)) * spec.slideWidth) * -1;
          } else {
            slideOffset = ((spec.slideCount % spec.slidesToScroll) * spec.slideWidth) * -1;
          }
      }
    }
  }

  if (spec.centerMode) {
    let centerOffset = ((spec.slideWidth * spec.slidesToShow) - spec.slideWidth) / 2;
    if(spec.infinite) {
      slideOffset += centerOffset;
    } else {
      slideOffset = centerOffset;
    }
  }

  targetLeft = ((spec.slideIndex * spec.slideWidth) * -1) + slideOffset;

  if (spec.variableWidth === true) {
      var targetSlideIndex;
      if(spec.slideCount <= slidesToShowCeil || spec.infinite === false) {
          targetSlide = spec.trackRef.getDOMNode().childNodes[spec.slideIndex];
      } else {
          targetSlideIndex = (spec.slideIndex + slidesToShowCeil);
          targetSlide = spec.trackRef.getDOMNode().childNodes[targetSlideIndex];
      }
      targetLeft = targetSlide ? targetSlide.offsetLeft * -1 : 0;
      if (spec.centerMode === true) {
          if(spec.infinite === false) {
              targetSlide = spec.trackRef.getDOMNode().children[spec.slideIndex];
          } else {
              targetSlide = spec.trackRef.getDOMNode().children[(spec.slideIndex + slidesToShowCeil + 1)];
          }

          targetLeft = targetSlide ? targetSlide.offsetLeft * -1 : 0;
          targetLeft += (spec.listWidth - targetSlide.offsetWidth) / 2;
      }
  }

  return targetLeft;
};
