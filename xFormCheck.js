/*#####################################################################################################################
                                                                                                              
                    PPPPPPPPPPPPPPPPP                                                                              
                    P::::::::::::::::P                                                                             
                    P::::::PPPPPP:::::P                                                                            
                    PP:::::P     P:::::P                                                                           
xxxxxxx      xxxxxxx  P::::P     P:::::Paaaaaaaaaaaaa     ggggggggg   ggggg    eeeeeeeeeeee    rrrrr   rrrrrrrrr   
 x:::::x    x:::::x   P::::P     P:::::Pa::::::::::::a   g:::::::::ggg::::g  ee::::::::::::ee  r::::rrr:::::::::r  
  x:::::x  x:::::x    P::::PPPPPP:::::P aaaaaaaaa:::::a g:::::::::::::::::g e::::::eeeee:::::eer:::::::::::::::::r 
   x:::::xx:::::x     P:::::::::::::PP           a::::ag::::::ggggg::::::gge::::::e     e:::::err::::::rrrrr::::::r
    x::::::::::x      P::::PPPPPPPPP      aaaaaaa:::::ag:::::g     g:::::g e:::::::eeeee::::::e r:::::r     r:::::r
     x::::::::x       P::::P            aa::::::::::::ag:::::g     g:::::g e:::::::::::::::::e  r:::::r     rrrrrrr
     x::::::::x       P::::P           a::::aaaa::::::ag:::::g     g:::::g e::::::eeeeeeeeeee   r:::::r            
    x::::::::::x      P::::P          a::::a    a:::::ag::::::g    g:::::g e:::::::e            r:::::r            
   x:::::xx:::::x   PP::::::PP        a::::a    a:::::ag:::::::ggggg:::::g e::::::::e           r:::::r            
  x:::::x  x:::::x  P::::::::P        a:::::aaaa::::::a g::::::::::::::::g  e::::::::eeeeeeee   r:::::r            
 x:::::x    x:::::x P::::::::P         a::::::::::aa:::a gg::::::::::::::g   ee:::::::::::::e   r:::::r            
xxxxxxx      xxxxxxxPPPPPPPPPP          aaaaaaaaaa  aaaa   gggggggg::::::g     eeeeeeeeeeeeee   rrrrrrr            
                                                                   g:::::g                                         
                                                       gggggg      g:::::g                                         
                                                       g:::::gg   gg:::::g                                         
                                                        g::::::ggg:::::::g                                         
                                                         gg:::::::::::::g                                          
                                                           ggg::::::ggg                                            
                                                              gggggg
															  
© xPager - xFormCheck - Manuel Kleinert - www.xpager.ch - info(at)xpager.ch - v 0.1.1 - 28.07.2014
Controls with jQuery 2.1.1
#####################################################################################################################*/

(function($){
	$.fn.xFormCheck = function(options){
		if(!options){var options = {};}
		return this.each(function() {
			 options.formObject = this;
			new xFormCheck(options);
		});
	}
}(jQuery));

var xFormCheck = function(options) {
	// Set Options
	this.options = $.extend({
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
	},options);
	
	// Variabeln
	this.status;
	this.errormessage;
	this.datepicker;
	
	// Options to Var
	this.id = this.options.formID;
	this.formObject = this.options.formObject;
	this.classnameDefault = this.options.classnameDefault;
	this.classnameNum = this.options.classnameNum;
	this.classnameDate = this.options.classnameDate;
	this.classnameMail = this.options.classnameMail;
	this.classnameTel = this.options.classnameTel;
	this.classnameUrl = this.options.classnameUrl;
	this.classnameReg = this.options.classnameReg;
	this.classnameTrue = this.options.classnameTrue;
	this.classnameFalse = this.options.classnameFalse;
	this.classnameTapFalse = this.options.classnameTapFalse;
	this.classnameOptional =  this.options.classnameOptional;
	this.sessionPath = this.options.sessionPath;
	this.skey = this.options.skey;
	this.sfeldID = this.options.sfeldID;
	this.outputErrorID = this.options.outputErrorID;
	this.onError = this.options.onError;
	this.onChecked = this.options.onChecked;
	this.outputID = this.options.outputID;
	this.ajaxSubmit = this.options.ajaxSubmit;
	// Normales Formular oder Iframe Form Objekt
	if(!this.formObject){
		this.form = $(this.id);
	}else{
		this.form = this.formObject;
	}
	// Output Div is false
	if(!this.outputID){
		this.outputID = $(this.form).parent("div");
	}
	// Required
	this.requiredList = new Array();	
	// Init
	this.init();
}

// Functions
xFormCheck.prototype = {
	
	init:function(){
		var self = this;
		// Status
		this.firstCheck = false;
		// Fokus (Label to Form)
		$(this.form).find("label").click(function(){
			$(this).parent("div").find("input,select,textarea").focus();
		});
		// Submit Event
		$("body").off("submit",this.form);
		$("body").on("submit",this.form,function(event){
			if(!$(this).hasClass("donotsend")){
				event.preventDefault(event);
				self.formCheck(function(){
					$(self.form).addClass("donotsend");
					if(self.ajaxSubmit){
						if(!self.sendByAjax()){
							$(self.form).removeClass("donotsend");	
						}
					}else{
						$(self.form).submit();
					}
				});
			}
		});

		// Checkbox Event
		$("body").find("input[type='checkbox']").on("click",this.form,function(){
			if(self.firstCheck){self.formCheck();}	
		});
		// Live Check Event
		$("body").find("input,select,textarea").on("keyup mouseenter change",this.form,function(){ //Iframe Neu
			if(self.firstCheck){self.formCheck();}
		});
		// Check Date Picker
		if($(this.form).find("input[data-type='datepicker']").length){
			this.setDatePicker();
		}
		// Required (Multi Select Check)
		$(this.form).find("select[data-required]").each(function(index,obj){
			if($(obj).attr("data-required") != ""){
				var id = $(obj).attr("data-required").split(",");
				$(id).each(function(i,o) {
					if($.inArray(o,self.requiredList) == -1){
						self.requiredList.push(o);
					}
				});
			}
		});		
	},
	
	formCheck:function(fx){
		var self = this;		
		this.status = true;
		this.firstCheck = true;
		this.errormessage = new Array();
		// Required (Multi Select Check)
		this.isRequired();
		// Is Equal
		this.isEqual();
		$(this.form).find("input,select,textarea").not(".donotcheck").each(function(i,obj){
			$(this).removeClass(self.classnameTrue);
			$(this).removeClass(self.classnameFalse);
			$(this).parent("div.customselect").removeClass(self.classnameTrue);
			$(this).parent("div.customselect").removeClass(self.classnameFalse);
			switch ($(this).attr("name")) {
				// Spamfilter
				case(self.sfeldID):
					if ($(this).val() != self.skey){
						$(this).addClass(self.classnameFalse);
						self.status = false;
						self.errormessage.push("Spamfilter");
					}else{
						$(this).addClass(self.classnameTrue);
					} 
				break;
				default:
					// Checkbox oder Radiobox (Must Class)
					if(($(this).attr("type") == "checkbox" || $(this).attr("type") == "radio") && $(this).parents(".checkboxCheck").hasClass(self.classnameDefault)){
						var checkStatus = false;
						$(this).parents(".checkboxCheck").find("input").each(function(i,obj){
							if(this.checked){
								$(this).parents(".checkboxCheck").addClass(self.classnameTrue);
								$(this).parents(".checkboxCheck").removeClass(self.classnameFalse);
								checkStatus = true;	
							}else{
								if(!checkStatus){
									$(this).parents(".checkboxCheck").addClass(self.classnameFalse);
									$(this).parents(".checkboxCheck").removeClass(self.classnameTrue);
								}
							}
						});
						if(!checkStatus){
							self.status = false;
							self.errormessage.push($(this).attr("name"));
						}
						
					}
					// Must Felder (Class)
					if($(this).hasClass(self.classnameDefault)){
						if ($(this).val() == ""){
							$(this).addClass(self.classnameFalse);
							$(this).parent("div.customselect").addClass(self.classnameFalse);
							self.status = false;
							self.errormessage.push($(this).attr("name"));
						}else{
							$(this).addClass(self.classnameTrue);
							$(this).parent("div.customselect").addClass(self.classnameTrue);
						}
					}
					// Optional Abfrage
					if(self.isOpt(this) && $(this).val() == ""){ 
						$(this).addClass(self.classnameTrue);
					}else{
						// Num Felder (Class)
						if($(this).hasClass(self.classnameNum)){
							if (isNaN($(this).val()) || $(this).val() == ""){
								$(this).addClass(self.classnameFalse);
								self.status = false;
								self.errormessage.push($(this).attr("name"));
							}else{
								$(this).addClass(self.classnameTrue);
							}
						}
						// E-Mail Felder (Class)
						if($(this).hasClass(self.classnameMail)){
							if (!self.isEmail($(this).val())) {
								$(this).addClass(self.classnameFalse);
								self.status = false;
								self.errormessage.push($(this).attr("name"));
							} else {
								$(this).addClass(self.classnameTrue);
							}
						}
						// Date Felder (Class)
						if($(this).hasClass(self.classnameDate)){
							if(!self.isDate($(this).val())){
								$(this).addClass(self.classnameFalse);
								self.status = false;
								self.errormessage.push($(this).attr("name"));
							} else {
								$(this).addClass(self.classnameTrue);
							}
						}
						// Telefon Felder (Class)
						if($(this).hasClass(self.classnameTel)){
							if (!self.isTel($(this).val())) {
								$(this).addClass(self.classnameFalse);
								self.status = false;
								self.errormessage.push($(this).attr("name"));
							} else {
								$(this).addClass(self.classnameTrue);
							}
						}
						// URL Felder (Class)
						if($(this).hasClass(self.classnameUrl)){
							if (!self.isUrl($(this).val())) {
								$(this).addClass(self.classnameFalse);
								self.status = false;
								self.errormessage.push($(this).attr("name"));
							} else {
								$(this).addClass(self.classnameTrue);
							}
						}
						// RegExp (Prüfen nach Code = http://de.selfhtml.org/javascript/objekte/regexp.htm)
						if($(this).hasClass(self.classnameReg)){
							if (!self.regExpCheck($(this).attr("data-reg"),$(this).val())) {
								$(this).addClass(self.classnameFalse);
								self.status = false;
								self.errormessage.push($(this).attr("name"));
							} else {
								$(this).addClass(self.classnameTrue);
							}
						}
					}
				break;
			}
		});
		// Tap Check (Inner Iframe)
		this.tabCheck();
		// Übergebene Function
		if(this.status && fx){
			fx();
		}
		if(!this.status && this.onError){
			this.onError();	
		}
		if(this.onChecked){this.onChecked();}
		return this.status;
	},
	
	// TabCheck (Backend & jQueryUI Tabs)
	tabCheck:function(){
		var self = this;
		// Backend
		var tabbable = $(this.form).parents(".tabbable");
		if($(tabbable).length == 0){
			tabbable = $(this.form).find(".tabbable");
		}
		$(tabbable).find(".nav-tabs li").each(function(i, obj) {
			$(obj).removeClass(self.classnameTapFalse);
			if($(tabbable).find($.trim($(obj).children("a").attr("href"))).find("."+self.classnameFalse).length > 0){
				$(obj).addClass(self.classnameTapFalse);
			}
		});
		// jQueryUI Tabs
		$(this.form).find("#tabs li").each(function(i, obj) {
			$(obj).removeClass(self.classnameTapFalse);
			if($(self.form).find($.trim($(obj).children("a").attr("href"))).find("."+self.classnameFalse).length > 0){
				$(obj).addClass(self.classnameTapFalse);
			}
		});
	},
	
	// Funktion EMail Prüfen
	isEmail:function(email){
		return  this.regExpCheck(/^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,email);	
	},
	
	// Funktion EMail Prüfen
	isDate:function(date){
		return  this.regExpCheck(/^\d{1,2}\.\d{1,2}\.\d{4}$/,date);	
	},
	
	// Funktion Telefon Prüfen
	isTel:function(number){ 
        return  this.regExpCheck("^((\\+|00)[1-9]\\d{0,3}|0 ?[1-9]|\\(00? ?[1-9][\\d ]*\\))[\\d\\-/ ]*$",number);
	},
	
	isUrl:function(url){
		return  this.regExpCheck("^(http|https)://(www.|)+([a-zA-Z0-9\-_]{3,}(.+[a-zA-Z0-9-_]{2,4})+)?(((/{1}[a-zA-Z_=-]+)*)?)$",url);
	},
	
	// Funktion RegExp Prüfen
	regExpCheck:function(reg,string){
		var regex = new RegExp(reg);
		return regex.test(string);	
	},
	
	// Function Optional Check
	isOpt:function(obj){
		return $(obj).hasClass(this.classnameOptional);
	},
	
	isRequired:function(){
		var self = this;
		var reOptList = "";
		$(this.form).find("select[data-required] option:selected").each(function(i,obj) {
			if($(obj).attr("data-required") != "" && typeof $(obj).attr("data-required") != 'undefined' && $(this).val() != ""){
				reOptList += $(obj).attr("data-required")+",";
			}
		});
		
		var id = reOptList.split(",");
		var idList = new Array();
		$.each(id,function(i,o){
			if ($.inArray(o,idList) == -1 && o != ""){
				idList.push(o);
			}
		});
		
		$(this.requiredList).each(function(i,obj){
			if($(idList).length){
				$(obj).addClass("donotcheck");
				$(obj).removeClass(self.classnameFalse);
				if($.inArray(obj,idList) > -1){
					$(obj).removeClass("donotcheck");	
				}
			}
		});
	},
	
	isEqual:function(){
		var self = this;
		$(this.form).find("[data-equal]").each(function(i,obj) {
			var eq = $($(this).attr("data-equal"));
			if($(this).val() != $(eq).val()){
				$(eq,this).addClass(self.classnameFalse +" donotcheck");
				self.status = false;
			}else{
				$(eq,this).removeClass("donotcheck");
			}
		});
	},
	
	// Function Formular mit Ajax versenden
	sendByAjax:function() {
		var self = this;
		$.ajax({
			type: "POST",
			url: $(self.form).attr("action")+"&skipfurl=1",
			data: $(self.form).serialize(),
			success: function(data){
				if($(data).filter(".error").length == 0){
					$(self.outputID).html(data);
					return true;	
				}else{
					$('#'+self.outputErrorID).hide().html($(data).filter('.error').html()).fadeIn(700);
					return false;
				}
			}
		});
	},
	
	// Set Date Picker
	setDatePicker:function(){
		var self = this;	
		var date_options = $.extend({
			currentText: 'Heute', 
			todayText: 'Heute', 
			clearText: '-',
			defaultView: 'agendaDay',  
			closeText: 'Schliessen',
			monthNames: ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'],
			monthNamesShort: ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'],
			dayNames: ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'],
			dayNamesShort: ['So','Mo','Di','Mi','Do','Fr','Sa'],
			dayNamesMin: ['So','Mo','Di','Mi','Do','Fr','Sa'],
			showMonthAfterYear: false,
			showOn: 'focus',
			dateFormat:'dd.mm.yy',
			date: false
		},this.options);
		$.datepicker.setDefaults(date_options);
		$(this.form).find("input[data-type='datepicker']").each(function(i,obj) {
			var id = "#"+$(obj).attr("id");
			if(date_options.date[id]){
				$(obj).datepicker(date_options.date[id]);
			}else{
				$(obj).datepicker();
			}
        });
	},
	
	// BETA
	beta:function(fx){
		if(this.options.beta){
			console.log("--- BETA AKTIV ---");
			var self = this;
			try{
				if(fx){fx();}
				return "Successful";
				console.log("\n- Successful \n");
				console.log("--- BETA END ---");
			}catch(error){
				var e="\n- There was an error on this page.\n";
				e+="- Error description: "+error.message+"\n";
				console.log(e);
				console.log("--- BETA END ---");
				return e;
			}
		}
	}
}