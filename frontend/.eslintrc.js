module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:vue/vue3-recommended", "prettier"],
  rules: {
    "vue/no-multiple-template-root": "off",
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
  },
};
