<template>
    <div class="recommend">
        <Scroll ref="scroll" class="recommend-content" :data="diskList">
            <div>
                <div v-if="recommends.length" class="slider-wrapper">
                    <slider>
                        <div v-for="item in recommends">
                            <a :href="item.linkUrl">
                                <img class="needsclick" @load="loadImg" :src="item.picUrl"/>
                            </a>
                        </div>
                    </slider>
                </div>
                <div class="recommend-list">
                    <h1 class="list-title">热门歌单推荐</h1>
                    <div class="loading-wrapper" v-show="!diskList.length">
                        <loading ></loading>
                    </div>
                    <ul>
                        <li v-for="item in diskList" class="item">
                            <div class="icon">
                                <img v-lazy="item.imgurl"/>
                            </div>
                            <div class="text">
                                <h2 class="name" v-html="item.creator.name"></h2>
                                <p class="desc" v-html="item.dissname"></p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </Scroll>
    </div>
</template>

<script>
    import {getRecommend, getDiskList} from 'api/recommend'
    import {ERR_OK} from 'api/config'
    
    import Slider from 'base/slider/slider'
    import Scroll from 'base/scroll/scroll'
    import Loading from 'base/loading/loading'

    export default {
        data(){
            return {
                recommends: [],
                diskList: []
            }
        },
        created(){
            this._getRecommend()
            this._getDiskList()
        },
        methods: {
            _getRecommend(){
                getRecommend().then((res) => {
                    if(res.code === ERR_OK){
                        this.recommends = res.data.slider
                    }
                })
            },
            _getDiskList(){
                getDiskList().then((res) => {
                    if(res.code === ERR_OK){
                        this.diskList = res.data.list
                    }
                })
            },
            loadImg(){
                if(!this.checkLoadImg){
                    this.$refs.scroll.refresh()
                    this.checkLoadImg = true
                }
            }
        },
        components: {
            Slider,
            Scroll,
            Loading
        }
    }
</script>

<style scoped lang="stylus">
    @import '~common/stylus/variable'

    .recommend
        position: fixed
        width: 100%
        top: 88px
        bottom: 0
        .recommend-content
            height: 100%
            overflow: hidden
            .slider-wrapper
                position: relative
                width: 100%
                overflow: hidden
            .recommend-list
                .list-title
                    height: 65px
                    line-height: 65px
                    text-align: center
                    font-size: $font-sizw-medium
                    color: $color-theme
                .item
                    display: flex
                    box-sizing: border-box
                    align-items: center
                    padding: 0 20px 15px 20px
                    .icon
                        flex: 0 0 60px
                        width: 60px
                        padding-right: 20px
                        &>img
                            width: 60px
                            height: 60px
                    .text
                        display: flex
                        flex-direction: column
                        justify-content: center
                        flex: 1
                        line-height: 20px
                        overflow: hidden
                        font-size: $fon-size-medium
                        .name
                            margin-bottom: 10px
                            color: $color-text
                        .desc
                            color: $color-text-d
</style>