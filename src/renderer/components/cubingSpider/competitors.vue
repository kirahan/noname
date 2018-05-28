<template>
    <div v-if="isdisplay">
                    <el-row>
                        <el-col :span="24">
                            <el-card style="padding: 10px;margin: 10px">
                                <el-col :span="20" :offset="4">
                                    <el-col :span="12">
                                        <el-button class="select-title">赛事列表</el-button>
                                        <el-cascader
                                                :options="options"
                                                :show-all-levels="false"
                                                v-model="SelectedCompetition"
                                        ></el-cascader>
                                        <el-button type="danger" @click="getPlayerInfoFromCom" class="">开始爬取所有参赛选手资料</el-button>
                                        <el-progress   :percentage="playersprocess" :stroke-width="18" :text-inside="true"></el-progress>
                                    </el-col>

                                    <el-col :span="12">
                                        <el-button-group style="width: 100%">
                                            <el-button type="danger" @click="ipcToMain('auto')" class="rank rank-btn">自动</el-button>
                                            <el-button type="warning" @click="ipcToMain('display')" class="rank rank-btn">显示</el-button>
                                            <el-button type="primary" @click="ipcToMain('hide')" class="rank rank-btn">隐藏</el-button>
                                        </el-button-group>

                                    </el-col>
                                </el-col>
                                <el-col :span="20" :offset="4"  style="margin-top: 20px">
                                    <el-input class="inputPlayerName" v-model="SelectedCompetitor" placeholder="请输入选手姓名">

                                        <el-button @click="searchPerson(SelectedCompetitor)" slot="append"><i class="el-icon-search"></i></el-button>
                                    </el-input>

                                    <el-input class="inputPlayerWCAID" v-model="SelectedWCAID" placeholder="请输入选手WCA ID">
                                        <el-button  slot="append"><i class="el-icon-view"></i></el-button>
                                        <el-button @click="searchURL('wcaid',SelectedWCAID)"  slot="append"><i class="el-icon-search"></i></el-button>
                                    </el-input>

                                    <el-input class="inputPlayerUrl" v-model="SelectedUrl" placeholder="请输入选手个人页面">
                                        <el-button  slot="append"><i class="el-icon-view"></i></el-button>
                                        <el-button @click="searchURL('url',SelectedUrl)" slot="append"><i class="el-icon-search"></i></el-button>
                                    </el-input>


                                    <el-card v-if="SearchList.length!=0" class="box-card inputPlayerName">
                                        <el-button-group class="search-person-group" v-for="ele in SearchList">
                                            <el-button  class="search-person-btn2" type="success" @click="searchURL('url',ele.url)"  >
                                                {{ele.name}}
                                            </el-button>
                                            <el-button type="primary" class="search-person-btn1"><i class="el-icon-view"></i></el-button>
                                        </el-button-group>

                                    </el-card>




                                </el-col>
                            </el-card>

                            <el-col :span="8">
                                <el-card>
                                    <el-col :span="24">
                                        <el-button style="width: 15%" type="success">赛事:</el-button>
                                        <el-select style="width: 80%" v-model="SelectedComListlocalFile" placeholder="请选择">
                                            <el-option v-for="com in ComListlocalFile"
                                                       :key="com.url"
                                                       :label="com.name" :value="com.name"></el-option>
                                        </el-select>
                                    </el-col>

                                    <el-col  :span="24">
                                        <el-button type="success" style="width: 15%">项目:</el-button>
                                        <el-cascader style="width: 80%"
                                                :options="ComEventOptions"
                                                v-model="SelectedEvent"
                                                 :show-all-levels="false"
                                                @change="showPlayerInfoFile">
                                        </el-cascader>
                                    </el-col>



                                </el-card>
                            </el-col>
                            <el-col :span="16">
                                <el-col  v-if="Object.keys(LocalFileData).length != 0" :span="24">
                                    <el-card class="player-base-info">
                                        <el-button type="warning" class="result result-middle-title">{{LocalFileData.BaseInfo.nationalName}}</el-button>
                                        <el-button type="warning" class="result ">{{LocalFileData.BaseInfo.region}}</el-button>
                                        <el-button type="warning" class="result ">{{LocalFileData.BaseInfo.wcaid}}</el-button>
                                        <el-button type="warning" class="result">{{LocalFileData.BaseInfo.gender}}</el-button>
                                        <el-button type="warning" class="result">{{LocalFileData.BaseInfo.competitionsNumber}}次参赛</el-button>
                                        <el-button type="warning" class="result">{{LocalFileData.BaseInfo.carrerperiod}}</el-button>
                                    </el-card>

                                    <el-col :span="12">
                                        <el-card v-if="Object.keys(LocalFileData.OverallMedal).length != 0" class="player-overall-medal">
                                            <p>{{LocalFileData.OverallMedal}}</p>
                                        </el-card>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-card v-if="Object.keys(LocalFileData.OverallRecord).length != 0"  class="player-overall-record">
                                            <p>{{LocalFileData.OverallRecord}}</p>
                                        </el-card>
                                    </el-col>




                                    <el-card class="player-rersonal-result">
                                        <el-button-group class="result result-thead">

                                            <el-button class="result result-title">单次WR</el-button>
                                            <el-button class="result result-title">单次CR</el-button>
                                            <el-button class="result result-title">单次NR</el-button>
                                            <el-button class="result result-title">成绩</el-button>
                                            <el-button class="result result-middle-title">项目</el-button>
                                            <el-button class="result result-title">成绩</el-button>
                                            <el-button class="result result-title">平均NR</el-button>
                                            <el-button class="result result-title">平均CR</el-button>
                                            <el-button class="result result-title">平均WR</el-button>

                                        </el-button-group>

                                            <div v-for="event in LocalFileData.PersonalResult">

                                                <el-button-group class="result result-single">
                                                    <el-button class="result result-single-rank" v-for="e in event">{{e.single.WRanking}}</el-button>
                                                    <el-button class="result result-single-rank" v-for="e in event">{{e.single.CRanking}}</el-button>
                                                    <el-button class="result result-single-rank" v-for="e in event">{{e.single.NRanking}}</el-button>
                                                    <el-button class="result result-single-rank" v-for="e in event">{{e.single.result}}</el-button>
                                                    <el-button class="result result-middle-title"  v-for="e,name in event" >{{name}}</el-button>
                                                    <el-button v-if="e.average.result!=''" class="result result-average-rank" v-for="e in event">{{e.average.result}}</el-button>
                                                    <el-button v-if="e.average.result!=''" class="result result-average-rank" v-for="e in event">{{e.average.NRanking}}</el-button>
                                                    <el-button v-if="e.average.result!=''" class="result result-average-rank" v-for="e in event">{{e.average.CRanking}}</el-button>
                                                    <el-button v-if="e.average.result!=''" class="result result-average-rank" v-for="e in event">{{e.average.WRanking}}</el-button>
                                                </el-button-group>

                                            </div>

                                        <el-button-group class="result result-sunofranks">
                                            <el-button class="result result-single-sunofranks">{{LocalFileData.SumofRanks.single.WR}}</el-button>
                                            <el-button class="result result-single-sunofranks">{{LocalFileData.SumofRanks.single.CR}}</el-button>
                                            <el-button class="result result-single-sunofranks">{{LocalFileData.SumofRanks.single.NR}}</el-button>
                                            <el-button class="result result-middle-title">SumOfRanks</el-button>
                                            <el-button class="result result-average-sunofranks">{{LocalFileData.SumofRanks.average.NR}}</el-button>
                                            <el-button class="result result-average-sunofranks">{{LocalFileData.SumofRanks.average.CR}}</el-button>
                                            <el-button class="result result-average-sunofranks">{{LocalFileData.SumofRanks.average.WR}}</el-button>

                                        </el-button-group>
                                    </el-card>



                                </el-col>
                            </el-col>
                        </el-col>

                    </el-row>
    </div>
</template>

<script>
    import request from 'request-promise'
    import cheerio from 'cheerio'
    import path from 'path'
    import fs from 'fs'

    const {ipcRenderer} = require('electron')
    import cbspider from './cubingSpider'
    var newspider = new cbspider()

    export default {
        name: "competitors",
        data(){
            return {
                SelectedCompetition : '',
                SelectedCompetitor : '',
                SelectedWCAID : '',
                SelectedUrl : '',
                SearchList : [],
                options : [
                    {
                        value: 'enrollOpen',
                        label: '报名中',
                        children : [
                        ],
                    },
                    {
                        value: 'enrollClose',
                        label: '已截止',
                        children : [
                        ],
                    },
                    {
                        value: 'enrollReady',
                        label: '即将开始',
                        children : [
                        ],
                    },
                    {
                        value: 'finish',
                        label: '已结束',
                        children : [
                        ],
                    }
                ],
                PlayerInfo: {},
                ComListlocalFile:{},
                SelectedComListlocalFile:'',
                ComEventOptions : [],
                SelectedEvent : '',
                LocalFileData : {},
    }
    },
        methods:{
            searchPerson:function (nameorid) {
                var that = this
                var options = {
                    method : 'GET',
                    uri : 'https://cubingchina.com/results/person?region=China&gender=all&name=' + encodeURI(nameorid)
                }

                var SearchResult = []
                request(options).then(function (body) {
                        var $ = cheerio.load(body);

                        try {

                            if($('tbody tr td span[class="empty"]').text()=='没有找到数据.'){
                                console.log('没有数据')
                            }
                            else{
                                var result = $('tbody tr')
                                result.filter(function () {
                                    let buffer = {}
                                    buffer.name = $(this).children('td').eq(1).children('a').text()
                                    buffer.url = $(this).children('td').eq(1).children('a').attr('href')
                                    buffer.wcaid = $(this).children('td').eq(2).text()
                                    SearchResult.push(buffer)
                                })
                            }


                            console.warn(SearchResult)
                            that.SearchList = SearchResult
                            // callback(SearchResult)
                            return SearchResult
                        }
                        catch (e) {
                            console.log(`最近的比赛列表错误，\n${e.stack}`)
                            return SearchResult
                        }
                    }

                ).catch(function (error) {
                    console.log(`搜索选手失败，\n${error}`)
                    return false
                })
            },
            searchURL: function (type,value) {
                var that = this
                if(type=='url'){
                    that.SelectedUrl =  'https://cubingchina.com' +  value
                    that.SelectedWCAID = value.split('/').pop()
                    console.info('get-player-info',that.SelectedUrl)
                }
                else if(type =='wcaid'){
                    that.SelectedUrl =  'https://cubingchina.com/results/person/' +  value
                    that.SelectedWCAID = value
                    console.info('get-player-info',that.SelectedUrl)
                }else{
                    console.error('错误的参数')
                }



                // newspider.getPlayerInfo(that.SelectedUrl,function (data) {
                //     console.log(that.SelectedWCAID)
                //     that.showPlayerInfoFile(that.SelectedWCAID)
                //
                // })
            },
            showPlayerInfoFile : function () {
                var playerwcaid = this.SelectedEvent[1]
                var filepath = path.join(__dirname, './../../assets/Players/'+ playerwcaid +'.json' )
                var PlayerInfoJson = JSON.parse(fs.readFileSync(filepath, 'utf8'))
                this.LocalFileData = PlayerInfoJson
                },
                getPlayerInfoFromCom : function(){
                    var that = this
                    var url = that.SelectedCompetition[1]
                    if(url.indexOf('live')!=-1){
                    url = url.replace('live','competition')
                }
                newspider.getPlayerListByEvent(url)
                newspider.createPlayerUrlTask(url,function (data) {
                    that.$emit('get-player-info',data)
                })
            },

            ipcToMain : function (action) {
                let data = {}
                data.result = this.LocalFileData
                data.type = action
                ipcRenderer.send('render-show-cubing-personalinfo', data)
                console.log('already',data)
            },



        },
        created(){
            var filepath = path.join(__dirname, './../../assets/Players/config/CompetitionList.json' )
            var PlayerInfoJson = JSON.parse(fs.readFileSync(filepath, 'utf8'))
            this.ComListlocalFile = PlayerInfoJson
        },

        props : ['comlist','isdisplay','playersprocess'],
        watch : {
            isdisplay : function () {
                var that = this

                for (var type in that.comlist){
                    if(type == 'enrollOpen'){
                        for (var list of that.comlist[type]){
                            let buffer = {}
                            buffer.value = list.comurl
                            buffer.label = list.comname
                            that.options[0].children.push(buffer)
                        }

                    }
                    else if(type == 'enrollClose'){
                        for (var list of that.comlist[type]){
                            let buffer = {}
                            buffer.value = list.comurl
                            buffer.label = list.comname
                            that.options[1].children.push(buffer)
                        }
                    }
                    else if(type == 'enrollReady'){
                        for (var list of that.comlist[type]){
                            let buffer = {}
                            buffer.value = list.comurl
                            buffer.label = list.comname
                            that.options[2].children.push(buffer)
                        }
                    }
                    else if(type == 'finish'){
                        for (var list of that.comlist[type]){
                            let buffer = {}
                            buffer.value = list.comurl
                            buffer.label = list.comname
                            that.options[3].children.push(buffer)
                        }
                    }
                    else {
                        null
                    }
                }

                // this.options[0].children
            },
            SelectedComListlocalFile : function () {
                var that = this
                var filename = this.SelectedComListlocalFile

                var filepath = path.join(__dirname, './../../assets/Players/config/'+ filename +'.json' )
                var PlayerInfoJson = JSON.parse(fs.readFileSync(filepath, 'utf8'))

                this.ComEventOptions = PlayerInfoJson.options
            },
        }
    }
</script>

<style scoped>
    .select-title{
        background-color: white;
    }
    .inputPlayerName{
        width: 40%;
    }
    .inputPlayerWCAID{
        width: 25%;
    }
    .inputPlayerUrl{
        width: 30%;
    }

    .right50 {
        width: 50%;
    }

    .search-person-group {
        width: 45%;
    }

    .search-person-btn2 {
        width: 83%;
        padding: 5px!important;
        margin: 1px!important;
    }

    .search-person-btn1 {
        width: 15%;
        padding: 5px!important;
        margin: 1px!important;
    }

    .player-overall-medal,.player-overall-record{

    }



    .result{
        padding: 5px !important;
        margin-left: 0px !important;
        font-size: 20px;
        text-align: center;
        color: white;
        text-shadow: 0 0 1px #d45ddc, 0 0 1px #322925, 0 0 1px #312932, 0 0 1px #2f3228, 0 0 1px #00ade7, 0 0 1px #00ade7, 0 0 1px #00ade7;
    }

    .result-thead,.result-single,.result-sunofranks{
        width:100%;
    }
    .result-title,.result-single-rank,.result-average-rank{
        width: 10%;
    }
    .result-single-sunofranks,.result-average-sunofranks{
        width: 13%;
        background-color: #6a6a6a;
    }
    .result-title{
        background-color: #2f3228;
    }
    .result-middle-title{
        width:15%;
        background-color: #ac2925;
        font-size: 20px;
    }
    .result-single-rank{
        background-color: #42b983;
    }
    .result-average-rank{
        background-color: darkgoldenrod;
    }
</style>