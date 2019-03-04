import { NotificationManager} from 'react-notifications';

const createNotification = (type, message) => {
  return () => {
    switch (type) {
      case 'info':
        NotificationManager.info(message.content)
        break;
      case 'success':
        NotificationManager.success(message.content, message.title,3000)
        break;
      case 'warning':
        NotificationManager.warning(message.content, message.title,3000)
        break;
      case 'error':
        NotificationManager.error(message.content, message.title,3000)
        break;
    }
  }
}

export default createNotification;