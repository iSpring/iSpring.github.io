(function() {
  var containerNode = document.getElementById("custom_column_21591691");
  if (!containerNode) {
    return;
  }

  var repoNames = ["WebGlobe", "GamePlane"];

  function getRepoInfo(data, repoName) {
    for (var i = 0; i < data.length; i++) {
      if (data[i].name === repoName) {
        return data[i];
      }
    }
    return null;
  }

  //https://img.shields.io/github/stars/iSpring/WebGlobe.svg
  //https://github.com/iSpring/WebGlobe/stargazers

  function createRepoNode(repoInfo, parentNode) {
    var starBadgeUrl = "https://img.shields.io/github/stars/iSpring/" + repoInfo.name + ".svg";
    var str = '<a style="display:inline-block;color:#3d84b0;padding:15px;text-decoration:none;" target="_blank">' +
      '<div>' +
        '<span class="repo-name" style="display:inline-block;height:24px;line-height:24px;vertical-align:middle;"></span>' +
        // '<span class="star-icon" style="display:inline-block;height:24px;line-height24px;vertical-align:middle;width:11px;margin-left:10px;background:url(http://www.easyicon.net/api/resizeApi.php?id=1171410&size=16) no-repeat center;background-size:contain;"></span>' +
        //'<span class="star-count" style="height:24px;line-height24px;vertical-align:middle;width:24px;margin-left:5px;"></span>' +
        '<img class="star-badge" style="height:24px;line-height24px;vertical-align:middle;width:24px;margin-left:5px;" url="' + starBadgeUrl + '" />' +
      '</div>' +
      '<div class="repo-description"></div>' +
    '</a>';
    var a = $(str);
    a.attr("href", repoInfo.html_url);
    $(".repo-name", a).text(repoInfo.name);
    // $(".star-count", a).text(repoInfo.stargazers_count);
    $(".repo-description", a).text(repoInfo.description);
    a.appendTo(parentNode);
  }

  $.ajax("https://api.github.com/users/iSpring/repos", {
    dataType: 'json',
    data: {},
    complete: function(response) {
      var data = response.responseJSON;
      $.each(repoNames, function(i, repoName) {
        var repoInfo = getRepoInfo(data, repoName);
        if (repoInfo) {
          createRepoNode(repoInfo, containerNode);
        }
      });
    }
  });
})();
