import React, { useEffect, useRef } from "react";

const AuthForm = ({ title, onSubmit, children }) => {
  const formRef = useRef(null);

  useEffect(() => {
    if (formRef.current) {
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          {title}
        </h2>
        <form
          className="mt-8 space-y-6"
          onSubmit={(e) => {
            if (onSubmit) onSubmit(e);
          }}
          ref={formRef}
        >
          {React.Children.map(children, (child) => {
            if (
              child &&
              child.type === "button" &&
              child.props.type === "submit"
            ) {
              return React.cloneElement(child, {
                onClick: (e) => {
                  if (child.props.onClick) child.props.onClick(e);
                },
              });
            }
            return child;
          })}
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
