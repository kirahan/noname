/**
 * Created by kira on 2017/9/7.
 */


var  Cubing = {
    homepage : "https://cubingchina.com/",
    competitionsList : 'https://cubingchina.com/competition',
    resultPage : 'https://cubingchina.com/results/',
    ResultItem : {
        person : 'person',
        competition : 'competition',
        rankings : 'rankings',
        records : 'records',
        statistics : 'statistics'
    }
}


var REGION ={
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
        HongKong : 'Hong Kong',
        Taiwan : 'Taiwan',
        USA : 'USA',
        Japan : 'Japan'
    }
}

const EVENT = {
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
}

const EventString2Chinese ={
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
}


// const Compage = 'https://cubingchina.com/competition/Chinas-10th-Anniversary-Championship-2017/';
const Compage = 'https://cubingchina.com/competition/HUST-Special-Cubes-Open-2017/';
const fs=require('fs');
const moment = require('moment')
const Q = require('q');
const request = require('request');
const cheerio = require('cheerio');
const numeral = require('numeral');
var comName
var competition = function () {
    request(Compage,(error,response,body) =>{

        if( !error && response.statusCode ===200){
            var $ = cheerio.load(body);

            // 得到比赛标题
            try {
                comName = $('h1.heading-title').text()
                return comName

            }catch (e){
                return 'title undefined'
                console.log('can not get competition name in [cubing] module :', e.stack);
            }


        }else{
            let msg = '不能得到粗饼的title，未知错误'
            if(error){
                msg = `不能得到粗饼的title，\n${error.message}`;
            }else if (response){
                msg = `不能得到粗饼的title， ${response.statusCode}`;
            }
            console.log(msg)
        }
    })
}

const Pathdefault = './assets/Competition/'



module.exports = function (nodecg) {


    //function  保存文件
    /**
     * save the json file of cubing data
     * @param {string} [path1 ] - the first part of path, the default value is ./assets/Competition
     * @param {string} [path2] - The second part of path, the value is most likely be the whole name of competition
     * @param {string} [path3] - The last part of path,the filename such as  /schedule.json
     * @param {object} [data] - The data you want save
     * @returns {undefined}
     ***/
    function savejson(path1,path2,part3,data) {
        WholePath = path1 + path2
        // nodecg.log.info (WholePath)
        if (!fs.existsSync(WholePath)) {
            fs.mkdirSync(WholePath);
            WholePath = WholePath + part3
        }else {
            WholePath = WholePath +part3
        }
        fs.writeFileSync(WholePath,JSON.stringify(data));
    }


    // 当点击更新赛程的时候自动更新赛程
    nodecg.listenFor('init-cubing-schedule',initCubingSchedule);

    /**
     * Handles manual "update SCHEDULE" requests
     * @param {Boolean} [silent = false] - Whether to print info to logs or not.
     * @param {Function} [cb] - The callback to invoke after the SCHEDULE has been updated.
     * @returns {undefined}
     ***/

    function initCubingSchedule(silent,cb) {
        if (!silent) {
            nodecg.log.info('cubing competition schedule initialize button pressed, invoking update...');
        }

        init()
            .then(inited => {
                if (inited){
                    nodecg.log.info('schedule successfully initialized');
                }else {
                    nodecg.log.info('schedule fail initialized');
                }

                cb(null,inited);
            },error =>{
                cb(error);
            });
    }

    /**
     * initialize the "schedule" spider from cubing website, in the sechdule page.
     * @returns {Promise} - A promise.
     */
    function init() {
        const deferred = Q.defer();
        var SCHEDULE_URL =Compage + 'schedule';


        let ScheduleJson
        ScheduleJson = {
            comInfo : {},
            scheduleEvent : {},
            EventDetail : {}
        }
        request(SCHEDULE_URL,(error,response,body) =>{

            if( !error && response.statusCode ===200){
                var $ = cheerio.load(body);

                // 得到比赛标题
                try {
                    ScheduleJson.comInfo ={
                        title : $('li.breadcrumbs-label').next().next().next().children('a').text(),
                        url : $('li.breadcrumbs-label').next().next().next().children('a').attr('href')
                    }

                }catch (e){
                    comInfo = {
                        title : 'unknown',
                        url : undefined
                    }
                    nodecg.log.warn('can not get competition name in [cubing] module :', e.stack);
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
                    nodecg.log.warn('can not get competition event name and round number in [cubing] module :', e.stack)
                }

                //得到详细的赛程安排
                try {
                    $('.table-responsive').filter(function () {
                        if($(this).attr('id')!= undefined && $(this).attr('id').indexOf('yw')!=-1){
                            comDate = moment($(this).parent().prev('.panel-heading').text().split('\n')[1]).format('L');
                            comTableName = $(this).prev('h3').text();

                            if (comTableName == undefined){

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
                    nodecg.log.warn('can not get the detail of competition in [cubing] module :', e.stack)
                }
                // nodecg.log.info(JSON.stringify(ScheduleJson))

                //保存文件
                savejson(Pathdefault,ScheduleJson.comInfo.title,'/schedule.json',ScheduleJson)

            }else{
                let msg = '不能得到粗饼的schedule，未知错误'
                if(error){
                    msg = `不能得到粗饼的schedule，\n${error.message}`;
                }else if (response){
                    msg = `不能得到粗饼的schedule， ${response.statusCode}`;
                }
                nodecg.log.error(msg);
                deferred.reject(msg);
            }
        })

        return deferred.promise;
    }


    nodecg.listenFor('refresh-cubing-record',refreshCubingRecord);
    function refreshCubingRecord(silent,cb){
        if (!silent) {
            nodecg.log.info('cubing CubingRecord button pressed, invoking update...');
        }
        recordRefresh().then(freshed =>{
            if (freshed){
                nodecg.log.info('CubingRecord successfully refreshed');
            }else {
                nodecg.log.info('CubingRecord failed refreshed');
            }
            cb(null,freshed);
        },error =>{
            cb(error);
        });
    }
    function recordRefresh() {
        const deferred = Q.defer();
        let NowadayRecordPage = Cubing.resultPage  + Cubing.ResultItem.records;

        function url(head,region,event,type) {
            return head + '?region=' + region + '&event='+ event + '&type=' +type;
        }

        function regionRecord(region){
            let RecordJson
            RecordJson = {
                nowadays :{},
                history :{}
            }
            request(url(NowadayRecordPage,region,'','current'),
                (error,response,body)=>{
                    if( !error && response.statusCode ===200){
                        var $ = cheerio.load(body);

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

                                    RecordJson.nowadays[itemname].single.push(buffer);
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
                                    for (i in detail ){
                                        if (detail[i]!= ""){
                                            array.push(detail[i]);
                                        }

                                    }

                                    buffer.detail = array;
                                    RecordJson.nowadays[itemname].average.push(buffer);
                                    // nodecg.log.warn(JSON.stringify(RecordJson));
                                }else{
                                    nodecg.log.warn('find undefined tr tag')
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

                            nodecg.log.warn('can not get competition name in [cubing] module :', e.stack);
                        }

                        //保存文件
                        filename = region + '.json';
                        savejson('./assets','/records/',filename,RecordJson)

                    }else{
                        let msg = '不能得到粗饼的record page，未知错误'
                        if(error){
                            msg = `不能得到粗饼的record page，\n${error.message}`;
                        }else if (response){
                            msg = `不能得到粗饼的record page， ${response.statusCode}`;
                        }
                        nodecg.log.error(msg);
                        deferred.reject(msg);
                    }
                })

            for( event in EventString2Chinese){
                nodecg.log.debug(url(NowadayRecordPage,region,event,'history'));
                request(url(NowadayRecordPage,region,event,'history'),
                    (error,response,body)=>{
                        if( !error && response.statusCode ===200){
                            var $ = cheerio.load(body);

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
                                        for (i in detail ){
                                            if (detail[i]!= ""){
                                                array.push(detail[i]);
                                            }

                                        }

                                        buffer.detail = array;
                                        RecordJson.history[itemname].average.push(buffer);
                                        // nodecg.log.warn(JSON.stringify(RecordJson));
                                    }else{
                                        nodecg.log.warn('find undefined tr tag')
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

                                nodecg.log.warn('can not get competition name in [cubing] module :', e.stack);
                            }

                            //保存文件
                            filename = region + '.json';
                            savejson('./assets','/records/',filename,RecordJson)

                        }else{
                            let msg = '不能得到粗饼的record page，未知错误'
                            if(error){
                                msg = `不能得到粗饼的record page，\n${error.message}`;
                            }else if (response){
                                msg = `不能得到粗饼的record page， ${response.statusCode}`;
                            }
                            nodecg.log.error(msg);
                            deferred.reject(msg);
                        }
                    })
            }


        }


        // 中国记录
        regionRecord(REGION.region.China);


        //香港记录
        regionRecord(REGION.region.HongKong);

        //台湾记录
        regionRecord(REGION.region.Taiwan);

        //日本记录
        regionRecord(REGION.region.Japan);

        //美国记录
        regionRecord(REGION.region.USA);

        //亚洲记录
        regionRecord(REGION.continents.Asia);

        //世界记录
        regionRecord(REGION.world);
        //
        return deferred.promise;
    }


    //////////////////////////////////////////////////////////////////////////////////////////
    nodecg.listenFor('refresh-cubing-ranking',refreshCubingRankingList);
    function refreshCubingRankingList(silent,cb) {

        if (!silent) {
            nodecg.log.info('cubing ranking list initialize button pressed, invoking update...');
        }
        rankingListRefresh().then(freshed =>{
            if (freshed){
                nodecg.log.info('rankingList successfully refreshed');
            }else {
                nodecg.log.info('rankingList failed refreshed');
            }
            cb(null,freshed);
        },error =>{
            cb(error);
        });
    }

    function rankingListRefresh(){
        const deferred = Q.defer();
        let NowadayRankingPage = Cubing.resultPage + Cubing.ResultItem.rankings;
        let GENDER = {
            male : 'male',
            female : 'female',
            all : 'all'
        }
        let TYPE = {
            single : 'single',
            average : 'average'
        }

        // gender: male female all   type: single  average
        function url(head,region,event,type,gender) {
            return head + '?region=' + region + '&event='+ event + '&type=' +type + '&gender=' + gender;
        }

        function regionRanking(region){
            let RankingListJson = {}

            for( event in EventString2Chinese){
                for (gender in GENDER){
                    for(type  in TYPE){
                        var itemName = EventString2Chinese[event];
                        // nodecg.log.warn(itemName)
                        if (RankingListJson[itemName] == undefined){
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

                        nodecg.log.debug(url(NowadayRankingPage,region,event,type,gender));

                        function reque(itemName,region,event,type,gender){
                            request(url(NowadayRankingPage,region,event,type,gender),
                                (error,response,body)=>{
                                    if( !error && response.statusCode ===200){



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
                                            if (type == 'single'){
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

                                                    RankingListJson[itemName].single[gender].push(buffer)

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
                                                    for (i in detail ){
                                                        if (detail[i]!= ""){
                                                            array.push(detail[i]);
                                                        }

                                                    }

                                                    buffer.detail = array;

                                                    RankingListJson[itemName].average[gender].push(buffer)

                                                })
                                            }else{
                                                nodecg.log.warn('wrong paras');
                                            }

                                        }

                                        catch (e){

                                            nodecg.log.warn('can not get ranking list in [cubing] module :', e.stack);
                                        }

                                        if(RankingListJson.多盲.single.all.length != 0){
                                            //保存文件
                                            filename = region + '.json';
                                            savejson('./assets','/rankings/',filename,RankingListJson)
                                        }



                                    }else{
                                        let msg = '不能得到粗饼的record page，未知错误'
                                        if(error){
                                            msg = `不能得到粗饼的record page，\n${error.message}`;
                                        }else if (response){
                                            msg = `不能得到粗饼的record page， ${response.statusCode}`;
                                        }
                                        nodecg.log.error(msg);
                                        deferred.reject(msg);
                                    }
                                })
                        }

                        if( type == 'average' && (event == '444bf'  || event == '555bf'  || event == '333mbf'  )){
                            nodecg.log.debug('没有平均成绩的项目')
                        }else{
                            reque(itemName,region,event,type,gender);
                        }



                    }
                }

            }


        }


        // 中国记录
        regionRanking(REGION.region.China);


        // //香港记录
        // regionRanking(REGION.region.HongKong);
        //
        // //台湾记录
        // regionRanking(REGION.region.Taiwan);
        //
        // //日本记录
        // regionRanking(REGION.region.Japan);
        //
        // //美国记录
        // regionRanking(REGION.region.USA);
        //
        //亚洲记录
        // regionRanking(REGION.continents.Asia);

        //世界记录
        // regionRanking(REGION.world);



        return deferred.promise;
    }

    class CubingCompetitors{
        constructor(){
            const EnrollInfoPath = './assets/Competition/' +'/Enroll';
            const CurrentRecordPath = './assets/Competition/'  +'/CurrentRecord';
            const PersonResultPath ='./assets/Competition/' +'/PersonResult';
            this.UdateDate = '2017/9/11';
        }
        EnrollInfo(url){
            const deferred = Q.defer();
            let Enrollinfo = {
                statistic : {
                    itemlist : [],
                    itemenrollnum:{}
                },
                list: []
            }
            request(url, (error,response,body)=>{
                if( !error && response.statusCode ===200){
                    var $ = cheerio.load(body);
                    var competitionName =  $('.breadcrumbs-list').children('li').eq(3).children('a').text();
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
                                buffer.playerName = $(this).children('td').eq(2).children('a').text();
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
                        nodecg.log.warn('can not get ranking list in [cubing] module :', e.stack);
                    }

                    //保存文件
                    var filename = '/enrollinfo' + '.json';
                    savejson(Pathdefault,competitionName,filename,Enrollinfo)

                }else{
                    let msg = '不能得到粗饼的record page，未知错误'
                    if(error){
                        msg = `不能得到粗饼的record page，\n${error.message}`;
                    }else if (response){
                        msg = `不能得到粗饼的record page， ${response.statusCode}`;
                    }
                    nodecg.log.error(msg);
                }
            })
            return deferred.promise;
        }
        PlayerInfo(personalUrl){
            const deferred = Q.defer();
            let PlayerInfo ={
                BaseInfo :{},
                PersonalResult : [],
                SumofRanks : {single: {},
                    average : {}
                },
                OverallMedal :{},
                OverallRecord :{}
            }

            nodecg.log.debug(personalUrl)
            request(personalUrl,(error,response,body)=>{

                if( !error && response.statusCode ===200){
                    var $ = cheerio.load(body);
                    PlayerInfo.BaseInfo.personalUrl = personalUrl;
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
                    nodecg.log.debug(JSON.stringify(PlayerInfo));
                    //保存文件
                    var filename = PlayerInfo.BaseInfo.EnglishName + '.json';
                    savejson('./assets','/Players/',filename,PlayerInfo)

                }
                else {
                    let msg = '不能得到粗饼的record page，未知错误'
                    if (error) {
                        msg = `不能得到粗饼的record page，\n${error.message}`;
                    } else if (response) {
                        msg = `不能得到粗饼的record page， ${response.statusCode}`;
                    }
                    nodecg.log.error(msg);
                }

            })

            return deferred.promise;
        }
        PreRanking(url){}

    }
    let oneCompetition = new CubingCompetitors()

    nodecg.listenFor('get-cubing-enroll',function () {
        oneCompetition.EnrollInfo(Compage + 'competitors')
        // oneCompetition.PlayerInfo('https://cubingchina.com/results/person/2013LINK01')
    });



    /**
     * Handles manual "update SCHEDULE" requests
     * @param {Boolean} [silent = false] - Whether to print info to logs or not.
     * @param {Function} [cb] - The callback to invoke after the SCHEDULE has been updated.
     * @returns {undefined}
     ***/

    function initCubingCompetitorsList(silent,cb) {
        if (!silent) {
            nodecg.log.info('cubing competition schedule initialize button pressed, invoking update...');
        }

        init()
            .then(inited => {
                if (inited){
                    nodecg.log.info('schedule successfully initialized');
                }else {
                    nodecg.log.info('schedule fail initialized');
                }

                cb(null,inited);
            },error =>{
                cb(error);
            });
    }


}

