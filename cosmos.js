(function() {
  var input = document.getElementById("signup");

  load();
  setupButtons();

  function setupButtons() {
    var fb = document.getElementById("share-fb");
    var twitter = document.getElementById("share-twitter");
    var email = document.getElementById("share-email");

    fb.addEventListener("click", function(event) {
      var url = "https://www.facebook.com/dialog/share?";
      url += "app_id=2475162576030118";
      url += "&display=popup";
      url += "&href=" + encodeURIComponent(input.value);
      window.open(url, "_blank");
      event.preventDefault();
    });

    twitter.addEventListener("click", function(event) {
      var url = "https://twitter.com/intent/tweet?";
      url +=
        "text=" +
        encodeURIComponent(
          "I’m part of an inspiring and supportive community of Asian women called The Cosmos! And I want you to join: "
        );
      url += "&url=" + encodeURIComponent(input.value);
      window.open(url, "_blank");
      event.preventDefault();
    });

    email.addEventListener("click", function(event) {
      console.log(input.value);

      window.open(
        "mailto:?body=" +
          encodeURIComponent(
            "I’m part of an incredible and supportive community of Asian women called The Cosmos! Their mission to help Asian women feel strong, supported, and healthy really resonates with me, and I think you’ll like it too! I want to personally invite you to join via my link: \r\n" +
              input.value
          ) +
          "&subject=" +
          encodeURIComponent("You're going to love this!"),
        "_blank"
      );
      event.preventDefault();
    });
  }

  function load() {
    function getUrlVars() {
      var vars = {};
      var parts = window.location.href.replace(
        /[?&]+([^=&]+)=([^&]*)/gi,
        function(m, key, value) {
          vars[key] = value;
        }
      );
      return vars;
    }

    var params = getUrlVars();

    if (!params.email) {
      return;
    }

    input.value = "https://www.jointhecosmos.com/?SQF_REFERRER=" + params.email;

    new ClipboardJS(".copy-btn", {
      text: function(trigger) {
        return input.value;
      }
    });

    axios
      .get(
        "https://us-central1-acoustic-shade-220717.cloudfunctions.net/check-my-number-api?email=" +
          params.email
      )
      .then(function(response) {
        var count = response.data.referralCount;
        var text = "";

        if (count === 0) {
          return;
        }

        if (count === 1) {
          text =
            "<p>Thanks to you, <b>" +
            count +
            "</b> more Asian women will get access to a supportive community! Invite <b>" +
            (5 - count) +
            "</b> more and you'll ALL get access to a free workshop on <i>Cultivating Confidence as Asian Womxn</i>. Check back here to see your progress.</p>";
        } else if (count < 5) {
          text =
            "<p>Thanks to you, <b>" +
            count +
            "</b> more Asian women are getting access to a supportive community! Invite <b>" +
            (5 - count) +
            "</b> more and you'll ALL get access to a free workshop on <i>Cultivating Confidence as Asian Womxn</i>. Check back here to see your progress.</p>";
        } else {
          text =
            "<p>You did it! Check your inbox on <b>11/27</b> for access to the Cultivating Confidence workshop!</p>";
        }
        document.getElementById("status").innerHTML = text;
      })
      .catch(function(error) {
        console.warn("err", error);
      });
  }
})();
