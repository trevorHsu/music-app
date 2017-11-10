<template>
    <Scroll class="list-view" :data="data" ref="listView" 
    :listenScroll="listenScroll" @scroll="scroll" :probeType="probeType">
        <ul>
            <li v-for="group in data" class="list-group" ref="listGroup">
                <h2 class="list-group-type">{{group.type}}</h2>
                <ul>
                    <li @click="selectItem(item)" v-for="item in group.items" class="list-group-item">
                        <img v-lazy="item.avatar" class="avatar"/>
                        <span class="name">{{item.name}}</span>
                    </li>
                </ul>
            </li>
        </ul>
        <div class="list-shortcut" @touchstart="onShortCutTouchStart" @touchmove.stop.prevent="onShortCutTouchMove">
            <ul>
                <li :class="{'current': currentIndex == index}" v-for="(item, index) in shortCutList" :data-index="index" class="item">{{item}}</li>
            </ul>
        </div>
        <div class="list-fixed" v-show="fixedTitle" ref="fixed">
            <div class="fixed-title">{{fixedTitle}}</div>
        </div>
        <div v-show="!data.length" class="loading-container">
            <loading></loading>
        </div>
    </Scroll>
</template>

<script>
    import Scroll from 'base/scroll/scroll'
    import {getData} from 'common/js/dom'
    import Loading from 'base/loading/loading'

    const ANCHOR_HEIGHT = 18
    const TITLE_HEIGHT = 30

    export default {
        data(){
            return {
                scrollY: -1,
                currentIndex: 0,
                diff: -1
            }
        },
        created(){
            //if a data needn't to be listened, it can be placed in 'created'. 
            //Because the data in 'props', 'data' or 'computed' can be listened by vue through 'getter' and 'setter' for listening to the data changes.
            this.touch = {}
            this.probeType = 3
            this.listenScroll = true
            this.listHeight = []
        },
        props: {
            data: {
                type: Array,
                default: []
            }
        },
        components: {
            Scroll,
            Loading
        },
        methods: {
            selectItem(item){
                this.$emit('select', item)
            },
            onShortCutTouchStart(e){
                let anchor = getData(e.target, 'index')
                let firstTouch = e.touches[0]
                this.touch.y1 = firstTouch.pageY
                this.touch.anchor = anchor
                this._scrollToElement(anchor)
            },
            onShortCutTouchMove(e){
                let firstTouch = e.touches[0]
                this.touch.y2 = firstTouch.pageY
                let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
                /*1. use bitwise operator to judge a number is odd or even: console.log(6 & 1) >> 0  
                *    cause for an even, the final value of its binary number is 0; for an odd, it is 1
                * 2. use bitwise operator to get a floor int: console.log(6.8 | 0)  >> 6
                *    float can not support the bit operation, so it would change into an int at first, like 7.6 => 7, then begin the bit operation for the certain int.
                * 3. console.log(6.8 | 1) >> 7
                *    the reason is similar to (2)
                */
                let anchor = parseInt(this.touch.anchor) + delta
                this._scrollToElement(anchor)
            },
            scroll(pos){
                // console.log(this.scrollY)
                this.scrollY = pos.y
            },
            _scrollToElement(_anchor){
                if(!_anchor && _anchor != 0) return
                if(_anchor<0){
                    _anchor = 0
                } else if(_anchor>this.listHeight.length-2){
                    _anchor = this.listHeight.length - 2
                }
                this.scrollY = -this.listHeight[_anchor]
                this.$refs.listView.scrollToElement(this.$refs.listGroup[_anchor], 0)
            },
            _calHeight(){
                this.listHeight = []
                const list = this.$refs.listGroup
                let height = 0
                this.listHeight.push(height)
                list.forEach((item) => {
                    height += item.clientHeight
                    this.listHeight.push(height)
                })
            }
        },
        watch: {
            data(){
                setTimeout(() => {
                    this._calHeight()
                }, 20)
            },
            scrollY(newY){
                const listHeight = this.listHeight
                //scroll to top
                if(newY > 0){
                    this.currentIndex = 0
                    return
                }
                //scroll in middle
                for(let i=0; i<listHeight.length-1; i++){
                    let height1 = listHeight[i]
                    let height2 = listHeight[i+1]
                    if(-newY >= height1 && -newY < height2){
                        this.currentIndex = i
                        this.diff = height2 + newY
                        return
                    }
                }
                //scroll to bottom
                this.currentIndex = listHeight.length - 2
            },
            diff(newVal){
                let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal-TITLE_HEIGHT : 0
                if(this.fixedTop == fixedTop) return //to reduce the DOM operation: it is not neccessary to operate DOM when the diff has not been changed.
                this.fixedTop = fixedTop
                this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)` // use translate3d to launch GPU acceleration
            }
        },
        computed: {
            shortCutList(){
                return this.data.map((group) => {
                    return group.type.substr(0, 1)
                })
            },
            fixedTitle(){
                if(this.scrollY>0) return
                return this.data[this.currentIndex] ? this.data[this.currentIndex].type : ''
            }
        }
    }
</script>

<style lang="stylus">
@import '~common/stylus/variable'

  .list-view
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-bg
    .list-group
      .list-group-type
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-sub-theme
        background: $color-highlight-bg
      .list-group-item
        border-bottom: 1px solid $color-highlight-bg
        display: flex
        align-items: center
        padding: 10px 0 10px 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-d
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-bg-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-sub-theme
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-sub-theme
        background: $color-highlight-bg
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>