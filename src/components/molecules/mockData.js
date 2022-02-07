import * as React from 'react';
import { SvgXml } from "react-native-svg"
import svgs from '../../assets/svgs';

const SVG=svgs.otp();


// Generate an arbitrary number of items in mock data
const generateMockData = elementCount => {
    const _calc = (data, count) => {
        const newCount = count + 1
        const sv=SVG;
        const newData = data.concat({
            id: count,
            value: count,
            key: count,
            // customComponent: <SvgXml xml={sv} height={40} width={40} />
        })

        if (count < elementCount) {
            return _calc(newData, newCount)
        } else {
            return newData
        }
    }

    return _calc([], 0)
}

export const mockData = generateMockData(40)