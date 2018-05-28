<template>
    <div class="camera" style="overflow-y: hidden;">
        <div class="direction-panel  cl-10">
            <div class="cl-2 zoom-panel">
                <button class="full" @mousedown="sendCamCommand('zoomadd_start',0)" @mouseup="sendCamCommand('zoomadd_stop',0)">+</button>
                <button class="full" @mousedown="sendCamCommand('zoomdec_start',0)" @mouseup="sendCamCommand('zoomdec_stop',0)">-</button>
            </div>
            <div class="cl-6 dir-panel" >
                <div class="cl-10 full" >
                    <button class="full" @mousedown="sendCamCommand('leftup_start',50)" @mouseup="sendCamCommand('leftup_stop',50)">↖</button>
                    <button class="full" @mousedown="sendCamCommand('up_start',50)" @mouseup="sendCamCommand('up_stop',50)">↑</button>
                    <button class="full" @mousedown="sendCamCommand('rightup_start',50)" @mouseup="sendCamCommand('rightup_stop',50)">↗</button>
                </div>
                <div class="cl-10 full" >
                    <button class="full" @mousedown="sendCamCommand('left_start',50)" @mouseup="sendCamCommand('left_stop',50)">←</button>
                    <button class="full" @click="setorgotoPoints('gohome',0)">o</button>
                    <button class="full" @mousedown="sendCamCommand('right_start',50)" @mouseup="sendCamCommand('right_stop',50)">→</button>
                </div>
                <div class="cl-10 full" >
                    <button class="full" @mousedown="sendCamCommand('leftdown_start',50)" @mouseup="sendCamCommand('leftdown_stop',50)">↙</button>
                    <button class="full" @mousedown="sendCamCommand('down_start',50)" @mouseup="sendCamCommand('down_stop',50)">↓</button>
                    <button class="full" @mousedown="sendCamCommand('rightdown_start',50)" @mouseup="sendCamCommand('rightdown_stop',50)">↘</button>
                </div>
            </div>
            <div class="cl-2 focus-panel">
                <button class="full" @mousedown="sendCamCommand('focusadd_start',0)" @mouseup="sendCamCommand('focusadd_stop',0)">+</button>
                <button class="full" @mousedown="setFocusType">{{focusType}}</button>
                <button class="full" @mousedown="sendCamCommand('focusdec_start',0)" @mouseup="sendCamCommand('focusdec_stop',0)">-</button>
            </div>
        </div>
        <div class="quick-moving-panel  cl-10">
            <div class="cl-10 full">
                <button class="full" @click="OnvifGotoAbsolutePosition(-0.4,0,0.8)"></button>
                <button class="full" @click="OnvifGotoAbsolutePosition(-0.3,0,0.8)"></button>
                <button class="full" @click="OnvifGotoAbsolutePosition(-0.2,0,0.8)"></button>
                <button class="full" @click="OnvifGotoAbsolutePosition(-0.1,0,0.8)"></button>
                <button class="full" @click="OnvifGotoAbsolutePosition(0.0,0,0.8)"></button>
                <button class="full" @click="OnvifGotoAbsolutePosition(0.0,0,0.8)"></button>
                <button class="full" @click="OnvifGotoAbsolutePosition(0.1,0,0.8)"></button>
                <button class="full" @click="OnvifGotoAbsolutePosition(0.2,0,0.8)"></button>
                <button class="full" @click="OnvifGotoAbsolutePosition(0.3,0,0.8)"></button>
                <button class="full" @click="OnvifGotoAbsolutePosition(0.4,0,0.8)"></button>
            </div>
            <div class="cl-10 full">
                <button class="full" @click="OnvifGotoAbsolutePosition(-0.45,0,0.4)"></button>
                <button class="full" @click="OnvifGotoAbsolutePosition(-0.35,0,0.4)"></button>
                <button class="full" @click="OnvifGotoAbsolutePosition(-0.25,0,0.4)"></button>
                <button class="full" @click="OnvifGotoAbsolutePosition(-0.15,0,0.4)"></button>
                <button class="full" @click="OnvifGotoAbsolutePosition(-0.05,0,0.4)"></button>
                <button class="full" @click="OnvifGotoAbsolutePosition(0.05,0,0.4)"></button>
                <button class="full" @click="OnvifGotoAbsolutePosition(0.15,0,0.4)"></button>
                <button class="full" @click="OnvifGotoAbsolutePosition(0.25,0,0.4)"></button>
                <button class="full" @click="OnvifGotoAbsolutePosition(0.35,0,0.4)"></button>
                <button class="full" @click="OnvifGotoAbsolutePosition(0.45,0,0.4)"></button>
            </div>
            <div class="cl-10 full">
                <button class="full" @click="OnvifGotoAbsolutePosition(-0.5,0,0.8)"></button>
                <button class="full" @click="OnvifGotoAbsolutePosition(-0.5,0,0.2)"></button>
                <div class="cam-middle" style="">CAM</div>
                <button class="full" @click="OnvifGotoAbsolutePosition(0.5,0,0.2)"></button>
                <button class="full" @click="OnvifGotoAbsolutePosition(0.5,0,0.8)"></button>
            </div>
                <div class="cl-10 full">
                <button class="full" @click="OnvifGotoAbsolutePosition(-0.6,0,0.6)"></button>
                <button class="full" @click="OnvifGotoAbsolutePosition(-0.7,0,0.5)"></button>
                <button class="full" @click="OnvifGotoAbsolutePosition(-0.8,0,0.4)"></button>
                <button class="full" @click="OnvifGotoAbsolutePosition(-0.9,0,0.3)"></button>
                <button class="full" @click="OnvifGotoAbsolutePosition(-1,0,0.2)"></button>
                <button class="full" @click="OnvifGotoAbsolutePosition(1.0,0,0.2)"></button>
                <button class="full" @click="OnvifGotoAbsolutePosition(0.9,0,0.3)"></button>
                <button class="full" @click="OnvifGotoAbsolutePosition(0.8,0,0.4)"></button>
                <button class="full" @click="OnvifGotoAbsolutePosition(0.7,0,0.5)"></button>
                <button class="full" @click="OnvifGotoAbsolutePosition(0.6,0,0.6)"></button>
            </div>
        </div>
        <div class="preset-point-panel  cl-10">
            <div class="cl-6 dir-panel" >
                <div class="cl-10 full" >
                    <button class="full" @click="setpointValue(1)" :style="{'background-color' : (presetPoint==1) ? 'red':''}">1</button>
                    <button class="full" @click="setpointValue(2)" :style="{'background-color' : (presetPoint==2) ? 'red':''}">2</button>
                    <button class="full" @click="setpointValue(3)" :style="{'background-color' : (presetPoint==3) ? 'red':''}">3</button>
                </div>
                <div class="cl-10 full" >
                    <button class="full" @click="setpointValue(4)" :style="{'background-color' : (presetPoint==4) ? 'red':''}">4</button>
                    <button class="full" @click="setpointValue(5)" :style="{'background-color' : (presetPoint==5) ? 'red':''}" >5</button>
                    <button class="full" @click="setpointValue(6)" :style="{'background-color' : (presetPoint==6) ? 'red':''}">6</button>
                </div>
                <div class="cl-10 full" >
                    <button class="full" @click="setpointValue(7)" :style="{'background-color' : (presetPoint==7) ? 'red':''}">7</button>
                    <button class="full" @click="setpointValue(8)" :style="{'background-color' : (presetPoint==8) ? 'red':''}">8</button>
                    <button class="full" @click="setpointValue(9)" :style="{'background-color' : (presetPoint==9) ? 'red':''}">9</button>
                </div>
            </div>
            <div class="cl-4 dir-panel" >
                <button class="full" @click="setorgotoPoints('set',presetPoint)">set</button>
                <button class="full" @click="setorgotoPoints('goto',presetPoint)">goto</button>
            </div>
        </div>
        <div class="full" ><button @click="openConfig">详细配置</button></div>
    </div>
</template>

<script>
    import request from  'request-promise'
    import onvif from 'node-onvif'
    import Gamepad from './../components/gamepad/gamepad'
    const gamepad = new Gamepad()
    const serverURL = 'http://192.168.0.163/ajaxcom?szCmd='

    let device =  new onvif.OnvifDevice({
        xaddr: 'http://192.168.0.163:2000/onvif/device_service',
        user : 'admin',
        pass : 'admin'
    })

    export default {
        name: "onvif",
        created(){
            this.initGamePad()
            this.initOnvif()
        },
        data(){
            return{
                presetPoint : 1,
                focusType : 'A',
            }
        },
        computed : {

        },
        methods : {
            initOnvif: function () {
                // Initialize the OnvifDevice object
                device.init().then(() => {
                    // The OnvifServicePtz object
                    let ptz = device.services.ptz;
                    if(!ptz) {
                        throw new Error('Your ONVIF network camera does not support the PTZ service.');
                    }
                    // The parameters for the gotoHomePosition() method
                    let profile = device.getCurrentProfile();
                    let token = profile['token']

                }).then((result) => {
                    console.log(JSON.stringify(result.data, null, '  '));
                }).catch((error) => {
                    console.log(error);
                });
            },
            initGamePad : function () {
                var that = this
                var shoulderLeftTopFlag = false
                var shoulderRightTopFlag = false
                var holdcounter = 0


                gamepad.on('connect', e => {
                    console.log('connect');
                });

                gamepad.on('disconnect', e => {
                    console.log('disconnect');
                });

                //LB holding
                gamepad.on('hold','shoulder_top_left',e=>{
                    shoulderLeftTopFlag = true
                })

                gamepad.on('release','shoulder_top_left',e=>{
                    shoulderLeftTopFlag = false
                })

                //RB holding
                gamepad.on('hold','shoulder_top_right',e=>{
                    shoulderRightTopFlag = true
                })

                gamepad.on('release','shoulder_top_right',e=>{
                    shoulderRightTopFlag = false
                })

                //左边摇杆，调整位置
                gamepad.on('hold', 'stick_axis_left', e => {

                    if(holdcounter==4){
                        holdcounter = 0
                        console.log(e,' hold ......!');
                        var x = e.value['0']*100
                        var y = e.value['1']*100
                        console.log(x,y)
                        var command = ''
                        if(x*x>4000 && y*y<2000){
                            if(x>0){
                                command = 'right_start'
                            }else {
                                command = 'left_start'
                            }
                        }else if(x*x<2000 && y*y>4000){
                            if(y>0){
                                command = 'down_start'
                            }else {
                                command = 'up_start'
                            }
                        }
                        var speed = Math.floor(Math.sqrt((x*x+y*y)))

                        if (shoulderRightTopFlag){
                            speed = 20
                        }

                        console.log(command,speed)
                        that.sendCamCommand(command,speed)
                    }else {
                        holdcounter++
                    }



                });

                //左边摇杆释放,停止调整
                gamepad.on('release', 'stick_axis_left', e => {
                    // console.log(e,' was release!');
                    that.sendCamCommand('right_stop',50)
                    that.sendCamCommand('left_stop',50)
                    that.sendCamCommand('up_stop',50)
                    that.sendCamCommand('down_stop',50)

                });

                //手动对焦 减少
                gamepad.on('press', 'shoulder_bottom_left', e => {
                    that.focusType = 'A'
                    that.setFocusType()
                    that.sendCamCommand('focusdec_start',0)
                });

                gamepad.on('release', 'shoulder_bottom_left', e => {
                    that.focusType = 'A'
                    that.setFocusType()
                    that.sendCamCommand('focusdec_stop',0)
                });

                //手动对焦 增加
                gamepad.on('press', 'shoulder_bottom_right', e => {
                    that.focusType = 'A'
                    that.setFocusType()
                    that.sendCamCommand('focusadd_start',0)
                });

                gamepad.on('release', 'shoulder_bottom_right', e => {
                    that.focusType = 'A'
                    that.setFocusType()
                    that.sendCamCommand('focusadd_stop',0)
                });


                //切换为自动对焦   A button
                gamepad.on('press', 'button_1', e => {
                    console.log('[press]',e)

                    that.focusType = 'M'
                    that.setFocusType()
                });

                //跳转或者设置定位点3  B button
                gamepad.on('press', 'button_2', e => {
                    if(shoulderLeftTopFlag){
                        that.setorgotoPoints('set',3)
                    }else {
                        that.setorgotoPoints('goto',3)
                    }
                });

                //跳转或者设置定位点2  Y button
                gamepad.on('press', 'button_4', e => {
                    if(shoulderLeftTopFlag){
                        that.setorgotoPoints('set',2)
                    }else {
                        that.setorgotoPoints('goto',2)
                    }
                });

                //跳转或者设置定位点1  X button
                gamepad.on('press', 'button_3', e => {
                    if(shoulderLeftTopFlag){
                        that.setorgotoPoints('set',1)
                    }else {
                        that.setorgotoPoints('goto',1)
                    }
                });

                //右边摇杆,保持中，调整焦距
                gamepad.on('hold', 'stick_axis_right', e => {
                    console.log('[press]',holdcounter,e);
                    var y = e.value['1']
                    if(holdcounter==4){
                        holdcounter = 0
                        if(y<-0.5){
                            that.sendCamCommand('zoomadd_start',0)
                        }else if(y>0.5){
                            that.sendCamCommand('zoomdec_start',0)
                        }
                    }else {
                        holdcounter++
                    }

                });

                //右边摇杆释放,停止调整焦距
                gamepad.on('release', 'stick_axis_right', e => {
                    console.log('[release]',e);
                    that.sendCamCommand('zoomadd_stop',0)
                    that.sendCamCommand('zoomdec_stop',0)

                });
            },

            OnvifGotoAbsolutePosition : function (x,y,zoom) {
                //得到range   x 【-1 1】   y【-1 3】 z【0 1】  token = "MainStreamToken"
                var that = this

                let ptz = device.services.ptz;
                let params = {
                    'ProfileToken': "MainStreamToken",
                    'Position'    : {'x': x, 'y': y, 'z': zoom},
                    // 'Speed'       : {'x': 1, 'y': 1, 'z': 1}
                };

                ptz.absoluteMove(params).then((result) => {

                    console.log(JSON.stringify(result['data'], null, '  '));
                }).catch((error) => {
                    console.log(error);
                });

            },



            openConfig : function () {
                this.$electron.remote.shell.openExternal('http://192.168.0.163');
            },
            sendCamCommand : function (command,value) {
                var commandjson = {
                        SysCtrl:{
                            PtzCtrl:{
                                nChanel:0,
                                szPtzCmd:command,
                                byValue:value
                            }
                        }
                }
                var commandformat = encodeURIComponent(JSON.stringify(commandjson))
                // console.log(commandformat)
                var options = {
                    method: 'GET',
                    uri: serverURL + commandformat,
                    json: true // Automatically stringifies the body to JSON
                };
                // console.log(options)
                request(options).then(function (res) {
                    // console.log(res)
                }).catch(function (err) {
                    // console.log(err)
                })
            },
            setpointValue : function (point) {
                this.presetPoint = point
            },
            setFocusType : function () {
                var command = ''
                var that = this
                if(that.focusType == 'A'){
                    command = 3
                    that.focusType = 'M'
                }else if(that.focusType == 'M'){
                    command = 2
                    that.focusType = 'A'
                }

                var commandjson = {
                    SetEnv:{
                        VideoParam:[
                                {
                                    stAF: {emAFMode:command},
                                    nChannel:0
                                }
                                ]
                    }
                }
                var commandformat = encodeURIComponent(JSON.stringify(commandjson))
                console.log(commandformat)
                var options = {
                    method: 'GET',
                    uri: serverURL + commandformat,
                    json: true // Automatically stringifies the body to JSON
                };
                console.log(options)
                request(options).then(function (res) {
                    console.log(res)
                }).catch(function (err) {
                    console.log(err)
                })
            },
            setorgotoPoints :function (type,points) {
                var command = ''
                if(type == 'set'){
                    command = 'preset_set'
                }else if(type == 'goto'){
                    command = 'preset_call'
                }else if(type == 'gohome'){
                    command = 'go_home'
                    points = 0
                }

                var commandjson = {
                    SysCtrl:{
                        PtzCtrl:{
                            nChanel:0,
                            szPtzCmd:command,
                            byValue:points
                        }
                    }
                }
                var commandformat = encodeURIComponent(JSON.stringify(commandjson))
                console.log(commandformat)
                var options = {
                    method: 'GET',
                    uri: serverURL + commandformat,
                    json: true // Automatically stringifies the body to JSON
                };
                console.log(options)
                request(options).then(function (res) {
                    console.log(res)
                }).catch(function (err) {
                    console.log(err)
                })
            },
        },
    }
</script>

<style scoped>

.camera{
    display: flex !important;
    flex-direction: column;
    height: 360px !important;
}

.cam-middle{
    text-align: center;
    flex-grow: 4;
    background-color: aqua;
    -webkit-app-region: drag;
}
.full {
    flex-grow: 1;
    font-size: 30px;
}
.direction-panel, .preset-point-panel{
    height: 30%;
}
.quick-moving-panel{
    height: 30%;
    flex-direction: column;
}
.zoom-panel, .dir-panel, .focus-panel{
    flex-direction: column;

}
.cl-10{
    width: 100%;
    display: flex;
}
.cl-2{
    width: 20%;
    display: flex;
}
.cl-3{
    width: 30%;
    display: flex;
}
.cl-4{
    width: 40%;
    display: flex;
}
.cl-5{
    width: 50%;
    display: flex;
}
.cl-6{
    width: 60%;
    display: flex;
}
</style>