<template>
  <div class="m-header">
    <div class="icon"></div>
    <h1 class="text">Music Player</h1>
  </div>
</template>

<script>
  export default {}
</script>

<style scoped lang="stylus">
/*
https://github.com/shama/stylus-loader
stylus-loader can also take advantage of webpack's resolve options. 
With the default options it'll find files in web_modules as well as node_modules, 
make sure to prefix any lookup in node_modules with ~.
To load files from a relative path leave off the ~
*/
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'

  .m-header
    position: relative
    height: 44px
    text-align: center
    color: $color-theme
    font-size: 0
    .icon
      display: inline-block
      vertical-align: top
      margin-top: 6px
      width: 30px
      height: 30px
      margin-right: 9px
      bg-image('logo') 
      background-size: 30px 30px
    .text
      display: inline-block
      vertical-align: top
      line-height: 44px
      font-size: $font-size-large
</style>