/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(document).ready(function () {

  $("#new-tweet-form").submit(function (event) {
    event.preventDefault();
    const maxCharacter = 140;
    const tweetLength = $(this).find("#tweet-text").val().length;

    if (!tweetLength) {
      return alert("Please enter something before you Tweet! 😅");
    } else if (tweetLength - maxCharacter > 0) {
      return alert("The maximum message length is 140 characters! 🤓");
    } else {
      const newTweet = $(this).serialize();
      $.post("/tweets/", newTweet);
    }
  })

  const renderTweets = function (tweets) {
    for (let tweet of tweets) {
      const $tweet = createTweetElement(tweet);
      $('#tweets-container').append($tweet);
    }
  }

  const loadTweets = function () {
    $.get("/tweets/", function (newTweet) {
      renderTweets(newTweet);
    });
  }

  loadTweets();

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
          ${tweet.content.text}
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
})