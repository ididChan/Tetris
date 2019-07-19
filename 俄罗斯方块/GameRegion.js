var paint = document.getElementById('GameRegion');
var gamergn = paint.getContext('2d');

gamergn.font = "30px Arial";
gamergn.textAlign = "center";

var grid = 20;   //绘图单位

var i, j, k, r;  //counter

var dx = 0;  //运动方向,起始向下
var dy = 1; 

var count = 0;
var turning = 0;  //翻转次数

var score = 0;  //分数
var level = 0;  //等级

var flag_net = true;   //标志

var color_blk ={    //调色池
    0:"#CB4335",  //红：s_shape
    1:"#F39C12",  //橙：t_shape
    2:"#F4D03F",  //黄：j_shape
    3:"#28B463",  //绿：i_shape
    4:"#3498DB",  //蓝：l_shape
    5:"#566573",  //靛：o_shape
    6:"#A569BD",  //紫：z_shape
}

var shape = [    //形状池
    [
        [13,1],[14,1],[14,0],[15,0]
    ],     //s_shape
    [
        [13,1],[14,0],[14,1],[15,1]
    ],    //t_shape
    [
        [13,2],[14,2],[14,1],[14,0]
    ],    //j_shape
    [
        [14,3],[14,2],[14,1],[14,0]
    ],    //i_shape
    [
        [14,2],[15,2],[14,1],[14,0]
    ],     //l_shape
    [
        [14,1],[15,1],[14,0],[15,0]
    ],     //o_shape
    [
        [14,1],[15,1],[13,0],[14,0]
    ]     //z_shape
]

var block_count = 0;    //形状计数，用于debug

var net = new Array();   //canvas坐标化，canvas:600*600
for(i=0; i<30; i++){
    net[i] = new Array();
    for(j=0;j<30;j++){
        net[i][j] = 0;   //赋初值
    }
}

function get_newshape(num){   //得到新的形状
    block_count++;
    console.log("block_count"+block_count);
    return shape[num];
}

function getRandomInt(){    //随机数生成器,range:0-6
    var ran = Math.floor(Math.random() * 7);
    console.log("new random int"+ran);
    return ran;
}

function max_move_y(block, dy){   //返回dy条件下所能向下移动的最大值
    var distance = 1;
    var fflag = true;
    for(distance;distance<=dy;distance++){
        for(i=0;i<4;i++){
            if(net[block[i][0]][block[i][1]+distance]!=0){
                fflag = false;
            }
        }
    }
    if(fflag==false){
        var max_x = get_highest_x(block);
        var min_x = get_lowest_x(block);

        var counter = 0;
        var tag = true;

        var min_y = 0;

        var write_y = new Array();
        for(i=0;i<4;i++){
            write_y[i] = 0;
        }

        var len_y = new Array();
        for(i=0;i<4;i++){
            len_y[i] = 0;
        }

        for(i=min_x;i<=max_x;i++){
            for(j=0;j<30;j++){
                if(net[i][j]==0&&tag==true){
                    write_y[++counter] = j;
                    tag = false;
                }
            }
            tag = true;
        }

        for(i=0;i<4&&i>=min_x&&i<=max_x;i++){
            len_y[i] = write_y[i]-block[i][1]-1;
        }

        for(i=0;i<4;i++){
            if(len_y[i]!=null){
                if(len_y[i]<min_y){
                    min_y = len[i];
                }
            }
        }

        return min_y;
    }
    else{
        return dy;
    }
}//bug exists

function get_highest_y(block){   //返回当前图形的最大y值
    maximum=0;
    for(i=0;i<4;i++){
        if(block[i][1]>maximum){
            maximum=block[i][1];
        }
    }
    return maximum;
}

function get_lowest_y(block){   //返回当前图形的最小y值
    minimum=0;
    for(i=0;i<4;i++){
        if(block[i][1]<maximum){
            minimum=block[i][1];
        }
    }
    return minimum;
}

function get_highest_x(block){   //返回当前图形的最大y值
    maximum=0;
    for(i=0;i<4;i++){
        if(block[i][0]>maximum){
            maximum=block[i][0];
        }
    }
    return maximum;
}

function get_lowest_x(block){   //返回当前图形的最小y值
    minimum=0;
    for(i=0;i<4;i++){
        if(block[i][0]<maximum){
            minimum=block[i][0];
        }
    }
    return minimum;
}

function full_and_clear(high_y,low_y){    //行满消除
    var mark=true;
    for(i=high_y;i>=low_y;i--){
        for(j=0;j<30;j++){
            if(net[j][i]==0){
                mark=false;
                break;
            }
        }
        if(mark==true){
            for(k=i;k>0;k--){
                for(j=0;j<30;j++){
                    net[j][k]=net[j][k-1]; //消行
                }
                score+=50;
            }
            if(score%2000==0){   //分数满2000升级
                level++;
                // rate++;
            }
        }
        mark = true;
    }
}

function block_move(block,color,dy){   //图形移动
    var x;
    var y;
    var flag = true;
    //判断下一个位置是否有方块

    console.log("moving")

    for(i=0;i<4;i++){   //清空上一移动位的棋盘
        net[block[i][0]][block[i][1]] = 0;
    }

    for(i=0;i<4;i++){
        x = block[i][0];
        y = block[i][1];

        if(net[x+dx][y+dy]!=0){
            console.log("can not move")
            flag = false;
        }
    }
    if(flag==true){   //没有方块则前进
        for(i=0;i<4;i++){
            block[i][0]+=dx;
            block[i][1]+=dy;
            net[block[i][0]][block[i][1]] = color;
        }
    }
    else{    //有方块则对棋盘进行写入
        for(i=0;i<4;i++){
            net[block[i][0]][block[i][1]] = color;
            // net[block[i][0]][block[i][1]+dy] = color;
        }
        flag_net = false;
        // full_and_clear(get_highest_y(newshape),get_lowest_y(newshape));
    }
}

function left_and_right(block,dx){   //判断移动是否越界(左/右)
    for(i=0;i<4;i++){
        if(block[i][0]+dx<0||block[i][0]+dx>29){
            return false;
        }
    }
}

function fast_down(block,dy){    //判断下移是否越界
    for(i=0;i<4;i++){
        if(block[i][1]+dy>29){
            return false;
        }
    }
}

function clear_block(){    //形状池复原
    shape = [
        [
            [13,1],[14,1],[14,0],[15,0]
        ],     //s_shape
        [
            [13,1],[14,0],[14,1],[15,1]
        ],    //t_shape
        [
            [13,2],[14,2],[14,1],[14,0]
        ],    //j_shape
        [
            [14,3],[14,2],[14,1],[14,0]
        ],    //i_shape
        [
            [14,2],[15,2],[14,1],[14,0]
        ],     //l_shape
        [
            [14,1],[15,1],[14,0],[15,0]
        ],     //o_shape
        [
            [14,1],[15,1],[13,0],[14,0]
        ]     //z_shape
    ]
}

function turningShape(block,color,num){  //图形翻转(顺时针)
    turning ++;
    for(i=0;i<4;i++){
        net[block[i][0]][block[i][1]] = 0;
    }
    switch(num){
        case 0:{
            if(turning%4==1){
                block[1][0]--;
                block[3][0]--;

                block[0][1]-=2;
                block[1][1]--;
                block[3][1]++;
            }
            else if(turning%4==2){
                block[0][0]+=2;
                block[1][0]++;
                block[3][0]--;

                block[1][1]--;
                block[3][1]--;
            }
            else if(turning%4==3){
                block[1][0] ++;
                block[3][0] ++;

                block[0][1] +=2;
                block[1][1] ++;
                block[3][1] --;
            }
            else if(turning%4==0){
                block[0][0] -= 2;
                block[1][0] --;
                block[3][0] ++;

                block[1][1] ++;
                block[3][1] ++;
            }
            for(i=0;i<4;i++){
                net[block[i][0]][block[i][1]] = color;
            }
            break;
        }
        case 1:{
            if(turning%4==1)
            {
                block[1][0] --;
                block[3][0] -= 2;

                block[0][1] -= 2;
                block[1][1] --;
            }
            else if(turning%4==2){
                block[0][0] += 2;
                block[1][0] ++;

                block[1][1] --;
                block[3][1] -= 2;
            }
            else if(turning%4==3){
                block[1][0] ++;
                block[3][0] +=2;

                block[0][1] +=2;
                block[1][1] ++;
            }
            else if(turning%4==0){
                block[0][0] -= 2;
                block[1][0] --;

                block[1][1] ++;
                block[3][1] += 2;
            }
            for(i=0;i<4;i++){
                net[block[i][0]][block[i][1]] = color;
            }
            break;
        }
        case 2:{
            if(turning%4==1)
            {
                block[1][0] --;
                block[3][0] ++;

                block[0][1] -= 2;
                block[1][1] --;
                block[3][1] ++;
            }
            else if(turning%4==2){
                block[0][0] += 2;
                block[1][0] ++;
                block[3][0] --;

                block[1][1] --;
                block[3][1] ++;
            }
            else if(turning%4==3){
                block[1][0] ++;
                block[3][0] --;

                block[0][1] +=2;
                block[1][1] ++;
                block[3][1] --;
            }
            else if(turning%4==0){
                block[0][0] -= 2;
                block[1][0] --;
                block[3][0] ++;

                block[1][1] ++;
                block[3][1] --;
            }
            for(i=0;i<4;i++){
                net[block[i][0]][block[i][1]] = color;
            }
            break;
        }
        case 3:{
            if(turning%4==1)
            {
                block[0][0] -=2;
                block[1][0] --;
                block[3][0] ++;

                block[0][1] -= 2;
                block[1][1] --;
                block[3][1] ++;
            }
            else if(turning%4==2){
                block[0][0] += 2;
                block[1][0] ++;
                block[3][0] --;

                block[0][1] -=2;
                block[1][1] --;
                block[3][1] ++;
            }
            else if(turning%4==3){
                block[0][0] += 2;
                block[1][0] ++;
                block[3][0] --;

                block[0][1] +=2;
                block[1][1] ++;
                block[3][1] --;
            }
            else if(turning%4==0){
                block[0][0] -= 2;
                block[1][0] --;
                block[3][0] ++;

                block[0][1] +=2;
                block[1][1] ++;
                block[3][1] --;
            }
            for(i=0;i<4;i++){
                net[block[i][0]][block[i][1]] = color;
            }
            break;
        }
        case 4:{
            if(turning%4==1)
            {
                block[0][0] --;
                block[1][0] -=2;
                block[3][0] ++;

                block[0][1] --;
                block[3][1] ++;
            }
            else if(turning%4==2){
                block[0][0] ++;
                block[3][0] --;

                block[0][1] --;
                block[1][1] -=2;
                block[3][1] ++;
            }
            else if(turning%4==3){
                block[0][0] ++;
                block[1][0] +=2;
                block[3][0] --;

                block[0][1] ++;
                block[3][1] --;
            }
            else if(turning%4==0){
                block[0][0] --;
                block[3][0] ++;

                block[0][1] ++;
                block[1][1] +=2;
                block[3][1] --;
            }
            for(i=0;i<4;i++){
                net[block[i][0]][block[i][1]] = color;
            }
            break;
        }
        case 6:{
            if(turning%4==1){
                block[0][0] --;
                block[1][0] -=2;
                block[2][0] ++;

                block[0][1] --;
                block[2][1] --;
            }
            else if(turning%4==2){
                block[0][0] ++;
                block[2][0] ++;

                block[0][1] --;
                block[1][1] -=2;
                block[2][1] ++;
            }
            else if(turning%4==3){
                block[0][0] ++;
                block[1][0] +=2;
                block[2][0] --;

                block[0][1] ++;
                block[2][1] ++;
            }
            else if(turning%4==0){
                block[0][0] --;
                block[2][0] --;

                block[0][1] ++;
                block[1][1] +=2;
                block[2][1] --;
            }
            for(i=0;i<4;i++){
                net[block[i][0]][block[i][1]] = color;
            }
            break;
        }
    }
}

var numm = getRandomInt();
var next_shape = get_newshape(numm);
var next_color = color_blk[numm];

var num = getRandomInt();
var newshape = get_newshape(num);
var color = color_blk[num];

function loop(){   
    //判断是否到顶,到顶则gameover
    for(i=0;i<30;i++){
        if(net[i][0]!=0){
            gamergn.clearRect(0, 0, paint.width, paint.height);
            gamergn.fillStyle = "white";
            gamergn.fillText("GAME OVER", paint.width / 2, paint.height / 2);
            return;
        }
    }

    requestAnimationFrame(loop);
    //刷新几次方块开始运动
    if(++count<30){
        return;
    }
    count = 0;
    gamergn.clearRect(0, 0, paint.width, paint.height);
    
    block_move(newshape, color,dy);   //图形移动

    //画图，每次刷新都对canvas重新绘制
    for(i=0;i<30;i++){
        for(j=29;j>=0;j--){
            if(net[i][j]!=0){
                gamergn.fillStyle=net[i][j];
                gamergn.fillRect(i*grid, j*grid, grid-1, grid-1);
            }
        }
    }

    dx = 0;   //恢复下移
    dy = 1;

    if(get_highest_y(newshape)==29||flag_net == false){   //移动到底则产生新的图形
        
        full_and_clear(get_highest_y(newshape),get_lowest_y(newshape));
        clear_block();

        num = numm;
        newshape = next_shape;
        color = next_color;
        turning = 0;

        numm = getRandomInt();
        next_shape = get_newshape(numm);
        next_color = color_blk[numm];

        flag_net = true;
    }
}

document.addEventListener('keydown',function(e){
    switch(e.which){
        case 13:{     //enter,重新开始
            for(i=0;i<30;i++){      //棋盘清零
                for(j=0;j<30;j++){
                    net[i][j]=0;
                }
            }
    
            clear_block();   //形状池复原
    
            dx = 0;
            dy = 1;

            numm = getRandomInt();
            next_shape = get_newshape(numm);
            next_color = color_blk[numm];

            num = getRandomInt();
            newshape = get_newshape(num);
            color = color_blk[num];
    
            requestAnimationFrame(loop);
            break;
        }
        case 37:{     //left，左移
            if(left_and_right(newshape,dx)==false){
                dx = 0;
                dy = 1;
            }
            else{
                dx = -1;
                dy = 0;
            }
            break;
        }
        case 39:{     //right，右移
            if(left_and_right(newshape,dx)==false){
                dx = 0;
                dy = 1;
            }
            else{
                dx = 1;
                dy = 0;
            }
            break;
        }
        case 40:{    //down，加速下落
            dy=5;
            dx=0;
            break;
        }
        case 38:{    //up，翻转（顺时针，算法非最优）
            turningShape(newshape, color, num);
            break;         
        }
        default:
            return;
    }
});

requestAnimationFrame(loop);