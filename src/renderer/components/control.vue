<template>
    <div class="main">




        <!--live-all-result-->
        <transition name="custom-classes-transition"
                    enter-active-class="animated bounceInDown"
                    leave-active-class="animated bounceOutUP">
            <div v-if="show.live.allResult">
                <div  class="cubing-result-all">
                    <table>
                        <thead>
                        <tr>
                            <th>排名</th>
                            <th>姓名</th>
                            <th>平均成绩</th>
                            <th>单次最好</th>
                            <th>详细成绩</th>
                        </tr>
                        </thead>
                        <tbody class="rank-list">
                        <tr v-for="player,index in LiveResultAll" >
                            <td class="rank-number">{{Number(index) +1 }}</td>
                            <td class="rank-name">{{LiveUserList[player.id].name}}</td>
                            <td>{{player.Avg}}</td>
                            <td>{{player.Single}}</td>
                            <td><span v-for="time in player.detail" style="padding-right: 20px">{{time}}</span></td>
                        </tr>
                        </tbody>
                    </table>


                </div>
            </div>
        </transition>


        <!--live-update-result-->
        <transition name="custom-classes-transition"
                    enter-active-class="animated bounceInRight"
                    leave-active-class="animated bounceOutRight"
        >
            <div v-if="show.live.updateResult" class="cubing-result-update">
                <p class="result-name">{{LiveUserList[LiveResultUpdate.id].name}}</p>
                <p class="result-summary">
                    <span>项目:{{LiveResultUpdate.event}} </span>
                    <span>最好:{{LiveResultUpdate.Single}} </span>
                    <span>平均:{{LiveResultUpdate.Avg}}</span>
                </p>
                <p class="result-list"><span v-for="time in LiveResultUpdate.detail" style="padding-right: 20px">{{time}}</span></p>
            </div>

        </transition>

        <!--live-new-message-->
        <transition name="custom-classes-transition"
                    enter-active-class="animated bounceInDown"
                    leave-active-class="animated bounceOutUP">
            <div v-if="show.live.newMessage">
                <div class="cubing-message-new" >
                    <el-button type="info" class="message-new">粗饼评论</el-button>
                    <el-button type="primary" class="message-new">{{Panel.Live.result.user.name}}</el-button>
                    <el-button type="warning" class="message-new">{{Panel.Live.result.content}}</el-button>
                </div>
            </div>
        </transition>



        <!--record-->
        <transition name="custom-classes-transition"
                    enter-active-class="animated bounceInRight"
                    leave-active-class="animated bounceOutLeft">
            <RecordPanel v-if="show.record" :region="Panel.rankRegion.title" :workingcounter="Panel.rankRegion.counter"></RecordPanel>
        </transition>

        <!--rank-->
        <transition name="custom-classes-transition"
                    enter-active-class="animated bounceInRight"
                    leave-active-class="animated bounceOutLeft">
            <RankPanel v-if="show.rank" :data="Panel.rank" :workingcounter="Panel.rank.counter"></RankPanel>
        </transition>

        <!--schedule-->
        <transition name="custom-classes-transition"
                    enter-active-class="animated bounceInRight"
                    leave-active-class="animated bounceOutLeft">
            <SchedulePanel v-if="show.schedule" :data="Panel.schedule" :workingcounter="Panel.schedule.counter"></SchedulePanel>
        </transition>

        <!--prerank-->
        <transition name="custom-classes-transition"
                    enter-active-class="animated bounceInRight"
                    leave-active-class="animated bounceOutLeft">
            <PrerankPanel v-if="show.prerank" :data="Panel.preRank" :workingcounter="Panel.preRank.counter"></PrerankPanel>
        </transition>

        <!--personinfo-->
        <transition name="custom-classes-transition"
                    enter-active-class="animated bounceInRight"
                    leave-active-class="animated bounceOutLeft">
            <PersonalInfoPanel v-if="show.personalInfo" :data="Panel.personalInfo" :workingcounter="Panel.personalInfo.counter"></PersonalInfoPanel>
        </transition>





    </div>
    </template>

    <script>
    import timeResultFormat from  './control/timeResultFormat'
    import RecordPanel from './control/RecordPanel'
    import PrerankPanel from './control/PrerankPanel'
    import SchedulePanel from './control/SchedulePanel'
    import RankPanel from './control/RankPanel'
    import PersonalInfoPanel from  './control/PersonalInfoPanel'
    const {ipcRenderer} = require('electron')

    export default {
        name: "control",
        data(){
            return {
                LiveResultAll: {
                },
                LiveResultUpdate:{
                    id : 1,
                    event : '222',
                    round : 'd',
                    filter : 'a',
                    comId : '832',
                    Avg : '6.89',
                    Single : '3.39',
                    detail : [8.11,7.21,5.34,3.39,8.94]
                },
                LiveUserList: {
                    1:{name:'cubing'}
                },
                show : {
                    live:{
                        whole : true,
                        recentMessage : false,
                        newMessage : false,
                        updateResult : false,
                        allResult : false,
                        allUser : true,
                    },
                    result : false,
                    record: false,
                    prerank :false,
                    rank: false,
                    schedule:false,
                    personalInfo :false
                },

                Panel:{
                    rankRegion : {
                        title : 'xxx',
                        counter : 0
                    },
                    preRank :{
                        result : [],
                        itemname :'',
                        counter : 0
                    },
                    schedule : {
                        result : {},
                        date : '',
                        counter : 0
                    },
                    rank : {
                        result : {},
                        counter : 0,
                        mode : '',
                        range : '',
                    },
                    personalInfo : {
                        result : {},
                        counter : 0,
                    },
                    Live : {
                        result : {},
                        type : "",
                        counter : 0
                    }
                }
            }
        },
        created(){
            var that = this
            //握手
            ipcRenderer.on('main-handshake-to-control', (event, arg) => {
                console.log('handshake success',arg) // prints "pong"
            })
            ipcRenderer.send('render-handshake-from-control', 'hi')

            //点击显示记录的动画
            ipcRenderer.on('main-show-cubing-record', (event, arg) => {
                console.log('准备显示界面',arg) // prints "pong"
                if(arg.type == 'auto'){
                    that.show.record = true
                    setTimeout(function () {
                        that.Panel.rankRegion.counter++
                        that.Panel.rankRegion.title = arg.region
                        setTimeout(function () {
                            that.show.record = false
                        },3000)
                    },100)
                }else if(arg.type == 'display'){
                    that.show.record = true
                    setTimeout(function () {
                        that.Panel.rankRegion.counter++
                        that.Panel.rankRegion.title = arg.region
                    },100)
                }else if(arg.type == 'hide'){
                    that.show.record = false
                }

            })

            //点击显示预排名的动画
            ipcRenderer.on('main-show-cubing-prerank', (event, arg) => {
                console.log('准备显示界面',arg) // prints "pong"
                if(arg.type == 'auto'){
                    that.show.prerank = true
                    setTimeout(function () {
                        that.Panel.preRank.counter++
                        that.Panel.preRank.result = arg.result
                        that.Panel.preRank.itemname = arg.itemname
                        setTimeout(function () {
                            that.show.prerank = false
                        },3000)
                    },100)
                }else if(arg.type == 'display'){
                    that.show.prerank = true
                    setTimeout(function () {
                        that.Panel.preRank.counter++
                        that.Panel.preRank.result = arg.result
                        that.Panel.preRank.itemname = arg.itemname
                    },100)
                }else if(arg.type == 'hide'){
                    that.show.prerank = false
                }else{
                    null
                }


            })

            //点击显示赛程的动画
            ipcRenderer.on('main-show-cubing-schedule', (event, arg) => {
                console.log('准备显示界面',arg) // prints "pong"
                if(arg.type == 'auto'){
                    that.show.schedule = true
                    setTimeout(function () {
                        that.Panel.schedule.counter++
                        that.Panel.schedule.result = arg.result
                        that.Panel.schedule.date = arg.date
                        setTimeout(function () {
                            that.show.schedule = false
                        },3000)
                    },100)
                }else if(arg.type == 'display'){
                    that.show.schedule = true
                    setTimeout(function () {
                        that.Panel.schedule.counter++
                        that.Panel.schedule.result = arg.result
                        that.Panel.schedule.date = arg.date
                    },100)
                }else if(arg.type == 'hide'){
                    that.show.schedule = false
                }else{
                    null
                }


            })

            //点击显示排名的动画
            ipcRenderer.on('main-show-cubing-rank', (event, arg) => {
                console.log('准备显示界面',arg) // prints "pong"
                if(arg.type == 'auto'){
                    that.show.rank = true
                    setTimeout(function () {
                        that.Panel.rank.counter++
                        that.Panel.rank.result = arg.result
                        that.Panel.rank.mode = arg.mode
                        that.Panel.rank.range = arg.range
                        setTimeout(function () {
                            that.show.rank = false
                        },3000)
                    },100)
                }else if(arg.type == 'display'){
                    that.show.rank = true
                    setTimeout(function () {
                        that.Panel.rank.counter++
                        that.Panel.rank.result = arg.result
                        that.Panel.rank.mode = arg.mode
                        that.Panel.rank.range = arg.range
                    },100)
                }else if(arg.type == 'hide'){
                    that.show.rank = false
                }else{
                    null
                }

            })


            //点击显示个人信息的动画
            ipcRenderer.on('main-show-cubing-personalinfo', (event, arg) => {
                console.log('准备显示界面',arg) // prints "pong"
                if(arg.type == 'auto'){
                    that.show.personalInfo = true
                    setTimeout(function () {
                        that.Panel.personalInfo.counter++
                        that.Panel.personalInfo.result = arg.result
                        setTimeout(function () {
                            that.show.personalInfo = false
                        },3000)
                    },100)
                }else if(arg.type == 'display'){
                    that.show.personalInfo = true
                    setTimeout(function () {
                        that.Panel.personalInfo.counter++
                        that.Panel.personalInfo.result = arg.result
                    },100)
                }else if(arg.type == 'hide'){
                    that.show.personalInfo = false
                }else{
                    null
                }

            })


            //点击更改live的设置
            ipcRenderer.on('main-change-cubing-live-setting', (event, arg) => {
                console.log('更改live的设置',arg) // prints "pong"
                that.show.live = arg
            })


            // 接受到粗饼页面的直播socket数据
            ipcRenderer.on('main-show-cubing-live', (event, arg) => {
                console.log('得到socket数据',arg) // prints "pong"
                var that = this
                var LiveModuleSwitch = arg.switch
                var type = arg.type
                var LiveData = arg.data

                if(type == 'allUser' && LiveModuleSwitch.whole == true && LiveModuleSwitch.allUser == true){
                    console.warn('in this line')
                    that.LiveUserList = LiveData
                    that.Panel.Live.counter++
                    that.Panel.Live.type = type
                    that.Panel.Live.result = LiveData
                    setTimeout(function () {
                        that.show.live.allUser = true
                    },100)
                }
                else if(type == 'allResult' && LiveModuleSwitch.whole == true && LiveModuleSwitch.allResult == true){
                    console.warn('in allresult line')
                    if(LiveData.length){
                        for(var index =0;index<LiveData.length;index++){
                            var detail = []
                            if(LiveData[index].v.length){
                                for(var i=0;i<LiveData[index].v.length;i++){
                                    detail.push(timeResultFormat.sec2normal(LiveData[index].v[i]) )
                                }
                            }

                            var value = {
                                id : LiveData[index].n,
                                event : LiveData[index].e,
                                round : LiveData[index].r,
                                filter : LiveData[index].f,
                                comId : LiveData[index].c,
                                Avg : timeResultFormat.sec2normal(LiveData[index].a),
                                Single : timeResultFormat.sec2normal(LiveData[index].b),
                                detail : detail
                            }
                            that.$set(that.LiveResultAll,index,value)
                        }
                    }
                    that.Panel.Live.counter++
                    that.Panel.Live.type = type
                    that.Panel.Live.result = LiveData
                    setTimeout(function () {
                        that.show.live.allResult = true
                        setTimeout(function () {
                            that.show.live.allResult = false
                        },3000)
                    },100)
                }
                else if(type == 'ResultUpdate' && LiveModuleSwitch.whole == true && LiveModuleSwitch.updateResult == true){
                    console.warn('in update result line')
                    if(LiveData){
                        var detail = []
                        if(LiveData.v.length){
                            for(var i=0;i<LiveData.v.length;i++){
                                detail.push(timeResultFormat.sec2normal(LiveData.v[i]) )
                            }
                        }
                        var value = {
                            id : LiveData.n,
                            event : LiveData.e,
                            round : LiveData.r,
                            filter : LiveData.f,
                            comId : LiveData.c,
                            Avg : timeResultFormat.sec2normal(LiveData.a),
                            Single : timeResultFormat.sec2normal(LiveData.b),
                            detail : detail,
                        }
                        that.LiveResultUpdate = value
                    }
                    that.Panel.Live.counter++
                    that.Panel.Live.type = type
                    that.Panel.Live.result = LiveData
                    setTimeout(function () {
                        that.show.live.updateResult = true
                        setTimeout(function () {
                            that.show.live.updateResult = false
                        },6000)
                    },100)
                }
                else if(type == 'messageRecent' && LiveModuleSwitch.whole == true && LiveModuleSwitch.recentMessage == true){
                    console.warn('in recentmessage line')
                    that.Panel.Live.counter++
                    that.Panel.Live.type = type
                    that.Panel.Live.result = LiveData
                    setTimeout(function () {
                        that.show.live.recentMessage = true
                        setTimeout(function () {
                            that.show.live.recentMessage = false
                        },3000)
                    },100)
                }
                else if(type == 'messageNew' && LiveModuleSwitch.whole == true && LiveModuleSwitch.newMessage == true){
                    console.warn('in messageNew line')
                    that.Panel.Live.counter++
                    that.Panel.Live.type = type
                    that.Panel.Live.result = LiveData
                    setTimeout(function () {
                        that.show.live.newMessage = true
                        setTimeout(function () {
                            that.show.live.newMessage = false
                        },3000)
                    },100)
                }

            })




            // 点击重新爬取数据时候
            ipcRenderer.on('main-update-cubing-record', (event, arg) => {
                console.log('准备重新获取数据',arg) // prints "pong"
            })
        },
        methods:{
        },
        components :{RecordPanel,PrerankPanel,SchedulePanel,RankPanel,PersonalInfoPanel},
    }
</script>

<style scoped>
@import "/node_modules/vue2-animate/dist/vue2-animate.min.css";

::-webkit-scrollbar {display:none}
    .cubing-message-new{
        position: fixed;
        height: 80px;
        width: 30%;
        top: 0%;
        right: 0%;
        margin: 0px;
        background-color: #2f3228;
        font-size: 50px;
        color: white;
        text-align: center;
        vertical-align: middle;
    }

    .message-new{
        padding: 5px !important;
        margin-left: 0px !important;
        font-size: 20px;
        text-align: center;
        color: white;
        text-shadow: 0 0 1px #d45ddc, 0 0 1px #322925, 0 0 1px #312932, 0 0 1px #2f3228, 0 0 1px #00ade7, 0 0 1px #00ade7, 0 0 1px #00ade7;

    }

    .cubing-result-update{
        position: fixed;
        width: 20%;
        top: 40%;
        bottom: 40%;
        right: 2%;
        background-color: #312932;
        text-align: center;
        color: white;
        font-size: 20px;
    }
    .cubing-result-update .result-name{
        color: #fff;
        vertical-align: middle;
        font-size: 25px;
        font-weight: 700;
        text-shadow: 0 0 1px #4a77dc, 0 0 1px #5379dc, 0 0 1px #2e58e7, 0 0 1px #00ade7, 0 0 1px #00ade7, 0 0 1px #00ade7, 0 0 1px #00ade7;
    }
    .result-list, .result-summary,.result-name{
        vertical-align: middle;
    }
    .cubing-result-update .result-summary span{
        color: gold;
        font-size: 25px;
        padding-right: 10px;
        padding-left: 10px;
    }
    .cubing-result-update .result-list span{
        color: #ff43ca;
        font-size: 26px;
        font-weight: 900;
        padding-right: 5px;
        padding-left: 5px;
        text-shadow: 0 0 2px #d8faf2, 0 0 2px #d8faf2, 0 0 2px #d8faf2, 0 0 2px #00ade7, 0 0 2px #00ade7, 0 0 2px #00ade7, 0 0 2px #00ade7;
    }

    .cubing-result-all{
        width: 50%;
        position: fixed;
        top: 5%;
        bottom: 20%;
        right: 25%;

    }
    .cubing-result-all table{
        width: 100%;
        border-collapse: collapse;   /*非常重要让th没有边距*/
        /*background-color: yellow;*/
    }
    .cubing-result-all thead{
        background-color: #ff4bed;
        color: #fff;
        vertical-align: middle;
        border-color: inherit;
        font-size: 20px;
        font-weight: 700;
        width: 80%;
        text-shadow: 0 0 1px #4a77dc, 0 0 1px #5379dc, 0 0 1px #2e58e7, 0 0 1px #00ade7, 0 0 1px #00ade7, 0 0 1px #00ade7, 0 0 1px #00ade7;
    }
    .cubing-result-all thead tr{
        height: 50px;
        line-height: 30px;
        width: 80%;
        /*cursor: default;*/
        border-bottom: 1px solid #0b3a69;
    }
    .cubing-result-all tbody{
        background-color: #555555;
        width: 80%;
        /*background: url('../assets/rank.png') no-repeat;*/
        /*background-size: 100%;*/
    }
    .cubing-result-all tbody tr{

    }
    .rank-list td{
        text-align: center;
        /*background-color: gold;*/
        color: white;
        height: 44px;
        line-height: 30px;
        border-bottom: 1px solid #0b3a69;
    }
    .rank-number {
        color: #fff;
        font-weight: 700;
        font-style: italic;
        font-size: 25px;
        width: 100px;
    }
    .rank-name {
        color: #29d3ff !important;
        font-size: 20px;
    }



body{
    overflow-x: hidden;
    overflow-y: hidden;
}

</style>