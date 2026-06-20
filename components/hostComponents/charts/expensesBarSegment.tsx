"use client"

import { BarSegment, useChart } from "@chakra-ui/charts"

export type ExpensesBarSegmentDataType = {
        name: string;
        value: number;
        color: string;
}

interface ExpensesBarSegmentProps {
        data: ExpensesBarSegmentDataType[];
}

export default function ExpensesBarSegment({ data }: ExpensesBarSegmentProps ) {

        const chart = useChart({
                sort: { by: "value", direction: "desc" },
                data: data,
        })

        return (
                <div className="p-5 bg-white rounded-[10px] border border-gray-200 flex flex-col gap-4">
                        <h3 className="text-gray-800 text-sm font-semibold font-text leading-5">
                                Spending by Category
                        </h3>
                        <BarSegment.Root chart={chart}>
                                <BarSegment.Content>
                                        <BarSegment.Bar tooltip gap="0.5" />
                                </BarSegment.Content>
                                <BarSegment.Legend 
                                        fontSize={'12px'} 
                                        textTransform={'capitalize'} 
                                        showPercent 
                                />
                        </BarSegment.Root>
                </div>
        )
}
