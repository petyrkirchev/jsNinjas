var gameModule = angular.module('gameModule', ["questionService"])
gameModule.controller('gameController', function ($scope, $rootScope, LoadQuestions) {

    var answers = [];
    $('canvas').hide();
    $('#question').hide();
    $('#btmBar').hide();
    $('#gameOver').hide();
    var index = 0;
    //user health
    var userPoints = 10;
    //enemy health
    var enemyPoints = 10;
    var damage;

    LoadQuestions.load().then(function (response) {
        //TODO do shuffle here on resposen.data array
        //TODO check response data with log
        // tykkkkkkk!!!!!!!mersi leka

        questions = response.data;
    })

    //subscribe for event game:easy
    $scope.$on('game:easy', function (event, args) {
        console.log("easy");
        damage = 1;
        init();
        event.preventDefault();
    });

    //subscribe for event game:normal
    $scope.$on('game:normal', function (event, args) {
        console.log("normal");
        damage = 2;
        init();
        event.preventDefault();
    });

    //subscribe for event game:hard
    $scope.$on('game:hard', function (event, args) {
        console.log("hard");
        damage = 5;
        init();
        event.preventDefault();
    });

    $scope.$on('timer:expire', function (event, args) {
        incorrectAnswer();
        nextQuestion();
    });

    function init() {
        nextQuestion();

        $('.ansBtns').on("click", function () {
            $rootScope.$broadcast('timer:stop', '');

            if ($(this).text() == questions[index-1].correctanswer) {
                // console.log($(this).text());
                // console.log(questions[index].correctanswer)
                correctAnswer();
            } else {
                incorrectAnswer();
            }

            nextQuestion();
        })

        $('canvas').show('slow');
        $('#btmBar').show('slow');
        idle(300, 'assets/sprites/Boy/Idle.png', false);
        idle(700, 'assets/sprites/Girl/IdleL.png', true);
        setTimeout(function () {
            $('#question').show('slow');
        }, 1500)
    };

    function correctAnswer() {

        $('#question').hide('slow');
        enemyPoints--;
        running(300, 1000, 'assets/sprites/Boy/run.png', false);
        unvisible = true;
        setTimeout(function () {
            attack(1000, 'assets/sprites/Boy/attack.png', false);
            falling(700, 'assets/sprites/Girl/fallingL.png', true);
        }, 870);
    }

    function incorrectAnswer() {

        $('#question').hide('slow');
        userPoints -= damage;
        running(700, 50, 'assets/sprites/Girl/runL.png', true);
        unvisible = true;
        setTimeout(function () {
            attack(50, 'assets/sprites/Girl/attackL.png', true);
            falling(300, 'assets/sprites/Boy/falling.png', false);
        }, 870);
    }

    function gameResult(win) {
        if (win) {
            $scope.gameResult = "you win";
        } else {
            $scope.gameResult = "you lost";
        }
    }

    function nextQuestion() {
        ctx.clearRect(0, 0, 1170, 460);
        setTimeout(function () {
            if (index < questions.length) {
                $scope.$apply(function () {
                    unvisible = false;
                    $scope.question = questions[index].question;
                    $scope.answer1 = questions[index].firstanswer;
                    $scope.answer2 = questions[index].secondanswer;
                    $scope.answer3 = questions[index].thirdanswer;

                    if (userPoints <= 0) {
                        $scope.hp = healthbar[0];
                    } else {
                        $scope.hp = healthbar[userPoints];
                    }

                    if (enemyPoints <= 0) {
                        $scope.hpL = healthbarL[0];
                    } else {
                        $scope.hpL = healthbarL[enemyPoints];
                    }


                    ctx.clearRect(0, 0, 1170, 460);
                    idle(300, 'assets/sprites/Boy/Idle.png', false);
                    idle(700, 'assets/sprites/Girl/IdleL.png', true);
                })

                if (userPoints <= 0) {
                    gameResult(false);
                }

                if (enemyPoints <= 0) {
                    gameResult(true);
                }

                if (userPoints > 0 && enemyPoints > 0) {
                    $('#question').show('slow');
                    $rootScope.$broadcast('timer:start', '');
                }
            }
            index++;
        }, 2500);
    }
});

gameModule.controller('timerController', function ($scope, $timeout, $rootScope) {
    $scope.clock = 'loading timer...';
    $scope.currentSecconds = 10000;
    $scope.oneSecond = 1000;
    var timer;

    $scope.tick = function () {
        $scope.clock = msToTimerSecondsConverter($scope.currentSecconds)

        if ($scope.currentSecconds > 0) {
            timer = $timeout($scope.tick, 1000);
        } else if ($scope.currentSecconds == 0) {
            $rootScope.$broadcast('timer:expire', '');
        }

    }

    $scope.$on('timer:stop', function (event, args) {
        $timeout.cancel(timer);
    });

    $scope.$on('timer:start', function (event, args) {
        $timeout.cancel(timer);
        $scope.currentSecconds = 10000;
        $scope.tick();
    });

    $scope.$on("$destroy", function handleDestroyEvent() {
        $timeout.cancel(timer);
    }
    );


    function msToTimerSecondsConverter(s) {
        var ms = s % 1000;
        s = (s - ms) / 1000;
        var secs = s % 60;
        //   s = (s - secs) / 60;
        //   var mins = s % 60;
        //   var hrs = (s - mins) / 60;

        $scope.currentSecconds -= 1000;
        // $("#clock").css("display","block");

        $("#btmBar").show('slow');
        $('#clock').show('fast');
        return $scope.clock = coundDownArray[secs - 1];
    }

})


var coundDownArray = ['assets/sprites/countDown/0.png', 'assets/sprites/countDown/1.png', 'assets/sprites/countDown/2.png', 'assets/sprites/countDown/3.png', 'assets/sprites/countDown/4.png', 'assets/sprites/countDown/5.png', 'assets/sprites/countDown/6.png', 'assets/sprites/countDown/7.png', 'assets/sprites/countDown/8.png', 'assets/sprites/countDown/9.png', 'assets/sprites/countDown/10.png',]
var healthbar = ['assets/sprites/hpbar/hpbar-0.png', 'assets/sprites/hpbar/hpbar-10.png', 'assets/sprites/hpbar/hpbar-20.png', 'assets/sprites/hpbar/hpbar-30.png', 'assets/sprites/hpbar/hpbar-40.png', 'assets/sprites/hpbar/hpbar-50.png', 'assets/sprites/hpbar/hpbar-60.png', 'assets/sprites/hpbar/hpbar-70.png', 'assets/sprites/hpbar/hpbar-80.png', 'assets/sprites/hpbar/hpbar-90.png', 'assets/sprites/hpbar/hpbar-100.png'];
var healthbarL = ['assets/sprites/hpbar/hpbar-0L.png', 'assets/sprites/hpbar/hpbar-10L.png', 'assets/sprites/hpbar/hpbar-20L.png', 'assets/sprites/hpbar/hpbar-30L.png', 'assets/sprites/hpbar/hpbar-40L.png', 'assets/sprites/hpbar/hpbar-50L.png', 'assets/sprites/hpbar/hpbar-60L.png', 'assets/sprites/hpbar/hpbar-70L.png', 'assets/sprites/hpbar/hpbar-80L.png', 'assets/sprites/hpbar/hpbar-90L.png', 'assets/sprites/hpbar/hpbar-100L.png'];
var roundEnds = ['You WIN!', 'You lose!'];

var questions;