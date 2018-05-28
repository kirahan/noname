<template>
    <div>
        <el-col :span="16" :offset="4" style="margin-top: 50px">
            <el-button type="danger" class="round round-date">{{data.date}}赛程表</el-button>

                <el-button-group style="width: 100%">
                    <div v-for="item in data.result">
                        <el-button type="primary" class="round round-schedule">{{item.startTime + '-' +item.endTime}}</el-button>
                        <el-button type="warning" class="round round-schedule">{{formatSchedule(item)}}</el-button>
                    </div>
                </el-button-group>

        </el-col>
    </div>
</template>

<script>
    export default {
        name: "SchedulePanel",
        data(){
            return {

            }
        },
        methods :{
            formatSchedule :function (data) {
                if(data.eventRound == undefined || data.eventRound == ''){
                    return  data.eventName
                }else{
                    return  data.eventName + '[' + data.eventRound + ']'
                }
            },

        },
        props:['data','workingcounter'],
        watch :{}
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

    .round.round-date{
        width: 100%;
    }
    .round.round-schedule{
        width: 50%;
    }
</style>