import { useState } from "react";

export const useDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [resolvePromise, setResolvePromise] = useState(null);

  const openDialog = () => {
    return new Promise((resolve) => {
      setIsOpen(true);
      setResolvePromise(() => resolve);
    });
  };

  const handleConfirm = () => {
    if (resolvePromise) resolvePromise(true);
    setIsOpen(false);
  };

  const handleCancel = () => {
    if (resolvePromise) resolvePromise(false);
    setIsOpen(false);
  };

  return { isOpen, openDialog, handleConfirm, handleCancel };
};
