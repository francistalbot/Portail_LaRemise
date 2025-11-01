// resources/js/test/mocks/syncfusion.tsx
import { vi } from "vitest";
import React from "react";

export const DropDownListComponent = vi.fn(
    ({
        dataSource = [],
        placeholder = "",
        value,
        change,
        fields = { text: "text", value: "value" },
        enabled = true,
    }: any) => {
        const React = require("react");
        return React.createElement(
            "select",
            {
                "data-testid": "dropdown",
                value: value || "",
                onChange: (e: any) => {
                    const selectedValue =
                        e.target.value === "" ? null : Number(e.target.value);
                    change && change({ value: selectedValue });
                },
                "aria-label": placeholder,
                disabled: !enabled,
            },
            [
                React.createElement(
                    "option",
                    { key: "placeholder", value: "" },
                    placeholder
                ),
                ...dataSource.map((item: any, index: number) =>
                    React.createElement(
                        "option",
                        {
                            key: index,
                            value: item[fields.value],
                        },
                        item[fields.text]
                    )
                ),
            ]
        );
    }
);
