window.addEventListener("load", function onLoad() {
  var urlInput = $("#urlInput");
  urlInput.focus();
  var textInput = $("#textInput");
  var sizeInput = $("#sizeInput");
  var colorInput = $("#colorInput");
  var fontInput = $("#fontInput");
  var shakinessInput = $("#shakinessInput");
  var delayInput = $("#delayInput");
  var loadButton = $("#loadButton");
  var createButton = $("#createButton");
  var holder = $("#picHolder");

  var updateOnChange = [textInput, sizeInput, colorInput, fontInput, shakinessInput, delayInput];

  var intensifier = new Intensifier();
  var baseImage = null;
  var textOptions = {text: "", x:100, y:100, color:"0xFFFFFF", size: "30px", font: "Arial", bold: "bold"};
  var imageOptions = {text: "", x:100, y:100, color:"0xFFFFFF", size: "30px", font: "Arial", bold: "bold"};
  var moveRatio = 1.0/100;
  var lastLoadedURL = null;

  var baseImageWidth = null;
  var baseImageHeight = null;
  var dirs = [{x:-1, y:0}, {x:0, y:-1}, {x:1, y:0}, {x:0, y:1}];

  var load = function(callback) {
    var url = urlInput.val();
    if (url === lastLoadedURL) {
      callback();
      return;
    }
    $.ajax({
      url: "intensifyURL?url=" + url,
      type: 'get',
      success: function(data) {
        lastLoadedURL === url;
        var size = intensifier.getImageSize(data);
        size = intensifier.getSmaller(getShakiness(), size.width, size.height);
        baseImageWidth = size.width;
        baseImageHeight = size.height;

        textOptions.x = 0;
        textOptions.y = baseImageHeight;
        baseImage = data;
        if (callback) {
          callback();
        }
      }
    });
  }

  var getShakiness = function() {
    var fl = parseFloat(shakinessInput.val());
    if (fl && fl < 100 && fl > 0) {
      return fl;
    }
    return (100 - ((19.5 / 20) * 100));
  }

  var update = function() {
    if (baseImage !== null) {
      textOptions.text = textInput.val();
      textOptions.size = (parseInt(sizeInput.val()) || 30) + "px";
      textOptions.font = fontInput.val() || "Arial";
      textOptions.color = (colorInput.val() || "white");

      imageOptions.shakiness = getShakiness();
      imageOptions.delay = parseInt(delayInput.val()) || 25;
      imageOptions.shake = false;

      intensifier.intensifyImage(baseImage, textOptions, imageOptions, holder);
    }
  }

  var create = function() {
    if (baseImage !== null) {
      imageOptions.shake = true;
      intensifier.intensifyImage(baseImage, textOptions, imageOptions, holder);
    }
  }

  var moveText = function(point) {
    textOptions.x += moveRatio * point.x * baseImageWidth;
    textOptions.y += moveRatio * point.y * baseImageWidth;
    update();
  }

  $(document).keydown(function(e) {
    var code = e.keyCode;
    if (code >= 37 && code <= 40) {
      moveText(dirs[code - 37]);
    } else if (code === 13) {
      update();
      create();
    }
  });

  var onChange = function() {
    update();
  };
  for (var i = 0; i < updateOnChange.length; i++) {
    var element = updateOnChange[i];
    element.on("change keyup paste mouseup", onChange);
  }

  loadButton.click(function() {
    load(function() {
      update();
    });
  });

  createButton.click(function() {
    create();
  });
});
