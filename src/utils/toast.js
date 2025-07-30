import { toast } from "react-toastify";
const base = {
    position: "top-right",
    autoClose: 3500,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
};

export const notify = {
    success: (msg, opts = {}) => toast.success(msg, { ...base, ...opts }),
    error: (msg, opts = {}) => toast.error(msg, { ...base, ...opts }),
    info: (msg, opts = {}) => toast.info(msg, { ...base, ...opts }),
    warn: (msg, opts = {}) => toast.warn(msg, { ...base, ...opts }),
    once: (id, msg, kind = "info", opts = {}) => {
        if (!toast.isActive(id)) {
            const fn = { success: toast.success, error: toast.error, info: toast.info, warn: toast.warn }[kind] || toast.info;
            fn(msg, { ...base, toastId: id, ...opts });
        }
    },
};
