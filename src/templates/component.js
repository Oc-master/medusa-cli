const toLowerLine = (str) => {
  const temp = str.replace(/[A-Z]/g, (match) => {
    return '-' + match.toLowerCase();
  });
  if (temp.slice(0, 1) === '-') {
    return temp.slice(1);
  }
  return temp;
};

exports.componentWxml = (componentName) => `<view class="${toLowerLine(componentName)}"></view>
`;

exports.componentStyle = (componentName) => `.${toLowerLine(componentName)} { }
`;

exports.componentJavascript = `import './index.less';

Component({ });
`;

exports.componentJson = `{
  "component": true
}
`;
