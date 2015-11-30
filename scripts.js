/**
 * Created by rmartynyuk on 12.10.2015.
 */

$(document).ready(function(){
    var input = $('#stringcheck');
    var btn = $('#check');
    var operations = ['+','-','*','/'];
    var numbers = ['0','1','2','3','4','5','6','7','8','9'];
    var variable_elements = 'qwertyuiopasdfghjklzxcvbnm_'.split('');
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
    /*
    * Получаем массив вместимого в скобках
    * превращаем этот массив а массив операций
    * каждый массив оппераций - это Обьект с полями:
    * айди
    * operations - тип операции + - / *
    * pos - позиция операции
    * priority - приоритет ее выполнения относительно текущих скобок
    */
    function getBracketsOperations(brackets){
        var op_arrays1 = tranform_operations(brackets);
        var op_arrays = tranform_operations(brackets);
        console.log(op_arrays);
        // Берем массивы операций
        for(var i = 0; i<op_arrays.length;i++){
            var tmp_op = op_arrays[i]; // текущий массив операций
            var pos = 1;
            var end_flag = true;
            var end_flag1 = true;
            var stop = 0;
            var zero_counter = 0;
            //пока есть операции
            while(end_flag) {
                var flag = false;
                var mflag = false;
                if(!end_flag1){
                    end_flag = false;
                }
                //берем оставшиеся операции
                for (var j = 0; j < tmp_op.operation.length; j++) {
                    //если + или -
                    if ((tmp_op.operation[j] == '+' || tmp_op.operation[j] == '-')&&tmp_op.priority[j]<1) {

                        //если + или - И след операция имеет выше приоритет
                        if (tmp_op.operation[j + 1] == '*' || tmp_op.operation[j + 1] == '/') {
                            tmp_op.priority[getOpPos(op_arrays1[i], tmp_op.pos[j])] = 0; //приоритет будет выщитан при след заходе
                            flag = false;
                            end_flag1 = true;
                            mflag = false;
                        }else if (tmp_op.operation[j - 1] == '*' || tmp_op.operation[j - 1] == '/') {
                            tmp_op.priority[getOpPos(op_arrays1[i], tmp_op.pos[j])] = 0; //приоритет будет выщитан при след заходе
                            flag = false;
                            end_flag1 = true;
                            mflag = false;
                        } else if (!flag) {
                            tmp_op.priority[getOpPos(op_arrays1[i], tmp_op.pos[j])] = pos;
                            flag = true;
                            end_flag1 = true;
                            mflag = false;
                            continue;
                        } else {
                            tmp_op.priority[getOpPos(op_arrays1[i], tmp_op.pos[j])] = -1; //приоритет будет выщитан при след заходе
                            end_flag1 = true;
                            mflag = false;
                        }
                        if (flag) {
                            flag = false;
                            mflag = false;
                        }
                    }else if((tmp_op.operation[j] == '*' || tmp_op.operation[j] == '/')&&tmp_op.priority[j]<1){
                        //Если операция * или /
                        if (!mflag) {
                            tmp_op.priority[getOpPos(op_arrays1[i], tmp_op.pos[j])] = pos;
                            mflag = true;
                            end_flag1 = true;
                            flag = false;
                            continue;
                        } else {
                            tmp_op.priority[getOpPos(op_arrays1[i], tmp_op.pos[j])] = -1; //приоритет будет выщитан при след заходе
                            end_flag1 = true;
                            flag = false;
                        }
                        if (mflag) {
                            mflag = false;
                        }
                    }
                }
                var countHightP = 0;
                for (var t = 0; t < tmp_op.priority.length; t++) {
                    if(tmp_op.priority[t]<=0){
                        countHightP++;
                        if(tmp_op.priority[t]==0){
                            zero_counter++;
                        }
                    }
                };
                if(countHightP>0){
                    end_flag = true;
                }else{
                    end_flag = false;
                }
                pos++;
                stop++;

                /*
                * Если у нас остаются нули, перед умножениями, разбиваем на обьект
                * У него есть позиция, приоритет перед ним, и после него
                */
                if(zero_counter>500){
                    var zero_object_ex = function(){
                        pos: [];
                        before: [];
                        tmp: [];
                        next: [];
                    };
                    var zero_object = new zero_object_ex;
                    zero_object.pos = [];
                    zero_object.before = [];
                    zero_object.tmp = [];
                    zero_object.next = [];

                    var pos_count = 0;
                    //Ищем все нули, их позиции, что бы потом между этими позициями найти макс позицию
                    for(var i = 0; i< tmp_op.priority.length; i++){
                        if(tmp_op.priority[i]==0){
                            zero_object.pos[pos_count] = i;
                            pos_count++;
                        }
                    }

                    //ищем макс приоритет между
                    for (var i = 0; i<zero_object.pos.length; i++){
                        //Для первого элемента если в начале и нет
                        if(zero_object.pos[0]==0 && i == 0){

                            zero_object.before[i] = 0;
                            if(zero_object.pos[1]){
                                var max_m_s = tmp_op.priority[zero_object.pos[0]+1];
                                for(var j = zero_object.pos[i]; j<zero_object.pos[1]-1; j++){
                                    if(tmp_op.priority[j]>max_m_s){
                                        max_m_s = tmp_op.priority[j];
                                    }
                                }
                                zero_object.next[0] = max_m_s+1;
                            }else{
                                var max_m_sl = tmp_op.priority[zero_object.pos[0]+1];
                                for(var j = zero_object.pos[0]; j<tmp_op.priority[tmp_op.priority.length]; j++){
                                    if(tmp_op.priority[j]>max_m_sl){
                                        max_m_sl = tmp_op.priority[j];
                                    }
                                }
                                zero_object.next[0] = max_m_sl+1;
                            }
                        }else if(i == 0){
                            var max_s = tmp_op.priority[0];
                            for(var j = 0; j<zero_object.pos[i]; j++){
                                if(tmp_op.priority[j]>max_s){
                                    max_s = tmp_op.priority[j];
                                }
                            }
                            zero_object.before[0] = max_s+1;

                            var max_m_s = tmp_op.priority[zero_object.pos[0]];
                            for(var j = zero_object.pos[i]; j<zero_object.pos[1]-1; j++){
                                if(tmp_op.priority[j]>max_m_s){
                                    max_m_s = tmp_op.priority[j];
                                }
                            }
                            zero_object.next[0] = max_m_s+1;

                        }else{
                            //Для последствующих элементов
                            //Если есть следующий (не последний)
                            if(zero_object.pos[i+1]){
                                //Находим максимальный между текущим и предыдущим (бефор)
                                var max_m_b = tmp_op.priority[zero_object.pos[i-1]+1];
                                for(var j = zero_object.pos[i-1]; j<zero_object.pos[i]; j++){
                                    if(tmp_op.priority[j]>max_m_b){
                                        max_m_b = tmp_op.priority[j];
                                    }
                                }
                                zero_object.before[i] = max_m_b+1;
                                //Находим максимальный между текущим и след (некст)
                                var max_m_n = tmp_op.priority[zero_object.pos[i]+1];
                                for(var j = zero_object.pos[i]; j<zero_object.pos[i+1]-1; j++){
                                    if(tmp_op.priority[j]>max_m_n){
                                        max_m_n = tmp_op.priority[j];
                                    }
                                }
                                zero_object.next[i] = max_m_n+1;
                            }else{
                                //Находим максимальный между последним и предыдущим (бефор)
                                var max_l_b = tmp_op.priority[zero_object.pos[i-1]+1];
                                for(var j = zero_object.pos[i-1]; j<zero_object.pos[i]; j++){
                                    if(tmp_op.priority[j]>max_l_b){
                                        max_l_b = tmp_op.priority[j];
                                    }
                                }
                                zero_object.before[i] = max_l_b+1;
                                var max_l_b_n = 0;
                                for(var j = zero_object.pos[i]; j<tmp_op.priority.length; j++){
                                    if(tmp_op.priority[j]>max_l_b_n){
                                        max_l_b_n = tmp_op.priority[j];
                                    }
                                }
                                zero_object.next[i] = max_l_b_n+1;
                            }
                        }
                    }

                    //Выбираем большее значение с пред или после
                    for(var i = 0; i<zero_object.pos.length; i++){
                        var max_bn = 0;
                        console.log(zero_object);
                        if(zero_object.before[i]>zero_object.next[i]){
                            max_bn = zero_object.before[i];
                        }else{
                            max_bn = zero_object.next[i];
                        }
                        zero_object.tmp[i] = max_bn;
                        console.log(zero_object.before);
                        console.log(zero_object.next);
                    }

                    //Если есть рядом стоящие с одинаковым приоритетом
                    var zero_flag = true;
                    var tmp_zero = zero_object.clone();
                    tmp_zero.delete = [];
                    while(zero_flag){
                        tmp_zero.delete = [];
                        for(var i = 0; i<tmp_zero.tmp.length; i++){
                            if(tmp_zero.tmp[i]==tmp_zero.tmp[i+1] && $.inArray(tmp_zero.pos[i],tmp_zero.delete)==-1){
                                tmp_zero.delete.push(tmp_zero.pos[i+1]);
                            }else{
                                if(tmp_zero.tmp.length == 1){
                                    for(var j =0; j<zero_object.tmp.length;j++){
                                        if(zero_object.pos[j]==tmp_zero.pos[i]){
                                            zero_object.tmp[j]++;
                                        }
                                    }
                                }
                            }
                        }

                        var g = tmp_zero.tmp.length;

                        for(var j = 0; j<g;j++){
                            for(var i = 0; i<tmp_zero.tmp.length; i++){
                                if($.inArray(tmp_zero.pos[i],tmp_zero.delete)==-1){
                                    tmp_zero.tmp.splice(i,1);
                                    tmp_zero.pos.splice(i,1);
                                    continue;
                                }else{
                                }
                            }
                        }




                        for(var i = 0; i<tmp_zero.pos.length; i++){
                            for(var j =0; j<zero_object.tmp.length;j++){
                                if(zero_object.pos[j]==tmp_zero.pos[i]){
                                    zero_object.tmp[j]++;
                                }
                            }
                        }
                        if(tmp_zero.tmp.length == 0){
                            zero_flag = false;
                        }
                    }



                    for(var i = 0; i<zero_object.pos.length; i++){
                        tmp_op.priority[zero_object.pos[i]] = zero_object.tmp[i];
                    }
                    break;
                }
            }
            var max_p = 0;
            var max_p_pos = 0;
            for(var i = 0; i<tmp_op.priority.length;i++){
                if(tmp_op.priority[i]>max_p){
                    max_p = tmp_op.priority[i];
                    max_p_pos = i;
                }
            }

            console.log(tmp_op.priority);

        }


    }

    function getOpPos(oper, tmp){
        var value;
        for (var i = 0; i < oper.pos.length; i++){
            if(oper.pos[i] == tmp){
                value =  i;
            }
        }
        return value;
    }

    function tranform_operations(brackets){
        var operation_position = function(){
            id: 0;
            operation: [];
            priority: [];
            pos: [];
        };
        var op_arrays = [];
        for (var i = 0; i < brackets.length;i++){
            var tmp = new operation_position;
            tmp.id = i;
            tmp.pos = [];
            tmp.operation = [];
            tmp.priority = [];
            for(var j=0;j<brackets[i].length;j++){
                if($.inArray(brackets[i][j],operations)>=0){
                    tmp.pos.push(j);
                    tmp.operation.push(brackets[i][j]);
                    tmp.priority.push(0);
                }
            }
            op_arrays.push(tmp);
        }

        for (var i = 0; i < op_arrays.length;i++){
            var div = [];
            var sub = [];
            var flag = false;
            var count = 0;
            for(var j=0;j<op_arrays[i].operation.length;j++){
                if(op_arrays[i].operation[j]=='/'){
                    if(op_arrays[i].operation[j+1]=='/'){
                        div.push(j+1);
                    }
                }
                if(op_arrays[i].operation[j]=='-'){
                    if(op_arrays[i].operation[j+1]=='-'){
                        count++;
                        if(!flag){
                            sub.push(j+1);
                            flag = true;
                        }else{
                            flag = false;
                        }
                    }
                }
            }
            if(count%2==1){
                sub.pop();
            }
            for(var k =0; k<div.length;k++){
                op_arrays[i].operation[div[k]] = '*';
                brackets[i][op_arrays[i].pos[div[k]]] = '*';
            }
            for(var k =0; k<sub.length;k++){
                op_arrays[i].operation[sub[k]] = '+';
                brackets[i][op_arrays[i].pos[sub[k]]] = '+';
            }
        }
        console.log()
        return op_arrays;
    }

    Array.prototype.remove = function(from, to) {
        var rest = this.slice((to || from) + 1 || this.length);
        this.length = from < 0 ? this.length + from : from;
        return this.push.apply(this, rest);
    };

    Object.prototype.clone = function() {
        var newObj = (this instanceof Array) ? [] : {};
        for (i in this) {
            if (i == 'clone') continue;
            if (this[i] && typeof this[i] == "object") {
                newObj[i] = this[i].clone();
            } else newObj[i] = this[i]
        } return newObj;
    };
});