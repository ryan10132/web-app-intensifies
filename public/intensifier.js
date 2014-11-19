Intensifier = (function() {

    var Intensifier = function() {
    }

    var getCanvas = function(width, height) {
        var canvas = $("<canvas/>")[0];
        canvas.width = width;
        canvas.height = height;
        return canvas;
    }

    var getDrawPoints = function(width, height, origWidth, origHeight) {
        var xDiff = origWidth - width;
        var yDiff = origHeight - height;
        return [{x:-xDiff, y: 0}, {x: 0, y:0}, {x:-xDiff / 2, y:-yDiff}];
    }

    var drawOntoCanvas = function(context, image, point, textOptions, imageOptions) {
        context.fillStyle = 'rgb(255,255,255)';
        context.fillRect(0,0, context.width, context.height); //GIF can't do transparent so do white
        context.drawImage(image, point.x, point.y);
        context.fillStyle = textOptions.color;
        context.font = textOptions.bold + " " + textOptions.size + " " + textOptions.font;
        context.textBaseline = "bottom";
        context.fillText(textOptions.text, textOptions.x, textOptions.y);
    }

    Intensifier.prototype.getSmaller = function(shakiness, width, height) {
      var ratio = (100 - shakiness) / 100.0;
      return {width: width * ratio, height: height * ratio};
    }

    Intensifier.prototype.getImageSize = function(image) {
        var imageTag = document.createElement('span');
        imageTag.innerHTML = image;
        imageTag = imageTag.children[0];
        return {height: imageTag.height, width: imageTag.width};
    }

    Intensifier.prototype.intensifyImage = function(image, textOptions, imageOptions, parent) {
        var imageTag = document.createElement('span');
        imageTag.innerHTML = image;
        imageTag = imageTag.children[0];
        var fullHeight = imageTag.height;
        var fullWidth = imageTag.width;

        var smallHeight = this.getSmaller(imageOptions.shakiness, fullWidth, fullHeight).height;
        var smallWidth = this.getSmaller(imageOptions.shakiness, fullWidth, fullHeight).width;

        var canvas = getCanvas(smallWidth, smallHeight);
        var context = canvas.getContext('2d');

        var points = getDrawPoints(smallWidth, smallHeight, fullWidth, fullHeight);

        if (imageOptions.shake) {
            var encoder = new GIFEncoder();
            encoder.setRepeat(0); //0  -> loop forever
            encoder.setDelay(imageOptions.delay); // MS
            encoder.start();

            for (var i = 0; i < points.length; i++) {
                var point = points[i];
                drawOntoCanvas(context, imageTag, point, textOptions);
                encoder.addFrame(context);
            }

            encoder.finish();

            var binary_gif = encoder.stream().getData() //notice this is different from the as3gif package!
            var data_url = 'data:image/gif;base64,'+encode64(binary_gif);

            parent.html('<img src="' + data_url + '"/>');
        } else {
            parent.html('');
            drawOntoCanvas(context, imageTag, points[0], textOptions);
            parent.append(canvas);
        }

    }

    return Intensifier;

})();
