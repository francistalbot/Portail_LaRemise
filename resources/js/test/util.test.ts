import { describe, it, expect } from "vitest";
import {
    filterByCategoryName,
    getDateString,
    getEventTimeRange,
} from "../util";

describe("filterByCategoryName", () => {
    const mockData = [
        { id: 1, nom: "Jean Dupont", comite: 1 },
        { id: 2, nom: "Marie Martin", comite: 2 },
        { id: 3, nom: "Pierre Durand", comite: 1 },
    ];

    it("l'item filtrer ne devrais pas être sensible à la majuscule", () => {
        const searchTerm = "jean";
        const categoryName = "nom";

        const result = filterByCategoryName(mockData, categoryName, searchTerm);

        expect(result).toHaveLength(1);
        expect(result[0].nom).toBe("Jean Dupont");
    });

    it("devrais retourner tous correspondants avec un terme vide", () => {
        const searchTerm = "";
        const categoryName = "nom";

        const result = filterByCategoryName(mockData, categoryName, searchTerm);

        expect(result).toHaveLength(3);
    });

    it("les espaces ne devraient pas affecter la recherche", () => {
        const searchTerm = "   jean ";
        const categoryName = "nom";

        const result = filterByCategoryName(mockData, categoryName, searchTerm);

        expect(result).toHaveLength(1);
        expect(result[0].nom).toBe("Jean Dupont");
    });

        it("les espaces ne devraient pas affecter la recherche", () => {
        const searchTerm = "  jean ";
        const categoryName = "invalid_Catergory_Name";

        const result = filterByCategoryName(mockData, categoryName, searchTerm);

        expect(result).toHaveLength(0);

    });


});

describe("getDateString", () => {
    const date = new Date("2023-03-15T12:00:00");

    it("formate la date avec le format dd/mm/yy", () => {
        const type = "date";
        const skeleton = "short";
        const result = getDateString(date, type, skeleton);
        expect(result).toBe("3/15/23");
    });

    it("formate la date avec le format hh:mm AM/PM", () => {
        const type = "time";
        const skeleton = "short";
        const result = getDateString(date, type, skeleton);
        expect(result).toBe("12:00 PM");
    });

    it("formate la date avec le format dd/mm/yy, hh:mm AM/PM", () => {
        const type = "dateTime";
        const skeleton = "short";
        const result = getDateString(date, type, skeleton);
        expect(result).toBe("3/15/23, 12:00 PM");
    });

    it("formate la date avec le format MM dd, yyyy, hh:mm:ss AM/PM", () => {
        const type = "dateTime";
        const skeleton = "medium";
        const result = getDateString(date, type, skeleton);
        expect(result).toBe("Mar 15, 2023, 12:00:00 PM");
    });

    //test Extreme
    it("ne formate pas la date si le skeleton n'a pas de valeur reconnu", () => {
        const type = "dateTime";
        const skeleton = "invalid_skeleton"; // Utiliser un skeleton invalide
        
        expect(() => {
            getDateString(date, type, skeleton);
        }).toThrow();
    });
});

describe("getEventTimeRange", () => {
    it("formate la plage horaire a l'intérieur d'une journée ", () => {
        const event = {
            StartTime: "2023-03-15T12:00:00",
            EndTime: "2023-03-15T14:00:00",
            IsAllDay: false,
        };
        const result = getEventTimeRange(event);
        expect(result).toBe("March 15, 2023 (12:00 PM - 2:00 PM)");
    });

    it("formate la plage horaire de plus d'une journée ", () => {
        const event = {
            StartTime: "2023-03-15T12:00:00",
            EndTime: "2023-03-17T14:00:00",
            IsAllDay: false,
        };
        const result = getEventTimeRange(event);
        expect(result).toBe(
            "March 15, 2023 (12:00 PM) - March 17, 2023 (2:00 PM)"
        );
    });
    it("formate la plage horaire d'une journée entière", () => {
        const event = {
            StartTime: "2023-03-15T12:00:00",
            EndTime: "2023-03-16T12:00:00",
            IsAllDay: true,
        };
        const result = getEventTimeRange(event);
        expect(result).toBe("March 15, 2023 (All day)");
    });

    it("formate la plage horaire de plusieurs journées entières", () => {
        const event = {
            StartTime: "2023-03-15T12:00:00",
            EndTime: "2023-03-17T12:00:00",
            IsAllDay: true,
        };
        const result = getEventTimeRange(event);
        expect(result).toBe(
            "March 15, 2023 (All day) - March 16, 2023 (All day)"
        );
    });

    //Test Extreme
    it("formate la plage horaire d'un événement qui se termine avant de commencer", () => {
        const event = {
            StartTime: "2023-03-15T12:00:00",
            EndTime: "2023-03-15T10:00:00",
            IsAllDay: false,
        };
    const result = getEventTimeRange(event);
    expect(result).toBe("");
    });


    it("formate la plage horaire d'un événement de journée entière que la date de fin est moins de 24h après le début", () => {
        const event = {
            StartTime: "2023-03-15T12:00:00",
            EndTime: "2023-03-16T11:00:00",
            IsAllDay: true, 
        };
        const result = getEventTimeRange(event);
        expect(result).toBe("");
    });

    it("ne formate pas correctement si la dates n'est pas bien formaté", () => {
        const event = {
            StartTime: "20230315T12:00:00",
            EndTime: "2023-03-17T12:00:00",
            IsAllDay: true,
        };
        const result = getEventTimeRange(event);
        expect(result).not.toBe(
            "March 15, 2023 (All day) - March 16, 2023 (All day)"
        );
    });
});
