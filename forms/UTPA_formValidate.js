(function ($) {
    $.fn.UTPA_formValidate = function(options){

        var defaults = {
            formId: "",
            onBlur: true,
            useAjax: false,
            onSubmit: true,            
            reqLength: 2,
            errorClass: "error",
            nameSpace: '',
            requiredErrorMsg: "This Field is Required.",
            emailErrorMsg: "Mail should be on the form username@host.com.",
            phoneErrorMsg: "Telephone should be on the form 123-456-7891 or 1234567891x123456 (for extensions).",
            lengthErrorMsg: "This field needs a minimum length of:",
            cssDisplay: "block",
            regExps: {
                email: /^\w+([\.\-]?\w+)*@\w+([\.\-]?\w+)*(\.\w{2,3})+$/,
    			phone: /^\(?(\d{3})\)?[\.\-\/ ]?(\d{3})[\.\-\/ ]?(\d{4})[x]?(\d{0,6})$/
            },
            customValidators: {},
            customValidatorsErrMsg :{},
        },
            settings = $.extend(defaults, options);
            validations = [];
        function appendSpans(formFields){
            $.each(formFields, function (i, field){
                $('<div id="' + settings.nameSpace + 'error_' + field.getAttribute('name') + '" class="' + settings.errorClass + '" style="display:none;"></div>').insertBefore(this);
            });
        }

        function push_validation(fieldname, value, val_name){
            var fieldInArray = false;
            var ruleInArray = false;
            var fieldIndx = -1;
            var ruleIndx = -1;
            if (validations.length > 0){
                $.each(validations, function(i, item){
                    if (item.fieldName == fieldname){
                        fieldInArray = true;
                        fieldIndx = i;
                        $.each(item.rules, function(indx, val_item){
                            if (val_item.validation == val_name){
                                ruleInArray = true;
                                ruleIndx = indx;
                                //validations[i].rules[indx].value = value;
                                return false;
                            } /*else {
                                //validations[i].rules.push({'validation': val_name, 'value': value});
                                return false;
                            }*/
                        });
                        return false;
                    } else {
                        fieldInArray = false;
                        ruleInArray - false;
                    }
                });
            } else {
               //validations.push({'fieldName': fieldname, 'rules':[{'validation': val_name, 'value':value}]});
            }
            if (!fieldInArray){
               validations.push({'fieldName': fieldname, 'rules':[]});
               fieldIndx = validations.length - 1;
            }
            if (!ruleInArray){
               validations[fieldIndx].rules.push({'validation': val_name, 'value': false});
               ruleIndx = validations[fieldIndx].rules.length - 1;
            }
            validations[fieldIndx].rules[ruleIndx].value = value;
        }

        function get_error_array(){
            var retArray = [];
            $.each(validations, function(i, item){
                for (var j = 0; j < validations[i].rules.length; j++){
                    if (!validations[i].rules[j].value){
                        retArray.push(item.fieldName);
                        willSubmit = false;
                        break;
                    }
                }
            });
            return retArray;
        }

        function validate_required(field, input){
            if (input.length < settings.reqLength){
                push_validation(field.attr('name'), false, 'required');
                $('#' + settings.nameSpace + 'error_' + field.attr('name')).html(settings.requiredErrorMsg);
                $('#' + settings.nameSpace + 'error_' + field.attr('name')).css('display', settings.cssDisplay);
            } else {
                $('#' + settings.nameSpace + 'error_' + field.attr('name')).css('display', 'none');
                push_validation(field.attr('name'), true, 'required');
            }
        }

        function validate_email(field, input){
            if (!settings.regExps.email.test(input)){
                push_validation(field.attr('name'), false, 'email');
                $('#' + settings.nameSpace + 'error_' + field.attr('name')).html(settings.emailErrorMsg);
                $('#' + settings.nameSpace + 'error_' + field.attr('name')).css('display', settings.cssDisplay);
            } else {
                $('#' + settings.nameSpace + 'error_' + field.attr('name')).css('display', 'none');
                push_validation(field.attr('name'), true, 'email');
            }
        }

        function validate_phone(field, input){
            if (!settings.regExps.phone.test(input)){
                push_validation(field.attr('name'), false, 'phone');
                $('#' + settings.nameSpace + 'error_' + field.attr('name')).html(settings.phoneErrorMsg);
                $('#' + settings.nameSpace + 'error_' + field.attr('name')).css('display', settings.cssDisplay);
            } else {
                $('#' + settings.nameSpace + 'error_' + field.attr('name')).css('display', 'none');
                push_validation(field.attr('name'), true, 'phone');
            }
        }

        function validate_minLength(field, input, length){
            if (input.length < length){
                push_validation(field.attr('name'), false, 'minlength');
                $('#' + settings.nameSpace + 'error_' + field.attr('name')).html(settings.lengthErrorMsg + ' ' + length);
                $('#' + settings.nameSpace + 'error_' + field.attr('name')).css('display', settings.cssDisplay);
            } else {
                $('#' + settings.nameSpace + 'error_' + field.attr('name')).css('display', 'none');
                push_validation(field.attr('name'), true, 'minlength');
            }
        }

        function validate_custom(field, input, func_name){
            if (!settings.customValidators[func_name](field, input)){
                push_validation(field.attr('name'), false, func_name);
                $('#' + settings.nameSpace + 'error_' + field.attr('name')).html(settings.customValidatorsErrMsg[func_name]);
                $('#' + settings.nameSpace + 'error_' + field.attr('name')).css('display', settings.cssDisplay);
            } else {
                $('#' + settings.nameSpace + 'error_' + field.attr('name')).css('display', 'none');
                push_validation(field.attr('name'), true, func_name);
            }
        }

        function validate_field(field){
            var valids = field.attr('data-valids')
            if (valids){ 
                valids = valids.split(','); 
            } else { 
                valids = field.attr('class');
                if (valids){ 
                    valids = valids.split(' '); 
                } else {
                    console.log('No validation rules found.');
                    return false;
                }
            }
            var input = field.val();
            if (valids){
                for (var i = 0; i < valids.length; i++){
                    var val_name_actual = $.trim(valids[i]);
                    var val_name = $.trim(valids[i].toLowerCase());
                    switch(val_name)
                    {
                        case "required":
                            validate_required(field, input);
                            break;
                        case "email":
                            validate_email(field, input);
                            break;
                        case "phone":
                            validate_phone(field, input);
                            break;
                        case "min-length":
                            validate_minLength(field, input, parseInt(field.attr('data-minLen')));
                            break;
                        default:
                            var keys = $.map(settings.customValidators, function(value, key){
                                return key.toLowerCase();
                            });              
                            if ($.inArray(val_name, keys) > -1){
                                validate_custom(field, input, val_name_actual);
                            }
                    }
                }
            } else {
                return false;
            }
        }
 
        function validate_onBlur(form, formFields){
            $.each(formFields, function(i, field){
                $(field).on('blur', function(){
                    var formField = $(this);
                    validate_field(formField);                    
                });
            });
        }

        return this.each(function() {
            var element = $(this);
            var fields = element.find(':input:not(:submit):not(:button):not(:image):not(:hidden)');
            appendSpans(fields);
            if (settings.onBlur){ //We add the event to all the fields
                validate_onBlur(element, fields);
            }
            if (settings.useAjax){
                var url = element[0].action;
                var submit_old = element[0].submit;
                var callSubmit = true;
                element.submit(function(){
                    fieldNames_error=[];
                    callSubmit = true;
                    var element = $(this);
                    var fields = element.find(':input:not(:submit):not(:button):not(:image):not(:hidden)');
                    $.each(fields, function(i, field){
                        var formField = $(this);
                        validate_field(formField);
                    });
                    var fieldNames_error = [];
                    fieldNames_error = get_error_array();
                    if (fieldNames_error.length > 0){
                        callSubmit = false;
                    }
                    if (!callSubmit){
                        $.event.trigger({
                            type:"formValidationError",
                            fieldNames: fieldNames_error
                        });
                    } else {
                        $.ajax({
                            type: "post",
                            url: url,
                            data: element.serialize(),
                            error: function(xhr, status, error) {
                                        console.log("error");
                                        return false;
                                    },
                            success: function(){
                                console.log("success");
                                return false;
                            }                            
                        });
                    }
                    return false;
                });
            } else if (settings.onSubmit){
                    var submit_old = element[0].submit;
                    var callSubmit = true;
                    element.submit(function(){
                        fieldNames_error=[];
                        callSubmit = true;
                        var element = $(this);
                        var fields = element.find(':input:not(:submit):not(:button):not(:image):not(:hidden)');
                        $.each(fields, function(i, field){
                            var formField = $(this);
                            validate_field(formField);
                        });
                        var fieldNames_error = [];
                        fieldNames_error = get_error_array();
                        if (fieldNames_error.length > 0){
                            callSubmit = false;
                        }
                        if (!callSubmit){
                            $.event.trigger({
                                type:"formValidationError",
                                fieldNames: fieldNames_error
                            });
                            return false;
                        } else {
                            return true;
                        }
                    });
            }            
        });
    }
})(jQuery);
