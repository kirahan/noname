<template>
    <div style="background-color: #6a6a6a">

        <el-container style="margin-top: 15px;">
            <el-main>

                <el-row :gutter="5">
                    <el-col :span="leftwindowsize"><div class="grid-content bg-purple">
                        <el-input v-model="comurl" placeholder="请输入比赛链接例如:https://cubingchina.com/competition/Nanning-Open-2018"  class="input-with-select">
                            <el-button slot="append" @click="initCom" icon="el-icon-search"></el-button>
                        </el-input>


                        <el-card class="box-card" id="basicInfo">
                            <div v-for="ele in comInfo" class="text item">
                                {{ele}}
                            </div>

                        </el-card>

                        <el-card>
                            <el-button-group >
                                <el-button type="primary" @click="showView('Record')" icon="el-icon-share">各种记录</el-button>
                                <el-button type="primary" @click="showView('Rank')" icon="el-icon-delete">各类排名</el-button>
                            </el-button-group>

                            <el-button-group >
                                <el-button type="success" @click="showView('Schedule')" icon="el-icon-edit">赛程安排</el-button>
                                <el-button type="success" @click="showView('Statistics')" icon="el-icon-delete">信息统计</el-button>
                                <el-button type="success" @click="showView('Competitors')" icon="el-icon-delete">选手资料</el-button>
                                <el-button type="success" @click="showView('Prerank')" icon="el-icon-delete">预排名</el-button>
                                <el-button type="danger" @click="showView('Live')" icon="el-icon-delete">成绩直播</el-button>
                            </el-button-group>

                        </el-card>

                        <cubingschedule :comname="comInfo.name" :isdisplay="isDisplay.Schedule" ></cubingschedule>
                        <cubingstatistics :isdisplay="isDisplay.Statistics" ></cubingstatistics>
                        <cubinglive :isdisplay="isDisplay.Live" ></cubinglive>
                        <cubingcompetitors @get-player-info="getplayerinfo" :playersprocess="process.CompetitiorsModule" :comlist="ComList" :isdisplay="isDisplay.Competitors" ></cubingcompetitors>
                        <cubingprerank @refresh-prerank="refreshPrerank" :comname="comInfo.name" :comurl="comInfo.url" :isdisplay="isDisplay.Prerank" ></cubingprerank>
                        <cubingrecord @refresh-record="refreshRecord" :isdisplay="isDisplay.Record" :comname="comInfo.name" ></cubingrecord>
                        <cubingrank @refresh-rank="refreshRank"  :rankprocess="process.RankModule" :isdisplay="isDisplay.Rank"></cubingrank>
                    </div>
                    </el-col>

                    <el-col :span="0.2" >
                        <!--<div style="height: 45%"></div>-->
                        <div class="grid-content right-small">
                            <i :class="leftbtnicon" @click="minimizeright"></i>
                        </div>
                    </el-col>

                    <el-col :span="23-leftwindowsize"><div class="grid-content right-window">
                        <windowpreview class="preview-obs" :windowtitle="'OBS'"></windowpreview>
                        <windowpreview class="preview-green" :windowtitle="'舞台'"></windowpreview>
                    </div></el-col>

                </el-row>


    </el-main>
    </el-container>


    <!--<el-progress :text-inside="true" :stroke-width="18" :percentage="process" status="success"></el-progress>-->
    </div>
</template>

<script>
    import cbspider from './cubingSpider/cubingSpider'
    import cubingrecord from  './cubingSpider/record'
    import cubingrank from  './cubingSpider/rank'
    import windowpreview from  './cubingSpider/preview'
    import cubingschedule from  './cubingSpider/schedule'
    import cubingstatistics from  './cubingSpider/statistics'
    import cubingprerank from  './cubingSpider/prerank'
    import cubingcompetitors from  './cubingSpider/competitors'
    import cubinglive from './cubingSpider/live'

    var spider = new cbspider()


    export default {
        name: "cubingSpider",
        data(){
            return {
                comurl : '',
                process : 10,
                comInfo : {
                    name : '',
                    url : '',
                    date : '',
                    location : '',
                    delegate : '',
                    event : '',
                    playerLimit : '',
                },
                ComList : '',
                eventList : [],
                isDisplay : {

                    Record : false,
                    Rank : false,
                    Schedule : false,
                    Competitors : false,
                    Statistics : false,
                    Prerank : false,
                    Live  :  false ,
                },
                process :{
                    RankModule : {
                            World : 1,
                            China : 1,
                            "Hong+Kong" : 1,
                            Taiwan : 1,
                            USA : 1,
                            Asia : 1,
                            Africa : 1,
                            Europe : 1,
                            "North+America" : 1,
                            "South+America" : 1,
                            Oceania : 1,
                            Japan : 1,
                            Korea : 1,
                            Australia : 1,
                    },
                    CompetitiorsModule : 1
                },
                leftwindowsize : 20,
                leftbtnicon : 'el-icon-arrow-right',

            }
        },
        beforeCreate(){
            var that = this
            spider.vueViewModel = this

            spider.getComList(function (data) {
                that.ComList = data
            })
            // spider.comCompetitors.Enroll(function (enrollinfo) {
            //     console.log(enrollinfo)
            //     spider.comCompetitors.PreRank(enrollinfo.statistic.itemlist)
            // })
        },
        methods:{
            initCom : function () {
                var that = this

                if(that.comurl){
                    spider.comPageUrl = that.comurl
                    spider.getBasicComInfo(
                        function (data) {
                            that.comInfo.name = data.name
                            that.comInfo.url = data.url
                            that.comInfo.date = data.date
                            that.comInfo.location = data.location
                            that.comInfo.delegate = data.delegate
                            that.comInfo.event = data.event
                            that.comInfo.playerLimit = data.playerLimit

                            spider.getSchedule(function (data) {
                                for(var index in data.scheduleEvent){
                                    console.info(index)
                                    that.eventList.push(index)
                                }
                            })
                        }
                    )
                }else{
                    that.$message.error('错了哦，请输入比赛链接');
                }

            },
            showView : function (viewname) {
                var that = this
                for (var port in this.isDisplay){
                    that.isDisplay[port] = false
                }
                this.isDisplay[viewname] = true

            },
            refreshRank : function (data) {
                console.log('start refresh rank',data)
                if(data == 'file'){
                    spider.getRank('file')
                }else {
                    spider.createRankUrl(data,function (urllist) {
                        spider.getRank(urllist)
                        // console.log(urllist)
                        null
                    })
                }


            },
            refreshRecord : function(regionlist){
                console.log('start refresh record',regionlist)
                spider.getRecord(regionlist)
            },
            refreshPrerank : function(){
                console.log('in function refresh prerank',this.eventList)
                spider.comCompetitors.PreRank(this.eventList)
            },
            getplayerinfo : function(data){
                spider.getPlayerInfo(data,data.length)
            },
            minimizeright : function () {
                if(this.leftwindowsize == 23){
                    this.leftwindowsize = 20
                    this.leftbtnicon = 'el-icon-arrow-right'
                }else{
                    this.leftwindowsize = 23
                    this.leftbtnicon = 'el-icon-arrow-left'
                }
            },



        },
        components : {
            cubingrecord,
            cubingrank,
            windowpreview,
            cubingschedule,
            cubingstatistics,
            cubingcompetitors,
            cubingprerank,
            cubinglive,
        }
    }
</script>

<style scoped>
    .el-select .el-input {
        width: 130px;
    }
    .input-with-select .el-input-group__prepend {
        background-color: #fff;
    }
    .preview-obs{
        position: relative;
        width: 100%;
        /*pointer-events:none;*/
        /*text-align: right;*/
        /*right: 0%;*/
        /*bottom: 0%;*/
    }
    .preview-green{
        position: relative;
        width: 100%;
        /*pointer-events:none;*/
        /*left: 0%;*/
        /*top: 0%;*/
    }
    .right-window{
        background-color: #111111;
    }
    .right-small{
        display: table-cell;
        color: white;
        font-size: 20px;
        background-color: #42b983;
        height: 800px;
        vertical-align: middle;
    }

</style>