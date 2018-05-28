<template>
    <div>
        <div >
            <el-row :gutter="0">
                <el-col :span="14" :offset="5" >
                    <el-button type="danger" class="result result-title">各项目单次及平均{{RegionName[region]}}记录</el-button>
                </el-col>
                <el-col :span="14" :offset="5" v-for="event,eventName in RegionDisplay">
                    <div class="grid-content bg-purple" style="text-align: left">
                        <el-button type="warning" class="result result-player">{{event.single[0].playerName}}</el-button>
                        <el-button type="primary" class="result result-value" >{{event.single[0].Result}}</el-button>
                        <el-button type="danger" class="result result-eventname">{{eventName}}</el-button>
                        <el-button v-if="event.average[0]" type="primary" class="result result-value" >{{event.average[0].Result}}</el-button>
                        <el-button v-if="event.average[0]" type="warning" class="result result-player">{{event.average[0].playerName}}</el-button>
                    </div>
                </el-col>
            </el-row>

        </div>
    </div>
</template>

<script>
    import fs from 'fs'
    import path from 'path'


    export default {
        name: "RecordPanel",
        data(){
            return{
                RegionName : {
                    China : '中国',
                    Asia : '亚洲',
                    'Hong+Kong' : '香港',
                    Taiwan : '台湾',
                    USA : '美国',
                    world : '世界',
                },
                RegionDisplay:{
                }
            }
        },
        props:['region','workingcounter'],
        methods: {},
        watch : {
            workingcounter : function () {
                var filepath = path.join(__dirname, './../../assets/Records/'+ this.region +'.json' )
                var RecordJson = JSON.parse(fs.readFileSync(filepath, 'utf8'))
                this.$set(this,'RegionDisplay',RecordJson.nowadays)
            }

        },
    }
</script>

<style scoped>

    .result{
        padding: 5px !important;
        margin-top: 5px !important;
        margin-left: 0px !important;
        font-size: 24px;
        color: white;
        text-shadow: 0 0 1px #d45ddc, 0 0 1px #322925, 0 0 1px #312932, 0 0 1px #2f3228, 0 0 1px #00ade7, 0 0 1px #00ade7, 0 0 1px #00ade7;

    }

    .result-title{
        width: 100%;
        padding: 20px!important;
        margin-top: 50px!important;
        font-size: 40px;
    }
    .result.result-eventname{
        width: 15%;
    }
    .result.result-value{
        width: 15%;
    }
    .result.result-player{
        width: 25%;
        font-size: 20px;
        background-color: #212532;
    }
</style>