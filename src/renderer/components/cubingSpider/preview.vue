<template>
    <div>
        <video class="preview" :id="windowtitle"></video>
    </div>
</template>

<script>

    const {desktopCapturer} = require('electron')



    export default {
        name: "preview",
        created(){
            var that = this
            function handleStream (stream) {
                var id = '#' + that.windowtitle
                const video = document.querySelector(id)
                video.srcObject = stream
                video.onloadedmetadata = (e) => video.play()
            }

            desktopCapturer.getSources({types: ['window']}, (error, sources) => {
                if (error) throw error

                for (let i = 0; i < sources.length; ++i) {
                    // console.log(sources[i].name,that.windowtitle)
                    if (sources[i].name.indexOf(that.windowtitle)!=-1) {
                        navigator.mediaDevices.getUserMedia({
                            audio: false,
                            video: {
                                mandatory: {
                                    chromeMediaSource: 'desktop',
                                    chromeMediaSourceId: sources[i].id,
                                    // minWidth: 800,
                                    // maxWidth: 800,
                                    // minHeight: 720,
                                    // maxHeight: 720
                                }
                            }
                        })
                            .then((stream) => handleStream(stream))
                            .catch((e) => console.log(e))
                        return
                    }
                }
            })
        },
        props : ['windowtitle'],
    }
</script>

<style scoped>
.preview{
    width: 100%;
}
</style>