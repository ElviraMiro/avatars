Meteor.methods({
	addFrame: function(image, frame, selection, selFrame) {
		var imagename = "/Users/elvira/avatars/.meteor/local/cfs/files/images/" + image;
		var framename = "/Users/elvira/avatars/.meteor/local/cfs/files/frameimages/" + frame;
		if (selFrame) {
			imageMagick = gm.subClass({ imageMagick: true });
			imageMagick(imagename).crop(selection.width, selection.height, selection.x1, selection.y1).resize(parseInt(selFrame.width), parseInt(selFrame.height)).write(imagename, function (err) {
				if (!err) console.log('done1');
			});
			var point = "+".concat(selFrame.x1,"+", selFrame.y1);
			var drawcom = "image Over ".concat(selFrame.x1, ",", selFrame.y1, " ", selFrame.width, ",", selFrame.height, " ", imagename);
			imageMagick(framename).draw(drawcom).write(imagename, function (err) {
				console.log(err);
				if (!err) console.log('done2');
			});
		}
	}
})