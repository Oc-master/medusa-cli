const toHorizontalLine = (str) => {
  return str.replace(/_/g, (match) => ('-'));
};

exports.pageWxml = (pageName) => `<layout options="{{ $page }}">
  <view class="${toHorizontalLine(pageName)}"></view>
</layout>
`;

exports.pageStyle = (pageName) => `.${toHorizontalLine(pageName)} { }
`;

exports.pageJavascript = `import Page from '@/utils/base';
import './index.less';

Page({
  data: {},
  onLoad() { },
});
`;

exports.pageJson = `{
  "usingComponents": {}
}
`;
