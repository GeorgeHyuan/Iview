<style lang="less">
  @import "./style/setModal.less";
</style>
<template>
  <Modal class="setModal" v-model="modalFlag" :width="modalWidth" :mask-closable="modalMask" @on-cancel="shutModal">
    <p slot="header" class="setModal-title">
      {{ modalTitle }}
    </p>
    <slot></slot>
    <div slot="footer" class="setModal-footer">
      <Button type="primary" :loading="modalSubmitLoading" @click="submitModal" v-if="showSubmitButton">{{ submitWord }}</Button>
      <Button type="default" @click="shutModal" v-if="showCancelButton">{{ cancelWord }}</Button>
    </div>
  </Modal>
</template>

<script>
export default {
  name: 'SetModal',
  props: {
    modalValue: {
      type: Boolean,
      default: false
    },
    modalTitle: String,
    modalWidth: {
      type: Number,
      default: 650
    },
    modalMask: {
      type: Boolean,
      default: false
    },
    modalLoading: {
      type: Boolean,
      default: false
    },
    cancelWord: {
      type: String,
      default: '取消'
    },
    submitWord: {
      type: String,
      default: '提交'
    },
    showSubmitButton: {
      type: Boolean,
      default: true
    },
    showCancelButton: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      modalFlag: false,
      modalSubmitLoading: false
    };
  },
  methods: {
    submitModal () {
      this.$emit('on-submit-modal');
    },
    shutModal () {
      this.$emit('on-cancel-modal');
    }
  },
  mounted () {
    this.$data.modalFlag = this.$props.modalValue;
    this.$data.modalSubmitLoading = this.$props.modalLoading;
  },
  watch: {
    modalValue (newValue) {
      this.$data.modalFlag = newValue;
    },
    modalLoading (newValue) {
      this.$data.modalSubmitLoading = newValue;
    }
  }
};
</script>
