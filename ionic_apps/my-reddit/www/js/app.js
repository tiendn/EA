// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
(function(){
  var app = angular.module('starter', ['ionic','angularMoment']);

  app.controller('RedditCtrl',function($http, $scope){
    $scope.stories = [];
    // $http.get('https://www.reddit.com/r/android/new/.json')
    // .success(function(response){
    //   angular.forEach(response.data.children,function(child){
    //     $scope.stories.push(child.data); 
    //   });
    // });
    function loadStories(params, callback){
      var stories = [];
      $http.get('https://www.reddit.com/r/android/new/.json',{params:params})
      .success(function(response){
        angular.forEach(response.data.children,function(child){
          stories.push(child.data);
        });
        callback(stories);
      });
    }
    $scope.loadOlderStories = function(){
      var params = {};
      if ($scope.stories.length > 0 ){
        params['after'] = $scope.stories[$scope.stories.length-1].name;
      }
      loadStories(params,function(olderStories){
        $scope.stories = $scope.stories.concat(olderStories);
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    };
    $scope.loadNewerStories = function(){
      var params = {'before' : $scope.stories[0].name};
      loadStories(params,function(newerStories){
        $scope.stories = newerStories.concat($scope.stories);
        $scope.$broadcast('scroll.refreshComplete');
      });
    };
  });
  app.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      if(window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  });
})();

