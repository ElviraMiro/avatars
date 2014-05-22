Meteor.methods({
	addFrame: function(image, selection, frameUrl) {
		image = "public/"+image;
		console.log(image, selection, frameUrl);
		imageMagick = gm.subClass({ imageMagick: true });
		imageMagick(image).crop(selection.width, selection.height, selection.x1, selection.y1).resize(630, 475).write(image, function (err) {
			console.log(err);
			if (!err) console.log('done');
		});
		imageMagick().in('-page','+0+0').in(frameUrl).in('-page', '+145+140').in(image).write(image, function (err) {
			console.log(err);
			if (!err) console.log('done');
		});
	}
})