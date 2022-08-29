import { cypressAppSelect } from './common';

export const setStyle = (wrapperId: string, styleDef: string) => {
  const startLine = `/* cypress controls extension ${wrapperId} */`;
  const endLine = `/* cypress controls extension end ${wrapperId} */`;
  const styleTagLocator = 'html head style';

  // when no style tag add
  if (cypressAppSelect(styleTagLocator).length === 0) {
    cypressAppSelect('html head').append(`<style type="text/css"></style>`);
  }

  // should be last as css is cascading tables
  const style = cypressAppSelect(styleTagLocator).eq(
    cypressAppSelect(styleTagLocator).length - 1,
  );

  const html = style?.html();
  const commonStyleControlWrapper = `.control-wrapper { padding: 5px;padding-top:5px; }`;

  const addStyleCss = `\n${startLine}
     ${commonStyleControlWrapper}
     ${styleDef}
     ${endLine}`;

  // add style first time for session
  if (html?.indexOf(startLine) === -1) {
    style.append(addStyleCss);
  } else {
    // change style
    const start = html.indexOf(startLine);
    const end = html.indexOf(endLine + endLine.length);
    const toReplace = html.slice(start, end);

    if (style.get()?.[0]) {
      style.get()[0].innerHTML = html.replace('\n' + toReplace, addStyleCss);
    }
  }
};
