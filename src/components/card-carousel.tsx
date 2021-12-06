/* eslint-disable react/require-default-props */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-plusplus */
/* eslint-disable prefer-destructuring */
import { useState, useEffect } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useSwipeable } from 'react-swipeable';
import PropTypes from 'prop-types';
import './card-carousel.scss';
import { ThemeOptions, useMediaQuery } from '@mui/material';

// const isEqual = require("react-fast-compare");

export function CardCarousel(props) {
  const [slideTotal, setSlideTotal] = useState(0);
  const [slideCurrent, setSlideCurrent] = useState(-1);
  const [slides, setSlides] = useState([]);
  const [height, setHeight] = useState('0px');
  const small = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.down('sm'));
  const medium = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.down('md'));

  const slideRight = () => {
    let preactiveSlide;
    let proactiveSlide;
    let slideCurrentLoc = slideCurrent;
    const activeClass = 'slider-single active';
    const slide = [...slides];
    if (slideTotal > 1) {
      if (slideCurrentLoc < slideTotal) {
        slideCurrentLoc++;
      } else {
        slideCurrentLoc = 0;
      }
      if (slideCurrentLoc > 0) {
        preactiveSlide = slide[slideCurrentLoc - 1];
      } else {
        preactiveSlide = slide[slideTotal];
      }
      const activeSlide = slide[slideCurrentLoc];
      if (slideCurrentLoc < slideTotal) {
        proactiveSlide = slide[slideCurrentLoc + 1];
      } else {
        proactiveSlide = slide[0];
      }

      slide.forEach((slid) => {
        if (slid.class.includes('preactivede')) {
          slid.class = 'slider-single proactivede';
        }
        if (slid.class.includes('preactive')) {
          slid.class = 'slider-single preactivede';
        }
      });

      preactiveSlide.class = 'slider-single preactive';
      activeSlide.class = activeClass;
      proactiveSlide.class = 'slider-single proactive';
      setSlides(slide);
      setSlideCurrent(slideCurrentLoc);

      if (document.getElementsByClassName('slider-single active').length > 0) {
        setTimeout(() => {
          if (document.getElementsByClassName('slider-single active').length > 0) {
            const h = document.getElementsByClassName('slider-single active')[0].clientHeight;
            setHeight(`${h}px`);
          }
        }, 500);
      }
    } else if (slide[0] && slide[0].class !== activeClass) {
      slide[0].class = activeClass;
      setSlides(slide);
      setSlideCurrent(0);
    }
  };
  const slideLeft = () => {
    if (slideTotal > 1) {
      let preactiveSlide;
      let proactiveSlide;
      let slideCurrentLoc = slideCurrent;
      const slide = [...slides];
      if (slideCurrentLoc > 0) {
        slideCurrentLoc--;
      } else {
        slideCurrentLoc = slideTotal;
      }

      if (slideCurrentLoc < slideTotal) {
        proactiveSlide = slide[slideCurrentLoc + 1];
      } else {
        proactiveSlide = slide[0];
      }
      const activeSlide = slide[slideCurrentLoc];
      if (slideCurrentLoc > 0) {
        preactiveSlide = slide[slideCurrentLoc - 1];
      } else {
        preactiveSlide = slide[slideTotal];
      }
      slide.forEach((slid) => {
        if (slid.class.includes('proactivede')) {
          slid.class = 'slider-single preactivede';
        }
        if (slid.class.includes('proactive')) {
          slid.class = 'slider-single proactivede';
        }
      });
      preactiveSlide.class = 'slider-single preactive';
      activeSlide.class = 'slider-single active';
      proactiveSlide.class = 'slider-single proactive';
      setSlides(slide);
      setSlideCurrent(slideCurrentLoc);
      if (document.getElementsByClassName('slider-single active').length > 0) {
        setTimeout(() => {
          if (document.getElementsByClassName('slider-single active').length > 0) {
            const h = document.getElementsByClassName('slider-single active')[0].clientHeight;
            setHeight(`${h}px`);
          }
        }, 500);
      }
    }
  };

  const sliderClass = (direction) => {
    let sliderCls = `slider-${direction}${small ? ' small' : medium ? ' medium' : ' large'}`;
    if (!props.arrows) {
      sliderCls = 'slider-disabled';
    }
    return sliderCls;
  };
  const handlers = useSwipeable({
    onSwipedLeft: () => slideRight(),
    onSwipedRight: () => slideLeft(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });
  useEffect(() => {
    if (slideTotal > 0) {
      return;
    }
    const locSlides = [];
    props.slides.forEach((slide) => {
      const slideobject = {
        class: 'slider-single proactivede',
        element: slide,
      };
      locSlides.push(slideobject);
    });
    if (props.slides.length === 2) {
      props.slides.forEach((slide) => {
        const slideobject = {
          class: 'slider-single proactivede',
          element: slide,
        };
        locSlides.push(slideobject);
      });
    }
    setSlides(locSlides);
    setSlideTotal(locSlides.length - 1);
    setSlideCurrent(-1);
    if (slideCurrent === -1) {
      setTimeout(() => {
        slideRight();
      }, 500);
    }
  }, [props.slides, slideTotal]);
  useEffect(() => {
    if (slideCurrent === -1) {
      setTimeout(() => {
        slideRight();
      }, 500);
    }
  }, [slides, slideCurrent]);

  return (
    <div
      className="react-3d-carousel"
      style={{
        height,
        maxWidth: small ? '500px' : medium ? '700px' : '800px',
        minWidth: small ? '500px' : medium ? '700px' : '800px',
      }}
      {...handlers}
    >
      {slides && slides.length > 0 && (
        <div className="slider-container">
          <div className="slider-content" style={{ width: small ? '40%' : '100%' }}>
            {slides.map((slider, index) => (
              <div className={slider.class} key={index}>
                <div className={sliderClass('left')} onClick={slideLeft}>
                  <div>
                    <ArrowBackIosIcon sx={{ height: '30px', width: '30px', color: 'background.paper' }} />
                  </div>
                </div>
                <div className={sliderClass('right')} onClick={slideRight}>
                  <div>
                    <ArrowForwardIosIcon sx={{ height: '30px', width: '30px', color: 'background.paper' }} />
                  </div>
                </div>

                <div className="slider-single-content">{slider.element}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
CardCarousel.propTypes = {
  slides: PropTypes.arrayOf(PropTypes.element),
  interval: PropTypes.number,
  arrows: PropTypes.bool,
  arrowBorders: PropTypes.bool,
};
CardCarousel.defaultProps = {
  interval: 3000,
  arrows: true,
  arrowBorders: false,
};
