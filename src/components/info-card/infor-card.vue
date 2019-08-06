<template>
  <Card class="info-card-wrapper" :padding="0">
    <div class="content-con">
      <div class="left-area" :style="{boxShadow:'0 0 10px 5px ' + colorA}">
        <div class="IconImage" :style="{
          backgroundImage:'url('+require('../../assets/images/home/'+icon+'.png')+')',
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }"></div>
      </div>
      <div class="right-area" :style="{color:color,textAlign:'left'}">
        <div>
          <slot></slot>
        </div>
      </div>
    </div>
  </Card>
</template>

<script>
export default {
  name: 'InforCard',
  props: {
    left: {
      type: Number,
      default: 36
    },
    color: {
      type: String,
      default: '#2d8cf0'
    },
    colorA: String,
    icon: {
      type: String,
      default: ''
    },
    iconSize: {
      type: Number,
      default: 20
    },
    shadow: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    leftWidth () {
      return `${this.left}%`;
    },
    rightWidth () {
      return `${100 - this.left}%`;
    }
  }
};
</script>

<style lang="less">
.common{
  float: left;
  height: 100%;
  display: table;
  text-align: center;
}
.size{
  width: 100%;
  height: 100%;
}
.middle-center{
  display: table-cell;
  vertical-align: middle;
}
.info-card-wrapper{
  .size;
  overflow: hidden;
  .ivu-card-body{
    .size;
  }
  .content-con{
    .size;
    position: relative;
    .left-area{
      .common;
      width: 92px;
      height: 92px;
      margin: 28px;
      @media (width: 1440px) {
        margin: 28px 15px;
      }
      @media (width: 1400px) {
        margin: 28px 15px;
      }
      border-radius: 50%;
      .IconImage{
        width: 60px;
        height: 60px;
        margin: 16px;
      }
      & > .icon{
        .middle-center;
      }
    }
    .right-area{
      .common;
      & > div{
        .middle-center;
      }
    }
  }
}
</style>
