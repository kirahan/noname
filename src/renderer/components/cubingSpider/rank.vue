<template>
    <div v-if="isdisplay">
        <el-row :gutter="10">
            <el-col :span="4">
                <el-slider @change="getnewlist" v-model="rankRange" range show-stops :step="5" :max="100"></el-slider>
            </el-col>
            <el-col :span="20" style="text-align: left">
                <span class="select-title">区域选择</span>
                <el-select v-model="SelectedRegion" class="select-region" filterable placeholder="请选择">
                    <el-option-group
                            v-for="group in region"
                            :key="group.label"
                            :label="group.label">
                        <el-option
                                v-for="item in group.options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-option-group>
                </el-select>

                <span class="select-title">项目选择</span>
                <el-select v-model="SelectedEvent" class="select-event" placeholder="请选择">
                    <el-option
                            v-for="item,name in event"
                            :key="item"
                            :label="item"
                            :value="item">
                    </el-option>
                </el-select>

                <span class="select-title">性别</span>
                <el-select v-model="SelectedGender" class="select-event" placeholder="请选择">
                    <el-option
                            v-for="item in gender"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>

                <el-button-group >
                    <el-button type="success" class="btn-tools"  @click="showRankSingle" icon="el-icon-search">单次</el-button>
                    <el-button type="primary" class="btn-tools"  @click="showRankAverage" icon="el-icon-search">平均</el-button>
                </el-button-group >

                <el-button-group >
                <el-button type="success" class="btn-tools"  @click="ipcToMain('auto')" icon="el-icon-search" >自动:从{{rankRange[0]}}到{{rankRange[1]}}名</el-button>
                <el-button type="warning" class="btn-tools" @click="ipcToMain('display')"  icon="el-icon-search" >显示</el-button>
                <el-button type="primary" class="btn-tools" @click="ipcToMain('hide')"  icon="el-icon-search" >隐藏</el-button>
                <el-button type="danger"  class="btn-tools"  @click="refreshRank" icon="el-icon-search">重新获取</el-button>
                <el-button type="info"  class="btn-tools"  @click="hideprocess" icon="el-icon-search">隐藏进度条</el-button>
                </el-button-group >
            </el-col>

        </el-row>

        <el-row>
            <el-col :span="processPanelWidth">
                <div v-for="region,index in rankRegionTask">
                    <el-button @click="RefreshRankOneRegion(region)" type="warning" class="btn-getrank">单独获取</el-button><span>{{region}}:{{rankprocess[region] + '%'}}</span>
                    <el-progress   :percentage="rankprocess[region]" :color="colorList[index]" :stroke-width="18" :text-inside="true"></el-progress>
                </div>
            </el-col>

        </el-row>

        <el-row>
            <el-col v-if="isShowSingle" :span="16" :offset="4" v-for="player,index in DataShownSingle">
            <div class="grid-content bg-purple" >
                <el-button type="success" class="result result-index" >{{index + 1 }}</el-button>
                <el-button type="success" class="result result-competition" >{{player.competitionName}}</el-button>
                <el-button type="warning" class="result result-player">{{player.playerName}}</el-button>
                <el-button type="primary" class="result result-value" >{{player.result}}</el-button>
            </div>
            </el-col>

            <el-col v-if="isShowAverage" :span="20" :offset="2" v-for="player,index in DataShownAverage">
                <div class="grid-content bg-purple" >
                    <el-button type="success" class="result result-index" >{{index + 1 }}</el-button>
                    <el-button type="success" class="result result-competition" >{{player.competitionName}}</el-button>
                    <el-button type="warning" class="result result-value">{{player.playerName}}</el-button>
                    <el-button type="primary" class="result result-value-small" >{{player.result}}</el-button>
                    <el-button-group >
                        <el-button v-for="result in player.detail" type="danger" class="result" >{{result}}</el-button>
                    </el-button-group >
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import fs from  'fs'
    import path from 'path'
    const {ipcRenderer} = require('electron')

    export default {
        name: "rank",
        data(){return{
            isShowSingle : false,
            isShowAverage : false,
            processPanelWidth : 0,
            DataShownSingle : {},
            DataShownAverage : {},
            DataShown:{},
            rankRegionTask : ['World','China','Hong+Kong','Taiwan','USA','Asia','Africa','Europe',
                'North+America','South+America','Oceania','Japan','Korea','Australia'],
            SelectedEvent : '三阶',
            SelectedRegion : 'China',
            SelectedGender : 'all',
            SelectedType : 'single',
            gender : [{label:'所有',value:'all'},{label:'男',value:'male'},{label:'女',value:'female'}],
            event :{
                333 :'三阶',
                222 :'二阶',
                444 :'四阶',
                555 :'五阶',
                666 :'六阶',
                777 :'七阶',
                '333bf' :'三盲',
                '333fm' :'最少步',
                '333oh' :'单手',
                '333ft' :'脚拧',
                minx :'五魔方',
                pyram :'金字塔',
                clock :'魔表',
                skewb :'斜转',
                sq1 :'SQ1',
                '444bf':'四盲',
                '555bf' :'五盲',
                '333mbf' :'多盲'
            },
            region : [
                {label : '世界',
                        options : [
                            {
                            value: 'World',
                            label : '世界',
                        }
                        ]
                    },
                {
                    label : '洲',
                    options : [
                        {
                            value: 'Asia',
                            label : '亚洲',
                        },
                        {
                            value : 'Africa',
                            label : '非洲'
                        },
                        {
                            value: 'Europe',
                            label : '欧洲',
                        },
                        {
                            value: 'North+America',
                            label : '北美',
                        },
                        {
                            value: 'South+America',
                            label : '南美',
                        },
                        {
                            value: 'Oceania',
                            label : '大洋',
                        },
                    ]
                },
                {
                    label : '地区',
                    options : [
                        {
                            value: 'China',
                            label : '中国',
                        },
                        {
                            value: 'Hong+Kong',
                            label : '香港',
                        },
                        {
                            value: 'Taiwan',
                            label : '台湾',
                        },
                        {
                            value: 'Japan',
                            label : '日本',
                        },
                        {
                            value: 'Korea',
                            label : '韩国',
                        },
                        {
                            value: 'USA',
                            label : '美国',
                        },
                        {
                            value: 'Australia',
                            label : '澳大利亚',
                        },
                    ]
                }],
            rankRange : [0,20],
            colorList : ['#66CCCC','#CCFF66','#CCFF66','#FF6666','#99CCFF','#FFFF99','#CCCCFF','#CCCCCC','#CC0066','#FFFF66','#CC6633','#FF0033','#9933CC','#0099FF'],
        }},
        props : ['isdisplay','rankprocess'],
        methods:{
            showRankSingle : function () {
                this.isShowSingle = true
                this.isShowAverage = false

                var region = this.SelectedRegion
                var event = this.SelectedEvent
                var gender = this.SelectedGender
                this.SelectedType = 'single'
                var type = 'single'

                var filepath = path.join(__dirname, './../../assets/Rankings/'+ region +'.json' )
                var RankingJson = JSON.parse(fs.readFileSync(filepath, 'utf8'))
                this.$set(this,'DataShownSingle',RankingJson[event][type][gender])
                this.DataShown = RankingJson[event][type][gender].slice(this.rankRange[0],this.rankRange[1])
            },
            showRankAverage : function () {
                this.isShowSingle = false
                this.isShowAverage = true

                var region = this.SelectedRegion
                var event = this.SelectedEvent
                var gender = this.SelectedGender
                this.SelectedType = 'average'
                var type = this.SelectedType

                var filepath = path.join(__dirname, './../../assets/Rankings/'+ region +'.json' )
                var RankingJson = JSON.parse(fs.readFileSync(filepath, 'utf8'))

                this.$set(this,'DataShownAverage',RankingJson[event][type][gender])
                this.DataShown = RankingJson[event][type][gender].slice(this.rankRange[0],this.rankRange[1])
            },
            hideprocess : function(){
                this.processPanelWidth = (this.processPanelWidth==0)? 5 : 0
            },
            RefreshRankOneRegion : function(region){
                this.$emit('refresh-rank',[region])   //这个命令是新生成一个url队列
            },
            refreshRank : function () {
                this.processPanelWidth = 5
                this.$emit('refresh-rank',this.rankRegionTask)   //这个命令是新生成一个url队列
                // this.$emit('refresh-rank','file')   //这个命令是从 TaskURL.json文件中获取url队列
            },
            ipcToMain : function (action) {
                let data = {}
                data.type = action
                data.result = this.DataShown
                data.range = this.rankRange[0]
                if(this.isShowSingle){
                    data.mode = 'single'
                }else if(this.isShowAverage){
                    data.mode = 'average'
                }
                ipcRenderer.send('render-show-cubing-rank', data)
                console.log('already',data)
            },
            getnewlist : function () {
                var that = this
                if(this.isShowSingle){
                    that.DataShown = that.DataShownSingle.slice(that.rankRange[0],that.rankRange[1])
                }else if(this.isShowAverage){
                    that.DataShown = that.DataShownAverage.slice(that.rankRange[0],that.rankRange[1])
                }
                console.log(this.DataShown)
            }
        },
        computed : {
        },
    }
</script>

<style scoped>
    .btn-tools{
        padding: 12px !important;
    }
    .btn-getrank{
        /*margin: 0px !important;*/
        padding: 2px !important;
    }

    .select-title{
        background-color: yellow;
        padding: 12px;
        border-radius: 10px;
        color: #9d9d9d;
    }
    .select-region,.select-event{
        max-width: 100px;
    }

    .result{
        padding: 5px !important;
        margin-top: 5px !important;
    }
    .result.result-index{
        width: 5%;
    }
    .result.result-value{
        width: 20%;
    }
    .result.result-value-small{
        width: 10%;
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
</style>