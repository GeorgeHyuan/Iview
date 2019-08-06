<template>
  <div>
    <Dropdown trigger="click" @on-click="changeTheme">
      <a href="javascript:void(0)">
        {{ theme }}
        <Icon :size="18" type="md-arrow-dropdown" />
      </a>
      <DropdownMenu slot="list">
        <DropdownItem v-for="item in ThemeList" :name="item.value" :key="'theme' + item.value">{{ item.label }}</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
export default {
  name: 'theme-change',
  props: {
    theme: String
  },
  data () {
    return {
      ThemeList: [
        {
          label: '主题A',
          value: 'components/main'
        },
        {
          label: '主题B',
          value: 'components/main/index2.js'
        }
      ]
    };
  },
  methods: {
    changeTheme (name) {
      this.$emit('on-theme-change', name);
    }
  }
};
</script>
