export const eventsData: Record<string, any>[] = [
    {
        Id: 1,
        Subject: "Developers Meeting",
        StartTime: "2018-06-01T10:00:00.000Z",
        EndTime: "2018-06-01T11:00:00.000Z",

        RecurrenceRule: "FREQ=WEEKLY;INTERVAL=1;BYDAY=MO,TU,WE,TH,FR",
        RecurrenceException: "20180606T000000Z",
        SuccursalID: 1,
        ComiteID: 1,
        PosteIDs: [1, 2],
    },
    {
        Id: 2,
        Subject: "ModOcc",
        StartTime: "2018-06-05T10:00:00.000Z",
        EndTime: "2018-06-05T11:00:00.000Z",
        RecurrenceException: undefined,
        RecurrenceID: 1,
        SuccursalID: 1,
        ComiteID: 1,
        PosteIDs: [1, 2],
    },
];
