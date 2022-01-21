import { StyleConfig } from '../sal-page/page.model';

export const STYLES: StyleConfig[] = [
    {
        id: 'margin', 
        hasFourValues: true,
        hasValueWithUnit: true,
    },
    {
        id: 'padding', 
        hasFourValues: true,
        hasValueWithUnit: true,
    },
    {
        id: 'border-radius',
        hasFourValues: true, 
        hasValueWithUnit: true,
        type: 'radius'
    },
    {
        id: 'border', 
        hasFourValues: true,
        hasValueWithUnit: true,
        hasColor: true,
        hasOptions: true,
        options: ['solid', 'dotted'],
    },
    {
        id: 'background-color', 
        hasColor: true,
        type: 'oneValue',
    },
    {
        id: 'width', 
        hasValueWithUnit: true,
        type: 'oneValue'
    },
    {
        id: 'justify-self', 
        hasOptions: true,
        options: ['center', 'flex-start', 'flex-end'],
        type: 'oneValue',
    },
    {
        id: 'place-content', 
        hasOptions: true,
        options: ['center', 'flex-start', 'flex-end'],
        type: 'oneValue',
    },
    {
        id: 'overflow', 
        hasOptions: true,
        options: ['auto', 'hidden'],
        type: 'oneValue',
    },
]