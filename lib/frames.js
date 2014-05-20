Frames = new Meteor.Collection('frames');

Images = new FS.Collection("images", {
  stores: [new FS.Store.GridFS('images')],
  filter: {
    maxSize: 10000000, //in bytes
    allow: {
      contentTypes: ['image/*']
    },
    onInvalid: function (message) {
      console.log(message);
    }
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