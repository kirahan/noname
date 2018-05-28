<template>
    <div class="main" >
        <div class="room-selector">
            <span>斗鱼直播间:
                <input type="text" id="room-douyu-id" class="" style="width: 100px;" v-model="roomId">
                <button class="btn-success" @click="connectDouyuRoom">获取弹幕</button>
            </span>
            <span>B站直播间:
                <input type="text" id="room-bili-id" class="" style="width: 100px;">
                <button class="btn-success" >获取弹幕</button>
            </span>

            <button class="btn-danger" @click="clearDanmu">清空弹幕</button>
        </div>

        <div class="room-info">
            <div class="col-2">
                <img class="room-avatar" :src="roomAvatar">
            </div>
            <div class="col-8">
                <p id="room_name">{{roomTitle}}</p>
                <div class="info">
                    <span>直播间ID:</span>
                    <span >{{roomId}}</span>
                    <span>|&nbsp;主播ID:</span>
                    <span >{{roomOwnerName}}</span>
                    <span>|&nbsp;关注:</span>
                    <span style="color: #ac2925">{{roomFollows}}</span>
                </div>
                <div class="info">
                    <span>状态:</span>
                    <span :style="{color : roomStateColor}">{{roomState}}</span>
                    <span>|&nbsp;&nbsp;在线:</span>
                    <span  style="color:#f60">{{roomOnlineNumber}}</span>
                    <span>|&nbsp;&nbsp;弹幕数:</span>
                    <span style="color: #76FF03">{{roomDanmuSummer}}</span>
                </div>
            </div>
        </div>

        <div class="danmu-content" id="chatContainer">
            <danmuMessage v-for="log in danmuLog" :danmulist="log" ></danmuMessage>
        </div>


    </div>
</template>

<script>
    import douyu from 'douyu'
    import axios from 'axios'
    import danmuMessage from '../components/danmuMessage'
    import request from 'request-promise'
    const  douyu_api_url_room_part1 = 'http://open.douyucdn.cn/api/RoomApi/room/'

    var room
    var douyuInfoLoop


    export default {
        name: "danmu" ,
        data : function () {
            return {
                roomAvatar : 'https://apic.douyucdn.cn/upload/avatar/018/07/21/71_avatar_big.jpg',
                roomTitle : '这里是魔方直播间',
                roomId : '273442',
                roomOwnerName : '魔方直播',
                roomFollows : '-',
                roomState : '未开播',
                roomStateColor : 'red',
                roomOnlineNumber : 0 ,
                roomDanmuSummer : 0,
                douyuGiftList : {},
                danmuLog : [],
                connectDouyuFlag : false,
                connectBiliFlag : false,

            }
        },
        methods : {
            connectDouyuRoom : function () {
                var that = this
                that.roomDanmuSummer = 0
                that.clearDanmu()

                if(that.connectDouyuFlag){
                    clearInterval(douyuInfoLoop)
                    room.close()
                    that.connectDouyuFlag = false
                }


                var gift_list = {}
                var DYindex = 0
                var danmuSum = 0
                var roomId = (this.roomId == '') ? '273442' : this.roomId

                that.getDouyuRoomInfo()
                douyuInfoLoop = setInterval(function () {
                    that.getDouyuRoomInfo()

                },10000)

                 room = new douyu.ChatRoom(roomId);

                // 注册系统级事件侦听
                room.on('connect', function(message){
                    console.log('DouyuTV ChatRoom #' + roomId + ' connected.');
                    that.connectDouyuFlag = true
                });
                room.on('error', function(error){
                    console.error('Error: ' + error.toString());
                });
                room.on('close', function(hasError){
                    console.log('DouyuTV ChatRoom #' + roomId + ' disconnected' + hasError ? ' because of error.' : '.');
                });

                // 注册服务器消息处理函数
                //弹幕
                room.on('chatmsg', function(message){
                        console.log(message)
                    var DYrole = ''
                    var DYtype = message.type
                    var DYnickname = message.nn
                    var DYtxt = message.txt
                    var DYlevel = message.level
                    var DYtime = message.cst

                    if(message.rg == '5'){
                        DYrole == 'owner'
                    }else if(message.rg == '4'){
                        DYrole == 'manager'
                    }else{
                        DYrole == 'normal'
                    }

                    DYindex++
                    danmuSum++

                    var danmuLog = {
                        type : DYtype,
                        usertype : DYrole,
                        message : DYtxt,
                        nickname : DYnickname,
                        level : DYlevel,
                        timestamp : DYtime,
                        index :DYindex,
                        danmusum : danmuSum,
                    }

                    that.roomDanmuSummer = danmuSum
                    that.danmuLog.push(danmuLog)
                    // console.log(that.danmuLog)


                });

                //礼物
                room.on('dgb', function(message){
                        console.log(message)
                    var DYtype = message.type
                    var DYnickname = message.nn
                    var DYtime = message.cst
                    var DYhits = message.hits
                    var DYgiftid = message.gfid



                    DYindex++

                    var danmuLog = {
                        type : DYtype,
                        DYgiftid : DYgiftid,
                        nickname : DYnickname,
                        hits : DYhits,
                        timestamp : DYtime,
                        index :DYindex,
                        danmusum : danmuSum,
                    }
                    that.danmuLog.push(danmuLog)
                    // console.log(that.danmuLog)



                });

                //用户进入
                room.on('uenter', function(message){
                    console.log(message)
                    var DYtype = message.type
                    var DYnickname = message.nn
                    var DYlevel = message.level

                    DYindex++

                    var danmuLog = {
                        type : DYtype,
                        nickname : DYnickname,
                        level : DYlevel,
                        index :DYindex,
                        danmusum : danmuSum,
                    }

                    that.danmuLog.push(danmuLog)
                    // console.log(that.danmuLog)



                });



                room.open();

            },
            getDouyuRoomInfo : function () {
                var that = this
                var options = {
                    uri:  douyu_api_url_room_part1 + that.roomId,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    json: true
                }
                request(options).then(function (response) {
                    console.log(response)
                    console.log(response.error)
                    console.log(response.data)

                    if(response.error == '0'){
                        var douyuinfo = response.data
                        that.roomAvatar = douyuinfo.avatar
                        that.roomTitle = douyuinfo.room_name
                        that.roomOwnerName = douyuinfo.owner_name
                        that.roomFollows = douyuinfo.fans_num
                        that.roomOnlineNumber = douyuinfo.online
                        that.douyuGiftList = douyuinfo.gift

                        if(douyuinfo.room_status == '1'){
                            that.roomState = '已开播'
                            that.roomStateColor = 'green'
                        }else{
                            that.roomState = '未开播'
                            that.roomStateColor = 'red'
                        }

                    }
                }).catch(function (err) {
                    console.log(err)
                })


            },
            clearDanmu :function () {
                var that = this
                that.danmuLog = []

            }
        },
        components : {danmuMessage},
        computed : {

        },
        watch: {
            danmuLog() {
                console.log("chatlog change");
                this.$nextTick(() => {
                    var container = this.$el.querySelector("#chatContainer");
                    console.log(container);
                    container.scrollTop = container.scrollHeight;
                })
                //  document.getElementById('chatContainer').scrollTop = document.getElementById('chatContainer').scrollHeight+150;

            }
        }

    }
</script>

<style scoped>

.main {
    background-color: #222;
    text-align: center;
    color: white;
    font-size: 20px;
    position: fixed;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;

}

.room-selector{
    border-bottom: solid 2px #ac2925;
    display: flex;
    width: 100%;
    height: 80px;
    vertical-align: middle;
}

.btn-success{
    background-color: #5cb85c;
    border-color: #5cb85c;
    border-radius: 5px;
}
.btn-danger{
    background-color: #d43f3a;
    border-color: #d43f3a;
    margin-top: 8px;
    margin-bottom: 8px;
    margin-right: 8px;
    border-radius: 10px;
}


.room-info{
    text-align: left;
    border-bottom: solid 2px #ac2925;
    height: 64px;
    -webkit-app-region: drag;
    display: flex;
}

.room-info span{
    font-size: 12px;
}
.room-info .info{

}
.room-info p{
    color: #2196F3;
    font-size: 15px;
    margin: 0px;
}

.room-avatar{
    width: auto;
    height: 100%;
    max-width: 100px;
    max-height: 100px;
}

.col-2{
    width: 20%;
}

.col-8{
    width: 80%;
    display: flex;
    flex-direction: column;
}

.danmu-content{
    height: 80%;
    overflow-y: scroll;
}

/*gun dong tiao*/
/*-----------滚动条样式----------------*/

::-webkit-scrollbar-track
{
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    background-color: #9d9d9d;
}

::-webkit-scrollbar
{
    width: 6px;
    background-color: #9d9d9d;
}

::-webkit-scrollbar-thumb
{
    width: 8px;
    background-color: #111111;
}
</style>