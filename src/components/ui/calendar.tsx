"use client";

import * as React from "react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
} from "react-day-picker";

import { cn } from "@/lib/utils";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  formatters,
  components,
  selectedStyle = "fill",
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  selectedStyle?: "fill" | "outline";
}) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "group/calendar p-1 [--cell-size:--spacing(6)] sm:[--cell-size:--spacing(8)]",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className,
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "flex gap-4 flex-col md:flex-row relative",
          defaultClassNames.months,
        ),
        month: cn("flex flex-col w-full gap-4", defaultClassNames.month),
        nav: cn(
          "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
          defaultClassNames.nav,
        ),
        button_previous: cn(
          defaultClassNames.button_previous,
          "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none text-content-secondary dark:text-zinc-400 flex items-center justify-center rounded-md hover:bg-black/5 dark:hover:bg-zinc-700 hover:text-content dark:hover:text-gold transition-colors",
        ),
        button_next: cn(
          defaultClassNames.button_next,
          "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none text-content-secondary dark:text-zinc-400 flex items-center justify-center rounded-md hover:bg-black/5 dark:hover:bg-zinc-700 hover:text-content dark:hover:text-gold transition-colors",
        ),
        month_caption: cn(
          "flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)",
          defaultClassNames.month_caption,
        ),
        dropdowns: cn(
          "w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5",
          defaultClassNames.dropdowns,
        ),
        dropdown_root: cn(
          "relative has-focus:border-black/20 dark:has-focus:border-zinc-500 border border-black/10 dark:border-zinc-700 shadow-xs has-focus:ring-black/10 dark:has-focus:ring-zinc-600 has-focus:ring-[3px] rounded-md",
          defaultClassNames.dropdown_root,
        ),
        dropdown: cn(
          "absolute bg-white/10 inset-0 opacity-0",
          defaultClassNames.dropdown,
        ),
        caption_label: cn(
          "select-none font-medium text-content dark:text-zinc-100",
          captionLayout === "label"
            ? "text-sm"
            : "rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-white/50 [&>svg]:size-3.5",
          defaultClassNames.caption_label,
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "rounded-md flex-1 font-normal text-[0.75rem] select-none text-content-tertiary dark:text-zinc-500",
          defaultClassNames.weekday,
        ),
        week: cn("flex w-full mt-1", defaultClassNames.week),
        week_number_header: cn(
          "select-none w-(--cell-size)",
          defaultClassNames.week_number_header,
        ),
        week_number: cn(
          "text-[0.8rem] select-none text-content-quaternary dark:text-zinc-600",
          defaultClassNames.week_number,
        ),
        day: cn(
          "relative w-full h-full p-0 text-center [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none",
          props.showWeekNumber
            ? "[&:nth-child(2)[data-selected=true]_button]:rounded-l-md"
            : "[&:first-child[data-selected=true]_button]:rounded-l-md",
          defaultClassNames.day,
        ),
        range_start: cn("rounded-l-md", defaultClassNames.range_start),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn("rounded-r-md", defaultClassNames.range_end),
        today: cn(defaultClassNames.today),
        outside: cn(
          "text-content-quaternary dark:text-zinc-600",
          defaultClassNames.outside,
        ),
        disabled: cn(
          "text-content-quaternary dark:text-zinc-600 opacity-40",
          defaultClassNames.disabled,
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          );
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4", className)} {...props} />
            );
          }
          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("size-4", className)}
                {...props}
              />
            );
          }
          return (
            <ChevronDownIcon className={cn("size-4", className)} {...props} />
          );
        },
        DayButton: (dayButtonProps) => (
          <CalendarDayButton
            {...dayButtonProps}
            selectedStyle={selectedStyle}
          />
        ),
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          );
        },
        ...components,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  selectedStyle = "fill",
  ...props
}: React.ComponentProps<typeof DayButton> & {
  selectedStyle?: "fill" | "outline";
}) {
  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  const isSelected = modifiers.selected && !modifiers.range_middle;
  const isRangeMiddle = modifiers.range_middle;

  const { style: propsStyle, ...restProps } =
    props as React.ComponentProps<"button"> & {
      selectedStyle?: "fill" | "outline";
    };

  const accentStyle = isSelected
    ? selectedStyle === "outline"
      ? { outline: "2px solid rgba(201,169,110,1)", outlineOffset: "-2px" }
      : { background: "rgba(201,169,110,1)", color: "#0a0a0f" }
    : isRangeMiddle
      ? { background: "rgba(201,169,110,0.2)", color: "white" }
      : undefined;

  return (
    <button
      ref={ref}
      data-day={day.date.toISOString().split("T")[0]}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "flex aspect-square size-auto transition-shadow duration-150 w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal items-center justify-center rounded-md text-sm",
        "[&>span]:text-xs [&>span]:opacity-70",
        "data-[range-end=true]:rounded-md data-[range-start=true]:rounded-md data-[range-middle=true]:rounded-none",
        isSelected
          ? "font-bold"
          : isRangeMiddle
            ? ""
            : "text-content font-archivo font-medium dark:text-zinc-100 bg-muted dark:bg-zinc-700 border border-border-subtle dark:border-zinc-600 shadow-sm hover:ring-2 hover:ring-inset hover:ring-gold",
        className,
      )}
      style={{ ...propsStyle, ...accentStyle }}
      {...restProps}
    />
  );
}

export { Calendar, CalendarDayButton };
