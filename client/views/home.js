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
			var image = Images.findOne({"metadata.sessionId": Session.get("sessionId")});
			/*
			console.log(image);
  			var readStream = image.createReadStream('images');
  			var writeStream = image.createWriteStream('images');
			gm(readStream).crop(selection.width, selection.height, selection.x1, selection.y1).resize(630, 475).stream().pipe(writeStream);*/
			Meteor.call('addFrame', image.copies.images.key, Session.get("selectedFrame").copies.frameimages.key, Session.get("selection"), Session.get("selectedFrame").metadata.selection);
			Session.set("getImage", false);
			Session.set("lookImage", true);
		}
	}
});

Template.lookImageData.helpers({
	imageUrl: function() {
		var image = Images.findOne({"metadata.sessionId": Session.get("sessionId")});
		if (image) {
			return image.url();
		}
	},
	frameUrl: function() {
		return Session.get("frameUrl");
	},
	imageStyle: function() {
		var frame = Session.get("selectedFrame"),
			result = "";
		if (frame) {
			bottom = 15+parseInt(frame.metadata.selection.y1);
			left = 15+parseInt(frame.metadata.selection.x1);
			result = "z-index: 1; position: absolute; bottom: "+bottom+"px; left: "+left+"px;";
		}
		return result;
	},
	frameStyle: function() {
		var result = "z-index: 2; position: absolute; bottom: 15px; left: 15px;";
		return result;
	}
});