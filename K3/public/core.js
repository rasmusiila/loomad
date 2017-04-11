/**
 * Created by Koffman on 4/1/2017.
 */
// public/core.js
var myAnimal = angular.module('myAnimal', ['ngRoute', 'ui.bootstrap', 'angularjs-datetime-picker'])
    .config(function ($routeProvider, $httpProvider) {
        $routeProvider.when('/animal', {
            templateUrl: 'animal.html',
            controller: 'animalController',
            controllerAs: 'vm'
        }).when('/sighting', {
            templateUrl: 'sighting.html',
            controller: 'sightingController',
            controllerAs: 'vm'
        }).when('/animalType', {
            templateUrl: 'animalType.html',
            controller: 'animalTypeController',
            controllerAs: 'vm'
        }).when('/location', {
            templateUrl: 'location.html',
            controller: 'locationController',
            controllerAs: 'vm'
        })
    })
    .controller('mainController', function ($http) {


    })
    .controller('animalController', function ($http, $uibModal) {
        var vm = this;
        vm.formData = {};
        vm.otsinguTulemus = [];

        // when landing on the page, get all animals and show them
        $http.get('/api/animals')
            .success(function (data) {
                vm.animals = data;
                angular.copy(vm.animals, vm.otsinguTulemus);
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });

        // when submitting the add form, send the text to the node API
        vm.createAnimal = function () {
            $http.post('/api/animals', vm.formData)
                .success(function (data) {
                    console.log("WHYs");
                    vm.formData = {}; // clear the form so our user is ready to enter another
                    vm.animals = data;
                    angular.copy(vm.animals, vm.otsinguTulemus);
                    console.log(data);
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                });
        };

        // delete a animal after checking it
        vm.deleteAnimal = function (id) {
            $http.delete('/api/animals/' + id)
                .success(function (data) {
                    vm.animals = data;
                    angular.copy(vm.animals, vm.otsinguTulemus);
                    console.log(data);
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                });
        };

        vm.openAnimal = function (animal) {

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

        vm.otsiLoomaNimeJargi = function() {
            vm.otsinguTulemus = [];
            for (var i = 0; i < vm.animals.length; i++) {
                if (vm.animals[i].animalName.toLowerCase().includes(vm.loomaNimiOtsing.toLowerCase())) {
                    vm.otsinguTulemus.push(vm.animals[i]);
                }
            }
        }


    })
    .controller('sightingController', function ($http) {
        var vm = this;
        vm.formData = {};

        $http.get('/api/animals')
            .success(function (data) {
                vm.animals = data;
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });

        // when landing on the page, get all animals and show them
        $http.get('/api/sightings')
            .success(function (data) {
                vm.sightings = data;
                for (var i = 0; i < vm.sightings.length; i++) {
                    vm.getAnimalNameById(vm.sightings[i]);
                    vm.sightings[i].sightingTimeFormatted = moment(vm.sightings[i].sightingTime).format('DD-MM-YYYY, HH:mm');
                }

                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });

        vm.getAnimalNameById = function (sighting) {
            $http.get('/api/animals/' + sighting.sightingAnimal[0])
                .success(function (data) {
                    console.log(data.animalName);
                    sighting.sightingAnimal.name = data.animalName;
                })
        };

        // when submitting the add form, send the text to the node API
        vm.createSighting = function () {
            $http.post('/api/sightings', vm.formData)
                .success(function (data) {
                    vm.formData = {}; // clear the form so our user is ready to enter another
                    vm.sightings = data;
                    for (var i = 0; i < vm.sightings.length; i++) {
                        vm.getAnimalNameById(vm.sightings[i])
                        vm.sightings[i].sightingTimeFormatted = moment(vm.sightings[i].sightingTime).format('DD-MM-YYYY, HH:mm');
                    }
                    console.log(data);
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                });
        };

        // delete a sighting after checking it
        vm.deleteSighting = function (id) {
            $http.delete('/api/sightings/' + id)
                .success(function (data) {
                    vm.sightings = data;
                    console.log(data);
                    for (var i = 0; i < vm.sightings.length; i++) {
                        vm.getAnimalNameById(vm.sightings[i]);
                        vm.sightings[i].sightingTimeFormatted = moment(vm.sightings[i].sightingTime).format('DD-MM-YYYY, HH:mm');
                    }
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                });
        };
    })
    .controller('animalTypeController', function ($http, $uibModal) {
        var vm = this;

        vm.otsinguTulemus = [];

        $http.get('/api/animals')
            .success(function (data) {
                vm.animals = data;
                console.log(data);
                vm.getAnimalTypes();
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });

        vm.getAnimalTypes = function () {
            var animalTypes = [];
            for (var i = 0; i < vm.animals.length; i++) {
                animalTypes.push(vm.animals[i].animalType);
            }
            var animalTypesSet = new Set(animalTypes);
            vm.animalTypes = Array.from(animalTypesSet);
            angular.copy(vm.animalTypes, vm.otsinguTulemus);
        }

        vm.openAnimalType = function (animalType) {

            var animalTypeModal = $uibModal.open({
                animation: 'true',
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'animal_type_modal.html',
                controller: 'animalTypeModalController',
                controllerAs: 'vm',
                size: 'lg',
                resolve: {
                    animalType: function () {
                        return animalType;
                    }
                }
            });
        };

        vm.otsiLoomaLiigiJargi = function() {
            vm.otsinguTulemus = [];
            for (var i = 0; i < vm.animalTypes.length; i++) {
                if (vm.animalTypes[i].toLowerCase().includes(vm.loomaLiikOtsing.toLowerCase())) {
                    vm.otsinguTulemus.push(vm.animalTypes[i]);
                }
            }
        }

    })
    .controller('locationController', function ($http, $uibModal) {
        var vm = this;

        vm.otsinguTulemus = [];

        $http.get('/api/sightings')
            .success(function (data) {
                vm.sightings = data;
                console.log(data);
                vm.getLocations();
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });

        vm.getLocations = function () {
            var locations = [];
            for (var i = 0; i < vm.sightings.length; i++) {
                locations.push(vm.sightings[i].sightingLocation);
            }
            var locationSet = new Set(locations);
            vm.locations = Array.from(locationSet);
            angular.copy(vm.locations, vm.otsinguTulemus);
        }

        vm.openLocation = function (location) {

            var locationModal = $uibModal.open({
                animation: 'true',
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'location_modal.html',
                controller: 'locationModalController',
                controllerAs: 'vm',
                size: 'lg',
                resolve: {
                    location: function () {
                        return location;
                    }
                }
            });
        };

        vm.otsiAsukohaJargi = function() {
            vm.otsinguTulemus = [];
            for (var i = 0; i < vm.locations.length; i++) {
                if (vm.locations[i].toLowerCase().includes(vm.asukohtOtsing.toLowerCase())) {
                    vm.otsinguTulemus.push(vm.locations[i]);
                }
            }
        }

    })
    .controller('animalModalController', function ($http, $uibModalInstance, animal) {
        var vm = this;

        vm.animal = animal;
        vm.changedAnimal = {};
        vm.changedSighting = {};

        vm.edit = false;
        vm.sightingBeingEdited = false;

        console.log(vm.animal);
        $http.post('api/animal/sightings', vm.animal)
            .success(function (data) {
                vm.sightings = data;
                for (var i = 0; i < data.length; i++) {
                    vm.sightings[i].animalName = vm.animal.animalName;
                    vm.sightings[i].sightingTimeFormatted = moment(vm.sightings[i].sightingTime).format('DD-MM-YYYY, HH:mm');
                }
            })

        vm.editAnimal = function () {
            angular.copy(vm.animal, vm.changedAnimal);
            vm.edit = true;
        }

        vm.updateAnimal = function () {
            $http.post('api/animals/update', vm.changedAnimal)
                .success(function (data) {
                    console.log(data);
                    vm.animal.animalType = data.animalType;
                    //vm.animals = data;
                    vm.cancelEditAnimal();
                })
        }

        vm.cancelEditAnimal = function () {
            vm.changedAnimal = {};
            vm.edit = false;
        }

        vm.editSighting = function (sighting) {
            for (var i = 0; i < vm.sightings.length; i++) {
                if (vm.sightings[i]._id == sighting._id) {
                    vm.sightings[i].edit = true;
                    angular.copy(vm.sightings[i], vm.changedSighting);
                    vm.sightingBeingEdited = true;
                }
            }
        }

        vm.updateSighting = function () {
            console.log(vm.changedSighting.sightingTimeFormatted);
            var date = new Date(vm.changedSighting.sightingTimeFormatted.substr(6, 4),
                vm.changedSighting.sightingTimeFormatted.substr(3, 2) - 1,
                vm.changedSighting.sightingTimeFormatted.substr(0, 2),
                vm.changedSighting.sightingTimeFormatted.substr(12, 2),
                vm.changedSighting.sightingTimeFormatted.substr(15, 2),
                0, 0);
            vm.changedSighting.sightingTime = date;
            console.log(date);
            $http.post('/api/sightings/update', vm.changedSighting)
                .success(function (data) {
                    vm.sightings = data;
                    vm.completeUpdate();
                    vm.cancelEditSighting();
                })

        }

        vm.completeUpdate = function () {
            $http.post('api/animal/sightings', vm.animal)
                .success(function (data) {
                    vm.sightings = data;
                    for (var i = 0; i < data.length; i++) {
                        vm.sightings[i].animalName = vm.animal.animalName;
                        vm.sightings[i].sightingTimeFormatted = moment(vm.sightings[i].sightingTime).format('DD-MM-YYYY, HH:mm');
                    }
                })
        }

        vm.cancelEditSighting = function () {
            for (var i = 0; i < vm.sightings.length; i++) {
                vm.sightings[i].edit = false;
            }
            vm.sightingBeingEdited = false;
        }

        vm.close = function () {
            vm.sightingBeingEdited = false;
            $uibModalInstance.dismiss('cancel');
        };
    })
    .controller('animalTypeModalController', function ($http, $uibModalInstance, animalType, $uibModal) {
        var vm = this;

        vm.animalType = animalType;

        $http.get('api/animals/type/' + vm.animalType)

            .success(function (data) {
                vm.animals = data;
                for (var i = 0; i < vm.animals.length; i++) {
                    vm.getSightingByAnimal(vm.animals[i]);
                }
            })

        vm.getSightingByAnimal = function (animal) {
            $http.post('api/animal/sightings', animal)
            .success(function (data) {
                var sightings = data;
                vm.getLatestSighting(sightings, animal);
                animal.sighting.sightingTimeFormatted = moment(animal.sighting.sightingTime).format('DD-MM-YYYY, HH:mm')
            })
        }

        vm.getLatestSighting = function(sightings, animal) {
            var latest = null;
            for (var i = 0; i < sightings.length; i++) {
                if (latest == null) {
                    latest = sightings[i];
                } else {
                    if (latest.sightingTime < sightings[i].sightingTime) {
                        latest = sightings[i];
                    }
                }
            }
            animal.sighting = latest;
        }

        vm.openAnimal = function (animal) {

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

        vm.changeModals = function (animal) {
            vm.close();
            vm.openAnimal(animal);
        }

        vm.close = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })
    .controller('locationModalController', function ($http, $uibModalInstance, location, $uibModal) {
        var vm = this;

        vm.location = location;

        $http.get('api/sightings/location/' + vm.location)

            .success(function (data) {
                vm.sightings = data;
                console.log(vm.sightings);
                vm.latestSightings = [];
                for (var i = 0; i < vm.sightings.length; i++) {
                    // if (vm.sightingIsLatest(vm.sightings[i])) {
                    //     vm.latestSightings.push(vm.sightings[i]);
                    // }
                    vm.sightingIsLatest(vm.sightings[i]);
                }
            })

        vm.sightingIsLatest = function(sighting) {
            var animalId = sighting.sightingAnimal[0];
            vm.getSightingById(animalId, sighting);
        }

        vm.getSightingById = function(id, sighting) {
            $http.get('api/sightings/' + id)
                .success(function (data) {
                    console.log(data);
                    var sightings = data;
                    var latestSighting = vm.getLatestSighting(sightings);
                    if (sighting._id == latestSighting._id) {
                        vm.latestSightings.push(sighting);
                        sighting.sightingTimeFormatted = moment(sighting.sightingTime).format('DD-MM-YYYY, HH:mm')
                        vm.getAnimalById(sighting);
                    }
                })
        }

        vm.getLatestSighting = function(sightings) {
            var latest = null;
            for (var i = 0; i < sightings.length; i++) {
                if (latest == null) {
                    latest = sightings[i];
                } else {
                    if (latest.sightingTime < sightings[i].sightingTime) {
                        latest = sightings[i];
                    }
                }
            }
            return latest;
        }

        vm.getAnimalById = function (sighting) {
            $http.get('/api/animals/' + sighting.sightingAnimal[0])
                .success(function (data) {
                    console.log(data.animalName);
                    sighting.animal = data;
                    //sighting.animalName = data.animalName;
                    //sighting.animalType = data.animalType;
                })
        };

        vm.openAnimal = function (animal) {

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

        vm.changeModals = function (animal) {
            vm.close();
            vm.openAnimal(animal);
        }

        vm.close = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
