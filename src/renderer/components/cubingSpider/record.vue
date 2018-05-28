<template>
    <div v-if="isdisplay">
        <el-button-group >
            <el-button type="primary" @click="showRecordRegion('China')" icon="el-icon-location-outline">中国</el-button>
            <el-button type="primary" @click="showRecordRegion('Hong+Kong')" icon="el-icon-location-outline">香港</el-button>
            <el-button type="primary" @click="showRecordRegion('Taiwan')" icon="el-icon-location-outline">台湾</el-button>
            <el-button type="primary" @click="showRecordRegion('Asia')" icon="el-icon-location-outline">亚洲</el-button>
            <el-button type="primary" @click="showRecordRegion('USA')" icon="el-icon-location-outline">美国</el-button>
            <el-button type="primary" @click="showRecordRegion('world')" icon="el-icon-location-outline">世界</el-button>
            <el-button type="success"  @click="ipcToMain('auto',Region)" icon="el-icon-search">自动</el-button>
            <el-button type="primary"  @click="ipcToMain('display',Region)" icon="el-icon-search">显示</el-button>
            <el-button type="warning"  @click="ipcToMain('hide',Region)" icon="el-icon-search">隐藏</el-button>
            <el-button type="danger"  @click="refreshRecord()" icon="el-icon-search">重新获取</el-button>
        </el-button-group>


        <div v-for="event,eventName in RegionDisplay.nowadays">
            <el-row :gutter="20">
                <el-col :span="11">
                    <div class="grid-content bg-purple" >
                        <el-button type="success" class="result result-competition" >{{event.single[0].competitionName}}</el-button>
                        <el-button type="warning" class="result result-player">{{event.single[0].playerName}}</el-button>
                        <el-button type="primary" class="result result-value" >{{event.single[0].Result}}</el-button>
                </div>
                </el-col>
                <el-col :span="2"><div class="grid-content bg-purple">
                    <el-button type="danger" class="result result-eventname">{{eventName}}</el-button>
                </div></el-col>
                <el-col :span="11" v-if="event.average[0]">
                    <div class="grid-content bg-purple">
                        <el-tooltip popper-class="tooltip" :content="formataverage(event.average[0].detail)" placement="left" effect="dark">
                            <el-button type="success" class="result result-value" >{{event.average[0].Result}}</el-button>
                        </el-tooltip>
                        <el-button type="warning" class="result result-player">{{event.average[0].playerName}}</el-button>
                        <el-button type="primary" class="result result-competition" >{{event.average[0].competitionName}}</el-button>
                    </div>
                </el-col>

            </el-row>




        </div>
    </div>

</template>

<script>
        import fs from 'fs'
        import path from 'path'
        const {ipcRenderer} = require('electron')

        export default {
            name: "record",
            data(){
            return{
                RegionDefault : ['World','China','Hong+Kong','Taiwan','USA','Asia'],
                Record: {
                    China:{},
                    Asia:{},
                    USA:{},
                    world:{},
                    HongKong:{},
                    Taiwan:{},
                },
                RegionDisplay: {},
                Region:'China'
            }
        },
        // activated(){
        //     var filepath = path.join(__dirname, './../../assets/Competitions/'+ this.comname + '/schedule.json' )
        //     var ScheduleJson = JSON.parse(fs.readFileSync(filepath, 'utf8'))
        //     console.log(ScheduleJson)
        // },
        methods:{
            formataverage :function (data) {
                var str = ''
                for(var ele in data){
                    str += data[ele] + ' '
                }
                return str
            },
            showRecordRegion: function(region){
                var filepath = path.join(__dirname, './../../assets/Records/'+ region +'.json' )
                var RecordJson = JSON.parse(fs.readFileSync(filepath, 'utf8'))
                this.$set(this.Record,region,RecordJson)
                this.RegionDisplay = RecordJson
                this.Region = region
            },
            ipcToMain : function (action,region) {
                if(action == 'update'){
                    ipcRenderer.send('render-update-cubing-record', region || 'China')
                    console.log('update')
                }
                else{
                    let data = {}
                    data.type = action
                    data.region = region || 'China'
                    ipcRenderer.send('render-show-cubing-record', data)
                    console.log('already',data)
                }

            },
            refreshRecord :function (region) {
                // var that = this
                region = (region==undefined) ? this.RegionDefault : region
                console.log('region is ',region)
                this.$emit('refresh-record',region)
            }
        },
        props : ['comname','isdisplay'],
        watch:{
            comname:function () {

            },
            isdisplay : function () {
                if(this.isdisplay == true){
                    var filepath = path.join(__dirname, './../../assets/Records/China.json' )
                    var RecordJson = JSON.parse(fs.readFileSync(filepath, 'utf8'))
                    this.$set(this.Record,'China',RecordJson)
                    // console.log('RecordJson',RecordJson)
                }
        }
        }
    }
</script>


<style scoped>
    .result{
        padding: 5px !important;
        margin-top: 5px !important;
    }
    .result.result-value{
        width: 20%;
    }
    .result.result-player{
        width: 35%;
    }
    .result.result-competition{
        width: 35%;
    }
    .result.result-eventname{
        width: 100%;
    }
    .tooltip {
        padding: 8px 10px;
        background-color: yellow;
    }
</style>