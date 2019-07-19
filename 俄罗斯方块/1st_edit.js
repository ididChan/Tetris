
var paint = document.getElementById('GameRegion');
var gamergn = paint.getContext('2d');

gamergn.font = "30px Arial";
gamergn.textAlign = "center";
gamergn.fillStyle = "white";

var grid = 20;   //绘图单位

var score = 0;  //分数
var level = 0;  //等级

// var ini = 20;

var count = 0;
var turning = 0;  //按方向键的次数

var color_blk ={
    1:"#CB4335",  //红：s_shape
    2:"#F39C12",  //橙：t_shape
    3:"#F4D03F",  //黄：j_shape
    4:"#28B463",  //绿：i_shape
    5:"#3498DB",  //蓝：l_shape
    6:"#566573",  //靛：o_shape
    7:"#A569BD"   //紫：z_shape
}

var dx = 0;  //运动方向
var dy = 1; 
var move_y;

var row = 0;

var pos_block = new Array()   //每一块的坐标定义
    for(var num00=1; num00<5; num00++){
        pos_block[num00] = {
            pos_x:0, //x
            pos_y:0  //y
        }
    }

var block = new Array();
    for(var num01=1; num01<8; num01++){
        block[num01] = {
            pos_block,   //俄罗斯方块的每一块图形都有四个块，这里用于保存每一块的坐标
            color:color_blk[num01]  //图案颜色
        }
        switch(num01){   //起始位置
            case 1:
                block[num01].pos_block[1][0] = 13;
                block[num01].pos_block[2][0] = 14;
                block[num01].pos_block[3][0] = 14;
                block[num01].pos_block[4][0] = 15;

                block[num01].pos_block[1][1] = 1;
                block[num01].pos_block[2][1] = 1;
                block[num01].pos_block[3][1] = 0;
                block[num01].pos_block[4][1] = 0;
                break;
            case 2:
                block[num01].pos_block[1][0] = 13;
                block[num01].pos_block[2][0] = 14;
                block[num01].pos_block[3][0] = 14;
                block[num01].pos_block[4][0] = 15;

                block[num01].pos_block[1][1] = 1;
                block[num01].pos_block[2][1] = 0;
                block[num01].pos_block[3][1] = 1;
                block[num01].pos_block[4][1] = 1;
                break;
            case 3:
                block[num01].pos_block[1][0] = 13;
                block[num01].pos_block[2][0] = 14;
                block[num01].pos_block[3][0] = 14;
                block[num01].pos_block[4][0] = 14;

                block[num01].pos_block[1][1] = 2;
                block[num01].pos_block[2][1] = 2;
                block[num01].pos_block[3][1] = 1;
                block[num01].pos_block[4][1] = 0;
                break;
            case 4:
                block[num01].pos_block[1][0] = 14;
                block[num01].pos_block[2][0] = 14;
                block[num01].pos_block[3][0] = 14;
                block[num01].pos_block[4][0] = 14;

                block[num01].pos_block[1][1] = 3;
                block[num01].pos_block[2][1] = 2;
                block[num01].pos_block[3][1] = 1;
                block[num01].pos_block[4][1] = 0;
                break;
            case 5:
                block[num01].pos_block[1][0] = 14;
                block[num01].pos_block[2][0] = 15;
                block[num01].pos_block[3][0] = 14;
                block[num01].pos_block[4][0] = 14;

                block[num01].pos_block[1][1] = 2;
                block[num01].pos_block[2][1] = 2;
                block[num01].pos_block[3][1] = 1;
                block[num01].pos_block[4][1] = 0;
                break;
            case 6:
                block[num01].pos_block[1][0] = 14;
                block[num01].pos_block[2][0] = 15;
                block[num01].pos_block[3][0] = 14;
                block[num01].pos_block[4][0] = 15;

                block[num01].pos_block[1][1] = 1;
                block[num01].pos_block[2][1] = 1;
                block[num01].pos_block[3][1] = 0;
                block[num01].pos_block[4][1] = 0;
                break;
            case 7:
                block[num01].pos_block[1][0] = 14;
                block[num01].pos_block[2][0] = 15;
                block[num01].pos_block[3][0] = 13;
                block[num01].pos_block[4][0] = 14;

                block[num01].pos_block[1][1] = 1;
                block[num01].pos_block[2][1] = 1;
                block[num01].pos_block[3][1] = 0;
                block[num01].pos_block[4][1] = 0;
                break;
        }
    }

var net = new Array()   //canvas坐标化，canvas是600*600的
    for(num00=0; num00<30; num00++){
        net[num00] = new Array()
            for(num01=0;num01<30;num01++){
                net[num00][num01] = 0;   //赋初值
            }
    }

function get_newshape(){   //得到新的形状
    return getRandomInt();
}

function get_nextshape(){  //得到下一个图案的形状
    return getRandomInt();
}

function return_level(){  //返回当前等级
    return level;
} 

function return_score(){  //返回分数
    return score;
}

function getRandomInt() {    //随机数生成器
    return Math.floor(Math.random() * 6) + 1;
}

var newshape = get_newshape();
var next_newshape = get_nextshape();

function maxPos_y(index){   //得到每个图案四块中y坐标最大的序列号
    var maximum = 0;
    var highest = 0;
    for(var num02=1;num02<5;num02++)
    {
        if(block[index].pos_block[num02][1]>maximum){
            maximum = block[index].pos_block[num02][1];
            highest = num02;
        }
    }
    return highest;
}

function Full_and_Clear(shape, num){   //用于消除方块，一行满了就消去

    for(num03=0;num03<30;num03++){
        if(net[num03][block[shape].pos_block[num][1]]==0){
            return;
        }
    }

    for(num00=block[shape].pos_block[num][1]-1;num00>=0;num00--){
        for(num01=0;num01<30;num01++){
            net[num01][num00+1]=net[num01][num00];
        }
    }

    score+=50;  //消一行加50分
    if(score%1000==0)   //分数满1000升级
    {
        level++;
        // rate++;
    }
}

function loop(){

    requestAnimationFrame(loop);

    if(++count<7){
        return;
    }

    count = 0;
    gamergn.clearRect(0, 0, paint.width, paint.height);

    var high_est = maxPos_y(newshape);

    //判断图案下一步走的位置是否为空
    if(net[shape[index][high_est][0]+dx][(shape[index][high_est][1])+dy] == 0){  //若空
        for(num01=1;num01<5;num01++){  //图案滑动
            shape[index][num01][0] += dx;
            shape[index][num01][1] += dy;
        }
    }
    else{  //若不空
        if(dx==0&&dy!=0){
            move_y=dy;   //因为给向下的按键设置的是按一下走五个单位，所以单独做遍历判断
            for(move_y;move_y>=0;move_y--){
                if(net[shape[index][num01][0]][shape[index][num01][1]+move_y]==0){
                    for(num01=1;num01<5;num01++){
                        shape[index][num01][1] += move_y;
                    }
                    break;
                }
            }
        }
        else if(dx!=0&&dy==0){
            for(num01=1;num01<5;num01++){
                shape[index][num01][0] += dx;
            }
        }

        for(num00=1;num00<5;num00++){  //判断是否符合消除条件，若满足就调用消除的函数
            net[shape[index][num00][0]][shape[index][num00][1]] = newshape;
            Full_and_Clear(newshape, num00);
            newshape = get_newshape();
            next_newshape = get_nextshape();
            turning = 0;
        }
    }

    for(num03=0;num03<30;num03++)    //判断最上面的一行是否有方块，若有方块则游戏结束
    {
        if(net[num03][0] != 0){
            gamergn.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
            return;
        }
    }
    //画图，每次刷新都对canvas重新绘制
    for(num02=0;num02<30;num02++){
        for(num03=29;num03>=0;num03--){
            if(net[num02][num03]!=0){
                gamergn.fillStyle=block[num02][num03].color;
                gamergn.fillRect(num02, num03, grid-1, grid-1);
            }
        }
    }
}

document.addEventListener('keydown', function (e) {

    if (e.which == "13") {//enter
        net = new Array()
            for(num00=0; num00<30; num00++){
                net[num00] = new Array()
                for(num01=0;num01<30;num01++){
                    net[num00][num01] = 0;
                }
            }
        newshape = getRandomInt();
        dx = 0;
        dy = 1;

        newshape = get_newshape();
        next_newshape = get_nextshape();

    requestAnimationFrame(loop);
    }

    if (e.which === 37) {//left
    snake.dx = -1;
    snake.dy = 0;
    }

    else if (e.which ===38){//up,转换方向，顺时针
        turning++;  //转换次数，四次一循环
        switch(newshape){
            case 1:{
                if(turning%4==1)
                {
                    shape[index][2][0] --;
                    shape[index][4][0] --;

                    shape[index][1][1] -= 2;
                    shape[index][2][1] --;
                    shape[index][4][1] ++;
                }
                else if(turning%4==2){
                    shape[index][1][0] += 2;
                    shape[index][2][0] ++;
                    shape[index][4][0] --;

                    shape[index][2][1] --;
                    shape[index][4][1] --;
                }
                else if(turning%4==3){
                    shape[index][2][0] ++;
                    shape[index][4][0] ++;

                    shape[index][1][1] +=2;
                    shape[index][2][1] ++;
                    shape[index][4][1] --;
                }
                else if(turning%4==0){
                    shape[index][1][0] -= 2;
                    shape[index][2][0] --;
                    shape[index][4][0] ++;

                    shape[index][2][1] ++;
                    shape[index][4][1] ++;
                }
                break;
            }
            case 2:{
                if(turning%4==1)
                {
                    shape[index][2][0] --;
                    shape[index][4][0] -= 2;

                    shape[index][1][1] -= 2;
                    shape[index][2][1] --;
                }
                else if(turning%4==2){
                    shape[index][1][0] += 2;
                    shape[index][2][0] ++;

                    shape[index][2][1] --;
                    shape[index][4][1] -= 2;
                }
                else if(turning%4==3){
                    shape[index][2][0] ++;
                    shape[index][4][0] +=2;

                    shape[index][1][1] +=2;
                    shape[index][2][1] ++;
                }
                else if(turning%4==0){
                    shape[index][1][0] -= 2;
                    shape[index][2][0] --;

                    shape[index][2][1] --;
                    shape[index][4][1] -= 2;
                }
                break;
            }
            case 3:{
                if(turning%4==1)
                {
                    shape[index][2][0] --;
                    shape[index][4][0] ++;

                    shape[index][1][1] -= 2;
                    shape[index][2][1] --;
                    shape[index][4][1] ++;
                }
                else if(turning%4==2){
                    shape[index][1][0] += 2;
                    shape[index][2][0] ++;
                    shape[index][4][0] --;

                    shape[index][2][1] --;
                    shape[index][4][1] ++;
                }
                else if(turning%4==3){
                    shape[index][2][0] ++;
                    shape[index][4][0] --;

                    shape[index][1][1] +=2;
                    shape[index][2][1] ++;
                    shape[index][4][1] --;
                }
                else if(turning%4==0){
                    shape[index][1][0] -= 2;
                    shape[index][2][0] --;
                    shape[index][4][0] ++;

                    shape[index][2][1] ++;
                    shape[index][4][1] --;
                }
                break;
            }
            case 4:{
                if(turning%4==1)
                {
                    shape[index][1][0] -=2;
                    shape[index][2][0] --;
                    shape[index][4][0] ++;

                    shape[index][1][1] -= 2;
                    shape[index][2][1] --;
                    shape[index][4][1] ++;
                }
                else if(turning%4==2){
                    shape[index][1][0] += 2;
                    shape[index][2][0] ++;
                    shape[index][4][0] --;

                    shape[index][1][1] -=2;
                    shape[index][2][1] --;
                    shape[index][4][1] ++;
                }
                else if(turning%4==3){
                    shape[index][1][0] += 2;
                    shape[index][2][0] ++;
                    shape[index][4][0] --;

                    shape[index][1][1] +=2;
                    shape[index][2][1] ++;
                    shape[index][4][1] --;
                }
                else if(turning%4==0){
                    shape[index][1][0] -= 2;
                    shape[index][2][0] --;
                    shape[index][4][0] ++;

                    shape[index][1][1] +=2;
                    shape[index][2][1] ++;
                    shape[index][4][1] --;
                }
                break;
            }
            case 5:{
                if(turning%4==1)
                {
                    shape[index][1][0] --;
                    shape[index][2][0] -=2;
                    shape[index][4][0] ++;

                    shape[index][1][1] --;
                    shape[index][4][1] ++;
                }
                else if(turning%4==2){
                    shape[index][1][0] ++;
                    shape[index][4][0] --;

                    shape[index][1][1] --;
                    shape[index][2][1] -=2;
                    shape[index][4][1] ++;
                }
                else if(turning%4==3){
                    shape[index][1][0] ++;
                    shape[index][2][0] +=2;
                    shape[index][4][0] --;

                    shape[index][1][1] ++;
                    shape[index][4][1] --;
                }
                else if(turning%4==0){
                    shape[index][1][0] --;
                    shape[index][4][0] ++;

                    shape[index][1][1] ++;
                    shape[index][2][1] +=2;
                    shape[index][4][1] --;
                }
                break;
            }
            case 7:{
                if(turning%4==1)
                {
                    shape[index][1][0] --;
                    shape[index][2][0] -=2;
                    shape[index][3][0] ++;

                    shape[index][1][1] --;
                    shape[index][3][1] --;
                }
                else if(turning%4==2){
                    shape[index][1][0] ++;
                    shape[index][3][0] ++;

                    shape[index][1][1] --;
                    shape[index][2][1] -=2;
                    shape[index][3][1] ++;
                }
                else if(turning%4==3){
                    shape[index][1][0] ++;
                    shape[index][2][0] +=2;
                    shape[index][3][0] --;

                    shape[index][1][1] ++;
                    shape[index][3][1] ++;
                }
                else if(turning%4==0){
                    shape[index][1][0] --;
                    shape[index][3][0] --;

                    shape[index][1][1] ++;
                    shape[index][2][1] +=2;
                    shape[index][3][1] --;
                }
                break;
            }
        }
    }

    else if (e.which === 39) {  //right
    snake.dx = 1;
    snake.dy = 0;
    }

    else if (e.which === 40) {  //down
    snake.dy = 5;
    snake.dx = 0;
    }
    });

//（forcast区域还没编辑好）
    // var forcast = document.getElementById('Forcast');
    // var fctx = forcast.getContext('2d');
    
    // var grid_forcast = 10;
    
    // var pos_block = new Array()
    //     for(var num00=1; num00<5; num00++){
    //         pos_block[num00] = {
    //             pos_x,
    //             pos_y
    //         }
    //     }
    
    // var block = new Array();
    //     for(var num01=1; num01<8; num01++)
    //         block[num01] = {
    //             pos_block,
    //             //color = color_blk[num01]
    //         }
    //         switch(num01){
    //             case 1:
    //                 block[num01].pos_block[1][0] = 3;
    //                 block[num01].pos_block[2][0] = 4;
    //                 block[num01].pos_block[3][0] = 4;
    //                 block[num01].pos_block[4][0] = 5;
    
    //                 block[num01].pos_block[1][1] = 5;
    //                 block[num01].pos_block[2][1] = 5;
    //                 block[num01].pos_block[3][1] = 4;
    //                 block[num01].pos_block[4][1] = 4;
    //                 break;
    //             case 2:
    //                 block[num01].pos_block[1][0] = 3;
    //                 block[num01].pos_block[2][0] = 4;
    //                 block[num01].pos_block[3][0] = 4;
    //                 block[num01].pos_block[4][0] = 5;
    
    //                 block[num01].pos_block[1][1] = 5;
    //                 block[num01].pos_block[2][1] = 5;
    //                 block[num01].pos_block[3][1] = 4;
    //                 block[num01].pos_block[4][1] = 5;
    //                 break;
    //             case 3:
    //                 block[num01].pos_block[1][0] = 3;
    //                 block[num01].pos_block[2][0] = 4;
    //                 block[num01].pos_block[3][0] = 4;
    //                 block[num01].pos_block[4][0] = 4;
    
    //                 block[num01].pos_block[1][1] = 5;
    //                 block[num01].pos_block[2][1] = 5;
    //                 block[num01].pos_block[3][1] = 4;
    //                 block[num01].pos_block[4][1] = 3;
    //                 break;
    //             case 4:
    //                 block[num01].pos_block[1][0] = 4;
    //                 block[num01].pos_block[2][0] = 4;
    //                 block[num01].pos_block[3][0] = 4;
    //                 block[num01].pos_block[4][0] = 4;
    
    //                 block[num01].pos_block[1][1] = 6;
    //                 block[num01].pos_block[2][1] = 5;
    //                 block[num01].pos_block[3][1] = 4;
    //                 block[num01].pos_block[4][1] = 3;
    //                 break;
    //             case 5:
    //                 block[num01].pos_block[1][0] = 4;
    //                 block[num01].pos_block[2][0] = 5;
    //                 block[num01].pos_block[3][0] = 4;
    //                 block[num01].pos_block[4][0] = 4;
    
    //                 block[num01].pos_block[1][1] = 5;
    //                 block[num01].pos_block[2][1] = 5;
    //                 block[num01].pos_block[3][1] = 4;
    //                 block[num01].pos_block[4][1] = 3;
    //                 break;
    //             case 6:
    //                 block[num01].pos_block[1][0] = 4;
    //                 block[num01].pos_block[2][0] = 5;
    //                 block[num01].pos_block[3][0] = 4;
    //                 block[num01].pos_block[4][0] = 5;
    
    //                 block[num01].pos_block[1][1] = 5;
    //                 block[num01].pos_block[2][1] = 5;
    //                 block[num01].pos_block[3][1] = 4;
    //                 block[num01].pos_block[4][1] = 4;
    //                 break;
    //             case 7:
    //                 block[num01].pos_block[1][0] = 4;
    //                 block[num01].pos_block[2][0] = 5;
    //                 block[num01].pos_block[3][0] = 3;
    //                 block[num01].pos_block[4][0] = 4;
    
    //                 block[num01].pos_block[1][1] = 5;
    //                 block[num01].pos_block[2][1] = 5;
    //                 block[num01].pos_block[3][1] = 4;
    //                 block[num01].pos_block[4][1] = 4;
    //                 break;
    //         }
    
    // fctx.font = "15px Arial";
    // fctx.textAlign ="left";
    
    // fctx.fillStyle="#FDFEFE";
    // fctx.fillRect(0,100,100,50);
    
    // fctx.fillStyle = 'black';
    // fctx.fillText("Score:",score, 5, 125);
    // fctx.fillText("Level:",level, 6, 144);
    
    // fctx.fillStyle = block[forcast_shape].color;
    
    // for(num00=1;num00<5;num00++)
    // {
    //     fctx.fillStyle = block[forcast_shape].color;
    //     fctx.fillRect(block[forcast_shape].pos_block[num00][0],block[forcast_shape].pos_block[num00][1],grid_forcast-1,grid_forcast-1);
    // }