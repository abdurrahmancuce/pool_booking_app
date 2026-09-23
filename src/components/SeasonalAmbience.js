import React from 'react';
import {
    AcUnitOutlined,
    AirOutlined,
    EnergySavingsLeafOutlined,
    LocalFloristOutlined,
    SpaOutlined,
    WaterDropOutlined,
    WavesOutlined,
    WbSunnyOutlined,
} from '@mui/icons-material';

const iconSets = {
    Kış: [AcUnitOutlined, AcUnitOutlined, WaterDropOutlined],
    İlkbahar: [LocalFloristOutlined, SpaOutlined, WaterDropOutlined],
    Yaz: [WbSunnyOutlined, WavesOutlined, WaterDropOutlined],
    Sonbahar: [EnergySavingsLeafOutlined, AirOutlined, WaterDropOutlined],
};

const SeasonalAmbience = ({ season, month }) => {
    const icons = iconSets[season];

    return (
        <div className={`seasonal-ambience seasonal-ambience-${month}`} aria-hidden="true">
            {Array.from({ length: 16 }, (_, index) => {
                const Icon = icons[index % icons.length];
                return <span className="ambient-item" key={`${month}-${index}`}><Icon /></span>;
            })}
        </div>
    );
};

export default SeasonalAmbience;
