//controllers are packed into a module
angular.module('contador.controllers', [])

//top view controller
.controller('AppCtrl', function($scope, $rootScope, BackendService, $timeout, $ionicSideMenuDelegate, $ionicPopup) {
  //Disable swipe in menu left and right
  $scope.$on('$ionicView.enter', function() {
    $ionicSideMenuDelegate.canDragContent(false);
  });
  $scope.$on('$ionicView.leave', function() {
    $ionicSideMenuDelegate.canDragContent(true);
  });

  //get default values
  $scope.vabrationAdd = BackendService.getVibrationAdd();
  $rootScope.vibrationAdd = $scope.vabrationAdd;

  $scope.vabrationSubtract = BackendService.getVibrationSubtract();
  $rootScope.vibrationSubtract = $scope.vabrationSubtract;

  $scope.intencity = BackendService.getIntencity();
  $rootScope.intencity = $scope.intencity;

  $scope.interval = BackendService.getInterval();
  $rootScope.interval = $scope.interval;

  $scope.isLeader = BackendService.isLeader();
  $rootScope.isLeader = $scope.isLeader;
  if ($scope.isLeader) {
    $scope.getInfoLeader();
  }

  $scope.getInfoLeader = function() {
    $scope.id = BackendService.getLeader().id;
    $scope.name = BackendService.getLeader().name;
    $scope.token = BackendService.getLeader().token;
    $scope.active = BackendService.getLeader().active;
    $scope.dateRegister = BackendService.getLeader().dateRegister;

    $rootScope.id = $scope.id;
    $rootScope.name = $scope.name;
    $rootScope.token = $scope.token;
    $rootScope.active = $scope.active;
    $rootScope.dateRegister = $scope.dateRegister;
  }

  //finish get default values
  $scope.alterVibrationAdd = function(vibration) {
    BackendService.setVibrationAdd(vibration);
    $rootScope.vibrationAdd = vibration;
  }

  $scope.alterVibrationSubtract = function(vibration) {
    BackendService.setVibrationSubtract(vibration);
    $rootScope.vibrationSubtract = vibration;
  }

  $scope.alterIntencity = function(intencity) {
    BackendService.setIntencity(intencity);
    $rootScope.intencity = parseInt(intencity);
    navigator.vibrate(parseInt(intencity));
  }

  $scope.alterInterval = function(interval) {
    BackendService.setInterval(interval);
    $rootScope.interval = interval;
  }

  $scope.removeAdmin = function() {
    BackendService.removeAdmin();

    $scope.id = undefined;
    $scope.name = undefined;
    $scope.token = undefined;
    $scope.active = undefined;
    $scope.dateRegister = undefined;
  }

  $scope.isIOS = function() {
    return ionic.Platform.isIOS() || ionic.Platform.isIPad();
  }

  $scope.showPopupAdmin = function() {
    $scope.data = {}

    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      template: '<label class="item item-input"> <input type="text" placeholder="Digite seu código aqui" ng-model="data.codigo" maxlength="6" style="text-transform:uppercase"></label>',
      title: 'Código de liderança',
      scope: $scope,
      buttons: [
        { text: 'Cancelar' },
        {
          text: '<b>Entrar</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.data.codigo) {
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
            } else {
              var isLeader = BackendService.isCodeAdmin($scope.data.codigo);
              isLeader.success(function(data, status, headers, config) {
                if (data.id > 0) {
                  $scope.name = data.name;
                  $scope.showAlertValidCode();
                } else {
                  $scope.showAlertInvalidCode();
                }
              }).error(function(data, status, headers, config) {
                $scope.showAlertInvalidCode();
              });
            }
          }
        },
      ]
    });
  };

  $scope.showAlertInvalidCode = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'Erro ao cadastrar',
      template: 'O código informado é inválido'
    });
  }

  $scope.showAlertValidCode = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'Sucesso!',
      template: 'Agora você é um líder'
    });
  }
})

.controller('CounterCtrl', function($scope, $rootScope, $ionicPopup, BackendService) {
  var start = BackendService.getCounter();
  var interval = $rootScope.interval;
  var myCounter = new flipCounter('myCounter', {value: start, inc: interval, auto: false});

  $scope.addCount = function() {
    myCounter.add($rootScope.interval);
    if ($rootScope.vibrationAdd) {
      navigator.vibrate($rootScope.intencity);
    }
    $scope.total = myCounter.getValue();
    BackendService.setCounter($scope.total);
  };

  $scope.subtractCount = function() {
    myCounter.subtract($rootScope.interval);
    if ($rootScope.vibrationSubtract) {
      navigator.vibrate($rootScope.intencity);
    }
    $scope.total = myCounter.getValue();
    BackendService.setCounter($scope.total);
  };

  $scope.resetCount = function() {
    var myPopup = $ionicPopup.show({
      title: 'Reiniciar contador',
      subTitle: 'Caso você tenha certeza que deseja reiniciar o contador clique em Sim',
      scope: $scope,
      buttons: [
        { text: 'Não' },
        {
          text: '<b>Sim</b>',
          type: 'button-positive',
          onTap: function(e) {
            myCounter.setValue(0);
            $scope.total = myCounter.getValue();
            BackendService.setCounter($scope.total);
          }
        },
      ]
    });
  };
})
