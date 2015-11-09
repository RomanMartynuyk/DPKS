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

    var brackets_count = 0;
    var last_br_index = [];
    var open = 0;
    var close = 0;
    var error_log = [];

    $.merge(start_elements,numbers);
    $.merge(start_elements,variable_elements);
    $.merge(end_elements,variable_elements);
    $.merge(end_elements,numbers);

    btn.on('click',function(){
        error_log = [];
        open_brackets_count = 0;
        close_brackets_count = 0;
        brackets_count = 0;
        last_br_index = [];
        number_flag = false;
        dot_flag = false;
        variable_flag = false;
        open = 0;
        close = 0;
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
                        brackets_count++;
                        last_br_index.push(i);
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
                            if(brackets_count>0){
                                brackets_count--;
                                last_br_index.pop();
                            }else{
                                error_log.push('Скобка <span class="element">"'+input_data[i]+'"</span> на последней позиции '+(i+1)+'<span class="error"> не имеет открывающую </span><br>');
                            }
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

                    /*Brackets*/
                    if(input_data[i]=='('){
                        brackets_count++;
                        last_br_index.push(i);
                    }
                    if(input_data[i]==')'){
                        if(brackets_count>0){
                            brackets_count--;
                            last_br_index.pop();
                        }else{
                            error_log.push('Скобка <span class="element">"'+input_data[i]+'"</span> на позиции '+(i+1)+'<span class="error"> не имеет открывающую </span><br>');
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
        }else if(open_brackets_count>close_brackets_count){
            error_log.push('Элементов <span class="element">"("</span> <span class="error">больше</span> чем <span class="element">")"</span> на ' + (open_brackets_count-close_brackets_count)+'<br>');
        }
        if(last_br_index.length>0){
            error_log.push('Нет закрывающейся скобки для '+last_br_index + '<br>');
        }
        if(error_log.length>0){
            $('#result').html(error_log);
        }else{
            $('#result').html('No errors');
            parallel(input_data);
        }

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

    function parallel(data){
        var brackets = getBrackets(data);
        getBracketsOperations(brackets);
        for(var i=0;i<brackets.length;i++){
            console.log(brackets[i].join(''));
        }
    }


    /*
     Get data into brackets
     Example: (2*(a+b)-(a-b/2))+2
     (a-b/2)
     (a+b)
     (2*(a+b)-(a-b/2))

     return array of brackets
     */
    function getBrackets(data){
        var open_br = [];
        var close_br = [];
        var result = [];

        for(var i=0;i<data.length;i++){
            if(data[i]=='('){
                open_br.push(i)
            }else if(data[i]==')'){
                close_br.push(i);
            }
        }
        var count = open_br.length;

        for(var i=0;i<count;i++){
            var z = 0;
            for(var j=0;j<close_br.length;j++){
                if(close_br[j]>open_br[open_br.length-1]){
                    z = close_br[j];
                    break;
                }
            }
            result.push(data.slice(open_br[open_br.length-1],z+1));

            //remove elements
            open_br.pop();
            var index = close_br.indexOf(z);
            if (index > -1) {
                close_br.splice(index, 1);
            }
        }
        return result;
    }

    function getBracketsOperations(brackets){
        var operation_position = function(){
            id: 0;
            pos: [];
        };
        var op_arrays = [];
        for (var i = 0; i < brackets.length;i++){
            var tmp = new operation_position;
            tmp.id = i;
            tmp.pos = [];
            for(var j=0;j<brackets[i].length;j++){
                if($.inArray(brackets[i][j],operations)>=0){
                    tmp.pos.push(j);
                }
            }
            op_arrays.push(tmp);
        }
        console.log(op_arrays);

        var simple = ['+','-'];
        var mul = ['*','/'];

        for(var i = 0; i <op_arrays.length;i++){
            for(var j = 0; j <op_arrays[i].length;j++){
                if(op_arrays[i][j]=='+' || op_arrays[i][j]=='-'){

                }
            }
        }
    }
});