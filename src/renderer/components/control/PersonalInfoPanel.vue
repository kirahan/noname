<template>
    <div >
        <el-row :gutter="0">
            <el-col :span="16" :offset="4" style="margin-top: 50px;text-align: center">
                <el-button class="result result-middle-title big-title">{{data.result.BaseInfo.nationalName}}</el-button>
                <el-button type="primary" class="result big-title">{{data.result.BaseInfo.region}}</el-button>
                <el-button type="warning" class="result big-title">{{data.result.BaseInfo.wcaid}}</el-button>
                <el-button type="info" class="result big-title">{{data.result.BaseInfo.competitionsNumber}}次参赛</el-button>
            </el-col>

            <el-col  :span="16" :offset="4" >
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

                    <div v-for="event in data.result.PersonalResult">

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
                        <el-button class="result result-single-sunofranks">{{data.result.SumofRanks.single.WR}}</el-button>
                        <el-button class="result result-single-sunofranks">{{data.result.SumofRanks.single.CR}}</el-button>
                        <el-button class="result result-single-sunofranks">{{data.result.SumofRanks.single.NR}}</el-button>
                        <el-button class="result result-middle-title">SumOfRanks</el-button>
                        <el-button class="result result-average-sunofranks">{{data.result.SumofRanks.average.NR}}</el-button>
                        <el-button class="result result-average-sunofranks">{{data.result.SumofRanks.average.CR}}</el-button>
                        <el-button class="result result-average-sunofranks">{{data.result.SumofRanks.average.WR}}</el-button>

                    </el-button-group>
                </el-card>
            </el-col>
        </el-row>

    </div>
</template>

<script>
    export default {
        name: "PersonalInfoPanel",
        data(){
            return {

            }
        },
        methods :{},
        props:['data','workingcounter'],
        watch :{}
    }
</script>

<style scoped>

    .result{
        padding: 5px !important;
        margin-left: 0px !important;
        font-size: 20px;
        text-align: center;
        color: white;
        text-shadow: 0 0 1px #d45ddc, 0 0 1px #322925, 0 0 1px #312932, 0 0 1px #2f3228, 0 0 1px #00ade7, 0 0 1px #00ade7, 0 0 1px #00ade7;
    }
    .player-rersonal-result{
        background-color: transparent;
        border: 0px!important;
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

    .big-title{
        font-size: 30px;
    }
</style>