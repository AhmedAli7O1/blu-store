bluStore.controller('cartCtrl', ['$scope', '$rootScope', 'cartFactory', 'EVENTS',
    function ($scope, $rootScope, cartFactory, EVENTS) {
        'use strict';

        var ctr = this;
        ctr.cart = [];

        // stop loading screen if exist
        if ($rootScope.loadingState === 'app.cart') {
            $rootScope.loadingState = 'none';
        }

        // on any cart changes reflect that on this cart
        $scope.$on(EVENTS.CART_CHANGED, function (event, newCart) {
            ctr.cart = newCart;
        });

        // load the cart on user login or logout
        $rootScope.$watch('userInfo', function (userInfo) {
            // user logged in
            if (userInfo) {
                // load user cart
                cartFactory.userCart.get();
            }
            // user logged out
            else {
                // load local cart 
                cartFactory.localCart.get();
            }
        });

        ctr.removeOne = function (item) {
            $rootScope.$broadcast(EVENTS.REMOVE_FROM_CART, item);
        };

        ctr.getTotalAmount = cartFactory.getTotalAmount;
        ctr.getTotalPrice = cartFactory.getTotalPrice;

        $scope.cartCtrl = ctr;

    }
]);