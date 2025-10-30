import { Internationalization } from "@syncfusion/ej2-base";
import { get } from "http";

export function getDateString(
    value: Date,
    type: string, // e.g., "dateTime", "date", "time"
    skeleton: string // e.g.,"short", "full", "yMd", "yMMMd", "yMMMMd", "yMdHm", "hm" etc.
): string {
    const instance = new Internationalization();
    return instance.formatDate(new Date(value), {
        type: type,
        skeleton: skeleton,
    });
}

export const getEventTimeRange = (data: Record<string, any>): string => {
    const startTime = new Date(data.StartTime);
    const endTime = new Date(data.EndTime);

    if (endTime < startTime) return "";
    const startHour = getDateString(startTime, "time", "short");
    const endHour = getDateString(endTime, "time", "short");

    const startDate = getDateString(startTime, "date", "long");
    let endDate = getDateString(endTime, "date", "long");
    if (data.IsAllDay) {
        // Adjust end date to be inclusive for all-day events
        endTime.setDate(endTime.getDate() - 1);
        endDate = getDateString(endTime, "date", "long");
        if (endTime < startTime) return "";

        if (
            startTime.getFullYear() === endTime.getFullYear() &&
            startTime.getMonth() === endTime.getMonth() &&
            startTime.getDate() === endTime.getDate()
        )
            return `${startDate} (All day)`;
        return `${startDate} (All day) - ${endDate} (All day)`;
    } else {
        if (startDate === endDate)
            return `${startDate} (${startHour} - ${endHour})`;
        return `${startDate} (${startHour}) - ${endDate} (${endHour})`;
    }
};

export const filterByCategoryName = (
    data: Record<string, any>[],
    categoryName: string,
    searchTerm: string
): Record<string, any>[] => {
    return data.filter(
        (item) =>
            item[categoryName] &&
            item[categoryName]
                .toString()
                .toLowerCase()
                .trim()
                .includes(searchTerm.toLowerCase().trim())
    );
};
