xFormCheck
==========
<br>
Formular Check

HTML
----

``` html
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
