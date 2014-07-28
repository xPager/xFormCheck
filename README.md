xFormCheck
==========
<br>
Formular Check

HTML
----

``` html
<form name="form" method="post" action="">
	<div class="inline checkboxCheck input_must">
		<label>Gender</label> <span class="star">*</span><br />
		<input type="radio" name="gender" value="male">
		<label for="male" class="inline">Male</label><br />
		<input type="radio" name="gender" value="female">
		<label for="female" class="inline">Female</label><br />
	</div>
	<label>Firstname</label>
	<input type="text" name="firstname" class="input_must"><br />
	<label>Lastname</label>
	<input type="text" name="lastname" class="input_must"><br />
	<label>E-Mail</label>
	<input type="email" name="email" data-equal="#email2" class="input_mail"><br />
	<label>E-Mail (Check)</label>
	<input type="email" name="email2" id="email2" class="input_mail"><br />
	<label>Phone</label>
	<input type="text" name="phone" class="input_tel opt"><br />
	<label>Productnummber</label>
	<input type="text" name="produktenummer" class="input_reg" data-reg="p+[0-9]{5}" /><br />
  	<input type="submit" name="submit" value="Send">
</form>
```


Script
----

``` js
$(document).ready(function(){
	$("form").xFormCheck();
});

// OR

$(document).ready(function(){
	var formCheck = new xFormCheck({
		formID:"#form1",
		onChecked:function(self){console.log(self.status);}
	});
	
	// + Extern Send Button

	$('#ex_button').click(function(){ 	// Click event on external button / link
		if(formCheck.formCheck()){ 	// Check if form is "True"
			$('#form1').submit(); 	// Send form
		}
	});

});


```

Settings
----

``` js
$(document).ready(function(){
	$("form").xFormCheck({
		formID: false,							// Form ID
		formObject:false,						// Form Object
		skey: 0,								// Spam check (key)
		sfeldID: 'sfeldID',						// Spam check (Input ID)
		classnameDefault: 'input_must',			// Not NULL class
		classnameNum: 'input_num',				// Nummber class
		classnameDate: 'input_date',			// Date class
		classnameMail: 'input_mail',			// Mail class
		classnameTel: 'input_tel',				// Tel class
		classnameUrl: 'input_url',				// Url class
		classnameReg: 'input_reg',				// RegExp class code (data-reg="^\d{1,2}\$")
		classnameTrue: 'input_true',			// True class
		classnameFalse: 'input_false',			// False class
		classnameTapFalse: 'tap_false',			// Bootstrap (Tabbabke)
		classnameOptional: 'opt',				// Optional Null or (E-Mail,Date.....)
		onError:false,							// Function on Error
		onChecked:false,						// Function is Checkt
		ajaxSubmit: false,						// Sendform white Ajax
		outputID: false,						// Ajax ID Output Field
		outputErrorID: 'FormError',				// Ajax ID Output Error Field
		beta: false	
	});
});
```
