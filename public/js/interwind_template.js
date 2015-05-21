interwindLearning.run(function($templateCache) {
	var inviteHtml = '<form class="form-horizontal bt-fill-info-form" style="margin-top:10px;">';
		inviteHtml += '<div class="form-group">'
			inviteHtml += '<label class="col-md-12 align-left" for="email">Send invite to email:</label><br/>'
			inviteHtml += '<div class="col-md-12" style="">'
				inviteHtml += '<input id="email" class="form-control input-md" name="email" type="text" ng-model="invite.email" placeholder="Insert email here..." required="">'
			inviteHtml += '</div>'
		inviteHtml += '</div>'
		inviteHtml += '<div class="form-group">'
			inviteHtml += '<label class="pull-left align-left" for="send_email" style="padding-left: 15px;line-height: 19px;">Send invite to email:</label>'
			inviteHtml += '<div class="pull-left adcontrol_switch" data-selector="send_email" ng-click="send_notification_change();" style="margin-left:20px;float:left;">'
				inviteHtml += '<div class="statusImage"></div>'
			inviteHtml += '</div>'
		inviteHtml += '</div>'
		inviteHtml += '<div class="clearfix"></div><br/>'
	inviteHtml += '</form>'
	inviteHtml += '<div class="ngdialog-buttons">'
		inviteHtml += '<button type="button" class="ngdialog-button ngdialog-button-secondary btn btn-danger" ng-click="closeThisDialog(0)">No</button>'
		inviteHtml += '<button type="button" class="ngdialog-button ngdialog-button-primary btn btn-primary" ng-click="confirm(1)">Yes</button>'
    inviteHtml += '</div>'

  	$templateCache.put('show_description.html', inviteHtml);
});