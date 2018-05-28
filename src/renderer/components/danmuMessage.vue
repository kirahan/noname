<template>
    <div>
        <div v-if="danmulist.type =='chatmsg'" class="danmu-text">
            <span class="user-type-streamer" v-bind:hidden="isStreamer">主播 </span>
            <span class="user-type-manager" v-bind:hidden="isManager">房管 </span>
            <span class="user-name">{{danmulist.nickname}}</span>  :
            <span class="danmu-message">{{danmulist.message}}</span>
        </div>

        <div v-if="danmulist.type =='dgb'" class="danmu-gift">
            <span class="user-name">{{danmulist.nickname}}</span>
            <span > 赠送: </span>
            <span class="danmu-gift-name">{{searchGiftName}}</span>
            <span class="gift-hit">x{{danmulist.hits}}</span>
        </div>
        <div v-if="danmulist.type =='uenter'" class="danmu-user-enter">
            <span> 欢迎: </span>
            <span class="user-name">{{danmulist.nickname}}[{{danmulist.level}}]</span>
            <span >进入直播间</span>
        </div>



    </div>
</template>

<script>
    import douyugiftlist from  './douyuGiftList'
    export default {
        name: "danmu-message",
        data(){
            return{
                gift : douyugiftlist
            }
        },
        computed : {
            isStreamer : function () {
                var that = this
                if(that.danmulist.usertype=='owner'){
                    return false
                }else return true
            },
            isManager : function () {
                var that = this
                if(that.danmulist.usertype=='manager'){
                    return false
                }else return true
            },
            searchGiftName : function () {
                return true
            }
        },
        props : ['danmulist']
    }
</script>

<style scoped>
    .danmu-content .danmu-text,
    .danmu-content .danmu-gift,
    .danmu-content .danmu-user-enter
    {
        font-family: 微软雅黑;
        text-align: left;
    }
    /*------弹幕消息样式------*/
    .danmu-text span{
        padding-left: 10px;
        font-size: 15px;
    }
    .danmu-text .user-name {
        color: #F44336;
        font-size: 16px;
    }
    .danmu-text .danmu-message{
        color: #BDBDBD; ;
        font-size: 15px;
    }
    .danmu-text .user-type-streamer{
        background-color: rgba(250,60,233,0.8);
        color: white;
    }
    .danmu-text .user-type-manager{
        background-color: #f60;
        color: white;
    }
    /*------礼物消息样式------*/
    .danmu-gift span{
        font-size: 15px;
    }
    .danmu-gift .user-name {
        color: #2196F3;;
        font-size: 15px;
    }
    .danmu-gift .gift-hit{
        color: #76FF03;;
        font-style: italic;
        font-size: 15px;
    }
    .danmu-gift .danmu-gift-name{
        font-size: 18px;
        color : rgba(238,28,178,0.8)
    }
    /*------用户进入样式------*/
    .danmu-user-enter span{
        font-size: 15px;
        color: #FFFF00;;
    }
    .danmu-user-enter .user-name {
        color: #76FF03;
        font-size: 15px;
    }
</style>