import * as Select from "@radix-ui/react-select";
import React, { useState, useRef, useMemo } from "react";

function NumberSelector({ value, setValue, min, max }) {
    const [isOpen, setIsOpen] = useState(false);
    const options = useMemo(() => Array.from({ length: max-min + 1 }, (_, i) => min+i), [min, max]);

    const triggerRef = useRef(null);

    const handleUpdateValue = (updatedValue) => {
        setValue(updatedValue);
    }

    return (
        <Select.Root value={value} onValueChange={handleUpdateValue} open={isOpen} onOpenChange={setIsOpen}>
            <Select.Trigger className="number-select-trigger" ref={triggerRef}>
                {value}
            </Select.Trigger>

            <Select.Content className="number-select-content" position="popper">
                <Select.Viewport>
                    <div className="number-select-grid">
                        {options.map((option) =>
                            <Select.Item key={option} value={option} className="number-select-item">
                                <div className="number-item-inner">
                                    {option}
                                </div>
                            </Select.Item>
                        )}
                    </div>
                </Select.Viewport>
            </Select.Content>
        </Select.Root>
    );
}

export default NumberSelector;
