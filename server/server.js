var Canvas = Npm.require('canvas'),
	Image = Canvas.Image;

Meteor.methods({
	cropImage: function(imageId, frameId, selection) {
		var image = Images.findOne(imageId),
			frame = Frames.findOne(frameId),
			framename = "cfs/files/frameimages/" + frame.copies.frameimages.key;
			imagename = "cfs/files/images/" + image.copies.images.key;
			cropw = selection.width,
			croph = selection.height,
			cropx1 = selection.x1,
			cropy1 = selection.y1,
			w = frame.metadata.selection.width,
			h = frame.metadata.selection.height,
			imageMagick = gm.subClass({ imageMagick: true });
		imageMagick(imagename).crop(selection.width, selection.height, selection.x1, selection.y1).resize(parseInt(w), parseInt(h)).write(imagename, function (err) {
			if (!err) {return 'done1'};
		});
	},
	addFrame: function(imageSource, frameSource, size, insertx1, inserty1, imageId) {
		var canvas = new Canvas(size.width,size.height),
  			context = canvas.getContext('2d'),
  			n1 = 1;
  		function loadAndDrawImage(urls, number, insertx1, inserty1)
		{
		    // Create an image object. This is not attached to the DOM and is not part of the page.
		    //console.log("NUMBER", number, urls[number]);
		    var image = new Image();
		 	
		    // When the image has loaded, draw it to the canvas
		    image.onload = function()
		    {
		    	context.drawImage(image,insertx1, inserty1);
		        if (number<urls.length-1) {
		        	loadAndDrawImage(urls, number+1, 0, 0);
		        } else {
		        	var id = FinalImages.insert({canvas: canvas.toDataURL(), _id: imageId});
		        	console.log(id);
		        }
		        console.log(number);
		        return;
		    }
		    // Now set the source of the image that we want to load
		    image.src = urls[number];
		    image.onload();
		    console.log('finish', n1);
		    n1 += 1;
		    return;
		}
		loadAndDrawImage([imageSource, frameSource], 0, insertx1, inserty1);
		console.log("finish");
		return "finish";
	}
});


/*
var imagename = "/Users/elvira/avatars/.meteor/local/cfs/files/images/" + image;
		var framename = "/Users/elvira/avatars/.meteor/local/cfs/files/frameimages/" + frame;
		if (selFrame) {
			imageMagick = gm.subClass({ imageMagick: true });
			imageMagick(imagename).crop(selection.width, selection.height, selection.x1, selection.y1).resize(parseInt(selFrame.width), parseInt(selFrame.height)).write(imagename, function (err) {
				if (!err) console.log('done1');
			});
			//var point = "+".concat(selFrame.x1,"+", selFrame.y1);
			//var drawcom = "image Over ".concat(selFrame.x1, ",", selFrame.y1, " ", selFrame.width, ",", selFrame.height, " ", imagename);
			/*imageMagick().in("-page",point).in(imagename).in("-page", "+0+0").in(framename).write(imagename, function (err) {
				console.log(err);
				if (!err) console.log('done2');
			});*/
