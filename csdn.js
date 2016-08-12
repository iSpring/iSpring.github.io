var containerNode = document.getElementById("custom_column_21591691");

var repoNames = ["GamePlane"];

function getRepoInfo(data, repoName) {
  for (var i = 0; i < data.length; i++) {
    if (data[i].name === repoName) {
      return data[i];
    }
  }
  return null;
}

function createRepoNode(repoInfo, parentNode) {
  var str = '<div>' +
    '<a style="display:inline-block;height:24px;line-height:24px;vertical-align:middle;text-decoration:none;color:#666;"></a>' +
    '<span style="display:inline-block;height:24px;line-height24px;vertical-align:middle;width:24px;margin-left:10px;background: "></span>' +
    '</div>';
  var a = $(str);
  $("a", a).text(repoInfo.name).attr("href", repoInfo.html_url).attr("title", repoInfo.description);
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
        createRepoNode(repoInfo);
      }
    });
  }
});
