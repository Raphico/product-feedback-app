import { useClickOutside } from "@/hooks/use-click-outside";
import { cn } from "@/lib/utils";
import React, {
  createContext,
  use,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import IconArrowDown from "@/assets/icon-arrow-down.svg?react";
import IconCheck from "@/assets/icon-check.svg?react";
import styles from "./select.module.css";

type SelectContextType = {
  id: string;
  isOpen: boolean;
  selectedValue: string;
  setSelectedValue: React.Dispatch<React.SetStateAction<string>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  registerOption: (value: string, label: React.ReactNode) => void;
  options: Record<string, React.ReactNode>;
  offset: DOMRect | null;
};

const SelectContext = createContext<SelectContextType | null>(null);

function useSelectContext() {
  const context = use(SelectContext);

  if (!context) {
    throw new Error("This component must be used within Select component");
  }

  return context;
}

const SELECTION_KEYS = [" ", "Enter"];

interface SelectProps {
  children: React.ReactNode;
  defaultValue: string;
  onValueChange: (value: string) => void;
}

function Select({ children, defaultValue, onValueChange }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const [options, setOptions] = useState<Record<string, React.ReactNode>>({});
  const [offset, setOffset] = useState<DOMRect | null>(null);
  const id = useId();
  const selectRef = useRef<HTMLDivElement>(null);

  useClickOutside({
    ref: selectRef,
    handler: () => setIsOpen(false),
  });

  useEffect(() => {
    onValueChange(selectedValue);
  }, [selectedValue, onValueChange]);

  useEffect(() => {
    function updateOffset() {
      if (selectRef.current) {
        setOffset(selectRef.current.getBoundingClientRect());
      }
    }
    updateOffset();

    window.addEventListener("resize", updateOffset);

    return () => {
      window.removeEventListener("resize", updateOffset);
    };
  }, []);

  const registerOption = (value: string, label: React.ReactNode) => {
    setOptions((prev) => ({ ...prev, [value]: label }));
  };

  return (
    <SelectContext
      value={{
        id,
        isOpen,
        setIsOpen,
        selectedValue,
        setSelectedValue,
        registerOption,
        options,
        offset,
      }}
    >
      <div ref={selectRef}>{children}</div>
    </SelectContext>
  );
}

Select.displayName = "Select";

function SelectTrigger({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLButtonElement>) {
  const { setIsOpen, isOpen, id } = useSelectContext();
  const toggleDropdown = () => setIsOpen((prev) => !prev);

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key == "ArrowUp" || event.key == "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
    }
  }

  return (
    <button
      type="button"
      id={`${id}_trigger`}
      role="combobox"
      aria-haspopup="listbox"
      aria-controls={`${id}_listbox`}
      aria-expanded={isOpen}
      aria-autocomplete="none"
      onClick={toggleDropdown}
      onKeyDown={handleKeyDown}
      className={cn(styles["select-trigger"], className)}
      {...props}
    >
      {children}
      <SelectIcon />
    </button>
  );
}

SelectTrigger.displayName = "SelectTrigger";

function SelectIcon() {
  const { isOpen } = useSelectContext();

  return (
    <span
      data-state={isOpen ? "open" : "closed"}
      className={styles["select-icon"]}
    >
      <IconArrowDown />
    </span>
  );
}

SelectIcon.displayName = "SelectIcon";

function SelectValue({ className }: React.HTMLAttributes<HTMLSpanElement>) {
  const { selectedValue, options } = useSelectContext();
  const selectedLabel = options[selectedValue];

  return (
    <span className={cn(styles["select-value"], className)}>
      {selectedLabel}
    </span>
  );
}

SelectValue.displayName = "SelectValue";

interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  sideOffset?: number;
}

function SelectContent({
  children,
  className,
  sideOffset,
  ...props
}: SelectContentProps) {
  const { id, isOpen, setIsOpen, offset } = useSelectContext();
  const listboxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && listboxRef.current) {
      const selectedItem = listboxRef.current.querySelector(
        "[data-state='checked']",
      ) as HTMLElement;
      if (selectedItem) {
        selectedItem.focus();
      } else {
        const firstOption = listboxRef.current.querySelector(
          "[role='option']",
        ) as HTMLElement;
        firstOption?.focus();
      }
    }
  }, [isOpen]);

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (!listboxRef.current) return;

    const items = Array.from(
      listboxRef.current.querySelectorAll("[role='option']"),
    ) as HTMLElement[];
    if (items.length == 0) return;

    const currentIndex = items.indexOf(document.activeElement as HTMLElement);

    if (event.key == "ArrowDown") {
      event.preventDefault();
      // If no item is focused or at the end, loop to the first item.
      const nextIndex =
        currentIndex == -1 || currentIndex == items.length - 1
          ? 0
          : currentIndex + 1;
      items[nextIndex].focus();
    } else if (event.key == "ArrowUp") {
      event.preventDefault();
      // If first item is focused, loop to the last item.
      const nextIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
      items[nextIndex].focus();
    } else if (event.key == "Escape") {
      event.preventDefault();
      setIsOpen(false);
      // Return focus to the trigger button.
      const trigger = document.getElementById(`${id}_trigger`);
      trigger?.focus();
    } else if (event.key == "Home") {
      event.preventDefault();
      items[0].focus();
    } else if (event.key == "End") {
      event.preventDefault();
      items[items.length - 1].focus();
    }
  }

  const style = offset
    ? {
        top: offset.top + offset.height + (sideOffset ?? 20),
        left: offset.left,
      }
    : {};

  return createPortal(
    <div
      id={`${id}_listbox`}
      role="listbox"
      data-state={isOpen ? "open" : "closed"}
      style={style}
      className={cn(styles["select-content"], className)}
      ref={listboxRef}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </div>,
    document.getElementById("portal")!,
  );
}

SelectContent.displayName = "SelectContent";

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

function SelectItem({ children, className, value, ...props }: SelectItemProps) {
  const { setSelectedValue, setIsOpen, selectedValue, registerOption } =
    useSelectContext();

  const isSelected = selectedValue === value;

  useEffect(() => {
    if (children) {
      registerOption(value, children);
    }
  }, [value, children, registerOption]);

  function handleSelect() {
    setSelectedValue(value);
    setIsOpen(false);
  }

  return (
    <div
      role="option"
      aria-selected={isSelected}
      data-state={isSelected ? "checked" : "unchecked"}
      className={cn(styles["select-item"], className)}
      onMouseDown={handleSelect}
      onTouchStart={handleSelect}
      onPointerDown={handleSelect}
      onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
        if (SELECTION_KEYS.includes(event.key)) {
          handleSelect();
        }
      }}
      {...props}
      tabIndex={-1}
    >
      {children}
      {isSelected && <IconCheck />}
    </div>
  );
}

SelectItem.displayName = "SelectItem";

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue };
