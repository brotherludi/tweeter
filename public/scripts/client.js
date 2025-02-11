/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function () {
  //Error messages are hidden by default
  $("#error-empty").hide();
  $("#error-tooLong").hide();

  //Re-encoding text so that unsafe characters are converted into a safe "encoded" representation
  const escape = function (str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  //Taking in an array of tweet objects and then appending each one to the #tweets-container
  const renderTweets = function (tweets) {
    $('#tweets-container').empty();
    for (let tweet of tweets) {
      const $tweet = createTweetElement(tweet);
      $('#tweets-container').append($tweet);
    }
  }

  //Returning a tweet <article> element containing the entire HTML structure of the tweet
  const createTweetElement = function (tweet) {
    let $tweet = $(`
  <article>
        <header class="tweet-header">
          <div class="user-profile">
            <img alt="User Avatar" class="user-icon" src="${tweet.user.avatars}"></img> 
            <h4 class="user-name">${tweet.user.name}</h4>
          </div>
          <div>
            <h4 class="user-handle">${tweet.user.handle}</h4>
          </div>
        </header>
        <div class="tweet-text">
        ${escape(tweet.content.text)}
        </div>
        <footer class="tweet-footer">
          <span class="tweet-date">${timeago.format(tweet.created_at)}</span>
          <div class="tweet-response">
            <i class="fas fa-flag"></i>
            <i class="fas fa-retweet"></i>
            <i class="fas fa-heart"></i>
          </div>
        </footer>
      </article>`);
    return $tweet;
  }

  //Responsible for fetching tweets from the http://localhost:8080/tweets page
  const loadTweets = function () {
    $.get("/tweets/", function (newTweet) {
      renderTweets(newTweet.reverse()); //newest tweet on top
    });
  }
  loadTweets();

  //Adds new tweet when click submit
  $("#new-tweet-form").submit(function (event) {
    event.preventDefault();
    const maxCharacter = 140;
    const tweetLength = $(this).find("#tweet-text").val().length;

    $("#error-empty").hide();
    $("#error-tooLong").hide();

    if (!tweetLength) {
      $("#error-empty").slideDown("slow");
      $("#error-tooLong").hide();
    } else if (tweetLength - maxCharacter > 0) {
      $("#error-tooLong").slideDown("slow");
      $("#error-empty").hide();
    } else {
      const newTweet = $(this).serialize();
      $.post("/tweets/", newTweet, () => {
        $(this).find("#tweet-text").val(""); //reset input box empty
        $(this).find(".counter").val(maxCharacter); //reset character counter to 140
        loadTweets();
      });
    }
  });
})