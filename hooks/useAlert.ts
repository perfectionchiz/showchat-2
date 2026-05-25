import { useState } from "react";

export const useConfirm = () => {
  const [state, setState] = useState<{
    visible: boolean;
    title: string;
    message: string;
    onConfirm?: () => void | Promise<void>;
  }>({
    visible: false,
    title: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const confirm = (
    title: string,
    message: string,
    onConfirm: () => void | Promise<void>,
  ) => {
    setState({
      visible: true,
      title,
      message,
      onConfirm,
    });
  };

  const handleConfirm = async () => {
    if (!state.onConfirm) return;

    setLoading(true);
    try {
      await state.onConfirm();
      setState((s) => ({ ...s, visible: false }));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (!loading) {
      setState((s) => ({ ...s, visible: false }));
    }
  };

  return {
    confirm,
    ConfirmModalProps: {
      visible: state.visible,
      title: state.title,
      message: state.message,
      loading,
      onConfirm: handleConfirm,
      onCancel: handleCancel,
    },
  };
};
