import { ElMessageBox } from 'element-plus'

export const showMessage = (message, options, callback) => {
  if (!message) return;
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  !options && (options = {});
  const {
    title = '消息提示',
    okBtnText = '确定',
    showClose = true,
    isCloseHistory,
    ...otherOptions
  } = options

   
  isCloseHistory && ElMessageBox.close(); // 关闭之前的消息框
  ElMessageBox.alert(message, title, {
    autofocus: true,
    confirmButtonText: okBtnText,
    'show-close': showClose,
    ...otherOptions,
    callback: callback
  });
}

export const closeElMessageBox = () => {
  ElMessageBox.close();
}