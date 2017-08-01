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
	timeBetweenRounds: 7000,
	startGame: function(){
		this.questions = instantiateQuestions();
		this.currentQuestion = this.questions[0];
		this.currentQuestionIndex = 0;
		this.questionTimer = null;
		this.score = 0;
		this.buildNextQuestion(this.currentQuestion);
		this.startTimer(this.currentQuestion.getTimeLimit());
	},
	startTimer: function(secondsRemaining){
		console.log(secondsRemaining);
		if(secondsRemaining > 0){
			this.questionTimer = setTimeout(function(){
				secondsRemaining --;
				game.startTimer(secondsRemaining);
			},1000);
		} else {
			this.executeOutOfTime();
		}
	},
	compareAnswer: function(choiceIndex){
		if(choiceIndex === this.currentQuestion.getCorrectAnswer()){
			this.executeCorrectResponse();
		} else {
			this.executeIncorrectResponse();
		}
	},
	executeCorrectResponse: function(){
		console.log("you got it right.");
		this.score++;
		this.buildCorrectScreen();
		this.executeNextRound();
	},
	executeIncorrectResponse: function(){
		console.log("you answered incorrectly.");
		this.buildIncorrectScreen();
		this.executeNextRound();
	},
	executeOutOfTime: function(){
		console.log("you ran out of time.");
		this.buildOutOfTimeScreen();
		this.executeNextRound();
	},
	executeNextRound: function(){
		console.log("starting next round.");
		clearTimeout(this.questionTimer);
		this.currentQuestionIndex++;
		setTimeout(function(){
			if(game.currentQuestionIndex < (game.questions.length)){
				game.currentQuestion = game.questions[game.currentQuestionIndex];
				game.buildNextQuestion(game.currentQuestion);
				game.startTimer(game.currentQuestion.getTimeLimit());
			} else {
				game.executeCompletionState();
			}
		},this.timeBetweenRounds);
	},
	executeCompletionState: function(){
		console.log("You completed the game.");
		console.log("Your score was " + this.score + " out of " + this.questions.length);
	},
	buildNextQuestion: function(question){
		console.log("building new question...");
		var timeContainer = $("#timeContainer");
		timeContainer.html(question.getTimeLimit());
		var questionContainer = $("#questionContainer");
		questionContainer.html(question.getQuestion());
		var answerChoicesContainer = $("#answerChoicesContainer");
		answerChoicesContainer.html("");
		for(i = 0; i < question.getChoices().length; i++){
			console.log(question.getChoices()[i]);
			var choiceDiv = $("<div>");
			choiceDiv.addClass("answerChoiceContainer");
			choiceDiv.attr("data-choice-index",i.toString());
			choiceDiv.html(question.getChoices()[i]);
			answerChoicesContainer.append(choiceDiv);
		}

	},
	buildCorrectScreen: function(){
		console.log("building correct screen.");
	},
	buildIncorrectScreen: function(){
		console.log("building incorrect screen.");
	},
	buildOutOfTimeScreen: function(){
		console.log("building out of time screen");
	},
}

function instantiateQuestions(){
	var questions = [];
	questions.push(new Question(10, "Which one of these characters is a \"Bad Guy?\"", ["Boba Fett", "Chewbacca", "Luke Skywalker"], 0));
	questions.push(new Question(10, "Which one of these characters is a \"Good Guy?\"", ["Darth Vader", "Darth Maul", "Luke Skywalker"], 2));
	console.log(questions);
	return questions;
}

$(document).ready(function(){
	game.startGame();

	$(document).on('click', ('.answerChoiceContainer'), function() {
    	var choiceIndex = ($(this).attr("data-choice-index") * 1);//this is pretty hilarious
    	game.compareAnswer(choiceIndex);
    });
});