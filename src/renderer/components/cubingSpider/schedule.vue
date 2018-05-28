<template>
    <div v-if="isdisplay">
        <el-row :gutter="10">
            <el-col :span="4">
                <el-button type="danger" class="round round-title">轮次信息</el-button>
                <el-button-group v-for="event in Schedule.scheduleEvent" style="width: 100%">
                    <el-button type="success" class="round round-event">{{event.eventname}}</el-button>
                    <el-button type="warning" class="round round-num">{{event.roundnum}}</el-button>
                </el-button-group>
            </el-col>
            <el-col :span="20">
                <el-button type="danger" class="round round-title">时间安排</el-button>

                    <div v-for="event,index in Schedule.EventDetail" >
                        <el-col :span="width" >
                        <el-button-group style="width: 100%">
                            <el-button type="danger" class="round round-date">{{index}}</el-button>
                            <el-button type="warning" @click="ipcToMain('auto',[event,index])" class="round round-date">自动</el-button>
                            <el-button type="danger" @click="ipcToMain('display',[event,index])" class="round round-date">显示</el-button>
                            <el-button type="warning" @click="ipcToMain('hide',[event,index])" class="round round-date">隐藏</el-button>
                            <div v-for="item in event">
                                <el-button type="primary" class="round round-schedule">{{item.startTime + '-' +item.endTime}}</el-button>
                                <el-button type="success" class="round round-schedule">{{formatSchedule(item)}}</el-button>
                            </div>
                        </el-button-group>
                        </el-col>
                        </div>


            </el-col>
        </el-row>
    </div>
</template>

<script>
    import fs from 'fs'
    import path  from 'path'
    const {ipcRenderer} = require('electron')


    export default {
        name: "schedule",
        data(){
            return {
                Schedule : {},
                width : 24
            }
        },
        methods:{
            formatSchedule :function (data) {
                if(data.eventRound == undefined || data.eventRound == ''){
                    return  data.eventName
                }else{
                    return  data.eventName + '[' + data.eventRound + ']'
                }
            },
            // 不需要因为每次生成链接之后就会刷新一次时间安排
            refreshSchedule :function () {
                this.$emit('refresh-schedule')
            },
            ipcToMain : function (action,result) {
                let data = {}
                data.type = action
                data.result = result[0]
                data.date = result[1]
                ipcRenderer.send('render-show-cubing-schedule', data)
                console.log('already',data)
            }
        },
        computed:{

        },
        props : ['isdisplay','comname'],
        watch :{
            isdisplay :function () {
                var that = this
                if(this.isdisplay){
                    try{
                        var filepath = path.join(__dirname, './../../assets/Competitions/'+ that.comname + '/schedule.json' )
                        this.Schedule = JSON.parse(fs.readFileSync(filepath, 'utf8'))
                        this.width = 24 / (Object.keys(this.Schedule.EventDetail).length)
                        console.log(this.Schedule,this.Schedule.EventDetail)
                    }
                    catch(err){
                        that.$message.error('赛程不存在，请确认网址正确，或者已经爬取');
                        console.log('can not load schedule.json',err)
                    }
                }
            }
        }

    }
</script>

<style scoped>

    .round{
        padding: 5px !important;
        margin-top: 5px !important;
        color: white;
        font-size: 20px;
        text-shadow: 0 0 1px #4a77dc, 0 0 1px #5379dc, 0 0 1px #2e58e7, 0 0 1px #00ade7, 0 0 1px #00ade7, 0 0 1px #00ade7, 0 0 1px #00ade7;
    }
    .round.round-title{
        width: 100%;
    }
    .round.round-event{
        width: 70%;
    }
    .round.round-num{
        width: 30%;
    }
    .round.round-date{
        width: 25%;
    }
    .round.round-schedule{
        width: 50%;
    }
</style>