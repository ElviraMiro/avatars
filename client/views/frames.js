Session.setDefault("frame", null);
Session.setDefault("addFrame", false);
Session.setDefault("fileChange", false);

Template.frames.helpers({
	addFrame: function() {
		return Session.get("addFrame");
	}
});

Template.listFrames.helpers({
	frames: function() {
		return Frames.find();
	}
});

Template.listFrames.events({
	'click .addFrame': function(e, t) {
		Session.set("addFrame", true);

	},
	'click .delete': function(e, t) {
		var frameId = this._id;
		Frames.remove(frameId);
	}
});

Template.editFrame.helpers({
	imageUrl: function() {
		if (Session.get("frame")) {
			var frame = Frames.findOne({_id: Session.get("frame")._id});
			return frame.url();
		} else {
			return "images/no-image-available.jpg";
		}
	},
	fileChange: function() {
		return Session.get("fileChange");
	}
});

Template.editFrame.events({
	'change #frameInput': function(e, t) {
		Session.set("fileChange", true);
	},
	'click .send': function(e, t) {
		var images = t.find('#frameInput');
		for (var i = 0; i < images.files.length; i++) {
			var fsFile = new FS.File(images.files[i]);
			fsFile.attachData(images.files[i]);
			var img = Frames.insert(fsFile, function(err) {
				if (!err) {
					Session.set("fileChange", false);
				};
			});
			Session.set("frame", img);
			$('img#frame').imgAreaSelect({
				onSelectEnd: function (img, selection) {
					$("#holeWidth").val(selection.width),
					$("#holeHeight").val(selection.height),
					$("#holeX1").val(selection.x1),
					$("#holeY1").val(selection.y1);
				}
			});
		}
	},
	'click .cancel': function(e, t) {
		Session.set('frame', null);
		Session.set('fileChange', false);
		Session.set('addFrame', false);
	},
	'click .save': function(e, t) {
		var frame = Session.get("frame"),
			width = $("#holeWidth").val(),
			height = $("#holeHeight").val(),
			x1 = $("#holeX1").val(),
			y1 = $("#holeY1").val();
		selection = {
			width: width,
			height: height,
			x1: x1,
			y1: y1
		};
		Frames.update(frame._id, {$set: {"metadata.selection": selection}});
		Session.set('frame', null);
		Session.set('fileChange', false);
		Session.set('addFrame', false);
	}
});
