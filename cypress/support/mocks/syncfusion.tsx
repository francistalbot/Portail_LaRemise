// cypress/support/mocks/syncfusion.tsx
import React from "react";

export const DropDownListComponent = ({
    dataSource = [],
    placeholder = "",
    value,
    change,
    fields = { text: "text", value: "value" },
    enabled = true,
    floatLabelType,
}: any) => {
    return (
        <select
            data-testid="dropdown"
            value={value || ""}
            onChange={(e: any) => {
                const selectedValue =
                    e.target.value === "" ? null : Number(e.target.value);
                change && change({ value: selectedValue });
            }}
            aria-label={placeholder}
            disabled={!enabled}
            className="syncfusion-dropdown-mock"
        >
            <option key="placeholder" value="">
                {placeholder}
            </option>
            {dataSource.map((item: any, index: number) => (
                <option key={index} value={item[fields.value]}>
                    {item[fields.text]}
                </option>
            ))}
        </select>
    );
};
