/**
 * Created by rmartynyuk on 12.10.2015.
 */

$(document).ready(function(){
    var input = $('#stringcheck');
    var btn = $('#check');
    var operations = ['+','-','*','/'];
    var numbers = ['0','1','2','3','4','5','6','7','8','9'];
    var variable_elements = 'qwertyuiopasdfghjklzxcvbnm'.split('');
    var dot = '.';
    var brackets = ['(',')'];
    var start_elements = ['(','-'];
    var end_elements = [')'];
    var open_brackets_count = 0;
    var close_brackets_count = 0;
    var variable_flag = false;
    var number_flag = false;
    var dot_flag = false;

    var open_brackets = false;
    var close_brackets = false;
    var open = 0;
    var close = 0;
    var last_close = false;
    var error_log = [];

    $.merge(start_elements,numbers);
    $.merge(start_elements,variable_elements);
    $.merge(end_elements,variable_elements);
    $.merge(end_elements,numbers);

    btn.on('click',function(){
        error_log = [];
        open_brackets_count = 0;
        close_brackets_count = 0;
        number_flag = false;
        dot_flag = false;
        variable_flag = false;
        close_brackets = false;
        open_brackets = false;
        open = 0;
        close = 0;
        last_close = false;
        var input_data = input.val().toLowerCase().split('');
        var prev = '';
        var tmp = '';
        var graph = [];
        for(var i=0; i<input_data.length;i++){
            if(i==0){
                if($.inArray(input_data[i],start_elements)==-1){
                    error_log.push('Неправильный элемент <span class="element">"'+input_data[i]+'"</span>  в начале выражения<br>');
                    tmp = getType(input_data[i]);
                }else{
                    tmp = getType(input_data[i]);
                    if(input_data[i]=='('){
                        open_brackets = true;
                    }
                }
            }else{
                if(i==input_data.length-1){
                    if($.inArray(input_data[i],end_elements)==-1){
                        error_log.push('Неправильный элемент <span class="element">"'+input_data[i]+'"</span>  в конце выражения<br>');
                    }else{
                        prev = tmp;
                        tmp =  getType(input_data[i]);
                        graph = graphCheck(prev);
                        if($.inArray(input_data[i],graph)==-1){
                            error_log.push('Элемент <span class="element">"'+input_data[i]+'"</span> на позиции '+(i+1)+'<span class="error"> неверный </span><br>');
                        }
                        if(input_data[i]==')'){
                            last_close = true;
                        }
                    }
                }else{
                    prev = tmp;
                    if(prev == 'variable'){
                        variable_flag = true;
                    }

                    if(prev == 'numbers'){
                        number_flag = true;
                    }

                    tmp =  getType(input_data[i]);
                    graph = graphCheck(prev);
                    if(prev != 'variable' && prev != 'numbers'){
                        variable_flag = false;
                    }
                    if(tmp != 'dot' && tmp != 'numbers'){
                        number_flag = false;
                        dot_flag = false;
                    }

                    if(tmp == 'dot'){
                        if(number_flag){
                            if(dot_flag){
                                error_log.push('Элемент <span class="element">"'+input_data[i]+'"</span> на позиции '+(i+1)+'<span class="error"> неверный </span><br>');
                            }else{
                                dot_flag = true;
                            }
                        }
                    }

                    if(input_data[i]=='('){
                        if(open_brackets){
                            open++;
                        }
                        open_brackets = true;
                    }

                    if(input_data[i]==')'){
                        if(!open_brackets){
                            error_log.push('<span class="error">Нет открытой дужки</span> для <span class="element">"'+input_data[i]+'"</span> на позиции '+(i+1)+'<br>');
                        }else{
                            if(open==0){
                                open_brackets = false;
                            }else{
                                open--;
                            }

                        }
                    }


                    if(tmp == 'dot'&& variable_flag){
                        error_log.push('Элемент <span class="element">"'+input_data[i]+'"</span> на позиции '+(i+1)+'<span class="error"> неверный </span><br>');
                        variable_flag = false;
                    }else if($.inArray(input_data[i],graph)==-1){
                        error_log.push('Элемент <span class="element">"'+input_data[i]+'"</span> на позиции '+(i+1)+'<span class="error"> неверный </span><br>');
                    }
                    prev = '';
                    graph = [];
                }

            }

            //Brackets count
            if(input_data[i]==')'){
                close_brackets_count = close_brackets_count+1;
            }else if (input_data[i]=='('){
                open_brackets_count = open_brackets_count+1;
            }
        }

        //Brackets check
        if(close_brackets_count>open_brackets_count){
            error_log.push('Элементов <span class="element">")"</span> <span class="error">больше</span> чем <span class="element">"("</span> на '+ (close_brackets_count-open_brackets_count)+'<br>');
            if(last_close){
                error_log.push('<span class="error">Нет открытой дужки</span> для <span class="element">")"</span> в конце<br>');
            }
        }else if(open_brackets_count>close_brackets_count){
            error_log.push('Элементов <span class="element">"("</span> <span class="error">больше</span> чем <span class="element">")"</span> на ' + (open_brackets_count-close_brackets_count)+'<br>');
            error_log.push('<span class="error">Нет закрытой дужки</span> для <span class="element">"("</span><br>');

        }
        $('#result').html(error_log);
    });

    function getType(value){
        if($.inArray(value,operations)>=0){
            return 'operations';
        }else if($.inArray(value,numbers)>=0){
            return 'numbers';
        }else if($.inArray(value,variable_elements)>=0){
            return 'variable';
        }else if(value == dot){
            return 'dot';
        }else if(value==')'){
            return 'close_brackets';
        }else if(value=='('){
            return 'open_brackets';
        }
    }

    function graphCheck(value){
        var res= [];
        switch (value){
            case 'operations':
                return res.concat(numbers,variable_elements,'(');
                break;
            case 'numbers':
                return res.concat(operations,dot,numbers,')');
                break;
            case 'variable':
                return res.concat(variable_elements,numbers,operations,')');
                break;
            case 'dot':
                return res.concat(numbers);
                break;
            case 'open_brackets':
                return res.concat(numbers,variable_elements,'-','(');
                break;
            case 'close_brackets':
                return res.concat(operations,variable_elements,')');
                break;
            default :
                return 'wrong value ' + value;
                break;
        }
    }
});/**
 * Created by Roman on 11/8/2015.
 */
