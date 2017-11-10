<template>
    <div class="m-search">
        <input type="input" placeholder="搜索歌曲" ref="content"/>
        <input @click="searchContent" type="button" value="搜索"/>
        <div class="song-list">
            <ul>
                <li v-for="item in songList">{{item.songname}}</li>
            </ul>
        </div>      
    </div>
</template>

<script>
    import {searchSongs} from 'api/search'

    export default {
        data(){
            return {
                songList: []
            }           
        },
        methods: {
            searchContent(){
                let content = this.$refs.content.value
                searchSongs(content).then((res) => {
                    this.songList = res.data.song.list
                })
            }
        }
    }
</script>

<style scoped lang="stylus"></style>