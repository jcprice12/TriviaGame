function Question(timeLimit, question, choices, correctAnswer){
	var timeLimit = timeLimit;
	var question = question;
	var choices = choices;
	var correctAnswer = correctAnswer;

	this.getTimeLimit = function(){
		return timeLimit;
	}
	this.getQuestion = function(){
		return question;
	}
	this.getChoices = function(){
		return choices;
	}
	this.getCorrectAnswer = function(){
		return correctAnswer;
	}
}

var game = {
	questions: null,
	currentQuestion: null,
	currentQuestionIndex: null,
	questionTimer: null,
	score: null,
	timeBetweenRounds: 3000,
	inTransition: false,
	startGame: function(){
		this.questions = instantiateQuestions();
		this.inTransition = false;
		this.currentQuestion = this.questions[0];
		this.currentQuestionIndex = 0;
		this.questionTimer = null;
		this.score = 0;
		this.buildNextQuestion(this.currentQuestion);
		this.startTimer(this.currentQuestion.getTimeLimit());
	},
	startTimer: function(secondsRemaining){
		console.log(secondsRemaining);
		var timeContainer = $("#timeContainer");
		timeContainer.html(this.timeConverter(secondsRemaining));
		if(secondsRemaining > 0){
			this.questionTimer = setTimeout(function(){
				secondsRemaining --;
				game.startTimer(secondsRemaining);
			},1000);
		} else {
			this.buildNewScreen("You ran out of time!", "");
		}
	},
	compareAnswer: function(choiceIndex){
		clearTimeout(this.questionTimer);
		if(choiceIndex === this.currentQuestion.getCorrectAnswer()){
			this.score++;
			this.buildNewScreen("You are correct!", "");
		} else {
			this.buildNewScreen("You are incorrect!", "");
		}
	},
	executeCompletionState: function(){
		console.log("You completed the game.");
		console.log("Your score was " + game.score + " out of " + game.questions.length);
		$("#timeContainer").html("<p>You completed the game!</p>");
		$("#questionContainer").html("<p>Your score was " + game.score + " out of " + game.questions.length + "</p>");
		$("#questionContainer").css("text-align", "center");
		$("#questionContainer").css("margin-left", "0px");
		var playAgain = document.createElement("div");
		$(playAgain).html("Play Again");
		$(playAgain).addClass("playAgain");
		playAgain.addEventListener("click", function (){
			game.startGame();
		});
		$("#answerChoicesContainer").html("");
		$("#answerChoicesContainer").append($(playAgain));
	},
	buildNextQuestion: function(question){
		console.log("building new question...");
		var timeContainer = $("#timeContainer");
		timeContainer.html(question.getTimeLimit());
		timeContainer.css("text-align", "center");
		var questionContainer = $("#questionContainer");
		questionContainer.html(question.getQuestion());
		questionContainer.css("text-align", "left");
		questionContainer.css("margin-left", "0px");
		var answerChoicesContainer = $("#answerChoicesContainer");
		answerChoicesContainer.html("");
		for(i = 0; i < question.getChoices().length; i++){
			var choiceDiv = $("<div>");
			var answerChoiceBox = $("<div>");
			answerChoiceBox.addClass("answerChoiceBox");
			choiceDiv.addClass("answerChoiceContainer");
			choiceDiv.attr("data-choice-index",i.toString());
			choiceDiv.html(question.getChoices()[i]);
			answerChoiceBox.append(choiceDiv);
			answerChoicesContainer.append(answerChoiceBox);
		}

	},
	timeConverter: function(t) {//this looks familiar :D
	    //  Takes the current time in seconds and convert it to minutes and seconds (mm:ss).
	    var minutes = Math.floor(t / 60);
	    var seconds = t - (minutes * 60);

	    if (seconds < 10) {
	      seconds = "0" + seconds;
	    }

	    if (minutes === 0) {
	      minutes = "00";
	    }

	    else if (minutes < 10) {
	      minutes = "0" + minutes;
	    }

	    return minutes + ":" + seconds;
  	},
  	buildNewScreen: function(title, imageSource){
  		console.log("building new screen");
  		this.inTransition = true;
  		//$("#overlay").css("height","100%");
  		$("#overlayTitle").html(title);
  		$("#overlayAnswer").html("Correct Answer: " + this.currentQuestion.getChoices()[this.currentQuestion.getCorrectAnswer()]);
  		$("#overlay").animate({
  			"top": 0,
  		},1000, function(){
  			game.currentQuestionIndex++;
  			if(game.currentQuestionIndex < (game.questions.length)){
	  			game.currentQuestion = game.questions[game.currentQuestionIndex];
				game.buildNextQuestion(game.currentQuestion);
				if($(window).height() <= $("body").height()){
					var myHeight = $("body").height();
				} else {
					var myHeight = $(window).height();
				}
				$("#overlay").css("height",myHeight);
				$("#timeContainer").html(game.timeConverter(game.currentQuestion.getTimeLimit()));
				setTimeout(function(){
					game.removeOverlay(game.goToNextQuestion);
				},game.timeBetweenRounds);
			} else {
				game.executeCompletionState();
				setTimeout(function(){
					game.removeOverlay("empty");
				},game.timeBetweenRounds);
			}
  		});
  	},
  	removeOverlay: function(callback){
  		var myHeight = $("#overlay").height() * -1;
  		$("#overlay").animate({
  			"top": myHeight,
  		},1000, function(){
  			if(typeof callback === "function"){
  				callback();
  			}
  		});
  	},
  	goToNextQuestion: function(){
  		game.inTransition = false;
		game.startTimer(game.currentQuestion.getTimeLimit());
  	},
}

function instantiateQuestions(){
	var questions = [];
	questions.push(new Question(30, "Which one of these characters is a \"Bad Guy?\"", ["Boba Fett", "Chewbacca", "Luke Skywalker"], 0));
	return questions;
}

$(document).ready(function(){
	game.startGame();

	$(document).on('click', ('.answerChoiceContainer'), function() {
		if(game.inTransition === false) {
	    	var choiceIndex = ($(this).attr("data-choice-index") * 1);//this is pretty hilarious
	    	game.compareAnswer(choiceIndex);
    	}
    });
});