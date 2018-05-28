/**
 * Created by kira on 2017/9/7.
 */
import fs from 'fs'
import path from 'path'
import request from 'request-promise'
import moment from  'moment'
import cheerio from 'cheerio'

function savejson(path1,path2,part3,data) {
    var WholePath = path1 + path2
    if (!fs.existsSync(WholePath)) {
        console.log (WholePath)
        fs.mkdirSync(WholePath);
        WholePath = WholePath + part3
    }else {
        WholePath = WholePath +part3
    }
    fs.writeFileSync(WholePath,JSON.stringify(data),{flag:'w+'});
}



function cbspider(){
    var that = this

    this.vueViewModel
    this.comInfo = {
        name : '',
        urlstr : '',
    }
    this.config = {
        homepage : "https://cubingchina.com/",
        competitionsList : 'https://cubingchina.com/competition',
        resultPage : 'https://cubingchina.com/results/',
        livePage :'https://cubingchina.com/live/',
        ResultItem : {
            person : 'person',
            competition : 'competition',
            rankings : 'rankings',
            records : 'records',
            statistics : 'statistics',
            competitors : 'competitors'
        },
        REGION : {
            world : 'World',
            continents :{
                Asia : 'Asia',
                Africa : 'Africa',
                Europe : 'Europe',
                NorthAmerica : 'North America',
                Oceania : 'Oceania',
                SouthAmerica : 'South America'
            },
            region : {
                China : 'China',
                HongKong : 'Hong+Kong',
                Taiwan : 'Taiwan',
                USA : 'USA',
                Japan : 'Japan'
            }
        },
        EVENT : {
            三阶 :'333',
            二阶 :'222',
            四阶 :'444',
            五阶 :'555',
            六阶 :'666',
            七阶 :'777',
            三盲 :'333bf',
            最少步 :'333fm',
            单手 :'333oh',
            脚拧 :'333ft',
            五魔方 :'minx',
            金字塔 :'pyram',
            魔表 :'clock',
            斜转 :'skewb',
            SQ1 :'sq1',
            四盲 :'444bf',
            五盲 :'555bf',
            多盲 :'333mbf',
        },
        EventString2Chinese : {
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
        defaultPath : {
            Enrollinfo : that.comInfo.name + '/Enroll',
            Personalinfo : that.comInfo.name + '/Person',

        },
    }

    this.comPageUrl = 'https://cubingchina.com/competition/Lishui-University-Open-2018'
    this.updataDate = '2018/5/16'

    // this.process = vm.$data.process


    this.comCompetitors = {
        Enroll(callback) {
            console.log('the spider is ',that)
            let Enrollinfo = {
                statistic : {
                    itemlist : [],
                    itemenrollnum:{}
                },
                list: []
            }


            let options = {
                method : 'GET',
                uri : that.comPageUrl + '/'+ that.config.ResultItem.competitors
            }
            // console.log(options.uri)
            request(options).then(function (body) {
                var $ = cheerio.load(body)
                var competitionName = $('.breadcrumbs-list').children('li').eq(3).children('a').text();
                that.comInfo.name = competitionName
                // 得到list
                try {
                    Enrollinfo.statistic.number = $('tbody tr').eq(0).children("td").eq(1).text();
                    Enrollinfo.statistic.newPlayer = $('tbody tr').eq(0).children("td").eq(2).text().split('/')[0];
                    Enrollinfo.statistic.oldPlayer = $('tbody tr').eq(0).children("td").eq(2).text().split('/')[1];
                    Enrollinfo.statistic.malePlayer = $('tbody tr').eq(0).children("td").eq(3).text().split('/')[0];
                    Enrollinfo.statistic.femalePlayer = $('tbody tr').eq(0).children("td").eq(3).text().split('/')[1];

                    var itemnum = $('thead tr').eq(0).children("th").length
                    for (var i = 5;i<itemnum; i++){
                        var itemname = $('thead tr').eq(0).children("th").eq(i).children("a").children("i").attr('title')
                        Enrollinfo.statistic.itemlist.push(itemname)
                        Enrollinfo.statistic.itemenrollnum[itemname] = $('tbody tr').eq(0).children("td").eq(i).text();
                    }


                    $('tbody tr').filter(function () {
                        if($(this).attr('class')== 'odd' || $(this).attr('class')== 'even'){
                            var buffer = {
                                itemlist : []
                            }

                            buffer.number = $(this).children('td').eq(1).text();
                            buffer.playerName = $(this).children('td').eq(2).children('a').text();  //只取有ID的
                            // buffer.playerName = $(this).children('td').eq(2).text();
                            buffer.playerUrl = $(this).children('td').eq(2).children('a').attr('href');
                            buffer.gender = $(this).children('td').eq(3).text();
                            buffer.region = $(this).children('td').eq(4).text();

                            for(var i = 5 ; i<itemnum; i++){
                                if($(this).children('td').eq(i).children('span').length !=0){
                                    buffer.itemlist.push($('thead tr').eq(0).children("th").eq(i).children("a").children("i").attr('title'))
                                }
                            }

                            Enrollinfo.list.push(buffer)
                        }
                    })



                }

                catch (e){
                    console.log('can not get ranking list in [cubing] module :', e.stack);
                }

                //保存文件
                var filename = '/enrollinfo' + '.json';
                savejson(path.join(__dirname, "./../../assets/Competitions/"+ competitionName + '/'),'Enroll',filename,Enrollinfo)
                callback(Enrollinfo)
                return Enrollinfo
            }).catch(function (error) {
                console.log(`不能得到粗饼比赛的报名信息，\n${error}`)
                return false
            })

        },

        PreRank(itemList){
            // let itemNumber = info.statistic.itemenrollnum

            let PreRankList = {
            }

            var processunit = Number(Math.floor)

            var prounit =Math.floor(100/itemList.length)
            var process = 0
            for(var event of itemList){
                if(event!= '趣味项目'){
                    itemPreRank(event,function () {
                        process += prounit
                        that.setProcess(that.vueViewModel,process)
                    })

                }
            }

            function itemPreRank(item,callback) {
                var rankurl = that.comPageUrl + '/'+ that.config.ResultItem.competitors + '?sort=' +that.config.EVENT[item]

                let options = {
                    method : 'GET',
                    uri : rankurl
                }

                request(options).then(function (body) {
                    var $ = cheerio.load(body);
                    var competitionName = $('.breadcrumbs-list').children('li').eq(3).children('a').text();
                    that.comInfo.name = competitionName
                    
                    if(PreRankList[item] == undefined){
                        PreRankList[item] = []
                    }
                    
                    try {
                        $('tbody tr td[class="hover"]').filter(function () {
                            var buffer = {
                                rank : '',
                                result : '',
                                name : '',
                                comID : ''
                            }

                            var  rawtext = $(this).text()
                            if($(this).children('span').length){
                                if(rawtext.indexOf('[')!= -1){
                                    buffer.rank = rawtext.split('[')[1].split(']')[0]
                                    buffer.result = rawtext.split('[')[1].split(']')[1]
                                    buffer.name = $(this).parent('tr').children('td').eq(2).text()
                                    buffer.comID = Number($(this).parent('tr').children('td').eq(1).text())
                                }else{
                                    buffer.rank = ''
                                    buffer.result = ''
                                    buffer.name = $(this).parent('tr').children('td').eq(2).text()
                                    buffer.comID = Number($(this).parent('tr').children('td').eq(1).text())
                                }

                                PreRankList[item].push(buffer)
                            }


                        })
                        
                    }

                    catch (e) {
                        console.log('can not get ranking list in [cubing] module :', e.stack);
                    }

                    //保存文件
                    var filename = '/prerank' + '.json';
                    savejson(path.join(__dirname, "./../../assets/Competitions/"),that.comInfo.name,filename,PreRankList)
                    callback()
                }).catch(function (error) {
                        console.log(`不能得到粗饼比赛的预排名信息，\n${error}`)
                        return false
                })
            }





        },
    }

}

cbspider.prototype = {
    createRankUrl : function(region,callback){
        var that = this
        let GENDER = {
            male : 'male',
            female : 'female',
            all : 'all'
        }
        let TYPE = {
            single : 'single',
            average : 'average'
        }
        var urlList = {}
        // gender: male female all   type: single  average
        function url(head,region,event,type,gender) {
            return head + '?region=' + region + '&event='+ event + '&type=' +type + '&gender=' + gender;
        }

        for(var re of region){
            for( var event in that.config.EventString2Chinese){
                for (var gender in GENDER){
                    for(var type  in TYPE){
                        if(urlList[re] == undefined){
                            urlList[re] = []
                        }
                        if(type == 'average' && (event == '333mbf' || event == '444bf' || event == '555bf')){
                            null
                        }else {
                            urlList[re].push(url(that.config.resultPage+that.config.ResultItem.rankings,re,event,type,gender))
                        }
                    }
                }
            }
        }
        var filename ='/TaskURL.json';
        savejson(path.join(__dirname, "./../../assets/"),'Rankings',filename,urlList)
        callback(urlList)
    },
    createPlayerUrlTask : function(comurl,callback){

        var playerUrlList = []
        let options = {
            method : 'GET',
            uri : comurl + '/competitors'
        }
        console.log(options.uri)
        request(options).then(function (body) {
            var $ = cheerio.load(body)
            // 得到list
            try {
                var competitionName =  $('.breadcrumbs-list').children('li').eq(3).children('a').text();
                $('tbody tr').filter(function () {
                    if($(this).attr('class')== 'odd' || $(this).attr('class')== 'even'){
                        var playerUrl = $(this).children('td').eq(2).children('a').attr('href');
                        if(playerUrl != undefined && playerUrl != ''){
                            playerUrlList.push(playerUrl)
                        }

                    }
                })



            }

            catch (e){
                console.log('can not get ranking list in [cubing] module :', e.stack);
            }

            //保存文件
            var filename = competitionName + '.json';
            savejson(path.join(__dirname, "./../../assets/Tasks/"),'PlayerList/',filename,playerUrlList)
            callback(playerUrlList)
            return true
        }).catch(function (error) {
            console.log(`不能得到粗饼比赛的报名信息，\n${error}`)
            return false
        })
    },
    getLiveModuleId : function(url,callback){
        let comid = ''
        var options = {
            method: 'GET',
            uri: url,
        }
        request(options).then(function (body) {
            var $ = cheerio.load(body);
            // 得到比赛标题
            try {
               comid =  $('div[id="live-container"]').attr("data-c")
            }catch (e){

                console.log('不能得到粗饼比赛的直播id :', e.stack);
            }

            callback(comid)
            return comid

        }).catch(function (error) {
            console.log(`不能得到粗饼比赛的直播id，\n${error}`)
            return false
        })
    },
    getBasicComInfo : function (callback) {
        var that = this
        var options =  {
            method: 'GET',
            uri: that.comPageUrl,
        }
        var BasicInfo = {
            name : '',
            url : '',
            date : '',
            location : '',
            delegate : '',
            event : '',
            playerLimit : '',
        }
        request(options).then(function (body) {
            var $ = cheerio.load(body);
            try {
                that.comInfo.name = $('h1.heading-title').text()
                that.comInfo.urlstr = $('li.cube-red').children('a').attr('href').split('/').pop()

                BasicInfo.name = $('h1.heading-title').text()
                BasicInfo.url = $('li.cube-red').children('a').attr('href').split('/').pop()
                BasicInfo.date = $('dl').children('dd').eq(2).text()
                BasicInfo.location = $('dl').children('dd').eq(3).text()
                BasicInfo.delegate = $('dl').children('dd').eq(5).children('a').text()
                BasicInfo.event = $('dl').children('dd').eq(6).text()
                BasicInfo.playerLimit = $('dl').children('dd').eq(8).text()

                callback(BasicInfo)
                return that.comInfo.name
            }catch (e){
                console.log('can not get competition name in [cubing] module :', e.stack);
                return 'title undefined'
            }
        }).catch(function (error) {
            console.log(`不能得到粗饼比赛的title，\n${error}`)
            return false
        })
    },
    getPlayerInfo(personalUrl,processlength){
        var that = this
        var process = that.vueViewModel.$data.process.CompetitiorsModule

        let PlayerInfo ={
            BaseInfo :{},
            PersonalResult : [],
            SumofRanks : {single: {},
                average : {}
            },
            OverallMedal :{},
            OverallRecord :{}
        }
        var url


        if(typeof (personalUrl) == typeof([1,2])){
            url = personalUrl.pop()
        }else if(typeof (personalUrl) == typeof('123')){
            url = personalUrl
            personalUrl = ''
        }

        let options = {
            method : 'GET',
            uri : url
        }

        request(options).then(function (body) {
            var $ = cheerio.load(body);
            PlayerInfo.BaseInfo.personalUrl = url;
            var rawname  = $('div[class= "panel-body"]').children('div').children('div').eq(0).children('span').eq(1).text().split(/[(,)]/)
            if(rawname.length>=3){
                PlayerInfo.BaseInfo.nationalName = rawname[1];
                PlayerInfo.BaseInfo.EnglishName = rawname[0];
            }else{
                PlayerInfo.BaseInfo.nationalName = rawname[0];
                PlayerInfo.BaseInfo.EnglishName = rawname[0];
            }
            PlayerInfo.BaseInfo.region = $('div[class= "panel-body"]').children('div').children('div').eq(1).children('span').eq(1).text().split(/[\n, ]/).join("");    //delete \n and space then link together
            PlayerInfo.BaseInfo.competitionsNumber = Number($('div[class= "panel-body"]').children('div').children('div').eq(2).children('span').eq(1).text());
            PlayerInfo.BaseInfo.wcaid = $('div[class= "panel-body"]').children('div').children('div').eq(3).children('span').eq(1).text() ; // such as 2013LINK01
            PlayerInfo.BaseInfo.gender = $('div[class= "panel-body"]').children('div').children('div').eq(4).children('span').eq(1).text() ; // such as 男 or male
            PlayerInfo.BaseInfo.carrerperiod = $('div[class= "panel-body"]').children('div').children('div').eq(5).children('span').eq(1).text() ; // such as 2013.05.01 - 2017.09.17

            var personalResultHtml = $('div[id="yw0"]').children('table')

            personalResultHtml.children('tbody').children('tr').filter(function () {
                let buffer = {}
                var eventName = $(this).children('td').eq(0).text().split(' ').join('');
                buffer[eventName] = {};
                buffer[eventName].single = {};
                buffer[eventName].average = {};

                buffer[eventName].single.result = $(this).children('td').eq(4).text();
                buffer[eventName].single.NRanking = $(this).children('td').eq(1).text();
                buffer[eventName].single.CRanking = $(this).children('td').eq(2).text();
                buffer[eventName].single.WRanking = $(this).children('td').eq(3).text();

                buffer[eventName].average.result = $(this).children('td').eq(5).text();
                buffer[eventName].average.NRanking = $(this).children('td').eq(8).text();
                buffer[eventName].average.CRanking = $(this).children('td').eq(7).text();
                buffer[eventName].average.WRanking = $(this).children('td').eq(6).text();


                buffer[eventName].GoldNum = $(this).children('td').eq(9).text();
                buffer[eventName].SilverNum = $(this).children('td').eq(10).text();
                buffer[eventName].BronzeNum = $(this).children('td').eq(11).text();

                buffer[eventName].SandA = $(this).children('td').eq(12).text();

                PlayerInfo.PersonalResult.push(buffer)

            })


            var personalSumofRanksHtml = $('div[id="yw1"]').children('table')

            PlayerInfo.SumofRanks.single.sumofNR = personalSumofRanksHtml.children('tbody').children('tr').eq(0).children('td').eq(1).text();
            PlayerInfo.SumofRanks.single.NR = personalSumofRanksHtml.children('tbody').children('tr').eq(0).children('td').eq(2).text();

            PlayerInfo.SumofRanks.single.sumofCR = personalSumofRanksHtml.children('tbody').children('tr').eq(0).children('td').eq(3).text();
            PlayerInfo.SumofRanks.single.CR = personalSumofRanksHtml.children('tbody').children('tr').eq(0).children('td').eq(4).text();

            PlayerInfo.SumofRanks.single.sumofWR = personalSumofRanksHtml.children('tbody').children('tr').eq(0).children('td').eq(5).text();
            PlayerInfo.SumofRanks.single.WR = personalSumofRanksHtml.children('tbody').children('tr').eq(0).children('td').eq(6).text();

            PlayerInfo.SumofRanks.average.sumofNR = personalSumofRanksHtml.children('tbody').children('tr').eq(1).children('td').eq(1).text();
            PlayerInfo.SumofRanks.average.NR = personalSumofRanksHtml.children('tbody').children('tr').eq(1).children('td').eq(2).text();

            PlayerInfo.SumofRanks.average.sumofCR = personalSumofRanksHtml.children('tbody').children('tr').eq(1).children('td').eq(3).text();
            PlayerInfo.SumofRanks.average.CR = personalSumofRanksHtml.children('tbody').children('tr').eq(1).children('td').eq(4).text();

            PlayerInfo.SumofRanks.average.sumofWR = personalSumofRanksHtml.children('tbody').children('tr').eq(1).children('td').eq(5).text();
            PlayerInfo.SumofRanks.average.WR = personalSumofRanksHtml.children('tbody').children('tr').eq(1).children('td').eq(6).text();


            $('h2').filter(function () {
                if ($(this).text() == '奖牌汇总'){
                    PlayerInfo.OverallMedal.GoldNum = 	$(this).next('div').children('table').children('tbody').children('tr').children('td').eq(0).text();
                    PlayerInfo.OverallMedal.SilverNum = 	$(this).next('div').children('table').children('tbody').children('tr').children('td').eq(1).text();
                    PlayerInfo.OverallMedal.BronzeNum = 	$(this).next('div').children('table').children('tbody').children('tr').children('td').eq(2).text();

                }else if($(this).text() == '纪录汇总'){
                    PlayerInfo.OverallRecord.WRNum = $(this).next('div').children('table').children('tbody').children('tr').children('td').eq(0).text();
                    PlayerInfo.OverallRecord.CRNum = $(this).next('div').children('table').children('tbody').children('tr').children('td').eq(1).text();
                    PlayerInfo.OverallRecord.NRNum = $(this).next('div').children('table').children('tbody').children('tr').children('td').eq(2).text();
                }
            })


            //保存文件
            var filename = PlayerInfo.BaseInfo.wcaid + '.json';
            savejson(path.join(__dirname, "./../../assets/"),'Players/',filename,PlayerInfo)



            process = Math.floor((processlength - personalUrl.length)*100/processlength)
            that.setProcess(that.vueViewModel,'CompetitiorsModule',process)

           if(personalUrl==undefined || personalUrl == ''){
                return true
           }else{
               that.getPlayerInfo(personalUrl,processlength)
               return true
           }

        }).catch(function (error) {
            console.log(`不能得到粗饼选手详细资料，\n${error}`)
            return false
        })

    },
    getSchedule : function (callback) {
        var that = this
        var url =  that.comPageUrl + '/schedule'
        let ScheduleJson
        ScheduleJson = {
            comInfo : {},
            scheduleEvent : {},
            EventDetail : {}
        }

        var options = {
            method: 'GET',
            uri: url,
        }

        request(options).then(function (body) {
            var $ = cheerio.load(body);
            // 得到比赛标题
            try {
                ScheduleJson.comInfo ={
                    title : $('li.breadcrumbs-label').next().next().next().children('a').text(),
                    url : $('li.breadcrumbs-label').next().next().next().children('a').attr('href')
                }

            }catch (e){
                ScheduleJson.comInfo = {
                    title : 'unknown',
                    url : undefined
                }
                console.log('can not get competition name in [cubing] module :', e.stack);
            }

            // 得到轮次信息
            try {
                event = $('.row.schedule-event').find('.event-icon');
                event.each(function () {
                    ScheduleJson.scheduleEvent[$(this).attr('title')] = {
                        eventname : $(this).attr('title'),
                        roundnum : parseInt($(this).parent().text().split(/[-轮]/)[1]),
                    }
                });
            }catch (e){
                console.log('can not get competition event name and round number in [cubing] module :', e.stack)
            }

            //得到详细的赛程安排
            try {
                $('.table-responsive').filter(function () {
                    if($(this).attr('id')!= undefined && $(this).attr('id').indexOf('yw')!=-1){
                        var comDate = moment($(this).parent().prev('.panel-heading').text().split('\n')[1]).format('L');
                        var comTableName = $(this).prev('h3').text();

                        if (comTableName == ''){

                            // 不存在是定义它
                            if(ScheduleJson.EventDetail[comDate] == undefined){
                                ScheduleJson.EventDetail[comDate] = []
                            };


                            $(this).children().children('tbody').children('tr').each(function () {
                                var buffer = {};
                                buffer.startTime = $(this).children('td').eq(0).text();
                                buffer.endTime = $(this).children('td').eq(1).text();
                                buffer.eventName = $(this).children('td').eq(2).text();
                                buffer.eventRound = $(this).children('td').eq(3).text();

                                ScheduleJson.EventDetail[comDate].push(buffer);

                            })
                        }else{
                            // 不存在是定义它
                            if(ScheduleJson.EventDetail[comDate] == undefined){
                                ScheduleJson.EventDetail[comDate] = {}
                            };

                            if(ScheduleJson.EventDetail[comDate][comTableName] == undefined){
                                ScheduleJson.EventDetail[comDate][comTableName] = []
                            };


                            $(this).children().children('tbody').children('tr').each(function () {
                                var buffer = {};
                                buffer.startTime = $(this).children('td').eq(0).text();
                                buffer.endTime = $(this).children('td').eq(1).text();
                                buffer.eventName = $(this).children('td').eq(2).text();
                                buffer.eventRound = $(this).children('td').eq(3).text();

                                ScheduleJson.EventDetail[comDate][comTableName].push(buffer);
                            })
                        }



                    }
                })

            }catch(e) {
                console.log('can not get the detail of competition in [cubing] module :', e.stack)
            }

            savejson(path.join(__dirname, "./../../assets/Competitions/"),that.comInfo.name,'/schedule.json',ScheduleJson)
            callback(ScheduleJson)

        }).catch(function (error) {
            console.log(`不能得到粗饼比赛的schedule，\n${error}`)
            return false
        })
    },
    getRecord : function (regionlist) {

        var that = this

        function regionRecord(region) {

            function url(head,region,event,type) {
                return head + '?region=' + region + '&event='+ event + '&type=' +type;
            }
            var wholeurl = url(that.config.resultPage + that.config.ResultItem.records,region,'','current')

            var options = {
                method: 'GET',
                uri: wholeurl,
            }

            let RecordJson
            RecordJson = {
                nowadays :{},
                history:  {},
            }

            request(options).then(function (body) {
                var $ = cheerio.load(body);
                var itemname
                function getdata(tr) {
                    if (tr.children('td').attr('colspan') == 8){
                        itemname = tr.text().split(/[\n, ]/).join("");
                    }
                    var nextnode = tr.next('tr');

                    if(RecordJson.nowadays[itemname] == undefined){
                        RecordJson.nowadays[itemname] = {};
                    };
                    if(RecordJson.nowadays[itemname].single == undefined){
                        RecordJson.nowadays[itemname].single = [];
                    };
                    if(RecordJson.nowadays[itemname].average == undefined){
                        RecordJson.nowadays[itemname].average = [];
                    };

                    if (nextnode.attr('class')== 'odd' || nextnode.attr('class')== 'even'){
                        if (nextnode.children('td').eq(1).text() != '')
                        {   //single

                            let buffer ={};

                            buffer.Result = nextnode.children('td').eq(1).text();

                            buffer.recordtitle = nextnode.children('td').eq(0).text();  // eg   NR

                            buffer.playerName = nextnode.children('td').eq(3).children('a').text();
                            buffer.playerPage = nextnode.children('td').eq(3).children('a').attr('href');

                            buffer.region = nextnode.children('td').eq(4).text();

                            buffer.competitionName = nextnode.children('td').eq(5).children('a').text();
                            buffer.competitionPage = nextnode.children('td').eq(5).children('a').attr('href');

                            buffer.date = nextnode.children('td').eq(6).text();
                            buffer.detail = nextnode.children('td').eq(7).text();
                            RecordJson.nowadays[itemname].single.push(buffer);
                            // nodecg.log.warn(JSON.stringify(RecordJson));
                        }
                        else if(nextnode.children('td').eq(2).text() != '')
                        { // average
                            let buffer ={};
                            buffer.Result = nextnode.children('td').eq(2).text();
                            buffer.recordtitle = nextnode.children('td').eq(0).text();  // eg   NR

                            buffer.playerName = nextnode.children('td').eq(3).children('a').text();
                            buffer.playerPage = nextnode.children('td').eq(3).children('a').attr('href');

                            buffer.region = nextnode.children('td').eq(4).text();

                            buffer.competitionName = nextnode.children('td').eq(5).children('a').text();
                            buffer.competitionPage = nextnode.children('td').eq(5).children('a').attr('href');

                            buffer.date = nextnode.children('td').eq(6).text();
                            var array = [];
                            var detail = nextnode.children('td').eq(7).text().split(' ');
                            for (var i in detail ){
                                if (detail[i]!= ""){
                                    array.push(detail[i]);
                                }
                            }
                            buffer.detail = array;
                            RecordJson.nowadays[itemname].average.push(buffer);
                        }
                        else{
                            console.log('find undefined tr tag')
                        }
                    }else{
                        return   'finish'
                    }
                    getdata(nextnode);
                }

                // 得到项目成绩
                try {
                    $('td[colspan = 8]').filter(function () {
                        // nodecg.log.debug($(this).text());
                        getdata($(this).parent("tr"));
                    })
                }

                catch (e){
                    console.log('can not get competition name in [cubing] module :', e.stack);
                }

                // console.log(RecordJson)

            }).catch(function (error) {
                console.log(`不能得到各地区的记录，\n${error}`)
                return false
            })

            for( var event in that.config.EventString2Chinese){

                var options = {
                    method: 'GET',
                    uri: url(that.config.resultPage + that.config.ResultItem.records,region,event,'history'),
                }
                request(options).then(function (body) {
                    var $ = cheerio.load(body);
                    var itemname
                    function getdata(tr) {

                        if (tr.children('td').attr('colspan') == 8){
                            itemname = tr.text().split(/[\n, ]/).join("");
                        }

                        var nextnode = tr.next('tr');


                        if(RecordJson.history[itemname] == undefined){
                            RecordJson.history[itemname] = {};
                        };
                        if(RecordJson.history[itemname].single == undefined){
                            RecordJson.history[itemname].single = [];
                        };
                        if(RecordJson.history[itemname].average == undefined){
                            RecordJson.history[itemname].average = [];
                        };

                        if (nextnode.attr('class')== 'odd' || nextnode.attr('class')== 'even'){
                            if (nextnode.children('td').eq(1).text() != ''){   //single

                                let buffer ={};

                                buffer.Result = nextnode.children('td').eq(1).text();

                                buffer.recordtitle = nextnode.children('td').eq(0).text();  // eg   NR

                                buffer.playerName = nextnode.children('td').eq(3).children('a').text();
                                buffer.playerPage = nextnode.children('td').eq(3).children('a').attr('href');

                                buffer.region = nextnode.children('td').eq(4).text();

                                buffer.competitionName = nextnode.children('td').eq(5).children('a').text();
                                buffer.competitionPage = nextnode.children('td').eq(5).children('a').attr('href');

                                buffer.date = nextnode.children('td').eq(6).text();
                                buffer.detail = nextnode.children('td').eq(7).text();

                                RecordJson.history[itemname].single.push(buffer);
                                // nodecg.log.warn(JSON.stringify(RecordJson));
                            }else if(nextnode.children('td').eq(2).text() != ''){ // average

                                let buffer ={};

                                buffer.Result = nextnode.children('td').eq(2).text();

                                buffer.recordtitle = nextnode.children('td').eq(0).text();  // eg   NR

                                buffer.playerName = nextnode.children('td').eq(3).children('a').text();
                                buffer.playerPage = nextnode.children('td').eq(3).children('a').attr('href');

                                buffer.region = nextnode.children('td').eq(4).text();

                                buffer.competitionName = nextnode.children('td').eq(5).children('a').text();
                                buffer.competitionPage = nextnode.children('td').eq(5).children('a').attr('href');

                                buffer.date = nextnode.children('td').eq(6).text();
                                var array = [],
                                    detail = nextnode.children('td').eq(7).text().split(' ');
                                for (var i in detail ){
                                    if (detail[i]!= ""){
                                        array.push(detail[i]);
                                    }

                                }

                                buffer.detail = array;
                                RecordJson.history[itemname].average.push(buffer);
                                // nodecg.log.warn(JSON.stringify(RecordJson));
                            }else{
                                console.log('find undefined tr tag')
                            }

                        }else{
                            return   'finish'
                        }
                        getdata(nextnode);
                    }
                    // 得到项目成绩
                    try {
                        $('td[colspan = 8]').filter(function () {
                            // nodecg.log.debug($(this).text());
                            getdata($(this).parent("tr"));
                        })
                    }

                    catch (e){

                        console.log('can not get competition name in [cubing] module :', e.stack);
                    }

                    var filename = '/'+ region + '.json'
                    savejson(path.join(__dirname, "./../../assets/"),'Records',filename,RecordJson)

                    // console.log(RecordJson)

                }).catch(function (error) {
                    console.log(`不能得到各地区的历史记录，\n${error}`)
                    return false
                })
            }




        }

        for (var region of regionlist){
            regionRecord(region)
        }
    },
    getRank : function (list) {
        var that = this
        if(list == 'file'){
            var urlListFilePath = path.join(__dirname, './../../assets/Rankings/TaskURL.json' )
            list  = JSON.parse(fs.readFileSync(urlListFilePath, 'utf8'))
        }

        var process = that.vueViewModel.$data.process.RankModule
        var RankingListJson = {}
        for(var RegionName in list){
            RankingListJson[RegionName] = reSetContainer()
            rankQueue(RankingListJson[RegionName],list[RegionName])
        }





        function reSetContainer() {
            let RankingListJson = {}
            for(var event in that.config.EventString2Chinese){
                var itemName = that.config.EventString2Chinese[event];
                RankingListJson[itemName] = {}
                RankingListJson[itemName].single = {}
                RankingListJson[itemName].single.male = []
                RankingListJson[itemName].single.female = []
                RankingListJson[itemName].single.all = []
                RankingListJson[itemName].average = {}
                RankingListJson[itemName].average.male = []
                RankingListJson[itemName].average.female = []
                RankingListJson[itemName].average.all = []
            }
            return RankingListJson
        }

        function rankQueue(dataContainer,list){
            var options = {
                method: 'GET',
                uri: list.pop()  //这里很重要
            }
            var type = options.uri.split('type=')[1].split('&')[0]
            var event = options.uri.split('event=')[1].split('&')[0]
            var gender = options.uri.split('gender=')[1].split('&')[0]
            var region = options.uri.split('region=')[1].split('&')[0]
            var itemName = that.config.EventString2Chinese[event]

            process[region] = 100 - list.length
            that.setProcess(that.vueViewModel,'RankModule',process)
            // console.log('[开始爬取' + region + '的排名信息]' ,options.uri,'剩余:',list.length)
            request(options).then(function (body) {
                var $ = cheerio.load(body);


                function findrankingNum(tr) {
                    if(tr.children('td').eq(1).text() == '' || tr.children('td').eq(1).text() == undefined){
                        return findrankingNum(tr.prev('tr'))
                    }else{
                        return tr.children('td').eq(1).text();
                    }
                }

                // 得到list
                try {
                    if($('tbody tr td span[class="empty"]').text()=='没有找到数据.'){
                        console.log('没有数据')
                    }else if (type == 'single'){
                        $('tbody tr').filter(function () {
                            let buffer = {};
                            buffer.rankingNum = findrankingNum($(this));
                            buffer.playerName = $(this).children('td').eq(2).children('a').text();
                            buffer.playerUrl = $(this).children('td').eq(2).children('a').attr('href');
                            buffer.region = $(this).children('td').eq(3).text();
                            buffer.result = $(this).children('td').eq(4).text();
                            buffer.competitionName = $(this).children('td').eq(5).children('a').text();
                            buffer.competitionUrl = $(this).children('td').eq(5).children('a').attr('href');
                            buffer.date = $(this).children('td').eq(6).text();

                            dataContainer[itemName].single[gender].push(buffer)

                        })

                    }
                    else if(type == 'average'){
                        $('tbody tr').filter(function () {
                            let buffer = {};

                            buffer.rankingNum = $(this).children('td').eq(1).text();
                            buffer.playerName = $(this).children('td').eq(2).children('a').text();
                            buffer.playerUrl = $(this).children('td').eq(2).children('a').attr('href');
                            buffer.region = $(this).children('td').eq(3).text();
                            buffer.result = $(this).children('td').eq(4).text();
                            buffer.competitionName = $(this).children('td').eq(5).children('a').text();
                            buffer.competitionUrl = $(this).children('td').eq(5).children('a').attr('href');
                            buffer.date = $(this).children('td').eq(6).text();

                            var array = [],
                                detail = $(this).children('td').eq(7).text().split(' ');
                            for (var i in detail ){
                                if (detail[i]!= ""){
                                    array.push(detail[i]);
                                }

                            }

                            buffer.detail = array;
                            dataContainer[itemName].average[gender].push(buffer)

                        })
                    }else{
                        console.log('wrong paras');
                    }
                }
                catch (e){
                    console.log('不能得到各地区的成绩排名00 :', e.stack);
                }

                if(list.length == 0 ){
                    //保存文件
                    console.log(dataContainer)
                    var filename ='/'+ region + '.json';
                    savejson(path.join(__dirname, "./../../assets/"),'Rankings',filename,dataContainer)
                    return true
                }else{
                    rankQueue(dataContainer,list)   //递归
                    return false   // 注释1 这里很重要 不写返回会导致 一个promise 无法正常结束
                }

            }).catch(function (error) {
                console.log(`不能得到各地区的成绩排名11，\n${error}`)
                return false
            })
        }

    },
    getComList : function(callback){
        var that = this
        let comList = {
            enrollOpen: [],
            enrollClose: [],
            enrollReady: [],
            finish: [],
        }


            var options = {
            method : 'GET',
            uri : 'https://cubingchina.com/competition'
        }
        request(options).then(function (body) {
                var $ = cheerio.load(body);

                try {
                    var comEnrollOpen = $('tbody tr[class="danger"]')
                    var comEnrollReady = $('tbody tr[class="warning"]')
                    var comEnrollClose = $('tbody tr[class="info"]')
                    var comFinish = $('tbody tr[class="active"]')

                    // 已经结束报名的
                    comEnrollClose.filter(function () {
                        let buffer = {}
                        buffer.date = $(this).children('td').eq(0).text()
                        buffer.comname = $(this).children('td').eq(1).children('a').text()
                        buffer.comurl = $(this).children('td').eq(1).children('a').attr('href')
                        buffer.region = $(this).children('td').eq(2).text() + $(this).children('td').eq(3).text()
                        buffer.address = $(this).children('td').eq(4).text()

                        comList.enrollClose.push(buffer)
                    })

                    //报名中的
                    comEnrollOpen.filter(function () {
                        let buffer = {}
                        buffer.date = $(this).children('td').eq(0).text()
                        buffer.comname = $(this).children('td').eq(1).children('a').text()
                        buffer.comurl = $(this).children('td').eq(1).children('a').attr('href')
                        buffer.region = $(this).children('td').eq(2).text() + $(this).children('td').eq(3).text()
                        buffer.address = $(this).children('td').eq(4).text()

                        comList.enrollOpen.push(buffer)
                    })


                    //即将开放报名的
                    comEnrollReady.filter(function () {
                        let buffer = {}
                        buffer.date = $(this).children('td').eq(0).text()
                        buffer.comname = $(this).children('td').eq(1).children('a').text()
                        buffer.comurl = $(this).children('td').eq(1).children('a').attr('href')
                        buffer.region = $(this).children('td').eq(2).text() + $(this).children('td').eq(3).text()
                        buffer.address = $(this).children('td').eq(4).text()

                        comList.enrollReady.push(buffer)
                    })


                    //已经结束了的比赛
                    comFinish.filter(function () {
                        let buffer = {}
                        buffer.date = $(this).children('td').eq(0).text()
                        buffer.comname = $(this).children('td').eq(1).children('a').text()
                        buffer.comurl = $(this).children('td').eq(1).children('a').attr('href')
                        buffer.region = $(this).children('td').eq(2).text() + $(this).children('td').eq(3).text()
                        buffer.address = $(this).children('td').eq(4).text()

                        comList.finish.push(buffer)
                    })

                    // console.warn(comList)
                    callback(comList)
                    return comList
                }
                catch (e) {
                    console.log(`最近的比赛列表错误，\n${e.stack}`)
                    return comList
                }
            }

        ).catch(function (error) {
            console.log(`不能得到最近的比赛列表，\n${error}`)
            return false
        })
    },
    getPlayerListByEvent: function(comurl){

        let options = {
            method : 'GET',
            uri : comurl + '/competitors'
        }
        // console.warn(comurl + '/competitors')
        let PlayerList = {
            competitionName : '',
            competitionUrl : comurl,
            options : [],
            eventList : [],
        }

        let eventInfoListByName = []
        let WholeEventBuffer = {}

        request(options).then(function (body) {
            try {

            var $ = cheerio.load(body)

                PlayerList.competitionName =  $('.breadcrumbs-list').children('li').eq(3).children('a').text();

            var eventitem = $('thead tr th a i')
            eventitem.filter(function () {
                var title = $(this).attr('title')
                PlayerList.eventList.push(title)
                WholeEventBuffer[title] = {
                    value : title,
                    label : title,
                    children : [],
                }
            })

            $('tbody tr').filter(function () {
                    if($(this).attr('class')== 'odd' || $(this).attr('class')== 'even'){
                        var buffer = {
                            itemlist : []
                        }
                        buffer.playerName = $(this).children('td').eq(2).children('a').text();
                        // buffer.playerName = $(this).children('td').eq(2).text();
                        buffer.playerwcaid = $(this).children('td').eq(2).children('a').attr('href');
                        if(buffer.playerwcaid != undefined && buffer.playerwcaid != ''){
                            buffer.playerwcaid = buffer.playerwcaid.split('/').pop()
                            var itemnum = $('thead tr').eq(0).children("th").length
                            for(var i = 5 ; i<itemnum; i++){
                                if($(this).children('td').eq(i).children('span').length !=0){
                                    buffer.itemlist.push($('thead tr').eq(0).children("th").eq(i).children("a").children("i").attr('title'))
                                }
                            }
                            eventInfoListByName.push(buffer)
                        }else{
                            null
                        }


                    }
                })



            for(var player of eventInfoListByName){

                for(var ele of player.itemlist){
                    var buffer = {}
                    buffer.value = player.playerwcaid
                    buffer.label = player.playerName
                    WholeEventBuffer[ele].children.push(buffer)
                }
            }

            for (var ele in WholeEventBuffer){
                PlayerList.options.push(WholeEventBuffer[ele])
            }

            }

            catch (e){
                console.log('can not get ranking list in [cubing] module :', e.stack);
            }


            //保存文件
            var filename = PlayerList.competitionName + '.json';
            savejson(path.join(__dirname, "./../../assets/Players/"),'config/',filename,PlayerList)


            //打开文件
            var filepath = path.join(__dirname, './../../assets/Players/config/'+ 'CompetitionList' +'.json' )
            var CompetitionList = (fs.readFileSync(filepath, 'utf8'))
            if(CompetitionList != ''){
                CompetitionList = JSON.parse(CompetitionList)
            }else{
                CompetitionList = {}
            }

            CompetitionList[PlayerList.competitionName] =  {
                name : PlayerList.competitionName,
                url : PlayerList.competitionUrl,
                evet : PlayerList.eventList
            }
            savejson(path.join(__dirname, "./../../assets/Players/"),'config/','CompetitionList.json',CompetitionList)


            return true
        }).catch(function (error) {
            console.log(`不能得到粗饼比赛的报名信息，\n${error}`)
            return false
        })

    },
    setProcess : function (vm,name,process) {
        vm.$set(vm.$data.process,name,process)
    },


}

export default cbspider



// var filename ='/'+ region + '.json';
// savejson(path.join(__dirname, "./../../assets/"),'Rankings',filename,RankingListJson)
// request(options).then(function (body) {
//
// }).catch(function (error) {
//         console.log(`不能得到粗饼比赛的title，\n${error}`)
        // return false
// })