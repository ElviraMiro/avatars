Frames = new FS.Collection("frameimages", {
  	stores: [new FS.Store.FileSystem('frameimages', {path: "public"})],
	filter: {
	 	maxSize: 10000000, //in bytes
	 	allow: {
	   		contentTypes: ['image/*']
	   	}
	},
	onInvalid: function (message) {
	  	console.log(message);
	}
});

Frames.allow({
	insert: function(userId, doc) {
		return true;
	},
	update: function(userId, doc, fieldNames, modifier) {
		return true;
	},
	remove: function(userId, doc) {
		return true;
	},
	download: function(userId) {
		return true;
	}
});

Images = new FS.Collection("images", {
  	stores: [new FS.Store.FileSystem('images', {path: "public"})],
	filter: {
	 	maxSize: 10000000, //in bytes
	 	allow: {
	   		contentTypes: ['image/*']
	   	}
	},
	onInvalid: function (message) {
	  	console.log(message);
	}
});

Images.allow({
	insert: function(userId, doc) {
		return true;
	},
	update: function(userId, doc, fieldNames, modifier) {
		return true;
	},
	remove: function(userId, doc) {
		return true;
	},
	download: function(userId) {
		return true;
	}
});

