(function() {
    var containerNode = document.getElementById("custom_column_21591691");
    if (!containerNode) {
        return;
    }

    var panelBody = $(".panel_body", containerNode)[0];

    if (panelBody) {
        panelBody.style.textAlign = "center";
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

    function createRepoNode(repoInfo, parentNode) {
        //https://img.shields.io/github/stars/iSpring/WebGlobe.svg
        // var starBadgeUrl = "https://img.shields.io/github/stars/iSpring/" + repoInfo.name + ".svg";

        //https://ghbtns.com/github-btn.html?user=iSpring&repo=WebGlobe&type=star&count=true        
        var starBadgeUrl = 'https://ghbtns.com/github-btn.html?user=iSpring&repo=' + repoInfo.name + '&type=star&count=true';

        var str = '' +
            '<a style="display:inline-block;color:#3d84b0;padding:15px;text-decoration:none;" target="_blank">' +
            '<div>' +
            '<span class="repo-name" style="display:inline-block;height:24px;line-height:24px;vertical-align:middle;"></span>' +
            // '<img class="star-badge" style="height:20px;vertical-align:middle;margin-left:20px;" src="' + starBadgeUrl + '" />' +
            '<iframe class="star-badge" src="' + starBadgeUrl + '" frameborder="0" scrolling="0" width="120px" height="20px" style="vertical-align:middle;margin-left:20px;"></iframe>' +
            '</div>' +
            '<div class="repo-description"></div>' +
            '</a>';
        var a = $(str);
        a.attr("href", repoInfo.html_url);
        $(".repo-name", a).text(repoInfo.name);
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