Session.setDefault("sessionId", null);
Session.setDefault("getImage", false);
Session.setDefault("selection", null);
Session.setDefault("lookImage", false);

Template.home.helpers({
	getImage: function() {
		return Session.get("getImage");
	},
	lookImage: function() {
		return Session.get("lookImage");
	}
});

Template.addUserPhoto.helpers({
	frames: function() {
		return Frames.find();
	}
})

Template.addUserPhoto.events({
	'click .frames': function() {
		$("input.frames").each(function() {
			if (this.checked) {
				var frame = Frames.findOne(this.id);
				Session.set("selectedFrame", frame);
				Session.set("frameUrl", frame.url());
			}
		})
	},
	'click .uploadFile': function(e, t) {
		var images = t.find('#userFileInput');
		for (var i = 0; i < images.files.length; i++) {
			var fsFile = new FS.File(images.files[i]),
				sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
			fsFile.metadata = {
				sessionId: sessionId
			};
			Session.set("sessionId", sessionId);
			fsFile.attachData(images.files[i]);
			Images.insert(fsFile, function(err) {
				if (!err) {
					Session.set('getImage', true);
				};
			});
		}
	}
});

Template.editUserPhoto.rendered = function() {
	var selection = Session.get("selectedFrame").metadata.selection,
		ratio = "".concat(selection.width, ":", selection.height);
	$('img#photo').imgAreaSelect({
		aspectRatio: ratio,
		onSelectEnd: function (img, selection) {
			Session.set("selection", selection);
		}
	});
};

Template.editUserPhoto.helpers({
	'imageUrl': function() {
		var image = Images.findOne({"metadata.sessionId": Session.get("sessionId")});
		if (image) {
			return image.url();
		}
	}
});

Template.editUserPhoto.events({
	'click .send': function() {
		var selection = Session.get("selection");
		if (!selection) {
			$('#myModal').modal();
		} else {
			var image = Images.findOne({"metadata.sessionId": Session.get("sessionId")}),
				frame = Frames.findOne(Session.get("selectedFrame")._id),
				size = {width: 932,
					height: 783},
				x1 = Session.get("selectedFrame").metadata.selection.x1,
				y1 = Session.get("selectedFrame").metadata.selection.y1;
			/*
			console.log(image);
  			var readStream = image.createReadStream('images');
  			var writeStream = image.createWriteStream('images');
			gm(readStream).crop(selection.width, selection.height, selection.x1, selection.y1).resize(630, 475).stream().pipe(writeStream);*/
			Meteor.call('cropImage', image._id, Session.get("selectedFrame")._id, Session.get("selection"), function() {
				Meteor.call('addFrame', '/prod/avatars/.meteor/local/cfs/files/images/'+image.copies.images.key, '/prod/avatars/.meteor/local/cfs/files/frameimages/'+frame.copies.frameimages.key, size, x1, y1, image._id, function(result) {
					Session.set("getImage", false);
					Session.set("lookImage", true);	
				});
			});
		}
	}
});

Template.lookImageData.helpers({
	imageUrl: function() {
		var image = Images.findOne({"metadata.sessionId": Session.get("sessionId")});
		console.log(image);
		if (image) {
			var finalimage = FinalImages.findOne(image._id);
			console.log(finalimage);
			if (finalimage) {
				return finalimage.canvas;
			} else {
				return "";
			}
		} else {
			return "";
		}
	}
});