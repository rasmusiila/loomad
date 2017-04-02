/**
 * Created by Koffman on 4/1/2017.
 */
// public/core.js
var myAnimal = angular.module('myAnimal', ['ngRoute'])
    .config(function($routeProvider, $httpProvider) {
            $routeProvider.when('/', {
                templateUrl: 'index.html',
                controller: 'mainController',
                controllerAs: 'vm'
            }).when('/animal', {
                templateUrl: 'animal.html',
                controller: 'animalController',
                controllerAs: 'vm'
            }).when('/sighting', {
                templateUrl: 'sighting.html',
                controller: 'sightingController',
                controllerAs: 'vm'
            })
   })
   .controller('mainController', function($http) {
        

        
    })
   .controller('animalController', function($http) {
        var vm = this;
        vm.formData = {};

        // when landing on the page, get all animals and show them
        $http.get('/api/animals')
            .success(function(data) {
                vm.animals = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });

        // when submitting the add form, send the text to the node API
        vm.createAnimal = function() {
            $http.post('/api/animals', vm.formData)
                .success(function(data) {
                    console.log("WHYs");
                    vm.formData = {}; // clear the form so our user is ready to enter another
                    vm.animals = data;
                    console.log(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        };

        // delete a animal after checking it
        vm.deleteAnimal = function(id) {
            $http.delete('/api/animals/' + id)
                .success(function(data) {
                    vm.animals = data;
                    console.log(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        };
   })
   .controller('sightingController', function($http) {
        var vm = this;
        vm.formData = {};

        $http.get('/api/animals')
            .success(function(data) {
                vm.animals = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });

        // when landing on the page, get all animals and show them
        $http.get('/api/sightings')
            .success(function(data) {
                vm.sightings = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });

        // when submitting the add form, send the text to the node API
        vm.createSighting = function() {
            $http.post('/api/sightings', vm.formData)
                .success(function(data) {
                    console.log("WHYs");
                    vm.formData = {}; // clear the form so our user is ready to enter another
                    vm.sightings = data;
                    console.log(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        };

        // delete a animal after checking it
        vm.deleteSighting = function(id) {
            $http.delete('/api/sightings/' + id)
                .success(function(data) {
                    vm.sightings = data;
                    console.log(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        };
   });