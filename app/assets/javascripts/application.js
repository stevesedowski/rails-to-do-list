// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require angular
//= require angular-resource
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .

var app = angular.module('app', ['ngResource']);

app.config(function ($httpProvider) {
  // CSRF
  $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
});

app.factory('Todo', function($resource) {
  return $resource("/todos/:id.json", {id: '@id'}, {
    update: {
      method: 'PUT'
    }
  })
});

app.controller('TodosCtrl', function ($scope, Todo) {
	$scope.todos = Todo.query();

	$scope.addTodo = function(e) {
		e.preventDefault();
		
		var addThisObj = { title: $scope.nextTodo };

		Todo.save(addThisObj, function(response) {
			$scope.todos.push(response);
			$scope.nextTodo = '';
		});
	};
/*NOTE: the $index property on the local scope HAS 
to be placed as the first parmater in the function call!!!*/
	$scope.deleteTodo = function(index, todo){
		Todo.delete({ id: todo.id});
		$scope.todos.splice(index, 1);
		
	};

	$scope.toggleComplete = function(todo) {
		todo.complete = !todo.complete;
		Todo.update(todo);
	};
});