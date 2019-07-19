
var paint = document.getElementById('GameRegion');
var gamergn = paint.getContext('2d');

gamergn.font = "30px Arial";
gamergn.textAlign = "center";
gamergn.fillStyle = "white";

var grid = 20;   //绘图单位

var score = 0;  //分数
var level = 0;  //等级

var count = 0;
var turning = 0;  //按方向键的次数

var i, j, k, r;

var dx = 0;  //运动方向,起始向下
var dy = 1; 

var color_blk ={
    1:"#CB4335",  //红：s_shape
    2:"#F39C12",  //橙：t_shape
    3:"#F4D03F",  //黄：j_shape
    4:"#28B463",  //绿：i_shape
    5:"#3498DB",  //蓝：l_shape
    6:"#566573",  //靛：o_shape
    7:"#A569BD"   //紫：z_shape
}

var shape = [
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

var next_shape = [
    [
        [3,5],[4,5],[4,4],[5,4]
    ],     //s_shape
    [
        [3,5],[4,5],[4,4],[5,5]
    ],    //t_shape
    [
        [3,5],[4,5],[4,4],[4,3]
    ],    //j_shape
    [
        [4,6],[4,5],[4,4],[4,3]
    ],    //i_shape
    [
        [4,5],[5,5],[4,4],[4,3]
    ],     //l_shape
    [
        [4,5],[5,5],[4,4],[5,4]
    ],     //o_shape
    [
        [4,5],[5,5],[3,4],[4,4]
    ]     //z_shape
]

var net = new Array();   //canvas坐标化，canvas是600*600的
for(i=0; i<30; i++){
    net[i] = new Array();
    for(j=0;j<30;j++){
        net[i][j] = 0;   //赋初值
    }
}

function turningShape(index){
    switch(index){
        case 1:{
            if(turning%4==1){
                shape[index][1][0]--;
                shape[index][3][0]--;

                shape[index][0][1]-=2;
                shape[index][1][1]--;
                shape[index][3][1]++;
            }
            else if(turning%4==2){
                shape[index][0][0]+=2;
                shape[index][1][0]++;
                shape[index][3][0]--;

                shape[index][1][1]--;
                shape[index][3][1]--;
            }
            else if(turning%4==3){
                shape[index][1][0] ++;
                shape[index][3][0] ++;

                shape[index][0][1] +=2;
                shape[index][1][1] ++;
                shape[index][3][1] --;
            }
            else if(turning%4==0){
                shape[index][0][0] -= 2;
                shape[index][1][0] --;
                shape[index][3][0] ++;

                shape[index][1][1] ++;
                shape[index][3][1] ++;
            }
            break;
        }
        case 2:{
            if(turning%4==1)
            {
                shape[index][1][0] --;
                shape[index][3][0] -= 2;

                shape[index][0][1] -= 2;
                shape[index][1][1] --;
            }
            else if(turning%4==2){
                shape[index][0][0] += 2;
                shape[index][1][0] ++;

                shape[index][1][1] --;
                shape[index][3][1] -= 2;
            }
            else if(turning%4==3){
                shape[index][1][0] ++;
                shape[index][3][0] +=2;

                shape[index][0][1] +=2;
                shape[index][1][1] ++;
            }
            else if(turning%4==0){
                shape[index][0][0] -= 2;
                shape[index][1][0] --;

                shape[index][1][1] --;
                shape[index][3][1] -= 2;
            }
            break;
        }
        case 3:{
            if(turning%4==1)
            {
                shape[index][1][0] --;
                shape[index][3][0] ++;

                shape[index][0][1] -= 2;
                shape[index][1][1] --;
                shape[index][3][1] ++;
            }
            else if(turning%4==2){
                shape[index][0][0] += 2;
                shape[index][1][0] ++;
                shape[index][3][0] --;

                shape[index][1][1] --;
                shape[index][3][1] ++;
            }
            else if(turning%4==3){
                shape[index][1][0] ++;
                shape[index][3][0] --;

                shape[index][0][1] +=2;
                shape[index][1][1] ++;
                shape[index][3][1] --;
            }
            else if(turning%4==0){
                shape[index][0][0] -= 2;
                shape[index][1][0] --;
                shape[index][3][0] ++;

                shape[index][1][1] ++;
                shape[index][3][1] --;
            }
            break;
        }
        case 4:{
            if(turning%4==1)
            {
                shape[index][0][0] -=2;
                shape[index][1][0] --;
                shape[index][3][0] ++;

                shape[index][0][1] -= 2;
                shape[index][1][1] --;
                shape[index][3][1] ++;
            }
            else if(turning%4==2){
                shape[index][0][0] += 2;
                shape[index][1][0] ++;
                shape[index][3][0] --;

                shape[index][0][1] -=2;
                shape[index][1][1] --;
                shape[index][3][1] ++;
            }
            else if(turning%4==3){
                shape[index][0][0] += 2;
                shape[index][1][0] ++;
                shape[index][3][0] --;

                shape[index][0][1] +=2;
                shape[index][1][1] ++;
                shape[index][3][1] --;
            }
            else if(turning%4==0){
                shape[index][0][0] -= 2;
                shape[index][1][0] --;
                shape[index][3][0] ++;

                shape[index][0][1] +=2;
                shape[index][1][1] ++;
                shape[index][3][1] --;
            }
            break;
        }
        case 5:{
            if(turning%4==1)
            {
                shape[index][0][0] --;
                shape[index][1][0] -=2;
                shape[index][3][0] ++;

                shape[index][0][1] --;
                shape[index][3][1] ++;
            }
            else if(turning%4==2){
                shape[index][0][0] ++;
                shape[index][3][0] --;

                shape[index][0][1] --;
                shape[index][1][1] -=2;
                shape[index][3][1] ++;
            }
            else if(turning%4==3){
                shape[index][0][0] ++;
                shape[index][1][0] +=2;
                shape[index][3][0] --;

                shape[index][0][1] ++;
                shape[index][3][1] --;
            }
            else if(turning%4==0){
                shape[index][0][0] --;
                shape[index][3][0] ++;

                shape[index][0][1] ++;
                shape[index][1][1] +=2;
                shape[index][3][1] --;
            }
            break;
        }
        case 7:{
            if(turning%4==1){
                shape[index][0][0] --;
                shape[index][1][0] -=2;
                shape[index][2][0] ++;

                shape[index][0][1] --;
                shape[index][2][1] --;
            }
            else if(turning%4==2){
                shape[index][0][0] ++;
                shape[index][2][0] ++;

                shape[index][0][1] --;
                shape[index][1][1] -=2;
                shape[index][2][1] ++;
            }
            else if(turning%4==3){
                shape[index][0][0] ++;
                shape[index][1][0] +=2;
                shape[index][2][0] --;

                shape[index][0][1] ++;
                shape[index][2][1] ++;
            }
            else if(turning%4==0){
                shape[index][0][0] --;
                shape[index][2][0] --;

                shape[index][0][1] ++;
                shape[index][1][1] +=2;
                shape[index][2][1] --;
            }
            break;
        }
    }
}

function get_newshape(){   //得到新的形状
    return getRandomInt();
}

function getRandomInt() {    //随机数生成器,range:1-7
    return Math.floor(Math.random() * 6) + 1;
}

var newshape = get_newshape()-1;
var next_newshape = get_newshape()-1;

function get_highest_y(index){
    maximum=0;
    for(i=0;i<4;i++){
        if(shape[index][i][1]>maximum){
            maximum=shape[index][i][1];
        }
    }
    return maximum;
}

function get_lowest_y(index){
    minimum=0;
    for(i=0;i<4;i++){
        if(shape[index][i][1]<maximum){
            minimum=shape[index][i][1];
        }
    }
    return minimum;
}

function full_and_clear(high_y,low_y){
    var mark=true;
    for(i=high_y;i>=low_y;i--){
        for(j=0;j<30;j++){
            if(net[i][j]==0){
                mark=false;
            }
        }
        if(mark==true){
            for(j=0;j<30;j++){
                net[i][j]=net[i-1][j];
            }
            score+=50;
            if(score%1000==0){   //分数满1000升级
                level++;
                // rate++;
            }
        }
    }
}

function loop(){

    //判断是否到顶,到顶则gameover
    for(i=0;i<30;i++){
        if(net[i][0]!=0){
            gamergn.clearRect(0, 0, canvas.width, canvas.height);
            gamergn.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
            return;
        }
    }

    requestAnimationFrame(loop);
    //刷新几次方块开始运动
    if(++count<5){
        return;
    }
    count = 0;
    gamergn.clearRect(0, 0, paint.width, paint.height); 

    //判断方块移动的下一个位置是否为空，若为空则改变坐标
    //若不为空则就当前位置对net进行写入
    var x;
    var y;
    var flag=true;
    var flag1=true;
    //判断下一个位置是否有方块
    for(i=0;i<4;i++){
        x = shape[newshape][i][0];
        y = shape[newshape][i][1];
        if(net[x+dx][y+dy]!=0){
            flag=false;
        }
    }
    if(flag==true){   //没有方块则前进
        for(i=0;i<4;i++){
            shape[newshape][i][0]+=dx;
            shape[newshape][i][1]+=dy;
        }
    }
    else if(flag==false){    //有方块则对棋盘进行写入
        if(dy!=5){
            for(i=0;i<4;i++){
                net[shape[newshape][i][0]][shape[newshape][i][1]]=newshape+1;
            }
        }
        else if(dy==5){   //若为快速下移则需根据dy依次进行判断，对相对当前位置最远为空的棋盘进行写入
            for(j=dy;j>0;j--){
                for(k=0;k<4;k++){
                    if(net[shape[newshape][k][0]][shape[newshape][k][1]+1]!=0){
                        flag1==false;
                    }
                }
                if(flag1==true){
                    for(i=0;i<4;i++){
                        shape[newshape][k][0]+=dx;
                        shape[newshape][k][1]+=dy;
                    }
                }
                else if(flag1==false){
                    for(i=0;i<4;i++){
                        net[shape[newshape][i][0]][shape[newshape][i][1]]=newshape+1;
                    }
                }
            }
        }
    }
    //保持下落状态
    dx=0;
    dy=1;

    //画图，每次刷新都对canvas重新绘制
    for(i=0;i<30;i++){
        for(j=29;j>=0;j--){
            if(net[i][j]!=0){
                gamergn.fillStyle=color_blk[newshape+1];
                gamergn.fillRect(i*grid, j*grid, grid-1, grid-1);
            }
        }
    }
}

document.addEventListener('keydown',function(e){
    switch(e.which){
        case 13:{    //enter,重新开始
            for(i=0;i<30;i++){
                for(j=0;j<30;j++){
                    net[i][j]=0;
                }
            }
    
            newshape = get_newshape()-1;
            next_newshape = get_newshape()-1;
    
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
    
            dx = 0;
            dy = 1;
    
            requestAnimationFrame(loop);
            break;
        }
        case 37:{     //left，左移
            dx=-1;
            dy=0;
            break;
        }
        case 39:{     //right，右移
            dx=1;
            dy=0;
            break;
        }
        case 40:{    //down，加速下落
            dy=5;
            dx=0;
            break;
        }
        case 38:{    //up，翻转（顺时针，算法非最优）
            turningShape(newshape);
            break;         
        }
        default:
            return;
    }
});

requestAnimationFrame(loop);




var forcast = document.getElementById('Forcast');
var fctx = forcast.getContext('2d');

var grid_forcast = 10;

var num;

fctx.font = "15px Arial";
fctx.textAlign ="left";

fctx.fillStyle="#FDFEFE";
fctx.fillRect(0,100,100,50);

// fctx.fillStyle = 'black';
// fctx.fillText("Score:",score, 5, 125);
// fctx.fillText("Level:",level, 6, 144);

// for(num=1;num<5;num++)
// {
//     fctx.fillStyle = color_blk[newshape];
//     fctx.fillRect(next_shape[newshape][num][0],next_shape[newshape][num][1],grid_forcast-1,grid_forcast-1);
// }