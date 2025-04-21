import type { DialogApi, MessageApi, NotificationApi } from "naive-ui";

declare global {
  interface Window {
    $dialog: DialogApi;
    $message: MessageApi;
    $notification: NotificationApi;
  }
} 