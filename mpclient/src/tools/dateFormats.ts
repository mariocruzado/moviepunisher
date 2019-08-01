export const dateFormat = (date:string, includeTime:boolean) => {
    const sDate = date.split('T')[0];

    if (includeTime) {
        const sTime = date.split('T')[1].replace('.000Z','');
        return `${sDate} ${sTime}`;
    } 
    return sDate;
}