Meteor.publish('frames', function() {
  return Frames.find();
});

Meteor.publish('images', function() {
  return Images.find();
})