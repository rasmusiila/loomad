/**
 * Created by Koffman on 4/1/2017.
 */
// public/core.js
var myAnimal = angular.module('myAnimal', []);

function mainController($scope, $http) {
    $scope.formData = {};

    // when landing on the page, get all animals and show them
    $http.get('/api/animals')
        .success(function(data) {
            $scope.animals = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.createAnimal = function() {
        $http.post('/api/animals', $scope.formData)
            .success(function(data) {
                console.log("WHYs");
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.animals = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a animal after checking it
    $scope.deleteAnimal = function(id) {
        $http.delete('/api/animals/' + id)
            .success(function(data) {
                $scope.animals = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // when landing on the page, get all animals and show them
    $http.get('/api/sightings')
        .success(function(data) {
            $scope.sightings = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.createSighting = function() {
        $http.post('/api/sightings', $scope.formData)
            .success(function(data) {
                console.log("WHYs");
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.sightings = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a animal after checking it
    $scope.deleteSighting = function(id) {
        $http.delete('/api/sightings/' + id)
            .success(function(data) {
                $scope.sightings = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

}