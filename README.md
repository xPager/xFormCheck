xFormCheck
==========
<br>
Formular Check

HTML
----

``` html demo
<form name="form" method="post" action="">
  <input type="text" name="firstname" class="input_must">
  <input type="email" name="email" class="input_mail">
  <input type="submit" name="submit" value="Send">
</form>
```


Script
----

``` js
  $(document).ready(function(){
    $("form").xFormCheck();
  });
```

Settings
----

``` js
  $(document).ready(function(){
    $("form").xFormCheck({
      skey: 0,
  		sfeldID: 'sfeldID',
  		classnameDefault: 'input_must',
  		classnameNum: 'input_num',
  		classnameDate: 'input_date',
  		classnameMail: 'input_mail',
  		classnameTel: 'input_tel',
  		classnameUrl: 'input_url',
  		classnameReg: 'input_reg',
  		classnameTrue: 'input_true',
  		classnameFalse: 'input_false',
  		classnameTapFalse: 'tap_false',
  		classnameOptional: 'opt',
  		outputErrorID: 'FormError',
  		onError:false,
  		onChecked:false,
  		ajaxSubmit: true,
  		outputID: false,
  		beta: false
    });
  });
```
