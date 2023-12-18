import { ToastOptions, toast } from 'react-toastify';

const toastOption: ToastOptions = {
  position: 'top-right',
  autoClose: 1500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'dark'
};

export const createSuccessToast = (message: string) => {
  toast.success(message, toastOption);
};

export const createErrorToast = (message: string) => {
  toast.error(message, toastOption);
};
