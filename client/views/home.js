Session.setDefault("sessionId", null);
Session.setDefault("getImage", false);
Session.setDefault("selection", null);

Template.home.helpers({
	getImage: function() {
		return Session.get("getImage");
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
				Session.set("selectedFrame", Frames.findOne(this.id));
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
			var image = Images.findOne({"metadata.sessionId": Session.get("sessionId")});
			/*
			console.log(image);
  			var readStream = image.createReadStream('images');
  			var writeStream = image.createWriteStream('images');
			gm(readStream).crop(selection.width, selection.height, selection.x1, selection.y1).resize(630, 475).stream().pipe(writeStream);*/
			Meteor.call('addFrame', image.copies.images.key, Session.get("selectedFrame").copies.frameimages.key, Session.get("selection"), Session.get("selectedFrame").metadata.selection);
		}
	}
});