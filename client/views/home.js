Session.setDefault("sessionId", null);
Session.setDefault("getImage", false);

Template.home.helpers({
	getImage: function() {
		return Session.get("getImage");
	}
});

Template.addUserPhoto.events({
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
	$('img#photo').imgAreaSelect({
		handles: true,
		onSelectEnd: function (img, selection) {
			alert('width: ' + selection.width + '; height: ' + selection.height);
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