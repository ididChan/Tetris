
// var forcast = document.getElementById('Forcast');
// var fctx = forcast.getContext('2d');

// var grid_forcast = 10;

// var num;

// var color_blk ={
//     1:"#CB4335",  //红：s_shape
//     2:"#F39C12",  //橙：t_shape
//     3:"#F4D03F",  //黄：j_shape
//     4:"#28B463",  //绿：i_shape
//     5:"#3498DB",  //蓝：l_shape
//     6:"#566573",  //靛：o_shape
//     7:"#A569BD"   //紫：z_shape
// }

// // var score = 0;
// // var level = 0

// var shape = [
//     [
//         [3,5],[4,5],[4,4],[5,4]
//     ],     //s_shape
//     [
//         [3,5],[4,5],[4,4],[5,5]
//     ],    //t_shape
//     [
//         [3,5],[4,5],[4,4],[4,3]
//     ],    //j_shape
//     [
//         [4,6],[4,5],[4,4],[4,3]
//     ],    //i_shape
//     [
//         [4,5],[5,5],[4,4],[4,3]
//     ],     //l_shape
//     [
//         [4,5],[5,5],[4,4],[5,4]
//     ],     //o_shape
//     [
//         [4,5],[5,5],[3,4],[4,4]
//     ]     //z_shape
// ]

// fctx.font = "15px Arial";
// fctx.textAlign ="left";

// fctx.fillStyle="#FDFEFE";
// fctx.fillRect(0,100,100,50);

// fctx.fillStyle = 'black';
// fctx.fillText("Score:",score, 5, 125);
// fctx.fillText("Level:",level, 6, 144);

// for(num=1;num<5;num++)
// {
//     fctx.fillStyle = color_blk[newshape];
//     fctx.fillRect(shape[newshape][num][0],shape[newshape][num][1],grid_forcast-1,grid_forcast-1);
// }