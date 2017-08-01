/* global angular, document, window */
'use strict';
var serviceBase = "http://sanjust.azurewebsites.net/";
//var serviceBase = "http://localhost:17543/"
angular.module('starter.controllers', [])

.directive('passwordValidate', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue) {

                scope.pwdValidLength = (viewValue && viewValue.length >= 8 ? 'valid' : undefined);
                scope.pwdHasLetter = (viewValue && /[A-z]/.test(viewValue)) ? 'valid' : undefined;
                scope.pwdHasNumber = (viewValue && /\d/.test(viewValue)) ? 'valid' : undefined;

                if (scope.pwdValidLength && scope.pwdHasLetter && scope.pwdHasNumber) {
                    ctrl.$setValidity('pwd', true);
                    return viewValue;
                } else {
                    ctrl.$setValidity('pwd', false);
                    return undefined;
                }

            });
        }
    };
})

.directive('input', function ($timeout) {
    return {
        restrict: 'E',
        scope: {
            'returnClose': '=',
            'onReturn': '&',
            'onFocus': '&',
            'onBlur': '&'
        },
        link: function (scope, element, attr) {
            element.bind('focus', function (e) {
                if (scope.onFocus) {
                    $timeout(function () {
                        scope.onFocus();
                    });
                }
            });
            element.bind('blur', function (e) {
                if (scope.onBlur) {
                    $timeout(function () {
                        scope.onBlur();
                    });
                }
            });
            element.bind('keydown', function (e) {
                if (e.which == 13) {
                    if (scope.returnClose) element[0].blur();
                    if (scope.onReturn) {
                        $timeout(function () {
                            scope.onReturn();
                        });
                    }
                }
            });
        }
    }

})

.controller('AppCtrl', function ($scope, $state, $ionicModal, $ionicPopover, $timeout, localStorageService, $ionicPopup) {
    $(document).ready(function () { setTimeout(function () { $(".has-header").css("top", $("ion-header-bar").height()); }, 300) })  
    // Form data for the login modal
    $scope.loginData = {};
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;

    $scope.checkLoginStatus = function () {
        var email = sessionStorage.getItem('emailLogin');

        if (email == null) {
            email = localStorage.getItem('emailLogin');
        }
        if (email == "" || email == null || email == undefined) {
            $(".login-menu").show();
            $(".logout-menu").hide();
        } else {
            $(".logout-menu").show();
            $(".login-menu").hide();
        }
    }
    $scope.checkLoginStatus();
    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function () {
            this.classList.toggle('active');
        });
    }

    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function () {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function () {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function () {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.setExpanded = function (bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function (location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function () {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function () {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function () {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function () {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };

    $scope.logout = function () {
        localStorage.removeItem('userData');
        localStorage.removeItem('emailLogin');
        localStorage.removeItem('contactGuid');
        localStorageService.remove('contactGuid');
        localStorage.removeItem('contactImage');
        sessionStorage.clear();
        $state.go("app.login");
    };
    $scope.login = function () {
        $state.go("app.login");
    };

    $scope.myProfile = function () {
        localStorage.setItem('profile', 'view');
        var email = sessionStorage.getItem('emailLogin');
        if (email == null) {
            email = localStorage.getItem('emailLogin');
        }
        if (email == "" || email == null || email == undefined) {
            $scope.showAlert("Crea tu cuanta of inicia sesion");//Log in first to view your profile
            return false;
        } else {
            $state.go("app.userProfile");
        }

    }

    $scope.propertyhome = function () {
        $scope.properties = localStorage.getItem('FilterResult');
        if ($scope.properties != null) {
            $state.go("app.propertyhome");
        } else {
            $scope.showAlert("Realiza primeo una busqueda");//Please Search for Property First
            $state.go("app.filter");
        }
    }
    $scope.matchingProperty = function () {
        $state.go("app.matchingProperty");
    }

    $scope.showAlert = function (message) {
        var alertPopup = $ionicPopup.alert({
            title: 'Mensaje',
            template: message
        });
        alertPopup.then(function (res) {

        });
    };
})

.controller('LoginCtrl', function ($scope, $http, $timeout, $stateParams, ionicMaterialInk, $ionicPopup, $ionicLoading, localStorageService, $state) {
    $scope.show = true;
    $scope.Mostar = function () {
        $scope.show = true;
        $("#passwordlogin").attr("type", "password");
    };
    $scope.Ocultar = function () {
        $scope.show = false;
        $("#passwordlogin").attr("type", "text");
    };
    $(document).ready(function () { setTimeout(function () { $(".has-header").css("top", $("ion-header-bar").height()); }, 300) })
    $(document).ready(function () { setTimeout(function () { $(".has-header").css("top", $("ion-header-bar").height()); var as = $("ion-side-menu-content").children()[0]; $(as).css("display", "block"); }, 300) })
    $scope.$parent.clearFabs();
    $timeout(function () {
        $scope.$parent.hideHeader();
    }, 0);
    ionicMaterialInk.displayEffect();

    //$(document).ready(function () {
    //    var data = sessionStorage.getItem('userData');
    //    var emails = sessionStorage.getItem('emailLogin');
    //    if (data == null && emails == null) {
    //        data = localStorage.getItem('userData');
    //        if (data != null && emails != null) {
    //            var json = JSON.parse(data);
    //            var password = json["password"];
    //            $("#passwordlogin").val(password);
    //            $("#emaillogin").val(emails);
    //        }
    //    } else {
    //        var json = JSON.parse(data);
    //        var password = json["password"];
    //        $("#passwordlogin").val(password);
    //        $("#emaillogin").val(emails);
    //    }
    //})
    $scope.login = function () {
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        var email = $("#emaillogin").val();
        var password = $("#passwordlogin").val();

        if (email == "" || email == null || email == undefined) {
            $scope.showAlert("Introducir email para iniciar sesion");//Enter the email address to log in
            return false;
        }
        if (password == "" || password == null || password == undefined) {
            $scope.showAlert("Introducir contrasena para iniciar sesion");//Enter password to login
            return false;
        }

        $http.get(serviceBase + "api/getContact?email=" + email).success(function (results) {
            $scope.contactDetail = results;
            sessionStorage.setItem('contactImage', results.contactImage);
            sessionStorage.setItem('userData', JSON.stringify(results));
            sessionStorage.setItem('emailLogin', email);
            sessionStorage.setItem('contactGuid', results.contactGuid);
            if (results.contactGuid == null) {
                $scope.showAlert("El contacto con el correo electronico " + email + " no existe ");
            } else {
                if (results.password == password) {
                    sessionStorage.setItem('userData', JSON.stringify(results));
                    sessionStorage.setItem('emailLogin', email)
                    if ($('#rememberPassword').is(':checked')) {
                        localStorage.setItem('userData', JSON.stringify(results));
                        localStorage.setItem('emailLogin', email);
                        localStorage.setItem('contactImage', results.contactImage);
                        localStorage.setItem('contactGuid', results.contactGuid);
                    }

                    $scope.showAlert("Bienvenido " + results.firstname);
                    $state.go("app.Entrance");
                } else {
                    sessionStorage.clear();
                    $scope.showAlert("Email y contrasena no coinciden!");//Email and password do not match!
                }
            }
            $ionicLoading.hide();
        }).error(function (err) {
            $ionicLoading.hide();
            $scope.showAlert("Ha surgido un error");//Something went wrong
        });
    }
    $scope.register = function () {
        $state.go("app.register");
    }

    //$("#show").click(function () {
    //    $("#show").hide();
    //    $("#hide").show();
    //    $("#passwordlogin").attr("type", "text");
    //})
    //$("#hide").click(function () {
    //    $("#hide").hide();
    //    $("#show").show();
    //    $("#passwordlogin").attr("type", "password");
    //})

    $scope.ForgetPassword = function () {
        var emails = $('#emaillogin').val();
        if (emails != "") {
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });

            $http.get(serviceBase + "api/forgetPassword?email=" + emails).success(function (results) {
                $scope.showAlert("Un email con la contrasena ha sido enviado " + emails);
                $ionicLoading.hide();
            }).error(function (err) {
                $ionicLoading.hide();
                if (err == "NotFound") {
                    $scope.showAlert("El contacto con el email " + emails + " no existe");
                } else {
                    $scope.showAlert("Ha surgido un error");//Something went wrong
                }

            });
        } else {
            $scope.showAlert("Introducir Email");
        }
    }

    $scope.checkLoginStatus = function () {
        var email = sessionStorage.getItem('emailLogin');

        if (email == null) {
            email = localStorage.getItem('emailLogin');
        }
        if (email == "" || email == null || email == undefined) {
            $(".login-menu").show();
            $(".logout-menu").hide();
        } else {
            $(".logout-menu").show();
            $(".login-menu").hide();
        }
    }
    $scope.checkLoginStatus();

    $scope.showAlert = function (message) {
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
            title: 'Mensaje',
            template: message
        });
        alertPopup.then(function (res) {

        });
    };
})

.controller('propertyhomeCtrl', function ($scope, $http, $state, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, filterModal, localStorageService, $ionicLoading, $ionicPopup) {
    //$(document).ready(function () {
    //    // init Isotope
    //    setTimeout(function () {
    //        var $grid = $('.my-class').isotope({
    //            itemSelector: '.element-item',
    //            layoutMode: 'fitRows',
    //            getSortData: {
    //                price: '.price parseInt',
    //                category: '[data-category]',
    //            }
    //        });
    //        $('#price-sort').on('change', function () {
    //            var type = $(this).find(':selected').attr('data-sorttype');
    //            console.log(type);
    //            var sortValue = this.value;
    //            if (type == 'ass') { $grid.isotope({ sortBy: sortValue, sortAscending: false }); }
    //            else { $grid.isotope({ sortBy: sortValue, sortAscending: true }); }
    //            $grid.isotope({ sortBy: sortValue });
    //        });
    //        // change is-checked class on buttons
    //        $('#price-sort').on('change', function () {
    //            var sortByValue = this.value;
    //            console.log(sortByValue);
    //            $grid.isotope({ sortBy: sortByValue });
    //        });
    //    },1000)
    //});
    $(document).ready(function () {
        setTimeout(function () {
            $(".has-header").css("top", $("ion-header-bar").height()); var as = $("ion-side-menu-content").children()[0]; $(as).css("display", "block");
            var uniqueCities = localStorage.getItem('uniqueCities');
            var uniqueProperties = localStorage.getItem('uniqueProperties');
            if (uniqueCities != null) {
                $("#uniqueCities").val(uniqueCities);
            }
            if (uniqueProperties != null) {
                $("#uniqueProperties").val(uniqueProperties);
            }
        }, 300)
    })
    $scope.properties = [];
    //show hide map-view and list-view
    $("#map-view").click(function () {
        $("#list-view").removeClass("button-positive");
        $("#map-view").addClass("button-positive");
        $(".element-item,.uniqueCities,.saveSearch").hide();
        $(".saveSearch").hide();
        //$("#map1").show();
        $("#map1").css("height", "90%");
    });
    $("#list-view").click(function () {
        $("#map-view").removeClass("button-positive");
        $(".element-item,.uniqueCities,.saveSearch").show();
        $("#list-view").addClass("button-positive");
        $(".slider").show("hide");
        //$("#map1").hide();
        if($(".slider-slide").width() ==0)
        {
            $(".slider-slides,.slider-slide").css("width", "inherit");
        }
    });
    
    var vm = this;
    vm.variableToBind = $stateParams.filter;

    $scope.showFilter = function () {
        var scope = filterModal.scope;
        filterModal.show();
    }
    // Set Header
    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    // Set Motion
    $timeout(function () {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function () {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();
    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    $scope.Checkfavorite = function () {
        setTimeout(function () {
            favorities = localStorageService.get('favorities');
            if (favorities == null) {
                favorities = [{}];
                if (favorities[0].name == undefined) {
                    favorities.splice(0, 1);
                }
            }
            for (var d = 0; d < favorities.length; d++) {
                for (var e = 0; e < $scope.properties.length; e++) {
                    if ($scope.properties[e].productid == favorities[d].productid) {
                        $('#' + $scope.properties[e].productid).toggleClass('ion-android-star-outline').toggleClass('ion-android-star');
                    }
                }
            }
        }, 500)
    };
    $scope.loadinfobubble = function (locations) {
        var map = new google.maps.Map(document.getElementById('map1'), {
            zoom: 15,
            center: new google.maps.LatLng(locations[0][1], locations[0][2]),
            mapTypeId: 'roadmap'
        });

        var infowindow = new google.maps.InfoWindow();
        var marker, i;
        for (i = 0; i < locations.length; i++) {
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                map: map,
                icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAdCAMAAAB7cXezAAABPlBMVEVHcEwAMXIAMXIAMXIAMXIAMXIAMXIAMXIAMXIAMXIAMXIAMXIAMXIAMXIAMXIAMXIAMXIAMXIAMXIAMXIAMXIAMXIAMXIAMXIAMXIAMXIAMXIAMXIAMXIAMXIAMXIAMXIAMXIAMXIAMXIAMXIAMXIAMXIAMXIAMXIAMXIALnAAMHEANHQBN3cBOXjC7Pif3/OV3fIPT4jN7/ni9fx00u+B1vAhZZkOTIY2Z5ddq85cjbOl2u48hbHS8Pmr5PTr+Pzc8/rw+v6y5va+6vfK7vhWqc5su9uk4fO46PbG7ffV8fnY8vsEP3whUogaXZI2fqxAc58YWpC24fC03OxrxON9pMKZ1+2+4e9Vl71EiLJ0vtzO3Oi1yduN2vBgs9aFudTI7/myxddurs570+5vz+276PaQ2vDd8/r5/f6w5fTsqgIAAAAAKHRSTlMA3moedv4F/AH7GUig1MsW2IGXEOYOMNAk8D6L81HscsnPXmS3u5iZqegttwAAATVJREFUeF5VitVyg2AYRD/aQPiTtI173RaIEHdXqbu7vv8LFJiWKediZ+fMIQ0xGAvFEQ/FgiIZBGwcD0mSwHO2gC58XgY5mTnOJCUwr49I8DAoxcrpyVnlSAHzCBT1Q6lepMb9Xqp2qMAfJRekg1pu0uin0veXZQku4qCcq6NZN/utTrtXAEcMybtOa5Jq5lrNwmMSTDOJl964nftMq4XZc0IzbuA63X4vNKbpRrYKuGkX0v5t9vXto/P1dJORsEPOCOTyMJ/Pq6NhUUbESb5tQC7VBw+DekkGtgJEm0xTSOwltAXbICLHOnRkY9eWNCOu2vEHmyOd+QXTLDoMI9rslsSMzMSIeDMxIzOxRHpiEnYDCOmJGXl48Db6T9APLmwxggtekSwsrzjJyrzLQVYEp/D7fgC2BjWaHg6q4AAAAABJRU5ErkJggg=="
            });
            google.maps.event.addListener(marker, 'click', (function (marker, i) {
                return function () {
                    var sensordata = '';//
                    if (locations[i][4] != null) {
                        sensordata += '<div class="row"><img class="col clicks" id="' + locations[i][5] + '"  style="width:130px;height:100px" src="data:image/png;base64,' + locations[i][4] + '" /><h5 class="col" style="color:Green;">' + locations[i][3] + '</h5></div><span style="color: green;"><i class="fa fa-check" aria-hidden="true"></i></span>'
                        '</div>';
                    } else {
                        sensordata += '<div class="row"><img class="col clicks" id="' + locations[i][5] + '" style="width:130px;height:100px" src="data:image/jpeg;base64,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" /><h5 class="col" style="color:Green;">' + locations[i][3] + '</h5></div><span style="color: green;"><i class="fa fa-check" aria-hidden="true"></i></span>'
                        '</div>';
                    }
                    var contentString = '<div class="row">';
                    contentString += '<div id="siteNotice" class="col"><b>' + locations[i][0] + '&nbsp;&nbsp;';
                    contentString += '</b><br/>' + sensordata;
                    contentString += '</div>';
                    contentString += '';
                    contentString += '</div>';
                    infowindow.setContent(contentString);
                    infowindow.open(map, marker);
                    divFunction();
                }
              
            })(marker, i));
        }
       
       
    }
    $scope.mapshow = function () {
        var locations = [];
        var obj = [];
        var latti = -33.80;
        var longi = 151;
        var numb = 1
        var i = 0;
        for (var i = 0; i < $scope.properties.length; i++) {
            obj = [$scope.properties[i].sj_building, $scope.properties[i].lat, $scope.properties[i].lng, $scope.properties[i].sj_street3 + " " + $scope.properties[i].sj_city + " " + $scope.properties[i].sj_stateprovince + " " + $scope.properties[i].sj_countryregion + " " + numb, $scope.properties[i].entityimage, $scope.properties[i].productid];
            locations.push(obj);
            numb = numb + 1;
        }
        if (locations.length > 0) {
            $scope.loadinfobubble(locations);
        }
    }
    var filterdata = localStorageService.get('filter');
    var minPrice = localStorageService.get('minPrice');
    var maxPrice = localStorageService.get('maxPrice');
    var NumberOfBathrooms = localStorageService.get('NumberOfBathrooms');
    var NumberOfRooms = localStorageService.get('NumberOfRooms');
    var PropertyType = localStorageService.get('propertyType');
    $scope.cities = function (cities) {
       var flags = [], output = [], l = cities.length, i;
        for (i = 0; i < l; i++) {
            if (flags[cities[i].sj_city]) continue;
            flags[cities[i].sj_city] = true;
            output.push(cities[i].sj_city);
        }
        $scope.outputCities = output;
    }

    $("#uniqueCities").change(function () {
        var cityToshow = $(this).val();
        if (cityToshow != "All") {
            $(".element-item").hide();
            $('.element-item[value="' + cityToshow + '"]').show();
        } else {
            $(".element-item").show();
        }
    })

    $("#uniqueProperties").change(function () {
        var cityToshow = $(this).val();
        if (cityToshow != "All") {
            $(".element-item").hide();
            $('.element-item[title="' + cityToshow + '"]').show();
        } else {
            $(".element-item").show();
        }
    })

    $scope.propertyTypes = function (property) {
        var flags = [], op = [], l = property.length, i;
        for (i = 0; i < l; i++) {
            if (flags[property[i].sj_propertytype]) continue;
            flags[property[i].sj_propertytype] = true;
            op.push(property[i].sj_propertytype);
        }
        $scope.outputpropertyTypes = op;
    }

    $scope.getProperties = function () {
        var adata = {
            "minPrice": minPrice,
            "maxPrice": maxPrice,
            "NumberOfRooms": NumberOfRooms,
            "NumberOfBathrooms": NumberOfBathrooms,
            "Piscina": filterdata.Piscina,
            "VistaMar": filterdata.VistaMar,
            "PropertyType": PropertyType
        };

        $scope.properties = localStorageService.get('FilterResult');
        var retrievedObject = localStorage.getItem('FilterResult');
        if (retrievedObject != null) {
            $scope.properties = JSON.parse(retrievedObject);
        }
        
        if ($scope.properties != null) {
            $scope.Checkfavorite();
            $scope.cities($scope.properties);
            $scope.propertyTypes($scope.properties);
            setTimeout(function () {
                $scope.mapshow();
                //$("#map1").addClass("hide");
            }, 2000);

            $ionicLoading.hide();
        }
        if ($scope.properties == null) {
            $http.post(serviceBase + "api/Filter", adata).then(function (res) {
                $scope.properties = [];
                $scope.properties = res.data;
                localStorage.setItem('FilterResult', JSON.stringify(res.data));
               
                //localStorageService.set('FilterResult', res.data);
                $scope.cities(res.data);
                $scope.propertyTypes($scope.properties);
                $scope.Checkfavorite();
                $ionicLoading.hide();
                setTimeout(function () {
                    $scope.mapshow();
                }, 500)
               
                setTimeout(function () {
                    //$("#map1").addClass("hide");
                    //$("#map1").hide();
                }, 100)
                
            }, function (error) {
                $ionicLoading.hide();
                alert("Ha surgido un error");//Something went wrong
            });
        }
    }
    $scope.getProperties();

    $scope.saveMatch = function () {
        var isMatched = localStorageService.get('isMatchedCriteria');
        if (isMatched) {
            $scope.showConfirm();
        } else {
            localStorageService.set('Piscina', filterdata.Piscina);
            localStorageService.set('VistaMar', filterdata.VistaMar);
            localStorageService.set('isMatchedCriteria', true);
            localStorageService.set('Match-minPrice', minPrice);
            localStorageService.set('Match-maxPrice', maxPrice);
            localStorageService.set('Match-NumberOfBathrooms', NumberOfBathrooms);
            localStorageService.set('Match-NumberOfRooms', NumberOfRooms);
            localStorageService.set('Match-propertyType', PropertyType);
            $scope.showAlert("Criterios guardados");
        }
    }
    //favorities start
    var favorities = [{}];
    if (favorities[0].name == undefined) {
        favorities.splice(0, 1);
    }

    var recentViewedProperty = [{}];
    if (recentViewedProperty[0].name == undefined) {
        recentViewedProperty.splice(0, 1);
    }
    $scope.GoToSingleProperty = function (property, propertyId) {
        localStorageService.set('PropertyId', propertyId);
        recentViewedProperty = localStorageService.get('recentViewedProperty');
        if (recentViewedProperty == null) {
            recentViewedProperty = [{}];
            if (recentViewedProperty[0].name == undefined) {
                recentViewedProperty.splice(0, 1);
            }
        }
        var Visitflg = true;    ////Flag to check record already exist or not....!!!!
        for (var d = 0; d < recentViewedProperty.length; d++) {
            if (property.productid == recentViewedProperty[d].productid) {
                Visitflg = false;    ////if  already exist then set False....!!!!
            }
        }
        if (Visitflg == true)    ////if  True....!!!!
        {
            if (recentViewedProperty.length >= 5)   ////Recent Viewd Array max length...
            {
                recentViewedProperty.shift();   ////  if Recent Viewd Array max length exceeded then remove oldest value....
                recentViewedProperty.push(property);     ////  Push New Value.......
            }
            else {
                recentViewedProperty.push(property);  ////  Push New Value.......
            }
        }
        localStorageService.set('recentViewedProperty', recentViewedProperty);
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        $state.go('app.singleproperty');
    }
    
    
    function divFunction() {
        $(".clicks").click(function () {
            var propertyId = this.id;
            localStorageService.set('PropertyId', propertyId);
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            $state.go('app.singleproperty');
        });
    }
    $scope.addToFavority = function (propery) {
        favorities = localStorageService.get('favorities');
        if (favorities == null) {
            favorities = [{}];
            if (favorities[0].name == undefined) {
                favorities.splice(0, 1);
            }
        }
        var property_id = propery.productid;
        $('#' + property_id).toggleClass('ion-android-star-outline').toggleClass('ion-android-star');
        var flg = true;
        if (favorities != null) {
            for (var d = 0; d < favorities.length; d++) {
                if (propery.productid == favorities[d].productid) {
                    flg = false;
                    favorities.splice(d, 1);
                    break;
                }
            }

        }

        if (flg == true) {
            favorities.push(propery);
        }
        localStorageService.set('favorities', favorities);
    }

    $scope.showConfirm = function () {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Borrar',
            template: 'Solo se puede guardar una busqueda. Al guardar se borrara la busqueda que guardo anteriormente',
            cancelText: 'Cancelar',
            okText: 'Ok',
         
        });

        confirmPopup.then(function (res) {
            if (res) {
                localStorageService.remove('isMatchedCriteria');
                localStorageService.remove('Piscina');
                localStorageService.remove('VistaMar');
                localStorageService.remove('Match-minPrice');
                localStorageService.remove('Match-maxPrice');
                localStorageService.remove('Match-NumberOfBathrooms');
                localStorageService.remove('Match-NumberOfRooms');
                localStorageService.remove('Match-propertyType');

                localStorageService.set('Piscina', filterdata.Piscina);
                localStorageService.set('VistaMar', filterdata.VistaMar);
                localStorageService.set('isMatchedCriteria', true);
                localStorageService.set('Match-minPrice', minPrice);
                localStorageService.set('Match-maxPrice', maxPrice);
                localStorageService.set('Match-NumberOfBathrooms', NumberOfBathrooms);
                localStorageService.set('Match-NumberOfRooms', NumberOfRooms);
                localStorageService.set('Match-propertyType', PropertyType);
            } else {

            }
        });
    };

    $("#uniqueCities").change(function () {
        localStorage.setItem('uniqueCities', this.value);
    });

    $("#uniqueProperties").change(function () {
        localStorage.setItem('uniqueProperties', this.value);
    });
})

.controller('singlepropertyCtrl', function ($scope, $http, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, $state, $ionicScrollDelegate, localStorageService, $ionicPopup, $ionicLoading, $ionicModal) {
    $(document).ready(function () { setTimeout(function () { $(".has-header").css("top", $("ion-header-bar").height()); var as = $("ion-side-menu-content").children()[0]; $(as).css("display", "block"); }, 300) })


    $ionicModal.fromTemplateUrl('my-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function () {
        $scope.modal.show();
    };
    $scope.closeModal = function () {
        $scope.modal.hide();
        var page = localStorage.getItem('page');
        if (page == "favourite") {
            $state.go('app.favorateproperty');
        } else {
            $state.go('app.myRequests');
        }
        
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
        // Execute action
    });


    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab('right');

    $timeout(function () {
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    }, 200);

    $scope.route = function (route) {
        var address = $scope.propertyDeatil;
        localStorageService.set('address', address[0].sj_city + address[0].sj_stateprovince + address[0].sj_countryregion);
        $state.go('app.route');
    }
    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    $scope.GetSingleProperty = function () {
        var propertyId = localStorageService.get('PropertyId');

        $http.get(serviceBase + "api/Property/GetById?PropertyGuid=" + propertyId).success(function (results) {
    
            if (results.PropertyLists[0].sj_dealtype == "Vendido") {
                ///////////////////
                $scope.openModal();
                $ionicLoading.hide();
                
            } else {
                $scope.propertyDeatil = results.PropertyLists;
                $scope.propertyDeatil.images = results.PrImages;
                $scope.propertyDeatil.comments = results.PrComments;
                $scope.dest = results.PropertyLists[0].sj_street3 + "," + results.PropertyLists[0].sj_city + "," + results.PropertyLists[0].sj_stateprovince + "," + results.PropertyLists[0].sj_countryregion;
                var address = $scope.propertyDeatil;
                localStorageService.set('name', address[0].name);
                localStorageService.set('address', address[0].sj_street3 + " " + address[0].sj_city + " " + address[0].sj_stateprovince + " " + address[0].sj_countryregion);


                getLatitudeLongitude(showResult, $scope.dest)
                $scope.Checkfavorite();

                $ionicLoading.hide();
                setTimeout(function () {
                    options();
                }, 1000)
            }
            
            
        }).error(function (err) {
            $ionicLoading.hide();
            alert("Ha surgido un error");//Something went wrong
        });
    }

    $scope.Checkfavorite = function () {
        setTimeout(function () {
            favorities = localStorageService.get('favorities');
            if (favorities == null) {
                favorities = [{}];
                if (favorities[0].name == undefined) {
                    favorities.splice(0, 1);
                }
            }
            for (var d = 0; d < favorities.length; d++) {
                if ($scope.propertyDeatil[0].productid == favorities[d].productid) {
                    $('#' + $scope.propertyDeatil[0].productid).toggleClass('ion-android-star-outline').toggleClass('ion-android-star');
                }
            }
        }, 500)
    };
    ////map start
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var directionsService = new google.maps.DirectionsService();     //Create a DirectionsService object which is required to communicate with the Google Maps API Direction Service
    var map;
    function showResult(result) {
        var latitude = result.geometry.location.lat();
        var longitude = result.geometry.location.lng();
        initMap(latitude, longitude)
    }

    function getLatitudeLongitude(callback, address) {
        // If adress is not supplied, use default value 'Ferrol, Galicia, Spain'
        address = address || 'Ferrol, Galicia, Spain';
        // Initialize the Geocoder
        var geocoder = new google.maps.Geocoder();
        if (geocoder) {
            geocoder.geocode({
                'address': address
            }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    callback(results[0]);
                }
            });
        }
    }

    function initMap(latitude, longitude) {
        var address = localStorageService.get('address');
        var name = localStorageService.get('name');
        var uluru = { lat: latitude, lng: longitude };
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 10,
            center: uluru
        });

        var contentString = '<div id="content">' +
            '<div id="siteNotice">' +
            '</div>' +
             '<h3 id="firstHeading" class="firstHeading" style="color:black">' + name + '</h1>' +
            '<p>' + address +
            '</p>' +
            '</div>';

        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });

        var marker = new google.maps.Marker({
            position: uluru,
            map: map,
            title: 'Uluru (Ayers Rock)',
            icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAzCAYAAACAArhKAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QQKBSQ4VNC/8AAAB5RJREFUWMOtmFlsXFcZx393md1LEnu8jI2dnZaikIiUxI2VtGlooUiFQOGpCJUlEi+gCokXHpCQeIGHPCEeEFDKDgEVJSktiRM7jrM6i5M0m8GT2LFnPJ4Zz3g8271z7+Xh3KnH47Ez4/QvXXl0zrnn//2/7zvn+64llsPON4u/FOCTwF5gF/ApoAuot+dTwDgwAlwEzgC3AAOA4cMVt5dWIHQAO4HXgQPABntsJehAEDgJ/AEYtseWGKAus0Eb8F3gW0AH1cMBbLWfLwK/Bn4JhJdXvKB0G/BT4HMVDbMs+2/ZDtJS5wEF4D3gR8CNUuVKGekO4Be2a+VKhE6PC++aerxr6vDW+3C4nViWhaEXKhkg2+q3AdeAMIEemLqwSNF64OfAnsWEQlVjy1o2bttC19Yudm9uo6nRy82kRmIuQ2I6zqPRccZujJKcSQgjFxuwx97728AD4Sih1gv8zI7rglLLQnU5eXrXM2zf/yz+QDO9bXV8tsWNS5F4P5ShfyaHJUmYeoG1qSSjZ67wjxPXyGbz5eSmHe8fAhmFQA/A54EfA55S0sZ6Ly8f3Mv2V3pp9q+hp8nNniYX52M55nWT7WtcxDSDed1gxzo3rz3VQtOWLiZ0ifCDEAVNLyWXgI8jjt09FWgA3gAaS81TVJVDX+vle6/v50EefAps8Dk4HclyK6nhU2V8qsRXOn3M5A3WORXOx3IMJg22vfgZpEKBwaNn0XSjNIUbba5+FXjOfkqcYtHxiS7aenbgczvorZfJGhanI1lM4DubGkjpJpfjeQDqVJn3whmuzeaRJYneVh/ffON5fjAV4sT5e+Uufw7oUQj0HAJeKp1xuRx84bUXINBOOFtgrmByMZ7HLUscaPWSNSz8LgW3KnF8KsOleJ6xdAGnLHGg1cP+Vg+S00nKhMFLdzEMs3R7HxCSgd3lx2Zrl59DvVvp8CjcTemcjmRpdskcaPUQTOu8FUxxcjrD5joHn17nImdYNKgyrwS89Prd3Exo/CY4R2htMx2BpoWzv4BdKrCl3M1Pr29le3sDm2SVu3Ma7W6VTXUqwXSB05EsqgTXExodHpXeZjcBt4pbkejwKFyd1Tg2lWbesHB6PXR0+hkbC5W7e6sK+MvNcfg8WKpKu1Oh3S0SfXRe53I8z/MtHtrdCiMJjYGZLGucMk81OLCA4Xied0MZ5gsWAY/Cs20eppvrGVwiGL9K+Q0F3E/kOTaZZl+bj7VOmQ+SGiMJjX1+N5vrRZ3Y63cT1wzemUyzz+8hoZkMRrOkdIv1PpUvd/pod0r8iaWsgKwCM0DLh0OSRCaZ4mI4xVjOxCNLWMDLbR66fSoXYjlmNZMXWkQS/fnhPEcm0phY6CZ8zKtysNNHp1flf9F5Hk4nKtXAGRm4uWhIgtD4NJlEirmCRcGyeKnNwzONTq7M5jk6leFUJMuFWI51ToVXO3x0+VScssTGOpWDHV7a3QpDsTx//SDMyOhUpQJyQ0UU7/0U7ZIkErMpjNEgX929gW6vit+lcD+lcyKcJWsI1w1Fc2zwOej2qXy9u46oZtLklPEoEqciOc5Fc9wevkc0niontoCLMjAERBcltmFy7sx1lOkZ/C6F8UyBY1MZZnUTybYwppn0z2TJGBYNDpmNPhWvIjEwk2MgmiP5KMylsyMYBbNcbQQYVAj0zAIvAt2lcY4m0oxHkjSs72QoBY+yhUWhkoBY3qRgQpNbZk63OBXJMhTNk59NcvbIKe7cGQd5iZuHgcMKgZ4M0L7I3Tb52KMY14MRHM3r8DbWIZXFykQYdCOpcWVWYyxdYG4ywtkjfVy/er9SPluICtVXrE7zwKssNHAfrpoJRQn/dwLJMvHWeVFdThRVAUlCkiQsSSKbLxCPJgheusWZf/Zz787DyocIJoCfABEhYeebHtuSb1RcblkoikJLoImWDZ34A03U13uRgFQqQywUIxKcJDQVxSgYy7VBFvAr4PsMH84VO5AscAT4EmXlseh2wzQJTUQIjU+jqAoOh3hV1wsLZMWnMuLA34EcFG8t0YANAudYCZIEsoxhWuRyOrmcjmFaIMsrERbRD1woNnul12US+KOt/vEonqvqkEL02fPFgfJ7+iRwuertqsdZYKB0YIFYuGAa+D2Q/whJ08BvgdnSr4nFisXEccQh/6jQD/SVf8LIFRZOA29TbaxXxpy9V7x8ohKxCfwL0fk/KYaA/1SaWEq8EOu3Ae0JSIuxTVT6VJVXePEYT5bhA0DfcpOViYWFk6w+w+dttfHlPsyXVyxeOMrqYt1PhUyujlggDPwO+36tEkngLWB2pUWPIzaBd4CrNRCfYZlMrp5YuCqMiLVeBWnaVptayc3VKC7ieJWqBxDxfSweTywsnwD+wsrnOo2obvHHqa1FMYhY31th/gpVxLY24sWqjQorNFttrBq1tSo2EOc6WGHuNvA+LNfjPQmxUHIbOFFGYNkGjVertlbFRdV/Q1wSRYQR1axqtbUTC0UjLG4KB4C7tahdjWKABPBvREJlEP8yTNe6iVrrCwiX9iFqtoa4ImtG7YqFS4OIWn0BmKzVzatVDKJG9yHu71V1KaslthC98qrxf7ii8+a9aNFnAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE3LTA0LTEwVDA1OjM2OjU2LTA0OjAwirZNbwAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNy0wNC0xMFQwNTozNjo1Ni0wNDowMPvr9dMAAAAASUVORK5CYII="
        });

        marker.addListener('click', function () {
            infowindow.open(map, marker);
        });
    }

    ////map end 

    $scope.GetSingleProperty();

    //favorities start
    var favorities = [{}];
    if (favorities[0].name == undefined) {
        favorities.splice(0, 1);
    }

    $scope.addToFavority = function (propery) {

        favorities = localStorageService.get('favorities');
        if (favorities == null) {
            favorities = [{}];
            if (favorities[0].name == undefined) {
                favorities.splice(0, 1);
            }
        }
        var property_id = propery.productid;
        $('#' + property_id).toggleClass('ion-android-star-outline').toggleClass('ion-android-star');
        var flg = true;

        if (favorities != null) {
            for (var d = 0; d < favorities.length; d++) {
                if (propery.productid == favorities[d].productid) {
                    flg = false;
                    favorities.splice(d, 1);
                    break;
                }
            }
        }


        if (flg == true) {
            favorities.push(propery);
        }
        localStorageService.set('favorities', favorities);
    }
    //favorities end


    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    ////chat window start
    $("#chat").click(function () {
        $(".messaging-view").removeClass("hide");
        $(".propertyInfo").addClass("hide");

        var name = $(".item-name").text();
        var ref = $(".ref").text();
        var price = $(".money").text();
        $("input.PropertyName").val(name);
        $(".reference").text(ref);
        $("input.PropertyPrice").val(price);
    })
    $scope.Back = function () {
        $(".messaging-view").addClass("hide");
        $(".propertyInfo").removeClass("hide");
        $(".slider").show("hide");
        if ($(".slider-slide").width() == 0) {
            $(".slider-slides").css("width", "inherit");
            var slide = $(".slider-slide")[0]
            $(slide).css("width", "inherit");
        }
    }
    ////////////////////////////////////////////////////////////////////

    var data = sessionStorage.getItem('userData');
    if (data == null) {
        data = localStorage.getItem('userData');
    }
    var json = JSON.parse(data);
    var guidContact = "";
    var mobile = "";
    if (json != null) {
        guidContact = json["contactGuid"];

        mobile = json["phoneNumber"];
        if (mobile == null || mobile == "") {
            mobile = json["mobile2"];
        }
    }
    if (guidContact == "") {
        guidContact = localStorage.getItem('contactGuid');
    }

    $(".Mobile").val(mobile);
    $scope.scheduleCall = function () {


        if (guidContact == null) {
            $scope.showAlert("Inicie sesion para programar una llamada");//Log in first to schedule a call
            return false;
        }

        var contactGuid = guidContact;
        var productGuid = $("span.propertyGuid").text();
        var nameCall = $(".item-name").text();
        var refCall = $(".ref").text();
        var priceCall = $(".money").text();
        var mobileCall = $("input.Mobile").val();
        var timeCall = $("select#time").val();
        var dateCall = $("#dd").text().trim();
        var commentCall = $("textarea.comment").val();
        debugger;

      //  var q = new Date();
        var date = new Date();
        debugger;
        // Format day/month/year to two digits
        //date = date.setDate(date.getDate() - 1);
        var formattedDate = ('0' + (date.getDate())).slice(-2);
        var formattedMonth = ('0' + (date.getMonth() + 1)).slice(-2);
        var formattedYear = date.getFullYear().toString().substr(2, 2);

        // Combine and format date string
        var dateString = formattedMonth + '/' + formattedDate + '/' + formattedYear;

        var currentdate = new Date(dateString);

        var selecteddate = new Date(dateCall);
        
        if (currentdate > selecteddate) {
            $scope.showAlert("No puede seleccionar la fecha de atraso para programar una llamada");//Provide the date to call
            return false;
        }

        //var d = new Date();
        //d = d.setDate(d.getDate() - 1);
        //var dt = d.getTime();
        //var d2 = dateCall;
        //var dt2 = new Date(dateCall);
        //var ddt2 = dt2.getTime();
        //if (dt <= ddt2) {
      
        //} else {
        //    $scope.showAlert("No puede seleccionar la fecha de atraso para programar una llamada");//Provide the date to call 
        //    return false;
        //}
        

        if (mobileCall == "" || mobileCall == undefined) {
            $scope.showAlert("Introducir numero de telefono");//Please, fill in the phone number
            return false;
        }
        if (dateCall == "" || dateCall == undefined) {
            $scope.showAlert("Elige fecha");//Provide the date to call
            return false;
        }
        if (timeCall == "hora" || timeCall == undefined || timeCall == "") {
            $scope.showAlert("Elige hora ");//Provide time to call
            return false;
        }

        var scheduleMyCall = {
            "productGuid": productGuid,
            "name": nameCall,
            "refrenceNumber": refCall,
            "price": priceCall,
            "date": dateCall,
            "time": timeCall,
            "mobile": mobileCall,
            "Description": commentCall,
            "contactGuid": contactGuid
        }
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        var responseMessage = $.post(serviceBase + "api/scheduleCall?scheduleData", scheduleMyCall, function () {
            $ionicLoading.hide();
            $scope.showAlert("Gracias! Su llamada ha sido programada");//Thank you! Your call has been scheduled
            $(".messaging-view").addClass("hide");
            $(".propertyInfo").removeClass("hide");

        }).fail(function (error) {
            $ionicLoading.hide();
            $scope.showAlert("Error al programar una llamada");//Failed to schedule a call
        })
    }

    $scope.showAlert = function (message) {
        var alertPopup = $ionicPopup.alert({
            title: 'Alerta',
            template: message
        });
        alertPopup.then(function (res) {

        });
    };
    function options() {
        $(".inmueble .button-stable").click(function () {
            $(".options-inmueble").toggleClass("hide");
            $(".inmueble .button-stable i").toggleClass("ion-arrow-up-b");
        });

        $(".vivienda .button-stable").click(function () {
            $(".options-vivienda").toggleClass("hide");
            $(".vivienda .button-stable i").toggleClass("ion-arrow-up-b");
        });
    }
    
})

.controller('FilterCtrl', function ($scope, $timeout, $stateParams, ionicMaterialInk, $state, $ionicPopup, localStorageService) {
    $(document).ready(function () {
        setTimeout(function () {
            var as = $("ion-side-menu-content").children()[0]; $(as).css("display", "block");
            var minPrice = localStorageService.get('minPrice');
            var maxPrice = localStorageService.get('maxPrice');
            var NumberOfRooms = localStorageService.get('NumberOfRooms');
            var filterdata = localStorageService.get('filter');
            if (filterdata != null) {
                var vistamar = filterdata.VistaMar;
                if (filterdata.VistaMar == true) {
                    $("#VistaMar input").prop('checked', "checked");
                }
                if (filterdata.Piscina == true) {
                    $("#piscina input").prop('checked', "checked");
                }
            }
            NumberOfRooms = $scope.NumberOfRooms(NumberOfRooms);
            $("#minPriceRange").val(minPrice);
            $("#maxPriceRange").val(maxPrice);
            $(".qty.Nrooms").val(NumberOfRooms);
        }, 300)
    })
    var propertyType = localStorageService.get("propertyType", propertyType);
    $scope.showAlert = function () {
        var alertPopup = $ionicPopup.alert({
            title: 'alert!',
            template: 'Please select any value'
        });

    };
    $scope.filter = {};
    $scope.filter1 = function (filter) {
        localStorageService.remove('NumberOfRooms');
        localStorageService.remove('NumberOfBathrooms');
        if (filter == null) {
            filter = [];
        }
        var minPrice = $("#minPriceRange").val();
        var maxPrice = $("#maxPriceRange").val();
        if (maxPrice == "Cualquier") {
            maxPrice = "";
        }
        if (minPrice != "") {
            minPrice = minPrice;
        } else {
            minPrice = "0";
        }
        if (maxPrice != "") {
            maxPrice = maxPrice;
        } else {
            maxPrice = "";
        }
        var bath = $('input[name=bathrooms]').val();
        if (bath != "") {
            var NumberOfBathrooms = $scope.valueOfBathroomsAndRooms(bath);
            localStorageService.set('NumberOfBathrooms', NumberOfBathrooms);
        }

        var room = $('input[name=rooms]').val();
        if (room != "") {
            var NumberOfRooms = $scope.valueOfBathroomsAndRooms(room);
            localStorageService.set('NumberOfRooms', NumberOfRooms);
        }
        var propertyType = $("#tipoinmueble").val();
        localStorageService.set('propertyType', propertyType);
        localStorageService.set('minPrice', minPrice);
        localStorageService.set('maxPrice', maxPrice);
        localStorageService.set('filter', filter);
        localStorage.removeItem('FilterResult');
        $state.go("app.propertyhome", { filter: filter });
    }
    $scope.clearFields = function () {
        $scope.filter = {};
        $("#maxPriceRange").val("");
        $("#minPriceRange").val("");
        $(".qty.Nrooms").val("0");
        $("#VistaMar input").prop('checked', "");
        $("#piscina input").prop('checked', "");
    }
    $scope.valueOfBathroomsAndRooms = function (bath) {
        var value = "";
        switch (bath) {
            case "0":
                value = "212150010";
                break;
            case "1":
                value = "212150000";
                break;
            case "2":
                value = "212150001";
                break;
            case "3":
                value = "212150002";
                break;
            case "4":
                value = "212150003";
                break;
            case "5":
                value = "212150004";
                break;
            case "6":
                value = "212150005";
                break;
            case "7":
                value = "212150006";
                break;
            case "8":
                value = "212150007";
                break;
            case "9":
                value = "212150008";
                break;
            case "10":
                value = "212150009";
                break;
        }
        return value;
    }

    $scope.NumberOfRooms = function (bath) {
        var value = "";
        switch (bath) {
            case "212150010":
                value = "0";
                break;
            case "212150000":
                value = "1";
                break;
            case "212150001":
                value = "2";
                break;
            case "212150002":
                value = "3";
                break;
            case "212150003":
                value = "4";
                break;
            case "212150004":
                value = "5";
                break;
            case "212150005":
                value = "6";
                break;
            case "212150006":
                value = "7";
                break;
            case "212150007":
                value = "8";
                break;
            case "212150008":
                value = "9";
                break;
            case "212150009":
                value = "10";
                break;
        }
        return value;
    }

    jQuery(document).ready(function () {
        $(".Nrooms").val(0);
        $(".Nbathrooms").val(1);
        // This button will increment the value
        $('.qtyplus').click(function (e) {
            // Stop acting like a button
            e.preventDefault();
            // Get the field name
            var fieldName = $(this).attr('field');
            // Get its current value
            var currentVal = parseInt($('input[name=' + fieldName + ']').val());
            // If is not undefined
            if (!isNaN(currentVal) && currentVal < 10) {
                // Increment
                $('input[name=' + fieldName + ']').val(currentVal + 1);
            } else {
                // Otherwise put a 0 there
                if (fieldName == "rooms") {
                    $('input[name=' + fieldName + ']').val(0);
                } else {
                    $('input[name=' + fieldName + ']').val(1);
                }

            }
        });
        // This button will decrement the value till 0
        $(".qtyminus").click(function (e) {
            // Stop acting like a button
            e.preventDefault();
            // Get the field name
            var fieldName = $(this).attr('field');
            // Get its current value
            var currentVal = parseInt($('input[name=' + fieldName + ']').val());
            // If it isn't undefined or its greater than 0
            if (fieldName == "rooms") {
                if (!isNaN(currentVal) && currentVal > 0) {
                    // Decrement one
                    $('input[name=' + fieldName + ']').val(currentVal - 1);
                } else {
                    // Otherwise put a 0 there
                    $('input[name=' + fieldName + ']').val(0);
                }
            } else {
                if (!isNaN(currentVal) && currentVal > 1) {
                    // Decrement one
                    $('input[name=' + fieldName + ']').val(currentVal - 1);
                } else {
                    // Otherwise put a 0 there
                    $('input[name=' + fieldName + ']').val(1);
                }
            }

        });
    });
    
})

.controller('favoratepropertyCtrl', function ($scope, $http, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, $state, localStorageService, $ionicLoading) {
    $(document).ready(function () { setTimeout(function () { $(".has-header").css("top", $("ion-header-bar").height()); var as = $("ion-side-menu-content").children()[0]; $(as).css("display", "block"); }, 300) })
    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab('right');

    $timeout(function () {
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    }, 200);
    var favorities = [{}];
    $scope.Checkfavorite = function () {
        setTimeout(function () {
            favorities = localStorageService.get('favorities');
            if (favorities == null) {
                favorities = [{}];
                if (favorities[0].name == undefined) {
                    favorities.splice(0, 1);
                }
            }
            for (var d = 0; d < favorities.length; d++) {
                $('#' + $scope.FavorateData[d].productid).toggleClass('ion-android-star-outline').toggleClass('ion-android-star');
            }
        }, 500)
    };

    $scope.FavorateData = localStorageService.get('favorities');
    if ($scope.FavorateData != null) {
        for (var i = 0; i < $scope.FavorateData.length; i++) {
            if ($scope.FavorateData[i].productid == undefined) {
                $scope.FavorateData.splice(i, 1);
            }
        }
        $scope.Checkfavorite();
    }

    $ionicLoading.hide();

    var recentViewedProperty = [];
    $scope.GoToSingleProperty = function (property, propertyId) {
        localStorage.setItem('page',"favourite");
        recentViewedProperty = localStorageService.get('recentViewedProperty');

        var Visitflg = true;    ////Flag to check record already exist or not....!!!!

        for (var d = 0; d < recentViewedProperty.length; d++) {

            if (property.productid == recentViewedProperty[d].productid) {
                Visitflg = false;    ////if  already exist then set False....!!!!
            }
        }
        if (Visitflg == true)    ////if  True....!!!!
        {

            if (recentViewedProperty.length >= 10)   ////Recent Viewd Array max length...
            {

                recentViewedProperty.shift();   ////  if Recent Viewd Array max length exceeded then remove oldest value....

                recentViewedProperty.push(property);     ////  Push New Value.......
            }
            else {

                recentViewedProperty.push(property);  ////  Push New Value.......
            }

        }
        localStorageService.set('recentViewedProperty', recentViewedProperty);
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        localStorageService.set('PropertyId', propertyId);
        $state.go('app.singleproperty');
    }

    $scope.addToFavority = function (propery) {
        favorities = localStorageService.get('favorities');
        if (favorities == null) {
            favorities = [{}];
            if (favorities[0].name == undefined) {
                favorities.splice(0, 1);
            }
        }
        var property_id = propery.productid;
        $('#' + property_id).toggleClass('ion-android-star-outline').toggleClass('ion-android-star');
        var flg = true;
        if (favorities != null) {
            for (var d = 0; d < favorities.length; d++) {
                if (propery.productid == favorities[d].productid) {
                    flg = false;
                    favorities.splice(d, 1);
                    break;
                }
            }

        }

        if (flg == true) {
            favorities.push(propery);
        }
        localStorageService.set('favorities', favorities);
    }
    ionicMaterialInk.displayEffect();
})

.controller('recentviewedCtrl', function ($scope, $http, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, $state, localStorageService, $ionicLoading) {
    $(document).ready(function () { setTimeout(function () { $(".has-header").css("top", $("ion-header-bar").height()); var as = $("ion-side-menu-content").children()[0]; $(as).css("display", "block"); }, 300) })
    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab('right');

    $timeout(function () {
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    }, 200);

    $scope.RecentViewData = localStorageService.get('recentViewedProperty');
    if ($scope.RecentViewData != null) {
        for (var i = 0; i < $scope.RecentViewData.length; i++) {
            if ($scope.RecentViewData[i].productid == undefined) {
                $scope.RecentViewData.splice(i, 1);
            }
        }
    }

    $ionicLoading.hide();

    var recentViewedProperty = [];

    $scope.GoToSingleProperty = function (property, propertyId) {
        recentViewedProperty = localStorageService.get('recentViewedProperty');
        var Visitflg = true;    ////Flag to check record already exist or not....!!!!
        for (var d = 0; d < recentViewedProperty.length; d++) {

            if (property.productid == recentViewedProperty[d].productid) {
                Visitflg = false;    ////if  already exist then set False....!!!!
            }
        }
        if (Visitflg == true)    ////if  True....!!!!
        {
            if (recentViewedProperty.length >= 10)   ////Recent Viewd Array max length...
            {
                recentViewedProperty.shift();   ////  if Recent Viewd Array max length exceeded then remove oldest value....
                recentViewedProperty.push(property);     ////  Push New Value.......
            }
            else {
                recentViewedProperty.push(property);  ////  Push New Value.......
            }
        }
        localStorageService.set('recentViewedProperty', recentViewedProperty);

        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        localStorageService.set('PropertyId', propertyId);
        $state.go('app.singleproperty');
    }

    ionicMaterialInk.displayEffect();

})

.controller('publishpropertyCtrl', function ($scope, $http, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, $state, localStorageService, $ionicPopup, $ionicModal, $ionicLoading) {
    $(document).ready(function () { setTimeout(function () { $(".has-header").css("top", $("ion-header-bar").height()); var as = $("ion-side-menu-content").children()[0]; $(as).css("display", "block"); }, 300) })
    var email = sessionStorage.getItem('emailLogin');

    //for remember me
    if (email == null) {
        email = localStorage.getItem('emailLogin');
    }
    if (email == "" || email == null || email == undefined) {
        $scope.showAlert("Inicie sesion primero para publicar la propiedad");
        return false;
    }

    var a = ""; var value = "";

    var PropertyImages = [];
    var imageName = "";
    $(".a").click(function () {
        debugger;
        a = $(this)[0].childNodes[0].attributes.id.nodeValue;
        value = $(this)[0].attributes.value.nodeValue;

       

        $("#inp").click();
    })

    function readFile() {
        
        if (this.files && this.files[0]) {
            setTimeout(function () {

            }, 500)
            if (this.files[0].size > 2500000)
            {
                alert("El archivo es demasiado grande");
                return false;
            }
            var FR = new FileReader();
            
            
            FR.readAsDataURL(this.files[0]);
            imageName = "";
            imageName = this.files[0].name;
            
            FR.onload = function (e) {
                $("#" + a).attr("src", e.target.result);
                PropertyImages[value] = e.target.result + "(" + imageName;
            };
        }
    }
    
    document.getElementById("inp").addEventListener("change", readFile);

    $(".reset").click(function () {
        $(this).closest('.form').find("input[type=text],input[type=number], textarea").val("");
        $(this).closest('.form').find(".col-20.a img").attr("src", " ");
        $(this).closest('.form').find("select").val($("option:first").val());
        $(this).closest('.form').find("input[type=radio]").val($("last:checked").val());
        $('input[name$="Piscina"]:last')[0].checked = true;
        $('input[name$="Vista-mar"]:last')[0].checked = true;
        $('input[name$="Parquin-incluido"]:last')[0].checked = true;
        $('input[name$="OPERACION"]:first')[0].checked = true;
        PropertyImages = [];
    });

    $("#Publicar").click(function () {
        var Email = email;
        var Operaction = $('input[name=OPERACION]:checked').val();
        var Piscina = $('input[name=Piscina]:checked').val();
        var Vista_mar = $('input[name=Vista-mar]:checked').val();
        var Con_parking = $('input[name=Parquin-incluido]:checked').val();

        var tipo_inmueble = $('.elige_tipo_de_inmueble').find(":selected").val();
        var Habitaciones = $('.Habitaciones').find(":selected").val();
        var Banos = $('.Banos').find(":selected").val();
        var Estado = $('.Estado').find(":selected").val();
        var Antiguedad = $('.Antiguedad').find(":selected").val();
        var data = sessionStorage.getItem('userData');
        if (data == null) {
            data = localStorage.getItem('userData');
        }
        var json = JSON.parse(data);
        var guidContact = ""; var firstName = ""; var lastName = "";
        if (json != null) {
            guidContact = json["contactGuid"];
            firstName = json["firstname"];
            lastName = json["lastname"];
        }
        if (guidContact == "") {
            guidContact = localStorage.getItem('contactGuid');
        }

        var PropertyName = $(".Property-Name").val();
        var PropertyTitle = $(".Property-title").val();
        if (PropertyTitle == "" || PropertyTitle == undefined) {
            $scope.showAlert("Titulo");
            return false;
        }
        
        var M2 = $(".M2").val();
        if (M2 == "" || M2 == undefined) {
            $scope.showAlert("M2");
            return false;
        }
        var Price = $(".Price").val();
        if (Price.indexOf('.') !== -1) {
            Price = Price.replace('.', '');
        }
        if (Price.indexOf(',') !== -1) {
            Price = Price.replace(',', '');
        }
        if (Price.indexOf('€') !== -1) {
            Price = Price.replace('€', '');
        }
        if (Price == "" || Price == undefined) {
            $scope.showAlert("Precio de venta Euro");
            return false;
        }
        var Calle1 = $(".Calle1").val();
        if (Calle1 == "" || Calle1 == undefined) {
            $scope.showAlert("Calle y numero 1");
            return false;
        }
        var Calle2 = $(".Calle2").val();
        var Localidad = $(".Localidad").val();
        if (Localidad == "" || Localidad == undefined) {
            $scope.showAlert("Localidad");
            return false;
        }
        var Provincia = $(".Provincia").val();
        if (Provincia == "" || Provincia == undefined) {
            $scope.showAlert("Provincia");
            return false;
        }
        var Postal = $(".Postal")[0].value;
        if (Postal == "" || Postal == undefined) {
            $scope.showAlert("Codlgo postal");
            return false;
        }
        var PropertyDetail = {
            "Email": Email,
            "PropertyTitle": PropertyTitle,
            "PropertyName": PropertyName,
            "firstname": firstName,
            "lastName": lastName,
            "contactGuid":guidContact,
            "Operaction": Operaction,
            "tipo_inmueble": tipo_inmueble,
            "Habitaciones": Habitaciones,
            "Banos": Banos,
            "M2": M2,
            "Estado": Estado,
            "Antiguedad": Antiguedad,
            "Piscina": Piscina,
            "Vista_mar": Vista_mar,
            "Con_parking": Con_parking,
            "Price": Price,
            "Calle1": Calle1,
            "Calle2": Calle2,
            "Localidad": Localidad,
            "Provincia": Provincia,
            "Postal": Postal,
            "img": null
        }
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        $("#Publicar").attr("disabled", true);
        var jqxhr = $.post(serviceBase + "api/PublishProperty?PropertyDetail", PropertyDetail, function () {
            var array = [];
            for (var i = 0; i < PropertyImages.length; i++) {
                var PropertyImage = {
                    "leadid": jqxhr.responseJSON,
                    "img": PropertyImages[i]
                }
                var uploadPropertyImage = $.post(serviceBase + "api/PublishProperty/PropertyImage?PropertyImages", PropertyImage)
                .then(function (resource) {              
                },function(error) {
                    alert(error.responseJSON);        
                }); 
            }
            $ionicLoading.hide();
            $("#Publicar").attr("disabled", false);
            $scope.openModal();
            $(".reset").click();
            $(".cancel").click(function () {
                $state.go("app.Entrance");
            })
        }).fail(function (error) {
            $ionicLoading.hide();
            $("#Publicar").attr("disabled", false);
            if (error.responseJSON == "El tamano del archivo adjunto es demasiado grande.") {
                $scope.ErrorAlert("Su propiedad esta publicada !!! Pero no puede cargar imagenes porque el tamano de archivo adjunto es demasiado grande. Por favor, utilice imagenes de pequeno tamano");
            }
            else {
                $scope.ErrorAlert("Error al cargar la propiedad.");
            }
        })
    })

    $scope.showAlert = function (field) {
        var alertPopup = $ionicPopup.alert({
            title: 'Campo requerido!',
            template: 'Introduzca un valor en ' + field//Enter the value of "field name"
        });
        alertPopup.then(function (res) {

        });
    };
    $scope.ErrorAlert = function (Message) {
        var alertPopup = $ionicPopup.alert({
            title: 'Error!',
            template: Message
        });
    };
    $ionicModal.fromTemplateUrl('my-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function () {
        $scope.modal.show();
    };
    $scope.closeModal = function () {
        $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
        // Execute action
    });


    ////Price field validation

    Array.prototype.indexOf = Array.prototype.indexOf || function (searchElement) {
        "use strict";
        if (this == null) {
            throw new TypeError();
        }
        var t = Object(this);
        var len = t.length >>> 0;
        if (len === 0) {
            return -1;
        }
        var n = 0;
        if (arguments.length > 1) {
            n = Number(arguments[1]);
            if (n != n) { // shortcut for verifying if it's NaN
                n = 0;
            } else if (n != 0 && n != Infinity && n != -Infinity) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
        }
        if (n >= len) {
            return -1;
        }
        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
        for (; k < len; k++) {
            if (k in t && t[k] === searchElement) {
                return k;
            }
        }
        return -1;
    }

    document.querySelector('.Price').onkeypress = validate;

    function validate(e) {
        e = e || event;
        return /[0-9]/i.test(String.fromCharCode(e.charCode || e.keyCode))
                || !!(!e.charCode && ~[8, 37, 39, 46].indexOf(e.keyCode));
    }



})

.controller('AdminCtrl', function ($scope, $http, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, $state, localStorageService, $ionicPopup, $ionicModal) {
    $(document).ready(function () { setTimeout(function () { $(".has-header").css("top", $("ion-header-bar").height()); var as = $("ion-side-menu-content").children()[0]; $(as).css("display", "block"); }, 300) })
    $(document).ready(function () {
        document.addEventListener("deviceready", onDeviceReady, false);
        $(".trigger").click(function () {
            $(".menu").toggleClass("active");
        });
        setTimeout(function () {
            $(".trigger").click();
            //$('#contact1').insertAfter('.icons')
            //$('#contact1').removeClass('hide');
        }, 1000)
    });
    $scope.myRequests = function () {
        $state.go("app.myRequests");
    }
    $scope.showAlert = function (message) {
        var alertPopup = $ionicPopup.alert({
            title: 'Mensaje',
            template: message
        });
        alertPopup.then(function (res) {
            if(res == true)
            $state.go("app.login");
        });
    };

    $scope.myRequests = function () {
        var email = sessionStorage.getItem('emailLogin');

        if (email == null) {
            email = localStorage.getItem('emailLogin');
            
        }
        if (email == "" || email == null || email == undefined) {
            $scope.showAlert("Inicia sesion para ver tus peticiones");//Log in first to view your requests
            return false;
        } else {
            $state.go("app.myRequests");
        }
    }

    $scope.editProfile = function () {
        localStorage.setItem('profile', 'edit');
        var email = sessionStorage.getItem('emailLogin');

        if (email == null) {
            email = localStorage.getItem('emailLogin');
        }
        if (email == "" || email == null || email == undefined) {
            $scope.showAlert("Inicia sesion para editar tu perfil");//Log in first to edit your profile
            return false;
        } else {
            $state.go("app.userProfile");
        }

    }

    $scope.MyPublished = function () {
        var email = sessionStorage.getItem('emailLogin');

        if (email == null) {
            email = localStorage.getItem('emailLogin');
           
        }
        if (email == "" || email == null || email == undefined) {
            $scope.showAlert("Inicia sesion  para ver tus publicaciones");//Log in first to view your property publish
            return false;
        } else {
            $state.go("app.MyPublished");
        }
    }
    
    $scope.logout = function () {
        localStorage.removeItem('userData');
        localStorage.removeItem('emailLogin');
        localStorage.removeItem('contactImage', results.contactImage);
        localStorage.removeItem('contactGuid', results.contactGuid);
        sessionStorage.clear();
        $state.go("app.login");
    };
})

.controller('MyPublishedCtrl', function ($scope, $http, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, $state, localStorageService, $ionicPopup, $ionicModal, $ionicLoading) {
    $(document).ready(function () { setTimeout(function () { $(".has-header").css("top", $("ion-header-bar").height()); var as = $("ion-side-menu-content").children()[0]; $(as).css("display", "block"); }, 300) })
    var email = sessionStorage.getItem('emailLogin');

    if (email == null) {
        email = localStorage.getItem('emailLogin');
    }
    if (email == "" || email == null || email == undefined) {
        $scope.showAlert("Inicie sesion primero para ver su propiedad publicar");
        return false;
    }
    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    $http.get(serviceBase + "api/GetPublishedProperties?email=" + email).success(function (results) {
        
        $scope.publishedProperties = results;
        $ionicLoading.hide();
    }).error(function (err) {
        $ionicLoading.hide();
        alert("Ha surgido un error");//Something went wrong
    });

    $scope.myFunc = function (guids) {
        $scope.showConfirm(guids);
    };

    $scope.showAlert = function (message) {
        var alertPopup = $ionicPopup.alert({
            title: 'Mensaje',
            template: message
        });
        alertPopup.then(function (res) {

        });
    };
    $scope.showConfirm = function (guids) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Estas seguro?',
            template: 'Estas seguro de que quieres eliminar este producto?'
        });
        confirmPopup.then(function (res) {
            if (res) {
                $ionicLoading.show({
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });

                var PropertyGuid = $(this).val();
                $http.get(serviceBase + "api/DeletePublishedProperty?propertyGuid=" + guids).success(function (results) {
                    $scope.showAlert('El inmueble ha sido eliminado');//The product has been removed from your phone.
                    $("div#" + guids).hide();
                    $ionicLoading.hide();
                }).error(function (err) {
                    $ionicLoading.hide();
                    $scope.showAlert('No se puede eliminar el inmueble. Vuelve a intentarlo mas tarde.');//The product can not be deleted. Try again later.
                });
            } else {

            }
        });
    };
})

.controller('EntranceCtrl', function ($scope, $state, $ionicHistory, localStorageService) {
    $(document).ready(function () { setTimeout(function () { $(".has-header").css("top", $("ion-header-bar").height()); var as = $("ion-side-menu-content").children()[0]; $(as).css("display", "block"); }, 300) })
    $scope.contactImage = sessionStorage.getItem('contactImage');
    if ($scope.contactImage == null) {
        $scope.contactImage = localStorage.getItem('contactImage');
    }
    var emailss = sessionStorage.getItem('emailLogin');
    if (emailss == null) {
        emailss = localStorage.getItem('emailLogin');
    }
    if (emailss == "" || emailss == null || emailss == undefined) {
       
        $("#CREAR-CUENTA").show();
        $("#DESCONECTAR").hide();
        $("#CONECTAR").show();
        $("#CONECTADO").hide();
        
    }
    else {
        
        $("#DESCONECTAR").show();
        $("#CREAR-CUENTA").hide();
        $("#CONECTAR").hide();
        $("#CONECTADO").show();
    }

    $scope.propertyType = function (propertyType) {
        localStorageService.set('propertyType', propertyType);
        $state.go("app.filter");
    }

    //click of PUBLICA TU INMUEBLE
    $scope.publishProperty = function () {
        var email = sessionStorage.getItem('emailLogin');
        if (email == null) {
            email = localStorage.getItem('emailLogin');
        }
        if (email == "" || email == null || email == undefined) {
            $scope.showAlert("Inicia sesion para publicar una propiedad");//Login first to publish the property
            return false;
        } else {
            $state.go("app.publishproperty");
        }

    }

    $scope.checkLoginStatus = function () {
        var email = sessionStorage.getItem('emailLogin');

        if (email == null) {
            email = localStorage.getItem('emailLogin');
        }
        if (email == "" || email == null || email == undefined) {
            $(".login-menu").show();
            //$(".logout-menu").hide();
        } else {
            //$(".logout-menu").show();
            $(".login-menu").hide();
        }
    }


    $scope.checkLoginStatus1 = function () {
        var email = sessionStorage.getItem('emailLogin');

        if (email == null) {
            email = localStorage.getItem('emailLogin');
        }
        if (email == "" || email == null || email == undefined) {
            $(".login-menu").show();
            $(".logout-menu").hide();
        } else {
            $(".logout-menu").show();
            $(".login-menu").hide();
        }
    }
    $scope.checkLoginStatus1();

    $scope.checkLoginStatus();

    $scope.connect = function () {
        $state.go("app.login");
    }

    $scope.recentview = function () {
        $state.go("app.recentviewed");
    }

    $scope.favorited = function () {
        $state.go("app.favorateproperty");
    }

    $scope.register = function () {
        var email = sessionStorage.getItem('emailLogin');
        if (email == null) {
            email = localStorage.getItem('emailLogin');
        }
        if (email == "" || email == null || email == undefined) {
            $state.go("app.register");
        } else {
            $scope.showAlert("Ya esta registrado");//Already registered
        }

    }

    $scope.logout = function () {
        $ionicHistory.clearHistory();
        $ionicHistory.clearCache();
        localStorage.removeItem('userData');
        localStorage.removeItem('emailLogin');
        localStorage.removeItem('contactGuid');
        localStorage.removeItem('contactImage');
        localStorageService.set('minPrice',null);
        localStorageService.set('maxPrice',null);
        sessionStorage.removeItem('userData');
        sessionStorage.removeItem('emailLogin');
        sessionStorage.removeItem('contactGuid');
        sessionStorage.removeItem('contactImage');

        $state.go("app.login");
    };

    $scope.HomeFavorateData = localStorageService.get('favorities');
    $scope.HomeRecentViewData = localStorageService.get('recentViewedProperty');

    $scope.admin = function () {
        $state.go("app.Admin");
    }

    $scope.connect = function () {
        var email = sessionStorage.getItem('emailLogin');
        if (email == null) {
            email = localStorage.getItem('emailLogin');
        }
        if (email == "" || email == null || email == undefined) {
            $state.go("app.login");
        } else {
            $scope.showAlert("Ya esta conectado");//Already connected
        }
    }
})

.controller('myRequestsCtrl', function ($scope, $http, $state, localStorageService, $ionicPopup, $ionicLoading) {
    $(document).ready(function () { setTimeout(function () { $(".has-header").css("top", $("ion-header-bar").height()); var as = $("ion-side-menu-content").children()[0]; $(as).css("display", "block"); }, 300) })
    var data = sessionStorage.getItem('userData');
    if (data == null) {
        data = localStorage.getItem('userData');
    }

    var guidContact = "";
    var json = JSON.parse(data);
    if (json != null) {
        var guidContact = json["contactGuid"];
    }
    
   
    if (guidContact == "") {
        guidContact = localStorageService.get('contactGuid');
    }
    var ContactGuid = guidContact;
    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });


    $http.get(serviceBase + "api/myrequests?ContactGuid=" + ContactGuid).success(function (results) {
        $scope.myrequests = results;
        $ionicLoading.hide();
    }).error(function (err) {
        $ionicLoading.hide();
        $scope.showAlert("Ha surgido un error");//Something went wrong
    });
    $scope.GoToSingleProperty = function (propertyId) {
        localStorage.setItem('page', "myrequests");
        localStorageService.set('PropertyId', propertyId);
        $state.go('app.singleproperty');
    }
    //delete scheduled call
    $scope.deletescheduledcall = function (activityid) {
        $http.post(serviceBase + "api/deletephonecall?activityId=" + activityid).success(function (results) {
            $("#" + activityid).hide();
            $scope.showAlert("Borrado exitosamente");
        }).error(function (err) {
            $scope.showAlert("No se puede eliminar");
            $ionicLoading.hide();
            $scope.showAlert("Ha surgido un error");//Something went wrong
        });
    }

    $scope.showAlert = function (message) {
        var alertPopup = $ionicPopup.alert({
            title: 'Mensaje',
            template: message
        });
        alertPopup.then(function (res) {

        });
    };
})

.controller('registerCtrl', function ($scope, $http, $state, localStorageService, $ionicPopup, $ionicLoading) {
    $scope.show = true;

    $scope.Mostar = function () {
        $scope.show = true;
        $("#passwordReg").attr("type", "password");
    };
    $scope.Ocultar = function () {
        $scope.show = false;
        $("#passwordReg").attr("type", "text");
    };
    $(document).ready(function ()
    {
        setTimeout(function ()
        {
            $(".has-header").css("top", $("ion-header-bar").height());
            var as = $("ion-side-menu-content").children()[0]; $(as).css("display", "block");
        }, 300)

        var readURL = function (input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $('.profile-pic').attr('src', e.target.result);
                    var image6 = e.target.result;
                    image6 = image6.split(",");
                    image64 = image6[1];
                }
                reader.readAsDataURL(input.files[0]);
            }
        }

        $(".file-upload").on('change', function () {
            readURL(this);
        });

        $(".profile-pic").on('click', function () {
            $(".file-upload").click();
        });
    })  

    var image64 = "";
    $("#registerCustomer").click(function () {
        debugger;
        var email = sessionStorage.getItem('emailLogin');
        if (email == null) {
            email = localStorage.getItem('emailLogin');
        }
        if (email == "" || email == null || email == undefined) {
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });

            var email = $("#emailReg").val();
            if (email == "" || email == undefined) {
                $scope.showAlert("Introducir email");//Please enter the email address
                return false;
            }

            var fname = $("#fnameReg").val();
            if (fname == "" || fname == undefined) {
                $scope.showAlert("Introducir nombre");//Please write your name

                return false;
            }

            var lname = $("#lnameReg").val();
            if (lname == "" || lname == undefined) {
                $scope.showAlert("Introducir el apellido");//Please enter the surname

                return false;
            }

            var mobile = $("#mobileReg").val();
            if (mobile == "" || mobile == undefined) {
                $scope.showAlert("Introducir numero de telefono movil");//Enter the mobile phone number

                return false;
            }

            var password = $("#passwordReg").val();
            if (password == "" || password == undefined) {
                $scope.showAlert("Introducir contrasena");//Please enter the password

                return false;
            }
            var registration = {
                "email": email,
                "fname": fname,
                "lname": lname,
                "mobile": mobile,
                "password": password,
                "image64": image64
            }
            var results = $.post(serviceBase + "api/register?registration=", registration, function () {

                $scope.registration = results;
                $scope.showAlert("Bienvenida " + fname);
                $ionicLoading.hide();
                localStorage.setItem('emailLogin', email);
                localStorage.setItem('contactGuid', results.responseJSON);

                sessionStorage.setItem('contactImage', image64);

                $state.go("app.Entrance");
            }).fail(function (error) {
                $ionicLoading.hide();
                if (error.responseJSON == "Exist") {
                    $scope.showAlert("Email ya existe");//Email already exists

                } else {
                    $scope.showAlert("Ha surgido un problema al crear el contacto");//There is a problem in creating contact
                }
            })
        } else {
            $scope.showAlert("Ya esta registrado");//Already registered
        }

    })

    //$(document).ready(function () {
    //var readURL = function (input) {
    //    if (input.files && input.files[0]) {
    //        var reader = new FileReader();
    //        reader.onload = function (e) {
    //            $('.profile-pic').attr('src', e.target.result);
    //            var image6 = e.target.result;
    //            image6 = image6.split(",");
    //            image64 = image6[1];
    //        }
    //        reader.readAsDataURL(input.files[0]);
    //    }
    //}

    //$(".file-upload").on('change', function () {
    //    readURL(this);
    //});

    //$(".profile-pic").on('click', function () {
    //    $(".file-upload").click();
    //});
    //});

    $scope.showAlert = function (message) {
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
            title: 'Mensaje',
            template: message
        });
        alertPopup.then(function (res) {

        });
    };
})

.controller('userProfileCtrl', function ($scope, $http, $state, localStorageService, $ionicPopup, $ionicLoading) {
    $(document).ready(function () { setTimeout(function () { $(".has-header").css("top", $("ion-header-bar").height()); var as = $("ion-side-menu-content").children()[0]; $(as).css("display", "block"); }, 300) })
    var action = localStorage.getItem('profile');
    if (action == "view") {
        $(".profile-view").show();
        $(".edit-profile").hide();
    } else {
        $(".profile-view").hide();
        $(".edit-profile").show();
    }
    $scope.showAlert = function (message) {
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
            title: 'Mensaje',
            template: message
        });
        alertPopup.then(function (res) {

        });
    };
    ////get contacts
    var email = sessionStorage.getItem('emailLogin');

    //for remember me
    if (email == null) {
        email = localStorage.getItem('emailLogin');
    }
    if (email == "" || email == null || email == undefined) {
        $scope.showAlert("Inicie sesion para ver o editar el perfil");//Log in first to view or edit profile
        return false;
    }

    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    $http.get(serviceBase + "api/getContact?email=" + email).success(function (results) {
        $scope.contactDetail = results;
        $ionicLoading.hide();
        $("#emailProfileView").text(email);
        $("#emailReg").val(email);
        $(".emailReg").text(email);
        $("#mobileReg").val(results.phoneNumber); $("#mobileReg2").val(results.phoneNumber2); $("#passwordReg").val(results.password);
        $("#methodToContact").val(results.preferredcontactmethod);
        setTimeout(function () {
            readyToupload();
        }, 500)

    }).error(function (err) {
        $ionicLoading.hide();
        $scope.showAlert("Ha surgido un error");//Something went wrong
    });
    ////


    var image64 = "";
    var readURL = function (input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('.profile-pic').attr('src', e.target.result);
                var image6 = e.target.result;
                image6 = image6.split(",");
                image64 = image6[1];
            }
            reader.readAsDataURL(input.files[0]);
        }
    }

    $(".file-upload").on('change', function () {
        readURL(this);
    });
    function readyToupload() {
        $("#profile-pic").on('click', function () {
            $(".file-upload").click();
        });
    };
    $("#show").click(function () {
        $("#show").hide();
        $("#hide").show();
        $("#passwordReg").attr("type", "text");
    })
    $("#hide").click(function () {
        $("#hide").hide();
        $("#show").show();
        $("#passwordReg").attr("type", "password");
    })

    $("#updateCustomer").click(function () {
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        var email = $("#emailReg").val();
        if (email == "" || email == undefined) {
            $scope.showAlert("Introduzca un email");//Please enter the email address
            return false;
        }

        var fname = $("#fnameReg").val();
        if (fname == "" || fname == undefined) {
            $scope.showAlert("Introduzca su nombre");//Please write your name
            return false;
        }

        var lname = $("#lnameReg").val();
        if (lname == "" || lname == undefined) {
            $scope.showAlert("Introduzca su apellido");//Please enter the surname
            return false;
        }

        var mobile = $("#mobileReg").val();
        if (mobile == "" || mobile == undefined) {
            $scope.showAlert("Introduzca su numero de movil");//Enter the mobile phone number
            return false;
        }
        var mobile2 = $("#mobileReg2").val();
        var methodToContact = $("#methodToContact").val();

        var password = $("#passwordReg").val();
        if (password == "" || password == undefined) {
            $scope.showAlert("Introduzca una contrasena");//Please enter the password
            return false;
        }
       
        var contactGuid = $(".contactGuid").text();
        //if (contactGuid == "") {
        //    contactGuid = localStorageService.get('guidContact');
        //}
        if (contactGuid == "" || contactGuid == null || contactGuid == undefined) {
            var data = sessionStorage.getItem('userData');
            if (data == null) {
                data = localStorage.getItem('userData');
            }
            var json = JSON.parse(data);
            var guidContact = json["contactGuid"];

            contactGuid = guidContact;
        }

        var update = {
            "contactGuid": contactGuid,
            "email": email,
            "fname": fname,
            "lname": lname,
            "mobile": mobile,
            "mobile2": mobile2,
            "password": password,
            "image64": image64,
            "preferredcontactmethod": methodToContact,

        }
        var results = $.post(serviceBase + "api/updateContact?update=", update, function () {
            if (image64 != "")
                sessionStorage.setItem('contactImage', image64);
            ////////////////////////////////////////////////
            var emailss = localStorage.getItem('emailLogin');
            if (emailss != null) {
                localStorage.setItem('contactImage', image64);
            }
            
            $scope.showAlert("Contacto actualizado correctamente.");//Contact Updated Correctly
            sessionStorage.setItem('userData', JSON.stringify(update));
            var userdat = localStorage.getItem('userData');
            if (userdat != null) {
                localStorage.setItem('userData', JSON.stringify(update));
            }
            $ionicLoading.hide();
        }).fail(function (error) {
            $ionicLoading.hide();
            $scope.showAlert("Hay un problema al actualizar el contacto. Intentelo de nuevo mas tarde.");//There is a problem updating the contact
        })
    })

})

.controller('matchingPropertyCtrl', function ($scope, $http, $state, localStorageService, $ionicPopup, $ionicLoading) {
    $(document).ready(function () { setTimeout(function () { $(".has-header").css("top", $("ion-header-bar").height()); var as = $("ion-side-menu-content").children()[0]; $(as).css("display", "block"); }, 300) })
    $scope.valueOfBathroomsAndRooms = function (bath) {
        var value = "";
        switch (bath) {
            case "212150010":
                value = "0";
                break;
            case "212150000":
                value = "1";
                break;
            case "212150001":
                value = "2";
                break;
            case "212150002":
                value = "3";
                break;
            case "212150003":
                value = "4";
                break;
            case "212150004":
                value = "5";
                break;
            case "212150005":
                value = "6";
                break;
            case "212150006":
                value = "7";
                break;
            case "212150007":
                value = "8";
                break;
            case "212150008":
                value = "9";
                break;
            case "212150009":
                value = "10";
                break;
        }
        return value;
    }
    $scope.PropertyType = function (PropertyType) {
        var value1 = "";
        switch (PropertyType) {
            case "212150001":
                value1 = "Venta";
                break;
            case "212150002":
                value1 = "Alquiler";
                break;
        }
        return value1;
    }
    $scope.getProperties = function () {
        var adata = {
            "minPrice": minPrice,
            "maxPrice": maxPrice,
            "NumberOfRooms": NumberOfRooms,
            "NumberOfBathrooms": NumberOfBathrooms,
            "Piscina": Piscina,
            "VistaMar": VistaMar,
            "PropertyType": PropertyType
        };

        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        $http.post(serviceBase + "api/Filter", adata).then(function (res) {
            $ionicLoading.hide();
            $scope.Matchedproperties = [];
            $scope.Matchedproperties = res.data;
            $ionicLoading.hide();
            localStorageService.set('MatchedResult', res.data);
        }, function (error) {
            $ionicLoading.hide();
            alert("Ha surgido un error");//Something went wrong
        });
    }

    $scope.ismatched = localStorageService.get('isMatchedCriteria');
    var minPrice = ""; var maxPrice = ""; var NumberOfBathrooms = ""; var NumberOfRooms = ""; var PropertyType = ""; var Piscina = ""; var VistaMar = "";
    if ($scope.ismatched == true) {
        Piscina = localStorageService.get('Piscina');
        VistaMar = localStorageService.get('VistaMar');
        $scope.minPrice = minPrice = localStorageService.get('Match-minPrice');
        $scope.maxPrice = maxPrice = localStorageService.get('Match-maxPrice');
        NumberOfBathrooms = localStorageService.get('Match-NumberOfBathrooms');
        NumberOfRooms = localStorageService.get('Match-NumberOfRooms');
        PropertyType = localStorageService.get('Match-propertyType');

        $scope.NumberOfBathrooms = $scope.valueOfBathroomsAndRooms(NumberOfBathrooms);
        $scope.NumberOfRooms = $scope.valueOfBathroomsAndRooms(NumberOfRooms);
        $scope.PropertyType = $scope.PropertyType(PropertyType);
        if (Piscina == true) {
            $scope.Piscina = "Si";
        } else {
            $scope.Piscina = "No";
        }
        if (VistaMar == true) {
            $scope.VistaMar = "Si";
        } else {
            $scope.VistaMar = "No";
        }
        $scope.getProperties();
    }
    $scope.delete = function () {
        $scope.showConfirm();
    }
    var recentViewedProperty = [{}];
    if (recentViewedProperty[0].name == undefined) {
        recentViewedProperty.splice(0, 1);
    }
    $scope.GoToSingleProperty = function (property, propertyId) {
        localStorageService.set('PropertyId', propertyId);
        recentViewedProperty = localStorageService.get('recentViewedProperty');
        if (recentViewedProperty == null) {
            recentViewedProperty = [{}];
            if (recentViewedProperty[0].name == undefined) {
                recentViewedProperty.splice(0, 1);
            }
        }
        var Visitflg = true;    ////Flag to check record already exist or not....!!!!
        for (var d = 0; d < recentViewedProperty.length; d++) {
            if (property.productid == recentViewedProperty[d].productid) {
                Visitflg = false;    ////if  already exist then set False....!!!!
            }
        }
        if (Visitflg == true)    ////if  True....!!!!
        {
            if (recentViewedProperty.length >= 5)   ////Recent Viewd Array max length...
            {
                recentViewedProperty.shift();   ////  if Recent Viewd Array max length exceeded then remove oldest value....
                recentViewedProperty.push(property);     ////  Push New Value.......
            }
            else {
                recentViewedProperty.push(property);  ////  Push New Value.......
            }
        }
        localStorageService.set('recentViewedProperty', recentViewedProperty);
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        $state.go('app.singleproperty');
    }


    $scope.showConfirm = function () {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Borrar',
            template: 'Esta seguro de que desea eliminar los datos guardados?'//Are you sure you want to delete the saved data?
        });

        confirmPopup.then(function (res) {
            if (res) {
                localStorageService.remove('isMatchedCriteria');
                localStorageService.remove('Piscina');
                localStorageService.remove('VistaMar');
                localStorageService.remove('Match-minPrice');
                localStorageService.remove('Match-maxPrice');
                localStorageService.remove('Match-NumberOfBathrooms');
                localStorageService.remove('Match-NumberOfRooms');
                localStorageService.remove('Match-propertyType');
                $(".savedCriteria").hide();
                $(".my-class").hide();//my-class
                $(".properties").hide();
                $('<div class="card"><div class="item item-text-wrap">No hay criterios guardados</div></div>').appendTo('#matchingProperty .scroll');
            } else {

            }
        });
    };
});