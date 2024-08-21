import { ElMessageBox, ElMessage } from 'element-plus'

export const showMessageBox = (message, options={}) => {
  if (!message) return;
  const {
    title = '消息提示',
    okBtnText = '确定',
    showClose = true,
    isCloseHistory,
    ...otherOptions
  } = options

   
  isCloseHistory && ElMessageBox.close(); // 关闭之前的消息框
  return ElMessageBox.alert(message, title, {
    confirmButtonText: okBtnText,
    'show-close': showClose,
    ...otherOptions
  });
}

export const closeElMessageBox = () => {
  ElMessageBox.close();
}

export const showConfirmBox = (message, options) => {
  if (!message) return Promise.reject(new Error('message is required'));
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  !options && (options = {});
  const {
    title = '确认框',
    confirmBtnText = '确定',
    cancelBtnText = '取消',
    showClose = true,
    isCloseHistory,
    ...otherOptions
  } = options

  isCloseHistory && ElMessageBox.close(); // 关闭之前的消息框
  return ElMessageBox.confirm(message, title, {
    confirmButtonText: confirmBtnText,
    cancelButtonText: cancelBtnText,
    showClose: showClose,
    ...otherOptions
  });
}

export const showMsgTip = (message, options={}) => {
  const {
    showClose = true,
    type,
    ...otherOptions
  } = options;

  return ElMessage({
    showClose: showClose,
    message: message,
    type: type,
    ...otherOptions
  })
}