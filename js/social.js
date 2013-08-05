Social = {
  facebook: function(id, access_token) {
    var params, url;
    url = "https://graph.facebook.com/" + id + "/posts/?callback=?";
    params = {
      access_token: access_token
    };
    $.getJSON(url, params, function(data) {
      $("#facebook").html($.tmpl($("#facebook_template"), data.data));
      console.log(data.data);
      $("#facebook abbr.timeago").timeago();
      $("#facebook").autolink();
    });
    url = "https://graph.facebook.com/" + id + "/albums/?callback=?";
    $.getJSON(url, params, function(data) {
      $("#facebook_albums").html($.tmpl($("#facebook_album_template"), data.data));
      var $fb_albums = $('#facebook_albums');
      $fb_albums.imagesLoaded(function(){
        // initialize Masonry
        $fb_albums.masonry({
          itemSelector: 'li',
          isFitWidth:   false,
          singleMode:   false,
          isAnimated:   false
        });
      });
    });
  },

  facebookPictureURL: function(picture) {
    return unescape(picture);
  },

  twitter: function(id) {
    var params, url;
    url = "http://api.twitter.com/1/statuses/user_timeline.json?callback=?";
    params = {
      include_rts: "1",
      screen_name: id
    };
    $.getJSON(url, params, function(data) {
      $("#twitter").html($.tmpl($("#twitter_template"), data));
      return $("#twitter abbr.timeago").timeago();
    });
  },

  vimeoPlayerLoad: function(videoId, autoPlay) {
    $("#vimeo_player").html($.tmpl($("#vimeo_player_template"), {
      id: videoId,
      autoPlay: autoPlay
    }));
  },

  vimeo: function(id, source) {
    var source_path, url;
    switch (source) {
      case "user":
        source_path = "/";
        break;
      case "channel":
        source_path = "/channel/";
    }
    if (!source_path) {
      return;
    }
    url = "http://vimeo.com/api/v2" + source_path + id + "/videos.json?callback=?";
    $.getJSON(url, function(data) {
      $("#vimeo").html($.tmpl($("#vimeo_template"), data));
      $("#vimeo abbr.timeago").timeago();
      $("#vimeo").autolink();
      if (data.length > 0) {
        Social.vimeoPlayerLoad(data[0].id);
      }
      $("#vimeo a.vimeo_link").click(function() {
        Social.vimeoPlayerLoad($(this).attr("id"), true);
        return false;
      });
    });
  },

  youtubePlayerLoad: function(videoId, autoPlay) {
    $("#youtube_player").html($.tmpl($("#youtube_player_template"), {
      id: videoId,
      autoPlay: autoPlay
    }));
  },

  youtube: function(id) {
    var params, url;
    url = "http://gdata.youtube.com/feeds/api/users/" + id + "/uploads?callback=?";
    params = {
      v: 2,
      alt: "json-in-script",
      format: 5
    };
    return $.getJSON(url, params, function(data) {
      var videoIdComponents;
      $("#youtube").html($.tmpl($("#youtube_template"), data.feed.entry));
      $("#youtube abbr.timeago").timeago();
      $("#youtube").autolink();
      if (data.feed.entry.length > 0) {
        videoIdComponents = data.feed.entry[0].id.$t.split(":");
        Social.youtubePlayerLoad(videoIdComponents[videoIdComponents.length - 1]);
      }
      $("#youtube a.youtube_link").click(function() {
        Social.youtubePlayerLoad($(this).attr("id"), true);
        return false;
      });
    });
  },

  formatVideoDuration: function(seconds) {
    var hours, minutes, time;
    hours = Math.floor(seconds / 3600);
    minutes = Math.floor((seconds - (hours * 3600)) / 60);
    seconds = seconds - (hours * 3600) - (minutes * 60);
    time = "";
    if (hours > 0) {
      time = hours + ":";
    }
    if (minutes > 0 || time !== "") {
      minutes = minutes < 10 && time !== "" ? "0" + minutes : String(minutes);
      time += minutes + ":";
    }
    if (time === "") {
      time = seconds + "s";
    } else {
      time += seconds < 10 ? "0" + seconds : String(seconds);
    }
    return time;
  }
}
