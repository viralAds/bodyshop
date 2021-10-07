(function () {
  "use strict";

  function startSetup(
    sliderSize,
    slideSize,
    animationDuration,
    autoplayInterval
  ) {
    this.sliderSize = parseFloat(sliderSize) / 100;
    this.slideSize = parseFloat(slideSize) / 100;
    this.animationDuration = parseFloat(animationDuration);
    this.autoplayInterval = parseFloat(autoplayInterval);
  }

  function Slider(
    newSlider,
    sliderSize,
    slideSize,
    animationDuration,
    autoplayInterval
  ) {
    (this.startSetup = new startSetup(
      sliderSize,
      slideSize,
      animationDuration,
      autoplayInterval
    )),
      (this.wrapper = newSlider.querySelector(".wrapper"));

    this.slides = newSlider.querySelectorAll(
      ".circular-slider .wrapper .slides-holder .slides-holder__item"
    );

    this.slidesSize = 0;

    this.descriptionsHolder = newSlider.querySelector(
      ".circular-slider .wrapper .descriptions"
    );

    this.descriptions = newSlider.querySelectorAll(
      ".circular-slider .wrapper .descriptions .descriptions__item"
    );

    this.slidesHolder = newSlider.querySelector(
      ".circular-slider .wrapper .slides-holder"
    );

    this.btnLeft = newSlider.querySelector(
      ".circular-slider .wrapper .controls .controls__left"
    );

    this.btnRight = newSlider.querySelector(
      ".circular-slider .wrapper .controls .controls__right"
    );

    this.btnAutoplay = newSlider.querySelector(
      ".circular-slider .wrapper .controls .controls__autoplay"
    );

    this.currentAngle = 0;

    this.stepAngle =
      (2 * Math.PI) /
      newSlider.querySelectorAll(
        ".circular-slider .wrapper .slides-holder .slides-holder__item"
      ).length;
    this.currentSlide = 0;

    this.slidesHolder.style.transitionDuration =
      this.startSetup.animationDuration + "ms";

    this.onResize();
    this.setAutoplay();
    this.setNav();
    this.addStyle();

    let _this = this;
    this.btnAutoplay.onclick = function () {
      if (this.classList.contains("controls__autoplay_running")) {
        this.classList.remove("controls__autoplay_running");
        this.classList.add("controls__autoplay_paused");
        clearInterval(_this.autoplay);
        _this.autoplay = null;
      } else {
        this.classList.remove("controls__autoplay_paused");
        this.classList.add("controls__autoplay_running");
        _this.setAutoplay();
      }
    };
  }

  Slider.prototype.onResize = function () {
    let radius,
      w = this.wrapper.parentNode.getBoundingClientRect().width,
      h = this.wrapper.parentNode.getBoundingClientRect().height;

    2 * h <= w
      ? (radius = h * this.startSetup.sliderSize)
      : (radius = (w / 2) * this.startSetup.sliderSize);

    this.setSize(Math.round(radius));
  };

  Slider.prototype.setSize = function (radius) {
    let r = 2 * radius * (1 - this.startSetup.slideSize);
    this.slidesHolder.style.width = this.slidesHolder.style.height = r + "px";
    this.slidesHolder.style.borderWidth = 0.25 * r + "px";
    this.slidesRepositioning(r / 2);

    this.slidesSize = Math.min(
      2 * radius * this.startSetup.slideSize,
      this.stepAngle * radius * (1 - this.startSetup.slideSize) - 50
    );
  };

  Slider.prototype.slidesRepositioning = function (r) {
    for (let i = 0; i < this.slides.length; i++) {
      let x = (r - (30 / 100) * r) * Math.cos(this.stepAngle * i - Math.PI),
        y = (r - (30 / 100) * r) * Math.sin(this.stepAngle * i - Math.PI);
      this.slides[i].style.transform =
        "translate( " +
        x +
        "px, " +
        y +
        "px ) rotate( " +
        (((this.stepAngle * 180) / Math.PI) * i + 180) +
        "deg )";
      this.slides[i].style.height =
        this.wrapper.parentNode.getBoundingClientRect().height * 0.5 + "px";
      this.slides[i].style.aspectRation = 266 / 472;
      // 266 / 472
    }
  };

  Slider.prototype.rotate = function (multiplier) {
    let _this = this;

    this.removeStyle();
    this.resetNavs();

    if (this.currentSlide === this.slides.length - 1 && multiplier === -1) {
      this.slidesHolder.style.transform = "rotate( -360deg )";
      this.currentSlide = this.currentAngle = 0;
      this.addStyle();

      setTimeout(function () {
        _this.slidesHolder.style.transitionDuration = 0 + "s";
        _this.slidesHolder.style.transform =
          "rotate( " + _this.currentAngle + "deg )";
        setTimeout(function () {
          _this.slidesHolder.style.transitionDuration =
            _this.startSetup.animationDuration + "ms";
        }, 20);
      }, this.startSetup.animationDuration);
    } else if (this.currentSlide === 0 && multiplier === 1) {
      this.slidesHolder.style.transform =
        "rotate( " + (this.stepAngle * 180) / Math.PI + "deg )";
      this.currentSlide = _this.slides.length - 1;
      this.currentAngle = (-(2 * Math.PI - _this.stepAngle) * 180) / Math.PI;
      this.addStyle();

      setTimeout(function () {
        _this.slidesHolder.style.transitionDuration = 0 + "s";
        _this.slidesHolder.style.transform =
          "rotate( " + _this.currentAngle + "deg )";
        setTimeout(function () {
          _this.slidesHolder.style.transitionDuration =
            _this.startSetup.animationDuration + "ms";
        }, 20);
      }, this.startSetup.animationDuration);
    } else {
      this.currentSlide -= multiplier;
      this.currentAngle += ((this.stepAngle * 180) / Math.PI) * multiplier;
      this.slidesHolder.style.transform =
        "rotate( " + this.currentAngle + "deg )";
      this.addStyle();
    }
  };

  Slider.prototype.setNav = function () {
    let _this = this;
    _this.btnLeft.onclick = function () {
      _this.rotate(1);
    };
    _this.btnRight.onclick = function () {
      _this.rotate(-1);
    };
  };

  Slider.prototype.disableNav = function () {
    this.btnLeft.onclick = null;
    this.btnRight.onclick = null;
  };

  Slider.prototype.setAutoplay = function () {
    let _this = this;
    this.autoplay = setInterval(function () {
      _this.rotate(-1);
    }, _this.startSetup.autoplayInterval + 20);
  };

  Slider.prototype.removeStyle = function () {
    let x = this.currentSlide;

    this.descriptions[x].classList.remove("descriptions__item_visible");
    this.slides[x].classList.remove("slides-holder__item_active");
  };

  Slider.prototype.addStyle = function () {
    let x = this.currentSlide;

    this.descriptions[x].classList.add("descriptions__item_visible");
    this.slides[x].classList.add("slides-holder__item_active");
  };

  Slider.prototype.resetNavs = function () {
    let _this = this;

    this.disableNav();
    setTimeout(function () {
      _this.setNav();
    }, this.startSetup.animationDuration + 20);
    if (this.autoplay != null) {
      clearInterval(this.autoplay);
      this.setAutoplay();
    }
  };

  ///////////Init sliders///////////
  window.circularSlider1 = new Slider(
    document.querySelector(".circular-slider-1"),
    100,
    15,
    600,
    2500
  );
  window.circularSlider2 = new Slider(
    document.querySelector(".circular-slider-2"),
    90,
    13,
    700,
    3000
  );
  window.circularSlider3 = new Slider(
    document.querySelector(".circular-slider-3"),
    80,
    18,
    800,
    3700
  );
  window.circularSlider4 = new Slider(
    document.querySelector(".circular-slider-4"),
    70,
    20,
    900,
    4200
  );

  let sliders = [
    window.circularSlider1,
    window.circularSlider2,
    window.circularSlider3,
    window.circularSlider4,
  ];

  window.onresize = function () {
    for (let i = 0; i < sliders.length; i++) {
      sliders[i].resetNavs();
      sliders[i].onResize();
    }
  };
})();

function playVideo() {
  const video = document.getElementById("myvideo");
  video.play();
  const playBtn = document.getElementById("play");
  const pauseBtn = document.getElementById("pause");

  playBtn.style.display = "none";
  pauseBtn.style.display = "block";
}

function pauseVideo() {
  const video = document.getElementById("myvideo");
  video.pause();
  const playBtn = document.getElementById("play");
  const pauseBtn = document.getElementById("pause");
  playBtn.style.display = "block";
  pauseBtn.style.display = "none";
}

function muteVideo() {
  const video = document.getElementById("myvideo");
  video.muted = true;
  const muteBtn = document.getElementById("mute");
  const unmuteBtn = document.getElementById("unmute");
  muteBtn.style.display = "none";
  unmuteBtn.style.display = "block";
}

function unmuteVideo() {
  const video = document.getElementById("myvideo");
  video.muted = false;
  const muteBtn = document.getElementById("mute");
  const unmuteBtn = document.getElementById("unmute");
  muteBtn.style.display = "block";
  unmuteBtn.style.display = "none";
}

function loadMeta() {
  var video_duration = document.getElementById("myvideo").duration;
  document.getElementById("video_duration").innerHTML = (
    Math.ceil(video_duration)
  ).toFixed(2);
}

function pageLoaded() {
  const video = document.getElementById("myvideo");
  video.addEventListener(
    "timeupdate",
    onVideoTimeUpdate(video, video.duration)
  );
}

function onVideoTimeUpdate(video, duration) {
  document.getElementById("current_time").innerHTML = (
    Math.floor(video.currentTime)
  ).toFixed(2);   
  document.getElementById("progress").value = video.currentTime / duration;
  if ((video.currentTime / 60).toFixed(2) > 0.54) {
    document.getElementsByClassName("controls")[0].style.display = "none";
    document.getElementsByClassName("slides-holder")[0].style.display ="none";
    document.getElementsByClassName("descriptions")[0].style.display ="none";
  }
}

function toggleSlider() {
  let toggler = document.getElementById("toggleImg");
  if (toggler.style.transform === "rotate(0deg)") { // open
    document.getElementById("toggleImg").style.transform = "rotate(180deg)";
    document.getElementsByClassName("controls")[0].style.display = "";
    document.getElementsByClassName("slides-holder")[0].style.display ="";
    document.getElementsByClassName("descriptions")[0].style.display ="";

  } else { // close 
    document.getElementById("toggleImg").style.transform = "rotate(0deg)";
    document.getElementsByClassName("controls")[0].style.display = "none";
    document.getElementsByClassName("slides-holder")[0].style.display ="none";
    document.getElementsByClassName("descriptions")[0].style.display ="none";
  }
}
