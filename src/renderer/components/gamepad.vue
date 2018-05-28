<template>
    <div>dfdsfsdfsdf</div>
</template>


<script>
    import Gamepad from './gamepad/gamepad'
    const gamepad = new Gamepad();


    export default {
        name: "gamepad",
        data(){
            return{

            }
        },
        created(){
            this.initGamePad()
        },
        methods : {
            initGamePad : function () {
                gamepad.on('connect', e => {
                    console.log('connect');
                });

                gamepad.on('disconnect', e => {
                    console.log('disconnect');
                });

                //
                gamepad.on('hold', 'stick_axis_left', e => {
                    console.log(e,' was pressed!');
                });
            }
        }
    }
</script>

<style scoped>

</style>