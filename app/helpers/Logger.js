const Log = (type, msg) =>
{
    console.log('%s: %s', type, msg);
}

// const current_date_str = current_date.toLocaleDateString("en-US").split('/')[2] + '-'
    //                         + current_date.toLocaleDateString("en-US").split('/')[1] + '-'
    //                         + current_date.toLocaleDateString("en-US").split('/')[0];
    
export const formatDate = (date) => date.getFullYear() + '-'
                              + (date.getMonth()>=10 ? date.getMonth() : '0' + date.getMonth()) + '-'
                              + (date.getDate()>=10 ? date.getDate() : '0' + date.getDate());

export default Log;