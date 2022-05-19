//  预览相关
const getContentStyle = (editor) => {
  return editor.getParam('content_style', '', 'string');
};

const getBodyClassByHash = (editor) => {
  const bodyClass = editor.getParam('body_class', '', 'hash');
  return bodyClass[editor.id] || '';
};

const getBodyClass = (editor) => {
  const bodyClass = editor.getParam('body_class', '', 'string');
  if (bodyClass.indexOf('=') === -1) {
    return bodyClass;
  }
  return getBodyClassByHash(editor);
};

const getBodyIdByHash = (editor) => {
  const bodyId = editor.getParam('body_id', '', 'hash');
  return bodyId[editor.id] || bodyId;
};

const getBodyId = (editor) => {
  const bodyId = editor.getParam('body_id', 'tinymce', 'string');
  if (bodyId.indexOf('=') === -1) {
    return bodyId;
  }
  return getBodyIdByHash(editor);
};

export const getPreviewHtml = (editor) => {
  let headHtml = `<meta charset='UTF-8'>
  <meta name='viewport' content='width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=0'>
  <meta name='format-detection' content='telephone=no,email=no,date=no,address=no'>
  <meta http-equiv='X-UA-Compatible' content='IE=edge,chrome=1'>
  <meta name='screen-orientation' content='portrait'>
  <meta name='x5-orientation' content='portrait'>`;

  const { encode } = editor.dom;
  headHtml += `<base href="${encode(editor.documentBaseURI.getURI())}">`;

  // var cors = shouldUseContentCssCors(editor) ? ' crossorigin="anonymous"' : '';
  // global.each(editor.contentCSS, function (url) {
  //   headHtml += '<link type="text/css" rel="stylesheet" href="' + encode(editor.documentBaseURI.toAbsolute(url)) + '"' + cors + '>';
  // });

  const contentStyle = getContentStyle(editor);
  if (contentStyle) {
    headHtml += `<style type="text/css">${contentStyle}</style>`;
  }

  const bodyId = getBodyId(editor);
  const bodyClass = getBodyClass(editor);

  // var isMetaKeyPressed = global$1.mac ? 'e.metaKey' : 'e.ctrlKey && !e.altKey';
  // var preventClicksOnLinksScript = '<script>' + 'document.addEventListener && document.addEventListener("click", function(e) {' + 'for (var elm = e.target; elm; elm = elm.parentNode) {' + 'if (elm.nodeName === "A" && !(' + isMetaKeyPressed + ')) {' + 'e.preventDefault();' + '}' + '}' + '}, false);' + '</script> ';

  const directionality = editor.getBody().dir;
  const dirAttr = directionality ? ` dir="${encode(directionality)}"` : '';

  // const previewHtml = `'<!DOCTYPE html><html><head>${  headHtml  }</head><body id="${  encode(bodyId)  }" class="mce-content-body ${  encode(bodyClass)  }" ${  dirAttr  }>${  editor.getContent()  }${preventClicksOnLinksScript  }</body></html>`;
  const previewHtml = `<!DOCTYPE html><html><head>${headHtml}</head><body id="${encode(
    bodyId,
  )}" class="mce-content-body ${encode(
    bodyClass,
  )}" ${dirAttr}>${editor.getContent()}</body></html>`;

  return previewHtml;
};
