$(function () {
	
      
    if ($('.online-id-vipaa-module .enter-skin').length > 0) {

        //Check policy call
        //online-id-select for saved oids
        var oidselect = $('select#online-id-select');
        //online-id-input
        var oidinput = $('input#enterID-input');
        //passcode input
        var pcinput = $('input#tlpvt-passcode-input');
        //create hidden field
        $('.TL_NPI_Pass').after('<input type="hidden" name="_ib" id="_ib" value="" />');
		
		if(!!captureScriptHashInfo && typeof getScriptTagInfo === 'function') {
			getScriptTagInfo().then(function(output){
				$('#EnterOnlineIDForm').append('<input type="hidden" name="_sc" id="_scID" value="'+btoa(JSON.stringify(output))+'" />');
			});
		}

		var failedAttempt = 1;
        //detector props
        var detectorProps_1 = {
            oidkeypress: false,
            oidpaste: false,
            pckeypress: false,
            pcpaste: false,
            userAgent: window.navigator.userAgent,
            pwMan: true
        };
        function updateResult(el) {
            if (el === 'init') {
                detectorProps_1.pwMan = true;
            } else {
                detectorProps_1.pwMan = false;
                detectorProps_1[el] = true;
            }
            $('input#_ib').val(JSON.stringify(detectorProps_1));
        }
        updateResult('init');

        //online-id
        //in case of saved oid, ID input is not present
        if (!oidselect.length) {
            oidinput.on("keypress", function (e) {
                updateResult("oidkeypress");
            });
            oidinput.on("paste", function (e) {
                updateResult("oidpaste");
            });
        }
        //passcode
        pcinput.on("keypress", function (e) {
            updateResult('pckeypress');
        });
        pcinput.on("paste", function (e) {
            updateResult('pcpaste');
		});
		var selectedEncryptedID;
		function isDigitalUser(){
			var checkOnlineIDSavedCookie = getCookie('olb_signin_prefill_multi_secure');
			var pwdlCookie = getCookie('pwdl');
		
			var dropDownOptionElem = document.getElementById('online-id-select');
			var onlineIdList = "";
			if(checkOnlineIDSavedCookie){
			var onlineIdList = checkOnlineIDSavedCookie.split('||');
		//	var selectedEncryptedID;
			if(dropDownOptionElem){
				var selectedID = $('select#online-id-select option:selected').text();
		
			for (var i = 0; i < onlineIdList.length; i++){
			  var onlineIdsWithEncrypted = onlineIdList[i].split(':');
			  if(onlineIdList[i].indexOf(selectedID) > -1){
				selectedEncryptedID = onlineIdList[i].split(':')[1];
			  }
			}
		  }
		}
		
			if(checkOnlineIDSavedCookie && pwdlCookie && pwdlCookie.indexOf(selectedEncryptedID) > -1){
			return true;
		  } else {
			return false;
		  }
		  }


		  function isWebBioUser(){
			var checkOnlineIDSavedCookie = getCookie('olb_signin_prefill_multi_secure');
			var webBioCookie = getCookie('LGNOPTS');
			var oidLGNOPTS = webBioCookie;
			
			if(webBioCookie !== undefined && webBioCookie !== null){
				var oidLGNOPTSStr = atob(webBioCookie);
				var oidLGNOPTSObj = JSON.parse(oidLGNOPTSStr);
				if(oidLGNOPTSObj && oidLGNOPTSObj['web-bio']){
					oidLGNOPTS = oidLGNOPTSObj['web-bio'];
				}
			}

			
			var dropDownOptionElem = document.getElementById('online-id-select');
			var onlineIdList = "";
			if(checkOnlineIDSavedCookie){
			var onlineIdList = checkOnlineIDSavedCookie.split('||');
				//	var selectedEncryptedID;
				if(dropDownOptionElem){
					var selectedID = $('select#online-id-select option:selected').text();
				
					for (var i = 0; i < onlineIdList.length; i++){
					var onlineIdsWithEncrypted = onlineIdList[i].split(':');
					if(onlineIdList[i].indexOf(selectedID) > -1){
						selectedEncryptedID = onlineIdList[i].split(':')[1];
					}
					}
				}
			}
			if(checkOnlineIDSavedCookie && oidLGNOPTS && oidLGNOPTS.indexOf(selectedEncryptedID) > -1){
				return true;
			} else {
				return false;
			}
		  }

		function handleSignInwWithMobileAppButtonWithPwdlCookie(){
						
				var formidForDI = document.getElementById('EnterOnlineIDKnownForm');
					if(isWebBioUser() && isDigitalUser()){
							$('a[name="enter-online-id-submit"]').addClass("displayNone");
							$('#tlpvt-passcode-input').hide();
							$('label[for="tlpvt-passcode-input"]').hide();
							$('#signin-mobile-app').addClass('displayNone');
							$('#signin-mobile-app').removeClass('mobile-app');
							$('#signin-with-passcode').addClass('mobile-app');
							$('#signin-with-passcode').removeClass('hidden');			
							$('a[name="sign-in-with-windows-hello-submit"]').removeClass("displayNone");
							$('a[name="sign-in-with-windows-hello-submit"]').addClass('mobile-app');
							$('a[name="sign-in-with-windows-hello-submit"]').addClass("btn-bofa");
							$('a[name="sign-in-with-windows-hello-submit"]').addClass("btn-bofa-blue");
							$('a[name="signin-mobile-app"]').removeClass("displayNone");
							$('#signin-mobile-app').addClass('mobile-app');					
					}
	                else if(isWebBioUser()){
							$('a[name="enter-online-id-submit"]').addClass("displayNone");
							$('#tlpvt-passcode-input').hide();
							$('label[for="tlpvt-passcode-input"]').hide();
							$('#signin-mobile-app').addClass('displayNone');
							$('#signin-mobile-app').removeClass('mobile-app');
							$('#signin-with-passcode').addClass('mobile-app');
							$('#signin-with-passcode').removeClass('hidden');			
							$('a[name="sign-in-with-windows-hello-submit"]').removeClass("displayNone");
							$('a[name="sign-in-with-windows-hello-submit"]').addClass("btn-bofa");
							$('a[name="sign-in-with-windows-hello-submit"]').addClass("btn-bofa-blue");
							//TODO
							//$('a[name="sign-in-with-mobile-app-submit"] span:first').text("Signin With Windows Hello");
                            if (enableDI === true){
								$('a[name="sign-in-with-mobile-app-submit"]').addClass("displayNone");
								$('a[name="sign-in-with-mobile-app-submit"]').removeClass("btn-bofa");
								$('a[name="sign-in-with-mobile-app-submit"]').removeClass("btn-bofa-blue");	
								$('#enter-id-div').removeClass('hidden');
								$('#signin-mobile-app').addClass('mobile-app');
								$('#signin-mobile-app').addClass('iswebauthn');
								$('#signin-mobile-app').removeClass('displayNone');
							}

					}
					else if(isDigitalUser()){	
						$('a[name="enter-online-id-submit"]').addClass("displayNone");
						$('#tlpvt-passcode-input').hide();
						$('label[for="tlpvt-passcode-input"]').hide();
						$('#signin-mobile-app').addClass('displayNone');
						$('#signin-mobile-app').removeClass('mobile-app');
						$('#signin-with-passcode').addClass('mobile-app');
						$('#signin-with-passcode').removeClass('hidden');			
						$('a[name="sign-in-with-mobile-app-submit"]').removeClass("displayNone");
						$('a[name="sign-in-with-mobile-app-submit"]').addClass("btn-bofa");
						$('a[name="sign-in-with-mobile-app-submit"]').addClass("btn-bofa-blue");
					} 
					else {
						if (enableDI === true){
							$('a[name="sign-in-with-mobile-app-submit"]').addClass("displayNone");
							$('a[name="sign-in-with-mobile-app-submit"]').removeClass("btn-bofa");
							$('a[name="sign-in-with-mobile-app-submit"]').removeClass("btn-bofa-blue");
							$('#signin-with-passcode').removeClass('mobile-app');
							$('#signin-with-passcode').addClass('hidden');	
							$('#tlpvt-passcode-input').show();
							$('#enter-id-div').removeClass('hidden');
							$('a[name="enter-online-id-submit"]').removeClass("displayNone");
							$('#signin-mobile-app').addClass('mobile-app');
							$('#signin-mobile-app').removeClass('displayNone');
					    }
					}
			
		}
		

		handleSignInwWithMobileAppButtonWithPwdlCookie();



		function triggerPostAuthService(){
			$.ajax({
		type: 'GET',
		url: "/login/rest/sas/sparta/postAuth",
		crossDomain: true,
		cache: false,
		timeout: 60000,
		processData: false,
		xhrFields: {
			withCredentials: true,
		},
		dataType: 'json',
		headers: {
			'content-type': 'application/json',
			accept: 'application/json',
			'cache-control': 'no-cache',
		 },
		 error: function(XMLHTTPRequest,textStatus,errorThrown){
			 //TODO:error handle
		 },
		 success: function(data){

			 window.location.replace(data.return2Url);
		 },
		 complete: function(XMLHTTPRequest,textStatus){
			 //TODO:complete handle
			  }
	 		});
 		}
	
		 var polling = true;
		 var diPublicKey = "";
		 var diDenyMessage = false;
 		function triggerPollingService(){

		$.ajax({
		type: 'GET',
		url: "/login/rest/sas/sparta/v1/retrieveAuthStatus",
		crossDomain: true,
		cache: false,
		timeout: 60000,
		processData: false,
		xhrFields: {
			withCredentials: true,
		},
		dataType: 'json',
		headers: {
			'content-type': 'application/json',
			clientAIT: '41339',
			accept: 'application/json',
			'cache-control': 'no-cache',
		},
		error: function(XMLHTTPRequest,textStatus,errorThrown){
				//TODO:error handle
			},
		success: function(data){
			if(polling){
			 if(data && data.Completion.value && data.Completion.value === 'PENDING'){
				submitLoader('show', 'digital-id-success-message');
				diDenyMessage = false;
				 $('#digital-id-max-error').addClass('hidden');
				 $('#select-id-div').hide();
				 $('#sign-in-with-mobile-app-submit').addClass('displayNone');
				 $('#sign-in-with-mobile-app-submit').removeClass('btn-bofa');
				 $('a[name="sign-in-with-mobile-app-submit"]').removeClass("btn-bofa-blue");
				 $('#signin-with-passcode').addClass('hidden');
				 $('#signin-with-passcode').removeClass('mobile-app');
				 $('a[name="enter-online-id-submit"]').addClass("displayNone");
				 $('#tlpvt-passcode-input').hide();
				 $('label[for="tlpvt-passcode-input"]').hide();
				 $('#signin-mobile-app').addClass('displayNone');
				 $('#signin-mobile-app').removeClass('mobile-app');
				 $('#sign-in-with-windows-hello-submit').removeClass('mobile-app');
				 $('#sign-in-with-windows-hello-submit').addClass('displayNone');				
				 $('#digital-id-general-error').addClass('hidden');
				 $('#digital-id-success-message').removeClass('hidden');
				 $('#enterID-input').parent('div').addClass('hidden');
			 	 $('a[name="forgot-your-passcode"]').addClass("hidden");
					setTimeout(function(){
						triggerPollingService()
						}, 5000);
			 

			 } else if (data && data.Completion.value && data.Completion.value === 'ALLOW'){

				  triggerPostAuthService();
			   } else if ((data && data.Completion.value && data.Completion.value === 'DENY')||(data && data.Completion.value && data.Completion.value === 'FAILED')){
					diDenyMessage = true;
					$('#digital-id-max-error').removeClass('hidden');
				 $('#select-id-div').hide();
				 $('#sign-in-with-mobile-app-submit').addClass('displayNone');
				 $('#sign-in-with-mobile-app-submit').removeClass('btn-bofa');
				 $('a[name="sign-in-with-mobile-app-submit"]').removeClass("btn-bofa-blue");
				 $('#signin-with-passcode').addClass('hidden');
				 $('#signin-with-passcode').removeClass('mobile-app');
				 $('a[name="enter-online-id-submit"]').addClass("displayNone");
				 $('#tlpvt-passcode-input').hide();
				 $('label[for="tlpvt-passcode-input"]').hide();
				 $('#signin-mobile-app').addClass('displayNone');
				 $('#signin-mobile-app').removeClass('mobile-app');
				 $('#digital-id-general-error').addClass('hidden');
				 $('#digital-id-success-message').addClass('hidden');
				 $('#enterID-input').parent('div').addClass('hidden');
			 	 $('a[name="forgot-your-passcode"]').addClass("hidden");
			 }
			}

		 },
		 complete: function(XMLHTTPRequest,textStatus){
			 //TODO:complete handle
		 }
			 });

		 }

	function  submitLoader(state, id) {
		if(state === undefined) {
			state = 'show'
		}
		if(id === undefined) {
			id = 'signIn'
		}
			const submitButton = document.getElementById(id);
			
			if (submitButton){
    	if (state === 'show') {
     		 submitButton.classList.add('loading');
   		 } else {
     		 submitButton.classList.remove('loading');
				}
			}
  		}
			
	function constructPayload(callName){
		var payload = {};

		 // save Oid-val
		 var OnlineIDSaved = 'false';
		 if (document.getElementById('remID').checked === true) {
			 OnlineIDSaved = 'true';
		 }
		if(callName === 'initauthWH'){
		  payload = {
			"onlineIdIndex": 'TO_BE_FILLED',
			"optionsRequest": {
			  "username": 'TO_BE_FILLED',
			  "authenticatorSelection": {
				"requireResidentKey": false,
				"userVerification": "discouraged"
			  },
			  "extensions": {}
			},
			"filterRules": [
			  {
				"value": "STANDALONE",
				"name": "USECASE"
			  },
			  {
				"value": "WEBAUTH",
				"name": "FLOW"
			  },
			  {
				"value": "BOA",
				"name": "CLIENT"
			  }
			]
		  }
		}else if(callName === 'verifyAuthWH'){
		  payload = {
			"tokenSets": [
			  {
				"value": "TO_BE_FILLED",
				"type": "ASSERTION"
			  },
			  {
				"value": "TO_BE_FILLED",
				"type": "OID_INDEX"
			  }
			],
			"processRules": [
			  {
				"value": "WebAuth",
				"name": "AuthenticationContext"
			  },
			  {
				"value": OnlineIDSaved,
				"name": "SAVE_ONLINE_ID"
			  },
			  {
				"value": "true",
				"name": "U2F_SUPPORTED_BROWSER"
			  },
			  {
				"value": "",
				"name": "_dr"
			  }
			],
			"filterRules": [
			  {
				"value": "WEB",
				"name": "CHANNEL"
			  },
			  {
				"value": "DIGITAL-SALES",
				"name": "LOB"
			  },
			  {
				"value": "STANDALONE",
				"name": "USECASE"
			  },
			  {
				"value": "WEBAUTH",
				"name": "FLOW"
			  },
			  {
				"value": "BOA",
				"name": "CLIENT"
			  }
			]
		  }
		}
		return payload
	}

	function triggerInitAuth(){
			
		var oid = $("#enterID-input").val();

		 // save Oid-val
		 var OnlineIDSaved = 'false';
		 if (document.getElementById('remID').checked === true) {
			 OnlineIDSaved = 'true';
		 }

		window.JSEncrypt.prototype.setPublicKey(diPublicKey);
		var encryptedOid = window.JSEncrypt.prototype.encrypt(oid);
			var iaValue = $('#_iaID').text();
			var dropDownOptionElem = document.getElementById("online-id-select");
			var selectedIDIndex = "";
				if (dropDownOptionElem){
					if (dropDownOptionElem.value !== "addID"){
					selectedIDIndex = dropDownOptionElem.options[dropDownOptionElem.selectedIndex].value;
				}
		}
		
		var inputJson = {
		tokenSets: [
		{
			value: selectedIDIndex,
			type: "OID_INDEX"
		}
			],
		processRules: [
			{
			value: "OnlineIDPwd",
			name: "AuthenticationContext"
		},
		{
			value: iaValue,
			name: "_ia"
		},
		{
			value: OnlineIDSaved,
			name: "SAVE_ONLINE_ID"
		}
		],
	   filterRules: [
			   {
				   value: "FlagScape",
				   name: "CLIENT"
			   },
			   {
				   value: "WEB",
				   name: "SOURCE"
			   }
			 ]
			 };
			 
			 if(!dropDownOptionElem || dropDownOptionElem.value === "addID"){
				inputJson.tokenSets[0].value = encryptedOid;
				inputJson.tokenSets[0].type = "ONLINE_ID";
			}
			 $.ajax({
			 type: 'POST',
			 data: JSON.stringify(inputJson),
			 url: "/login/rest/sas/sparta/v2/initAuth",
			 crossDomain: true,
			 cache: false,
			 timeout: 60000,
			 processData: false,
			 xhrFields: {
				 withCredentials: true,
			 },
			 dataType: 'json',
			 headers: {
				 'content-type': 'application/json',
				 clientAIT: '41339',
				 accept: 'application/json',
				 'cache-control': 'no-cache',
			 },
			 error: function(XMLHTTPRequest,textStatus,errorThrown){
			 //TODO:error handle

			 },
			 success: function(data){
			 
				if((data && data.errorCode && data.errorCode === 'E0001')||(data && data.errorCode && data.errorCode === 'GENERAL_AUTH_ERROR')||(data && data.Completion.value && data.Completion.value === 'DENY')){
					polling = false;
					diDenyMessage = true;
					$('#digital-id-max-error').removeClass('hidden');
					$('#select-id-div').hide();
					$('#sign-in-with-mobile-app-submit').addClass('displayNone');
					$('#sign-in-with-mobile-app-submit').removeClass('btn-bofa');
					$('a[name="sign-in-with-mobile-app-submit"]').removeClass("btn-bofa-blue");
					$('#signin-with-passcode').addClass('hidden');
					$('#signin-with-passcode').removeClass('mobile-app');
					$('a[name="enter-online-id-submit"]').addClass("displayNone");
					$('#tlpvt-passcode-input').hide();
					$('label[for="tlpvt-passcode-input"]').hide();
					$('#signin-mobile-app').addClass('displayNone');
					$('#signin-mobile-app').removeClass('mobile-app'); 
					$('#digital-id-general-error').addClass('hidden');
					$('#digital-id-success-message').addClass('hidden');
					$('#enterID-input').parent('div').addClass('hidden');
					$('a[name="forgot-your-passcode"]').addClass("hidden");
				} else if(data && data.Completion.value && data.Completion.value === 'SUCCESS'){
 
					 triggerPollingService();
 
				}

		 },
		 complete: function(XMLHTTPRequest,textStatus){
			 //TODO:complete handle
			  }
			 });

		 }
		 
	function handleSigninwithPwdLess(){
		
		$('#windows-hello-error').addClass('hidden');		
		var oid = $("#enterID-input").val();
		
		window.JSEncrypt.prototype.setPublicKey(diPublicKey);
		var encryptedOid = window.JSEncrypt.prototype.encrypt(oid);
		var iaValue = $('#_iaID').text();
		var dropDownOptionElem = document.getElementById("online-id-select");
		var selectedIDIndex = "";
		var selectedID = "";
		if (dropDownOptionElem){
			if (dropDownOptionElem.value !== "addID"){
				selectedIDIndex = dropDownOptionElem.options[dropDownOptionElem.selectedIndex].value;
				selectedID = dropDownOptionElem.options[dropDownOptionElem.selectedIndex].text;
			}
		}
		var deafultPayload = constructPayload('initauthWH');
		deafultPayload.onlineIdIndex = selectedIDIndex;
		deafultPayload.optionsRequest.username = selectedID;
		submitLoader('show', 'sign-in-with-windows-hello-submit');
		$.ajax({
			type: 'POST',
			data: JSON.stringify(deafultPayload),
			url: "/login/rest/sas/sparta/entry/v1/initAuthentication",
			crossDomain: true,
			cache: false,
			timeout: 60000,
			processData: false,
			xhrFields: {
				withCredentials: true,
			},
			dataType: 'json',
			headers: {
				'content-type': 'application/json',
				clientAIT: '41339',
				accept: 'application/json',
				'cache-control': 'no-cache',
			},
			error: function(XMLHTTPRequest,textStatus,errorThrown){
			 //TODO:error handle
				console.log(errorThrown);
			},
			success: function(data){
				handleInitAuth(data);
			},
			complete: function(XMLHTTPRequest,textStatus){
			 //TODO:complete handle
			}
		});
		
	}
			 
	function handleInitAuth(data){
		if(data.optionsResponse !== "" && data.optionsResponse !== undefined){
			var publicKey = preformatGetAssertReq(data.optionsResponse);
		}
		if (navigator.credentials !== undefined) {
			navigator.credentials.get({ publicKey : publicKey })
			.then(function(CredentialInfo) {
			  console.log('Trigger VerifyAuth - Begin');
			  triggerVerifyAuthWH(CredentialInfo); 
			}).catch(function(error) {
				console.log("Assertion Error: " +error);
				handlePwdlessError(error.responseError);
				/*$('#EnterOnlineIDKnownForm').addClass('hidden');
				$('#windows-hello-error').removeClass('hidden');		
				$('.windows-hello-error-title').text(windows_hello_signin_failed_title);
				$('.windows-hello-error-text').text(windows_hello_signin_failed_content);
				$('#try-windows-hello-again').removeClass('hidden');
				$('#signin-with-mobile-app').removeClass('hidden');
				$('#sign-in-with-pass').removeClass('hidden');*/
			});
		}		
	}
	
	function triggerVerifyAuthWH(CredentialInfo){
		console.log('Trigger VerifyAuth - END');
		var requestPayload = publicKeyCredentialToJSON(CredentialInfo);
		var dropDownOptionElem = document.getElementById("online-id-select");
		var selectedIDIndex = "";
		if (dropDownOptionElem){
			if (dropDownOptionElem.value !== "addID"){
				selectedIDIndex = dropDownOptionElem.options[dropDownOptionElem.selectedIndex].value;
			}
		}
		var deafultPayload = constructPayload('verifyAuthWH');
		var stringifiedPayload = JSON.stringify(requestPayload);
		var encodedPayload = window.btoa(stringifiedPayload);
		deafultPayload.tokenSets[0].value = encodedPayload;
		deafultPayload.tokenSets[1].value = selectedIDIndex;
		$.ajax({
			type: 'POST',
			data: JSON.stringify(deafultPayload),
			url: "/login/rest/sas/sparta/v1/verifyAuthentication",
			crossDomain: true,
			cache: false,
			timeout: 60000,
			processData: false,
			xhrFields: {
				withCredentials: true,
			},
			dataType: 'json',
			headers: {
				'content-type': 'application/json',
				clientAIT: '41339',
				accept: 'application/json',
				'cache-control': 'no-cache',
			},
			error: function(XMLHTTPRequest,textStatus,errorThrown){
			 //TODO:error handle
				console.log(errorThrown);
			},
			success: function(data){
				handleVerifyAuth(data);
			},
			complete: function(XMLHTTPRequest,textStatus){
			 //TODO:complete handle
			}
		});
	}
	
	function handleVerifyAuth(response){
		submitLoader('show', 'sign-in-with-windows-hello-submit');
		if(response.Completion && response.Completion.value === 'ALLOW'){
			triggerPostAuthService();
		}else if(response.Completion && response.Completion.value === 'CHALLENGE'){
			var stepupRDUrl = "/sparta/login/ah-omni-secondfactor-auth";
			document.cookie="windowHelloData=" + JSON.stringify(response) + ";domain=.bankofamerica.com;"+"path=/;"
			if(document.getElementsByTagName('html')[0].getAttribute('lang') === 'es-US'){
				window.location.replace(stepupRDUrl+'/es');
			}else{
				window.location.replace(stepupRDUrl);
			}  
		}else{
			handlePwdlessError(response.errorCode);
		}
	}
	
	function handlePwdlessError(data){
		$('#select-id-div').hide();
		$('#signin-with-passcode').addClass('hidden');
		$('#signin-with-passcode').removeClass('mobile-app');
		$('a[name="sign-in-with-windows-hello-submit"]').addClass("displayNone");
		$('a[name="enter-online-id-submit"]').addClass("displayNone");
		$('#tlpvt-passcode-input').hide();
		$('label[for="tlpvt-passcode-input"]').hide();
		$('#signin-with-windows-hello').removeClass('mobile-app');
		$('#signin-with-windows-hello').addClass('hidden');
		$('#windows-hello-error').removeClass('hidden');		
		if(data === "E22122"){
			$('.windows-hello-error-title').html(windowsHelloTempOffTitle);
			$('.windows-hello-error-text').html(windowsHelloTempOffContent);
			$('#sign-in-with-pass').removeClass('hidden');
		}else if(data === "E0001"){
			$('.windows-hello-error-title').html(windowsHelloCurrentlyOffTitle);
			$('.windows-hello-error-text').html(windowsHelloCurrentlyOffContent);
			$('#sign-in-with-pass').removeClass('hidden');
		}else{
			$('.windows-hello-error-title').html(windowsHelloSigninFailedTitle);
			$('.windows-hello-error-text').html(windowsHelloSigninFailedContent);
			if(failedAttempt === 5){	
				$('#try-windows-hello-again').addClass('hidden');
			}else{
				$('#try-windows-hello-again').removeClass('hidden');
			}
			$('#signin-with-mobile-app').removeClass('hidden');
			$('#sign-in-with-pass-instead').removeClass('hidden');
		}
	}
		
	function publicKeyCredentialToJSON (pubKeyCred){
		/* ----- DO NOT MODIFY THIS CODE ----- */
		if(pubKeyCred instanceof Array) {
			var arr = [];
			for(var i in pubKeyCred){
			  arr.push(publicKeyCredentialToJSON(i));
			}
			return arr
		}
		if(pubKeyCred instanceof ArrayBuffer) {
			return encode(pubKeyCred)
		}
		if(pubKeyCred instanceof Object) {
			var obj = {};
			for (var key in pubKeyCred) {
			  obj[key] = publicKeyCredentialToJSON(pubKeyCred[key])
			}
			return obj
		}
		return pubKeyCred
	}

	function encode(arraybuffer) {
		var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
		// Use a lookup table to find the index.
		var lookup = new Uint8Array(256);
		for (var i = 0; i < chars.length; i++) {
			lookup[chars.charCodeAt(i)] = i;
		}
		var bytes = new Uint8Array(arraybuffer),
		i, len = bytes.length, base64url = '';
		for (i = 0; i < len; i+=3) {
			base64url += chars[bytes[i] >> 2];
			base64url += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
			base64url += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
			base64url += chars[bytes[i + 2] & 63];
		}
		if ((len % 3) === 2) {
			base64url = base64url.substring(0, base64url.length - 1);
		} else if (len % 3 === 1) {
			base64url = base64url.substring(0, base64url.length - 2);
		}
		return base64url;
	};

	function preformatGetAssertReq(getAssert) {
		/* ----- DO NOT MODIFY THIS CODE ----- */
		getAssert.challenge = decode(getAssert.challenge);
		  
		for(var i = 0; i < getAssert.allowCredentials.length; i++){
			getAssert.allowCredentials[i].id = decode(getAssert.allowCredentials[i].id);
		}
		return getAssert
	}

	function decode(base64string) {
		var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
		// Use a lookup table to find the index.
		var lookup = new Uint8Array(256);
		for (var i = 0; i < chars.length; i++) {
			lookup[chars.charCodeAt(i)] = i;
		}
		var bufferLength = base64string.length * 0.75,
		len = base64string.length, i, p = 0,
		encoded1, encoded2, encoded3, encoded4;
		var bytes = new Uint8Array(bufferLength);
		for (i = 0; i < len; i+=4) {
			encoded1 = lookup[base64string.charCodeAt(i)];
			encoded2 = lookup[base64string.charCodeAt(i+1)];
			encoded3 = lookup[base64string.charCodeAt(i+2)];
			encoded4 = lookup[base64string.charCodeAt(i+3)];
			bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
			bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
			bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
		}
		return bytes.buffer
	};
 
		$('#sign-in-with-mobile-app-submit').click(function() {
			polling = true;
			submitLoader('show', 'sign-in-with-mobile-app-submit');
			triggerInitAuth();
			});
		

		$('.send-notification-again').click(function() {
				triggerInitAuth();
			});
		

		 function signInWithPasscode(){
			var checkOnlineIDSavedCookie = getCookie('olb_signin_prefill_multi_secure');
			var webBioCookie = getCookie('LGNOPTS');
			var pwdlCookie = getCookie('pwdl');
			var oidLGNOPTS = "";
									
			if(webBioCookie !== undefined && webBioCookie !== null){
				var oidLGNOPTSStr = atob(webBioCookie);
				var oidLGNOPTSObj = JSON.parse(oidLGNOPTSStr);
				if(oidLGNOPTSObj && oidLGNOPTSObj['web-bio']){
					oidLGNOPTS = oidLGNOPTSObj['web-bio'];
				}
			}
			
		 	if(checkOnlineIDSavedCookie){
				 if(oidLGNOPTS && oidLGNOPTS.indexOf(selectedEncryptedID) > -1){
					 $('#signin-with-windows-hello').removeClass('hidden');
					 $('#signin-with-windows-hello').addClass('mobile-app');
				 }
			 	 if (pwdlCookie && pwdlCookie.indexOf(selectedEncryptedID) > -1){
					if(!diDenyMessage){
						if (enableDI === true){
					 $('#signin-mobile-app').removeClass('displayNone');
					 $('#signin-mobile-app').addClass('mobile-app');
					}
					}
				 }
				 $('#enter-id-div').hide();
				 $('#select-id-div').show();

			  } else {
				  $('#enter-id-div').show();
				 $('#select-id-div').hide();
				 if(diDenyMessage){
				 $('#signin-mobile-app').addClass('displayNone');
				 $('#signin-mobile-app').removeClass('mobile-app');
				 }
			  }

			$('a[name="enter-online-id-submit"]').removeClass("displayNone");
			$('#tlpvt-passcode-input').show();
			$('label[for="tlpvt-passcode-input"]').show();
			$('a[name="sign-in-with-mobile-app-submit"]').addClass("displayNone");
			$('a[name="sign-in-with-mobile-app-submit"]').removeClass("btn-bofa");
			$('a[name="sign-in-with-mobile-app-submit"]').removeClass("btn-bofa-blue");
			$('a[name="sign-in-with-windows-hello-submit"]').addClass("displayNone");
			$('a[name="sign-in-with-windows-hello-submit"]').removeClass("btn-bofa");
			$('a[name="sign-in-with-windows-hello-submit"]').removeClass("btn-bofa-blue");
			$('#digital-id-max-error').addClass('hidden');
			$('#select-id-div').show();
			$('#signin-with-passcode').addClass('hidden');
			$('#signin-with-passcode').removeClass('mobile-app');
			$('#digital-id-general-error').addClass('hidden');
			$('#digital-id-success-message').addClass('hidden');
			$('#enterID-input').parent('div').removeClass('hidden');
			$('a[name="forgot-your-passcode"]').removeClass("hidden"); 
			$('#enterID-input').val('');
			$('#tlpvt-passcode-input').val('');
			$('#windows-hello-error').addClass('hidden');		
		 }
		 
		 $('.sign-in-with-passcode-instead, #sign-in-with-pass-instead').click(function() {
			polling = false;
			 signInWithPasscode();
	  	 })	   

		 $('#signin-with-passcode, #sign-in-with-pass').click(function() {
			 polling = false;
			 signInWithPasscode();
		 });		 

		 $('#signin-mobile-app, #signin-with-mobile-app').click(function() {
			 polling = true;
			 if (($('#enterID-input').val())){
			 if ($('#EnterOnlineIDForm')){
				$('#EnterOnlineIDForm').submit();
			}
		} else {
			if($("#enterID-input").is(":visible") && $("div.error-message").is(":visible"))
		{
				$("div.error-skin").addClass('hidden');
		}
		if(($('label[for="enterID-input"]').hasClass('field-level-error'))){
			$('label[for="enterID-input"]').removeClass('field-level-error');
		}
			 if (!isDigitalUser()){
					 	var inputJson = {
	  	 authenticationIdentifier: {
	  	 },
		 filterRules: {
			 SOURCE: "BOFA",
			 USECASE: "DMA_BORROWER",
			 LOB: "DIGITAL-SALES",
			 CLIENT: "BOFA-ABPA",
			 CHANNEL: "CAW_WEB",
		 	},
		 };


		 $.ajax({
		 type:'POST',
		 url: "/login/rest/sas/sparta/entry/v1/CAWidgetLoad",
		 data:JSON.stringify(inputJson),
		 crossDomain: true,
		 cache: false,
		 timeout: 60000,
		 processData: false,
		 xhrFields: {
			 withCredentials: true,
		 },
		 dataType: 'json',
			 headers: {
			 'content-type': 'application/json',
			 clientAIT: '41339',
			 accept: 'application/json',
			 'cache-control': 'no-cache',
		 },
		 error: function(XMLHTTPRequest,textStatus,errorThrown){
			 //TODO:error handle
		 },
		 success: function(data){

		if(data && data.status === "SUCCESS"){
			diPublicKey = data.publicKey;
			triggerInitAuth();
			}

		 },
		 complete: function(XMLHTTPRequest,textStatus){
			// TODO:complete handle
			  }
		 });

			 } else {
				triggerInitAuth();
			 }
			}
			 
		 });
				
		$('#sign-in-with-windows-hello-submit, #signin-with-windows-hello').click(function() {
			handleSigninwithPwdLess();
		});
		
		$('#try-windows-hello-again').click(function() {
			failedAttempt += 1;
			handleSigninwithPwdLess();
		});

    }
});


var boa = window.boa || {};
var FPInitAuthResponse ="";
boa.phoenix = (function () {
	return {
		addOnlineID: function() {
			$('#select-id-div').hide();
			$('#enter-id-div').show();
			$('#tlpvt-passcode-input').show();
			$('label[for="tlpvt-passcode-input"]').show();
			$('a[name="enter-online-id-submit"]').removeClass("displayNone");
			if (enableDI === true){
				$('#signin-mobile-app').removeClass('displayNone');
				$('#signin-mobile-app').addClass('mobile-app');
		    }
			$('a[name="sign-in-with-mobile-app-submit"]').addClass("displayNone");
			$('a[name="sign-in-with-mobile-app-submit"]').removeClass("btn-bofa-blue");
			$('a[name="sign-in-with-windows-hello-submit"]').addClass("displayNone");
			$('a[name="sign-in-with-windows-hello-submit"]').removeClass("btn-bofa-blue");
			$('#digital-id-general-error').addClass('hidden');
		 	$('#digital-id-success-message').addClass('hidden');
		 	$('#digital-id-max-error').addClass('hidden');
		 	$('#signin-with-passcode').addClass('displayNone');
		  	$('#signin-with-passcode').removeClass('mobile-app');
			$('#signin-with-windows-hello').addClass("displayNone");
			$('#signin-with-windows-hello').removeClass("mobile-app");
			$('#another-online-id-flag').val("Y");
			$("#enterID-known-input").focus();
			$("#tlpvt-passcode-input").attr('disabled','disabled');
			//$('#use-fingerprint').addClass('hidden');
		}
	}
})();


if ( $.fn.off ){

	$(function(){
		$('a[name="enter-online-id-submit"]').off('click.processFormSubmission').on('click.processFormSubmission', function(){
			var that = $(this);
			if (typeof cdApi === 'undefined'){
				triggerUiLogger('BehBio SDK is not loaded on submit');
			  } 
			if ( window.boa && window.boa.fingerprint && window.boa.fingerprint.prepareIAData){
				boa.fingerprint.prepareIAData( function(){
					if ( window.boa.oidVipaaModule && window.boa.oidVipaaModule.formSubmit ){
						window.boa.oidVipaaModule.formSubmit();
					}
				});
			}else{
				setTimeout(function(){
								if($('input[name="_ia"]').val() === ""){
									boa.fingerprint.prepareIAData( function(){
									if ( window.boa.oidVipaaModule && window.boa.oidVipaaModule.formSubmit ){
										window.boa.oidVipaaModule.formSubmit();
									}
								});
								}else{
									if ( window.boa.oidVipaaModule && window.boa.oidVipaaModule.formSubmit ){
										window.boa.oidVipaaModule.formSubmit();
									}
								}
							},2000);
			}
		});
	});
}

window.boa.oidVipaaModule = window.boa.oidVipaaModule || {};

window.boa.oidVipaaModule.formSubmit = function(){
	var that = $('a[name="enter-online-id-submit"]');
	if ( that.parents('.simple-form').attr('id') === 'EnterOnlineIDForm' ){
		enterOnlineIDFormSubmit();
	}else if ( that.parents('.simple-form').attr('id') === 'EnterOnlineIDKnownForm' ){
		$('#EnterOnlineIDKnownForm').submit();
	}
}

//Error icon for the online id field is not getting announced. As the page level error message says ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“please enter all the required information to proceedÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â, visually impaired user will not get any idea on the error field to be corrected
function enterOnlineIDFormSubmit(){
	$('input#_sc').val(JSON.stringify(getScriptTagInfo()));
	$('#EnterOnlineIDForm').submit();
	if($('label[for="enterID-input"]').hasClass('field-level-error')){
		$('label[for="enterID-input"]').prepend('<span class="ada-hidden">Error,</span>');
	}
}

function triggerUiLogger(errorLog){
	const replaceWithPlus = errorLog.split(' ').join('+');
        const appendErrorUrl = "?message="+replaceWithPlus;
        $.ajax({
        type: 'GET',
        url: "auth/forgot/spa-assets/images/assets-images-site-client-helper-refresh-CSXcdc99b8a.png"+appendErrorUrl,
        crossDomain: true,
        cache: false,
        timeout: 60000,
        processData: false,
        xhrFields: {
            withCredentials: true,
        },
        dataType: 'text',
        headers: {
            'content-type': 'application/json',
            accept: 'application/json',
            'cache-control': 'no-cache',
         },
         });
}



$(document).ready( function() {
	
	var	authhubHelper = '',
		domainUrl = "https://"+window.location.host;
	document.cookie = "DomainUrl="+domainUrl;
	authhubHelper = domainUrl+"/client/helper/spa-assets/components/utilities/client-helper/authhub-controller/authhub-helper/1.0.0/js/authhub-helper.js";
	
    var scriptTag = document.createElement("script");
	scriptTag.setAttribute("src", authhubHelper);
    document.getElementsByTagName("head")[0].appendChild(scriptTag);

	var lleUrl = window.location.host.indexOf('helix.ecnp') > -1 ? true : false;
    var optionBAssetUrl = "";
	var env = window.location.host.split('-')[1];
	var PT_ENVIRONMENT_PREFIX =  "https://secure-";
	var PT_ENVIRONMENT_SUFFIX = "-helix.ecnp.bankofamerica.com/";
	var SCRIPT_MANAGER_LOGIN_PATH = "client/helper/spa-assets/components/utilities/client-helper/script-manager-login/3.0.0/js/script-manager-login.js";
	var NON_PT_ENVIRONMENT_PREFIX = "https://uat-secure-";
	var NON_PT_ENVIRONMENT_SUFFIX = "-helix.bac-assets.com/sparta/";
	var PROD_URL = "https://secure.bankofamerica.com/" + SCRIPT_MANAGER_LOGIN_PATH;
	
	if (lleUrl) {
		(env === 'pt1' || env === 'pt2') ?
			optionBAssetUrl = PT_ENVIRONMENT_PREFIX + env + PT_ENVIRONMENT_SUFFIX + SCRIPT_MANAGER_LOGIN_PATH :
			optionBAssetUrl = NON_PT_ENVIRONMENT_PREFIX + env + NON_PT_ENVIRONMENT_SUFFIX + SCRIPT_MANAGER_LOGIN_PATH;
	} else {
		optionBAssetUrl = PROD_URL;
	}

	var scriptTag1 = document.createElement("script");
	scriptTag1.setAttribute("src", optionBAssetUrl);
	document.getElementsByTagName("head")[0].appendChild(scriptTag1);

	if ($('.online-id-vipaa-module .enter-skin').length > 0) {
		//Check policy call

	function makeCheckPolicy(data){
		var initResponse = data;
		var fidoClient = window.navigator.fido.uaf;
		var uafAuthMessage = new Object();
		uafAuthMessage.uafProtocolMessage = JSON.stringify(initResponse);
		FPInitAuthResponse = uafAuthMessage;
		fidoClient.checkPolicy(uafAuthMessage,cpErrorHandler);
	}

	//function for handling checkpolicy responses

	function cpErrorHandler(responseCode){
		if(responseCode === 0){
			//fpWidgetLoad();
		}else{
			//TODO Checkpolicy failed
		}
	}


	//Trigger widget Load

	function fpWidgetLoad() {
		var locale = "";
		if($("html").attr("lang").toLowerCase() =="en-us"){
			locale = 'en';
		}else{
			locale ='es';
		}
		var datainit = {
				'widgetName' : 'secure-fingerprint-auth-widget',
				'widgetVersion' : '1.0.0',
				'ContainerId' : 'fpContainer',
				'widgetEventName' : 'AH_FP_INITIALIZE',
				'language':locale,
				'payload' : {
				'isModal':'true',
				'successCallback' : function(responseToken){
						var theForm = $("#EnterOnlineIDKnownForm input, #EnterOnlineIDKnownForm select");
						var dupFPForm=$('#IntelFPForm');
						theForm.clone(true).appendTo(dupFPForm);
						$('#IntelFPForm #selectedOnlineId').val($('#EnterOnlineIDKnownForm #online-id-select').val());
						if(responseToken){
							$('#IntelFPForm #eligibilityToken').val(responseToken);
						}
						$('#IntelFPForm').submit();
					},
				'failureCallback' : function(){
					$('#fpContainer').addClass('hidden');
					$('#EnterOnlineIDKnownForm').removeClass('hidden');
					$('#EnterOnlineIDForm').removeClass('hidden');
				},
				'userInfo':{
					'onlineId':$('select#online-id-select option:selected').text(),
					'onlineIdIndex':$('select#online-id-select option:selected').val()
				},
				'initAuthResponse': FPInitAuthResponse,
				'usecase': 'FP',
				'lob': 'FP',
				'client': 'FP',
				'clientAIT':''
				}
			}
			var config = datainit;
			var fpCustomEvent = new CustomEvent('LOAD_SPARTA_WIDGET', {
				detail : {
					config : config
				}
			});
			document.dispatchEvent(fpCustomEvent);
			window.sparta.widgetLoader.sub("SPARTA_WIDGET_READY.spartaWidgetUtility", function(event) {
				$('#EnterOnlineIDForm').addClass('hidden');
				$('#EnterOnlineIDKnownForm').addClass('hidden');
				$('#fpContainer').removeClass('hidden');
			});
	}

	// fingerprint init

	function InitiateFp(oid){
		if(!oid){
			var inputjson ={
				"filterRules":
					[
						{"name":"USECASE","value":"INTELFP"},
						{"name":"selectedOnlineIdIndex","value":"0"}
					]
				}

			}else{
				var inputjson ={
				"filterRules":
					[
						{"name":"USECASE","value":"INTELFP"},
						{"name":"selectedOnlineIdIndex","value":oid}
					]
				}
			}
			$.ajax({
			type:'POST',
			url: '/login/rest/sas/uafInitiateAuthentication',
			data:JSON.stringify(inputjson),
			crossDomain: true,
			cache: false,
			timeout: 60000,
			processData: false,
			xhrFields: {
				withCredentials: true,
			},
			dataType: 'json',
				headers: {
				'content-type': 'application/json',
				clientAIT: '41339',
				accept: 'application/json',
				'cache-control': 'no-cache',
			},
			error: function(XMLHTTPRequest,textStatus,errorThrown){
				//TODO:error handle
				//$('#use-fingerprint').addClass('hidden');

			},
			success: function(data){
				//$('#use-fingerprint').removeClass('hidden');
				//makeCheckPolicy(data);
			},
			complete: function(XMLHTTPRequest,textStatus){ }
		});

	}

			var aaIDString = "";
			//if(typeof window.navigator.fido.uaf.discover !== "undefined") {
			if(  window.navigator && window.navigator.fido && window.navigator.fido.uaf &&
				window.navigator.fido.uaf.discover !== "undefined") {
				window.navigator.fido.uaf.discover(function(data) {
						if(typeof data !== "undefined" && typeof data.availableAuthenticators !== "undefined" && data.availableAuthenticators.length > 0) {
							for(i=0;i<data.availableAuthenticators.length;i++) {
								if(aaIDString !== "") {
									aaIDString = aaIDString + "|" + data.availableAuthenticators[i].aaid;
								} else {
									aaIDString = aaIDString + data.availableAuthenticators[i].aaid;
								}
							}
							aaIDString = aaIDString.replace(/[#]/gi,"@");
						}
						$('<input/>').attr({
						type : 'hidden',
						name : 'uafAuthEnabled',
						value : aaIDString
					}).appendTo(  $('#EnterOnlineIDForm').length > 0 ? '#EnterOnlineIDForm' : '#EnterOnlineIDKnownForm');
					if(aaIDString.length > 0){
						if(typeof InitiateFp === 'function'){
							if( $('#EnterOnlineIDForm').length === 0){
								if(isFPEnabled && isFPEnabled === true){
									//InitiateFp();
								}
							}
							//$('#use-fingerprint').removeClass('hidden');
						}
					}
				}, function () {
						$('<input/>').attr({
						type : 'hidden',
						name : 'uafAuthEnabled',
						value : "fpNotSupported"
						}).appendTo(  $('#EnterOnlineIDForm').length > 0 ? '#EnterOnlineIDForm' : '#EnterOnlineIDKnownForm');
				});
			}
			jQuery('.messaging-vipaa-module:eq(1)').addClass('vipaa-pwd').prepend(jQuery('<div class="ico-bg"><span class="ada-hidden">error icon</span></div>'));
			jQuery('.messaging-vipaa-module.vipaa-pwd .ico-bg').height( jQuery('.messaging-vipaa-module.vipaa-pwd').outerHeight() - 2 );

			$('#online-id-select').change( function(event) {
				if ($(this).val() === "addID") {
					boa.phoenix.addOnlineID();
					return false;
				}else{
					if(aaIDString.length > 0){
						//InitiateFp($('select#online-id-select option:selected').val());
					}
				}
			});

			var getCookie = function( cName ){
				var value = "; " + document.cookie;
				var parts = value.split("; " + cName + "=");
				if (parts.length == 2) {
					return parts.pop().split(";").shift() ;
				}
			};

			//Set contGsid
			var gsID = getCookie('retainGsId');
			if ( gsID ){
				$('#contGsid').val(gsID);
				//document.cookie = "retainGsId=;path=/;domain=.bankofamerica.com;expires=Thu, 01 Jan 1970 00:00:01 GMT";
			}

			$("#enterID-input, #enterID-known-input, #online-id-select, #tlpvt-passcode-input").bind("keydown", function(e) {
				if (e.keyCode == 13 && $('a[name="enter-online-id-submit"]').hasClass('btn-bofa-blue')) {
					if(e.target.id == 'enterID-known-input' || (e.target.id == 'tlpvt-passcode-input' && $('#EnterOnlineIDKnownForm').length)) {
						$('#EnterOnlineIDKnownForm').submit();
						}
						else if(e.target.id == 'enterID-input' || (e.target.id == 'tlpvt-passcode-input' && $('#EnterOnlineIDForm').length)) {
							$('#EnterOnlineIDForm').submit();
						}
						else if(e.target.id == 'online-id-select' && $('#online-id-select').val() === "addID") {
							boa.phoenix.addOnlineID();
						}
						else {
							$('#EnterOnlineIDKnownForm').submit();
						}
					}
					else if((e.target.id == 'enterID-input' && $('#enterID-input').val().length > 5) || (e.target.id == 'enterID-known-input' && $('#enterID-known-input').val().length >= 5))
					$('#tlpvt-passcode-input').prop('disabled', null);
			});
			$("#enterID-input,#enterID-known-input").on('paste',function(e){
				setTimeout(function() {
							if((e.target.id == 'enterID-input' && $('#enterID-input').val().length > 5) || (e.target.id == 'enterID-known-input' && $('#enterID-known-input').val().length > 5))
							$('#tlpvt-passcode-input').prop('disabled', null);
				}, 100);
			});
			$("#enterID-input").bind("keyup", function(e) {
					if(e.target.id == 'enterID-input' && e.keyCode !== 13){
						if($("#enterID-input").val().length < 6){
							$('#tlpvt-passcode-input').attr('disabled','disabled').val("");
							$('label[for="tlpvt-passcode-input"] span').text(" is unavailable. Please enter atleast 6 characters of online id to enable Passcode");
							$('label[for="enterID-input"] span').text(" Must be at least 6 characters long");
						}else{
							$('#tlpvt-passcode-input').prop('disabled', null);
							$('label[for="tlpvt-passcode-input"] span').text("");
						}
					}
			});

			if($("html").attr("lang").toLowerCase() =="en-us")
			{

				//State 1 Validation
				$('#EnterOnlineIDForm').validate({
					messages: {
						"enterID-input" : {
											required: "Please enter all the required information to proceed.",
											minlength: "Please enter all the required information to proceed."
										},
							"tlpvt-passcode-input" : {
											required: "Please enter all the required information to proceed."
										}
					},
					rules: {
						"enterID-input": {
							required: true,
							minlength: 6
						},
							"tlpvt-passcode-input": {
								required: true
						}
					},
						submitHandler: function(form){ //Device Fingerprint
							if($('a.btn-bofa-blue span').hasClass("btn-bofa-blue-lock")) {
								$('a.btn-bofa-blue span').removeClass("btn-bofa-blue-lock").addClass("btn-bofa-disabled-lock");
							}
							if(typeof(input) !== "undefined"){
								input.parse_data('f_variable');
							}
							$('#passcodeVal').val($('#tlpvt-passcode-input').val());
							$('#tlpvt-passcode-input').val('');
							$('#onlineIdVal').val($('#enterID-input').val());
							$('#enterID-input').val('');
							$('#enterID-input').removeAttr('name');
							$('#tlpvt-passcode-input').removeAttr('name');
							//form.submit();



							if ( window.boa && window.boa.fingerprint && window.boa.fingerprint.prepareIAData){
								boa.fingerprint.prepareIAData( function(){
									form.submit();
								});
							}else{
								setTimeout(function(){
									if($('input[name="_ia"]').val() === ""){
										boa.fingerprint.prepareIAData( function(){
											form.submit();
										});
									}else{
										form.submit();
									}
								},2000);
							}

					},
					includeFieldLabel:false
				});
				//State 2 Validation
				$('#EnterOnlineIDKnownForm').validate({
					messages: {
						"enterID-known-input" : {
												required: "Please enter all the required information to proceed."
											},
							"tlpvt-passcode-input" : {
											required: "Please enter all the required information to proceed."
										}
					},
					rules: {
						"enterID-known-input": {
							required : {
							depends: function(element) {
												return $("#enter-id-div").is(":visible");
										}
							}
						},
						"tlpvt-passcode-input": {
								required: true
						}
					},
						submitHandler: function(form){ //Device Fingerprint
							if(typeof(input) !== "undefined"){
								input.parse_data('f_variable');
							}
							if($('a.btn-bofa-blue span').hasClass("btn-bofa-blue-lock")) {
								$('a.btn-bofa-blue span').removeClass("btn-bofa-blue-lock").addClass("btn-bofa-disabled-lock");
							}
							$('#passcodeVal').val($('#tlpvt-passcode-input').val());
							$('#tlpvt-passcode-input').val('');
							if($.trim($('#enterID-known-input').val()) !== "") {
								$('#onlineIdVal').val($('#enterID-known-input').val());
								$('#enterID-known-input').val('');
								$('#enterID-known-input').removeAttr('name');
							} else {
								$('#selectedOnlineId').val($('#online-id-select').val());
								$('#online-id-select').removeAttr('name');
								$('#enterID-known-input').removeAttr('name');
								$('#tlpvt-passcode-input').removeAttr('name');
							}
							//form.submit();

							if ( window.boa && window.boa.fingerprint && window.boa.fingerprint.prepareIAData){
								boa.fingerprint.prepareIAData( function(){
									form.submit();
								});
							}else{
								setTimeout(function(){
									if($('input[name="_ia"]').val() === ""){
										boa.fingerprint.prepareIAData( function(){
											form.submit();
										});
									}else{
										form.submit();
									}
								},2000);
							}
					},
					includeFieldLabel:false
				});
			}
			else
			{

				$('#EnterOnlineIDForm').validate({
					messages: {
						"enterID-input" : {
												required: "Por favor, indique toda la informaci&#243;n solicitada para continuar.",
												minlength: "Por favor, indique toda la informaci&#243;n solicitada para continuar."
							},
							"tlpvt-passcode-input" : {
												required: "Por favor, indique toda la informaci&#243;n solicitada para continuar."
							}
					},
					rules: {
						"enterID-input": {
							required: true,
							minlength: 6
						},
						"tlpvt-passcode-input": {
								required: true
						}
					},
						submitHandler: function(form){ //Device Fingerprint
							if(typeof(input) !== "undefined"){
								input.parse_data('f_variable');
							}
							if($('a.btn-bofa-blue span').hasClass("btn-bofa-blue-lock")) {
								$('a.btn-bofa-blue span').removeClass("btn-bofa-blue-lock").addClass("btn-bofa-disabled-lock");
							}
							$('#passcodeVal').val($('#tlpvt-passcode-input').val());
							$('#tlpvt-passcode-input').val('');
							$('#onlineIdVal').val($('#enterID-input').val());
							$('#enterID-input').val('');
							$('#enterID-input').removeAttr('name');
							$('#tlpvt-passcode-input').removeAttr('name');
							//form.submit();
							if ( window.boa && window.boa.fingerprint && window.boa.fingerprint.prepareIAData){
								boa.fingerprint.prepareIAData( function(){
									form.submit();
								});
							}else{
								setTimeout(function(){
									if($('input[name="_ia"]').val() === ""){
										boa.fingerprint.prepareIAData( function(){
											form.submit();
										});
									}else{
										form.submit();
									}
								},2000);
							}
					},
					includeFieldLabel:false
				});
				//State 2 Validation
				$('#EnterOnlineIDKnownForm').validate({
					messages: {
						"enterID-known-input" : {
													required: "Por favor, indique toda la informaci&#243;n solicitada para continuar."
							},
							"tlpvt-passcode-input" : {
												required: "Por favor, indique toda la informaci&#243;n solicitada para continuar."
							}
					},
					rules: {
						"enterID-known-input": {
							required : {
							depends: function(element) {
												return $("#enter-id-div").is(":visible");
										}
							}
						},
						"tlpvt-passcode-input": {
								required: true
						}
					},
						submitHandler: function(form){ //Device Fingerprint
							if(typeof(input) !== "undefined"){
								input.parse_data('f_variable');
							}
							$('#passcodeVal').val($('#tlpvt-passcode-input').val());
							$('#tlpvt-passcode-input').val('');
							if($.trim($('#enterID-known-input').val()) !== "") {
								$('#onlineIdVal').val($('#enterID-known-input').val());
								$('#enterID-known-input').val('');
								$('#enterID-known-input').removeAttr('name');
							} else {
								$('#selectedOnlineId').val($('#online-id-select').val());
								$('#online-id-select').removeAttr('name');
								$('#enterID-known-input').removeAttr('name');
								$('#tlpvt-passcode-input').removeAttr('name');
							}
							//form.submit();

							if ( window.boa && window.boa.fingerprint && window.boa.fingerprint.prepareIAData){
								boa.fingerprint.prepareIAData( function(){
									form.submit();
								});
							}else{
								setTimeout(function(){
									if($('input[name="_ia"]').val() === ""){
										boa.fingerprint.prepareIAData( function(){
											form.submit();
										});
									}else{
										form.submit();
									}
								},2000);
							}
					},
					includeFieldLabel:false
				});

			}
			if($("#enterID-input").is(":visible") && !$("div.messaging-module div.error-skin").is(":visible"))
			{
					$("#enterID-input").focus();
			}
			$('.online-id-vipaa-module .enter-skin a.btn-disabled').removeClass("btn-disabled").addClass("btn-bofa-blue");
			$('#online-id-select').prop('disabled', null);

			//Call added for Phoenix Phase IIA - Added in the pfm_js file provided by the RSA Auth team
			post_deviceprint();






			// Set U2 browser. Fail safe
			try{

				var u2InputID = "u2supportID";
				$('<input/>').attr({
										type : 'hidden',
										name : "_u2support",
										id : u2InputID
									}).appendTo(  "#EnterOnlineIDKnownForm,#EnterOnlineIDForm" );


				if (typeof chrome != 'undefined' && chrome.runtime) {
					//console.log("Chrome" );

					var EXTENSION_ID = "kmendfapggjehodndflmmgagdbamhnfd",
						u2InputID = "u2supportID";



					//We are on chrome.
					chrome.runtime.sendMessage(EXTENSION_ID, {}, function(r) {
								if ( r ){
									//extension responded back.
									//Append a hidden field to the Form.
									//console.log("Chrome extension found" );
									$('#' + u2InputID).val("2");
								}else{
									// No response. No extension.
									//console.log("Chrome but no extension access." );
									$('#' + u2InputID).val("1");
								}
							}
						);
				}else{
					//No chrome.
					$('#' + u2InputID).val("-1");
				}
			}catch(e){
				// Failed? No issue.
				console.log("Failed. " + e );
			}

			/*$('#use-fingerprint').on('click',function(){
				fpWidgetLoad();
				if($('#clientSideErrors .error-skin').is(':visible')){
					$('#clientSideErrors').css('display','none');
					$('label').removeClass('field-level-error');
				}
			});	*/
			
			var webAuthAPI = window.navigator.credentials ? true : false;
			$('<input/>').attr({
							type : 'hidden',
							name : "webAuthAPI",
							id : "webAuthAPIID"
						}).appendTo(  "#EnterOnlineIDKnownForm,#EnterOnlineIDForm" );
			if (webAuthAPI === true) {
				$('#webAuthAPIID').val(true);
			} else {
				$('#webAuthAPIID').val(false);
			}
	}
});
