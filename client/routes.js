Router.configure({
  layoutTemplate: 'layout'
});

Router.map(function() {
  this.route('home', {
    path: '/',
    template: 'home'
  });
  this.route('frames', {
    path: '/frames',
    template: 'frames'
  });
});

