/**
 * Created by Koffman on 4/1/2017.
 */
// public/core.js
var myAnimal = angular.module('myAnimal', ['ngRoute', 'ui.bootstrap'])
    .config(function($routeProvider, $httpProvider) {
            $routeProvider.when('/animal', {
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
   .controller('animalController', function($http, $uibModal) {
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

        vm.openAnimal = function(animal) {

            var animal_modal = $uibModal.open({
                animation: 'true',
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'animal_modal.html',
                controller: 'animalModalController',
                controllerAs: 'vm',
                size: 'lg',
                resolve: {
                    animal: function () {
                        return animal;
                    }
                }
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
   })
   .controller('animalModalController', function($http, $uibModalInstance, animal) {
        var vm = this;

        vm.animal = animal;
        vm.changedAnimal = {};
        vm.changedSighting = {};

        vm.edit = false;

        vm.editAnimal = function() {
            angular.copy(vm.animal, vm.changedAnimal);
            vm.edit = true;
        }

        vm.updateAnimal = function() {
            $http.post('/api/animals/update/', vm.changedAnimal)
                .success(function(data) {
                    console.log("jeesss");
                    vm.animals = data;
                    console.log(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        }

        vm.cancelEditAnimal = function() {
            vm.changedAnimal = {};
            vm.edit = false;
        }

        vm.editSighting = function(sighting) {

        }

        vm.updateSighting = function() {
            //TODO
            
        }

        vm.cancelEditSighting = function() {

        }

        vm.close = function () {
            $uibModalInstance.dismiss('cancel');
        };
   });