import React from "react";

interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      className={`block text-sm font-medium text-gray-700 mb-2 ${className || ""}`}
      ref={ref}
      {...props}
    />
  )
);
Label.displayName = "Label";

export { Label };
