import React from "react";

interface SelectContextType {
  value: string;
  onValueChange: (value: string) => void;
}

const SelectContext = React.createContext<SelectContextType | undefined>(
  undefined
);

interface SelectProps {
  children: React.ReactNode;
  value?: string;
  onValueChange: (value: string) => void;
  required?: boolean;
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ children, value, onValueChange, required }, ref) => (
    <SelectContext.Provider value={{ value: value || "", onValueChange }}>
      <div ref={ref} data-required={required}>
        {children}
      </div>
    </SelectContext.Provider>
  )
);
Select.displayName = "Select";

interface SelectTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => (
    <button
      type="button"
      className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className || ""}`}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
);
SelectTrigger.displayName = "SelectTrigger";

interface SelectValueProps {
  placeholder?: string;
}

const SelectValue = React.forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ placeholder }, ref) => {
    const context = React.useContext(SelectContext);
    return (
      <span
        ref={ref}
        className={context?.value ? "text-gray-900" : "text-gray-400"}
      >
        {context?.value || placeholder}
      </span>
    );
  }
);
SelectValue.displayName = "SelectValue";

interface SelectContentProps {
  children: React.ReactNode;
}

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ children }, ref) => (
    <div
      ref={ref}
      className="absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-300 bg-white shadow-md"
    >
      {children}
    </div>
  )
);
SelectContent.displayName = "SelectContent";

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ value, children }, ref) => {
    const context = React.useContext(SelectContext);
    return (
      <div
        ref={ref}
        onClick={() => context?.onValueChange(value)}
        className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
        role="option"
      >
        {children}
      </div>
    );
  }
);
SelectItem.displayName = "SelectItem";

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
