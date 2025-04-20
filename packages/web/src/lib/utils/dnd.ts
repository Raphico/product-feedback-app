import {
  MouseSensor as LibMouseSensor,
  TouchSensor as LibTouchSensor,
  PointerSensor as LibPointerSensor,
  MouseSensorOptions,
  TouchSensorOptions,
  PointerSensorOptions,
} from "@dnd-kit/core";
import type { MouseEvent, TouchEvent, PointerEvent } from "react";

function shouldHandleEvent(event: Event): boolean {
  let el = event.target as HTMLElement | null;

  while (el) {
    if (el.dataset?.noDnd) {
      return false;
    }
    el = el.parentElement;
  }

  return true;
}

export class MouseSensor extends LibMouseSensor {
  static activators = [
    {
      eventName: "onMouseDown" as const,
      handler: (
        { nativeEvent: event }: MouseEvent,
        { onActivation }: MouseSensorOptions,
      ) => {
        if (!shouldHandleEvent(event)) {
          return false;
        }
        onActivation?.({ event });
        return true;
      },
    },
  ];
}

export class TouchSensor extends LibTouchSensor {
  static activators = [
    {
      eventName: "onTouchStart" as const,
      handler: (
        { nativeEvent: event }: TouchEvent,
        { onActivation }: TouchSensorOptions,
      ) => {
        if (!shouldHandleEvent(event)) {
          return false;
        }
        onActivation?.({ event });
        return true;
      },
    },
  ];
}

export class PointerSensor extends LibPointerSensor {
  static activators = [
    {
      eventName: "onPointerDown" as const,
      handler: (
        { nativeEvent: event }: PointerEvent,
        { onActivation }: PointerSensorOptions,
      ) => {
        if (!event.isPrimary || event.button !== 0) {
          return false;
        }
        if (!shouldHandleEvent(event)) {
          return false;
        }
        onActivation?.({ event });
        return true;
      },
    },
  ];
}
