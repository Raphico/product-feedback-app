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

type SelectContextValueType = {
  id: string;
  isOpen: boolean;
  selectedValue: string;
  setSelectedValue: React.Dispatch<React.SetStateAction<string>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  registerOption: (value: string, label: React.ReactNode) => void;
  onValueChange: (value: string) => void;
  options: Record<string, React.ReactNode>;
  offset: DOMRect | null;
};

const SelectContext = createContext<SelectContextValueType | null>(null);

function useSelectContext() {
  const context = use(SelectContext);

  if (!context) {
    throw new Error("useSelectContext should be used within <Select>");
  }

  return context;
}

const SELECTION_KEYS = [" ", "Enter"];

interface ControlledSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

type SelectProps = ControlledSelectProps;

function Select({
  children,
  value,
  onValueChange,
}: React.PropsWithChildren<SelectProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);
  const [options, setOptions] = useState<Record<string, React.ReactNode>>({});
  const [offset, setOffset] = useState<DOMRect | null>(null);
  const id = useId();
  const selectRef = useRef<HTMLDivElement>(null);

  useClickOutside({
    ref: selectRef,
    handler: () => setIsOpen(false),
  });

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
        onValueChange,
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
}: React.ComponentPropsWithRef<"button">) {
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

function SelectValue({ className }: React.ComponentPropsWithRef<"span">) {
  const { selectedValue, options } = useSelectContext();
  const selectedLabel = options[selectedValue];

  return (
    <span className={cn(styles["select-value"], className)}>
      {selectedLabel}
    </span>
  );
}

SelectValue.displayName = "SelectValue";

interface SelectContentProps extends React.ComponentPropsWithRef<"div"> {
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
        top: offset.top + offset.height + (sideOffset ?? 15),
        left: offset.left,
        width: offset.width,
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

interface SelectItemProps extends React.ComponentPropsWithRef<"div"> {
  value: string;
}

function SelectItem({ children, className, value, ...props }: SelectItemProps) {
  const {
    setSelectedValue,
    setIsOpen,
    selectedValue,
    registerOption,
    id,
    onValueChange,
  } = useSelectContext();

  const isSelected = selectedValue === value;

  useEffect(() => {
    if (children) {
      registerOption(value, children);
    }
  }, [value, children, registerOption]);

  function handleSelect(
    event:
      | React.KeyboardEvent<HTMLDivElement>
      | React.PointerEvent<HTMLDivElement>,
  ) {
    setSelectedValue(value);
    onValueChange(value);
    setIsOpen(false);
    const trigger = document.getElementById(`${id}_trigger`);
    event.preventDefault();
    trigger?.focus();
  }

  return (
    <div
      role="option"
      aria-selected={isSelected}
      data-state={isSelected ? "checked" : "unchecked"}
      className={cn(styles["select-item"], className)}
      onPointerDown={handleSelect}
      onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
        if (SELECTION_KEYS.includes(event.key)) {
          handleSelect(event);
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
