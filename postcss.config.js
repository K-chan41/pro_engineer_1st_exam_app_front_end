module.exports = {
  plugins: [
    'postcss-nested', // プラグインを文字列として指定
    'tailwindcss', // プラグインを文字列として指定
    'autoprefixer', // プラグインを文字列として指定
    'postcss-preset-mantine', // プラグインを文字列として指定
    ['postcss-simple-vars', { // オプションを持つプラグイン
      variables: {
        'mantine-breakpoint-xs': '36em',
        'mantine-breakpoint-sm': '48em',
        'mantine-breakpoint-md': '62em',
        'mantine-breakpoint-lg': '75em',
        'mantine-breakpoint-xl': '88em',
      },
    }],
  ],
}
