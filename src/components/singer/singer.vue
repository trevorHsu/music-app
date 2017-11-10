<template>
    <div class="singer">
        <listview @select="selectSinger" :data="singers"></listview>
        <router-view />
    </div>
</template>

<script>
    import {getSingerList} from 'api/singer'
    import {ERR_OK} from 'api/config'
    import {Singer} from 'common/js/singer'
    import {mapMutations} from 'vuex'
    import * as types from 'store/mutationType'
    import Listview from 'base/listview/listview'

    const HOT_SINGER = '热门' 
    const HOT_SINGER_LEN = 10

    export default {
        data(){
            return {
                singers: []
            }
        }, 
        components: {
            Listview
        },
        created(){
            this._getSingerList()        
        },
        methods: {
            selectSinger(singer){
                //function router 
                this.$router.push({
                    path: `/singer/${singer.id}`
                })
                this.setSinger(singer)  //a mutation function
            },
            _getSingerList(){
                getSingerList().then((res) => {
                    if(res.code == ERR_OK) this.singers = this._normalizeSinger(res.data.list)    
                })
            },
            _normalizeSinger(_list){
                let map = {
                    hot: {
                        type: HOT_SINGER,
                        items: []
                    }
                }
                _list.forEach((item, index) => {
                    if(index < HOT_SINGER_LEN){
                        map['hot'].items.push(new Singer({id: item.Fsinger_mid, name: item.Fsinger_name}))
                    }
                    const key = item.Findex
                    if(!map[key]){
                        map[key] = {type: key, items: []}
                    }
                    map[key].items.push(new Singer({id: item.Fsinger_mid, name: item.Fsinger_name}))
                })          

              //sort the list
              let hot = []
              let normal = []
              for(let key in map){
                  let val = map[key]
                  if(val.type.match(/[A-Za-z]/)) normal.push(val)
                  else if(val.type == HOT_SINGER) hot.push(val)
              }
              normal.sort((a, b) => {
                  return a.type.charCodeAt(0) - b.type.charCodeAt(0)
              })
              return hot.concat(normal)
            },
            //
            ...mapMutations({
                setSinger: types.SET_SINGER
            }) 
        }
    }
</script>

<style scoped lang="stylus">
    .singer
        position: fixed
        top: 88px
        bottom: 0
        width: 100%
</style>