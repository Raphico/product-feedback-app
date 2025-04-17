import {
  createContext,
  use,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import styles from "./otp-input.module.css";
import { cn } from "@/lib/utils";
import { usePrevious } from "@/hooks/use-previous";

type OTPInputContextValueType = {
  slots: {
    char: string;
    isActive: boolean;
    hasFakeCaret: boolean;
  }[];
  isFocused: boolean;
};

const OTPInputContext = createContext<OTPInputContextValueType | null>(null);

function useOTPInputContext() {
  const context = use(OTPInputContext);

  if (!context) {
    throw new Error("useOTPInputContext should be used within <OTPInput>");
  }

  return context;
}

export const REGEXP_ONLY_DIGITS = "^\\d+$";
export const REGEXP_ONLY_CHARS = "^[a-zA-Z]+$";
export const REGEXP_ONLY_DIGITS_AND_CHARS = "^[a-zA-Z0-9]+$";

interface OTPInputProps
  extends Omit<React.ComponentProps<"input">, "onChange"> {
  value: string;
  pattern: string;
  maxLength: number;
  onChange: (value: string) => void;
  ref: React.RefObject<HTMLInputElement | null>;
}

function OTPInput({
  children,
  value,
  maxLength,
  inputMode = "numeric",
  pattern,
  ref,
  onChange,
  ...props
}: React.PropsWithChildren<OTPInputProps>) {
  const [isFocused, setIsFocused] = useState(false);
  const [mirrorSelectionStart, setMirrorSelectionStart] = useState<
    number | null
  >(null);
  const [mirrorSelectionEnd, setMirrorSelectionEnd] = useState<number | null>(
    null,
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const initialLoadRef = useRef<{
    value: string;
    onChange: (value: string) => void;
  }>({
    value,
    onChange,
  });
  const inputMetadataRef = useRef<{
    prev: [
      number | null,
      number | null,
      "forward" | "backward" | "none" | null | undefined,
    ];
  }>({
    prev: [null, null, null],
  });
  const previousValueRef = usePrevious(value);
  const regexp = new RegExp(pattern);

  useImperativeHandle(ref, () => inputRef.current!, []);
  useEffect(() => {
    const input = inputRef.current;
    const container = containerRef.current;
    if (!input || !container) {
      return;
    }

    if (initialLoadRef.current.value !== input.value) {
      initialLoadRef.current.onChange(initialLoadRef.current.value);
    }

    inputMetadataRef.current.prev = [
      input.selectionStart,
      input.selectionEnd,
      input.selectionDirection,
    ];

    function onDocumentSelectionChange() {
      if (!input || document.activeElement !== input) {
        setMirrorSelectionStart(null);
        setMirrorSelectionEnd(null);
        setIsFocused(false);
        return;
      }

      const s = input.selectionStart;
      const e = input.selectionEnd;
      const dir = input.selectionDirection;
      const value = input.value;
      const maxLength = input.maxLength;
      const prev = inputMetadataRef.current.prev;

      let start = s;
      let end = e;
      let direction = dir;

      const isSingleCaret = s === e;
      const isInserting = s === value.length && value.length < maxLength;

      if (!isInserting && isSingleCaret) {
        if (s === 0) {
          start = 0;
          end = 1;
          direction = "forward";
        } else if (s === maxLength) {
          start = maxLength - 1;
          end = maxLength;
          direction = "backward";
        } else if (value.length > 1 && maxLength > 1) {
          if (typeof s !== "number") return;

          let offset = 0;

          if (prev[0] !== null && prev[1] !== null) {
            direction = s < prev[1] ? "backward" : "forward";
            const wasPreviouslyInserting =
              prev[0] === prev[1] && prev[0] < maxLength;

            if (direction === "backward" && !wasPreviouslyInserting) {
              offset = -1;
            }
          }

          start = s + offset;
          end = s + offset + 1;
        }

        if (start !== end) {
          input.setSelectionRange(start, end, direction ?? undefined);
        }
      }

      setMirrorSelectionStart(start);
      setMirrorSelectionEnd(end);
      inputMetadataRef.current.prev = [start, end, direction];
    }
    document.addEventListener("selectionchange", onDocumentSelectionChange, {
      capture: true,
    });

    onDocumentSelectionChange();
    if (document.activeElement === input) setIsFocused(true);

    return () => {
      document.removeEventListener(
        "selectionchange",
        onDocumentSelectionChange,
        { capture: true },
      );
    };
  }, []);

  function handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newValue = event.currentTarget.value.slice(0, maxLength);
    if (newValue.length > 0 && !regexp.test(newValue)) {
      event.preventDefault(); // prevent input update
      return;
    }

    const previousValue = previousValueRef.current;

    if (previousValue && previousValue.length > newValue.length) {
      document.dispatchEvent(new Event("selectionChange"));
    }

    onChange(newValue);
  }

  function handleOnFocus() {
    if (inputRef.current) {
      const start = Math.min(inputRef.current.value.length, maxLength - 1);
      const end = inputRef.current.value.length;
      inputRef.current.setSelectionRange(start, end);
      setMirrorSelectionStart(start);
      setMirrorSelectionEnd(end);
    }

    setIsFocused(true);
  }

  function handleOnPaste(event: React.ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    if (
      !inputRef.current ||
      inputRef.current.selectionStart === null ||
      inputRef.current.selectionEnd === null ||
      !event.clipboardData
    )
      return;

    const pastedValue = event.clipboardData.getData("text/plain");
    const start = inputRef.current.selectionStart;
    const end = inputRef.current.selectionEnd;

    const isReplacing = start !== end; // indicates a selection

    const unCappedNewValue = isReplacing
      ? `${value.slice(0, start)}${pastedValue}${value.slice(end)}` // replace
      : `${value.slice(0, start)}${pastedValue}${value.slice(start)}`; // insert

    const newValue = unCappedNewValue.slice(0, maxLength);

    if (newValue.length > 0 && !regexp.test(newValue)) {
      return;
    }

    inputRef.current.value = newValue;
    onChange(newValue);

    const _start = Math.min(newValue.length, maxLength - 1);
    const _end = newValue.length;

    inputRef.current.setSelectionRange(_start, _end);
    setMirrorSelectionStart(_start);
    setMirrorSelectionEnd(_end);
  }

  const contextValue = {
    slots: Array.from({ length: maxLength }).map((_, slotIndex) => {
      const isActive =
        isFocused &&
        mirrorSelectionEnd !== null &&
        mirrorSelectionStart !== null &&
        ((mirrorSelectionStart === mirrorSelectionEnd &&
          mirrorSelectionStart === slotIndex) ||
          (slotIndex >= mirrorSelectionStart &&
            slotIndex < mirrorSelectionEnd));
      const char = value[slotIndex] ?? null;

      return {
        isActive,
        char,
        hasFakeCaret: isActive && char === null,
      };
    }),
    isFocused,
  };

  return (
    <div
      className={styles["otp__container"]}
      data-disabled={props.disabled}
      ref={containerRef}
    >
      <OTPInputContext value={contextValue}>
        {children}
        <div className={styles["otp__input-container"]}>
          <input
            autoComplete="one-time-code"
            className={styles["otp__input"]}
            maxLength={maxLength}
            pattern={pattern}
            value={value}
            onChange={handleOnChange}
            onFocus={handleOnFocus}
            onPaste={handleOnPaste}
            onBlur={(event) => {
              setIsFocused(false);
              props.onBlur?.(event);
            }}
            inputMode={inputMode}
            ref={inputRef}
            {...props}
          />
        </div>
      </OTPInputContext>
    </div>
  );
}

OTPInput.displayName = "OTPInput";

type OTPInputGroupProps = React.ComponentProps<"div">;

function OTPInputGroup({ className, ...props }: OTPInputGroupProps) {
  return (
    <div className={cn(styles["otp__input-group"], className)} {...props} />
  );
}

OTPInputGroup.displayName = "OTPInputGroup";

interface OTPInputSlotProps extends React.ComponentProps<"div"> {
  index: number;
}

function OTPInputSlot({ className, index, ...props }: OTPInputSlotProps) {
  const { slots } = useOTPInputContext();
  const { char, isActive, hasFakeCaret } = slots[index];

  return (
    <div
      data-active={isActive}
      className={cn(styles["otp__input-slot"], className)}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className={styles["otp__input-caret-container"]}>
          <div className={styles["otp__input-caret"]}></div>
        </div>
      )}
    </div>
  );
}

OTPInputSlot.displayName = "OTPInputSlot";

export { OTPInput, OTPInputSlot, OTPInputGroup };
