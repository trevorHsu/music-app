<template>
    <div class="music-list">
        <div class="back">
            <i class="icon-back"></i>
        </div>
        <h1 class="title" v-html="title"></h1>
        <div class="bg-image" :style="bgStyle" ref="bgImage">
            <div class="filter" ref="filter"></div>
        </div>
        <div class="bg-layer" ref="layer"></div>
        <scroll @scroll="scroll" :probe-type="probeType" :listen-scroll="listenScroll" :data="songs" class="list" ref="list">
            <div class="song-list-wrapper">
                <song-list :songs="songs"/>
            </div>         
        </scroll>
    </div>
</template>

<script>
    import Scroll from 'base/scroll/scroll'
    import SongList from 'base/songList/songList'
    import {prefixStyle} from 'common/js/dom'

    const transform = prefixStyle('transform')
    const RESERVED_HEIGHT = 40

    export default {
        props: {
            bgImage: {
                type: String,
                default: ''
            },
            songs: {
                type: Array,
                default: []
            },
            title: {
                type: String,
                default: ''
            }
        },
        data(){
            return {
                scrollY: 0
            }
        },
        methods: {
            scroll(pos){
                this.scrollY = pos.y
            }
        },
        watch: {
            scrollY(newY){             
                let translateY = Math.max(this.minTranslateY, newY)
                let zIndex = 0
                let scale = 1
                this.$refs.layer.style[transform] = `translate3d(0, ${translateY}px, 0)`
                let percent = Math.abs(newY / this.imageHeight)
                if(newY > 0){
                    scale = 1 + percent
                    zIndex = 10
                } else{
                    //image filter
                    let opacity = 0.4 + translateY / this.minTranslateY * 0.6
                    this.$refs.filter.style.background = `rgba(126,126,126, ${opacity})` 
                }
                if(newY < this.minTranslateY){
                    zIndex = 10
                    this.$refs.bgImage.style.paddingTop = 0
                    this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
                } else{
                    this.$refs.bgImage.style.paddingTop = '70%'
                    this.$refs.bgImage.style.height = 0        
                }
                this.$refs.bgImage.style.zIndex = zIndex  
                this.$refs.bgImage.style[transform] = `scale(${scale})` 
            }
        },
        computed: {
            bgStyle(){
                return `background-image: url(${this.bgImage})`
            }
        },
        components: {
            Scroll,
            SongList
        },
        created(){
            this.probeType = 3
            this.listenScroll = true
        },
        mounted(){
            this.imageHeight = this.$refs.bgImage.clientHeight
            this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT
            this.$refs.list.$el.style.top = `${this.imageHeight}px`
        }
    }
</script>

<style lang="stylus" scoped>
    @import '~common/stylus/variable'
    @import '~common/stylus/mixin'

    .music-list
        position: fixed
        z-index: 100
        top: 0
        right: 0
        bottom: 0
        left: 0
        background: $color-bg
        .back
            position: absolute
            top: 0
            left: 6px
            z-index: 50
            .icon-back
                display: block
                padding: 10px
                font-size $font-size-large-x
                color: $color-theme
        .title
            position: absolute
            top: 10px
            left: 10%
            z-index: 40
            width: 80%
            no-wrap()
            text-align: center
            line-height: $font-size-large
            color: $color-highlight-bg
        .bg-image
            position: relative
            width: 100%
            height: 0
            padding-top: 70%
            transform-origin: top
            background-size: cover
            .play-wrapper
                position: absolute
                bottom: 20px
                z-index: 50
                width: 50
                .play
                    box-sizing: border-box
                    width: 135px
                    padding: 7px 0
                    margin: 0 auto
                    text-align: center
                    border: 1px solid $color-theme
                    color: $color-theme
                    border-radius: 100px
                    font-size: 0
                    .icon-play
                        display: inline-block
                        vertical-align: middle
                        margin-right: 6px
                        font-size: $font-size-medium-x
                    .text
                        display: inline-block
                        vertical-align: middle
                        font-size: $font-size-small
            .filter
                position: absolute
                top: 0
                left: 0
                width: 100%
                height: 100%
                /*transition: 0.3s*/
                background: rgba(126,126,126, 0.4)
        .bg-layer
            position: relative
            height: 100%
            background: $color-bg
        .list
            position: fixed
            top: 0
            bottom: 0
            width: 100%
            background: $color-bg
            .song-list-wrapper
                padding: 20px 30px
                /*border-bottom: 1px solid red*/
            .loading-container
                position: absolute
                width: 100%
                top: 50%
                transform: translateY(-50%)           
</style>

